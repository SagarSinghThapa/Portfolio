"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import HeroCanvas from "./HeroCanvas";
import HeroContent from "./HeroContent";
import { useFrameLoader } from "./useFrameLoader";
import { useHeroScroll } from "./useHeroScroll";
import {
  HERO_SCROLL_HEIGHT_VH,
  HERO_MOBILE_SCROLL_HEIGHT_VH,
  HERO_POSTER_PATH,
} from "./heroFrameConfig";

/** Timeout (ms) before activating fallback if zero frames loaded */
const FALLBACK_TIMEOUT_MS = 10000;

/** Scroll progress threshold step for state updates (0.05 = 20 updates max) */
const PROGRESS_UPDATE_THRESHOLD = 0.05;

/**
 * Cinematic scroll-driven Hero composition.
 *
 * Architecture:
 *   <scroll container (300vh / 200vh)>
 *     <sticky viewport (100vh)>
 *       <HeroCanvas />          z-0  pointer-events-none
 *       <readability overlay />  z-10 pointer-events-none
 *       <HeroContent />         z-20 interactive content
 *       <scroll indicator />    z-20 fades on scroll
 *     </sticky>
 *   </scroll container>
 *
 * Hooks:
 *   useFrameLoader() → imagesRef, loadedCount, isReady, totalFrames
 *   useHeroScroll(containerRef, totalFrames) → progressRef, frameIndexRef
 *
 * Props flow:
 *   Hero → HeroCanvas: imagesRef, frameIndexRef
 *   Hero → HeroContent: scrollProgress, reducedMotion
 */
export default function Hero() {
  // ── Refs ──
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Reduced motion detection ──
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Mobile detection (viewport width) ──
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    const onResize = () => check();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Frame loading ──
  const { imagesRef, loadedCount, isReady, totalFrames } = useFrameLoader(
    reducedMotion ? { frameStep: 240 } : { frameStep: isMobile ? 2 : 1 }
  );

  // ── Scroll tracking ──
  const { progressRef, frameIndexRef } = useHeroScroll(
    containerRef,
    reducedMotion ? 0 : totalFrames
  );

  // ── Scroll progress as state (throttled for content effects) ──
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastProgressUpdateRef = useRef(0);

  const updateScrollProgress = useCallback(() => {
    if (reducedMotion) return;
    const current = progressRef.current;
    if (
      Math.abs(current - lastProgressUpdateRef.current) >=
      PROGRESS_UPDATE_THRESHOLD
    ) {
      lastProgressUpdateRef.current = current;
      setScrollProgress(current);
    }
    requestAnimationFrame(updateScrollProgress);
  }, [progressRef, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const rafId = requestAnimationFrame(updateScrollProgress);
    return () => cancelAnimationFrame(rafId);
  }, [updateScrollProgress, reducedMotion]);

  // ── Fallback mode: if ALL frames fail after timeout ──
  const [fallbackMode, setFallbackMode] = useState(false);
  const loadedCountRef = useRef(0);
  loadedCountRef.current = loadedCount;

  useEffect(() => {
    if (reducedMotion) return; // reduced motion has its own fallback

    const timer = setTimeout(() => {
      if (loadedCountRef.current === 0) {
        console.warn(
          "[Hero] Frame sequence failed to load — using fallback mode"
        );
        setFallbackMode(true);
      }
    }, FALLBACK_TIMEOUT_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]); // Only run once on mount (+ reducedMotion changes)

  // ── Scroll container height ──
  const scrollHeight = isMobile
    ? HERO_MOBILE_SCROLL_HEIGHT_VH
    : HERO_SCROLL_HEIGHT_VH;

  // ── Reduced motion: simple full-screen Hero with static poster ──
  if (reducedMotion) {
    return (
      <section
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero introduction"
      >
        {/* Static poster background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_POSTER_PATH})` }}
        />
        {/* Readability overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </div>
        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <HeroContent reducedMotion={true} />
        </div>
      </section>
    );
  }

  // ── Fallback mode: no canvas, gradient background ──
  if (fallbackMode) {
    return (
      <section
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-950 via-gray-900 to-black"
        aria-label="Hero introduction"
      >
        {/* Readability overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        {/* Content */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <HeroContent reducedMotion={false} />
        </div>
      </section>
    );
  }

  // ── Full cinematic experience ──
  return (
    <section className="w-full relative" aria-label="Hero introduction">
      <div ref={containerRef} className="w-full" style={{ height: `${scrollHeight}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Canvas frame renderer — z-0 */}
          <HeroCanvas imagesRef={imagesRef} frameIndexRef={frameIndexRef} />

          {/* Readability overlay — z-10, pointer-events-none */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Bottom gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            {/* Vignette for edge darkening */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)",
              }}
            />
            {/* Subtle overall tint */}
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Hero content — z-20 */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <HeroContent scrollProgress={scrollProgress} />
          </div>

          {/* Scroll indicator — z-20, bottom */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/60"
            style={{
              opacity: Math.max(0, 1 - scrollProgress / 0.1),
              pointerEvents: "none",
            }}
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5 animate-hero-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
