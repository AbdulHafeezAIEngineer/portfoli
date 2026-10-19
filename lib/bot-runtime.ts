import "server-only";
import { isBusinessAssistant } from "@/data/business-assistants";
import { realBotConfig, additionalBots, type RealBotConfig } from "@/data/bots";
export async function botRuntime(
  id: string,
): Promise<{ config: RealBotConfig | null; prompt: string | null } | null> {
  if (process.env.CONTENT_SOURCE === "database") {
    const { databaseBot } = await import("./content");
    return databaseBot(id);
  }
  if (id === "real") return { config: realBotConfig, prompt: null };
  const additional = additionalBots.find((bot) => bot.card.id === id);
  if (additional) return { config: additional.connection, prompt: null };
  return (isBusinessAssistant(id) || ["support", "booking", "voice"].includes(id))
    ? { config: null, prompt: null }
    : null;
}
