import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import HireForm from '@/components/HireForm';
import WaIcon from '@/components/WaIcon';
import { site } from '@/lib/site';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Contact HireCook.pk: Call or WhatsApp to Hire a Cook',
  description: `Contact HireCook.pk in Islamabad. Call ${site.phone} or WhatsApp ${site.whatsappDisplay}. ${site.hours.label}. Cook hiring for Islamabad and Rawalpindi.`,
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }];
  const q = encodeURIComponent(`${site.address.street}, ${site.address.locality}`);
  return (
    <main id="main" className="wrap section">
      <JsonLd data={[breadcrumbSchema(crumbs), { '@context': 'https://schema.org', '@type': 'ContactPage', url: `${site.url}/contact`, mainEntity: { '@id': `${site.url}/#localbusiness` } }]} />
      <div className="two-col">
        <div>
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow">Contact</p>
          <h1>Talk to us</h1>
          <p className="lead">The fastest way to hire a cook is WhatsApp. We reply during working hours.</p>
          <ul className="ticks">
            <li><Phone size={18} /> <a href={site.phoneHref}><strong>{site.phone}</strong></a></li>
            <li><WaIcon size={18} /> <a href={site.whatsappHref()} target="_blank" rel="noopener"><strong>WhatsApp {site.whatsappDisplay}</strong></a></li>
            <li><Mail size={18} /> <a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><MapPin size={18} /> {site.address.street}, {site.address.locality} {site.address.postalCode}, Pakistan</li>
            <li><Clock size={18} /> {site.hours.label}</li>
          </ul>
          <div className="map-wrap"><iframe title="HireCook.pk location" loading="lazy" src={`https://maps.google.com/maps?q=${q}&z=13&output=embed`} /></div>
        </div>
        <HireForm id="contact-form" />
      </div>
    </main>
  );
}
