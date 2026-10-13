// Safe for client components: no server imports.
export type PublicSite = {
  name: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  hoursLabel: string;
  addressLine: string;
  directionsUrl: string;
};

export const waLink = (whatsapp: string, text = 'Assalam o Alaikum HireCook.pk, I want to hire a cook.') =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;

export const phoneToHref = (p: string) => {
  const d = p.replace(/[^\d+]/g, '');
  return 'tel:' + (d.startsWith('0') ? '+92' + d.slice(1) : d);
};

export const toWhatsapp = (p: string) => {
  const d = p.replace(/\D/g, '');
  return d.startsWith('0') ? '92' + d.slice(1) : d;
};
