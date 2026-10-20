---
phase: 1
plan: 3
wave: 1
depends_on: []
files_modified:
  - components/AIChatBot.tsx
  - app/globals.css
  - components/hero/HeroContent.tsx
autonomous: true

must_haves:
  truths:
    - "AI chatbot text reveals continuously from first word to final character without stalling"
    - "Reveal continues after stream completes until buffer is empty — text is never dumped"
    - "Cursor visible during streaming/revealing, disappears only after both finish"
    - "No stale closures, orphaned timers, or intervals that fail to clear"
    - "Hero name 'Sagar' displays animated multicolor gradient with reduced-motion fallback"
    - "TypeScript compilation passes with zero errors (npx tsc --noEmit)"
    - "ESLint passes with zero errors and zero warnings (npx eslint app/ components/)"
    - "Production build succeeds with Turbopack (npm run build)"
  artifacts:
    - path: "components/AIChatBot.tsx"
      provides: "Robust progressive reveal using requestAnimationFrame with ref-based stream state, eliminating stale-closure stalls"
    - path: "app/globals.css"
      provides: "CSS motion system with custom properties for durations, easings, animated gradient keyframes, scrollbar, focus-visible, and selection color"
    - path: "components/hero/HeroContent.tsx"
      provides: "Animated multicolor gradient on 'Sagar' using CSS @keyframes, with reduced-motion static fallback"
---

# Plan 1.3: Fix AI Chatbot Streaming Reveal + Portfolio Motion Polish + Hero Gradient

<objective>
Fix the progressive text-reveal stall bug in Sagar AI chatbot, establish a global CSS motion system for premium animations, and add an animated multicolor gradient to the hero name "Sagar".

Purpose: The chatbot reveal intermittently stalls because `setInterval` captures a stale `isStreamDone` boolean. Switching to `requestAnimationFrame` with ref-based state eliminates stale closures entirely. The motion system creates consistent, cinematic styling without adding animation libraries. The animated gradient gives the hero a signature visual accent.

Output: A chatbot that reveals text smoothly through the full response, a CSS-driven motion language, and a premium animated gradient on "Sagar".
</objective>

