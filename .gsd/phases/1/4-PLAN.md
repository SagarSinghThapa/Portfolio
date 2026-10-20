---
phase: 1
plan: 4
wave: 1
depends_on: []
files_modified:
  - app/globals.css
  - components/hero/HeroContent.tsx
autonomous: true

must_haves:
  truths:
    - "Hero renders a glassmorphic card with backdrop blur and subtle border over the cinematic background"
    - "Role label 'ML ENGINEER & DEVELOPER' displays a subtle animated gradient cycling through cyan, blue, violet, and pink"
    - "Main headline 'Building intelligent solutions for real-world problems.' features the animated multicolor gradient"
    - "Paragraph text is light gray (text-gray-300) for high contrast and readability"
    - "Buttons 'Explore My Work ↗' and 'Get In Touch' and tech pills (Python, PyTorch, Next.js, FastAPI) are present and functional"
    - "prefers-reduced-motion falls back to a clean static gradient without animation"
    - "Zero duplicate CSS @keyframes or new external dependencies added"
    - "TypeScript compilation passes with zero errors (npx tsc --noEmit)"
    - "ESLint passes with zero errors and zero warnings (npx eslint app/ components/)"
    - "Production build completes cleanly with Turbopack (npm run build)"
  artifacts:
    - path: "app/globals.css"
      provides: "CSS gradient utility using cyan, blue, violet, and pink with 8-10s timing and reduced-motion override"
    - path: "components/hero/HeroContent.tsx"
      provides: "Glassmorphic hero card with animated gradient typography, action buttons, and tech tags"
---

# Plan 1.4: Hero Glassmorphism Card & Gradient Text Styling

<objective>
Transform the hero text layout in `components/hero/HeroContent.tsx` into the frosted glassmorphism card design shown in the user's reference, featuring smooth animated multicolor gradients on the role label ("ML ENGINEER & DEVELOPER") and main headline ("Building intelligent solutions for real-world problems."), clean light-gray paragraph text, CTA buttons, and technology pills.

Purpose: Elevate the hero section into a signature, cinematic centerpiece that highlights Sagar's ML Engineering focus with a modern glassmorphic container and smooth 4-color gradient motion while preserving parallax, accessibility, and clean build standards.
Output: Refactored `HeroContent.tsx` and styling in `globals.css` verified by TypeScript, ESLint, and Turbopack build.
</objective>

