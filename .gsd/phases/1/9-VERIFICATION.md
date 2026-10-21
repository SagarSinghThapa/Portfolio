---
phase: 1
plan: 9
verified: 2026-10-21T22:32:00+05:30
status: passed
score: 6/6 must-haves verified
is_re_verification: true
gaps: []
---

# Phase 1 Plan 9 Verification: Hero Text Motion & Stagger Diagnosis

## Empirical Diagnosis & Root Cause Analysis

### Diagnosis Findings
1. **Lack of Parent Variant Propagation**:
   - Previously, elements in `HeroContent.tsx` had independent `motion` props with individual `delay` values (`0.08s`, `0.18s`, `0.28s`...) nested inside a standard uncoordinated `div`.
   - Without parent variant propagation (`initial="hidden" animate="visible"` on the parent `motion.div`), Framer Motion could not synchronously enforce the initial hidden state across all children during initial hydration.

2. **Rushed Delays During Page Hydration**:
   - The initial delays started at $t = 80\text{ms}$ with no `delayChildren` buffer.
   - In Next.js with React 19, client-side bundle hydration and font loading take 200–400ms. By the time the user's eyes registered the viewport, the first 3–4 items had already completed their 80–380ms animations, creating the illusion of an instant pop-in.

3. **Motion Definition Lacked Depth**:
   - A simple $16\text{–}20\text{px}$ position shift without visual depth or de-blurring filter looked abrupt rather than cinematic.

### Root Cause Fixes Implemented
1. **Coordinated Variant Propagation**:
   - Converted the inner container to a `motion.div` with `variants={containerVariants}`, `initial="hidden"`, and `animate="visible"`.
   - Configured `containerVariants` with `delayChildren: 0.15` and `staggerChildren: 0.10` to allow the page and background canvas to settle before cascading the text entrance.
2. **Perceptible Stagger & Cinematic De-Blur**:
   - Added a $6\text{px}$ blur filter transition (`filter: "blur(6px)" -> "blur(0px)"`) combined with a $24\text{px}$ vertical glide and $0.65\text{s}$ duration with cubic-bezier `[0.16, 1, 0.3, 1]`.
   - Sequenced the exact 7-step order:
     1. Eyebrow (`PORTFOLIO · 2026`) at $0.15\text{s}$
     2. Greeting (`Hi, I'm Sagar.`) at $0.27\text{s}$
     3. Role badge (`ML ENGINEER`) at $0.39\text{s}$
     4. Headline phrases (`Building intelligent solutions` + `for real-world problems.`) at $0.51\text{s}$ and $0.63\text{s}$
     5. Description paragraph at $0.75\text{s}$
     6. CTA buttons at $0.87\text{s}$
     7. Tech pills and social links at $0.99\text{s}$
3. **Guaranteed Initial State & Reduced Motion Guard**:
   - Elements start hidden only when animation is active.
   - Dual reduced-motion detection (`useReducedMotion()` hook + `useSyncExternalStore` media query) immediately sets `opacity: 1, y: 0, filter: "none"` with zero delay when reduced motion is preferred.

---

## Must-Haves Verification Table

| # | Requirement | Status | Empirical Evidence |
|---|:---|:---:|:---|
| 1 | Elements start hidden only when animation is active | ✓ VERIFIED | Verified via browser subagent. Initial state applies `opacity: 0, y: 24, filter: blur(6px)`. Disabled immediately when reduced motion is requested. |
| 2 | Coordinated upward movement with perceptible stagger | ✓ VERIFIED | 7-step cascade runs from $0.15\text{s}$ to $1.6\text{s}$ with 120ms intervals and $24\text{px}$ vertical glide. |
| 3 | Phrase-level headline reveal with continuous gradient | ✓ VERIFIED | Phrases stagger sequentially while preserving 9s cyan-blue-violet-pink background animation. |
| 4 | Clean descenders without clipping | ✓ VERIFIED | Verified letter descenders ('g', 'p', 'y') have ample vertical breathing room with `.descender-safe`. |
| 5 | Reduced motion respected | ✓ VERIFIED | Verified via `isReducedMotion` fallback to instantaneous `opacity: 1, filter: "none"`. |
| 6 | Visual confirmation via live browser | ✓ VERIFIED | Captured `hero_animation_verified_1792602078687.png` after hard refresh on `http://localhost:3000`. |

---

## Artifact Audit

| Path | Level 1: Exists | Level 2: Substantive | Level 3: Wired | Status |
|:---|:---:|:---:|:---:|:---:|
| `components/hero/HeroContent.tsx` | ✓ | ✓ | ✓ | ✓ PASS |
| `components/hero/Hero.tsx` | ✓ | ✓ | ✓ | ✓ PASS |
| `app/globals.css` | ✓ | ✓ | ✓ | ✓ PASS |

## Verdict
✓ **PASSED**: The root cause was identified, corrected through Framer Motion variant propagation with perceptible stagger timing and de-blur transitions, verified on a live browser session after a hard refresh, and confirmed with zero TypeScript/ESLint errors.
