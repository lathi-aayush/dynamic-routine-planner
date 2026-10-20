---
description: Mandatory geometric skeleton loaders for all asynchronous UI boundaries.
globs: *
alwaysApply: true
---

# Mandatory Skeleton Loaders Standard

Asynchronous data loading must feel smooth, responsive, and geometrically predictable. Zero Cumulative Layout Shift (CLS).

## Zero-CLS Geometry Matching
- Identical Geometry: Skeleton placeholder elements must replicate the exact height, width, padding, flex/grid alignment, and border-radius of the target component (cards, list rows, avatar circles, metric values).
- Anti-Blank Policy: Never render an empty white/dark container, a collapsed zero-height parent, or a sudden layout shift upon data arrival.
- Anti-Spinner Policy for Multi-Item Layouts: Prohibit single centered spinners on card grids, feeds, or dashboards; spinners offer zero spatial awareness. Use bone-shaped skeleton grids.

## Visual Styling & State Transitions
- Smooth Shimmer Animation: Implement a gentle, low-contrast pulse or linear gradient shimmer wave (typically 1.5s to 2s infinite cycle). Avoid harsh flashing or jarring opacity spikes.
- Natural Content Cross-Fade: When API data resolves, transition smoothly from skeleton placeholders to live content using a rapid 150ms cross-fade to eliminate visual snapping.
- Error Fallback: If asynchronous fetching fails, replace the skeleton loader with a clearly formatted error state and an inline retry trigger, keeping the container geometry intact.
