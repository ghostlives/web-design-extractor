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

## Install as an agent skill

Requires Node.js 22 or newer. Download and extract `web-design-extractor.zip` or
`web-design-extractor.tar.gz` from GitHub Releases, then run from the extracted folder:

```bash
node scripts/install-skill.mjs claude project /path/to/project
node scripts/install-skill.mjs codex project /path/to/project
node scripts/install-skill.mjs copilot project /path/to/project
```

Choose the agent you use; installing all three is optional. Replace `project` with
`user` for personal installation. The installer prints dependency/browser setup
commands. It never overwrites an existing skill or modifies agent settings.

| Agent | Project skill directory | Personal skill directory |
|---|---|---|
| Claude Code | `.claude/skills/web-design-extractor` | `~/.claude/skills/web-design-extractor` |
| Codex | `.agents/skills/web-design-extractor` | `~/.agents/skills/web-design-extractor` |
| GitHub Copilot | `.github/skills/web-design-extractor` | `~/.copilot/skills/web-design-extractor` |

The installer uses Node filesystem APIs and accepts Windows paths too. Restart or
reload your agent after installation. Ask it to extract a website's design system.
Discovery depends on the agent version and skill support being enabled.

Other agents supporting folder-based `SKILL.md` can use the same bundle: copy the
entire extracted folder into that agent's documented skills directory. Do not copy
only SKILL.md; the compiled runtime and dependency files are required. This is not
a claim of tested compatibility with every agent or hosted chat environment.

Reference documentation: [Claude Code skills](https://code.claude.com/docs/en/skills),
[Codex skills](https://developers.openai.com/codex/skills),
[GitHub Copilot skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills).

## GitHub Actions releases

Pull requests and manual workflow runs build and upload CI artifacts. Pushing a
`v*` tag builds the same bundles and publishes a GitHub Release with ZIP, tar.gz,
and `SHA256SUMS` assets. No npm registry credentials are required. Only the tag
publication job receives `contents: write`; build jobs use read-only permissions.

After merging the workflow, create a version tag on the desired commit and push
it, for example `v0.1.0`. A manual workflow run alone does not publish a release.

Local bundle build (requires tar and zip; Linux/macOS or WSL):

```bash
npm ci
npm run check
node scripts/bundle.mjs
```

For source-checkout skill installation, run `npm ci` and `npm run build` before
running the installer. Release bundles already contain compiled code. Neither
bundle includes node_modules or browser binaries. Extraction makes zero LLM API
calls; the surrounding agent conversation still uses model tokens.
