---
phase: 1
plan: 8
wave: 1
depends_on: []
files_modified:
  - components/hero/Hero.tsx
  - components/hero/HeroContent.tsx
  - components/GuidedJourney.tsx
autonomous: true

must_haves:
  truths:
    - "Hero text is left-aligned on desktop rather than centered across the subject's portrait"
    - "Hero text block is constrained to ~55–60% of available container width on desktop, revealing the subject's face in the cinematic background"
    - "Heavy boxed glass card container is replaced with a refined borderless composition situated in the negative space"
    - "A subtle directional dark gradient overlay (left-to-right) ensures accessible text contrast without darkening the subject's face"
    - "Headline size is modestly reduced on desktop with responsive scaling on tablet and mobile to prevent excessive line wrapping"
    - "All core content ('Hi, I'm Sagar.', role label, animated multicolor gradient headline, description, CTA buttons, tech badges, and social links) is preserved"
    - "Guided Journey dock is repositioned to bottom-center (fixed bottom-6 left-1/2 -translate-x-1/2), eliminating overlap with left-aligned hero content and the bottom-right chatbot launcher"
    - "Mobile layout is optimized for portrait crop with comfortable spacing below the navbar"
    - "prefers-reduced-motion is respected with static gradient fallbacks and instant transitions"
    - "TypeScript compilation passes with zero errors (npx tsc --noEmit)"
    - "ESLint passes with zero errors and zero warnings (npx eslint app/ components/)"
    - "Production build completes cleanly with Turbopack (npm run build)"
  artifacts:
    - path: "components/hero/Hero.tsx"
      provides: "Hero section wrapper with directional negative-space layout and subtle directional gradient scrim"
    - path: "components/hero/HeroContent.tsx"
      provides: "Left-aligned, 55-60% constrained hero typography and interactive elements without an obstructive boxed card"
    - path: "components/GuidedJourney.tsx"
      provides: "Bottom-center docked guided journey widget avoiding hero text and chatbot button"
---

# Plan 1.8: Cinematic Hero Section Refinement & Negative Space Composition

<objective>
Refine the cinematic hero section to reveal the subject's face and cinematic background by moving away from an oversized, centered boxed card to a left-aligned negative-space composition. Constrain desktop text width to 55–60%, scale typography for balanced line wrapping, apply a directional gradient scrim for contrast, optimize mobile spacing, and reposition the Guided Journey widget to a bottom-center dock so it never collides with hero CTAs or the Sagar AI chatbot.

Purpose: Showcase Sagar's cinematic video portrait while maintaining crisp readability, modern typography hierarchy, and effortless navigation.
Output: Refactored `Hero.tsx`, `HeroContent.tsx`, and `GuidedJourney.tsx`.
</objective>

