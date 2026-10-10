import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import Cta from '@/components/Cta';
import Photo from '@/components/Photo';
import { site } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About HireCook.pk: Cook Hiring Agency in Islamabad',
  description: 'HireCook.pk is a cook and chef hiring agency serving Islamabad and Rawalpindi. Learn how we screen, match and place cooks for homes and businesses.',
  alternates: { canonical: '/about' },
};

export default function About() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }];
  return (
    <main id="main">
      <JsonLd data={[breadcrumbSchema(crumbs), { '@context': 'https://schema.org', '@type': 'AboutPage', url: `${site.url}/about`, mainEntity: { '@id': `${site.url}/#organization` } }]} />
      <section className="wrap section">
        <div className="two-col">
          <div className="prose">
            <Breadcrumbs items={crumbs} />
            <p className="eyebrow">About us</p>
            <h1>Good food at home, made simple.</h1>
            <p className="lead"><strong>{site.name}</strong> is a cook hiring agency based in Islamabad, serving families and businesses across Islamabad and Rawalpindi.</p>
            <p>We help households hire home cooks, male cooks, live-in and part-time cooks, and private chefs. We also staff restaurants, hotels, offices, canteens, hostels, guest houses and events with experienced cooks and chefs.</p>
            <h2>Our approach</h2>
            <ul>
              <li><strong>Understand your kitchen:</strong> cuisine, family size, timings and budget.</li>
              <li><strong>Screen carefully:</strong> CNIC details, previous-employer references and cooking experience.</li>
              <li><strong>Trial first:</strong> taste the food in your own kitchen before hiring.</li>
              <li><strong>Clear terms:</strong> salary, duties, off-days and notice in writing.</li>
              <li><strong>Stay with you:</strong> follow-up after placement and replacement support.</li>
            </ul>
            <p><Link href="/how-it-works" style={{ color: 'var(--orange)', fontWeight: 700 }}>See how it works →</Link></p>
          </div>
          <div className="svc-hero" style={{ padding: 0, display: 'block' }}>
            <div className="media"><Photo k="chef-chopping" alt="HireCook.pk cook preparing fresh vegetables" /></div>
          </div>
        </div>
      </section>
      <Cta />
    </main>
  );
}
