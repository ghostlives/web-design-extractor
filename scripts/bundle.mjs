import { cp, mkdir, readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'release');
const staging = await mkdtemp(join(tmpdir(), 'wde-bundle-'));
const skill = join(staging, 'web-design-extractor');
await mkdir(skill);
for (const file of ['SKILL.md', 'package.json', 'package-lock.json', 'LICENSE', 'dist']) {
  await cp(join(root, file), join(skill, file), { recursive: true });
}
await mkdir(join(skill, 'scripts'));
await cp(join(root, 'scripts/install-skill.mjs'), join(skill, 'scripts/install-skill.mjs'));
await mkdir(output, { recursive: true });
execFileSync('tar', ['-czf', join(output, 'web-design-extractor.tar.gz'), '-C', staging, 'web-design-extractor']);
execFileSync('zip', ['-qr', join(output, 'web-design-extractor.zip'), 'web-design-extractor'], { cwd: staging });
const { createHash } = await import('node:crypto');
const sums = await Promise.all(['web-design-extractor.tar.gz', 'web-design-extractor.zip'].map(async name =>
  `${createHash('sha256').update(await readFile(join(output, name))).digest('hex')}  ${name}`));
await writeFile(join(output, 'SHA256SUMS'), sums.join('\n') + '\n');
console.log(output);
