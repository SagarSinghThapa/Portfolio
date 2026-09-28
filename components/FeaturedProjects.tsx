"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";

export default function FeaturedProjects() {
  const featuredProjects = projects.slice(0, 3); // Top 3

  return (
    <section id="projects" className="py-24 relative z-10 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <div className="w-20 h-1.5 bg-red-600 dark:bg-rose-500 rounded-full" />
          </div>
          <Link
            href="/projects"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-rose-400 transition-colors"
          >
            View all projects <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
