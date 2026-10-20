---
description: Mandatory accessible tooltips for interactive controls and informative badges.
globs: *
alwaysApply: true
---

# Mandatory Tooltips Standard

Every interactive and abbreviated UI element must provide immediate, unambiguous visual clarity on user interaction.

## Universal Application Rules
- Icon-Only Actions: Every button, toggle, and icon trigger lacking visible text labels MUST display an explanatory tooltip on hover and focus.
- Cryptic Metrics & Status Badges: KPI counters, truncated text fields, status badges, and chart data points must reveal complete context via a tooltip.
- Keyboard Shortcut Clues: Where keyboard shortcuts exist (e.g. `Ctrl+K`, `Esc`, `Delete`), display the shortcut badge directly within the tooltip.

## Accessibility & Interaction Guidelines
- Dual Input Support: Tooltips must trigger on both mouse hover (`mouseenter`) and keyboard navigation (`focus`).
- Escape Dismissal: Pressing `Escape` must dismiss active tooltips without moving focus.
- Screen Reader Binding: Use proper WAI-ARIA associations (`aria-describedby` referencing the tooltip container ID, or `role="tooltip"`).
- Micro-interaction Polish: Tooltip transitions must be fast and subtle (100–150ms opacity/scale transition). Never show tooltips that cover or obstruct the primary interactive target.
