---
name: Calories Tracker
description: A personal nutrition dashboard that feels like a coach in your pocket
colors:
  primary: "#d97757"
  primary-container: "#d97757"
  secondary: "#40b3a2"
  secondary-container: "#40b3a2"
  error: "#ef4444"
  background: "#0a0a0a"
  surface: "#121212"
  surface-bright: "#1a1a1a"
  surface-container: "#161616"
  surface-container-low: "#0f0f0f"
  surface-container-high: "#1e1e1e"
  surface-container-highest: "#262626"
  on-surface: "#f9f7f2"
  on-surface-variant: "#a1a1aa"
  outline: "#262626"
  outline-variant: "#333333"
typography:
  headline:
    fontFamily: "Manrope, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontWeight: 900
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, sans-serif"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontWeight: 700
    letterSpacing: "0.2em"
rounded:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "20px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.md}"
    padding: "16px 24px"
  card:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "16px 20px"
---

# Design System: Calories Tracker

## 1. Overview

**Creative North Star: "The Night Coach"**

The app is a dark, low-glare instrument you check between bites: near-black surfaces that recede, so the two accent hues — ember orange and mint teal — carry all the meaning. It reads energetic and motivating rather than clinical: numbers count down with weight (`font-black`, tight tracking), progress rings animate with real ease, and quick-log actions resolve with a visible, colored success state. This is a coach in your pocket, not a spreadsheet.

The system explicitly rejects the generic SaaS/AI look: no cream or beige surfaces, no gradient text, no identical icon-card grids, no tiny uppercase eyebrows stacked above every section. It also rejects gamified fitness-app kitsch — no badges, no streak decoration, no mascots — and rejects dense enterprise analytics: this is a single-user daily-glance tool, so one hero number always leads.

**Key Characteristics:**
- Near-black tonal surfaces (background → surface → surface-bright) carry depth; color is reserved for meaning, not decoration.
- Ember orange (`#d97757`) = calories/primary action. Mint teal (`#40b3a2`) = protein/secondary metric. The two never swap roles.
- Headline numbers are heavy and tight (`font-black`, negative tracking) — the app's most-viewed digits get the most visual weight.
- Uppercase, widely-tracked micro-labels (9-10px) caption every stat; body copy stays sentence case.

## 2. Colors

A near-black tonal ramp punctuated by exactly two saturated accents; everything else is neutral.

### Primary
- **Ember Orange** (`#d97757`): calories, primary CTAs (Unlock Dashboard, floating add button), active nav state, progress-ring fill while under goal.

### Secondary
- **Signal Mint** (`#40b3a2`): protein metric only — protein card accents, protein bars in charts, protein progress fill. Never used for calories or generic accents.

### Tertiary
- **Coach Amber** (`#ca8a04`): over-goal warning, and the Fat ring in the Nutritions card. A softer register than destructive red; going over budget is a nudge from a coach, not data loss.
- **Carbs Green** (`#22c55e`): Carbs ring only, in the Nutritions card. Not reused for success/confirmation states elsewhere — a food-macro identity, not a system-status color.

### Neutral
- **True Black Background** (`#0a0a0a`): the app canvas.
- **Surface** (`#121212`): base panel tone (loading screens, sheets).
- **Surface Container** (`#161616`): the default card/section background across the dashboard.
- **Surface Container High** (`#1e1e1e`): raised elements inside cards (input wells, the login password field).
- **Surface Container Highest** (`#262626`): topmost layer — tooltips, avatar frame background.
- **Surface Bright** (`#1a1a1a`): hover state for interactive rows and buttons.
- **On Surface** (`#f9f7f2`): primary text, warm off-white (not pure white) to sit gently on true black.
- **On Surface Variant** (`#a1a1aa`): secondary text, captions, inactive nav icons.
- **Outline / Outline Variant** (`#262626` / `#333333`): all card borders and dividers.

