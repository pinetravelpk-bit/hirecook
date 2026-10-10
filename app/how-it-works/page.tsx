import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import { HiringTimeline } from '@/components/Infographics';
import { breadcrumbSchema, howToSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'How to Hire a Cook in Islamabad: 4 Simple Steps | HireCook.pk',
  description: 'How HireCook.pk works: share your requirements, get a shortlist in 24–48 hours, take a trial cook at home and hire with clear written terms.',
  alternates: { canonical: '/how-it-works' },
};

const steps = [
  ['Share your requirements', 'WhatsApp, call or use the online form. Tell us your area, cuisine, family size, timings, budget and whether you need full-time, part-time, live-in or live-out.'],
  ['We shortlist screened cooks', 'We match cooks by skills, experience and distance from your home, check CNIC details and references, and share profiles usually within 24–48 hours.'],
  ['Interview and trial cook', 'Speak to the cook, then arrange a trial cook in your own kitchen so you can taste their food and see how they work.'],
  ['Hire with clear terms', 'Agree salary, duties, working hours, off-days and notice period in writing. We stay in touch after placement and help with a replacement if needed.'],
];

export default function HowItWorks() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'How it works', path: '/how-it-works' }];
  return (
    <main id="main">
      <JsonLd data={[breadcrumbSchema(crumbs), howToSchema('How to hire a cook in Islamabad with HireCook.pk')]} />
      <section className="wrap section">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow">How it works</p>
        <h1>Hire a cook in 4 simple steps</h1>
        <p className="lead">A cook works inside your home, so our process focuses on fit, trust and clear terms.</p>
        <div className="steps" style={{ margin: '30px 0' }}>
          {steps.map(([t, d], i) => (
            <Reveal className="step" key={t} delay={i * 0.1}>
              <div className="num">{i + 1}</div>
              <h2 style={{ fontSize: 21 }}>{t}</h2>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
        <HiringTimeline />
      </section>
      <Cta />
    </main>
  );
}
