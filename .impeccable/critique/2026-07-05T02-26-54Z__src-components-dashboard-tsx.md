---
target: home page (Dashboard)
total_score: 20
p0_count: 2
p1_count: 2
timestamp: 2026-07-05T02-26-54Z
slug: src-components-dashboard-tsx
---
Method: dual-agent (A: a7901aa893e29a096 · B: ad9c041c5c962e85f)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | "View Log" button (Dashboard.tsx:306-308) has no `onClick` — a dead control styled identically to functional ones |
| 2 | Match Between System / Real World | 3 | n/a — ring/"Remaining"/"Over Goal" language matches a real budgeting mental model |
| 3 | User Control and Freedom | 2 | No undo after delete (FoodLog.tsx:81, "cannot be undone"); no undo for a mis-tapped quick-log |
| 4 | Consistency and Standards | 3 | Mostly consistent, but the dead "View Log" link breaks the learned rule that primary-colored text = clickable |
| 5 | Error Prevention | 2 | Calorie/protein edit inputs (FoodLog.tsx:183-198) have no min/max; invalid text silently becomes `0` via `parseInt(...) || 0` |
| 6 | Recognition Rather Than Recall | 2 | Weekly chart (Dashboard.tsx:260-300) has no axis/gridline/value labels at rest — values only surface on hover |
| 7 | Flexibility and Efficiency | 2 | Quick-log is hardcoded to one item (protein shake); no way to add a second shortcut or edit goals from the dashboard |
| 8 | Aesthetic and Minimalist Design | 2 | Six stacked sections in one continuous scroll for a tool meant to be "at-a-glance"; four repeated eyebrow labels add noise |
| 9 | Error Recovery | 1 | Failed quick-log (Dashboard.tsx:79-82) silently resets to idle with only `console.error` — no user-facing failure state |
| 10 | Help and Documentation | 1 | Zero tooltips/help affordances anywhere except the FoodLog empty state |
| **Total** | | **20/40** | **Acceptable — significant improvements needed before users are happy** |

#### Anti-Patterns Verdict

**Partial pass, with two clear drifts back toward the generic-AI look the project's own PRODUCT.md/DESIGN.md explicitly reject.**

**LLM assessment**: The color/surface foundation is genuinely disciplined — true near-black ramp, no cream/beige, no gradient text, and the two-accent rule (`#d97757` calories / `#40b3a2` protein) holds everywhere checked. But two drifts stand out: (1) the hero calorie card *is* the "hero-metric template" — a decorative corner glow blob (`Dashboard.tsx:119-120`, `bg-primary/5 rounded-full blur-3xl`) behind a centered giant number and a secondary KPI row is one of the most recognizable AI-dashboard fingerprints; (2) every section ("Quick Log", "Weekly Activity", "Recent", "Full History" — lines 194, 248, 305, 336) is stamped with an identical uppercase/tracked/bold eyebrow label, which PRODUCT.md explicitly bans ("no tiny uppercase eyebrows on every section") — and DESIGN.md itself is complicit, having called these "section eyebrows" in its own Label spec. The design system and the strategic brief disagree with each other, and the code followed the system, not the brief. A smaller tell: the header avatar hotlinks a random portrait from a third-party voice-cloning CDN and is wired to a leftover debug function that pings the API root on click — for a "personal, coach-in-your-pocket" app, that undercuts the personal framing immediately.

**Deterministic scan**: `detect.mjs` ran clean against `App.tsx`, `Dashboard.tsx`, `Header.tsx`, `BottomNav.tsx`, `FoodLog.tsx`, `LogFoodSheet.tsx`, and `Modal.tsx` — 0 findings, exit code 0. This is expected, not reassuring: the detector catches known markup/CSS slop signatures, and the real issues here are compositional and interaction-level (a dead button, silent error handling, missing focus states) — exactly the class of problem a pattern-matching scan can't see. No false positives to report since there were no findings at all.

**Visual overlays**: Not available — no browser automation tool (Playwright/Puppeteer/computer-use) was exposed in this session, so live-page injection and the `[Human]` overlay tab were skipped. This critique is based on source-code review only; a follow-up run with browser access would strengthen the visual/contrast findings.

#### Overall Impression

