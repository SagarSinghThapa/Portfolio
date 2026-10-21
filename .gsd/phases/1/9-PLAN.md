---
phase: 1
plan: 9
wave: 1
depends_on: []
files_modified:
  - components/hero/HeroContent.tsx
  - components/hero/Hero.tsx
  - app/globals.css
  - components/About.tsx
  - components/Skills.tsx
  - components/FeaturedProjects.tsx
  - components/ProjectCard.tsx
  - components/Experience.tsx
  - components/Education.tsx
  - components/Contact.tsx
  - components/Footer.tsx
autonomous: true

must_haves:
  truths:
    - "Hero entrance animation executes in the exact 7-step sequence: eyebrow, greeting, role label, headline, description, CTAs, tech chips & social links"
    - "Hero elements stagger with 80–120ms intervals using a subtle 16–24px upward movement and fade-in"
    - "Main headline reveals by phrase/line without clipping descenders or interrupting the animated multicolor gradient"
    - "Scroll-triggered reveal animations smoothly activate when section headings and introductory text enter the viewport with viewport.once: true"
    - "Project cards, skill cards, and experience items stagger entrance without replaying repeatedly on scroll"
    - "Footer content fades in cleanly upon reaching the viewport bottom"
    - "prefers-reduced-motion is strictly respected across all components with immediate visibility and zero motion"
    - "TypeScript compilation passes with zero errors (npx tsc --noEmit)"
    - "ESLint passes with zero errors and zero warnings (npx eslint app/ components/)"
    - "Production build completes cleanly with Turbopack (npm run build)"
  artifacts:
    - path: "components/hero/HeroContent.tsx"
      provides: "Staggered 7-step hero entrance with phrase-level animated gradient headline reveal"
    - path: "app/globals.css"
      provides: "Motion token integration and descender clipping prevention"
    - path: "components/About.tsx"
      provides: "Scroll-triggered reveal on heading and developer profile card"
    - path: "components/Skills.tsx"
      provides: "Staggered scroll-triggered skill category card reveals"
    - path: "components/FeaturedProjects.tsx"
      provides: "Scroll-triggered section header and link reveal"
    - path: "components/ProjectCard.tsx"
      provides: "Modestly staggered project cards with preserved hover effects"
    - path: "components/Experience.tsx"
      provides: "Scroll-triggered timeline card reveals"
    - path: "components/Education.tsx"
      provides: "Scroll-triggered education card reveal"
    - path: "components/Contact.tsx"
      provides: "Scroll-triggered contact section reveal"
    - path: "components/Footer.tsx"
      provides: "Scroll-triggered subtle footer reveal"
---

# Plan 1.9: Staggered Fade-Up & Text-Reveal Animation System

<objective>
Implement a polished, cinematic staggered fade-up and text-reveal animation system across the portfolio:
1. Hero entrance sequence in exact 7-step order (eyebrow → greeting → role pill → headline phrases → description → CTAs → tech & social badges) with 80–120ms stagger and 16–24px upward movement.
2. Phrase-level headline reveal preserving the continuous animated multicolor cyan/blue/violet/pink gradient and preventing descender clipping.
3. Harmonized scroll-triggered viewport reveals across About, Skills, Projects, Experience, Education, Contact, and Footer, with modestly staggered cards and non-repeating (`viewport.once: true`) behavior.
4. Strict `prefers-reduced-motion` compliance, zero layout shift, and robust fallback visibility.

Purpose: Elevate the portfolio to feel cinematic, responsive, and elegant without distracting from Sagar's portrait or adding heavy dependencies.
Output: Refactored `HeroContent.tsx`, `Hero.tsx`, `globals.css`, and section components.
</objective>

