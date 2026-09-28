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
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
          <div className="w-20 h-1.5 bg-red-600 dark:bg-rose-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 backdrop-blur-md bg-black/20 rounded-2xl border border-white/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-900/30 text-red-500 dark:text-rose-400 rounded-xl">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm font-medium bg-black/30 border border-white/10 text-gray-300 rounded-lg hover:border-red-500/50 hover:text-rose-400 transition-colors cursor-default"
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
