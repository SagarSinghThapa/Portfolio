---
phase: 1
plan: 7
wave: 1
depends_on: []
files_modified:
  - components/About.tsx
autonomous: true

must_haves:
  truths:
    - "About section right-side card replaces the empty philosophy block with an informative Developer Profile card"
    - "Card highlights Sagar's AI/ML focus, UPES background (B.Tech Data Science '27), Alpine Explorer 2.0 geospatial AI, and Full-Stack GenAI systems"
    - "Card has a clear visual hierarchy: profile header, two project/focus items with icons, a compact technology row, and an action link to the Projects section"
    - "Visible border is completely removed from this card; surface uses subtle translucent background (bg-black/35 or bg-black/40), backdrop blur (backdrop-blur-2xl), and a restrained ambient glow"
    - "Card is vertically balanced with the left-side About text without dead empty space, and is fully responsive on mobile"
    - "Cinematic portrait, global text theme (#FAFAFA, #D4D4D8, #A1A1AA), gradient accent bar, and scroll animations are preserved"
    - "TypeScript compilation passes with zero errors (npx tsc --noEmit)"
    - "ESLint passes with zero errors and zero warnings (npx eslint app/ components/)"
    - "Production build completes cleanly with Turbopack (npm run build)"
    - "Browser verification confirms the new developer profile card renders live on http://localhost:3000"
  artifacts:
    - path: "components/About.tsx"
      provides: "Redesigned About section featuring the informative borderless developer profile card"
---

# Plan 1.7: About Me Profile Card Transformation

<objective>
Transform the right-side card in the About Me section from an empty decorative "Philosophy" placeholder into a useful, high-impact Developer Profile card. The card will communicate Sagar's AI/ML specialization, UPES background, Alpine Explorer 2.0 geospatial AI project, full-stack AI engineering, compact verified tech stack row, and a direct link to projects. The card will be borderless with subtle translucent glass and restrained ambient glow, vertically balancing the left-side story text across mobile and desktop.

Purpose: Deliver real substance and technical credibility in the About section while preserving the cinematic portrait and cohesive typography theme.
Output: Refactored `components/About.tsx` verified through TypeScript, ESLint, Turbopack build, and live browser validation.
</objective>

<context>
Load for context:
- components/About.tsx
- data/projects.ts
- app/globals.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: Redesign About Right Card into High-Impact Developer Profile Card</name>
  <files>
    components/About.tsx
  </files>
  <action>
    Refactor `components/About.tsx` to replace the empty philosophy block with a structured, informative developer profile card:

    1. **Container Styling & Borderless Glow**:
       - Remove `h-[400px]` fixed height and `border border-white/[0.08]` from the card.
       - Use an auto/flex responsive container (`p-6 sm:p-8 rounded-3xl backdrop-blur-2xl bg-black/40 shadow-[0_0_50px_-10px_rgba(103,232,249,0.12)] relative overflow-hidden flex flex-col justify-between space-y-6`).
       - Add a subtle ambient gradient glow layer in the background (`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#67E8F9]/15 to-[#F472B6]/10 rounded-full blur-3xl pointer-events-none`).
       - Ensure NO visible border lines appear on this card.

    2. **Card Hierarchy & Content**:
       - **Profile Header**:
         - Small badge/lead: `AI/ML ENGINEER & RESEARCHER` with subtle gradient styling.
         - Subtitle: `UPES · B.Tech Data Science (Expected 2027)` in `#A1A1AA` text-xs sm:text-sm font-medium.
       - **Two Concise Focus / Project Items**:
         - **Item 1 (Alpine Explorer 2.0 · Geospatial AI)**:
           - Icon: `Layers` or `Satellite` or `Compass` in a small translucent pill (`p-2 rounded-xl bg-white/5 text-[#67E8F9]`).
           - Heading: `Alpine Explorer 2.0` (`text-sm font-bold text-[#FAFAFA]`).
           - Detail: `Multispectral satellite segmentation (PlanetScope 8-band + Swin Transformer) & offline travel risk intelligence.` (`text-xs text-[#D4D4D8] leading-relaxed`).
         - **Item 2 (Full-Stack AI & GenAI Systems)**:
           - Icon: `BrainCircuit` or `Sparkles` in a small translucent pill (`p-2 rounded-xl bg-white/5 text-[#A78BFA]`).
           - Heading: `Agentic AI & Analytics Pipelines` (`text-sm font-bold text-[#FAFAFA]`).
           - Detail: `Multi-agent architectures (LangGraph), Hybrid RAG, and production API deployments with Next.js & FastAPI.` (`text-xs text-[#D4D4D8] leading-relaxed`).
       - **Compact Technology Row**:
         - Quick pill row of core verified tools: `PyTorch`, `FastAPI`, `LangGraph`, `Next.js`, `Python` (`text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-[#D4D4D8] border border-white/5`).
       - **Case Study Action Link**:
         - Link to projects: `Link href="/projects"` or `Link href="/#projects"` with text `"Explore Case Studies →"` or `"View Featured Projects ↗"` styled with pink/cyan hover transition (`text-xs sm:text-sm font-semibold text-[#FAFAFA] hover:text-[#67E8F9] transition-colors flex items-center gap-1.5 pt-2 border-t border-white/5`).

    3. **Preserve Surrounding Code**:
       - Preserve the section header "About Me" and the 4-color gradient bar (`.section-accent-bar`).
       - Preserve left-side biographical paragraphs and high-contrast typography (`#FAFAFA` and `#D4D4D8`).
       - Preserve all `framer-motion` enter animations and scroll triggers.
       - AVOID: Do NOT add new dependencies or modify other files.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/About.tsx` passes with 0 errors.
    3. `npm run build` completes successfully.
  </verify>
  <done>
    `components/About.tsx` contains the redesigned Developer Profile card with real project details, no visible card border, ambient glow, and verified technical hierarchy.
  </done>
</task>

<task type="auto">
  <name>Task 2: Live Browser Validation & Visual Confirmation</name>
  <files>
    components/About.tsx
  </files>
  <action>
    Run browser validation on `http://localhost:3000` to verify:
    1. The About Me right card displays the Developer Profile card with AI/ML focus, UPES background, Alpine Explorer 2.0, Agentic AI, tech pills, and project link.
    2. The old philosophy label and generic tagline are completely gone.
    3. The card has NO visible border and blends seamlessly with translucent glass and ambient glow.
    4. The card is vertically balanced with the left-hand text.
    5. Capture visual evidence screenshot and recording.
  </action>
  <verify>
    Browser preview confirms live rendering of the redesigned card on `http://localhost:3000`.
  </verify>
  <done>
    Browser screenshot shows the redesigned Developer Profile card live in the browser.
  </done>
</task>

</tasks>

<verification>
Full verification steps:
1. `npx tsc --noEmit` → Zero type errors.
2. `npx eslint components/About.tsx` → Zero ESLint errors or warnings.
3. `npm run build` → Clean Turbopack compilation.
4. Browser test on `http://localhost:3000` verifying the live redesigned card.
</verification>

<success_criteria>
- [ ] Empty philosophy card replaced with informative Developer Profile card
- [ ] Mentions AI/ML focus, UPES B.Tech Data Science background, Alpine Explorer 2.0, and Agentic AI
- [ ] Compact technology row with verified tools
- [ ] Direct case study action link
- [ ] Visible border removed from this card; uses translucent background and ambient glow
- [ ] Vertically balanced with left-side About text and mobile responsive
- [ ] Zero TypeScript or ESLint errors
- [ ] Next.js Turbopack production build succeeds
- [ ] Live browser screenshot proves successful implementation
</success_criteria>
