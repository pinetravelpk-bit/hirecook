import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import Faq from '@/components/Faq';
import Cta from '@/components/Cta';
import Reveal from '@/components/Reveal';
import { SalaryBars, DayDonut } from '@/components/Infographics';
import { salaryGuide } from '@/lib/site';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Cook Salary in Islamabad & Rawalpindi 2026 | HireCook.pk',
  description: 'How much does a cook cost in Islamabad? 2026 monthly salary ranges for part-time, full-time, live-in cooks, desi cooks, chefs, private chefs and restaurant chefs.',
  alternates: { canonical: '/salary-guide' },
};

const faqs = [
  { q: 'What is the salary of a full-time cook in Islamabad?', a: 'A full-time live-out home cook in Islamabad typically earns PKR 30,000–55,000 per month in 2026, depending on experience, family size and the menu.' },
  { q: 'How much does a part-time cook charge in Islamabad?', a: 'A part-time cook working 2–4 hours a day usually charges PKR 18,000–35,000 per month.' },
  { q: 'What is a live-in cook salary?', a: 'Live-in cooks generally earn PKR 35,000–65,000 per month plus a private room and meals, with one weekly day off.' },
  { q: 'How much does a private chef cost?', a: 'Private and personal chefs with restaurant experience typically charge PKR 70,000–180,000 per month, or per event for parties and dinners.' },
  { q: 'Do cooks get annual increments and Eid bonus?', a: 'It is customary in Pakistan to give an Eid bonus and a yearly increment. Agree these, plus off-days and notice period, in writing at the start.' },
];

export default function SalaryGuide() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Cook salary guide', path: '/salary-guide' }];
  return (
    <main id="main">
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(faqs)]} />
      <section className="wrap section">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow">2026 guide</p>
        <h1>Cook salary in Islamabad &amp; Rawalpindi</h1>
        <div className="quick-answer" style={{ maxWidth: 820 }}>
          <h2>Quick answer</h2>
          <p>In 2026 a home cook in Islamabad costs about <strong>PKR 30,000–55,000/month full-time</strong>, <strong>PKR 18,000–35,000 part-time</strong> and <strong>PKR 35,000–65,000 live-in</strong> (plus room and meals). Specialist and private chefs range from PKR 50,000 to 180,000+.</p>
        </div>
        <div className="info-grid" style={{ marginTop: 30 }}>
          <Reveal><SalaryBars rows={salaryGuide} /></Reveal>
          <Reveal delay={0.1}><DayDonut title="What a full-time salary covers" items={[{ label: 'Breakfast', h: 1.5 }, { label: 'Lunch', h: 2.5 }, { label: 'Tea & snacks', h: 1 }, { label: 'Dinner', h: 2.5 }, { label: 'Kitchen & groceries', h: 1.5 }]} /></Reveal>
        </div>
        <div className="prose" style={{ marginTop: 40 }}>
          <h2>Salary table</h2>
          <table className="table">
            <thead><tr><th>Cook type</th><th>Monthly salary (PKR)</th></tr></thead>
            <tbody>{salaryGuide.map((r) => <tr key={r.role}><td>{r.role}</td><td>{r.min.toLocaleString('en-PK')} – {r.max.toLocaleString('en-PK')}</td></tr>)}</tbody>
          </table>
          <p className="muted" style={{ marginTop: 10 }}>Indicative ranges based on twin-city market rates. Actual salary depends on experience, duties, hours, accommodation and family size.</p>
          <h2>What affects a cook&apos;s salary?</h2>
          <ul>
            <li><strong>Experience &amp; speciality:</strong> BBQ, continental and Chinese skills cost more than basic home cooking.</li>
            <li><strong>Hours &amp; schedule:</strong> full-time, part-time, live-in or event-based.</li>
            <li><strong>Family size &amp; guests:</strong> frequent dawats need more skill and time.</li>
            <li><strong>Extra duties:</strong> grocery shopping, serving, kitchen deep-cleaning.</li>
            <li><strong>Location &amp; commute:</strong> remote farmhouses may need accommodation or travel allowance.</li>
          </ul>
          <p>Ready to hire? See <Link href="/full-time-cook-islamabad">full-time cooks</Link>, <Link href="/part-time-cook-islamabad">part-time cooks</Link>, <Link href="/live-in-cook-islamabad">live-in cooks</Link> or <Link href="/monthly-salary-male-cook-islamabad">monthly salary male cooks</Link>.</p>
          <h2>Salary FAQs</h2>
          <Faq items={faqs} />
        </div>
      </section>
      <Cta />
    </main>
  );
}
