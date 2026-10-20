"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import HeroContent from "./HeroContent";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export default function Hero() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const handleScroll = () => {
      // Fade out the hero content over the first 100vh
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / window.innerHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        id="hero"
        className="relative w-full min-h-screen flex items-center justify-start overflow-hidden pt-20 sm:pt-24 pb-16"
        aria-label="Hero introduction"
      >
        {/* Directional scrim on desktop: ensures high text contrast on the left without darkening the centered face */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none md:w-3/5" />

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <HeroContent reducedMotion={true} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-start pt-20 sm:pt-24 pb-16"
      aria-label="Hero introduction"
    >
      {/* Directional scrim on desktop: ensures high text contrast on the left without darkening the centered face */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none md:w-3/5" />

      {/* Hero content — z-20 */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <HeroContent scrollProgress={scrollProgress} />
      </div>
    </section>
  );
}
