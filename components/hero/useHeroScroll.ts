"use client";

import { useEffect, useRef } from "react";

interface UseHeroScrollReturn {
  /** Scroll progress from 0 (top) to 1 (bottom of hero scroll region) */
  progressRef: React.RefObject<number>;
  /** Current frame index, smoothed via lerp */
  frameIndexRef: React.RefObject<number>;
}

/**
 * Clamp a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Scroll-driven hero progress tracker.
 *
 * - Attaches a passive scroll listener to window
 * - Calculates scroll progress based on container position
 * - Uses lerp for smooth frame interpolation
 * - All values stored in refs — no React re-renders on scroll
 * - Uses requestAnimationFrame to batch DOM reads
 */
export function useHeroScroll(
  containerRef: React.RefObject<HTMLDivElement | null>,
  totalFrames: number
): UseHeroScrollReturn {
  const progressRef = useRef<number>(0);
  const frameIndexRef = useRef<number>(0);

  // Internal refs for lerp animation
  const targetFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current || totalFrames <= 0) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafIdRef.current = requestAnimationFrame(updateProgress);
      }
    };

    const updateProgress = () => {
      ticking = false;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = containerHeight - viewportHeight;

      if (scrollableDistance <= 0) {
        progressRef.current = 0;
        targetFrameRef.current = 0;
        return;
      }

      // rect.top is negative when scrolled past the container start
      const scrolled = -rect.top;
      const progress = clamp(scrolled / scrollableDistance, 0, 1);
      progressRef.current = progress;

      // Map progress to target frame index
      targetFrameRef.current = Math.round(progress * (totalFrames - 1));
    };

    // Lerp animation loop — runs independently of scroll events
    // Smoothly interpolates frameIndexRef toward targetFrameRef
    let lerpRafId: number;
    const LERP_FACTOR = 0.15;

    const lerpLoop = () => {
      const current = frameIndexRef.current;
      const target = targetFrameRef.current;

      if (Math.abs(target - current) > 0.5) {
        frameIndexRef.current = current + (target - current) * LERP_FACTOR;
      } else {
        frameIndexRef.current = target;
      }

      lerpRafId = requestAnimationFrame(lerpLoop);
    };

    // Start both systems
    window.addEventListener("scroll", onScroll, { passive: true });
    lerpRafId = requestAnimationFrame(lerpLoop);

    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafIdRef.current);
      cancelAnimationFrame(lerpRafId);
    };
  }, [containerRef, totalFrames]);

  return { progressRef, frameIndexRef };
}
