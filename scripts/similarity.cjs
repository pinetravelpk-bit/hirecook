// Near-duplicate check between sibling keyword pages (5-word shingles, Jaccard): `node scripts/similarity.cjs`
const fs = require('fs');
const kw = require(require('path').resolve('lib/keywords.json'));
const words = (slug) => {
  let h = fs.readFileSync(`.next/server/app/${slug}.html`, 'utf8');
  h = h.match(/<main[\s\S]*<\/main>/)[0].replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').toLowerCase();
  return h.split(/\s+/).filter((w) => /[a-z0-9]/.test(w));
};
const shingles = (w) => { const s = new Set(); for (let i = 0; i < w.length - 4; i++) s.add(w.slice(i, i + 5).join(' ')); return s; };
const cache = new Map();
const sim = (a, b) => {
  for (const x of [a, b]) if (!cache.has(x)) cache.set(x, shingles(words(x)));
  const A = cache.get(a), B = cache.get(b);
  let i = 0; for (const x of A) if (B.has(x)) i++;
  return i / (A.size + B.size - i);
};
const pairs = [
  ['hire-cook-in-islamabad', 'cook-in-islamabad'], ['male-cook-in-clifton-karachi', 'hire-male-cook-in-dha-defence-karachi'],
  ['male-cook-in-karachi', 'male-cook-in-lahore'], ['bbq-chef-islamabad', 'pastry-chef-islamabad'], ['hire-cook-in-g-9-islamabad', 'hire-cook-in-g-6-islamabad'],
  ['male-cook-in-islamabad', 'male-cooks-in-islamabad'], ['home-chef-islamabad', 'home-chefs-islamabad'], ['full-time-cook-islamabad', 'hire-full-time-cook-islamabad'],
];
// plus consecutive pairs within each group of the original keyword list
for (let i = 0; i + 1 < kw.length; i += 6) if (kw[i].group === kw[i + 1].group) pairs.push([kw[i].slug, kw[i + 1].slug]);
const vals = pairs.map(([a, b]) => [a, b, sim(a, b)]);
vals.sort((x, y) => y[2] - x[2]);
const avg = vals.reduce((s, v) => s + v[2], 0) / vals.length;
console.log(`pairs ${vals.length} | average overlap ${(avg * 100).toFixed(0)}% | highest ${(vals[0][2] * 100).toFixed(0)}%`);
for (const [a, b, v] of vals.slice(0, 6)) console.log(`${(v * 100).toFixed(0)}%  ${a}  vs  ${b}`);
