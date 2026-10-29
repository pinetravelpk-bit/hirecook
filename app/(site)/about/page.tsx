import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import Cta from '@/components/Cta';
import Photo from '@/components/Photo';
import Facts from '@/components/Facts';
import Registrations from '@/components/Registrations';
import { site } from '@/lib/site';
import { cities } from '@/lib/cities';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About HireCook.pk: Registered Cook Hiring Agency, Rawalpindi',
  description: 'HireCook.pk is a registered cook and chef hiring agency at Chandni Chowk, Rawalpindi, serving Islamabad, Rawalpindi and 8 more cities. Powered by RX Direct.',
  alternates: { canonical: '/about' },
};

export default function About() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }];
  const outside = cities.filter((c) => !c.full).map((c) => c.name).join(', ');
  return (
    <main id="main">
      <JsonLd data={[breadcrumbSchema(crumbs), { '@context': 'https://schema.org', '@type': 'AboutPage', url: `${site.url}/about`, name: 'About HireCook.pk', mainEntity: { '@id': `${site.url}/#organization` } }]} />
      <section className="wrap section">
        <div className="two-col">
          <div className="prose">
            <Breadcrumbs items={crumbs} />
            <p className="eyebrow">About us</p>
            <h1>Good food at home, made simple.</h1>
            <p className="lead"><strong>{site.name}</strong> is a registered cook and chef hiring agency with its office at {site.addressLine}. We help families and businesses hire screened cooks in Islamabad and Rawalpindi, and experienced male cooks in {outside}.</p>
            <h2>Who we are</h2>
            <p>HireCook.pk is powered by <a href={site.poweredBy.url} target="_blank" rel="noopener">{site.poweredBy.name}</a>, a domestic staffing company in the twin cities. HireCook.pk focuses on one job: matching the right cook to the right kitchen. That focus lets us understand cooking skills properly, from everyday daal, salan and roti to BBQ, tandoor, Chinese, continental, baking and diet food.</p>
            <h2>What we do</h2>
            <ul>
              <li><strong>Homes:</strong> home cooks, male cooks, full-time, part-time, live-in and live-out cooks, and private chefs.</li>
              <li><strong>Businesses:</strong> restaurant and hotel chefs, commercial kitchen staff, office, canteen, mess, hostel and guest house cooks.</li>
              <li><strong>Occasions:</strong> cooks and chefs for dawats, birthdays, family gatherings, weddings and events.</li>
            </ul>
            <h2>How we vet cooks</h2>
            <p>Every candidate goes through the same checks before we introduce them: CNIC details, previous-employer references and an assessment of the dishes they actually cook. You then interview the cook and take a <strong>trial cook in your own kitchen</strong> before deciding. For live-in staff we also recommend police verification through ICT Police or your provincial police.</p>
            <h2>How we work with you</h2>
            <ol>
              <li>You share your area, cuisine, timings and family size or headcount.</li>
              <li>We shortlist suitable, screened cooks, usually within 24–48 hours.</li>
              <li>You interview and take a trial cook.</li>
              <li>We help you agree duties, timings, weekly off, leave and notice period in writing.</li>
              <li>We stay in touch after placement and help with a replacement within the agreed period if needed.</li>
            </ol>
            <h2>Where we work</h2>
            <p>All services are available across Islamabad and Rawalpindi, from F-6, F-7, F-10, G-11, E-7 and I-8 to Bahria Town, DHA, Gulberg Greens, Saddar, Satellite Town, the Chaklala schemes and the Askari societies. In {outside} we currently provide male cooks for homes. See all <Link href="/cities">cities and areas</Link>.</p>
            <h2>Contact</h2>
            <p>Call <a href={site.phoneHref}>{site.phone}</a>, WhatsApp <a href={site.whatsappHref()} target="_blank" rel="noopener">{site.whatsappDisplay}</a>, or visit our office at {site.addressLine} ({site.hours.label}). <Link href="/how-it-works">See how it works</Link>.</p>
          </div>
          <div className="svc-hero" style={{ padding: 0, display: 'block' }}>
            <div className="media"><Photo k="chef-chopping" alt="HireCook.pk cook preparing fresh vegetables" /></div>
          </div>
        </div>
      </section>
      <Facts />
      <Registrations heading={false} />
      <Cta />
    </main>
  );
}
