import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { strongPassword } from "../lib/admin/password";
async function main() {
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: [],
  });
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || !strongPassword(password))
      throw new Error("Invalid private reset settings");
    await db.$transaction(async (tx) => {
      const user = await tx.adminUser.update({
        where: { email },
        data: {
          passwordHash: await hash(password, 12),
          passwordVersion: { increment: 1 },
          failedAttempts: 0,
          lockedUntil: null,
          ...(process.env.RESET_ADMIN_2FA === "true"
            ? { totpSecret: null, totpLastStep: null }
            : {}),
        },
      });
      await tx.auditLog.create({
        data: {
          adminId: user.id,
          action: "password-reset-cli",
          resource: "security",
          recordId: user.id,
        },
      });
    });
    console.log(
      "Admin password reset. Existing sessions are invalidated on their next server check.",
    );
  } catch {
    console.error(
      "Reset failed. Check private settings and database availability. No credentials are printed.",
    );
    process.exitCode = 1;
  } finally {
    await db.$disconnect();
  }
}
main().catch(() => {
  console.error(
    "Operation failed. Check the documented environment and installation requirements.",
  );
  process.exitCode = 1;
});
