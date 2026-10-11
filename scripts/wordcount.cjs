// Counts words in the <main> content of every built keyword page: `node scripts/wordcount.cjs`
const fs = require('fs'), path = require('path');
const root = '.next/server/app';
const skip = new Set(['index', '_not-found', 'about', 'contact', 'faq', 'hire', 'how-it-works', 'privacy', 'terms', 'services', 'cities', '_global-error']);
const rows = [];
for (const f of fs.readdirSync(root)) {
  if (!f.endsWith('.html')) continue;
  const slug = f.replace(/\.html$/, '');
  if (skip.has(slug)) continue;
  let h = fs.readFileSync(path.join(root, f), 'utf8');
  const m = h.match(/<main[\s\S]*<\/main>/);
  h = (m ? m[0] : h).replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
  rows.push([slug, h.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length]);
}
rows.sort((a, b) => a[1] - b[1]);
const n = rows.map((r) => r[1]);
console.log(`pages ${rows.length} | min ${n[0]} | median ${n[Math.floor(n.length / 2)]} | max ${n[n.length - 1]} | under 2000: ${n.filter((x) => x < 2000).length}`);
console.log('lowest:', rows.slice(0, 5).map((r) => r.join(' ')).join(' | '));
