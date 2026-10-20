"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 relative z-10 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FAFAFA]">About Me</h2>
          <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group"
          >
            {/* Luxury frosted glass card */}
            <div className="absolute inset-0 backdrop-blur-xl bg-black/30 border border-white/[0.08] rounded-2xl group-hover:border-white/20 transition-all duration-700 ease-in-out" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 right-8 text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-transparent bg-clip-text hero-gradient-text mb-3">
                Philosophy
              </div>
              <p className="font-semibold text-xl text-[#FAFAFA] drop-shadow-md">
                Always learning, building, and growing.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
