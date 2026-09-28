"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const ALL_CATEGORIES = "All";

export default function ProjectsIndex() {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

  // Extract unique categories
  const categories = [
    ALL_CATEGORIES,
    ...Array.from(new Set(projects.flatMap((p) => p.categories))),
  ];

  const filteredProjects =
    selectedCategory === ALL_CATEGORIES
      ? projects
      : projects.filter((p) => p.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            All Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive list of my work in Data Science, AI, and Web Development.
          </p>
        </motion.div>

        {/* Filter Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                layout
                key={project.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
