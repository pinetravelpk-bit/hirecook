// Sanity check for generated keyword pages: unique slugs/titles, correct city & area detection.
// Run: npx tsx scripts/check-pages.ts
import { entries, buildPage } from '../lib/content';

const slugs = new Set<string>();
const titles = new Map<string, string>();
let bad = 0;
for (const e of entries) {
  if (slugs.has(e.slug)) { console.log('DUP SLUG', e.slug); bad++; }
  slugs.add(e.slug);
  const p = buildPage(e);
  if (titles.has(p.title)) { console.log('DUP TITLE', p.title, e.slug, titles.get(p.title)); bad++; }
  titles.set(p.title, e.slug);
  if (e.group.startsWith('Male cooks in ')) {
    const city = e.group.replace('Male cooks in ', '');
    if (p.city !== city) { console.log('CITY', e.keyword, p.city); bad++; }
    const isCityLevel = e.keyword.toLowerCase().endsWith(' ' + city.toLowerCase()) && !p.isArea;
    const expectsArea = !/^(Male Cook in|Hire Male Cook in|Male Home Cook|Male Cook for Home|Full Time Male Cook|Part Time Male Cook|Live In Male Cook|Male Cook Agency) [A-Za-z]+$/.test(e.keyword);
    if (expectsArea && !p.isArea) { console.log('NO AREA', e.keyword); bad++; }
    if (!expectsArea && !isCityLevel) { console.log('UNEXPECTED AREA', e.keyword, p.area?.name); bad++; }
    if (!p.outside || !p.male) { console.log('SCOPE', e.keyword); bad++; }
  }
}
const outside = entries.filter((e) => e.group.startsWith('Male cooks in '));
console.log(`total pages ${entries.length}, new city pages ${outside.length}, problems ${bad}`);
console.log(outside.slice(0, 3).map((e) => `${e.keyword} -> /${e.slug}`).join('\n'));
const sample = buildPage(outside.find((e) => e.slug.includes('clifton'))!);
console.log(sample.title, '|', sample.description, '|', sample.localLine.slice(0, 80));
