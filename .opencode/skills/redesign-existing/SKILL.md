---
name: redesign-existing-projects
description: Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vanilla CSS.
license: MIT
---

# Redesign Skill

## How This Works

When applied to an existing project, follow this sequence:

1. **Scan** — Read the codebase. Identify the framework, styling method (Tailwind, vanilla CSS, styled-components, etc.), and current design patterns.
2. **Diagnose** — Run through the audit below. List every generic pattern, weak point, and missing state you find.
3. **Fix** — Apply targeted upgrades working with the existing stack. Do not rewrite from scratch. Improve what's there.

## Design Audit

### Typography

Check for these problems and fix them:

- **Browser default fonts or Inter everywhere.** Replace with a font that has character. Good options: `Geist`, `Outfit`, `Cabinet Grotesk`, `Satoshi`. For editorial/creative projects, pair a serif header with a sans-serif body.
- **Headlines lack presence.** Increase size for display text, tighten letter-spacing, reduce line-height.
- **Body text too wide.** Limit paragraph width to roughly 65 characters.
- **Only Regular (400) and Bold (700) weights used.** Introduce Medium (500) and SemiBold (600).
- **Missing letter-spacing adjustments.** Use negative tracking for headers, positive for labels.
- **Orphaned words.** Fix with `text-wrap: balance` or `text-wrap: pretty`.

### Color and Surfaces

- **Oversaturated accent colors.** Keep saturation below 80%.
- **More than one accent color.** Pick one.
- **Generic `box-shadow`.** Tint shadows to match the background hue.
- **Flat design with zero texture.** Add subtle noise, grain, or micro-patterns.
- **Empty, flat sections with no visual depth.** Add background patterns, ambient gradients.

### Interactivity

- **No hover states on buttons.** Add background shift, slight scale, or translate on hover.
- **No active/pressed feedback.** Add subtle `scale(0.98)` on press.
- **Instant transitions.** Add smooth transitions (200-300ms) to all interactive elements.
- **Animations using `top`, `left`, `width`, `height`.** Switch to `transform` and `opacity`.

## Fix Priority

1. **Font swap** — biggest instant improvement, lowest risk
2. **Color palette cleanup** — remove clashing or oversaturated colors
3. **Hover and active states** — makes the interface feel alive
4. **Layout and spacing** — proper grid, max-width, consistent padding
5. **Polish typography scale and spacing** — the premium final touch

## Rules

- Work with the existing tech stack. Do not migrate frameworks.
- Do not break existing functionality.
- Keep changes reviewable and focused.
