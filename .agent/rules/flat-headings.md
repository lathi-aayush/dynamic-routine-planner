---
description: Flat heading hierarchy without nested subheadings.
globs: *
alwaysApply: true
---

# Flat Heading Hierarchy Standard

Keep technical documentation, markdown plans, and rule files strictly flat, direct, and immediately scannable.

## Hierarchy Constraints
- Strictly one primary document title (H1).
- Single-tier sections only (H2). Never nest H3, H4, or H5 subheadings beneath an H2 section.
- Prohibit deep outline fragmentation: deep heading trees scatter context and create unnecessary whitespace bloat.

## Alternative Structuring Techniques
When a section requires internal breakdown, use flat formatting primitives instead of nested headings:
- Bold inline terms: Use `**Term** — definition and rule details.`
- Clean bullet lists: Group related items under the parent H2.
- Tables & Key-Value Blocks: Use Markdown tables for structured comparisons and configuration lists.
- Contextual Tooltips: In user interfaces and interactive documents, surface detailed secondary information via tooltips rather than heading cascades.
