import "server-only";
import { db } from "./db";
import type { ContactFields } from "./contact/schema";
export async function recordContact(
  fields: ContactFields,
): Promise<string | null> {
  if (process.env.CONTENT_SOURCE !== "database") return null;
  const record = await db.contactMessage.create({
    data: { name: fields.name, email: fields.email, message: fields.message },
  });
  return record.id;
}
export async function markDelivery(
  id: string | null,
  status: "accepted" | "failed",
) {
  if (id)
    await db.contactMessage.update({
      where: { id },
      data: { deliveryStatus: status },
    });
}
export async function recordChat(
  botId: string,
  userMessage: string,
  reply: string,
) {
  const settings = await db.siteSettings.findUnique({
    where: { id: "main" },
    select: { chatLogging: true },
  });
  if (settings?.chatLogging)
    await db.chatLog.create({ data: { botId, userMessage, reply } });
}
