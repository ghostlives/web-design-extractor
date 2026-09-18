import { it, expect } from 'vitest';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

it('installs a complete runtime for each agent and refuses overwrite', async () => {
  const project = await mkdtemp(join(tmpdir(), 'wde-install-test-'));
  for (const [agent, folder] of [['claude', '.claude'], ['codex', '.agents'], ['copilot', '.github']]) {
    const args = ['scripts/install-skill.mjs', agent, 'project', project];
    execFileSync(process.execPath, args);
    const target = join(project, folder, 'skills/web-design-extractor');
    expect(await readFile(join(target, 'dist/cli.js'), 'utf8')).toContain('capture');
    expect(await readFile(join(target, 'SKILL.md'), 'utf8')).toContain('name: web-design-extractor');
    expect(() => execFileSync(process.execPath, args, { stdio: 'pipe' })).toThrow();
  }
});
