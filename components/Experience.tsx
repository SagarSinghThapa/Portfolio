"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const experiences = [
  {
    role: "Data Science Intern",
    company: "IBM",
    period: "Jun 2026 - Jul 2026",
    description: "Digital Advertising Analytics Project",
    highlights: [
      "Collaborated in a three-member team to build an end-to-end digital advertising analytics platform covering data preparation, ML workflows, backend APIs, dashboards, and cloud-hosted data.",
      "Developed prediction, anomaly-detection, and K-Means clustering workflows and integrated ML outputs with Google Gemini API for natural-language campaign recommendations."
    ]
  },
  {
    role: "Web Development & AI Testing Intern",
    company: "FYNTL AI, Sangrah Innovation Pvt. Ltd.",
    period: "Jun 2025 - Aug 2025",
    description: "",
    highlights: [
      "Tested AI-powered analytics APIs using structured Postman scenarios to validate accuracy, reliability, edge cases, and system behavior.",
      "Built responsive React.js and Tailwind CSS interfaces and debugged frontend/backend integration issues."
    ]
  },
  {
    role: "Data Analytics Intern",
    company: "IMPART (NGO)",
    period: "Jun 2024 - Aug 2024",
    description: "",
    highlights: [
      "Cleaned and analyzed survey datasets using Python and SQL and prepared structured analytical reports for community monitoring, evaluation, and decision-making."
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative z-10 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FAFAFA]">Work Experience</h2>
          <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6] mx-auto" />
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
                <div className="hidden md:flex flex-col items-end pt-1">
                  <span className="text-sm font-semibold text-[#A1A1AA]">{exp.period}</span>
                </div>
                
                <div className="relative md:col-span-3 pb-8 md:pb-12 border-l border-white/10 md:pl-8">
                  {/* Timeline dot */}
                  <div className="absolute top-0 -left-[5px] md:-left-[5.5px] w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#67E8F9] to-[#A78BFA] ring-4 ring-black shadow-[0_0_8px_rgba(103,232,249,0.5)]" />
                  
                  <div className="mb-1 md:hidden">
                    <span className="text-sm font-semibold text-[#67E8F9]">{exp.period}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#FAFAFA] flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#67E8F9]" />
                    {exp.role}
                  </h3>
                  
                  <h4 className="text-lg font-medium text-[#FAFAFA]/90 mb-2">
                    {exp.company}
                  </h4>
                  
                  {exp.description && (
                    <p className="text-[#A1A1AA] font-medium mb-4">{exp.description}</p>
                  )}
                  
                  <ul className="list-disc list-outside ml-5 space-y-2 text-[#D4D4D8]">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx} className="leading-relaxed">{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
