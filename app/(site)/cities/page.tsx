import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import CityGrid from '@/components/CityGrid';
import Cta from '@/components/Cta';
import { cities } from '@/lib/cities';
import { areasOf } from '@/lib/areas';
import { breadcrumbSchema } from '@/lib/schema';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Hire Male Cooks Across Pakistan: 10 Cities | HireCook.pk',
  description: 'All cook services in Islamabad and Rawalpindi, plus experienced male cooks in Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta.',
  alternates: { canonical: '/cities' },
};

export default function CitiesPage() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Cities', path: '/cities' }];
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HireCook.pk cities',
    itemListElement: cities.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.full ? 'Cooks' : 'Male cooks'} in ${c.name}`, url: `${site.url}/c/${c.slug}` })),
  };
  return (
    <main id="main">
      <JsonLd data={[breadcrumbSchema(crumbs), list]} />
      <section className="wrap section" style={{ paddingBottom: 24 }}>
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow">10 cities</p>
        <h1>Cooks across Pakistan</h1>
        <div className="quick-answer" style={{ maxWidth: 860 }}>
          <h2>Quick answer</h2>
          <p>HireCook.pk offers <strong>every cook service</strong> (home cooks, chefs, restaurant, office and event cooks) in <strong>Islamabad and Rawalpindi</strong>. In <strong>Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta</strong> we currently provide <strong>male cooks</strong>: home, full-time, part-time and live-in.</p>
        </div>
      </section>
      <section className="wrap" style={{ paddingBottom: 40 }}>
        <CityGrid />
      </section>
      <section className="wrap section prose" style={{ paddingTop: 0 }}>
        <h2>Areas by city</h2>
        {cities.map((c) => (
          <p key={c.name}>
            <Link href={`/c/${c.slug}`} style={{ color: 'var(--orange)', fontWeight: 700 }}>{c.name}</Link>: {areasOf(c.name).map((a) => a.name).join(', ')}.
          </p>
        ))}
      </section>
      <Cta />
    </main>
  );
}
