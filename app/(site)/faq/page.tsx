import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import Faq from '@/components/Faq';
import Cta from '@/components/Cta';
import { site } from '@/lib/site';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Cook Hiring FAQs: Islamabad & Rawalpindi | HireCook.pk',
  description: 'Answers about hiring a cook in Islamabad and Rawalpindi: salaries, verification, live-in cooks, trial cooks, replacements, agency process and areas covered.',
  alternates: { canonical: '/faq' },
};

const sections: { h: string; items: { q: string; a: string }[] }[] = [
  { h: 'Hiring', items: [
    { q: 'How do I hire a cook through HireCook.pk?', a: `Call ${site.phone}, WhatsApp ${site.whatsappDisplay}, or submit the hire form. We shortlist screened cooks within 24–48 hours, arrange a trial cook, and you hire once satisfied.` },
    { q: 'How quickly can a cook start?', a: 'Most families receive profiles within 24–48 hours and the cook starts within the same week after a successful trial.' },
    { q: 'Can I take a trial before hiring?', a: 'Yes. We strongly recommend a trial cook at your home so you can taste the food and see the cook\'s hygiene and working style.' },
    { q: 'Can I hire a cook near me?', a: 'Yes. We match cooks who live close to your sector or society in Islamabad or Rawalpindi so they arrive on time.' },
  ] },
  { h: 'Cooks & skills', items: [
    { q: 'Do you have male cooks?', a: 'Yes, most of our home cooks are experienced male cooks skilled in desi food, roti, BBQ and dawat menus.' },
    { q: 'Can the cook make Chinese and continental food?', a: 'Yes. Tell us the dishes you want and we match a cook or chef with that experience: Chinese, continental, BBQ, baking, diet food and more.' },
    { q: 'Do you provide cooks for restaurants and offices?', a: 'Yes: restaurant and hotel chefs, office and canteen cooks, mess and hostel cooks, guest house cooks and event chefs.' },
  ] },
  { h: 'Terms & registration', items: [
    { q: 'Is HireCook.pk registered?', a: 'Yes. We are registered with SECP, FBR (NTN), the Labour Department and PESSI (Punjab Employees Social Security Institution).' },
    { q: 'Is there an agency fee?', a: 'Our service charges depend on the role and arrangement. We explain all fees clearly before you confirm. No hidden costs.' },
    { q: 'What if the cook leaves or does not suit us?', a: 'Inform us within the agreed period and we help arrange a replacement candidate.' },
  ] },
  { h: 'Trust & safety', items: [
    { q: 'Are cooks verified?', a: 'We collect CNIC details and previous-employer references before introducing a cook. For live-in staff we recommend police verification through ICT Police or Punjab Police.' },
    { q: 'Is my information private?', a: 'Yes. Your details are only used to process your hiring request. See our privacy policy.' },
  ] },
];

export default function FaqPage() {
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'FAQs', path: '/faq' }];
  return (
    <main id="main">
      <JsonLd data={[breadcrumbSchema(crumbs), faqSchema(sections.flatMap((s) => s.items))]} />
      <section className="wrap section prose">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow">Help centre</p>
        <h1>Frequently asked questions</h1>
        {sections.map((s) => (
          <div key={s.h}>
            <h2>{s.h}</h2>
            <Faq items={s.items} openFirst={false} />
          </div>
        ))}
      </section>
      <Cta />
    </main>
  );
}
