"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HERO_FRAME_PATHS } from "./heroFrameConfig";

interface UseFrameLoaderOptions {
  /** Load every Nth frame (1 = all, 2 = every other). Defaults to 1. */
  frameStep?: number;
}

interface UseFrameLoaderReturn {
  /** Ref to the array of loaded Image objects (null = not yet loaded / failed) */
  imagesRef: React.RefObject<(HTMLImageElement | null)[]>;
  /** Number of frames successfully loaded so far */
  loadedCount: number;
  /** True once the first batch of critical frames is loaded */
  isReady: boolean;
  /** Total number of frames being loaded (accounts for frameStep) */
  totalFrames: number;
}

/** Number of critical frames to load first (priority batch) */
const CRITICAL_BATCH_SIZE = 10;

/** Maximum concurrent image loads */
const MAX_CONCURRENCY = 4;

/**
 * Progressive hero frame preloader.
 *
 * - Loads first 10 frames immediately (critical batch)
 * - Remaining frames load with controlled concurrency (max 4)
 * - Uses requestIdleCallback for non-critical frames when available
 * - Image objects stored in a ref to avoid React re-renders
 * - Cleanup on unmount cancels pending loads and allows GC
 */
export function useFrameLoader(
  options: UseFrameLoaderOptions = {}
): UseFrameLoaderReturn {
  const { frameStep = 1 } = options;

  // Build the list of frame indices we actually want to load
  const frameIndices = useRef<number[]>([]);
  const framePaths = useRef<string[]>([]);

  // Compute once based on frameStep
  if (frameIndices.current.length === 0) {
    for (let i = 0; i < HERO_FRAME_PATHS.length; i += frameStep) {
      frameIndices.current.push(i);
      framePaths.current.push(HERO_FRAME_PATHS[i]);
    }
  }

  const totalFrames = frameIndices.current.length;

  // Image storage — ref, not state
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(HERO_FRAME_PATHS.length).fill(null)
  );

  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Track whether the component is still mounted
  const mountedRef = useRef(true);
  // Track pending Image objects for cleanup
  const pendingImagesRef = useRef<Set<HTMLImageElement>>(new Set());
  // Track if loading has been started
  const loadingStartedRef = useRef(false);

  const loadImage = useCallback(
    (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (!mountedRef.current) {
          resolve();
          return;
        }

        const path = HERO_FRAME_PATHS[index];
        const img = new Image();

        pendingImagesRef.current.add(img);

        img.onload = () => {
          if (mountedRef.current) {
            imagesRef.current[index] = img;
            pendingImagesRef.current.delete(img);
            setLoadedCount((prev) => prev + 1);
          }
          resolve();
        };

        img.onerror = () => {
          if (mountedRef.current) {
            console.warn(`[HeroFrameLoader] Failed to load frame: ${path}`);
            imagesRef.current[index] = null;
            pendingImagesRef.current.delete(img);
          }
          resolve(); // Don't reject — continue loading remaining frames
        };

        img.src = path;
      });
    },
    []
  );

  /**
   * Load a batch of frames with controlled concurrency.
   */
  const loadBatch = useCallback(
    async (indices: number[], concurrency: number) => {
      const queue = [...indices];
      const workers: Promise<void>[] = [];

      const work = async () => {
        while (queue.length > 0 && mountedRef.current) {
          const idx = queue.shift()!;
          await loadImage(idx);
        }
      };

      for (let i = 0; i < Math.min(concurrency, queue.length); i++) {
        workers.push(work());
      }

      await Promise.all(workers);
    },
    [loadImage]
  );

  useEffect(() => {
    if (loadingStartedRef.current) return;
    loadingStartedRef.current = true;
    mountedRef.current = true;

    const indicesToLoad = [...frameIndices.current];
    const criticalIndices = indicesToLoad.slice(0, CRITICAL_BATCH_SIZE);
    const remainingIndices = indicesToLoad.slice(CRITICAL_BATCH_SIZE);

    // Phase 1: Load critical frames (first 10) immediately
    loadBatch(criticalIndices, MAX_CONCURRENCY).then(() => {
      if (!mountedRef.current) return;
      setIsReady(true);

      // Phase 2: Load remaining frames via requestIdleCallback if available
      if (remainingIndices.length === 0) return;

      const scheduleRemaining = () => {
        if (typeof window.requestIdleCallback === "function") {
          window.requestIdleCallback(() => {
            if (!mountedRef.current) return;
            loadBatch(remainingIndices, MAX_CONCURRENCY);
          });
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            if (!mountedRef.current) return;
            loadBatch(remainingIndices, MAX_CONCURRENCY);
          }, 100);
        }
      };

      scheduleRemaining();
    });

    return () => {
      mountedRef.current = false;
      loadingStartedRef.current = false; // FIX: Allow effect to re-run in Strict Mode

      // Cancel pending image loads
      pendingImagesRef.current.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = "";
      });
      pendingImagesRef.current.clear();
    };
  }, [loadBatch]);

  return { imagesRef, loadedCount, isReady, totalFrames };
}
