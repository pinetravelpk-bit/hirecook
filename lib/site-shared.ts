// Safe for client components: no server imports.
export type PublicSite = {
  name: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  whatsappDisplay: string;
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

/** 923221223666 -> +92 322 1223666 */
export const toWhatsappDisplay = (wa: string) => {
  const d = wa.replace(/\D/g, '');
  return d.startsWith('92') && d.length === 12 ? `+92 ${d.slice(2, 5)} ${d.slice(5)}` : '+' + d;
};
