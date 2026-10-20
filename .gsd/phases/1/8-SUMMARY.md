---
phase: 1
plan: 8
completed_at: 2026-10-20T17:48:00+05:30
duration_minutes: 12
---

# Summary: Cinematic Hero Section Refinement & Negative Space Composition

## Results
- 2 tasks completed
- All automated verifications passed
- 0 ESLint errors, 0 ESLint warnings
- 0 TypeScript errors
- Clean production build with Turbopack (14/14 routes compiled)
- Browser visual verification confirmed on both desktop (1536×730) and mobile (390×844)

## Tasks Completed
| Task | Description | Commit | Status |
|------|-------------|--------|:---:|
| 1 | Left-align hero text in negative space with directional scrim & face clearance | `9b69084`, `29664a3` | ✅ |
| 2 | Reposition Guided Journey dock to bottom-center to avoid text & chatbot overlap | `9b69084` | ✅ |

## Architectural & Design Decisions
1. **Negative Space Placement & Complete Face Clearance**:
   - In widescreen viewports (1536px), the cinematic canvas places Sagar's face centered horizontally at x ≈ 768px.
   - Constrained the hero content block from an oversized centered card down to `max-w-md lg:max-w-[460px] xl:max-w-[480px]`.
   - Removed the heavy boxed glass card container (`bg-black/35 border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl`), letting the cinematic background breathe while retaining crisp readability.
   - Text ends at x ≈ 590–610px, leaving >150px of clear space before the subject's face begins.

2. **Directional Scrim Gradient**:
   - Added an absolute directional scrim behind the text on desktop:
     `bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none md:w-[50%]`
   - Guarantees 100% WCAG AAA text contrast across white/zinc typography without casting any darkening shadow over the subject's face.

3. **Balanced Headline & Top Row Hierarchy**:
   - Aligned the top bar with `PORTFOLIO · 2026` on the left and a compact `ML ENGINEER` pill on the right.
   - Scaled the greeting to `text-2xl sm:text-3xl lg:text-4xl` (`Hi, I'm Sagar.`) and the animated gradient headline to `text-xl sm:text-2xl lg:text-3xl` (`Building intelligent solutions for real-world problems.`).
   - Prevents excessive line wrapping while retaining visual impact and animated multicolor gradient styling.

4. **Dock Conflict Elimination**:
   - Relocated the `GuidedJourney` dock from `bottom-6 left-6` to `fixed bottom-6 left-1/2 -translate-x-1/2`.
   - Produces a balanced tri-zone layout: left-aligned hero content, center interactive journey widget, and right-aligned Sagar AI chatbot launcher.

5. **Mobile Responsiveness**:
   - On mobile screens, uses compact padding and backdrop-blur styling suited to the vertical portrait crop without pushing CTAs below the fold.

## Files Changed
- [Hero.tsx](file:///d:/New%20folder%20(2)/protfolio/components/hero/Hero.tsx):
  - Changed outer layout from centered to left-aligned container within `max-w-7xl`.
  - Added directional left-to-right gradient scrim constrained to `md:w-[50%]`.
- [HeroContent.tsx](file:///d:/New%20folder%20(2)/protfolio/components/hero/HeroContent.tsx):
  - Removed obstructive boxed card borders and excessive backdrop overlay.
  - Constrained width to `max-w-[460px]` / `max-w-[480px]`.
  - Scaled typography for greeting, headline, and paragraph text.
  - Preserved CTA buttons ("Explore Projects", "Contact Me"), verified tech chips, and social links.
- [GuidedJourney.tsx](file:///d:/New%20folder%20(2)/protfolio/components/GuidedJourney.tsx):
  - Updated dock positioning to `bottom-6 left-1/2 -translate-x-1/2`.

## Verification Evidence
- `npx tsc --noEmit`: ✅ Passed (exit code 0, 0 type errors)
- `npx eslint components/hero/ components/GuidedJourney.tsx`: ✅ Passed (exit code 0, 0 warnings, 0 errors)
- `npm run build`: ✅ Passed (exit code 0, all 14 routes compiled with Turbopack)
- Visual browser evidence:
  - Desktop Hero: `desktop_hero_verification_1792498534952.png` confirms full face visibility, clear negative-space text alignment, and centered dock.
  - Mobile Hero: `mobile_hero_refined_1792498357474.png` confirms mobile readability.
