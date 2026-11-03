// Comprobaciones sin dependencias: enlaces internos, anclas y marcadores.
// Uso: node scripts/check.mjs   (falla si hay enlaces rotos; los marcadores solo se listan)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = new URL('../site/', import.meta.url).pathname;
const pages = readdirSync(dir).filter(f => f.endsWith('.html'));
const ids = {};
for (const p of pages) ids[p] = new Set([...readFileSync(join(dir, p), 'utf8').matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));

let broken = 0;
const markers = new Map();
for (const p of pages) {
  const html = readFileSync(join(dir, p), 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let url = m[1];
    if (url.startsWith('/web-portfolio/')) url = url.slice('/web-portfolio/'.length) || './'; // 404.html usa la ruta base de Pages
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [file, hash] = url.split('#');
    const target = file === '' ? p : (file === './' ? 'index.html' : file);
    if (!existsSync(join(dir, target))) { console.error(`ROTO  ${p}: ${url}`); broken++; continue; }
    if (hash && target.endsWith('.html') && !ids[target]?.has(hash) && !/^TODO_/.test(hash)) { console.error(`ANCLA ${p}: ${url}`); broken++; }
  }
}
for (const f of [...pages, 'sitemap.xml', 'robots.txt']) {
  const txt = readFileSync(join(dir, f), 'utf8');
  for (const m of txt.matchAll(/\[\[[A-Z0-9_]+\]\]|TODO_[A-Z0-9_]+/g)) {
    markers.set(m[0], (markers.get(m[0]) ?? new Set()).add(f));
  }
}
console.log('\nMarcadores pendientes:');
for (const [k, v] of [...markers].sort()) console.log(`  ${k}  →  ${[...v].join(', ')}`);
console.log(`\n${broken ? broken + ' problema(s) en enlaces' : 'Enlaces internos y anclas: OK'}`);
process.exit(broken ? 1 : 0);
