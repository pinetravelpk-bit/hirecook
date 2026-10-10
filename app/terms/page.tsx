import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service | HireCook.pk', description: 'Terms for using HireCook.pk cook hiring services.', alternates: { canonical: '/terms' } };

export default function Terms() {
  return (
    <main id="main" className="wrap section prose">
      <h1>Terms of service</h1>
      <p>Last updated: October 2026</p>
      <h2>Our service</h2>
      <p>HireCook.pk introduces cooks and chefs to households and businesses in Islamabad and Rawalpindi. The employment relationship, including salary, duties, hours and leave, is agreed between you and the cook.</p>
      <h2>Fees</h2>
      <p>Any service fee is explained and agreed before placement. Indicative salary ranges on this website are guidance only.</p>
      <h2>Screening</h2>
      <p>We collect identity details and references and recommend a trial cook. Employers remain responsible for final selection and are encouraged to complete police verification for live-in staff.</p>
      <h2>Replacement</h2>
      <p>Replacement support is provided within the period agreed at the time of placement.</p>
      <h2>Liability</h2>
      <p>HireCook.pk is not liable for the conduct of a cook after placement, beyond the commitments agreed in writing.</p>
    </main>
  );
}
