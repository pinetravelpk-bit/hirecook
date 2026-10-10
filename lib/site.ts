import 'server-only';
import { db } from './db';
import { phoneToHref, toWhatsapp, waLink, type PublicSite } from './site-shared';

// Business details. Defaults below; everything can be changed from Admin → Settings
// (stored in the database). NAP must match your Google Business Profile exactly.
export const defaults = {
  phone: '0339-1222233',
  whatsapp: '923391222233',
  email: 'info@hirecook.pk',
  street: 'Chandni Chowk, Murree Road',
  locality: 'Rawalpindi',
  region: 'Punjab',
  postalCode: '46000',
  hoursLabel: 'Open 7 days, 9am – 9pm',
  opens: '09:00',
  closes: '21:00',
  lat: '33.6297',
  lng: '73.0710',
  poweredBy: 'RX Direct',
  poweredByUrl: 'https://rxdirect.pk',
  gaId: '',
  gscVerification: '',
};
export type SettingKey = keyof typeof defaults;

declare global {
  var __hcsettings: typeof defaults | undefined;
}

export function getSettings(): typeof defaults {
  if (globalThis.__hcsettings) return globalThis.__hcsettings;
  const s = { ...defaults };
  try {
    for (const r of db().prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[]) {
      if (r.key in s && r.value != null) (s as Record<string, string>)[r.key] = r.value;
    }
  } catch {}
  globalThis.__hcsettings = s;
  return s;
}

export function saveSettings(values: Partial<typeof defaults>) {
  const st = db().prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const [k, v] of Object.entries(values)) if (k in defaults) st.run(k, String(v ?? '').trim());
  globalThis.__hcsettings = undefined;
}

// `site` reads live settings on every access, so server-rendered pages always use the latest values.
export const site = {
  name: 'HireCook.pk',
  legalName: 'HireCook Pakistan',
  url: 'https://hirecook.pk',
  tagline: 'Hire Trusted Cooks & Chefs in Islamabad and Rawalpindi',
  description:
    'HireCook.pk is a cook hiring agency in Islamabad and Rawalpindi. Hire male home cooks, full-time, part-time and live-in cooks, private chefs, desi, BBQ, Chinese and continental chefs, plus restaurant, office and event cooks.',
  get phone() { return getSettings().phone; },
  get phoneIntl() { return phoneToHref(getSettings().phone).replace('tel:', ''); },
  get phoneHref() { return phoneToHref(getSettings().phone); },
  get whatsapp() { return toWhatsapp(getSettings().whatsapp || getSettings().phone); },
  whatsappHref(text?: string) { return waLink(site.whatsapp, text); },
  get email() { return getSettings().email; },
  get address() {
    const s = getSettings();
    return { street: s.street, locality: s.locality, region: s.region, postalCode: s.postalCode, country: 'PK' };
  },
  get addressLine() { const a = site.address; return `${a.street}, ${a.locality}`; },
  get geo() { return { lat: Number(getSettings().lat), lng: Number(getSettings().lng) }; },
  get hours() { const s = getSettings(); return { opens: s.opens, closes: s.closes, label: s.hoursLabel }; },
  get poweredBy() { return { name: getSettings().poweredBy, url: getSettings().poweredByUrl }; },
  social: [] as string[],
};

export function publicSite(): PublicSite {
  return { name: site.name, phone: site.phone, phoneHref: site.phoneHref, whatsapp: site.whatsapp, email: site.email, hoursLabel: site.hours.label, addressLine: site.addressLine };
}

export const registrations = [
  { title: 'Registered with SECP', sub: 'Securities and Exchange Commission of Pakistan', icon: 'shield' },
  { title: 'FBR Tax Registration (NTN)', sub: 'Federal Board of Revenue', icon: 'bank' },
  { title: 'Labour Department Registration', sub: 'Government of Punjab', icon: 'file' },
  { title: 'PESSI Registration', sub: 'Punjab Employees Social Security Institution', icon: 'badge' },
] as const;

export const stats = [
  { value: 177, suffix: '+', label: 'Cook services & local pages' },
  { value: 66, suffix: '', label: 'Areas covered in twin cities' },
  { value: 25, suffix: '+', label: 'Cook & chef specialities' },
  { value: 48, suffix: 'h', label: 'Typical shortlist time' },
];
