import "next-auth";
import "next-auth/jwt";
declare module "next-auth" {
  interface Session {
    adminId: string;
    passwordVersion: number;
    authenticatedAt: number;
  }
  interface User {
    passwordVersion: number;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    adminId?: string;
    passwordVersion?: number;
    authenticatedAt?: number;
  }
}
