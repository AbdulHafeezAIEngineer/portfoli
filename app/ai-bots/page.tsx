import Link from "next/link";
import { BotServices } from "@/components/bot-services";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getBots } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("bots");

export default async function Page() {
  const bots = await getBots();
  return (
    <SiteShell page="bots">
      <BotServices bots={bots} />
      <div className="container field-integration-link">
        <Link href="/services/chat">What a chatbot build includes ↗</Link>
        <Link href="/ai-bots/how-i-embed-bots">
          Technical notes: website integration ↗
        </Link>
      </div>
    </SiteShell>
  );
}
