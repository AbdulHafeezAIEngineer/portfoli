import { ShoppingBag } from "lucide-react";
import { isBusinessAssistant } from "@/data/business-assistants";

export function BotAvatar({ id }: { id: string }) {
  if (!isBusinessAssistant(id)) return null;
  return (
    <span className={`business-bot-avatar business-bot-avatar-${id}`} aria-hidden="true">
      {id === "veldt" ? <ShoppingBag size={28} strokeWidth={1.5} /> : id === "northline" ? "N" : "S"}
    </span>
  );
}
