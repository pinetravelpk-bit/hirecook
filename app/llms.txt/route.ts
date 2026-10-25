import { entries, groups, titleCase, buildPage } from '@/lib/content';
import { site, registrations } from '@/lib/site';

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
    `- Office: ${site.addressLine}, Pakistan`,
    '- Islamabad & Rawalpindi: all cook services (home cooks, male cooks, chefs, restaurant, office and event cooks) in 66 sectors and societies',
    '- Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad, Quetta: male cooks only (home, full-time, part-time, live-in)',
    `- [Cities](${site.url}/cities)`,
    `- Phone (calls): ${site.phone}`,
    `- WhatsApp: ${site.whatsappDisplay}`,
    `- Email: ${site.email}`,
    `- Hours: ${site.hours.label}`,
    '- Process: share requirements → shortlist in 24–48 hours → trial cook at home → hire with written terms',
    '- Screening: CNIC details, previous-employer references, practical trial cook',
    '',
    '## Registrations',
    ...registrations.map((r) => `- ${r.title} (${r.sub})`),
    '',
    '## Main pages',
    `- [Hire a cook](${site.url}/hire): online hiring request form`,
    `- [All services](${site.url}/services)`,
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
