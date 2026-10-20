---
phase: 1
plan: 6
wave: 2
depends_on: ["5"]
files_modified:
  - components/Navbar.tsx
  - components/FeaturedProjects.tsx
  - components/ProjectCard.tsx
  - components/Skills.tsx
  - components/Experience.tsx
  - components/Education.tsx
  - components/Contact.tsx
  - components/Footer.tsx
  - components/GuidedJourney.tsx
  - app/page.tsx
autonomous: true

must_haves:
  truths:
    - "All sections (Navbar, Projects, Skills, Experience, Education, Contact, Footer) adhere to global typography tokens (#FAFAFA headings, #D4D4D8 body, #A1A1AA metadata)"
    - "Old solid red section bars are replaced with the unified cyan-blue-violet-pink gradient accent bar"
    - "Project cards, skill chips, and timeline items feature cohesive glass styling with accessible contrast"
    - "Navbar logo uses coherent gradient and links have clear hover states matching the design system"
    - "A non-blocking guided portfolio journey component allows users to seamlessly navigate milestones (Intro, About, Skills, Projects, Experience, Contact) without interrupting regular browsing"
    - "The guided journey can be collapsed, dismissed, or interacted with smoothly"
    - "TypeScript compilation passes with zero errors (npx tsc --noEmit)"
    - "ESLint passes with zero errors and zero warnings (npx eslint app/ components/)"
    - "Production build completes cleanly with Turbopack (npm run build)"
  artifacts:
    - path: "components/GuidedJourney.tsx"
      provides: "Non-blocking floating guided journey tracker and quick navigation dock"
    - path: "components/Navbar.tsx"
      provides: "Header with unified typography, coherent logo gradient, and styled resume button"
    - path: "app/page.tsx"
      provides: "Integrated page entry point with guided journey mounted"
---

# Plan 1.6: Universal Section Theme Alignment & Guided Portfolio Journey

<objective>
Harmonize typography, section accent bars, card borders, and interactive states across all sections of the portfolio to complete the cohesive design system, and implement an optional, non-blocking guided portfolio journey that smoothly walks visitors through Sagar's story, projects, and skills.

Purpose: Eliminate all remaining mismatched colors (old red bars, scattered text tones) and deliver a unified, premium visual identity, enhanced by an intuitive guided journey.
Output: Refactored shared components and new `GuidedJourney.tsx` verified by clean build and linting.
</objective>

