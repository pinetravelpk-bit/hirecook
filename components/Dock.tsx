'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Phone, ChefHat, LayoutGrid } from 'lucide-react';
import WaIcon from './WaIcon';
import { useSite } from './SiteContext';

// Sticky mobile app dock: Call, WhatsApp and Hire Cook are always one tap away.
export default function Dock() {
  const site = useSite();
  const path = usePathname();
  const track = (name: string) => {
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    w.gtag?.('event', name, { page_path: path });
  };
  return (
    <>
      <nav className="dock" aria-label="Quick actions">
        <Link href="/" aria-current={path === '/' ? 'page' : undefined}>
          <span className="d-ic"><Home size={21} /></span>Home
        </Link>
        <a className="call" href={site.phoneHref} onClick={() => track('call_click')}>
          <span className="d-ic"><Phone size={20} /></span>Call
        </a>
        <Link className="hire" href="/hire" onClick={() => track('hire_click')}>
          <span className="d-ic"><ChefHat size={28} /></span><span>Hire Cook</span>
        </Link>
        <a className="wa" href={site.whatsappHref()} target="_blank" rel="noopener" onClick={() => track('whatsapp_click')}>
          <span className="d-ic"><WaIcon size={21} /></span>WhatsApp
        </a>
        <button type="button" onClick={() => window.dispatchEvent(new Event('open-menu'))}>
          <span className="d-ic"><LayoutGrid size={21} /></span>Menu
        </button>
      </nav>
      <a className="fab-wa" href={site.whatsappHref()} target="_blank" rel="noopener" aria-label="Chat on WhatsApp" onClick={() => track('whatsapp_click')}>
        <WaIcon size={30} />
      </a>
    </>
  );
}
