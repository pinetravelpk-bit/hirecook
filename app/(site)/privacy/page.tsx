import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Privacy Policy | HireCook.pk', description: 'How HireCook.pk collects and uses your information.', alternates: { canonical: '/privacy' } };

export default function Privacy() {
  return (
    <main id="main" className="wrap section prose">
      <h1>Privacy policy</h1>
      <p>Last updated: October 2026</p>
      <h2>What we collect</h2>
      <p>When you submit a hiring request we collect your name, phone number, city, area, cook requirements and any details you choose to share. We also collect anonymous usage statistics to improve the website.</p>
      <h2>How we use it</h2>
      <p>Only to process your hiring request: contacting you, matching suitable cooks and sharing relevant cook profiles. We do not sell your personal information.</p>
      <h2>Sharing</h2>
      <p>With your consent, we may share limited details (area and requirements, not your full address) with shortlisted cooks so they can confirm availability.</p>
      <h2>Retention &amp; your rights</h2>
      <p>Requests are kept for up to 24 months. To access or delete your data, email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    </main>
  );
}