<context>
Load for context:
- .gsd/phases/1/5-PLAN.md
- app/globals.css
- components/Navbar.tsx
- components/ProjectCard.tsx
- components/Skills.tsx
- components/Experience.tsx
- components/Education.tsx
- components/Contact.tsx
- components/Footer.tsx
- app/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Unify Typography, Section Bars, and Interactive States Across All Sections</name>
  <files>
    components/Navbar.tsx
    components/FeaturedProjects.tsx
    components/ProjectCard.tsx
    components/Skills.tsx
    components/Experience.tsx
    components/Education.tsx
    components/Contact.tsx
    components/Footer.tsx
  </files>
  <action>
    Systematically update typography and color tokens across all sections to follow the `#FAFAFA` (primary), `#D4D4D8` (body), and `#A1A1AA` (secondary/metadata) hierarchy:

    1. **`components/Navbar.tsx`:**
       - Logo: Use `.hero-gradient-text text-transparent bg-clip-text font-bold text-2xl tracking-tight`.
       - Nav links: `text-[#D4D4D8] hover:text-[#FAFAFA] font-medium text-sm transition-colors`.
       - Resume button: Replace harsh red styling with a sleek glass pill: `border border-[#F472B6]/40 bg-[#F472B6]/10 text-white hover:bg-[#F472B6]/25 transition-all shadow-sm`.
       - Mobile menu: Consistent dark glass backdrop (`bg-black/90 backdrop-blur-2xl`) and coherent text colors.

    2. **`components/FeaturedProjects.tsx` & `components/ProjectCard.tsx`:**
       - Section header: Replace solid red bar with `w-20 h-1.5 rounded-full bg-gradient-to-r from-[#67E8F9] via-[#A78BFA] to-[#F472B6]`.
       - Project card: Card title `text-[#FAFAFA] group-hover:text-[#67E8F9] transition-colors`, description `text-[#D4D4D8]`, category tags `bg-white/5 border border-white/10 text-[#A78BFA] text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1`, technology bullets `text-[#A1A1AA]`.
       - Link buttons: "View Case Study" with pink/cyan hover transition.

    3. **`components/Skills.tsx`:**
       - Section accent bar: Unified gradient bar.
       - Category cards: Soften borders (`border-white/[0.08]`), title `text-[#FAFAFA]`, category icons styled with gradient accent color (`text-[#67E8F9]`, `text-[#A78BFA]`, etc.), skill chips `bg-white/5 border border-white/10 text-[#D4D4D8] text-sm hover:border-[#67E8F9]/40`.

    4. **`components/Experience.tsx` & `components/Education.tsx`:**
       - Section accent bars: Unified gradient bar.
       - Roles / Degree: `text-[#FAFAFA] font-bold`.
       - Company / Institution: `text-[#FAFAFA] font-medium`.
       - Dates: `text-[#A1A1AA] text-sm font-medium`.
       - Bullet points / coursework: `text-[#D4D4D8] leading-relaxed`.
       - Timeline indicators: Replace red dots with cyan/violet glowing accent indicators (`bg-gradient-to-r from-[#67E8F9] to-[#A78BFA]`).

    5. **`components/Contact.tsx` & `components/Footer.tsx`:**
       - Headings: `text-[#FAFAFA]`.
       - Subheadings & descriptions: `text-[#D4D4D8]`.
       - Form labels: `text-[#D4D4D8] text-sm font-medium`.
       - Input fields: `bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:border-[#F472B6] focus:ring-1 focus:ring-[#F472B6]`.
       - Submit button: `bg-[#F472B6] hover:bg-[#f358a8] text-gray-950 font-semibold px-8 py-3.5 rounded-full`.
       - Footer: `text-[#A1A1AA] text-sm py-8 border-t border-white/[0.08]`.

    6. AVOID: Do NOT change functional API logic in `Contact.tsx`.
    7. AVOID: Do NOT break form validation or error message rendering.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint app/ components/` passes with 0 errors and 0 warnings.
    3. `npm run build` succeeds.
  </verify>
  <done>
    Every section across the portfolio features harmonious text colors (#FAFAFA, #D4D4D8, #A1A1AA), gradient accent bars, and cohesive interactive states with zero legacy harsh red bars.
  </done>
</task>

<task type="auto">
  <name>Task 2: Build and Mount Non-Blocking Guided Portfolio Journey Component</name>
  <files>
    components/GuidedJourney.tsx
    app/page.tsx
  </files>
  <action>
    Create a sleek, non-blocking guided portfolio journey component:

    1. **Create `components/GuidedJourney.tsx`:**
       - Defined stages:
         `[{ id: "hero", label: "Intro" }, { id: "about", label: "About" }, { id: "skills", label: "Skills" }, { id: "projects", label: "Projects" }, { id: "experience", label: "Experience" }, { id: "contact", label: "Contact" }]`
       - Detects active section during scroll via `IntersectionObserver` or scroll position.
       - Floating docked pill widget (bottom-left or bottom-center on desktop, compact on mobile):
         - Shows current step: e.g. "Step 2 of 6 · About".
         - Quick "Next →" button to smoothly scroll to the next milestone: `document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth' })`.
         - Allows clicking any dot or label to jump directly.
         - Non-blocking: Includes a collapse/minimize toggle button so users can collapse it to a tiny floating icon or keep it open without covering essential content.
         - Styled in dark glassmorphism: `backdrop-blur-xl bg-black/60 border border-white/15 text-white rounded-full shadow-2xl p-2 px-4`.
       - Respects `prefers-reduced-motion` (scrolls instantly without smooth scroll animation when enabled).

    2. **Mount in `app/page.tsx`:**
       - Import and render `<GuidedJourney />` above the closing fragment in `app/page.tsx`.
    3. AVOID: Do NOT create modal overlays, popups, or blocking backdrops. The journey is strictly non-blocking.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/GuidedJourney.tsx app/page.tsx` passes with 0 errors.
    3. `npm run build` succeeds.
    4. Verify the widget appears on page, tracks current section, and scrolls smoothly on click.
  </verify>
  <done>
    `GuidedJourney.tsx` is implemented and mounted in `app/page.tsx`, offering an optional, non-blocking guided tour of all sections with smooth section tracking and collapse capability.
  </done>
</task>

</tasks>

<verification>
Execute the full verification suite after all tasks:
1. `npx tsc --noEmit` → Zero type errors.
2. `npx eslint app/ components/` → Zero errors and zero warnings.
3. `npm run build` → Turbopack compiles all 14 routes cleanly.
4. Visual inspection: Every section displays unified typography, consistent gradient accent bars, and accessible contrast.
5. Visual inspection: Guided journey widget docks cleanly, updates active milestone on scroll, and can be minimized without blocking content.
</verification>

<success_criteria>
- [ ] Primary headings (#FAFAFA), body text (#D4D4D8), and metadata (#A1A1AA) applied across all sections
- [ ] Legacy red section bars eliminated in favor of unified cyan-violet-pink gradient bars
- [ ] Navbar logo and buttons aligned with design system
- [ ] Non-blocking GuidedJourney component created and mounted in `app/page.tsx`
- [ ] GuidedJourney allows smooth scrolling, section tracking, and collapse
- [ ] Zero TypeScript or ESLint errors
- [ ] Turbopack production build succeeds
</success_criteria>
