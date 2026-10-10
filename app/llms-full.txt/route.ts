import { entries, titleCase, buildPage } from '@/lib/content';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

// Full-text version for AI engines: quick answer + FAQs for every service page.
export function GET() {
  const out: string[] = [`# ${site.name}: full service reference`, '', site.description, ''];
  for (const e of entries) {
    const p = buildPage(e);
    out.push(`## ${titleCase(e.keyword)}`, `URL: ${site.url}/${e.slug}`, '', p.quickAnswer, '', p.intro, '');
    for (const f of p.faqs) out.push(`Q: ${f.q}`, `A: ${f.a}`, '');
  }
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
