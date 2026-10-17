## types/gmail-smtp.d.ts

``````ts
declare module "gmail-smtp" {
  import nodemailer from "nodemailer";
  export default nodemailer;
}
``````

## types/next-auth.d.ts

``````ts
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
``````
