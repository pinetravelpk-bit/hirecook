import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldCheck, Clock3, MapPin, Wallet, CookingPot, RefreshCw, FileText, Phone } from 'lucide-react';
import Photo from '@/components/Photo';
import Reveal from '@/components/Reveal';
import Faq from '@/components/Faq';
import Cta from '@/components/Cta';
import HireForm from '@/components/HireForm';
import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import WaIcon from '@/components/WaIcon';
import { DayDonut, HiringTimeline } from '@/components/Infographics';
import { TrustRings } from '@/components/Coverage';
import Registrations from '@/components/Registrations';
import LongForm from '@/components/LongForm';
import { buildArticle } from '@/lib/longform';
import { entries, bySlug, buildPage, related, groups, groupSlug, areaEntry, titleCase } from '@/lib/content';
import { areas, areasOf } from '@/lib/areas';
import { site } from '@/lib/site';
import { breadcrumbSchema, faqSchema, howToSchema, servicePageSchema } from '@/lib/schema';
import { photoSrc } from '@/lib/images';

export const dynamicParams = false;
export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = bySlug(slug);
  if (!e) return {};
  const p = buildPage(e);
  return {
    title: p.title,
    description: p.description,
    keywords: [e.keyword, p.who + ' ' + p.city, 'hire cook ' + p.city, 'cook agency ' + p.city],
    alternates: { canonical: `/${e.slug}` },
    openGraph: { title: p.title, description: p.description, url: `/${e.slug}`, type: 'website', images: [{ url: photoSrc(p.image), width: 1400, height: 933, alt: p.H1 }] },
    twitter: { card: 'summary_large_image', title: p.title, description: p.description, images: [photoSrc(p.image)] },
  };
}

const whyIcons = [ShieldCheck, CookingPot, MapPin, FileText, RefreshCw, Clock3];