### Named Rules
**The Two-Accent Rule.** Only two saturated hues carry primary meaning: ember orange for calories, mint teal for protein. Amber, red, and green are reserved, narrow-purpose registers (see below) — each locked to exactly one macro or state, never free accents. Any new metric beyond these still gets a neutral treatment first.

**The Error Is Red Rule.** `#ef4444` is reserved exclusively for destructive actions (delete confirmations and their icons). It never doubles as a generic accent, and it no longer covers the over-goal ring — see the Coach, Not Cop Rule.

**The Coach, Not Cop Rule.** Going over a calorie goal is a nudge, not a violation: the ring switches to Coach Amber (`#ca8a04`), never destructive red. Reserve red for the one place data actually gets destroyed.

## 3. Typography

**Headline Font:** Manrope (with system sans-serif fallback)
**Body Font:** Inter (with system sans-serif fallback)
**Label Font:** Inter, uppercase, wide tracking

**Character:** Manrope's geometric heft carries the big, motivating numbers; Inter stays quiet and legible everywhere else. The pairing is confident-but-not-shouty — one heavy display voice, one calm reading voice.

### Hierarchy
- **Headline / Display** (`font-black` 900, 1.5–2.25rem, tight `tracking-tighter`): the calorie-remaining number, modal titles — the single most important digit or word on screen. The hero ring number is fixed at 2.25rem (36px), sized to the ring's 200px diameter rather than scaling with viewport.
- **Title** (`font-extrabold` 800, 1.5–1.875rem, `tracking-tight`): page-level headings ("Welcome Back", card titles like "Protein Shake").
- **Body** (`font-medium` 500, 0.875–1rem, 1.5 line-height): descriptions, meal names, supporting copy.
- **Label** (`font-bold` 700, 9–11px, `tracking-widest`, uppercase): section eyebrows ("Quick Log", "Weekly Activity"), stat captions ("Consumed", "Goal"), nav labels.