The visual system (DESIGN.md's "Night Coach") is well-conceived and mostly honored in code — the two-accent discipline and the quick-log micro-interaction are genuinely good. But the page currently reads as a *demo* of that system rather than a finished product: a styled button with no handler, a failed API call that fails silently, zero focus-visible states anywhere, and a stray debug hook wired to a stranger's photo. The biggest opportunity is closing the gap between "looks confident" and "is confident" — the craft is in the tokens, not yet in the edge cases.

#### What's Working

1. **Quick-log protein shake micro-interaction** (`Dashboard.tsx:210-241`) — real loading → success feedback, both buttons disabled mid-flight, auto-reset after 1.5s. This is the one place "log in one tap" and "earned celebration" are actually implemented, not just asserted in principle.
2. **Two-accent color discipline** holds throughout `Dashboard.tsx`, `FoodLog.tsx`, and the chart tooltip — orange strictly means calories, teal strictly means protein, with no third accent leaking in anywhere reviewed.
3. **FoodLog empty state** (`FoodLog.tsx:86-93`) — a calm icon, clear headline, and one line of supportive copy, framed as a personal "journal" rather than a generic "no data" message.

#### Priority Issues

**[P0] Silent failure on quick-log.** `Dashboard.tsx:79-82` catches the log error and resets state to `'idle'` with only a `console.error` — the user gets no visible signal anything went wrong.
**Why it matters**: Directly undermines the core success metric (near-zero friction between "I ate something" and "it's logged"). A user can't tell whether the entry saved, risking silent data loss or an accidental duplicate on retry.
**Fix**: Reuse the existing state machine with an `error-1`/`error-1.5` branch that shows a red icon + "Try again" for ~2s, mirroring the success path that already exists.
**Suggested command**: `$impeccable harden`

**[P0] Dead "View Log" button.** `Dashboard.tsx:306-308` renders a primary-colored, tap-styled button with no `onClick` at all.
**Why it matters**: It's visually indistinguishable from every other functional action on the page, so tapping it and getting nothing damages trust in every other button on the screen.
**Fix**: Wire it to `setView("log")` or toggle `historyExpanded`.
**Suggested command**: `$impeccable harden`

**[P1] Header avatar is a hotlinked stranger's photo wired to leftover debug code.** `Header.tsx:11-16` pulls an image from a third-party voice-cloning CDN and binds `onClick={test}` to a debug helper (`foodService.ts:15-18`) that pings the API root for no visible reason.
**Why it matters**: The avatar is the one piece of personal identity on a screen framed as "Mr. {username}" / personal nutrition records — a random face breaks that framing instantly, and shipping live debug code is exactly what a stress-tester will trip over first.
**Fix**: Replace with a real avatar or initials placeholder; remove the `test` import and its `onClick`.
**Suggested command**: `$impeccable harden`

**[P1] Eyebrow labels on every section contradict the product brief.** "Quick Log" / "Weekly Activity" / "Recent" / "Full History" (`Dashboard.tsx:194, 248, 305, 336`) all render in the identical uppercase/tracked/bold treatment PRODUCT.md explicitly bans.
**Why it matters**: This is the clearest single place the implementation drifted back into generic-SaaS scaffolding despite the whole system being designed to avoid it — and it dilutes the "One Hero Rule" by giving four secondary sections the same visual volume as the primary number.
**Fix**: Keep at most one true eyebrow (e.g. over the weekly chart); drop the rest to plain sentence-case Title/Body headings.
**Suggested command**: `$impeccable typeset`

**[P2] No undo after delete.** The delete-confirm modal states "This cannot be undone" (`FoodLog.tsx:81`), with Edit/Delete sitting as adjacent, identically-sized icon buttons (`FoodLog.tsx:264-277`).
**Why it matters**: An easy mis-tap on mobile currently produces an unrecoverable loss, which is a high-stakes moment for what should be a routine correction.
**Fix**: Soft-delete with a 5-second "Entry removed · Undo" toast before committing the deletion server-side.
**Suggested command**: `$impeccable harden`

**[P3] Weekly chart is illegible at rest.** No axis, gridline, or value labels (`Dashboard.tsx:260-300`); values only surface via hover tooltip, which doesn't work well on touch without press-and-hold.
**Why it matters**: This is the "glance between bites" tool's own trend view, but it requires deliberate interaction just to read a number.
**Fix**: Add a top-of-bar value label, at minimum for today's bar.
**Suggested command**: `$impeccable layout`

#### Persona Red Flags

**Sam (Accessibility-Dependent)**:
- Zero `focus-visible`/`focus:ring` styling anywhere in `Dashboard.tsx`, `BottomNav.tsx`, `Modal.tsx`, `LogFoodSheet.tsx`, or `Header.tsx` (confirmed via grep) — PRODUCT.md requires "visible keyboard focus states," and none exist beyond default browser behavior.
- No `@media (prefers-reduced-motion: reduce)` anywhere in `index.css`, despite the calorie ring's `transition-all duration-1000`, `animate-in` on every section, and unconditional `animate-spin` — PRODUCT.md requires reduced motion to be respected for all animation.
- Today's bar in the weekly chart is distinguished from other days *only* by fill opacity (`Dashboard.tsx:281, 294`) — a color/opacity-only signal with no label or icon.
- `Modal.tsx` and `LogFoodSheet.tsx` have no `role="dialog"`, `aria-modal`, focus trap, or Escape-to-close handling.

**Riley (Stress-Tester)**:
- Live debug call on the header avatar's `onClick` (`Header.tsx:15`).
- Dead "View Log" button (`Dashboard.tsx:306-308`).
- Silent quick-log error path (`Dashboard.tsx:79-82`).
- Edit form accepts negative calories/protein with no `min` constraint, and invalid text silently coerces to `0` via `parseInt(...) || 0` with no warning (`FoodLog.tsx:187, 196`).

#### Minor Observations

- `Header.tsx:18` hardcodes "Mr. {user?.username}" — a gendered honorific baked into a single-user app; also renders "Mr. " with a trailing space during any load race where `user` exists but `username` doesn't yet.
- `CustomTooltip` (`Dashboard.tsx:89-112`) accesses `payload[1].value` without checking `payload.length > 1` — would throw if Recharts ever renders with only one series active.
- The over-goal ring color and the "delete forever" icon share the exact same red (`var(--color-error)`) — going over budget and permanently destroying data get the identical visual register, which reads as punitive rather than "coach-like."
- FoodLog date grouping sorts via `localeCompare` on ISO strings — correct today, fragile if the date format ever changes.

#### Questions to Consider

- If "fast logging" is the primary job on every screen, why is the FAB — the fastest path to logging — parked at the bottom of a five-section scroll instead of anchored near the hero ring itself?
- The over-goal ring and the "delete forever" icon share the exact same red. Is going over your calorie budget really the same emotional register as permanently destroying data — what would an actual coach say instead of turning the screen red?
- Four secondary sections all shout at the same eyebrow volume. If only one number is supposed to lead, why do the supporting sections compete with each other instead of staying quiet?
