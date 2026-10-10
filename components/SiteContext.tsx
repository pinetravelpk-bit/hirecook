'use client';
import { createContext, useContext } from 'react';
import { waLink, type PublicSite } from '@/lib/site-shared';

const Ctx = createContext<PublicSite | null>(null);

export function SiteProvider({ value, children }: { value: PublicSite; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Business contact details for client components (phone, WhatsApp…), managed in Admin → Settings. */
export function useSite() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useSite outside SiteProvider');
  return { ...s, whatsappHref: (text?: string) => waLink(s.whatsapp, text) };
}
