"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col justify-between backdrop-blur-xl bg-black/30 border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-black/45 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(103,232,249,0.1)] transition-all duration-300 motion-safe:hover:-translate-y-1"
    >
      <div className="p-8">
        <div className="flex gap-2 flex-wrap mb-6">
          {project.categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-[#A78BFA] rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-[#FAFAFA] group-hover:text-[#67E8F9] transition-colors">
          {project.title}
        </h3>
        
        <p className="text-[#D4D4D8] leading-relaxed mb-6">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="text-sm text-[#A1A1AA] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#67E8F9]/70 rounded-full" />
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-sm text-[#A1A1AA] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#A78BFA]/70 rounded-full" />
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="p-8 pt-0 mt-auto flex items-center justify-between">
        <Link 
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 font-medium text-[#FAFAFA] hover:text-[#67E8F9] transition-colors"
        >
          View Case Study <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <div className="flex items-center gap-4 text-[#A1A1AA]">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub Repository">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Live Demo">
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
