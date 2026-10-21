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
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FAFAFA]">Education</h2>
          <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6] mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="backdrop-blur-xl bg-black/30 border border-white/[0.08] rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-white/20 transition-all relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
            <GraduationCap className="w-48 h-48 text-[#A78BFA]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 text-[#A78BFA]" />
              <h3 className="text-2xl font-bold text-[#FAFAFA]">Bachelor of Technology</h3>
            </div>
            
            <h4 className="text-xl font-medium text-[#FAFAFA]/90 mb-2">
              Computer Science and Engineering
            </h4>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[#A1A1AA] mb-6">
              <p className="font-semibold text-[#D4D4D8]">University of Petroleum and Energy Studies (UPES)</p>
              <p className="font-medium bg-white/5 border border-white/10 text-[#A78BFA] px-3.5 py-1 rounded-full text-sm inline-block w-max mt-2 sm:mt-0">
                Expected Graduation: 2027
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-bold text-[#FAFAFA] mb-1">Specialization:</p>
                <p className="text-[#D4D4D8]">Data Science</p>
              </div>
              
              <div>
                <p className="font-bold text-[#FAFAFA] mb-2">Relevant Coursework:</p>
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
                      className="px-3 py-1 bg-black/40 border border-white/10 text-[#D4D4D8] rounded-lg text-sm font-medium hover:border-[#A78BFA]/40 transition-colors"
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