<context>
Load for context:
- components/hero/Hero.tsx
- components/hero/HeroContent.tsx
- components/GuidedJourney.tsx
- app/globals.css
- .gsd/phases/1/7-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Left-Align Hero Content & Refine Composition in Negative Space</name>
  <files>
    components/hero/Hero.tsx
    components/hero/HeroContent.tsx
  </files>
  <action>
    Refactor `components/hero/Hero.tsx` and `components/hero/HeroContent.tsx`:

    1. **In `components/hero/Hero.tsx`**:
       - Adjust layout container from centered (`flex items-center justify-center`) to a comfortable top-and-left alignment:
         - Minimum height `min-h-screen`, `pt-24 sm:pt-28 pb-16 flex items-center`.
         - Add a subtle directional gradient overlay behind text on desktop:
           `<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none md:w-3/4" />`
           This leaves the right half (where the portrait's face is centered) luminous and unshadowed while guaranteeing 100% text contrast on the left.
       - Ensure `id="hero"` is retained.

    2. **In `components/hero/HeroContent.tsx`**:
       - **Remove the heavy boxed card**:
         - Replace `backdrop-blur-2xl bg-black/35 border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl` with a borderless, negative-space container:
           `max-w-2xl lg:max-w-3xl w-full text-left`.
       - **Width constraint**:
         - On desktop (`lg:` and `xl:`), constrain width to ~55–60% (`lg:w-[58%] max-w-2xl`).
       - **Refined Typography & Hierarchy (matching user's visual mockup)**:
         - **Top Header Bar**:
           - Flex row with `PORTFOLIO · 2026` on the left (`text-xs uppercase tracking-widest font-semibold text-rose-400/90`) and `ML ENGINEER & DEVELOPER` on the right (or concise role pill `text-[11px] font-bold tracking-wider uppercase text-rose-300/90 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/20 backdrop-blur-sm`).
         - **Name Heading**:
           - `Hi, I'm ` + `<span className="hero-gradient-text text-transparent bg-clip-text">Sagar.</span>` (`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAFAFA] tracking-tight mb-2 mt-4`).
         - **Animated Headline**:
           - `<span className="hero-gradient-text text-transparent bg-clip-text">Building intelligent solutions</span> for real-world problems.` (scaled to `text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 leading-snug text-[#FAFAFA]`). Modestly reduced to eliminate excessive line wrapping.
         - **Readable Description**:
           - `I work across machine learning, AI-powered applications, and full-stack development to turn ideas into useful products.` in `text-sm sm:text-base text-[#D4D4D8] leading-relaxed mb-6 max-w-xl`.
         - **Action Buttons**:
           - Keep "Explore My Work ↗" (`bg-[#F472B6] hover:bg-[#f358a8] text-gray-950 font-semibold px-6 py-3 rounded-full`) and "Get In Touch" (`bg-white/5 hover:bg-white/10 text-white border border-white/20 font-semibold px-6 py-3 rounded-full`).
         - **Tech Chips & Social Links**:
           - Compact row of verified tech chips (`Python`, `PyTorch`, `Next.js`, `FastAPI`) in `text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#D4D4D8]` alongside GitHub and LinkedIn icon buttons.
       - **Mobile Layout**:
         - On mobile (`sm:` and below), ensure comfortable padding (`px-4 pt-4`), semi-transparent backdrop blur (`bg-black/40 backdrop-blur-md rounded-2xl p-5`) if needed for contrast over the cropped mobile portrait, avoiding covering the entire screen height.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/hero/Hero.tsx components/hero/HeroContent.tsx` passes with 0 errors.
    3. `npm run build` succeeds.
  </verify>
  <done>
    Hero text is cleanly left-aligned in negative space, occupies 55–60% width on desktop, does not obstruct the portrait face, and features responsive typography.
  </done>
</task>

<task type="auto">
  <name>Task 2: Adapt Guided Journey Dock to Bottom-Center & Verify Layouts</name>
  <files>
    components/GuidedJourney.tsx
  </files>
  <action>
    Update `components/GuidedJourney.tsx` positioning to avoid colliding with left-aligned hero content:

    1. **Reposition Dock**:
       - Change container position from `fixed bottom-6 left-6 z-40` to:
         `fixed bottom-6 left-1/2 -translate-x-1/2 z-40` (bottom-center dock).
       - This positions the journey widget centered horizontally on desktop and mobile, leaving the left negative space free for hero content/buttons and keeping the bottom-right completely clear for the Sagar AI chatbot.
    2. **Refine Styling**:
       - Keep compact pill and expanded dock behaviors, step tracking, collapse/expand toggle, and smooth scrolling.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/GuidedJourney.tsx` passes with 0 errors.
    3. `npm run build` succeeds.
  </verify>
  <done>
    GuidedJourney dock is centered at the bottom of the viewport, with zero overlap on hero text or the chatbot launcher.
  </done>
</task>

</tasks>

<verification>
Full verification steps:
1. `npx tsc --noEmit` → Zero type errors.
2. `npx eslint app/ components/` → Zero lint errors.
3. `npm run build` → Clean Turbopack compilation.
4. Visual test on desktop (1536x800) and mobile (390x844) confirming the face is prominent and unobstructed.
</verification>

<success_criteria>
- [ ] Hero content left-aligned on desktop in negative space
- [ ] Text block constrained to ~55–60% width on desktop
- [ ] Portrait face revealed and clearly visible in center/right
- [ ] Headline size modestly scaled to prevent awkward wrapping
- [ ] All original content, badges, and buttons preserved
- [ ] GuidedJourney centered at bottom-center with zero collision
- [ ] Zero TypeScript or ESLint errors
- [ ] Clean Turbopack production build
</success_criteria>
