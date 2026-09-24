import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
const allowed = new Set(['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.ico', '.woff', '.woff2']);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

async function copy(relative) {
  const target = join(output, relative);
  await mkdir(dirname(target), { recursive: true });
  await cp(join(root, relative), target);
}

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isFile() && allowed.has(extname(entry.name))) await copy(entry.name);
}
for (const directory of ['assets']) {
  for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
    if (entry.isFile() && allowed.has(extname(entry.name))) await copy(join(directory, entry.name));
  }
}
for (const file of ['_headers']) await copy(file);

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
const tournamentSlug = process.env.NTUCUP_TOURNAMENT_SLUG || 'ntu-cup';
await writeFile(join(output, 'runtime-config.js'), `window.NTUCUP_CONFIG = Object.freeze(${JSON.stringify({
  supabaseUrl,
  supabasePublishableKey,
  tournamentSlug
}, null, 2)});\n`, 'utf8');

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Supabase runtime configuration is empty. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Cloudflare Pages.');
}
console.log('Public results site ready in dist/.');
