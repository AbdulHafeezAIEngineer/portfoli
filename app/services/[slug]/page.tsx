import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getServices, getIdentity } from "@/lib/content-loader";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = (await getServices()).find((item) => item.id === slug);
  if (!service)
    return {
      title: "Service not found",
      robots: { index: false, follow: false },
    };
  return {
    title: `${service.title} — Elvora`,
    description: service.description,
    alternates: { canonical: `/services/${slug}` },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [services, identity] = await Promise.all([
    getServices(),
    getIdentity(),
  ]);
  const service = services.find((item) => item.id === slug);
  if (!service) notFound();
  return (
    <>
      <Navbar identity={identity} rootLinks />
      <main id="main-content" className="container agency-detail">
        <Link className="eyebrow" href="/services">
          ELVORA / SERVICES
        </Link>
        <header className="agency-detail-hero">
          <p className="eyebrow">SCOPE / BEFORE DEVELOPMENT STARTS</p>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
          <Link href="/contact" className="button button-gold">
            Discuss your project <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </header>
        <div className="agency-detail-grid">
          <section>
            <p className="eyebrow">01 / DELIVERABLES</p>
            <h2>What is included.</h2>
            <ul>
              {service.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <p className="eyebrow">02 / GETTING STARTED</p>
            <h2>What I need from you.</h2>
            <ul>
              {service.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
        <p className="agency-detail-note">See the <Link href={slug === "chat" ? "/ai-bots" : "/websites"}>{slug === "chat" ? "Veldt and Northline chat demos" : "Kovo and Solenne website concepts"}</Link> for working examples.</p>
        <p className="agency-detail-note">
          {service.detail} Features, timing and provider costs are agreed before
          work begins.
        </p>
        <section className="agency-related">
          <h2>Other services.</h2>
          {services
            .filter((item) => item.id !== slug)
            .map((item) => (
              <Link key={item.id} href={`/services/${item.id}`}>
                {item.title}
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            ))}
        </section>
      </main>
      <Footer brand={identity.brand} email={identity.email} />
    </>
  );
}
