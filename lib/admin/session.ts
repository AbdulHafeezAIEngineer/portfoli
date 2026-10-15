import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { db } from "@/lib/db";
import { ChatError } from "@/lib/chat/http";
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (
    !session?.adminId ||
    !session.authenticatedAt ||
    Date.now() - session.authenticatedAt > 15 * 60000
  )
    throw new ChatError(401, "Please sign in again.");
  const user = await db.adminUser.findUnique({
    where: { id: session.adminId },
  });
  if (!user || user.passwordVersion !== session.passwordVersion)
    throw new ChatError(401, "Please sign in again.");
  return user;
}
