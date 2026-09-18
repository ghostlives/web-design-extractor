# Web Design Extractor

Extract a live website's design system using Playwright and deterministic TypeScript. The runtime makes **zero LLM calls**.

## Outputs

- `design-system.json` — captures, tokens, responsive rules, and component inventory
- `tokens.json` — normalized token candidates with usage frequency
- `tokens.css` — generated CSS custom properties
- `DESIGN.md` — readable design-system report
- optional full-page screenshots per viewport

## Quick start

```bash
npm install
npx playwright install chromium
npm run extract -- https://example.com --out output
```

Useful options:

```bash
npm run extract -- https://example.com \
  --viewports 1440x900,768x1024,390x844 \
  --max-elements 4000 \
  --screenshots \
  --out output/example
```

## Low-token architecture

The browser collects DOM metadata, computed styles, CSS variables, accessible media queries, and viewport measurements. Local code then deduplicates values, ranks token candidates, classifies common components, and renders all artifacts from templates. No model SDK is included.

An agent can optionally interpret the compact JSON later, but `SKILL.md` requires fallback-only reasoning and forbids sending full page source to an LLM.

## Coverage and limitations

- Cross-origin stylesheet rules may be unreadable in the browser; computed styles remain available.
- Hover, focus, open menus, authenticated pages, iframes, and shadow DOM need explicit state/session support in future releases.
- Component classification is intentionally conservative and rule-based.
- Only inspect websites you are authorized to access and follow their terms and policies.

## Development

```bash
npm run check
```

## License

MIT
