"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function Education() {
  return (
    <section id="education" className="py-24 relative z-10 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Education</h2>
          <div className="w-20 h-1.5 bg-red-600 dark:bg-rose-500 mx-auto rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-md bg-black/20 border border-white/5 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
            <GraduationCap className="w-48 h-48" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 text-red-500 dark:text-rose-400" />
              <h3 className="text-2xl font-bold">Bachelor of Technology</h3>
            </div>
            
            <h4 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
              Computer Science and Engineering
            </h4>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-gray-600 dark:text-gray-400 mb-6">
              <p className="font-semibold">University of Petroleum and Energy Studies (UPES)</p>
              <p className="font-medium bg-red-900/30 text-red-500 dark:text-rose-400 px-3 py-1 rounded-full text-sm inline-block w-max mt-2 sm:mt-0">
                Expected Graduation: 2027
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">Specialization:</p>
                <p className="text-gray-600 dark:text-gray-400">Data Science</p>
              </div>
              
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-2">Relevant Coursework:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Machine Learning", 
                    "Data Science", 
                    "Database Management Systems", 
                    "Object-Oriented Programming", 
                    "Data Structures and Algorithms", 
                    "Computer Networks"
                  ].map((course) => (
                    <span 
                      key={course} 
                      className="px-3 py-1 bg-black/30 border border-white/10 text-gray-300 rounded-lg text-sm font-medium"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