<context>
Load for context:
- components/hero/HeroContent.tsx
- app/globals.css
- components/hero/Hero.tsx
- .gsd/phases/1/3-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Refine Gradient Utility and Color Tokens in globals.css</name>
  <files>
    app/globals.css
  </files>
  <action>
    Ensure `app/globals.css` provides the exact 4-color gradient utility required without duplicating existing keyframes.

    1. Verify existing `@keyframes gradient-shift` in `app/globals.css`. Do NOT redefine `@keyframes gradient-shift`.
    2. Add or refine a class `.hero-gradient-text` (or extend `.animate-gradient-text`) configured with:
       ```css
       .hero-gradient-text {
         background-image: linear-gradient(
           90deg,
           #67E8F9 0%,
           #60A5FA 25%,
           #A78BFA 50%,
           #F472B6 75%,
           #67E8F9 100%
         );
         background-size: 300% 300%;
         animation: gradient-shift 9s ease-in-out infinite;
       }
       ```
    3. Ensure `@media (prefers-reduced-motion: reduce)` disables the animation:
       ```css
       @media (prefers-reduced-motion: reduce) {
         .hero-gradient-text {
           animation: none;
           background-size: 100% 100%;
         }
       }
       ```
    4. AVOID: Do NOT add any new CSS animation libraries or duplicate `@keyframes`.
    5. AVOID: Do NOT remove existing motion tokens, scrollbar styling, selection styles, or `@utility animate-hero-bounce`.
  </action>
  <verify>
    1. `npm run build` succeeds (CSS parses with zero errors).
    2. Inspect `app/globals.css` to confirm no duplicate `@keyframes gradient-shift`.
  </verify>
  <done>
    `app/globals.css` contains `.hero-gradient-text` utilizing cyan (#67E8F9), blue (#60A5FA), violet (#A78BFA), and pink (#F472B6) over a 9s ease-in-out infinite loop, with full reduced-motion support and zero duplicate keyframes.
  </done>
</task>

<task type="auto">
  <name>Task 2: Implement Glassmorphic Hero Card and Typography in HeroContent.tsx</name>
  <files>
    components/hero/HeroContent.tsx
  </files>
  <action>
    Update `components/hero/HeroContent.tsx` to render the glassmorphic card container with the exact typography hierarchy from the user's reference:

    1. **Container / Glassmorphism Card:**
       - Wrap the content in a frosted glass card:
         `backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto text-left sm:text-center`
       - Preserve `transform: translateY(${parallaxY}px)` and `opacity: contentOpacity` on the outer wrapper for hero scroll parallax.

    2. **Supertitle / Header Label:**
       - `PORTFOLIO · 2026`: subtle uppercase tracking-widest text (`text-xs font-semibold text-pink-400/80 mb-3`).

    3. **Role Label ("ML ENGINEER & DEVELOPER"):**
       - Apply `.hero-gradient-text` with `text-transparent bg-clip-text font-bold tracking-wider text-sm sm:text-base uppercase mb-4 inline-block`.

    4. **Main Headline ("Building intelligent solutions for real-world problems."):**
       - Render as `h1` (`text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white`).
       - Apply `.hero-gradient-text text-transparent bg-clip-text` to "intelligent solutions" and "real-world problems" (or the core expressive parts of the headline as shown in the screenshot) to deliver the vibrant cyan/blue/violet/pink effect while maintaining readability.

    5. **Paragraph Text:**
       - "I work across machine learning, AI-powered applications, and full-stack development to turn ideas into useful products."
       - Crisp, readable light gray (`text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8`).
       - Do NOT animate the paragraph text.

    6. **CTA Buttons:**
       - Primary button: "Explore My Work ↗" (`href="/projects"`), styled with warm pink accent (`bg-[#F472B6] hover:bg-[#f358a8] text-gray-950 font-semibold px-6 py-3.5 rounded-full inline-flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all`).
       - Secondary button: "Get In Touch" (`href="/contact"`), styled with glassmorphism (`bg-white/5 hover:bg-white/15 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-full inline-flex items-center gap-2 transition-all hover:scale-105 active:scale-95`).

    7. **Technology Pills:**
       - Display tags below the buttons: `["Python", "PyTorch", "Next.js", "FastAPI"]`.
       - Styled as subtle glass chips: `px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-gray-300`.

    8. AVOID: Do NOT break the existing `parallaxY` or `contentOpacity` scroll effects.
    9. AVOID: Do NOT alter other sections (`About.tsx`, `Projects.tsx`, etc.).
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/hero/HeroContent.tsx` passes with 0 errors and 0 warnings.
    3. `npm run build` completes successfully with Turbopack.
  </verify>
  <done>
    `HeroContent.tsx` renders the complete glassmorphism hero card matching the screenshot, with animated 4-color gradient text on the role label and headline, light gray readable body text, buttons, and tech chips. Fully verified by type checking, linting, and build.
  </done>
</task>

</tasks>

<verification>
Execute the full verification suite after both tasks:
1. `npx tsc --noEmit` → Zero type errors.
2. `npx eslint app/ components/` → Zero errors and zero warnings.
3. `npm run build` → Turbopack compiles all 14 routes cleanly.
4. Visual test: Hero card renders frosted glass background, subtle border, animated cyan-blue-violet-pink gradient on role and headline, clean paragraph text, buttons, and pills.
5. Visual test: With `prefers-reduced-motion: reduce`, the gradient remains static and smooth without motion.
</verification>

<success_criteria>
- [ ] Glassmorphic hero card is implemented in `components/hero/HeroContent.tsx`
- [ ] Role label "ML ENGINEER & DEVELOPER" has animated gradient (cyan, blue, violet, pink)
- [ ] Headline "Building intelligent solutions for real-world problems." has animated gradient
- [ ] Paragraph text is white/light-gray and readable
- [ ] CTA buttons ("Explore My Work ↗", "Get In Touch") and tech pills (Python, PyTorch, Next.js, FastAPI) are present
- [ ] Reduced-motion fallback shows static gradient
- [ ] Zero duplicate keyframes or unused dependencies
- [ ] TypeScript compilation passes (npx tsc --noEmit)
- [ ] ESLint passes cleanly (0 errors, 0 warnings)
- [ ] Production build succeeds (npm run build)
</success_criteria>