<context>
Load for context:
- components/hero/HeroContent.tsx
- components/hero/Hero.tsx
- app/globals.css
- components/About.tsx
- components/Skills.tsx
- components/FeaturedProjects.tsx
- components/ProjectCard.tsx
- components/Experience.tsx
- components/Education.tsx
- components/Contact.tsx
- components/Footer.tsx
- .gsd/phases/1/8-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Hero Staggered Entrance Sequence & Phrase-Level Gradient Headline Reveal</name>
  <files>
    components/hero/HeroContent.tsx
    components/hero/Hero.tsx
    app/globals.css
  </files>
  <action>
    Refactor `components/hero/HeroContent.tsx` and related styles:
    
    1. **Decompose Hero Entrance Sequence into 7 Ordered Steps**:
       Replace the single monolithic outer motion wrapper with individual or coordinated staggered elements while preserving parallax and scroll fade on the outer container:
       - **Step 1: Portfolio Eyebrow Label** (`PORTFOLIO · 2026`)
         - `delay: 0.10s`, `y: 18`, `opacity: 0 -> 1`
       - **Step 2: Identity Greeting** (`Hi, I'm Sagar.`)
         - `delay: 0.20s`, `y: 20`, `opacity: 0 -> 1`
       - **Step 3: Role Label** (`ML ENGINEER` badge)
         - `delay: 0.30s`, `y: 18`, `opacity: 0 -> 1`
         - Positioned next to or aligned with the top header row, entering with its distinct delay
       - **Step 4: Main Headline Revealed by Phrase**
         - Phrase 4a: `Building intelligent solutions` with `delay: 0.40s`, `y: 20`, `opacity: 0 -> 1`
         - Phrase 4b: `for real-world problems.` with `delay: 0.50s`, `y: 20`, `opacity: 0 -> 1`
         - Use `inline-block` with padding/line-height (`leading-snug pb-1`) to ensure gradient text descenders ('g', 'p', 'y') are never clipped.
         - Preserve the continuous 9s CSS background animation `hero-gradient-text` and text clip.
       - **Step 5: Description Paragraph** (`I work across machine learning...`)
         - `delay: 0.60s`, `y: 20`, `opacity: 0 -> 1`
       - **Step 6: CTA Buttons** (`Explore Projects` and `Contact Me`)
         - `delay: 0.70s`, `y: 20`, `opacity: 0 -> 1`
       - **Step 7: Technology Badges & Social Links**
         - `delay: 0.80s`, `y: 16`, `opacity: 0 -> 1`
    
    2. **Motion Token Integration**:
       - Transition curve: `ease: [0.16, 1, 0.3, 1]` (matching `--motion-ease-default`), duration: `0.5s` to `0.6s`.
       - Total entrance sequence completes within ~900ms.
    
    3. **Accessibility & Reduced Motion**:
       - If `reducedMotion` is true, immediately render all elements at `opacity: 1, y: 0` without delay or transition.
       - Verify `@media (prefers-reduced-motion: reduce)` in `app/globals.css` sets static text gradient and disables animation.
    
    AVOID: Character-by-character typing animations, excessive vertical shifts (>24px), or clipping text descenders with `overflow-hidden`.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/hero/` passes with 0 errors.
  </verify>
  <done>
    Hero elements enter in the exact specified 7-step sequence with 80-120ms stagger. Main headline reveals by phrase with animated gradient intact and no clipped descenders.
  </done>
</task>

<task type="auto">
  <name>Task 2: Standardize Scroll-Triggered Section & Card Reveals Across Portfolio</name>
  <files>
    components/About.tsx
    components/Skills.tsx
    components/FeaturedProjects.tsx
    components/ProjectCard.tsx
    components/Experience.tsx
    components/Education.tsx
    components/Contact.tsx
    components/Footer.tsx
  </files>
  <action>
    Standardize viewport-triggered reveal animations across all sections:

    1. **Consistent Section Header & Intro Motion**:
       - Standardize section header motion (`About`, `Skills`, `FeaturedProjects`, `Experience`, `Education`, `Contact`):
         - `initial={{ opacity: 0, y: 20 }}`
         - `whileInView={{ opacity: 1, y: 0 }}`
         - `viewport={{ once: true, margin: "-40px" }}`
         - `transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}`
       - Introductory text and subtitle blocks animate with `delay: 0.1s`.

    2. **Stagger Repeated Cards Modestly**:
       - **Skills categories** (`components/Skills.tsx`):
         `delay: index * 0.08`, `viewport={{ once: true }}`.
       - **Featured Project Cards** (`components/ProjectCard.tsx`):
         `delay: index * 0.1`, `viewport={{ once: true }}`. Preserve existing hover translation (`motion-safe:hover:-translate-y-1`).
       - **Experience timeline** (`components/Experience.tsx`):
         `delay: index * 0.1`, `viewport={{ once: true }}`.
       - **Education** (`components/Education.tsx`):
         Card reveals smoothly with `delay: 0.15s`, `viewport={{ once: true }}`.
       - **Contact** (`components/Contact.tsx`):
         Left contact info at `delay: 0.1s`, right form at `delay: 0.2s`, `viewport={{ once: true }}`.

    3. **Subtle Footer Reveal** (`components/Footer.tsx`):
       - Wrap footer content with a lightweight `motion.div` fade-in:
         `initial={{ opacity: 0, y: 16 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`, `transition={{ duration: 0.5 }}`.

    4. **Non-Repeating & Reduced Motion Guarantees**:
       - Every section uses `viewport={{ once: true }}` so animations never replay on upward/downward scroll.
       - All cards and content maintain visible fallback if JavaScript or animation hooks fail.
       - Respect `prefers-reduced-motion` across all components.

    AVOID: Replaying animations (`viewport: { once: false }`), heavy parallax on scroll that conflicts with global scroll, or changing any card styling/content.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/` passes with 0 errors.
    3. `npm run build` completes cleanly with Turbopack (all 14 routes).
  </verify>
  <done>
    All section headers, cards, and footer reveal with coordinated, non-repeating entrance animations respecting reduced motion.
  </done>
</task>

</tasks>

<verification>
Full verification steps:
1. `npx tsc --noEmit` → Zero type errors.
2. `npx eslint app/ components/` → Zero lint warnings or errors.
3. `npm run build` → Clean Turbopack compilation across all 14 routes.
4. Browser visual test → Verify hero 7-step stagger sequence, phrase-level headline reveal, scroll-triggered section entrance, and footer fade.
</verification>

<success_criteria>
- [ ] Hero content enters in exact 7-step sequence (eyebrow, greeting, role pill, headline phrase 1 & 2, description, CTAs, tech chips & social icons)
- [ ] Headline reveal preserves continuous animated multicolor gradient without descender clipping
- [ ] Stagger intervals are smooth (~80–120ms) and concise (< 1s total hero entrance)
- [ ] Section headings and introductory content reveal on scroll in About, Skills, Projects, Experience, Education, Contact, and Footer
- [ ] Cards in Skills, Projects, and Experience stagger modestly
- [ ] Animations do not repeatedly replay on scroll (`viewport.once: true`)
- [ ] `prefers-reduced-motion` is strictly respected with immediate visibility
- [ ] Zero TypeScript or ESLint errors
- [ ] Clean Turbopack production build
</success_criteria>
