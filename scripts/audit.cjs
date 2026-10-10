// Post-build SEO audit: run `node scripts/audit.cjs` after `next build`.
// Checks every target keyword has a page whose H1 is the keyword, titles/descriptions are unique,
// and every internal link points to a built route.
const fs = require('fs'), path = require('path');
const root = '.next/server/app';
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) files.push(p); } })(root);
const rel = (f) => '/' + path.relative(root, f).split(path.sep).filter((x) => !/^\(.*\)$/.test(x)).join('/').replace(/\.html$/, '').replace(/^index$/, '');
const routes = new Set(files.map(rel));
['/', '/sitemap.xml', '/robots.txt', '/llms.txt', '/llms-full.txt', '/manifest.webmanifest', '/opengraph-image', '/icon.svg', '/apple-icon.png', '/admin', '/admin/login', '/hire'].forEach((r) => routes.add(r));
const titles = {}, descs = {}, bad = new Set();
let h1s = 0;
for (const f of files) {
  const h = fs.readFileSync(f, 'utf8'); const r = rel(f);
  if (r === '/_not-found') continue;
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1];
  const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  (titles[t] = titles[t] || []).push(r); (descs[d] = descs[d] || []).push(r);
  if (/<h1[^>]*>/.test(h)) h1s++;
  for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) {
    const u = m[1].replace(/\/$/, '') || '/';
    if (/^\/(_next|images|icon|manifest|apple)/.test(u)) continue;
    if (!routes.has(u)) bad.add(u + ' <- ' + r);
  }
}
const kw = require(path.resolve('lib/keywords.json'));
let mism = 0;
for (const e of kw) {
  const f = path.join(root, e.slug + '.html');
  if (!fs.existsSync(f)) { console.log('MISSING', e.slug); mism++; continue; }
  const h1 = ((fs.readFileSync(f, 'utf8').match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '').replace(/&amp;/g, '&');
  if (h1.toLowerCase() !== e.keyword.toLowerCase().replace(/\s+/g, ' ')) { mism++; console.log('H1 mismatch', e.keyword, '|', h1); }
}
console.log('html pages', files.length, '| pages with H1', h1s, '| your 177 keywords: H1 mismatches', mism);
console.log('duplicate titles', Object.entries(titles).filter(([, v]) => v.length > 1).map(([k, v]) => k + ' => ' + v.join(',')));
console.log('duplicate descriptions', Object.entries(descs).filter(([, v]) => v.length > 1).map(([, v]) => v.join(',')));
console.log('broken internal links', [...bad].slice(0, 30));
