---
phase: 1
plan: 11
completed_at: 2026-10-22T01:20:00+05:30
duration_minutes: 25
---

# Summary: Plan 1.11 - Mount-Synchronized Hero Entrance Animation & Verification

## Results
- 3 of 3 tasks completed successfully
- All must-haves empirically confirmed with visual browser screenshots
- Zero TypeScript errors (`npx tsc --noEmit`)
- Zero ESLint warnings (`npx eslint app/ components/`)
- Clean Turbopack production build (`npm run build`, exit code 0) across all 14 static/dynamic routes

## Tasks Completed
| Task | Description | Status |
|------|-------------|--------|
| Task 1 | Real-Browser Multi-Point Diagnostic & Root Cause Capture | ✅ Completed |
| Task 2 | Implement Mount-Synchronized Entrance Cascade & Fail-Safe Fallback | ✅ Completed |
| Task 3 | Production Build & Empirical Multi-Timestamp Browser Verification | ✅ Completed |

## Root Cause Analysis
- **Root Cause**: Next.js App Router SSR renders static HTML with entrance CSS animation classes already applied. The browser's CSS animation timeline started during HTML parsing and stylesheet evaluation—before First Contentful Paint (FCP) and font hydration occurred. By the time the browser painted pixels to the user's screen, the animation delays (150ms–990ms) had already elapsed, making the hero text appear immediately static at opacity 1.
- **Solution**:
  1. Elements start hidden by default via `.hero-entrance-item` (`opacity: 0; transform: translateY(24px); filter: blur(6px);`).
  2. In `HeroContent.tsx`, a mount-synchronized trigger uses client-side double-`requestAnimationFrame` in `useEffect` to ensure the initial hidden state has been painted before attaching `.hero-mounted` to the parent container.
  3. When `.hero-mounted` is added, `.hero-mounted .hero-entrance-item` triggers the `@keyframes hero-fade-up` cascade with exact staggered delays.
  4. Added a 2.5s CSS keyframe fail-safe `@keyframes hero-failsafe-reveal` so text is never permanently hidden if client JavaScript fails.
  5. Preserved dual-span isolation for headline phrase 1: the outer span handles the `hero-fade-up` entrance, while the inner span (`.hero-gradient-text`) independently cycles the 9s multicolor gradient.

## Visual & Empirical Verification Evidence

### Multi-Timestamp Visual Progression
1. **t ~ 200ms (`hero_t200ms_1792611656291.png`)**:
   - Eyebrow (`PORTFOLIO · 2026`, delay 150ms) is beginning its subtle fade-in.
   - All subsequent elements (greeting, ML badge, headline, description, CTAs, tech pills) are completely hidden at opacity 0.
2. **t ~ 600ms (`hero_t600ms_1792611670751.png`)**:
   - Eyebrow, ML Engineer badge, and greeting ("Hi, I'm Sagar.") are visible.
   - Headline phrase 1 ("Building intelligent solutions", delay 510ms) is actively blurred and mid-fade-in (~90ms into transition).
   - Headline phrase 2 ("for real-world problems.", delay 630ms) is **100% hidden** (delay has not elapsed).
   - Description paragraph, CTAs, and badges remain **100% hidden**.
   - Visually proves sequential headline reveal.
3. **t ~ 1200ms (`hero_t1200ms_1792611701615.png`)**:
   - Both headline phrases, greeting, eyebrow, and role badge are crisp and visible.
   - Description paragraph and CTA buttons are visible.
   - Technology pills and social links (delay 990ms) are actively fading up and blurred mid-transition (~210ms into transition).
4. **t ~ 1800ms (`hero_t1800ms_1792611744030.png`)**:
   - All 8 hero entrance elements are fully settled at opacity 1, `transform: none`, and `filter: none`.
   - Multicolor gradient on headline phrase 1 continues smooth independent animation.

### Accessibility & Responsiveness
- **Reduced Motion (`hero_reduced_motion_1792611810840.png`)**:
  - `@media (prefers-reduced-motion: reduce)` immediately renders all hero elements at full opacity (1.0), zero translation, zero blur, and no animation delays.
- **Mobile Viewport (390px, `mobile_hero_view_1792610431153.png`)**:
  - Responsive layout verified at 390x844: zero horizontal overflow (`scrollWidth <= 390px`), clean text wrapping without clipping, and background portrait intact.

## Deviations Applied
- [Rule 1 - Bug] Fixed TypeScript error on `Animation` type by checking `instanceof CSSAnimation` before accessing `animationName`.
- [Rule 1 - Bug] Fixed ESLint `react-hooks/set-state-in-effect` warning by ensuring `setState` is wrapped in `requestAnimationFrame` for reduced motion as well.

## Files Changed
- `app/globals.css`: Added `.hero-entrance-item` (initial hidden state), `.hero-mounted .hero-entrance-item` entrance trigger, `@keyframes hero-failsafe-reveal`, and updated reduced-motion override.
- `components/hero/HeroContent.tsx`: Implemented mount-synchronized double-rAF trigger, replaced class references with `.hero-entrance-item`, added parent `.hero-mounted` class, and added verification parameter support.
