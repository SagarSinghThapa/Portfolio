"use client";

import { motion } from "framer-motion";
import { Code2, BrainCircuit, Globe, Database } from "lucide-react";

const skillCategories = [
  {
    title: "Programming",
    icon: <Code2 className="w-6 h-6" />,
    skills: ["Python", "Java", "C/C++", "SQL", "JavaScript", "TypeScript"],
  },
  {
    title: "Data Science & AI",
    icon: <BrainCircuit className="w-6 h-6" />,
    skills: [
      "Scikit-Learn", "PyTorch", "Transformers", "Pandas", "NumPy", 
      "Feature Engineering", "Model Evaluation", "Computer Vision", 
      "Predictive Analytics", "K-Means Clustering", "Anomaly Detection",
      "LangGraph", "RAG", "Hybrid RAG", "Embeddings", "LLM Integration", 
      "Prompt Engineering", "Google Gemini API"
    ],
  },
  {
    title: "Web Development",
    icon: <Globe className="w-6 h-6" />,
    skills: ["FastAPI", "Flask", "Next.js", "React.js", "Streamlit", "Tailwind CSS", "REST APIs"],
  },
  {
    title: "Tools & Databases",
    icon: <Database className="w-6 h-6" />,
    skills: ["MongoDB Atlas", "Git", "GitHub", "Docker", "Postman", "GeoTIFF", "Data Pipelines"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative z-10 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FAFAFA]">Technical Skills</h2>
          <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6] mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 backdrop-blur-xl bg-black/30 rounded-2xl border border-white/[0.08] shadow-sm hover:shadow-md hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/5 border border-white/10 text-[#67E8F9] rounded-xl">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#FAFAFA]">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-medium bg-black/40 border border-white/10 text-[#D4D4D8] rounded-lg hover:border-[#67E8F9]/50 hover:text-[#FAFAFA] transition-all duration-300 motion-safe:hover:-translate-y-0.5 cursor-default hover:bg-black/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
