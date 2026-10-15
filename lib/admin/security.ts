import "server-only";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import type { AdminUser } from "@prisma/client";
import { db } from "@/lib/db";
import { ChatError } from "@/lib/chat/http";
import { strongPassword } from "./password";
import { newTotpSecret, seal, unseal, matchingStep, verifyTotp } from "./totp";
const schema = z
  .object({
    operation: z.enum([
      "password",
      "totp-setup",
      "totp-confirm",
      "totp-disable",
    ]),
    currentPassword: z.string().max(128),
    newPassword: z.string().max(128).optional(),
    code: z.string().max(6).optional(),
    ticket: z.string().max(2048).optional(),
  })
  .strict();
export async function updateSecurity(user: AdminUser, body: unknown) {
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new ChatError(422, "Check your security details.");
  const data = parsed.data;
  if (!(await compare(data.currentPassword, user.passwordHash)))
    throw new ChatError(422, "Unable to verify security details.");
  if (data.operation === "password") {
    if (!data.newPassword || !strongPassword(data.newPassword))
      throw new ChatError(
        422,
        "Use 14+ characters with uppercase, lowercase, number and symbol; at most 72 UTF-8 bytes.",
      );
    if (user.totpSecret && !(await verifyTotp(user.id, data.code || "")))
      throw new ChatError(422, "Unable to verify security details.");
    await db.$transaction(async (tx) => {
      await tx.adminUser.update({
        where: { id: user.id },
        data: {
          passwordHash: await hash(data.newPassword!, 12),
          passwordVersion: { increment: 1 },
        },
      });
      await tx.auditLog.create({
        data: {
          adminId: user.id,
          action: "password-changed",
          resource: "security",
          recordId: user.id,
        },
      });
    });
    return { ok: true, signOut: true };
  }
  if (data.operation === "totp-setup") {
    if (user.totpSecret)
      throw new ChatError(422, "Two-factor authentication is already enabled.");
    const secret = newTotpSecret();
    const ticket = seal({
      purpose: "totp-setup",
      id: user.id,
      expires: Date.now() + 5 * 60000,
      secret,
    });
    return {
      ok: true,
      secret,
      ticket,
      uri: `otpauth://totp/${encodeURIComponent(`Elvora:${user.email}`)}?secret=${secret}&issuer=Elvora&algorithm=SHA1&digits=6&period=30`,
    };
  }
  if (data.operation === "totp-confirm") {
    const setup = z
      .object({
        purpose: z.literal("totp-setup"),
        id: z.string(),
        expires: z.number(),
        secret: z.string(),
      })
      .parse(unseal(data.ticket || ""));
    if (setup.id !== user.id || setup.expires < Date.now() || user.totpSecret)
      throw new ChatError(422, "Start a new authenticator setup.");
    const step = matchingStep(setup.secret, data.code || "");
    if (step === null)
      throw new ChatError(422, "Unable to verify security details.");
    await db.$transaction(async (tx) => {
      await tx.adminUser.update({
        where: { id: user.id },
        data: {
          totpSecret: seal(setup.secret),
          totpLastStep: step,
          passwordVersion: { increment: 1 },
        },
      });
      await tx.auditLog.create({
        data: {
          adminId: user.id,
          action: "totp-enabled",
          resource: "security",
          recordId: user.id,
        },
      });
    });
    return { ok: true, signOut: true };
  }
  if (!(await verifyTotp(user.id, data.code || "")))
    throw new ChatError(422, "Unable to verify security details.");
  await db.$transaction(async (tx) => {
    await tx.adminUser.update({
      where: { id: user.id },
      data: {
        totpSecret: null,
        totpLastStep: null,
        passwordVersion: { increment: 1 },
      },
    });
    await tx.auditLog.create({
      data: {
        adminId: user.id,
        action: "totp-disabled",
        resource: "security",
        recordId: user.id,
      },
    });
  });
  return { ok: true, signOut: true };
}
