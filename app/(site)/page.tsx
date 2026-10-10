import Link from 'next/link';
import { ArrowRight, ShieldCheck, Clock3, Star, MapPin, ClipboardList, Users, CookingPot, BadgeCheck, UserCheck, Utensils, Phone, Leaf } from 'lucide-react';
import Photo from '@/components/Photo';
import Finder from '@/components/Finder';
import Reveal from '@/components/Reveal';
import Counter from '@/components/Counter';
import Faq from '@/components/Faq';
import Cta from '@/components/Cta';
import HireForm from '@/components/HireForm';
import JsonLd from '@/components/JsonLd';
import WaIcon from '@/components/WaIcon';
import { DayDonut, HiringTimeline, CoverageBars } from '@/components/Infographics';
import { CoverageMap, TrustRings } from '@/components/Coverage';
import Registrations from '@/components/Registrations';
import { site, stats } from '@/lib/site';
import { islamabadAreas, rawalpindiAreas } from '@/lib/areas';
import { entries, groups, areaEntry } from '@/lib/content';
import { faqSchema, howToSchema } from '@/lib/schema';
import type { PhotoKey } from '@/lib/images';
import type { Metadata } from 'next';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const services: [string, string, string, PhotoKey][] = [
  ['Home Cook', 'Delicious everyday desi meals for your family.', 'home-cook-islamabad', 'hero-chef'],
  ['Male Cook', 'Experienced male cooks for homes & dawats.', 'male-cook-in-islamabad', 'male-chef'],
  ['Restaurant Chef', 'Line cooks & chefs for restaurants and cafés.', 'hire-restaurant-chef-islamabad', 'restaurant-chefs'],
  ['Office Cook', 'Fresh staff lunches, canteens and messes.', 'hire-office-cook-islamabad', 'office-meals'],
  ['Event & Catering Chef', 'Weddings, parties, birthdays and dawats.', 'hire-catering-chef-islamabad', 'buffet'],
  ['Full-Time Cook', 'Dedicated cook for all daily meals.', 'full-time-cook-islamabad', 'chef-chopping'],
  ['Part-Time Cook', 'Lunch & dinner in 2–5 hours a day.', 'part-time-cook-islamabad', 'dough'],
  ['Live-In Cook', 'Resident cook with accommodation.', 'live-in-cook-islamabad', 'busy-kitchen'],
];
const cuisines: [string, string, PhotoKey][] = [
  ['Pakistani & Desi Cook', 'desi-cook-islamabad', 'desi-spread'],
  ['BBQ & Tandoor Cook', 'bbq-chef-islamabad', 'bbq'],
  ['Biryani & Karahi Cook', 'biryani-cook-islamabad', 'biryani'],
  ['Chinese Chef', 'chinese-chef-islamabad', 'chinese'],
  ['Continental Chef', 'continental-chef-islamabad', 'continental'],
  ['Baker & Pastry Chef', 'pastry-chef-islamabad', 'pastry'],
  ['Pizza Chef', 'pizza-chef-islamabad', 'pizza'],
  ['Healthy Meal Prep Chef', 'meal-prep-chef-islamabad', 'meal-prep'],
  ['Diet Food Chef', 'diet-food-chef-islamabad', 'healthy'],
  ['Roti Maker', 'roti-maker-islamabad', 'roti'],
  ['Tandoor Cook', 'tandoor-cook-islamabad', 'tandoor'],
  ['Private Chef', 'hire-private-chef-islamabad', 'chef-herb'],
];

const homeFaqs = [
  { q: 'How can I hire a cook in Islamabad?', a: `Call or WhatsApp HireCook.pk on ${site.phone}, or fill in the online hire form. Share your area, cuisine, family size, timings and budget. We shortlist screened cooks within 24–48 hours, arrange a trial cook at your home, and you hire only when you are satisfied.` },
  { q: 'Is HireCook.pk a registered agency?', a: 'Yes. HireCook.pk is registered with SECP, holds an FBR tax registration (NTN), and is registered with the Labour Department and PESSI (Punjab Employees Social Security Institution).' },
  { q: 'Can I hire a male cook for my home?', a: 'Yes. Most of our home cooks are experienced male cooks who prepare daily desi food, roti, BBQ and dawat menus. You can choose full-time, part-time, live-in or live-out.' },
  { q: 'Do you provide cooks in Rawalpindi too?', a: 'Yes. We cover Saddar, Satellite Town, Chaklala, all Bahria Town phases, DHA, Askari societies, Westridge, Adiala Road and more across Rawalpindi.' },
  { q: 'Are your cooks verified?', a: 'We collect CNIC details and previous-employer references before introducing a cook, and you take a trial cook before hiring. For live-in staff we also recommend police verification through ICT Police or Punjab Police.' },
  { q: 'Do you provide restaurant, office and event cooks?', a: 'Yes. We place restaurant and hotel chefs, office and canteen cooks, mess and hostel cooks, guest house cooks, and wedding, party, birthday and dawat cooks.' },
];

