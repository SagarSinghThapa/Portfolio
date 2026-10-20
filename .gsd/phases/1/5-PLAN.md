---
phase: 1
plan: 5
wave: 1
depends_on: []
files_modified:
  - app/globals.css
  - components/hero/HeroContent.tsx
  - components/hero/Hero.tsx
  - components/About.tsx
autonomous: true

must_haves:
  truths:
    - "CSS custom properties define primary (#FAFAFA), body (#D4D4D8), secondary (#A1A1AA), and muted (#71717A) text tokens in globals.css"
    - "Section title gradient accent bar utility replaces harsh solid red bars with smooth cyan-blue-violet-pink gradient"
    - "Hero card restores 'Hi, I\'m Sagar' prominently alongside role label and main headline"
    - "Unwanted harsh card outlines on Hero and About are softened/removed in favor of subtle translucent borders"
    - "About Me glass card features polished blur, gradient accent, and high contrast typography"
    - "prefers-reduced-motion falls back to static gradients without animation"
    - "TypeScript compilation passes with zero errors (npx tsc --noEmit)"
    - "ESLint passes with zero errors and zero warnings (npx eslint app/ components/)"
    - "Production build completes cleanly with Turbopack (npm run build)"
  artifacts:
    - path: "app/globals.css"
      provides: "Global typography tokens, section accent bar utility, and semantic color variables"
    - path: "components/hero/HeroContent.tsx"
      provides: "Hero glassmorphic card with restored 'Hi, I\'m Sagar', softened outline, and 4-color animated gradient"
    - path: "components/About.tsx"
      provides: "Polished About section with refined glass portrait card and unified typography"
---

# Plan 1.5: Global Typography Tokens, Hero Identity & About Glass Polish

<objective>
Establish the foundation of the portfolio's global typography and color system in `app/globals.css`, restore the personal identity greeting "Hi, I'm Sagar" in the hero card alongside the headline and role label, remove unwanted harsh outlines on the Hero and About cards, and upgrade the About glass card into a luxury frosted element with accessible high-contrast text.

Purpose: Provide a unified, central token foundation so every section inherits consistent visual hierarchy and semantic contrast, while ensuring Sagar's personal brand is prominent and aesthetically cohesive.
Output: Design tokens in `globals.css`, updated `HeroContent.tsx`, and polished `About.tsx`.
</objective>

<context>
Load for context:
- app/globals.css
- components/hero/HeroContent.tsx
- components/About.tsx
- .gsd/phases/1/4-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Establish Typography & Semantic Color Tokens in globals.css</name>
  <files>
    app/globals.css
  </files>
  <action>
    Add central design tokens and utility classes for typography and semantic accents to `app/globals.css`:

    1. In `:root`, define the official typography color tokens:
       ```css
       --text-primary: #FAFAFA;
       --text-body: #D4D4D8;
       --text-secondary: #A1A1AA;
       --text-muted: #71717A;

       --accent-cyan: #67E8F9;
       --accent-blue: #60A5FA;
       --accent-violet: #A78BFA;
       --accent-pink: #F472B6;
       ```
    2. Add reusable utility classes:
       - `.text-theme-primary`: `color: var(--text-primary);`
       - `.text-theme-body`: `color: var(--text-body);`
       - `.text-theme-secondary`: `color: var(--text-secondary);`
       - `.text-theme-muted`: `color: var(--text-muted);`
       - `.section-accent-bar`: `w-20 h-1.5 rounded-full bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6]` (replaces the old `bg-red-600 dark:bg-rose-500` bars across all sections).
       - `.glass-panel`: subtle border `border border-white/[0.08]` and background `bg-black/30 backdrop-blur-xl shadow-2xl` without harsh solid lines.
    3. Ensure `@media (prefers-reduced-motion: reduce)` is preserved and applies to all gradient utilities.
    4. AVOID: Do NOT delete existing `@keyframes gradient-shift`, `.animate-gradient-text`, or `.hero-gradient-text`.
  </action>
  <verify>
    1. `npm run build` succeeds.
    2. Inspect `app/globals.css` to verify tokens are well-formed and valid CSS.
  </verify>
  <done>
    `app/globals.css` contains all design tokens for primary, body, secondary, and muted text, plus `.section-accent-bar` and `.glass-panel` utilities with zero syntax errors.
  </done>
