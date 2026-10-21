---
phase: 1
plan: 10
wave: 1
depends_on: []
files_modified:
  - app/globals.css
  - components/hero/HeroContent.tsx
  - components/hero/Hero.tsx
autonomous: true
gap_closure: true

must_haves:
  truths:
    - "Hero text elements visibly start hidden at opacity 0 with 24px translateY and 6px blur on first paint"
    - "Hero elements execute a perceptible, staggered CSS fade-up entrance in sequence: eyebrow (150ms), greeting (270ms), role badge (390ms), phrase 1 (510ms), phrase 2 (630ms), description (750ms), CTAs (870ms), tech & social badges (990ms)"
    - "Hero text entrance animation operates via CSS keyframes with animation-fill-mode: both, immune to React 19 hydration timing or bundle latency"
    - "Entrance animation (opacity, translateY, blur) and multicolor gradient animation (background-position) are isolated on separate DOM elements to avoid CSS animation property collision"
    - "prefers-reduced-motion: reduce immediately renders all hero elements at full opacity (opacity: 1, translateY: 0, blur: 0) with zero animation"
    - "TypeScript compilation passes with zero errors (npx tsc --noEmit)"
    - "ESLint passes with zero errors and zero warnings (npx eslint app/ components/)"
    - "Production build completes cleanly with Turbopack (npm run build)"
  artifacts:
    - path: "app/globals.css"
      provides: "Reusable hero-fade-up keyframe, .animate-hero-fade-up utility, and reduced-motion overrides"
    - path: "components/hero/HeroContent.tsx"
      provides: "CSS keyframe-driven 7-step staggered entrance sequence with isolated gradient animation elements"
---

# Plan 1.10: CSS-Driven Hero Entrance Animation (Hydration-Immune Stagger)

<objective>
Replace the Framer Motion hero entrance with a pure CSS keyframe entrance system (`hero-fade-up`).
Because CSS keyframe animations with `animation-fill-mode: both` are applied by the browser compositor on the very first frame of paint, hero text will reliably start hidden at `opacity: 0, translateY(24px), blur(6px)` and visibly glide upward in the intended 150ms–990ms stagger, completely immune to React 19 hydration latency and SSR paint overrides.

Purpose: Solve the discrepancy where hero text was already rendered at opacity 1 on first paint, making the entrance imperceptible to the user.
Output: Refactored `app/globals.css`, `HeroContent.tsx`, and `Hero.tsx`.
</objective>

<context>
Load for context:
- app/globals.css
- components/hero/HeroContent.tsx
- components/hero/Hero.tsx
- .gsd/phases/1/9-VERIFICATION.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add Reusable CSS Entrance Keyframes & Reduced-Motion Overrides in globals.css</name>
  <files>
    app/globals.css
  </files>
  <action>
    Add the `hero-fade-up` keyframe and utility in `app/globals.css`:

    1. **Keyframe Definition**:
       ```css
       @keyframes hero-fade-up {
         0% {
           opacity: 0;
           transform: translateY(24px);
           filter: blur(6px);
         }
         100% {
           opacity: 1;
           transform: translateY(0);
           filter: blur(0px);
         }
       }
       ```
    2. **Utility Class with Both Fill-Mode**:
       ```css
       .animate-hero-fade-up {
         animation: hero-fade-up 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
         will-change: opacity, transform, filter;
       }
       ```
    3. **Reduced Motion Safety**:
       In `@media (prefers-reduced-motion: reduce)`:
       ```css
       .animate-hero-fade-up {
         animation: none !important;
         opacity: 1 !important;
         transform: none !important;
         filter: none !important;
       }
       ```
    AVOID: Applying `animation` shorthand directly onto elements that already have `animation: gradient-shift`, which would overwrite the gradient animation.
  </action>
  <verify>
    Verify `app/globals.css` contains `@keyframes hero-fade-up` and `.animate-hero-fade-up` with proper fill-mode and reduced-motion overrides.
  </verify>
  <done>
    `hero-fade-up` keyframe is defined with 24px translateY, 6px blur, 700ms duration, and strict reduced-motion fallback.
  </done>
</task>

