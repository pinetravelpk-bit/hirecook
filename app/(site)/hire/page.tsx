import type { Metadata } from 'next';
import { Phone, ShieldCheck, Clock3, Star } from 'lucide-react';
import HireForm from '@/components/HireForm';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import WaIcon from '@/components/WaIcon';
import { HiringTimeline } from '@/components/Infographics';
import { site } from '@/lib/site';
import { breadcrumbSchema, howToSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Hire a Cook Online: Islamabad & Rawalpindi | HireCook.pk',
  description: 'Send a free hiring request for a home cook, male cook, chef, or restaurant, office or event cook in Islamabad or Rawalpindi. Shortlist in 24–48 hours.',
  alternates: { canonical: '/hire' },
};

export default function HirePage() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Hire a cook', path: '/hire' }];
  return (
    <main id="main" className="wrap section">
      <JsonLd data={[breadcrumbSchema(crumbs), howToSchema('How to hire a cook with HireCook.pk')]} />
      <div className="two-col">
        <div>
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">Let&apos;s start with your kitchen</p>
          <h1>A better match starts <em>here.</em></h1>
          <p className="lead">Tell us what you need: location, cuisine, schedule and budget. We will call you back with suitable cooks.</p>
          <div className="trust" style={{ margin: '18px 0 26px' }}>
            <span><ShieldCheck size={17} /> Screened cooks</span>
            <span><Clock3 size={17} /> 24–48h shortlist</span>
            <span><Star size={17} /> Trial cook first</span>
          </div>
          <div className="actions">
            <a className="btn btn-green" href={site.phoneHref}><Phone size={18} /> {site.phone}</a>
            <a className="btn btn-wa" href={site.whatsappHref()} target="_blank" rel="noopener"><WaIcon size={18} /> {site.whatsappDisplay}</a>
          </div>
          <HiringTimeline />
        </div>
        <HireForm />
      </div>
    </main>
  );
}