</task>

<task type="auto">
  <name>Task 2: Restore Hero Identity & Polish Hero and About Glass Cards</name>
  <files>
    components/hero/HeroContent.tsx
    components/hero/Hero.tsx
    components/About.tsx
  </files>
  <action>
    Update `components/hero/HeroContent.tsx`, `components/hero/Hero.tsx`, and `components/About.tsx` to align with the token system:

    1. **In `components/hero/Hero.tsx`:**
       - Ensure the hero `<section>` has `id="hero"` for smooth programmatic anchor navigation from the guided journey widget.

    2. **In `components/hero/HeroContent.tsx`:**
       - Restore the personal greeting "Hi, I'm Sagar" while keeping the ML Engineer role and headline:
         - Supertitle: `PORTFOLIO · 2026` in muted rose/pink (`text-xs uppercase tracking-widest font-semibold text-rose-400/90 mb-2`).
         - Identity Greeting: `Hi, I'm ` + `<span className="hero-gradient-text text-transparent bg-clip-text">Sagar</span>` as an expressive lead-in (`text-2xl sm:text-3xl font-extrabold text-white mb-3 flex items-center gap-2`).
         - Role Badge: `ML ENGINEER & DEVELOPER` (`text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 inline-block text-rose-300/90 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/20`).
         - Main Headline: `Building ` + `<span className="hero-gradient-text text-transparent bg-clip-text">intelligent solutions</span>` + ` for ` + `<span className="hero-gradient-text text-transparent bg-clip-text">real-world problems.</span>` (`text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white`).
         - Paragraph text: Use `#D4D4D8` (`text-[#D4D4D8]` or `text-theme-body`) for crisp contrast.
         - Card outline: Replace harsh `border-white/10` with soft `border border-white/[0.07] bg-black/35 backdrop-blur-2xl shadow-2xl rounded-3xl`.
       - Preserve `parallaxY`, `contentOpacity`, action buttons, tech pills, and social links.

    2. **In `components/About.tsx`:**
       - Replace `w-20 h-1.5 bg-red-600 dark:bg-rose-500` with the unified `.section-accent-bar` (or `bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6]`).
       - Update body text from `text-gray-600 dark:text-gray-300` to high-contrast `text-[#D4D4D8]`.
       - Card over portrait: remove harsh outline `border-white/5` and `bg-red-900/10` in favor of a clean luxury glass block:
         `backdrop-blur-md bg-black/25 border border-white/[0.08] rounded-2xl p-6 shadow-xl`.
       - Text on card: "Always learning, building, and growing." styled in `text-white font-medium text-lg drop-shadow`.
    3. AVOID: Do NOT modify the global canvas animation or frame loader.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/hero/HeroContent.tsx components/About.tsx` passes with 0 errors.
    3. `npm run build` succeeds.
  </verify>
  <done>
    Hero card proudly features "Hi, I'm Sagar", the ML Engineer role, headline with 4-color gradient, softened borders, and About Me card has polished glass styling with high-contrast text.
  </done>
</task>

</tasks>

<verification>
Execute the full verification suite after tasks:
1. `npx tsc --noEmit` → Zero type errors.
2. `npx eslint app/ components/` → Zero errors, zero warnings.
3. `npm run build` → Turbopack compiles all 14 routes cleanly.
4. Visual test: "Hi, I'm Sagar" is visible and prominent in the hero card.
5. Visual test: Hero and About cards have soft, clean edges without harsh outlines.
6. Visual test: Reduced-motion mode renders static gradients cleanly.
</verification>

<success_criteria>
- [ ] CSS typography and semantic color tokens established in `app/globals.css`
- [ ] Section accent bar utility defined with cyan-violet-pink gradient
- [ ] "Hi, I'm Sagar" restored in `HeroContent.tsx` alongside headline and role
- [ ] Unwanted harsh card outlines softened on Hero and About cards
- [ ] About Me card has refined luxury glassmorphic styling
- [ ] Zero TypeScript or ESLint errors
- [ ] Turbopack production build succeeds
</success_criteria>
