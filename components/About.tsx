"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, BrainCircuit, ArrowUpRight } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 relative z-10 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FAFAFA]">About Me</h2>
          <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 text-lg text-[#D4D4D8] leading-relaxed"
          >
            <p>
              I am a <strong className="text-[#FAFAFA] font-semibold">Computer Science undergraduate</strong> at the University of Petroleum and Energy Studies (UPES), specializing in <strong className="text-[#FAFAFA] font-semibold">Data Science</strong> (Expected 2027).
            </p>
            <p>
              My passion lies in bridging the gap between complex data algorithms and user-centric applications. I am highly experienced in building machine learning pipelines, working with multispectral satellite imagery, and developing state-of-the-art GenAI systems including RAG (Retrieval-Augmented Generation) and multi-agent architectures.
            </p>
            <p>
              I pride myself on deploying analytics workflows using modern Python frameworks and contemporary web technologies, ensuring that data insights are both accurate and accessible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl backdrop-blur-2xl bg-black/40 shadow-[0_0_50px_-10px_rgba(103,232,249,0.12)] p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-hidden group"
          >
            {/* Ambient soft glow background elements without visible border */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-br from-[#67E8F9]/15 to-[#A78BFA]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-gradient-to-tr from-[#F472B6]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Profile Heading & Background */}
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-rose-400/90">
                  DEVELOPER PROFILE
                </span>
                <span className="text-[11px] font-semibold text-[#A78BFA] bg-white/5 px-2.5 py-0.5 rounded-full">
                  2024 – 2027
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FAFAFA] tracking-tight">
                AI/ML Engineer &amp; Full-Stack Developer
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 font-medium">
                University of Petroleum and Energy Studies · B.Tech Data Science
              </p>
            </div>

            {/* Focus Items */}
            <div className="relative z-10 space-y-4">
              {/* Item 1: Alpine Explorer */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/5 text-[#67E8F9] shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#FAFAFA] flex items-center gap-2">
                      Alpine Explorer 2.0
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#67E8F9]/10 text-[#67E8F9]">
                        Geospatial AI
                      </span>
                    </h4>
                    <p className="text-xs text-[#D4D4D8] mt-1 leading-relaxed">
                      Multispectral satellite segmentation with PlanetScope 8-band &amp; Swin Transformer for offline travel risk decision support.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 2: Full-Stack AI & GenAI */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/5 text-[#A78BFA] shrink-0 mt-0.5">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#FAFAFA] flex items-center gap-2">
                      Agentic AI &amp; Full-Stack Systems
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#A78BFA]/10 text-[#A78BFA]">
                        GenAI
                      </span>
                    </h4>
                    <p className="text-xs text-[#D4D4D8] mt-1 leading-relaxed">
                      Multi-agent architectures with LangGraph, Hybrid RAG with vector search, and production APIs deployed with Next.js &amp; FastAPI.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Stack Row */}
            <div className="relative z-10 pt-2 border-t border-white/[0.06]">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
                {["PyTorch", "FastAPI", "LangGraph", "Next.js", "Python", "Scikit-Learn"].map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-[#D4D4D8]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Link to Projects Section */}
              <Link
                href="/#projects"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#FAFAFA] hover:text-[#67E8F9] transition-colors group/link"
              >
                <span>Explore Featured Case Studies</span>
                <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
