---
phase: 1
plan: 2
wave: 1
gap_closure: true
depends_on: []
files_modified:
  - components/hero/useFrameLoader.ts
  - components/GlobalCinematicBackground.tsx
  - components/hero/Hero.tsx
  - components/AIChatBot.tsx
  - app/page.tsx
  - components/Contact.tsx
  - components/GitHubActivity.tsx
autonomous: true

must_haves:
  truths:
    - "TypeScript compilation passes with zero type errors (npx tsc --noEmit)"
    - "ESLint passes with zero errors and zero warnings across app/ and components/ (npx eslint app/ components/)"
    - "Production build completes successfully with Turbopack (npm run build)"
    - "Hero 240-frame scroll animation, AIChatBot streaming reveal, and contact form remain fully functional"
  artifacts:
    - path: "components/hero/useFrameLoader.ts"
      provides: "Frame loader with useMemo-derived frame indices avoiding ref-during-render"
    - path: "components/GlobalCinematicBackground.tsx"
      provides: "Reduced motion & viewport tracking without cascading setState renders"
    - path: "components/hero/Hero.tsx"
      provides: "Reduced motion tracking without synchronous setState in useEffect"
    - path: "components/AIChatBot.tsx"
      provides: "Escaped JSX entities, event-driven reveal reset, and removed unused symbols"
    - path: "app/page.tsx"
      provides: "Clean page entry point without unused Link import"
---

# Plan 1.2: Fix Verification & ESLint Gaps for Production Deployment

<objective>
Resolve all 11 ESLint errors and 7 warnings identified in `.gsd/phases/1/1-VERIFICATION.md` without introducing regressions to the 240-frame cinematic hero, AIChatBot streaming, contact form, or visual appearance.

Purpose: Guarantee a pristine, zero-warning production build for Vercel CI/CD.
Output: Refactored components complying with Next.js 16 / React 19 rules without disabling ESLint rules or using hacky suppressions.
</objective>

<context>
Load for context:
- .gsd/phases/1/1-VERIFICATION.md
- components/hero/useFrameLoader.ts
- components/GlobalCinematicBackground.tsx
- components/hero/Hero.tsx
- components/AIChatBot.tsx
- app/page.tsx
- components/Contact.tsx
- components/GitHubActivity.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix React 19 Ref and Hook Lifecycle Gaps in Hero Background Components</name>
  <files>
    components/hero/useFrameLoader.ts
    components/GlobalCinematicBackground.tsx
    components/hero/Hero.tsx
  </files>
  <action>
    1. In `components/hero/useFrameLoader.ts`:
       - Replace the `useRef` population of `frameIndices` and `framePaths` during render (lines 47-50) with `useMemo(() => { ... }, [frameStep])`.
       - Compute `totalFrames = frameIndices.length` directly from the memoized array instead of reading a ref's `.current` property during render.
       - In the cleanup return of `useEffect`, copy `pendingImagesRef.current` to a local variable `const pendingImages = pendingImagesRef.current` before iterating to satisfy `react-hooks/exhaustive-deps`.
       - AVOID modifying `loadImage`, `loadBatch`, concurrency limits (4), or image caching behavior in `imagesRef`.
    2. In `components/GlobalCinematicBackground.tsx`:
       - Eliminate `setReducedMotion(mq.matches)` and synchronous `setIsMobile(...)` calls inside `useEffect` bodies that trigger `react-hooks/set-state-in-effect`.
       - Implement `useSyncExternalStore` subscriptions for `prefers-reduced-motion` and `window.innerWidth <= 768` (with `false` as server snapshot to prevent hydration mismatch).
       - Ensure `imagesRef` and `frameIndexRef` pass seamlessly to `<HeroCanvas />`.
    3. In `components/hero/Hero.tsx`:
       - Replace the synchronous `setReducedMotion(mq.matches)` call in `useEffect` with the `useSyncExternalStore` matchMedia pattern matching `GlobalCinematicBackground.tsx`.
       - Preserve parallax calculation `parallaxY` and scroll fade `contentOpacity`.
  </action>
  <verify>
    npx eslint components/hero/useFrameLoader.ts components/GlobalCinematicBackground.tsx components/hero/Hero.tsx
  </verify>
  <done>
    All ref-during-render and setState-in-effect ESLint errors in the hero and background subsystem are resolved with 0 errors and 0 warnings.
  </done>
</task>

<task type="auto">
  <name>Task 2: Fix JSX Entities, Chatbot State Reset, and Unused Variables</name>
  <files>
    components/AIChatBot.tsx
    app/page.tsx
    components/Contact.tsx
    components/GitHubActivity.tsx
  </files>
  <action>
    1. In `components/AIChatBot.tsx`:
       - Escape apostrophe on line 482: replace `couldn't` with `couldn&apos;t` to resolve `react/no-unescaped-entities`.
       - Remove unused import `Loader2` from `lucide-react` (line 5).
       - Remove unused declaration `isFullyComplete` (line 219).
       - Refactor reveal reset logic from `useEffect([messages.length])` (which triggered `react-hooks/set-state-in-effect` on `setDisplayText("")` and missed dependencies):
         * Move `revealedLengthRef.current = 0; setDisplayText(""); if (intervalRef.current) clearInterval(intervalRef.current);` into a dedicated `resetRevealState()` helper.
         * Call `resetRevealState()` directly in `handleFormSubmit` and `handleSuggestedClick` upon user message dispatch.
         * Preserve `findSafeRevealEnd()`, progressive interval timing (10ms done, 30ms streaming), word advancing, streaming cursor `▌`, and stop button.
    2. In `app/page.tsx`:
       - Remove unused `import Link from "next/link";` on line 2.
    3. In `components/Contact.tsx`:
       - Use optional catch binding `catch` instead of `catch (error)` on line 48 to eliminate unused variable warning.
    4. In `components/GitHubActivity.tsx`:
       - Use optional catch binding `catch` instead of `catch (error)` on line 25 to eliminate unused variable warning.
  </action>
  <verify>
    npx eslint app/ components/
  </verify>
  <done>
    `npx eslint app/ components/` exits with code 0 and reports 0 errors and 0 warnings.
  </done>
</task>

</tasks>

<verification>
Execute the full verification suite after tasks are completed:
1. `npx tsc --noEmit` -> Must pass with exit code 0.
2. `npx eslint app/ components/` -> Must report 0 errors and 0 warnings.
3. `npm run build` -> Must compile all 14 routes cleanly with Turbopack.
4. `git status` -> Must confirm only scoped files were modified with no unintended changes.
</verification>

<success_criteria>
- [ ] Zero ESLint errors or warnings across the entire codebase
- [ ] Zero TypeScript errors
- [ ] Turbopack production build succeeds
- [ ] No regression to AI streaming, Markdown progressive reveal, 240-frame background, or contact form
- [ ] No secrets modified or leaked
</success_criteria>
