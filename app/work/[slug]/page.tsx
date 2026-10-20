import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjects, getIdentity } from "@/lib/content-loader";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.id === slug);
  return project
    ? {
        title: `${project.title} — Project notes | Elvora`,
        description: project.description,
        alternates: { canonical: `/work/${slug}` },
      }
    : { title: "Project not found", robots: { index: false, follow: false } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [projects, identity] = await Promise.all([
    getProjects(),
    getIdentity(),
  ]);
  const project = projects.find((item) => item.id === slug);
  if (!project) notFound();
  return (
    <>
      <Navbar identity={identity} rootLinks />
      <main id="main-content" className="container agency-detail">
        <Link href="/websites" className="eyebrow">
          ELVORA / SELECTED WORK
        </Link>
        <header className="agency-detail-hero">
          <p className="eyebrow">PROJECT NOTES / {project.industry}</p>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          {project.demoUrl && (
            <Link href={project.demoUrl} className="button button-gold">
              Explore the website
            </Link>
          )}
        </header>
        <div className="agency-case-hero">
          <Image
            src={project.screenshots[0].src}
            alt={project.screenshots[0].alt}
            fill
            priority
            sizes="(max-width: 800px) 94vw,1200px"
          />
        </div>
        <div className="agency-detail-grid">
          <section>
            <p className="eyebrow">THE DIRECTION</p>
            <h2>{project.subtitle}</h2>
            <p>{project.description}</p>
            <ul>
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <p className="eyebrow">THE IMPLEMENTATION</p>
            <h2>From design to interface.</h2>
            <p>
              Explore the implemented page, its responsive layouts and
              interaction details. Screenshots below are captures of the actual
              interface.
            </p>
            <ul>
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
        <p className="agency-detail-note">
          Concept portfolio work demonstrates design and implementation.
          Fictional brands, sample products and interface data do not represent
          commissioned client work or verified business results.
        </p>
        <div className="agency-case-images">
          {project.screenshots.slice(1).map((image) => (
            <figure key={image.src}>
              <div
                className={`agency-case-shot${image.title.toLowerCase().includes("mobile") ? " is-mobile" : ""}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width:800px) 94vw,580px"
                />
              </div>
              <figcaption>{image.title}</figcaption>
            </figure>
          ))}
        </div>
        <section className="agency-related">
          <h2>Keep exploring.</h2>
          {projects
            .filter((item) => item.id !== slug)
            .map((item) => (
              <Link href={`/work/${item.id}`} key={item.id}>
                {item.title}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
        </section>
      </main>
      <Footer brand={identity.brand} email={identity.email} />
    </>
  );
}
