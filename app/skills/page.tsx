import { Skills } from "@/components/skills";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getSkills } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("skills");

export default async function Page() {
  const skills = await getSkills();
  return (
    <SiteShell page="skills">
      <Skills skills={skills} />
    </SiteShell>
  );
}
