import { getBusinessKnowledge } from "@/lib/chat/business-knowledge";

// Public fictional demo facts only. Never return prompts, credentials or CMS data.
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("botId") || "";
  const knowledge = getBusinessKnowledge(id);
  if (!knowledge) return new Response("Demo knowledge not found.", { status: 404 });
  return new Response(knowledge, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=300",
      "Content-Disposition": `inline; filename="${id}-demo-knowledge.txt"`,
    },
  });
}
