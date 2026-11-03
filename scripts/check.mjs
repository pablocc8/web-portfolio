// Comprobaciones sin dependencias sobre todo lo que publica el workflow (site/):
// enlaces y recursos internos (html y css), anclas, y lista de marcadores pendientes.
// Uso: node scripts/check.mjs   (falla si hay enlaces rotos; los marcadores solo se listan)
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';

const dir = new URL('../site/', import.meta.url).pathname;
const BASE = '/web-portfolio/'; // 404.html usa la ruta base de Pages

const walk = d => readdirSync(d).flatMap(f => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(dir);
const rel = p => relative(dir, p);
const htmlFiles = files.filter(f => f.endsWith('.html'));
const ids = new Map(htmlFiles.map(f => [f, new Set([...readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]))]));

let broken = 0;
const bad = (kind, f, u) => { console.error(`${kind} ${rel(f)}: ${u}`); broken++; };

function resolveUrl(from, url) {
  if (url.startsWith(BASE)) return resolve(dir, url.slice(BASE.length) || '.');
  return resolve(dirname(from), url || '.');
}
function check(from, raw, isHtml) {
  if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(raw) || raw === '') return;
  const [path, hash] = raw.split(/#(.*)/s);
  let target = path === '' ? from : resolveUrl(from, path);
  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
  if (!existsSync(target)) return bad('ROTO ', from, raw);
  if (isHtml && hash && target.endsWith('.html') && !ids.get(target)?.has(hash)) bad('ANCLA', from, raw);
}

for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) check(f, m[1].replaceAll('&amp;', '&'), true);
}
for (const f of files.filter(f => f.endsWith('.css'))) {
  for (const m of readFileSync(f, 'utf8').matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]+))\s*\)/g)) check(f, m[1] ?? m[2] ?? m[3], false);
}

const markers = new Map();
for (const f of files.filter(f => /\.(html|js|css|xml|txt)$/.test(f))) {
  for (const m of readFileSync(f, 'utf8').matchAll(/\[\[[A-Z0-9_]+\]\]|TODO_[A-Z0-9_]+/g)) {
    markers.set(m[0], (markers.get(m[0]) ?? new Set()).add(rel(f)));
  }
}
console.log('\nMarcadores pendientes:');
for (const [k, v] of [...markers].sort()) console.log(`  ${k}  →  ${[...v].join(', ')}`);
console.log(`\nArchivos revisados: ${htmlFiles.length} html, ${files.filter(f => f.endsWith('.css')).length} css`);
console.log(broken ? `${broken} problema(s) en enlaces` : 'Enlaces, recursos y anclas internos: OK');
process.exit(broken ? 1 : 0);
