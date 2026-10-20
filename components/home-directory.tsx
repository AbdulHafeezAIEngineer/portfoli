import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ReadingText } from "./reading-text";
import { TextReveal } from "./text-reveal";
import { VisibilityVideo } from "./VisibilityVideo";
import { HomeExplore } from "./home-explore";

export function HomeDirectory() {
  return (
    <section
      id="explore"
      className="home-directory home-overview"
      aria-labelledby="directory-title"
    >
      <div className="home-purpose home-band-light">
        <p className="eyebrow">WHAT I CAN BUILD FOR YOU</p>
        <TextReveal
          id="directory-title"
          text={"Show what you do.\nMake it easy to get in touch."}
        />
        <ReadingText text="A clear website helps people understand your business and take the next step: ask a question, request a quote or contact you. I also build AI agents that use your own product details, service information and common questions to help customers find answers. Explore the examples below to see what I can build for your business." />
      </div>
      <nav className="home-feature-grid" aria-label="Explore Elvora's work">
        <Link
          className="home-feature home-feature-websites home-band-dark"
          href="/websites"
        >
          <div className="home-feature-copy">
            <p className="eyebrow">WEBSITES</p>
            <h3>A website built for your business.</h3>
            <p>
              Custom design and development that explains your services and
              makes it easy to contact you. Explore the concept websites and see
              how I build them.
            </p>
            <span>
              Explore websites <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </div>
          <div className="home-feature-media home-website-preview">
            <VisibilityVideo
              name="home-websites"
              caption="An architectural website explored in motion."
              presentation="card"
            />
          </div>
        </Link>
        <Link
          className="home-feature home-feature-bots home-band-light"
          href="/ai-bots"
        >
          <div className="home-feature-copy">
            <p className="eyebrow">AI AGENTS</p>
            <h3>Your business. Your assistant.</h3>
            <p>
              An AI agent added to your website, using your own business
              information to answer customer questions. Try the demos and see
              how it works.
            </p>
            <span>
              Explore AI agents <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </div>
          <div className="home-feature-media home-bot-preview">
            <VisibilityVideo
              name="home-ai-bot"
              caption="A delivery question answered by a website assistant."
              presentation="card"
            />
          </div>
        </Link>
        <Link
          className="home-feature home-feature-collection home-band-purple"
          href="/bunch-of-work"
        >
          <div className="home-feature-copy">
            <p className="eyebrow">BUNCH OF WORK</p>
            <h3>Different worlds. One eye for detail.</h3>
            <p>
              A closer look at websites, dashboards and interface experiments.
              Discover the full visual collection.
            </p>
            <span>
              See the collection <ArrowUpRight size={16} aria-hidden="true" />
            </span>
          </div>
          <div className="home-feature-media home-collection-preview">
            <VisibilityVideo
              name="home-collection"
              caption="A rotating collection of website designs."
              presentation="card"
            />
          </div>
        </Link>
      </nav>
      <HomeExplore>
        <div className="container">
          <div>
            <p className="eyebrow">KEEP EXPLORING</p>
            <h2>
              The person. The perspective.{" "}
              <span className="home-more-highlight">The next idea.</span>
            </h2>
          </div>
          <nav aria-label="More about Elvora">
            {[
              {
                href: "/about",
                title: "About Me",
                text: "Meet the developer, see my work and explore the tools I use.",
              },
              {
                href: "/testimonials",
                title: "Testimonials",
                text: "Perspectives on working together, all in one place.",
              },
              {
                href: "/contact",
                title: "Let’s talk",
                text: "Need a website or a chatbot? Tell me about your business and what you need.",
              },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <h3>
                  {item.title}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </h3>
                <p>{item.text}</p>
              </Link>
            ))}
          </nav>
        </div>
      </HomeExplore>
    </section>
  );
}
