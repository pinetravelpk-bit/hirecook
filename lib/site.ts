// Central business configuration. Update phone / WhatsApp / address here or via env vars.
// NAP (Name, Address, Phone) must match your Google Business Profile exactly for Local SEO.

const phone = process.env.NEXT_PUBLIC_PHONE || '+92 300 0000000';
const whatsapp = (process.env.NEXT_PUBLIC_WHATSAPP || phone).replace(/\D/g, '');

export const site = {
  name: 'HireCook.pk',
  legalName: 'HireCook Pakistan',
  url: 'https://hirecook.pk',
  tagline: 'Hire Trusted Cooks & Chefs in Islamabad and Rawalpindi',
  description:
    'HireCook.pk is a cook hiring agency in Islamabad and Rawalpindi. Hire male home cooks, full-time, part-time and live-in cooks, private chefs, desi, BBQ, Chinese and continental chefs, plus restaurant, office and event cooks.',
  phone,
  phoneHref: 'tel:' + phone.replace(/[^\d+]/g, ''),
  whatsapp,
  whatsappHref: (text = 'Assalam o Alaikum HireCook.pk, I want to hire a cook.') =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`,
  email: process.env.NEXT_PUBLIC_EMAIL || 'info@hirecook.pk',
  address: {
    street: process.env.NEXT_PUBLIC_STREET || 'Blue Area',
    locality: 'Islamabad',
    region: 'Islamabad Capital Territory',
    postalCode: '44000',
    country: 'PK',
  },
  geo: { lat: 33.7104, lng: 73.0533 },
  hours: { days: 'Mo-Su', opens: '09:00', closes: '21:00', label: 'Open 7 days, 9am – 9pm' },
  founded: '2026',
  social: [] as string[], // e.g. 'https://facebook.com/hirecook.pk'
  priceRange: 'PKR 25,000 – 250,000 / month',
};

// Indicative monthly salary ranges (PKR) used in salary guides & infographics.
// These are market estimates for guidance only — review and adjust to your own rates.
export const salaryGuide = [
  { role: 'Part-time cook (2–4 hrs/day)', min: 18000, max: 35000 },
  { role: 'Full-time home cook (live-out)', min: 30000, max: 55000 },
  { role: 'Live-in home cook', min: 35000, max: 65000 },
  { role: 'Desi / Pakistani food specialist', min: 35000, max: 70000 },
  { role: 'Continental / Chinese chef', min: 50000, max: 120000 },
  { role: 'Private / personal chef', min: 70000, max: 180000 },
  { role: 'Restaurant / hotel chef', min: 60000, max: 250000 },
];

export const stats = [
  { value: 177, suffix: '+', label: 'Cook services & local pages' },
  { value: 66, suffix: '', label: 'Areas covered in twin cities' },
  { value: 25, suffix: '+', label: 'Cook & chef specialities' },
  { value: 48, suffix: 'h', label: 'Typical shortlist time' },
];