<context>
Load for context:
- components/AIChatBot.tsx
- app/globals.css
- components/hero/HeroContent.tsx
- .gsd/phases/1/2-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix Progressive Reveal Stall in AIChatBot</name>
  <files>
    components/AIChatBot.tsx
  </files>
  <action>
    **Root cause:** The `useEffect` on `[streamedText, status]` (line 264) creates a `setInterval` that captures `isStreamDone` from the closure. When the effect runs during streaming, `isStreamDone = false`. After the stream finishes, the callback still reads the stale `false`. When `currentPos >= streamedText.length`, the stale `isStreamDone` check (line 292) prevents clearing the interval, so the reveal stalls. The cursor stays visible and the remaining text eventually appears when the next effect re-run creates a new interval.

    **Fix — replace `setInterval` with `requestAnimationFrame` and ref-based state:**

    1. Add a `streamDoneRef = useRef(false)` alongside the existing refs.
    2. Keep `streamDoneRef.current` updated in a small `useEffect` synced to `status`:
       ```ts
       useEffect(() => {
         streamDoneRef.current = status !== "streaming" && status !== "submitted";
       }, [status]);
       ```
    3. Replace the main `useEffect` reveal loop (lines 264-333) with a `requestAnimationFrame`-based loop:
       - Use a `rafIdRef` instead of `intervalRef`.
       - Inside the rAF callback, read `streamDoneRef.current` (always fresh — no stale closure).
       - Use a timestamp-based throttle: track `lastTickTimeRef` and only advance the reveal position when `elapsed >= intervalMs` (10ms when done, 30ms when streaming).
       - Words per tick: 5 when done, 2 when streaming (same as current).
       - Call `findSafeRevealEnd()` and `advanceByWords()` exactly as before.
       - When `revealedLengthRef.current >= streamedText.length && streamDoneRef.current`, set `displayText(streamedText)` and stop the loop (do NOT reschedule rAF).
       - If `safePos === currentPos` AND `streamDoneRef.current`, force `safePos = candidateEnd` to break Markdown boundary stalls on complete text.
       - Always reschedule rAF at end of callback unless fully caught up and done.
    4. Store `streamedText` in a ref (`streamedTextRef`) so the rAF callback always reads fresh text without re-creating the loop:
       ```ts
       const streamedTextRef = useRef(streamedText);
       streamedTextRef.current = streamedText;
       ```
    5. The rAF loop `useEffect` should depend only on a boolean `isAssistantMessage` (derived: `isLastAssistant && streamedText.length > 0`) to start/stop. When `isAssistantMessage` becomes true, start the loop. Clean up on unmount or when it becomes false.
    6. Preserve all existing behavior:
       - `resetRevealState()` call sites in `handleFormSubmit` and `handleSuggestedClick` (update to cancel rAF instead of clearInterval).
       - `findSafeRevealEnd()` and `advanceByWords()` — do not modify.
       - Cursor `▌` visibility logic — `isRevealing` derived state stays the same.
       - Auto-scroll `useEffect` stays the same.
       - All JSX rendering stays the same.
    7. Remove the old `intervalRef` entirely since rAF uses `rafIdRef`.

    AVOID: Do NOT keep `setInterval` with a workaround. The fundamental issue is stale closures in interval callbacks; rAF + refs is the idiomatic React solution.
    AVOID: Do NOT read `status` directly inside the rAF callback — read `streamDoneRef.current` instead.
    AVOID: Do NOT modify `findSafeRevealEnd()` or `advanceByWords()` — they work correctly.
    AVOID: Do NOT change the JSX structure, chat layout, message rendering, or input behavior.
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/AIChatBot.tsx` passes with 0 errors, 0 warnings.
    3. Manual test: send a short message → text reveals word-by-word without stall → cursor disappears at end.
    4. Manual test: send "Explain machine learning in detail" → long multi-paragraph response reveals continuously → no text dump at end → cursor disappears.
    5. Manual test: stop generation mid-stream → remaining revealed text stays, no orphaned cursor.
    6. Manual test: send new message immediately after previous response → reveal resets cleanly.
  </verify>
  <done>
    AIChatBot progressive reveal runs on requestAnimationFrame, reads stream state from refs, never stalls due to stale closures. Reveal is continuous from first word to final character. Cursor disappears only when both streaming and revealing are complete. No orphaned timers on stop/unmount/new-turn.
  </done>
</task>

<task type="auto">
  <name>Task 2: Establish Global CSS Motion System and Reduced-Motion Support</name>
  <files>
    app/globals.css
  </files>
  <action>
    Add a global CSS motion system to `app/globals.css` that provides consistent, premium animations across the portfolio. This task modifies ONLY the CSS file — no component changes.

    1. **Motion custom properties** — add to `:root`:
       ```css
       --motion-duration-fast: 200ms;
       --motion-duration-normal: 400ms;
       --motion-duration-slow: 700ms;
       --motion-ease-default: cubic-bezier(0.16, 1, 0.3, 1);   /* ease-out-expo */
       --motion-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* overshoot */
       --motion-reveal-distance: 24px;
       ```

    2. **Reduced motion override** — add a `@media (prefers-reduced-motion: reduce)` block:
       ```css
       @media (prefers-reduced-motion: reduce) {
         :root {
           --motion-duration-fast: 0ms;
           --motion-duration-normal: 0ms;
           --motion-duration-slow: 0ms;
           --motion-reveal-distance: 0px;
         }
       }
       ```

    3. **Focus-visible utility** — add a polished focus ring style for interactive elements:
       ```css
       :focus-visible {
         outline: 2px solid rgba(244, 63, 94, 0.6);
         outline-offset: 2px;
       }
       ```

    4. **Smooth scrollbar styling** for the portfolio (WebKit + Firefox):
       ```css
       ::-webkit-scrollbar { width: 6px; }
       ::-webkit-scrollbar-track { background: transparent; }
       ::-webkit-scrollbar-thumb {
         background: rgba(255, 255, 255, 0.15);
         border-radius: 3px;
       }
       ::-webkit-scrollbar-thumb:hover {
         background: rgba(255, 255, 255, 0.3);
       }
       html { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.15) transparent; }
       ```

    5. **Selection color** — match the brand:
       ```css
       ::selection {
         background: rgba(244, 63, 94, 0.3);
         color: inherit;
       }
       ```

    AVOID: Do NOT add `@keyframes` for section reveals in CSS — framer-motion `whileInView` already handles those in components.
    AVOID: Do NOT add animation library imports.
    AVOID: Do NOT remove or modify the existing `hero-bounce` keyframes or `animate-hero-bounce` utility.
    AVOID: Do NOT change the existing `:root` color variables or `@theme inline` block.

    Preserve ALL existing CSS content. Only ADD new rules below the existing ones.
  </action>
  <verify>
    1. `npm run build` passes (CSS parses without errors).
    2. Visual inspection: scrollbar is thin and subtle on Chrome/Firefox.
    3. Visual inspection: focus-visible ring appears on Tab navigation through nav links and buttons.
    4. Visual inspection: text selection uses rose-tinted highlight.
    5. `prefers-reduced-motion: reduce` in DevTools → motion custom properties become `0ms` / `0px`.
  </verify>
  <done>
    globals.css contains a complete motion token system (durations, easings, reveal distance), reduced-motion overrides, polished scrollbar, focus-visible ring, and brand-colored selection. No existing styles broken. Verified by clean build.
  </done>
</task>

<task type="auto">
  <name>Task 3: Animated Multicolor Gradient on Hero Name "Sagar"</name>
  <files>
    components/hero/HeroContent.tsx
    app/globals.css
  </files>
  <action>
    Replace the static red/rose gradient on "Sagar" with a smooth, continuously animated multicolor CSS gradient.

    1. In `app/globals.css`, add a `@keyframes gradient-shift` animation and utility class AFTER the existing rules (below the content added by Task 2):
       ```css
       @keyframes gradient-shift {
         0%   { background-position: 0% 50%; }
         50%  { background-position: 100% 50%; }
         100% { background-position: 0% 50%; }
       }

       .animate-gradient-text {
         background-size: 300% 300%;
         animation: gradient-shift 8s ease-in-out infinite;
       }

       @media (prefers-reduced-motion: reduce) {
         .animate-gradient-text {
           animation: none;
           background-size: 100% 100%;
         }
       }
       ```
       The reduced-motion block above is SEPARATE from the one in Task 2 (which only zeroes the custom properties). Both are needed.

    2. In `components/hero/HeroContent.tsx` line 56, replace:
       ```tsx
       <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
       ```
       with:
       ```tsx
       <span
         className="text-transparent bg-clip-text animate-gradient-text"
         style={{
           backgroundImage:
             'linear-gradient(90deg, #f87171, #f472b6, #a78bfa, #60a5fa, #67e8f9, #f87171)',
         }}
       >
       ```
       Color stops: coral (#f87171) → warm pink (#f472b6) → violet (#a78bfa) → electric blue (#60a5fa) → subtle cyan (#67e8f9) → back to coral for seamless looping.

    3. Verify the text remains readable at all viewport widths:
       - Desktop: `text-7xl` on dark cinematic background — colors should be vibrant and legible.
       - Mobile: `text-3xl` — gradient should still be visually distinct.

    AVOID: Do NOT use JavaScript or framer-motion for the gradient animation — pure CSS `@keyframes` only.
    AVOID: Do NOT change the Navbar component's separate "Sagar" gradient (`from-red-600 to-rose-500` in Navbar.tsx line 24). That is a different component.
    AVOID: Do NOT modify the parallax calculation (`parallaxY`), opacity (`contentOpacity`), scroll behavior, or `getMotionProps` in HeroContent.tsx.
    AVOID: Do NOT add rapid flashing or harsh color jumps — the animation should be slow and continuous (~8s cycle).
  </action>
  <verify>
    1. `npx tsc --noEmit` passes with exit code 0.
    2. `npx eslint components/hero/HeroContent.tsx` passes with 0 errors, 0 warnings.
    3. Visual: "Sagar" text shows smooth multicolor gradient animation at desktop width (1440px+).
    4. Visual: gradient is readable and visually distinct at mobile width (375px).
    5. Visual: `prefers-reduced-motion: reduce` in DevTools → animation stops, static gradient is displayed.
    6. Visual: no flashing, no harsh color jumps — smooth continuous movement through coral → pink → violet → blue → cyan.
    7. Visual: hero scroll parallax and content fade still work correctly.
  </verify>
  <done>
    Hero name "Sagar" displays an animated multicolor gradient cycling smoothly through coral, warm pink, violet, electric blue, and subtle cyan over ~8 seconds. Animation is CSS-only via @keyframes, respects prefers-reduced-motion (falls back to a static gradient), and is readable at both desktop and mobile sizes. No changes to hero layout, parallax, or scroll behavior. Navbar "Sagar" gradient is unchanged.
  </done>
</task>

</tasks>

<verification>
Execute the full verification suite after all tasks:
1. `npx tsc --noEmit` → Must pass with exit code 0.
2. `npx eslint app/ components/` → Must report 0 errors, 0 warnings.
3. `npm run build` → Must compile all routes cleanly with Turbopack.
4. Manual: AI chatbot short answer reveals fully without stall.
5. Manual: AI chatbot long multi-paragraph answer reveals continuously.
6. Manual: AI chatbot Markdown-heavy answer (code blocks, bold, links) renders correctly during and after reveal.
7. Manual: Stopping generation leaves no orphaned cursor or stale timer.
8. Manual: New message after completed response resets reveal cleanly.
9. Manual: Scrollbar, focus ring, and selection color match the brand.
10. Manual: `prefers-reduced-motion: reduce` disables CSS motion tokens and gradient animation.
11. Manual: "Sagar" hero gradient animates smoothly through coral → pink → violet → blue → cyan at desktop and mobile widths.
12. No regression to cinematic hero frames, frame scroll, contact form, or navigation.
</verification>

<success_criteria>
- [ ] Chatbot reveal never stalls — text progresses monotonically from first word to last character
- [ ] Cursor disappears only after streaming AND revealing are both complete
- [ ] No orphaned rAF/timer on stop, unmount, error, or new turn
- [ ] Hero name "Sagar" displays animated multicolor gradient
- [ ] Reduced-motion disables gradient animation and CSS motion tokens
- [ ] Zero ESLint errors or warnings
- [ ] Zero TypeScript errors
- [ ] Turbopack production build succeeds
- [ ] CSS motion system established with reduced-motion support
- [ ] No regression to hero frames, contact form, or existing animations
</success_criteria>
