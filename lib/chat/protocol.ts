import { chatPolicy, type ChatMessage } from "@/data/bots";

export function buildContext(history: ChatMessage[], content: string): ChatMessage[] {
  const result: ChatMessage[] = [{ role: "user", content }];
  let size = content.length;
  for (let i = history.length - 2; i >= 0 && result.length + 2 <= chatPolicy.maxMessages; i -= 2) {
    const pair = history.slice(i, i + 2);
    const length = pair.reduce((sum, message) => sum + message.content.length, 0);
    if (size + length > chatPolicy.maxContext) break;
    result.unshift(...pair);
    size += length;
  }
  return result;
}

export function validateMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || !value.length || value.length > chatPolicy.maxMessages || value.length % 2 !== 1) return null;
  let total = 0;
  const messages: ChatMessage[] = [];
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== "object" || item.role !== (index % 2 === 0 ? "user" : "assistant") || typeof item.content !== "string") return null;
    const content = item.content.trim();
    if (!content || content.length > (item.role === "user" ? chatPolicy.maxInput : chatPolicy.maxReply)) return null;
    total += content.length;
    if (total > chatPolicy.maxContext) return null;
    messages.push({ role: item.role, content });
  }
  return messages;
}
