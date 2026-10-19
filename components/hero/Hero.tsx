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
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero introduction"
      >
        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <HeroContent reducedMotion={true} />
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center" aria-label="Hero introduction">
      {/* Hero content — z-20 */}
      <div className="relative z-20 flex items-center justify-center w-full h-full">
        <HeroContent scrollProgress={scrollProgress} />
      </div>
    </section>
  );
}
