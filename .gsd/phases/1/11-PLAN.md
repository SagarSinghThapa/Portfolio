---
phase: 1
plan: 11
wave: 1
depends_on: []
files_modified:
  - app/globals.css
  - components/hero/HeroContent.tsx
autonomous: true
user_setup: []

must_haves:
  truths:
    - "On fresh page load, hero text visibly starts hidden (opacity 0, translateY 24px, blur 6px) and cascades into view in exact sequence"
    - "Staggered delays execute in order: Eyebrow (150ms), Greeting (270ms), Role badge (390ms), Headline phrase 1 (510ms), Headline phrase 2 (630ms), Description (750ms), CTAs (870ms), Badges & social links (990ms)"
    - "Headline phrase 1 animated multicolor gradient shifts continuously without collision with the entrance keyframe"
    - "prefers-reduced-motion immediately renders all hero elements at full opacity with zero translation, blur, or delay"
    - "Fail-safe mechanism guarantees hero text cannot remain hidden if JavaScript or animation initialization fails"
    - "Mobile viewport (390px) remains fully responsive with no text clipping or horizontal overflow"
  artifacts:
    - "d:/New folder (2)/protfolio/.gsd/phases/1/11-PLAN.md"
    - "d:/New folder (2)/protfolio/app/globals.css"
    - "d:/New folder (2)/protfolio/components/hero/HeroContent.tsx"
---

# Plan 1.11: Diagnose & Visibly Enforce Hero Text Entrance Animation

<objective>
Diagnose the root cause of why the pure CSS keyframe hero entrance animation (`a58a144`) remained visually imperceptible during a real browser fresh page load, and implement a robust, compositor-synchronized entrance sequence that guarantees the user visibly witnesses the staggered fade-up from hidden to visible.

Purpose: Eliminate the Next.js SSR vs First Contentful Paint (FCP) race condition where CSS animations elapsed before pixels were painted to the screen, providing an unquestionable, visually verified entrance animation.
Output: Diagnostic evidence log, updated `HeroContent.tsx` with mount-synchronized trigger, updated `globals.css` with fail-safe CSS fallback, and fresh browser multi-timestamp visual evidence.
</objective>

<context>
Load for context:
- `components/hero/HeroContent.tsx`
- `components/hero/Hero.tsx`
- `app/globals.css`
- `.gsd/phases/1/10-SUMMARY.md`
</context>

<tasks>

<task type="auto">
  <name>Task 1: Real-Browser Multi-Point Diagnostic & Root Cause Capture</name>
  <files>components/hero/HeroContent.tsx, app/globals.css</files>
  <action>
    Diagnose the exact timeline of page load vs CSS animation clock in a real browser session on http://localhost:3000/.
    Specifically:
    1. Measure the delta between document parse start and First Contentful Paint (FCP).
    2. Confirm whether CSS keyframes defined directly on SSR HTML elements begin their delay timer during network transfer / HTML parsing, causing delays (150ms - 750ms) to elapse before the browser paints the first frame to the display.
    3. Test triggering the animation immediately after paint / mount via requestAnimationFrame to verify that synchronizing the trigger with the visual paint makes the entrance unmistakably visible.
    AVOID: Modifying production code before establishing empirical diagnostic proof.
  </action>
  <verify>Log browser timeline timestamps (FCP vs animation delay) and capture baseline screenshots</verify>
  <done>Empirical root cause documented with clear explanation of the SSR-to-paint timing gap</done>
</task>

