import type { ReactNode } from "react";
import { PageShaderBackground } from "./page-shader-background";
import { shaderPages, type ShaderPage } from "@/lib/page-shader-preset";
import { getIdentity } from "@/lib/content-loader";
import type { PortfolioPage } from "@/data/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { PageTabs } from "./page-tabs";
import { ScrollProgress } from "./scroll-progress";
import { EditorialEffects } from "./editorial-effects";
import { ScrollAmbience } from "./scroll-ambience";
import { ReadingEffects } from "./reading-effects";

export async function SiteShell({
  children,
  page,
}: {
  children: ReactNode;
  page?: PortfolioPage;
}) {
  const identity = await getIdentity();
  const shaderPage =
    page && (shaderPages as readonly string[]).includes(page)
      ? (page as ShaderPage)
      : undefined;
  return (
    <div
      id="top"
      data-shader-page={shaderPage}
      className={`portfolio-shell${page ? ` route-page route-${page}` : " route-home"}`}
    >
      <ScrollProgress />
      <EditorialEffects />
      <ScrollAmbience />
      <ReadingEffects />
      <Navbar identity={identity} />
      {page && <PageTabs page={page} />}
      <main id="main-content">
        {shaderPage && <PageShaderBackground page={shaderPage} />}
        {children}
      </main>
      <Footer brand={identity.brand} email={identity.email} />
    </div>
  );
}
