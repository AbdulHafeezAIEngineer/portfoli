import { SiteShell } from "@/components/site-shell";
import { BotEmbedding } from "@/components/bot-services";
import { BotBuildProcess } from "@/components/bot-build-process";
import { getBots } from "@/lib/content-loader";
import { pageMetadata } from "@/lib/page-metadata";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("embedding");
export default async function Page() {
  const bots = await getBots();
  return (
    <SiteShell page="embedding">
      <header className="container field-guide-heading">
        <p className="eyebrow">IMPLEMENTATION NOTES</p>
        <h1>How the chat connects to a website.</h1>
        <p>
          Veldt, Northline and Solenne use a custom interface with a server-side
          API. Forte uses an external Botpress widget.
        </p>
      </header>
      <BotBuildProcess />
      <BotEmbedding bots={bots} />
    </SiteShell>
  );
}
