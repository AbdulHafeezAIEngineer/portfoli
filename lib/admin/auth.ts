import "server-only";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hashSync } from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { ChatError } from "@/lib/chat/http";
import { limitLogin } from "./rate-limit";
const dummyHash = hashSync(randomBytes(32).toString("hex"), 12);
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  session: { strategy: "jwt", maxAge: 15 * 60 },
  jwt: { maxAge: 15 * 60 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  cookies: {
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-elvora.csrf-token"
          : "elvora.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-elvora.callback-url"
          : "elvora.callback-url",
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-elvora.session-token"
          : "elvora.session-token",
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
        code: { type: "text" },
      },
      async authorize(credentials, request) {
        try {
          await limitLogin(request.headers || {});
          const email = credentials?.email?.trim().toLowerCase();
          const password = credentials?.password;
          if (
            !email ||
            email.length > 254 ||
            !password ||
            Buffer.byteLength(password, "utf8") > 72
          )
            return null;
          const user = await db.adminUser.findUnique({ where: { email } });
          if (user?.lockedUntil && user.lockedUntil <= new Date()) {
            await db.adminUser.updateMany({
              where: { id: user.id, lockedUntil: { lte: new Date() } },
              data: { failedAttempts: 0, lockedUntil: null },
            });
          }
          const valid = await compare(
            password,
            user?.passwordHash || dummyHash,
          );
          if (!user || (user.lockedUntil && user.lockedUntil > new Date()))
            return null;
          let secondFactor = true;
          if (valid && user.totpSecret) {
            const { verifyTotp } = await import("./totp");
            secondFactor = await verifyTotp(user.id, credentials?.code || "");
          }
          if (!valid || !secondFactor) {
            const failed = await db.adminUser.update({
              where: { id: user.id },
              data: { failedAttempts: { increment: 1 } },
            });
            if (failed.failedAttempts >= 5)
              await db.adminUser.update({
                where: { id: user.id },
                data: { lockedUntil: new Date(Date.now() + 15 * 60000) },
              });
            await db.auditLog.create({
              data: {
                adminId: user.id,
                action:
                  failed.failedAttempts >= 5 ? "login-lockout" : "login-failed",
                resource: "security",
                recordId: user.id,
              },
            });
            return null;
          }
          await db.adminUser.update({
            where: { id: user.id },
            data: { failedAttempts: 0, lockedUntil: null },
          });
          await db.auditLog.create({
            data: {
              adminId: user.id,
              action: "login",
              resource: "security",
              recordId: user.id,
            },
          });
          return {
            id: user.id,
            email: user.email,
            passwordVersion: user.passwordVersion,
          };
        } catch (error) {
          if (error instanceof ChatError && error.status === 429)
            throw new Error("AdminRateLimited");
          console.error("admin.login.unavailable");
          throw new Error("AdminUnavailable");
        }
      },
    }),
  ],
  events: {
    async signOut({ token }) {
      if (!token?.adminId || typeof token.passwordVersion !== "number") return;
      await db.$transaction(async (tx) => {
        const result = await tx.adminUser.updateMany({
          where: {
            id: String(token.adminId),
            passwordVersion: token.passwordVersion as number,
          },
          data: { passwordVersion: { increment: 1 } },
        });
        if (result.count)
          await tx.auditLog.create({
            data: {
              adminId: String(token.adminId),
              action: "logout-revoke-sessions",
              resource: "security",
            },
          });
      });
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.adminId = user.id;
        token.passwordVersion = user.passwordVersion;
        token.authenticatedAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      session.adminId = token.adminId as string;
      session.passwordVersion = token.passwordVersion as number;
      session.authenticatedAt = token.authenticatedAt as number;
      return session;
    },
  },
  logger: {
    error(code) {
      console.error(
        "admin.auth.error",
        /^[A-Z_]+$/.test(code) ? code : "AUTH_ERROR",
      );
    },
    warn() {},
    debug() {},
  },
};
