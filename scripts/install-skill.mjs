import { cp, mkdir, access } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { homedir } from 'node:os';

// Does not execute package scripts, download dependencies, or overwrite installations.
export async function install(agent, scope = 'project', base = process.cwd()) {
  const project = { claude: '.claude/skills', codex: '.agents/skills', copilot: '.github/skills' };
  const user = { claude: '.claude/skills', codex: '.agents/skills', copilot: '.copilot/skills' };
  if (!['project', 'user'].includes(scope) || !Object.hasOwn(project, agent)) {
    throw new Error('Usage: node scripts/install-skill.mjs <claude|codex|copilot> [project|user] [project-directory]');
  }
  const source = resolve(import.meta.dirname, '..');
  const target = join(scope === 'user' ? homedir() : resolve(base), (scope === 'user' ? user : project)[agent], 'web-design-extractor');
  await access(join(source, 'dist/cli.js'));
  try { await access(target); throw new Error(`Installation already exists: ${target}. Move it aside before upgrading.`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(dirname(target), { recursive: true });
  await mkdir(target);
  for (const file of ['SKILL.md', 'package.json', 'package-lock.json', 'LICENSE', 'dist']) {
    await cp(join(source, file), join(target, file), { recursive: true, errorOnExist: true, force: false });
  }
  console.log(`Installed: ${target}\nSetup: npm --prefix "${target}" ci --omit=dev\nThen: cd "${target}" && npx playwright install chromium`);
  return target;
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  install(...process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
}
