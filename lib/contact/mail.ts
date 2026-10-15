import "server-only";
import nodemailer from "gmail-smtp";
import { site } from "@/data/site";
import { contactContent as copy } from "@/data/contact";
import { ChatError } from "@/lib/chat/http";
import type { ContactFields } from "./schema";

export function gmailPassword(): string {
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!password) throw new ChatError(503, copy.errors.unavailable);
  return password;
}

export async function deliverContact(
  fields: ContactFields,
  password: string,
): Promise<void> {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: site.email, pass: password },
    tls: {
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
      servername: "smtp.gmail.com",
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  });
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      transport.sendMail({
        from: { name: site.brand, address: site.email },
        to: site.email,
        replyTo: fields.email,
        subject: `${site.brand} enquiry from ${fields.name}`,
        text: `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`,
        disableFileAccess: true,
        disableUrlAccess: true,
      }),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Mail timeout")), 15000);
      }),
    ]);
    if (
      !result.accepted?.some(
        (address) => String(address).toLowerCase() === site.email.toLowerCase(),
      ) ||
      result.rejected?.length
    )
      throw new Error("Mail not accepted");
  } catch {
    throw new ChatError(502, copy.failure);
  } finally {
    clearTimeout(timeout);
    transport.close();
  }
}