### Named Rules
**The One Hero Rule.** Exactly one number per screen renders at Headline weight and size (calories remaining on Dashboard, the modal's core message). Every other stat is Body or Label — this is what keeps the "one primary number leads" principle visually true, not just stated.

## 4. Elevation

Tonal-first: depth comes primarily from stepping through the surface ramp (background → surface-container → surface-bright), not from drop shadows. Shadows are used sparingly and structurally (separating the fixed header/bottom nav and modals from content), while soft colored glow is reserved as a reward signal — the protein progress bar's mint glow and a quick-log button's success state are the only places light escalates beyond structural use.

### Shadow Vocabulary
- **Structural separation** (`shadow-sm`, and the bottom nav's `0 -1px 10px rgba(0,0,0,0.5)`): separates fixed chrome (header, bottom nav) from scrolling content.
- **Modal lift** (`shadow-2xl`): the confirm/detection modals, to read clearly above the backdrop blur.
- **Reward glow** (e.g. `0 0 8px rgba(64,179,162,0.3)` on the protein bar; `shadow-primary/20` / `shadow-error/20` on primary/danger buttons): a colored, low-spread glow tied to the accent of the thing succeeding. Never gray, never wide.

### Named Rules
**The Earned Glow Rule.** Colored glow only appears on things currently succeeding or asking for action (a filled progress bar, a primary button, a success checkmark) — never as ambient card decoration. If nothing is being celebrated, the surface stays flat.

## 5. Components

Tactile and confident: generous corner radii, firm `active:scale-95` press feedback, and primary actions filled solid with the accent rather than outlined.

### Buttons
- **Shape:** Large radius throughout — `rounded-2xl`/`rounded-3xl` (16–24px) on standalone buttons, full pill (`rounded-full`) on the floating add button.
- **Primary:** Solid ember-orange fill, white text, `font-headline font-bold`, `shadow-lg shadow-primary/20`, `hover:brightness-110`, `active:scale-95`.
- **Danger:** Same shape/weight, solid `#ef4444` fill with `shadow-error/20` in place of primary.
- **Secondary / Ghost:** Transparent background, `on-surface-variant` text that brightens to `on-surface` on hover — no border, no fill.
- **Hover / Focus:** `brightness-110` on solid fills; `active:scale-95` (buttons) or `active:scale-90` (nav icons) on press. No layout-shifting hover transforms.

### Cards / Containers
- **Corner Style:** Large and progressive — `rounded-2xl` (16px) for list rows, `rounded-3xl` (24px) for standard cards, up to `rounded-[2rem]`/`rounded-[2.5rem]` (32–40px) for hero cards and modals.
- **Background:** `surface-container` (`#161616`) as the default card tone.
- **Shadow Strategy:** flat at rest; see Elevation. Border does the separating work, not shadow.
- **Border:** 1px `outline` (`#262626`) on virtually every card; brightens to a tinted accent border (`border-primary/20` etc.) on hover to signal interactivity.
- **Internal Padding:** 24px (`p-6`) standard, up to 32px (`p-8`) for hero/modal content.

### Inputs / Fields
- **Style:** `surface-container-high` background inside a pill-shaped (`rounded-3xl`) wrapper, no visible default border beyond a subtle `outline-variant/20`.
- **Focus:** border shifts to `primary`; no separate focus ring — the border change is the entire focus signal.
- **Error:** wrapper border shifts to `error/30` with a soft red shadow; inline error text in `error` below the field.

### Macro Ring (signature component)
Three small progress rings (Carbs / Protein / Fat) in the Nutritions card, each a miniature of the hero calorie ring: 64px diameter, 6px stroke, `-rotate-90` start so fill reads clockwise from 12 o'clock. Center holds a single Material Symbol tinted to the ring's color (`bakery_dining` carbs, `fitness_center` protein, `water_drop` fat) — never an emoji. Label and `value / goalg` sit below in Body-Small/Caption weight, matching the hero ring's own label-under-ring structure rather than inventing a new layout.

### Navigation
- **Header:** fixed, translucent glass (`bg-black/80` + `backdrop-blur-12px`) with a 1px bottom `outline` border; left-aligned avatar + username, no title bar chrome.
- **Bottom Nav:** fixed, `surface` background, 1px top `outline` border, four flex-equal icon+label items plus a centered floating primary-fill circular add button that overlaps the bar. Active state = `primary` icon/label color with filled Material icon variant (`FILL 1`); inactive = `on-surface-variant`, brightening to `on-surface` on hover. Labels are 9px uppercase, widely tracked.

## 6. Do's and Don'ts

### Do:
- **Do** keep exactly two accent hues — ember orange for calories, mint teal for protein — and route any new metric through neutral tones first.
- **Do** lead every screen with one Headline-weight number; everything else is Body or Label.
- **Do** reserve colored glow/shadow for things currently succeeding (a progress fill, a success state, a primary CTA) — never as ambient card decoration.
- **Do** use large, progressive corner radii (16–40px) and firm `active:scale-95` press feedback so the UI feels tactile and confident.
- **Do** respect `prefers-reduced-motion` on every animated element (progress rings, shimmer, `animate-in` transitions) and maintain 4.5:1 text contrast against `#0a0a0a`/`#121212`.

### Don't:
- **Don't** introduce cream, beige, or any light warm-neutral body background — this system is true-black-anchored, full stop.
- **Don't** use gradient text, tiny uppercase eyebrows stacked above every section, or identical icon-card grids — the generic SaaS/AI look this project explicitly rejects.
- **Don't** add badges, streaks-as-decoration, or mascot illustrations — no gamified fitness-app kitsch.
- **Don't** pair a 1px border with a soft wide (`≥16px` blur) drop shadow on the same element — pick tonal border separation or a tight reward glow, never both as decoration.
- **Don't** let a third saturated accent color creep in for a new metric or feature; extend the neutral ramp instead.
- **Don't** signal over-goal/under-goal with color alone — always pair with an icon or text label (e.g. "Over Goal" caption alongside the amber ring).
