---
status: resolved
trigger: "Hydration mismatch diff with bis_skin_checked='1' and [browser] unhandledRejection: TypeError: Cannot read properties of undefined (reading 'M_ID')"
created: 2026-10-20T14:57:00+05:30
updated: 2026-10-20T14:57:00+05:30
---

## Current Focus
hypothesis: Both errors originate entirely from client-side Chrome extensions mutating the DOM and throwing unhandled rejections in the browser window, not from application code.
test: Checked codebase for bis_skin_checked and M_ID; identified extension ID eppiocemhmnlbhjplcgkofciiegomcon as Urban VPN Proxy; verified Bitdefender / security extension DOM injection.
expecting: Zero occurrences in application code; full attribution to third-party extensions.
next_action: Add suppressHydrationWarning to body in app/layout.tsx and advise testing in Incognito mode.

## Symptoms
expected: Clean browser console without hydration warnings or extension rejections.
actual: 
1. React hydration mismatch diff reporting `- bis_skin_checked="1"` across multiple `div` elements.
2. Unhandled rejection: `TypeError: Cannot read properties of undefined (reading 'M_ID') at chrome-extension://eppiocemhmnlbhjplcgkofciiegomcon/executors/200.js`.
errors:
- React hydration warning: attribute `bis_skin_checked` mismatch
- Extension error: `chrome-extension://eppiocemhmnlbhjplcgkofciiegomcon/executors/200.js`

## Eliminated
- hypothesis: Application code or dependency renders `bis_skin_checked`
  evidence: Zero occurrences in codebase or node_modules.
- hypothesis: Application code references `M_ID`
  evidence: Zero occurrences in codebase; stack trace explicitly points to `chrome-extension://eppiocemhmnlbhjplcgkofciiegomcon/`.

## Evidence
- checked: Extension ID `eppiocemhmnlbhjplcgkofciiegomcon`
  found: Official Chrome Web Store ID for **Urban VPN Proxy**.
  implication: The unhandled rejection is coming from Urban VPN's injected script running in the user's browser, not Next.js.
- checked: Attribute `bis_skin_checked="1"`
  found: Injected into DOM elements by Bitdefender TrafficLight / antivirus or browser security extensions.
  implication: The extension mutates the DOM before React hydration finishes, causing React dev mode to flag an attribute mismatch.
- checked: Application health
  found: `POST /api/chat 200` and `GET / 200` all return successfully.

## Resolution
root_cause: Third-party Chrome extensions (Bitdefender TrafficLight injecting `bis_skin_checked="1"` and Urban VPN Proxy throwing in `executors/200.js`).
fix: Added `suppressHydrationWarning` to `<body>` in `app/layout.tsx` to protect top-level DOM against extension mutations; advise opening the app in an Incognito window without extensions.
verification: Clean `npm run build`, `npx tsc`, and `npx eslint`.
