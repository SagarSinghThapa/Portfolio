"use client";

import { useEffect, useRef } from "react";

interface UseGlobalScrollReturn {
  /** Scroll progress from 0 (top) to 1 (bottom of document) */
  progressRef: React.RefObject<number>;
  /** Current frame index, smoothed via lerp */
  frameIndexRef: React.RefObject<number>;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useGlobalScroll(totalFrames: number): UseGlobalScrollReturn {
  const progressRef = useRef<number>(0);
  const frameIndexRef = useRef<number>(0);

  const targetFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    if (totalFrames <= 0) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafIdRef.current = requestAnimationFrame(updateProgress);
      }
    };

    const updateProgress = () => {
      ticking = false;

      // Calculate global scroll progress
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = scrollHeight - viewportHeight;

      if (scrollableDistance <= 0) {
        progressRef.current = 0;
        targetFrameRef.current = 0;
        return;
      }

      const scrolled = window.scrollY || document.documentElement.scrollTop;
      const progress = clamp(scrolled / scrollableDistance, 0, 1);
      progressRef.current = progress;

      targetFrameRef.current = Math.round(progress * (totalFrames - 1));
    };

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

    window.addEventListener("scroll", onScroll, { passive: true });
    // Trigger window resize also since document height might change
    window.addEventListener("resize", onScroll, { passive: true });
    
    // Also use a MutationObserver in case content loads and changes height
    const observer = new MutationObserver(() => {
      if (!ticking) {
        ticking = true;
        rafIdRef.current = requestAnimationFrame(updateProgress);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    lerpRafId = requestAnimationFrame(lerpLoop);

    updateProgress();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
      cancelAnimationFrame(rafIdRef.current);
      cancelAnimationFrame(lerpRafId);
    };
  }, [totalFrames]);

  return { progressRef, frameIndexRef };
}
