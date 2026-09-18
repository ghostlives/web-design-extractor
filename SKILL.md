---
name: web-design-extractor
description: Deterministically extract design tokens, components, responsive rules, and reports from a live website with zero LLM calls on the normal path.
---

# Web Design Extractor

Use this skill when a user asks to inspect a live website and extract its visual system.

## Policy

- Run the bundled CLI for extraction; do not paste full HTML or CSS into the model.
- The normal path must make zero LLM/API calls.
- Use model reasoning only if the user explicitly requests semantic interpretation after extraction.
- If interpretation is requested, read only the smallest relevant section of `design-system.json`.
- Respect authentication, robots policies, site terms, and user authorization. Never bypass access controls.

## Workflow

1. Install dependencies with `npm install` and browser support with `npx playwright install chromium`.
2. Run `npm run extract -- <url> --out <directory>`.
3. Review `DESIGN.md`, `tokens.json`, `tokens.css`, and `design-system.json`.
4. Report inaccessible cross-origin stylesheets as a coverage limitation; computed styles are still collected.
5. For more fidelity, add representative URLs or states in separate runs rather than sending page source to an LLM.