export default async function KeywordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = bySlug(slug);
  if (!e) notFound();
  const p = buildPage(e);
  const grp = groups.find((g) => g.name === e.group)!;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: grp.title, path: `/c/${groupSlug(e.group)}` },
    { name: p.H1, path: `/${e.slug}` },
  ];
  const rel = related(e, 8);
  const isArea = p.isArea;
  const article = buildArticle(p);
  const allFaqs = [...p.faqs, ...article.faqs];
  const nearbyLinks = isArea
    ? p.area!.nearby.map((n) => areas.find((a) => a.name === n && a.city === p.area!.city) || areas.find((a) => a.name === n)).filter(Boolean).map((a) => ({ a: a!, e: areaEntry(a!.name, a!.city) })).filter((x) => x.e)
    : [];
  const cityList = p.nearMe ? [...areasOf('Islamabad').slice(0, 10), ...areasOf('Rawalpindi').slice(0, 8)] : p.cityAreaList;
  const waText = `Assalam o Alaikum HireCook.pk, I am interested in: ${p.H1}.`;
  const mapQ = encodeURIComponent(isArea ? `${p.area!.name}, ${p.area!.city}, Pakistan` : `${p.city.split(' & ')[0]}, Pakistan`);

  return (
    <main id="main">
      <JsonLd data={[...servicePageSchema(p), breadcrumbSchema(crumbs), faqSchema(allFaqs), howToSchema(`How to ${p.H1.toLowerCase().startsWith('hire') ? p.H1.toLowerCase() : 'hire a ' + p.who + ' in ' + p.place}`)]} />

      {/* HERO */}
      <section className="wrap svc-hero">
        <div className="hero-copy">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">{grp.name}{isArea ? ` · ${p.area!.city}` : ''}</p>
          <h1>{p.H1}</h1>
          <p className="lead">{p.intro}</p>
          <div className="actions">
            <a className="btn btn-primary" href="#hire-form">Hire Now <ArrowRight size={18} /></a>
            <a className="btn btn-wa" href={site.whatsappHref(waText)} target="_blank" rel="noopener"><WaIcon size={18} /> WhatsApp</a>
            <a className="btn btn-outline" href={site.phoneHref}><Phone size={17} /> Call</a>
          </div>
          <div className="trust">
            <span><ShieldCheck size={17} /> Screened cooks</span>
            <span><Clock3 size={17} /> 24–48h shortlist</span>
            <span><Wallet size={17} /> Trial cook first</span>
          </div>
        </div>
        <div className="media">
          <Photo k={p.image} priority alt={`${p.H1}: ${p.who} cooking`} sizes="(max-width: 820px) 100vw, 45vw" />
          <div className="float-card" style={{ left: 14, bottom: 14 }}>
            <span className="ic"><MapPin size={18} /></span>
            <span>{isArea ? p.area!.name : p.city}<small>{isArea ? p.area!.kind : p.outside ? `${p.cityInfo.province} · male cooks` : 'Islamabad & Rawalpindi'}</small></span>
          </div>
        </div>
      </section>

      {/* QUICK ANSWER + FACTS (AEO / GEO) */}
      <section className="wrap" style={{ paddingBottom: 20 }}>
        <div className="two-col">
          <Reveal>
            <div className="quick-answer">
              <h2>Quick answer</h2>
              <p>{p.quickAnswer}</p>
            </div>
            {p.outside && <p className="scope-note"><MapPin size={16} /> {p.scopeNote}</p>}
            <p style={{ marginTop: 18 }}>{p.localLine}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="facts" aria-label="Service summary">
              {p.facts.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* DUTIES + FORM */}
      <section className="wrap section">
        <div className="two-col">
          <div>
            <Reveal>
              <p className="eyebrow">What the cook does</p>
              <h2>Duties of a {p.who}{isArea ? ` in ${p.area!.name}` : ''}</h2>
              <ul className="ticks">
                {p.tasks.map((t) => <li key={t}><CheckCircle2 size={18} /> {t}</li>)}
              </ul>
            </Reveal>
            <Reveal>
              <h3>Dishes our {p.whoPlural} cook</h3>
              <div className="dish-chips">{p.dishes.map((d) => <span key={d}>{d}</span>)}</div>
            </Reveal>
            <Reveal>
              <h3 style={{ marginTop: 28 }}>Working arrangement</h3>
              <p>{p.scheduleText}</p>
              <h3>Screening &amp; trust</h3>
              <p>{p.checks}</p>
            </Reveal>
          </div>
          <aside className="sticky-aside">
            <HireForm service={p.H1} city={p.city} area={isArea ? p.area!.name : ''} />
          </aside>
        </div>
      </section>

      {/* INFOGRAPHICS */}
      <section className="section" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap">
          <div className="center" style={{ marginBottom: 26 }}>
            <p className="eyebrow">At a glance</p>
            <h2>{p.H1}: by the numbers</h2>
          </div>
          <div className="info-grid">
            <Reveal><DayDonut title={p.dayTitle} items={p.day} /></Reveal>
            <Reveal delay={0.1}><TrustRings title={`Every ${p.who} is checked 4 ways`} /></Reveal>
          </div>
          <div style={{ marginTop: 20 }}><Reveal><HiringTimeline /></Reveal></div>
        </div>
      </section>

      {/* WHY US */}
      <section className="wrap section">
        <div className="head-row">
          <div><p className="eyebrow">Why HireCook.pk</p><h2>Hire with confidence.</h2></div>
          <p>A cook works inside your home, so we focus on trust, fit and clear terms.</p>
        </div>
        <div className="why-grid">
          {p.why.map((w, i) => {
            const I = whyIcons[i];
            return (
              <Reveal className="why" key={w.t} delay={(i % 3) * 0.08}>
                <span className="ic"><I size={22} /></span>
                <div><h3>{w.t}</h3><p>{w.d}</p></div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <LongForm a={article} title={p.H1} />

      <Registrations />

      {/* LOCAL */}
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="two-col">
          <Reveal>
            <p className="eyebrow">Local service</p>
            <h2>{isArea ? `${p.outside ? 'Male cook' : 'Cook'} services in ${p.area!.name}, ${p.area!.city}` : `Areas we cover${p.city.includes('&') ? '' : ' in ' + p.city}`}</h2>
            {isArea ? (
              <>
                <p>{p.area!.blurb}</p>
                <p>Typical homes here: {p.area!.homes}. Our cooks know the area around <strong>{p.area!.landmarks.join(', ')}</strong>, so daily commutes stay short and punctual.</p>
                {nearbyLinks.length > 0 && (
                  <>
                    <h3>Nearby areas</h3>
                    <div className="chips">{nearbyLinks.map(({ a, e: ne }) => <Link className="chip" key={ne!.slug} href={`/${ne!.slug}`}>{titleCase(ne!.keyword)}</Link>)}</div>
                  </>
                )}
              </>
            ) : (
              <>
                <p>We place cooks across {p.city}. Pick your area for local details:</p>
                <div className="chips">
                  {cityList.map((a) => {
                    const ae = areaEntry(a.name, a.city);
                    return ae ? <Link className="chip" key={ae.slug} href={`/${ae.slug}`}>{a.name}</Link> : null;
                  })}
                </div>
              </>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <div className="map-wrap">
              <iframe title={`Map of ${isArea ? p.area!.name : p.city}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://maps.google.com/maps?q=${mapQ}&z=${isArea ? 14 : 11}&output=embed`} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="faq-grid">
          <div>
            <p className="eyebrow">FAQs</p>
            <h2>{p.H1}: questions answered</h2>
            <p>Still unsure? Talk to us on WhatsApp. We reply quickly during working hours.</p>
            <a className="btn btn-wa" href={site.whatsappHref(waText)} target="_blank" rel="noopener"><WaIcon size={18} /> Ask on WhatsApp</a>
          </div>
          <Faq items={allFaqs} />
        </div>
      </section>

      {/* RELATED */}
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <p className="eyebrow">Related cook services</p>
        <h2>You may also need</h2>
        <div className="related">
          {rel.map((r) => (
            <Link key={r.slug} href={`/${r.slug}`}>
              <span><small>{r.group}</small>{titleCase(r.keyword)}</span>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 18 }}><Link className="link-arrow" href={`/c/${groupSlug(e.group)}`}>All {grp.title} <ArrowRight size={16} /></Link></p>
      </section>

      <Cta title={`Ready to ${p.H1.toLowerCase().startsWith('hire') ? p.H1.toLowerCase() : 'hire a ' + p.who}?`} wa={waText} />
    </main>
  );
}
