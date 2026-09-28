"use client";

import { useEffect, useRef } from "react";

interface HeroCanvasProps {
  /** Ref to the array of loaded Image objects (null = not loaded) */
  imagesRef: React.RefObject<(HTMLImageElement | null)[]>;
  /** Ref to the current (lerped) frame index */
  frameIndexRef: React.RefObject<number>;
}

/**
 * Find the nearest loaded frame to the target index.
 * Scans outward in both directions from the target.
 * Returns null only if no frames are loaded at all.
 */
function findNearestLoadedFrame(
  images: (HTMLImageElement | null)[],
  targetIndex: number
): HTMLImageElement | null {
  const rounded = Math.round(targetIndex);
  const len = images.length;

  // Check target first
  if (images[rounded]) return images[rounded];

  // Scan outward in both directions
  for (let offset = 1; offset < len; offset++) {
    const before = rounded - offset;
    const after = rounded + offset;
    if (before >= 0 && images[before]) return images[before];
    if (after < len && images[after]) return images[after];
  }

  return null;
}

/**
 * Draw an image onto a canvas using cover-fill logic.
 * Preserves aspect ratio, centers the image, and fills the entire canvas.
 */
function drawCoverFill(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number
): void {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth: number;
  let drawHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (canvasRatio > imgRatio) {
    // Canvas is wider than image — fit width, crop height
    drawWidth = canvasWidth;
    drawHeight = canvasWidth / imgRatio;
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  } else {
    // Canvas is taller than image — fit height, crop width
    drawHeight = canvasHeight;
    drawWidth = canvasHeight * imgRatio;
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

/**
 * Canvas-based hero frame renderer.
 *
 * - Reads frame index from ref (no React re-renders on scroll)
 * - Uses rAF render loop, only redraws when frame changes
 * - Frame-skip fallback: finds nearest loaded frame if target isn't available
 * - Cover-fill: preserves 16:9 aspect ratio, no stretching, no letterboxing
 * - Retina support via devicePixelRatio
 * - Pointer events disabled — content layer handles all interactions
 */
export default function HeroCanvas({ imagesRef, frameIndexRef }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastRenderedFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number>(0);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    /**
     * Set canvas internal dimensions to match CSS size × devicePixelRatio.
     */
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Force a redraw after resize
      lastRenderedFrameRef.current = -1;
    };

    updateCanvasSize();

    /**
     * Main render loop — runs every animation frame.
     */
    const renderLoop = () => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      // Auto-fix internal size if CSS layout changes (e.g. hydration layout shift) without window resize
      if (
        canvas.width !== displayWidth * dpr ||
        canvas.height !== displayHeight * dpr
      ) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        lastRenderedFrameRef.current = -1; // force redraw
      }

      const currentIndex = Math.round(frameIndexRef.current);

      // Skip redraw if same frame
      if (currentIndex !== lastRenderedFrameRef.current) {
        const images = imagesRef.current;
        const img = findNearestLoadedFrame(images, currentIndex);

        // Ensure image is fully decoded before drawing
        if (img && img.naturalWidth > 0 && displayWidth > 0) {
          ctx.clearRect(0, 0, displayWidth, displayHeight);
          drawCoverFill(ctx, img, displayWidth, displayHeight);
          lastRenderedFrameRef.current = currentIndex;
        }
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    /**
     * Debounced resize handler.
     */
    const onResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(updateCanvasSize, 250);
    };

    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      clearTimeout(resizeTimeoutRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [imagesRef, frameIndexRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        pointerEvents: "none",
        maskImage:
          "radial-gradient(circle at center, black 40%, transparent 90%)",
        WebkitMaskImage:
          "radial-gradient(circle at center, black 40%, transparent 90%)",
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
