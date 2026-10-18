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
    </SiteShell>
  );
}
