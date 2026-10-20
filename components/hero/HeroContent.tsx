"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface HeroContentProps {
  /** Scroll progress from 0 to 1 — used for parallax and opacity effects */
  scrollProgress?: number;
  /** When true, disables all animations (reduced motion) */
  reducedMotion?: boolean;
}

const TECH_PILLS = ["Python", "PyTorch", "Next.js", "FastAPI"];

/**
 * Hero HTML content layer — glassmorphic card with role label, animated headline,
 * description, CTA buttons, tech chips, and social links.
 * Positioned above the canvas frame animation (z-20/z-30).
 */
export default function HeroContent({
  scrollProgress = 0,
  reducedMotion = false,
}: HeroContentProps) {
  // Parallax: content moves up slightly as user scrolls
  const parallaxY = reducedMotion ? 0 : scrollProgress * -50;

  // Opacity: content fades out as user scrolls (fully visible until ~60%)
  const contentOpacity = reducedMotion
    ? 1
    : Math.max(0, 1 - scrollProgress / 0.85);

  // Animation wrapper — disables framer-motion when reduced motion is on
  const MotionDiv = reducedMotion ? "div" : motion.div;

  const getMotionProps = (delay: number, y: number = 24) => {
    if (reducedMotion) return {};
    return {
      initial: { opacity: 0, y, filter: "blur(8px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: { duration: 0.8, delay, ease: "easeOut" as const },
    };
  };

  return (
    <div
      className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      style={{
        transform: `translateY(${parallaxY}px)`,
        opacity: contentOpacity,
      }}
    >
      <MotionDiv
        {...getMotionProps(0.3)}
        className="backdrop-blur-2xl bg-black/35 border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl text-left"
      >
        {/* Supertitle badge */}
        <p className="text-xs uppercase tracking-widest font-semibold text-rose-400/90 mb-3">
          PORTFOLIO · 2026
        </p>

        {/* Identity Greeting */}
        <div className="text-2xl sm:text-3xl font-extrabold text-[#FAFAFA] mb-3 flex items-center gap-2">
          <span>Hi, I&apos;m</span>
          <span className="text-transparent bg-clip-text hero-gradient-text">
            Sagar
          </span>
        </div>

        {/* Role badge */}
        <div className="mb-4">
          <span className="text-xs sm:text-sm font-bold tracking-wider uppercase inline-block text-rose-300/95 bg-rose-950/40 px-3.5 py-1.5 rounded-full border border-rose-500/20 backdrop-blur-sm">
            ML ENGINEER &amp; DEVELOPER
          </span>
        </div>

        {/* Main headline with animated gradient emphasis */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-[#FAFAFA] drop-shadow-md">
          Building{" "}
          <span className="text-transparent bg-clip-text hero-gradient-text">
            intelligent solutions
          </span>{" "}
          for{" "}
          <span className="text-transparent bg-clip-text hero-gradient-text">
            real-world problems.
          </span>
        </h1>

        {/* Paragraph text — high contrast readability */}
        <p className="text-base sm:text-lg text-[#D4D4D8] mb-8 leading-relaxed max-w-3xl drop-shadow-sm">
          I work across machine learning, AI-powered applications, and full-stack
          development to turn ideas into useful products.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Link
            href="/projects"
            className="px-7 py-3.5 bg-[#F472B6] hover:bg-[#f358a8] text-gray-950 font-semibold rounded-full flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Explore My Work
            <ArrowUpRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Get In Touch
          </Link>
        </div>

        {/* Technology tags and social links */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {TECH_PILLS.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-[#D4D4D8]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/SagarSinghThapa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/sagar1830"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-gray-300 hover:text-[#0A66C2] bg-white/5 hover:bg-white/15 border border-white/10 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
