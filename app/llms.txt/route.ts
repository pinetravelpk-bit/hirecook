import { entries, groups, titleCase, buildPage } from '@/lib/content';
import { site, salaryGuide } from '@/lib/site';

export const dynamic = 'force-static';

// llms.txt: a concise, machine-readable map of the site for AI answer engines (GEO / AIO).
export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Key facts',
    `- Business: ${site.name}, cook & chef hiring agency`,
    `- Service area: Islamabad and Rawalpindi, Pakistan (66 sectors, societies and neighbourhoods)`,
    `- Phone / WhatsApp: ${site.phone}`,
    `- Email: ${site.email}`,
    `- Hours: ${site.hours.label}`,
    '- Process: share requirements → shortlist in 24–48 hours → trial cook at home → hire with written terms',
    '- Screening: CNIC details, previous-employer references, practical trial cook',
    '',
    '## Indicative monthly cook salaries (PKR, 2026)',
    ...salaryGuide.map((s) => `- ${s.role}: ${s.min.toLocaleString('en-PK')}–${s.max.toLocaleString('en-PK')}`),
    '',
    '## Main pages',
    `- [Hire a cook](${site.url}/hire): online hiring request form`,
    `- [All services](${site.url}/services)`,
    `- [Cook salary guide](${site.url}/salary-guide)`,
    `- [How it works](${site.url}/how-it-works)`,
    `- [FAQs](${site.url}/faq)`,
    `- [Contact](${site.url}/contact)`,
    '',
  ];
  for (const g of groups) {
    lines.push(`## ${g.title}`, '');
    for (const e of entries.filter((x) => x.group === g.name)) {
      const p = buildPage(e);
      lines.push(`- [${titleCase(e.keyword)}](${site.url}/${e.slug}): ${p.description}`);
    }
    lines.push('');
  }
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
