import { site, registrations } from '@/lib/site';
import { cities } from '@/lib/cities';

/** "At a glance" fact sheet: short, quotable facts for search engines and AI answers. */
export default function Facts({ heading = true }: { heading?: boolean }) {
  const outside = cities.filter((c) => !c.full).map((c) => c.name).join(', ');
  const rows: [string, React.ReactNode][] = [
    ['Business', 'HireCook.pk, a cook and chef hiring agency'],
    ['Office', <a key="a" href={site.directionsUrl} target="_blank" rel="noopener">{site.addressLine}, Pakistan</a>],
    ['Calls', <a key="p" href={site.phoneHref}>{site.phone}</a>],
    ['WhatsApp', <a key="w" href={site.whatsappHref()} target="_blank" rel="noopener">{site.whatsappDisplay}</a>],
    ['Hours', site.hours.label],
    ['All services', 'Islamabad and Rawalpindi: home cooks, male cooks, private chefs, cuisine specialists, restaurant, office and event cooks'],
    ['Male cooks', outside],
    ['Schedules', 'Full-time, part-time, live-in, live-out, hourly, morning, evening and weekend'],
    ['Screening', 'CNIC details, previous-employer references and a trial cook at your home'],
    ['Shortlist time', 'Usually 24–48 hours'],
    ['Registrations', registrations.map((r) => r.title.replace('Registered with ', '')).join(' · ')],
    ['Powered by', <a key="r" href={site.poweredBy.url} target="_blank" rel="noopener">{site.poweredBy.name}</a>],
  ];
  return (
    <section className="wrap section" aria-labelledby="facts-title" style={{ paddingTop: heading ? undefined : 0 }}>
      {heading && (
        <div className="center" style={{ marginBottom: 22 }}>
          <p className="eyebrow">Fact sheet</p>
          <h2 id="facts-title">HireCook.pk at a glance</h2>
        </div>
      )}
      <dl className="facts facts-wide">
        {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </section>
  );
}