export default function Home() {
  const countBy = (g: string) => entries.filter((e) => e.group === g).length;
  return (
    <main id="main">
      <JsonLd data={[faqSchema(homeFaqs), howToSchema('How to hire a cook in Islamabad')]} />

      {/* HERO */}
      <section className="hero">
        <Leaf className="leaf" size={180} style={{ left: -40, top: 60 }} aria-hidden />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Home · Restaurant · Office · Events</p>
            <h1>Hire a Cook in Islamabad <span className="accent">&amp; Rawalpindi.</span></h1>
            <p className="lead">The right cook for every kitchen. Hire screened <strong>male cooks</strong>, home cooks and professional chefs. Full-time, part-time or live-in, with a trial cook before you decide.</p>
            <div className="actions">
              <Link className="btn btn-primary" href="/hire">Find My Cook <ArrowRight size={18} /></Link>
              <a className="btn btn-wa" href={site.whatsappHref()} target="_blank" rel="noopener"><WaIcon size={18} /> WhatsApp Us</a>
            </div>
            <div className="trust">
              <span><ShieldCheck size={17} /> CNIC &amp; reference checked</span>
              <span><Clock3 size={17} /> Shortlist in 24–48h</span>
              <span><Star size={17} /> Trial cook first</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="main"><Photo k="hero-chef" priority sizes="(max-width: 820px) 100vw, 55vw" pos="62% center" /></div>
            <div className="float-card" style={{ right: -10, top: 30 }}>
              <span className="ic"><Utensils size={18} /></span>
              <span>Your taste.<small>Your schedule.</small></span>
            </div>
            <div className="float-card green" style={{ left: -16, bottom: 28 }}>
              <span className="ic"><MapPin size={18} /></span>
              <span>66 areas<small>Islamabad &amp; Rawalpindi</small></span>
            </div>
          </div>
        </div>
        <div className="wrap"><Finder /></div>
      </section>

      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k} style={{ display: 'inline-flex', gap: 40 }}>
              {['Desi Cooks', 'Male Cooks', 'Private Chefs', 'BBQ & Tandoor', 'Live-In Cooks', 'Chinese Chefs', 'Continental Chefs', 'Wedding Chefs', 'Office Cooks', 'Pastry Chefs', 'Roti Makers', 'Meal Prep'].map((t) => <span key={t}>{t}</span>)}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="wrap section" id="services">
        <div className="head-row">
          <div><p className="eyebrow">Cook services</p><h2>Every type of cook. One place.</h2></div>
          <p>From home kitchens to restaurants, offices and events: hire professional male cooks for every need.</p>
        </div>
        <div className="grid-4 scroller">
          {services.map(([t, d, slug, img], i) => (
            <Reveal key={slug} delay={(i % 4) * 0.06}>
              <Link className="card" href={`/${slug}`} style={{ height: '100%' }}>
                <div className="media"><Photo k={img} sizes="(max-width: 820px) 75vw, 25vw" alt={`${t} in Islamabad`} /></div>
                <div className="body"><h3>{t}</h3><p>{d}</p><span className="more">Explore service <ArrowRight size={15} /></span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURE */}
      <section className="feature">
        <div className="media"><Photo k="restaurant-chefs" sizes="(max-width: 820px) 100vw, 55vw" alt="Experienced male cooks working together in a kitchen" /></div>
        <Reveal className="copy">
          <p className="eyebrow">Experienced · Professional · Reliable</p>
          <h2>Skilled male cooks for your kitchen.</h2>
          <p>From everyday family meals to busy commercial kitchens, tell us the experience, cuisine and cooking style you need. We match the cook to your family, not just the job.</p>
          <ul className="ticks">
            <li><BadgeCheck size={18} /> Desi, BBQ, Chinese &amp; continental specialists</li>
            <li><BadgeCheck size={18} /> Full-time, part-time, live-in &amp; live-out</li>
            <li><BadgeCheck size={18} /> Written duties, timings and off-days</li>
          </ul>
          <Link className="btn btn-primary" href="/c/male-cooks">Hire a Male Cook <ArrowRight size={18} /></Link>
        </Reveal>
      </section>

      {/* STATS */}
      <section className="wrap section">
        <div className="stats">
          {stats.map((s, i) => (
            <Reveal className="stat" key={s.label} delay={i * 0.08}>
              <Counter to={s.value} suffix={s.suffix} />
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <Registrations />

      {/* CUISINES */}
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="head-row">
          <div><p className="eyebrow">Our cuisines</p><h2>Find your cooking specialist.</h2></div>
          <p>Every cuisine. Every style. Hire a cook who already makes the dishes your family loves.</p>
        </div>
        <div className="grid-6 scroller sm">
          {cuisines.map(([t, slug, img], i) => (
            <Reveal key={slug} delay={(i % 6) * 0.05}>
              <Link className="card" href={`/${slug}`} style={{ height: '100%' }}>
                <div className="media" style={{ aspectRatio: '4/3' }}><Photo k={img} sizes="(max-width: 820px) 45vw, 17vw" alt={`${t} Islamabad`} /></div>
                <div className="body" style={{ padding: '12px 14px' }}><h3 style={{ fontSize: 16 }}>{t}</h3><span className="more">Explore <ArrowRight size={13} /></span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INFOGRAPHICS */}
      <section className="section" style={{ background: 'var(--cream-2)' }}>
        <div className="wrap">
          <div className="center" style={{ marginBottom: 30 }}>
            <p className="eyebrow">Hiring at a glance</p>
            <h2>Know before you hire.</h2>
            <p className="lead">Our checks, schedules, coverage and the hiring journey at a glance.</p>
          </div>
          <div className="info-grid">
            <Reveal><HiringTimeline /></Reveal>
            <Reveal delay={0.1}><DayDonut title="A full-time cook's day" items={[{ label: 'Breakfast', h: 1.5 }, { label: 'Lunch', h: 2.5 }, { label: 'Tea & snacks', h: 1 }, { label: 'Dinner', h: 2.5 }, { label: 'Kitchen & groceries', h: 1.5 }]} /></Reveal>
            <Reveal><TrustRings /></Reveal>
            <Reveal delay={0.1}><CoverageBars rows={groups.map((g) => ({ label: g.title.replace(' in Islamabad', ''), value: countBy(g.name) })).sort((a, b) => b.value - a.value)} /></Reveal>
          </div>
          <div style={{ marginTop: 20 }}><Reveal><CoverageMap /></Reveal></div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="locations section" id="areas">
        <div className="wrap">
          <div className="center">
            <p className="eyebrow">Local cook services</p>
            <h2>Hire a cook in your neighbourhood.</h2>
            <p>Dedicated cook hiring across every sector and society of the twin cities.</p>
          </div>
          <div className="loc-grid">
            {([['Islamabad', islamabadAreas, 'islamabad', 'islamabad-areas'], ['Rawalpindi', rawalpindiAreas, 'rawalpindi', 'rawalpindi-areas']] as const).map(([city, list, img, g]) => (
              <Reveal className="loc-card" key={city}>
                <div className="loc-head">
                  <div className="thumb"><Photo k={img} sizes="90px" /></div>
                  <div><h3 style={{ margin: 0 }}>Cook Services in {city}</h3><p style={{ margin: 0 }}>{list.length} areas, one tap away.</p></div>
                </div>
                <div className="chips">
                  {list.map((a) => {
                    const e = areaEntry(a.name, a.city);
                    return e ? <Link className="chip" key={a.name} href={`/${e.slug}`}>{a.name}</Link> : null;
                  })}
                </div>
                <Link className="link-arrow" href={`/c/${g}`}>View all {city} areas <ArrowRight size={16} /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL FEATURED */}
      <section className="wrap section" style={{ paddingBottom: 0 }}>
        <p className="eyebrow">Explore local cook services</p>
        <div className="grid-3 scroller">
          {([['Cook in F-10 Islamabad', 'hire-male-cook-in-f-10-islamabad', 'islamabad-aerial'], ['Cook in Bahria Town Phase 7', 'hire-cook-in-bahria-town-phase-7-rawalpindi', 'rawalpindi'], ['Cook in DHA Phase 2 Islamabad', 'male-cook-in-dha-phase-2-islamabad', 'islamabad']] as const).map(([t, slug, img]) => (
            <Link key={slug} className="card" href={`/${slug}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <div className="media" style={{ width: 110, flex: 'none', aspectRatio: '1', borderRadius: 14, margin: 10 }}><Photo k={img} sizes="110px" /></div>
              <div className="body" style={{ padding: '10px 14px 10px 4px' }}><h3 style={{ fontSize: 18 }}>{t}</h3><p style={{ margin: 0 }}>Home, part-time &amp; full-time cooks</p></div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="wrap section" id="how-it-works">
        <div className="center" style={{ marginBottom: 30 }}>
          <p className="eyebrow">How it works</p>
          <h2>Good food starts with a simple process.</h2>
        </div>
        <div className="steps">
          {[[ClipboardList, 'Tell us your needs', 'Share your city, area, cook type, cuisine and timings.'], [Users, 'Meet suitable cooks', 'Get a shortlist of screened cooks, usually within 24–48 hours.'], [CookingPot, 'Trial cook at home', 'Taste the food in your own kitchen before deciding.'], [UserCheck, 'Hire with clear terms', 'Agree duties, timings and off-days in writing. Done.']].map(([I, t, d], i) => {
            const Icon = I as typeof ClipboardList;
            return (
              <Reveal className="step" key={String(t)} delay={i * 0.1}>
                <div className="num">{i + 1}</div>
                <Icon className="ico" size={30} strokeWidth={1.5} />
                <h3>{String(t)}</h3>
                <p>{String(d)}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FORM + FAQ */}
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="faq-grid">
          <div>
            <p className="eyebrow">Hire a cook today</p>
            <h2>Tell us about your kitchen.</h2>
            <p>One short form. We call you back with suitable cooks. Prefer to talk? <a href={site.phoneHref} style={{ color: 'var(--orange)', fontWeight: 700 }}><Phone size={14} /> {site.phone}</a></p>
            <HireForm id="home-form" />
          </div>
          <div>
            <p className="eyebrow">Frequently asked questions</p>
            <h2>Quick answers to common questions.</h2>
            <Faq items={homeFaqs} />
          </div>
        </div>
      </section>

      {/* SEO GUIDE (answer-first content for search & AI engines) */}
      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="prose">
          <p className="eyebrow">Guide</p>
          <h2>Hiring a cook in Islamabad: what you need to know</h2>
          <p><strong>HireCook.pk is a cook hiring agency for Islamabad and Rawalpindi.</strong> We place home cooks, male cooks, domestic and family cooks, private and personal chefs, and specialist cooks for desi, BBQ, tandoor, biryani, karahi, Chinese, continental, pizza, bakery, pastry and diet food. We also staff restaurants, hotels, offices, canteens, messes, hostels, guest houses and events.</p>
          <p>Most families choose between a <Link href="/full-time-cook-islamabad">full-time cook</Link> (8–10 hours, all meals), a <Link href="/part-time-cook-islamabad">part-time cook</Link> (2–5 hours for lunch and dinner) or a <Link href="/live-in-cook-islamabad">live-in cook</Link> who stays at home with accommodation. For occasions, book a <Link href="/hire-cook-for-dawat-islamabad">dawat cook</Link>, <Link href="/party-chef-islamabad">party chef</Link> or <Link href="/wedding-chef-islamabad">wedding chef</Link>.</p>
          <p>Browse by category:{' '}
            {groups.map((g, i) => <span key={g.slug}><Link href={`/c/${g.slug}`} style={{ color: 'var(--orange)', fontWeight: 600 }}>{g.title}</Link>{i < groups.length - 1 ? ' · ' : ''}</span>)}
          </p>
        </div>
      </section>

      <Cta />
    </main>
  );
}