<task type="auto">
  <name>Task 2: Implement Mount-Synchronized Entrance Cascade & Fail-Safe Fallback</name>
  <files>components/hero/HeroContent.tsx, app/globals.css</files>
  <action>
    1. In `app/globals.css`:
       - Define `@keyframes hero-fade-up`:
         - 0%: `opacity: 0; transform: translateY(24px); filter: blur(6px);`
         - 100%: `opacity: 1; transform: translateY(0); filter: blur(0px);`
       - Scope animation execution to `.hero-mounted .animate-hero-fade-up` with:
         - `duration: 750ms`
         - `easing: cubic-bezier(0.16, 1, 0.3, 1)`
         - `fill-mode: both`
         - `will-change: opacity, transform, filter`
       - Add fail-safe CSS fallback:
         - In case client JavaScript fails to execute, define a fallback keyframe `@keyframes hero-failsafe-reveal { to { opacity: 1; transform: translateY(0); filter: blur(0px); } }` on `.animate-hero-fade-up:not(.animated)` with a 2.5s delay so text is guaranteed 100% visible.
       - Enforce `@media (prefers-reduced-motion: reduce)`:
         - Set `animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important;` on all entrance classes.
    2. In `components/hero/HeroContent.tsx`:
       - Add a mounted state `isMounted` initialized to `false` and set to `true` in `useEffect` via `requestAnimationFrame` to ensure the trigger class `.hero-mounted` is added immediately upon client paint.
       - Apply `.animate-hero-fade-up` and exact inline `animationDelay` to all 8 elements:
         - Eyebrow: `150ms`
         - Greeting: `270ms`
         - Role badge: `390ms`
         - Headline phrase 1 (outer span): `510ms`
         - Headline phrase 2: `630ms`
         - Description: `750ms`
         - CTA buttons: `870ms`
         - Tech pills & social links: `990ms`
       - Preserve dual-span isolation for headline phrase 1: outer entrance span (`animate-hero-fade-up`) and inner gradient text (`hero-gradient-text`, `animation: gradient-shift 9s ease-in-out infinite`).
       - If `isReducedMotion` is true, bypass animation class and render immediately visible.
    AVOID: Reintroducing Framer Motion variant props that cause client-side hydration race conditions.
  </action>
  <verify>Run `npx tsc --noEmit` and `npx eslint app/ components/`</verify>
  <done>Zero TypeScript errors, zero ESLint warnings, code compiles cleanly</done>
</task>

<task type="auto">
  <name>Task 3: Production Build & Empirical Multi-Timestamp Browser Verification</name>
  <files>components/hero/HeroContent.tsx, app/globals.css</files>
  <action>
    1. Run `npm run build` to ensure clean Turbopack production build.
    2. Open `http://localhost:3000/` in browser_subagent.
    3. Perform hard refresh and capture evidence across multiple points in the entrance window:
       - t = ~200ms: Eyebrow starting to fade in, later elements still hidden at opacity 0
       - t = ~600ms: Greeting & role badge visible, headline phrase 1 transitioning, lower elements hidden
       - t = ~1200ms: Description & CTAs transitioning in
       - t = ~1800ms: Fully settled state, all elements at opacity 1, continuous gradient animation running
    4. Test reduced-motion mode to confirm instant full opacity with zero movement or blur.
    5. Test mobile viewport (390px) to verify zero horizontal overflow, correct typography, and intact card styling.
  </action>
  <verify>Inspect captured browser screenshots and computed styles at multiple timestamps during initial load</verify>
  <done>Visual proof captured confirming text elements visibly start hidden and transition to visible in sequence</done>
</task>

</tasks>

<verification>
After all tasks, verify:
- [ ] TypeScript check (`npx tsc --noEmit`) passes with 0 errors
- [ ] ESLint check (`npx eslint app/ components/`) passes with 0 errors
- [ ] Turbopack production build (`npm run build`) compiles all 14 routes cleanly
- [ ] Fresh page load shows hero text visibly transitioning from hidden to visible in sequence
- [ ] Headline phrase 1 gradient shift continues cycling independently
- [ ] Reduced motion override disables all movement and blur immediately
- [ ] Mobile 390px layout is completely intact
</verification>

<success_criteria>
- [ ] All 3 tasks verified with empirical browser evidence
- [ ] All must-haves confirmed
- [ ] 11-SUMMARY.md created and committed to git
</success_criteria>
