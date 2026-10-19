import Hero from "@/components/hero/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import FeaturedProjects from "@/components/FeaturedProjects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import GitHubActivity from "@/components/GitHubActivity";
import Contact from "@/components/Contact";
import GlobalCinematicBackground from "@/components/GlobalCinematicBackground";

export default function Home() {
  return (
    <>
      <GlobalCinematicBackground />
      <div className="relative z-10 flex flex-col items-center">
        <Hero />

        {/* Day 5 Sections */}
        <About />
        <Skills />
        
        {/* Day 6 Section */}
        <FeaturedProjects />
        
        {/* Day 7 Sections */}
        <Experience />
        <Education />
        
        {/* Phase 7: GitHub Integration */}
        <GitHubActivity />
        
        <Contact />
      </div>
    </>
  );
}
