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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1.5 bg-red-600 dark:bg-rose-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            <p>
              I am a <strong>Computer Science undergraduate</strong> at the University of Petroleum and Energy Studies (UPES), specializing in <strong>Data Science</strong> (Expected 2028).
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
            {/* Subtle glass block until a photo is provided */}
            <div className="absolute inset-0 backdrop-blur-sm bg-red-900/10 border border-white/5 group-hover:bg-red-900/20 transition-colors duration-700 ease-in-out" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            <div className="absolute bottom-6 left-6 right-6 text-white text-center">
              <p className="font-medium text-lg">Always learning, building, and growing.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
