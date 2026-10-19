import type { ReactNode } from "react";
import { getIdentity } from "@/lib/content-loader";
import type { PortfolioPage } from "@/data/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { PageTabs } from "./page-tabs";

export async function SiteShell({
  children,
  page,
}: {
  children: ReactNode;
  page?: PortfolioPage;
}) {
  const identity = await getIdentity();
  return (
    <div
      id="top"
      className={`portfolio-shell field-site${page ? ` route-page route-${page}` : " route-home"}`}
    >
      <Navbar identity={identity} />
      {page && <PageTabs page={page} />}
      <main id="main-content">{children}</main>
      <Footer brand={identity.brand} email={identity.email} />
    </div>
  );
}
