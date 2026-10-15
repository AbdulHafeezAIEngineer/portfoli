import { BackToTop } from "@/components/back-to-top";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Work } from "@/components/work";
import { getProjects } from "@/data/projects";
import { getBots } from "@/data/bots";

export default async function Home() {
  const projects = await getProjects();
  return (
    <div id="top">
      <div className="ambient-background" aria-hidden="true"><span /><span /></div>
      <Navbar />
      <main id="main-content"><Hero /><Work projects={projects} bots={getBots()} /><Footer /></main>
      <BackToTop />
    </div>
  );
}
