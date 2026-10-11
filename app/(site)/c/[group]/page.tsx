import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Photo from '@/components/Photo';
import Reveal from '@/components/Reveal';
import Cta from '@/components/Cta';
import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import HireForm from '@/components/HireForm';
import { entries, groups, buildPage } from '@/lib/content';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import Faq from '@/components/Faq';
import LongForm from '@/components/LongForm';
import { groupArticle } from '@/lib/hub-content';
import { site } from '@/lib/site';
import { cities } from '@/lib/cities';

export const dynamicParams = false;
export function generateStaticParams() {
  return groups.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ group: string }> }): Promise<Metadata> {
  const { group } = await params;
  const g = groups.find((x) => x.slug === group);
  if (!g) return {};
  return {
    title: `${g.title} | HireCook.pk`,
    description: g.intro,
    alternates: { canonical: `/c/${g.slug}` },
    openGraph: { title: g.title, description: g.intro, url: `/c/${g.slug}` },
  };
}

export default async function GroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  const g = groups.find((x) => x.slug === group);
  if (!g) notFound();
  const list = entries.filter((e) => e.group === g.name).map(buildPage);
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: g.title, path: `/c/${g.slug}` }];
  const article = groupArticle(g.slug);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: g.title,
    itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/${p.e.slug}`, name: p.H1 })),
  };
  return (
    <main id="main">
      <JsonLd data={[breadcrumbSchema(crumbs), itemList, faqSchema(article.faqs)]} />
      <section className="wrap section" style={{ paddingBottom: 24 }}>
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow">{list.length} services</p>
        <h1>{g.title}</h1>
        <p className="lead">{g.intro}</p>
        {cities.some((c) => c.slug === g.slug && !c.full) && <p className="scope-note" style={{ maxWidth: 820 }}>Outside Islamabad and Rawalpindi we currently provide male cooks only: home, full-time, part-time and live-in.</p>}
      </section>
      <section className="wrap" style={{ paddingBottom: 40 }}>
        <div className="grid-4">
          {list.map((p, i) => (
            <Reveal key={p.e.slug} delay={(i % 4) * 0.05}>
              <Link className="card" href={`/${p.e.slug}`} style={{ height: '100%' }}>
                <div className="media"><Photo k={p.image} sizes="(max-width: 820px) 100vw, 25vw" alt={p.H1} /></div>
                <div className="body">
                  <h3 style={{ fontSize: 18 }}>{p.H1}</h3>
                  <p>{p.area && p.area.name !== 'Rawalpindi' ? `${p.area.kind[0].toUpperCase() + p.area.kind.slice(1)} · ${p.area.city}` : `${p.sched ? p.sched.label + ' · ' : ''}Screened cooks · Trial first`}</p>
                  <span className="more">View service <ArrowRight size={15} /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="two-col">
          <div className="prose">
            <h2>Other categories</h2>
            <div className="chips">
              {groups.filter((x) => x.slug !== g.slug).map((x) => <Link key={x.slug} className="chip" href={`/c/${x.slug}`}>{x.title}</Link>)}
            </div>
          </div>
          <HireForm id="group-form" city={cities.find((c) => c.slug === g.slug)?.name || 'Islamabad'} />
        </div>
      </section>
      <LongForm a={article} title={g.title} />
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="faq-grid">
          <div><p className="eyebrow">FAQs</p><h2>{g.title}: common questions</h2></div>
          <Faq items={article.faqs} />
        </div>
      </section>
      <Cta />
    </main>
  );
}
