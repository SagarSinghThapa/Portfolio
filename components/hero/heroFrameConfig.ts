/**
 * Hero Frame Configuration
 * Single source of truth for frame sequence paths and scroll parameters.
 * Do NOT hardcode frame paths anywhere else in the project.
 */

/** Total number of frames in the hero sequence */
export const HERO_FRAME_COUNT = 240;

/** Scroll container height on desktop (in vh units) */
export const HERO_SCROLL_HEIGHT_VH = 600;

/** Scroll container height on mobile (in vh units) — shorter for faster scroll-through */
export const HERO_MOBILE_SCROLL_HEIGHT_VH = 400;

/** Static poster path for reduced-motion and fallback modes */
export const HERO_POSTER_PATH = "/hero/ezgif-frame-001.jpg";

/**
 * Generate zero-padded frame paths.
 * Pattern: /hero/ezgif-frame-001.jpg → /hero/ezgif-frame-240.jpg
 */
export const HERO_FRAME_PATHS: string[] = Array.from(
  { length: HERO_FRAME_COUNT },
  (_, i) => `/hero/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);
