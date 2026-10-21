"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface HeroContentProps {
  /** Scroll progress from 0 to 1 — used for parallax and opacity effects */
  scrollProgress?: number;
  /** When true, disables all animations (reduced motion) */
  reducedMotion?: boolean;
}

const TECH_PILLS = ["Python", "PyTorch", "Next.js", "FastAPI"];

export default function HeroContent({
  scrollProgress = 0,
  reducedMotion: propReducedMotion = false,
}: HeroContentProps) {
  const systemReducedMotion = useReducedMotion();
  const isReducedMotion = propReducedMotion || Boolean(systemReducedMotion);

  // Mount-synchronized animation trigger:
  // Elements start hidden via CSS `.hero-entrance-item`.
  // After client hydration, we wait one animation frame to guarantee the browser
  // has painted the hidden state, then add `.hero-mounted` to trigger the cascade.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const animTimeParam = searchParams.get("anim_time");
    const reducedMotionParam = searchParams.get("reduced_motion");

    if (reducedMotionParam === "1" || reducedMotionParam === "true") {
      const id = requestAnimationFrame(() => setIsMounted(true));
      return () => cancelAnimationFrame(id);
    }

    // Double-rAF: first rAF queues after the current frame's paint,
    // second rAF fires before the next frame's paint — guaranteeing
    // the hidden state was composited to screen before animation starts.
    const id = requestAnimationFrame(() => {
      if (isReducedMotion) {
        setIsMounted(true);
      } else {
        requestAnimationFrame(() => {
          setIsMounted(true);
          if (animTimeParam !== null) {
            const targetMs = parseFloat(animTimeParam);
            // Seek and pause entrance animations at exact target time
            requestAnimationFrame(() => {
              const items = document.querySelectorAll(".hero-entrance-item");
              items.forEach((el) => {
                el.getAnimations().forEach((a) => {
                  if (typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation && a.animationName === "hero-fade-up") {
                    a.pause();
                    a.currentTime = targetMs;
                  }
                });
              });
            });
          }
        });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [isReducedMotion]);

  // Parallax: content moves up slightly as user scrolls
  const parallaxY = isReducedMotion ? 0 : scrollProgress * -50;

  // Opacity: content fades out as user scrolls (fully visible until ~60%)
  const contentOpacity = isReducedMotion
    ? 1
    : Math.max(0, 1 - scrollProgress / 0.85);

  // Animation class: hidden by default, animated once mounted
  const entrance = isReducedMotion ? "" : "hero-entrance-item";
  const mountedClass = isMounted ? "hero-mounted" : "";

  return (
    <div
      className={`relative z-20 w-full max-w-md lg:max-w-[460px] xl:max-w-[480px] text-left ${mountedClass}`}
      style={{
        transform: `translateY(${parallaxY}px)`,
        opacity: contentOpacity,
      }}
    >
      <div className="p-6 sm:p-8 lg:p-0 rounded-2xl bg-black/40 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none shadow-xl lg:shadow-none text-left">
        {/* Top Header Row with Portfolio Date & Role */}
        <div className="flex items-center justify-between gap-4 mb-3 max-w-[420px]">
          {/* Step 1: Portfolio Eyebrow Label (150ms) */}
          <p
            className={`text-xs uppercase tracking-widest font-semibold text-rose-400/90 ${entrance}`}
            style={!isReducedMotion ? { animationDelay: "150ms" } : undefined}
          >
            PORTFOLIO · 2026
          </p>

          {/* Step 3: Role Label (390ms) */}
          <span
            className={`text-[11px] font-bold tracking-wider uppercase text-rose-300/90 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/20 backdrop-blur-sm ${entrance}`}
            style={!isReducedMotion ? { animationDelay: "390ms" } : undefined}
          >
            ML ENGINEER
          </span>
        </div>

        {/* Step 2: Identity Greeting (270ms) */}
        <h2
          className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FAFAFA] tracking-tight mb-2 ${entrance}`}
          style={!isReducedMotion ? { animationDelay: "270ms" } : undefined}
        >
          Hi, I&apos;m{" "}
          <span className="text-transparent bg-clip-text hero-gradient-text inline-block descender-safe">
            Sagar.
          </span>
        </h2>

        {/* Step 4: Headline with phrase-level reveal & animated gradient (510ms / 630ms) */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight mb-4 leading-snug text-[#FAFAFA]">
          {/* Outer span handles CSS entrance; inner span handles continuous gradient color cycle */}
          <span
            className={`inline-block ${entrance} descender-safe mr-1.5`}
            style={!isReducedMotion ? { animationDelay: "510ms" } : undefined}
          >
            <span className="inline-block text-transparent bg-clip-text hero-gradient-text">
              Building intelligent solutions
            </span>
          </span>
          <span
            className={`inline-block ${entrance} descender-safe`}
            style={!isReducedMotion ? { animationDelay: "630ms" } : undefined}
          >
            for real-world problems.
          </span>
        </h1>

        {/* Step 5: Paragraph text — high contrast readability (750ms) */}
        <p
          className={`text-sm text-[#D4D4D8] mb-6 leading-relaxed max-w-md drop-shadow-sm ${entrance}`}
          style={!isReducedMotion ? { animationDelay: "750ms" } : undefined}
        >
          I work across machine learning, AI-powered applications, and full-stack
          development to turn ideas into useful products.
        </p>

        {/* Step 6: CTA Buttons (870ms) */}
        <div
          className={`flex flex-wrap items-center gap-3.5 mb-6 ${entrance}`}
          style={!isReducedMotion ? { animationDelay: "870ms" } : undefined}
        >
          <Link
            href="/projects"
            className="px-6 py-3 bg-[#F472B6] hover:bg-[#f358a8] text-gray-950 font-semibold rounded-full flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent text-sm"
          >
            Explore Projects
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-full font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent text-sm"
          >
            Contact Me
          </Link>
        </div>

        {/* Step 7: Technology tags and social links (990ms) */}
        <div
          className={`pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 max-w-lg ${entrance}`}
          style={!isReducedMotion ? { animationDelay: "990ms" } : undefined}
        >
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {TECH_PILLS.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-[#D4D4D8]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/SagarSinghThapa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/sagar1830"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-300 hover:text-[#0A66C2] bg-white/5 hover:bg-white/15 border border-white/10 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
