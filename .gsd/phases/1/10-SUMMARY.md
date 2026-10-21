---
phase: 1
plan: 10
completed_at: 2026-10-22T00:26:00+05:30
duration_minutes: 15
---

# Summary: Corrective Pure CSS Keyframe Hero Entrance Animation

## Results
- 1 task completed
- Root cause diagnosed and eliminated: client-side Framer Motion hydration race condition replaced with pure CSS compositor-driven keyframe animations
- 0 TypeScript errors (`npx tsc --noEmit`)
- 0 ESLint errors and 0 warnings (`npx eslint app/ components/`)
- Clean Turbopack production build (`npm run build`, 14/14 static pages generated)
- Live browser validation confirmed with full programmatic and screenshot evidence on `http://localhost:3000`

## Tasks Completed
| Task | Description | Status |
|------|-------------|:---:|
| 1 | Pure CSS compositor-driven `@keyframes hero-fade-up` entrance with isolated animated gradient text and accessibility overrides | ✅ |

## Architectural & Technical Implementation

1. **Pure CSS Compositor-Driven Animation (`hero-fade-up`)**:
   - In Next.js App Router (React 19), SSR renders HTML directly into the initial DOM before client JavaScript hydrates. When using client-side Framer Motion variants, elements appear at `opacity: 1` during the first ~200–400ms before Framer Motion attaches.
   - Replaced Framer Motion element props with pure CSS `.animate-hero-fade-up` using:
     - 0%: `opacity: 0; transform: translateY(24px); filter: blur(6px);`
     - 100%: `opacity: 1; transform: translateY(0); filter: blur(0px);`
     - Duration: `700ms`
     - Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
     - Fill Mode: `both` (enforcing `opacity: 0, translateY(24px), blur(6px)` backwards during the delay window from frame 0 of paint).
     - GPU Acceleration: `will-change: opacity, transform, filter`.

2. **Strict Cascade Delays (8 Elements)**:
   - Eyebrow (`PORTFOLIO · 2026`): `150ms`
   - Greeting (`Hi, I'm Sagar.`): `270ms`
   - Role badge (`ML ENGINEER`): `390ms`
   - First headline phrase (`Building intelligent solutions`): `510ms`
   - Second headline phrase (`for real-world problems.`): `630ms`
   - Description paragraph: `750ms`
   - CTA buttons (`Explore Projects`, `Contact Me`): `870ms`
   - Technology badges & social links: `990ms`

3. **Collision-Free Gradient Text Isolation**:
   - In CSS, `animation` is shorthand. Setting `.animate-hero-fade-up` on an element that also has `.hero-gradient-text` would overwrite the infinite `gradient-shift` keyframe.
   - Separated the headline into a dual-span architecture:
     - Outer span: `.animate-hero-fade-up` with `animation-delay: 510ms` controlling entrance opacity, translateY, and blur.
     - Inner span: `.hero-gradient-text` with `animation: gradient-shift 9s ease-in-out infinite` controlling the continuous cyan-blue-violet-pink gradient flow.
     - Both animations execute concurrently with zero conflict.

4. **Accessibility & Reduced Motion Guarantee**:
   - Added `@media (prefers-reduced-motion: reduce)` override in `globals.css` with `!important` declarations:
     - `animation: none !important;`
     - `opacity: 1 !important;`
     - `transform: none !important;`
     - `filter: none !important;`
   - Guaranteed failure resilience: because fill mode is `both` and the 100% keyframe terminates at `opacity: 1`, content is guaranteed to render fully visible even if JS fails or crashes.

## Files Modified
- [globals.css](file:///d:/New%20folder%20(2)/protfolio/app/globals.css): Defined `@keyframes hero-fade-up`, `.animate-hero-fade-up` utility with cubic-bezier easing, and `@media (prefers-reduced-motion: reduce)` overrides.
- [HeroContent.tsx](file:///d:/New%20folder%20(2)/protfolio/components/hero/HeroContent.tsx): Removed client-side Framer Motion variant props from hero text elements; applied `.animate-hero-fade-up` with exact inline `animationDelay` values; isolated headline gradient span from entrance span.

## Empirical Verification Evidence
1. `npx tsc --noEmit`: ✅ Exited with code 0 (0 type errors).
2. `npx eslint app/ components/`: ✅ Exited with code 0 (0 lint errors or warnings).
3. `npm run build`: ✅ Exited with code 0 (Turbopack compiled 14/14 static and dynamic routes in 24.8s).
4. Browser Programmatic Verification at `http://localhost:3000`:
   - Eyebrow: `animationName: 'hero-fade-up'`, `animationDelay: '150ms'`, `animationFillMode: 'both'`
   - Greeting: `animationName: 'hero-fade-up'`, `animationDelay: '270ms'`, `animationFillMode: 'both'`
   - Role badge: `animationName: 'hero-fade-up'`, `animationDelay: '390ms'`, `animationFillMode: 'both'`
   - Headline Phrase 1 (outer): `animationName: 'hero-fade-up'`, `animationDelay: '510ms'`, `animationFillMode: 'both'`
   - Headline Phrase 1 (inner): `animationName: 'gradient-shift'`, `animationDuration: '9s'`, continuous linear-gradient
   - Headline Phrase 2: `animationName: 'hero-fade-up'`, `animationDelay: '630ms'`, `animationFillMode: 'both'`
   - Description: `animationName: 'hero-fade-up'`, `animationDelay: '750ms'`, `animationFillMode: 'both'`
   - CTA Buttons: `animationName: 'hero-fade-up'`, `animationDelay: '870ms'`, `animationFillMode: 'both'`
   - Tech Badges & Socials: `animationName: 'hero-fade-up'`, `animationDelay: '990ms'`, `animationFillMode: 'both'`
5. Visual Artifacts:
   - Settled state: [hero_settled_1792608872199.png](file:///C:/Users/sagar/.gemini/antigravity-ide/brain/2e3602e8-a123-4d01-b832-7a7b0d128835/hero_settled_1792608872199.png)
   - Mobile 390px viewport: [hero_mobile_1792608880722.png](file:///C:/Users/sagar/.gemini/antigravity-ide/brain/2e3602e8-a123-4d01-b832-7a7b0d128835/hero_mobile_1792608880722.png)
   - In-flight transition: [hero_in_flight_1792608941765.png](file:///C:/Users/sagar/.gemini/antigravity-ide/brain/2e3602e8-a123-4d01-b832-7a7b0d128835/hero_in_flight_1792608941765.png)
