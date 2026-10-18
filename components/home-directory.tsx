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
        <p className="eyebrow">THE PURPOSE BEHIND ELVORA</p>
        <TextReveal
          id="directory-title"
          text={"Human ideas.\nUseful digital experiences."}
        />
        <ReadingText text="This is a place to explore what I create and how I create it: websites with their own identity, useful integrations and the thoughtful decisions behind them. AI assistants are an optional part of that work. See the work in action, follow the process, or start a conversation about your own idea." />
      </div>
      <nav className="home-feature-grid" aria-label="Explore Elvora's work">
        <Link
          className="home-feature home-feature-websites home-band-dark"
          href="/websites"
        >
          <div className="home-feature-copy">
            <p className="eyebrow">WEBSITES</p>
            <h3>Made with a point of view.</h3>
            <p>
              Original website concepts, built around an idea. Explore the
              interfaces and the creative process behind them.
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
            <p className="eyebrow">AI BOTS</p>
            <h3>A question. A useful answer.</h3>
            <p>
              Meet the assistants, try the demos, and see how I build, ground
              and embed a bot into a website.
            </p>
            <span>
              Explore AI bots <ArrowUpRight size={16} aria-hidden="true" />
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
                text: "My journey, technical foundations and the tools I work with.",
              },
              {
                href: "/testimonials",
                title: "Testimonials",
                text: "Perspectives on working together, all in one place.",
              },
              {
                href: "/contact",
                title: "Let’s talk",
                text: "Tell me what you have in mind. Let’s find a thoughtful way forward.",
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
