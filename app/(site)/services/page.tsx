import type { Metadata } from 'next';
import Directory from '@/components/Directory';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import Cta from '@/components/Cta';
import { entries, groups, titleCase } from '@/lib/content';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'All Cook & Chef Services: Islamabad & Rawalpindi | HireCook.pk',
  description: 'Browse all 177 cook services: home, male, full-time, part-time and live-in cooks, chefs by cuisine, and every Islamabad and Rawalpindi area.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'All services', path: '/services' }];
  return (
    <main id="main" className="wrap section">
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <p className="eyebrow">Your kitchen. Your neighbourhood.</p>
      <h1>All cook services</h1>
      <p className="lead">Explore every cook type, cuisine, schedule and local area page across Islamabad and Rawalpindi.</p>
      <Directory items={entries.map((e) => ({ slug: e.slug, title: titleCase(e.keyword), group: e.group }))} groups={groups.map((g) => g.name)} />
      <Cta />
    </main>
  );
}