<task type="auto">
  <name>Task 2: Refactor HeroContent to CSS Keyframe-Driven Stagger with Isolated Gradient Elements</name>
  <files>
    components/hero/HeroContent.tsx
    components/hero/Hero.tsx
  </files>
  <action>
    Refactor `components/hero/HeroContent.tsx`:

    1. **Apply `.animate-hero-fade-up` with Exact Stagger Delays**:
       - Eyebrow: `className="... animate-hero-fade-up" style={{ animationDelay: "150ms" }}`
       - Role badge: `className="... animate-hero-fade-up" style={{ animationDelay: "390ms" }}`
       - Greeting: `className="... animate-hero-fade-up" style={{ animationDelay: "270ms" }}`
       - Headline phrase 1 wrapper:
         Wrap the gradient span in an outer container that handles the entrance animation:
         ```tsx
         <span className="inline-block animate-hero-fade-up descender-safe mr-1.5" style={{ animationDelay: "510ms" }}>
           <span className="inline-block text-transparent bg-clip-text hero-gradient-text">
             Building intelligent solutions
           </span>
         </span>
         ```
         This cleanly separates the entrance animation (`hero-fade-up` on the outer span) from the continuous color cycle (`gradient-shift` on the inner span), preventing CSS property collisions.
       - Headline phrase 2:
         ```tsx
         <span className="inline-block animate-hero-fade-up descender-safe" style={{ animationDelay: "630ms" }}>
           for real-world problems.
         </span>
         ```
       - Description: `className="... animate-hero-fade-up" style={{ animationDelay: "750ms" }}`
       - CTA buttons container: `className="... animate-hero-fade-up" style={{ animationDelay: "870ms" }}`
       - Tech badges & social links: `className="... animate-hero-fade-up" style={{ animationDelay: "990ms" }}`

    2. **Preserve Parallax and Scroll Fade**:
       Keep the outer container handling scroll parallax and opacity:
       ```tsx
       <div
         className="relative z-20 w-full max-w-md lg:max-w-[460px] xl:max-w-[480px] text-left"
         style={{
           transform: `translateY(${parallaxY}px)`,
           opacity: contentOpacity,
         }}
       >
       ```

    3. **Clean Up Unnecessary Framer Motion Props on Hero Content**:
       Remove the ineffective Framer Motion variants on these hero items, keeping `HeroContent.tsx` lightweight, fast, and 100% reliable on first paint.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/hero/` passes with 0 errors.
    3. `npm run build` completes cleanly with Turbopack.
  </verify>
  <done>
    Hero elements use CSS keyframe animations with fill-mode both. Text visibly transitions from hidden (opacity 0, y: 24, blur: 6px) to visible in sequence, completely immune to hydration delays.
  </done>
</task>

</tasks>

<verification>
Full verification steps:
1. `npx tsc --noEmit` → Zero type errors.
2. `npx eslint app/ components/` → Zero lint warnings or errors.
3. `npm run build` → Clean Turbopack compilation across all 14 routes.
4. Hard-refresh browser test at `http://localhost:3000` → Observe and record the initial hidden state, upward glide, and sequential stagger across all 7 elements during the first 2 seconds.
5. Capture fresh browser evidence confirming the text elements visibly transition into view.
</verification>

<success_criteria>
- [ ] Reusable `@keyframes hero-fade-up` in `app/globals.css` with 0% opacity/translateY(24px)/blur(6px) and 100% opacity/translateY(0)/blur(0)
- [ ] `animation-fill-mode: both` guarantees initial hidden state on first paint
- [ ] 7-step stagger delays applied: eyebrow (150ms), greeting (270ms), role badge (390ms), phrase 1 (510ms), phrase 2 (630ms), description (750ms), CTAs (870ms), tech badges (990ms)
- [ ] Gradient movement animation and entrance animation isolated on separate DOM elements with zero property collision
- [ ] `prefers-reduced-motion: reduce` override ensures instant visibility with no motion
- [ ] Zero TypeScript or ESLint errors
- [ ] Clean Turbopack production build
- [ ] Live browser hard-refresh confirms visible text fade-up and position transition
</success_criteria>
