"use client";

import { useSyncExternalStore } from "react";
import HeroCanvas from "./hero/HeroCanvas";
import { useFrameLoader } from "./hero/useFrameLoader";
import { useGlobalScroll } from "./useGlobalScroll";

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

function subscribeResize(callback: () => void) {
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
}

function getIsMobileSnapshot() {
  return window.innerWidth <= 768;
}

function getIsMobileServerSnapshot() {
  return false;
}

export default function GlobalCinematicBackground() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const isMobile = useSyncExternalStore(
    subscribeResize,
    getIsMobileSnapshot,
    getIsMobileServerSnapshot
  );

  const { imagesRef, totalFrames } = useFrameLoader(
    reducedMotion ? { frameStep: 240 } : { frameStep: isMobile ? 2 : 1 }
  );

  const { frameIndexRef } = useGlobalScroll(
    reducedMotion ? 0 : totalFrames
  );

  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat bg-black"
        style={{ backgroundImage: `url(/hero/ezgif-frame-001.jpg)` }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none">
      <HeroCanvas imagesRef={imagesRef} frameIndexRef={frameIndexRef} />
      
      {/* Readability overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        {/* Subtle overall dark tint to make content pop */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
    </div>
  );
}
