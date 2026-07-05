# Product

## Register

product

## Users

A single user (the app owner) tracking their own daily calorie and protein intake. The app is password-gated (no multi-tenant accounts, no signup flow) and framed as "Personal Nutrition Records." The primary job on any given screen is fast logging (photo capture, quick-log shortcuts, manual entry) and at-a-glance progress against daily goals.

## Product Purpose

A personal nutrition tracker: log meals (via AI photo detection, chat, or manual entry), see daily calorie/protein progress against targets, review weekly trends, and manage personal targets/settings. Success looks like near-zero friction between "I ate something" and "it's logged," plus a dashboard that makes today's status legible in a glance.

## Brand Personality

Energetic and motivating. The interface should feel like a coach in your pocket — momentum-driven, celebratory about hitting goals, confident rather than clinical. Voice is direct and encouraging, not gamified/cartoonish and not sterile/enterprise.

## Anti-references

- Generic SaaS/AI look: no cream/beige body backgrounds, no gradient text, no card-grid-of-icons sameness, no tiny uppercase eyebrows on every section.
- Not gamified fitness-app kitsch (no badge/streak decoration, no mascots) unless it's earned functionally.
- Not a dense enterprise analytics dashboard — this is a single-user daily-glance tool, not a BI tool.

## Design Principles

1. **Momentum over clutter** — one primary number (calories remaining) leads every view; secondary stats support, never compete.
2. **Log in one tap** — quick-log and photo-capture paths should stay the fastest route to done; never bury them behind extra steps.
3. **Confident dark craft** — lean into the existing Claude-inspired dark theme (orange/teal accents) with high-contrast precision rather than defaulting to generic light SaaS patterns.
4. **Earned celebration** — motivating moments (goal hit, streak, quick-log success) get real feedback (motion, color), but restraint elsewhere keeps them meaningful.

## Accessibility & Inclusion

Standard defaults: WCAG AA contrast minimum (4.5:1 body text), visible keyboard focus states, `prefers-reduced-motion` respected for all animation, no color-only signaling (pair color with icon/label for over/under-goal states).
