"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ChevronRight, X, ChevronUp } from "lucide-react";

interface Milestone {
  id: string;
  label: string;
}

const MILESTONES: Milestone[] = [
  { id: "hero", label: "Intro" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function GuidedJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      
      let currentIdx = 0;
      for (let i = 0; i < MILESTONES.length; i++) {
        const el = document.getElementById(MILESTONES[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentIdx = i;
          }
        }
      }
      setActiveIndex(currentIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToMilestone = useCallback((index: number) => {
    const milestone = MILESTONES[index];
    if (!milestone) return;

    const el = document.getElementById(milestone.id);
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % MILESTONES.length;
    scrollToMilestone(nextIdx);
  };

  return (
    <aside
      className="fixed bottom-6 left-6 z-40 select-none"
      aria-label="Guided Portfolio Journey"
    >
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          <motion.button
            key="collapsed-pill"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full backdrop-blur-xl bg-black/75 border border-white/15 text-[#FAFAFA] shadow-2xl hover:border-[#67E8F9]/50 hover:bg-black/90 transition-all group focus-visible:ring-2 focus-visible:ring-[#67E8F9]"
            title="Expand Guided Journey"
            aria-label="Expand Guided Journey"
          >
            <Compass className="w-4 h-4 text-[#67E8F9] group-hover:rotate-45 transition-transform duration-300" />
            <span className="text-xs font-semibold tracking-wide">
              {activeIndex + 1}/{MILESTONES.length} · {MILESTONES[activeIndex].label}
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white transition-colors" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded-dock"
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 pl-3 sm:pl-4 pr-2 rounded-full backdrop-blur-2xl bg-black/80 border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.5)] text-white"
          >
            {/* Guide badge */}
            <div className="flex items-center gap-2 pr-1 sm:pr-2 border-r border-white/10">
              <Compass className="w-4 h-4 text-[#67E8F9] shrink-0" />
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA]">
                  Journey
                </span>
                <span className="text-xs font-semibold text-[#FAFAFA] whitespace-nowrap">
                  {MILESTONES[activeIndex].label}
                </span>
              </div>
            </div>

            {/* Stepper dots */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-1">
              {MILESTONES.map((milestone, idx) => {
                const isActive = idx === activeIndex;
                const isPast = idx < activeIndex;
                return (
                  <button
                    key={milestone.id}
                    onClick={() => scrollToMilestone(idx)}
                    className="group relative p-1 focus:outline-none"
                    aria-label={`Jump to ${milestone.label}`}
                    title={milestone.label}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-6 sm:w-7 h-2 bg-gradient-to-r from-[#67E8F9] to-[#F472B6] shadow-[0_0_10px_rgba(103,232,249,0.6)]"
                          : isPast
                          ? "w-2 h-2 bg-white/60 hover:bg-white"
                          : "w-2 h-2 bg-white/20 hover:bg-white/50"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Next Milestone Action */}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#67E8F9]/20 to-[#F472B6]/20 hover:from-[#67E8F9]/35 hover:to-[#F472B6]/35 border border-white/15 text-xs font-semibold text-[#FAFAFA] transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Next Section"
              aria-label="Next Section"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#67E8F9]" />
            </button>

            {/* Minimize button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-full text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              title="Minimize Journey"
              aria-label="Minimize Journey"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
