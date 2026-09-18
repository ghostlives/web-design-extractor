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

1. Resolve the directory containing this SKILL.md as the skill root. Do not assume the working directory is the skill root. The installed bundle contains `dist/cli.js` and a locked runtime dependency manifest.
2. If dependencies are missing, run `npm --prefix "<skill-root>" ci --omit=dev`; from the skill root run `npx playwright install chromium`. These download runtime dependencies, not LLM services. Source checkouts require `npm ci` and `npm run build` first.
3. Run `node "<skill-root>/dist/cli.js" <url> --out "<absolute-output-directory>"`. Place results in the user's chosen project, not the installed skill folder.
3. Review `DESIGN.md`, `tokens.json`, `tokens.css`, and `design-system.json`.
4. Report inaccessible cross-origin stylesheets as a coverage limitation; computed styles are still collected.
5. For more fidelity, add representative URLs or states in separate runs rather than sending page source to an LLM.

Keep normal responses to output paths, coverage limitations, and a short summary. Do not read the full capture JSON unless needed. Zero LLM calls refers to the extractor runtime; agent orchestration itself still consumes model tokens.
