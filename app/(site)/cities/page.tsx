import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import CityGrid from '@/components/CityGrid';
import Cta from '@/components/Cta';
import { cities } from '@/lib/cities';
import { areasOf } from '@/lib/areas';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import Faq from '@/components/Faq';
import LongForm from '@/components/LongForm';
import { citiesArticle } from '@/lib/hub-content';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Hire Male Cooks Across Pakistan: 10 Cities | HireCook.pk',
  description: 'All cook services in Islamabad and Rawalpindi, plus experienced male cooks in Karachi, Lahore, Faisalabad, Gujranwala, Peshawar, Multan, Hyderabad and Quetta.',
  alternates: { canonical: '/cities' },
};

export default function CitiesPage() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Cities', path: '/cities' }];
  const article = citiesArticle();
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HireCook.pk cities',
    itemListElement: cities.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: `${c.full ? 'Cooks' : 'Male cooks'} in ${c.name}`, url: `${site.url}/c/${c.slug}` })),
  };
  return (
    <main id="main">
      <JsonLd data={[breadcrumbSchema(crumbs), list, faqSchema(article.faqs)]} />
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
      <LongForm a={article} title="cooks across Pakistan" />
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="faq-grid">
          <div><p className="eyebrow">FAQs</p><h2>Cities: common questions</h2></div>
          <Faq items={article.faqs} />
        </div>
      </section>
      <Cta />
    </main>
  );
}
