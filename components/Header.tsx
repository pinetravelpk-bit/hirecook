'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Phone, MapPin, Clock, ChefHat, Users, CalendarClock, UtensilsCrossed, Building2, PartyPopper, ArrowRight, Landmark, ArrowUpRight } from 'lucide-react';
import Brand from './Brand';
import WaIcon from './WaIcon';
import { useSite } from './SiteContext';

const nav = [
  { href: '/services', label: 'Cook Services' },
  { href: '/c/chefs-and-cuisines', label: 'Cuisines' },
  { href: '/c/islamabad-areas', label: 'Islamabad' },
  { href: '/c/rawalpindi-areas', label: 'Rawalpindi' },
  { href: '/cities', label: 'Other Cities' },
  { href: '/how-it-works', label: 'How It Works' },
];

const sheetCats = [
  { href: '/c/cook-hiring', label: 'Home Cooks', Icon: ChefHat },
  { href: '/c/male-cooks', label: 'Male Cooks', Icon: Users },
  { href: '/c/cook-schedules', label: 'Full / Part Time', Icon: CalendarClock },
  { href: '/c/chefs-and-cuisines', label: 'Chefs & Cuisines', Icon: UtensilsCrossed },
  { href: '/c/commercial-and-events', label: 'Restaurant & Office', Icon: Building2 },
  { href: '/hire-cook-for-dawat-islamabad', label: 'Events & Dawat', Icon: PartyPopper },
];

export default function Header() {
  const site = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    const openSheet = () => setOpen(true);
    window.addEventListener('open-menu', openSheet);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('open-menu', openSheet);
    };
  }, []);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <a href={site.directionsUrl} target="_blank" rel="noopener"><MapPin size={13} aria-hidden /> {site.addressLine}, Pakistan</a>
          <span className="tb-right">
            <span><Clock size={13} aria-hidden /> {site.hoursLabel}</span>
            <a href={site.phoneHref}><Phone size={13} aria-hidden /> {site.phone}</a>
          </span>
        </div>
      </div>
      <header className={'header' + (scrolled ? ' scrolled' : '')}>
        <div className="wrap">
          <Brand />
          <nav className="nav" aria-label="Main">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}>{n.label}</Link>
            ))}
          </nav>
          <div className="header-cta">
            <a className="btn btn-outline btn-sm" href={site.phoneHref}><Phone size={16} aria-hidden /> Call</a>
            <Link className="btn btn-primary btn-sm" href="/hire">Hire a Cook <ArrowUpRight size={16} aria-hidden /></Link>
          </div>
          <button className="menu-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div key="bd" className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              key="sheet"
              className="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, i) => { if (i.offset.y > 120) setOpen(false); }}
            >
              <div className="grab" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Brand />
                <button className="menu-btn" style={{ display: 'inline-flex' }} aria-label="Close menu" onClick={() => setOpen(false)}><X size={22} /></button>
              </div>
              <h4>Find a cook</h4>
              <div className="sheet-grid">
                {sheetCats.map(({ href, label, Icon }) => (
                  <Link key={href} href={href}><Icon size={24} aria-hidden />{label}</Link>
                ))}
              </div>
              <a className="sheet-address" href={site.directionsUrl} target="_blank" rel="noopener">
                <MapPin size={18} aria-hidden />
                <span><b>Visit our office</b>{site.addressLine}, Pakistan<small>{site.hoursLabel} · Get directions</small></span>
              </a>
              <h4>Areas</h4>
              <div className="sheet-list">
                <Link href="/c/islamabad-areas"><span><Landmark size={16} aria-hidden /> Islamabad sectors &amp; societies</span><ArrowRight size={16} /></Link>
                <Link href="/c/rawalpindi-areas"><span><Landmark size={16} aria-hidden /> Rawalpindi areas</span><ArrowRight size={16} /></Link>
                <Link href="/cities"><span><MapPin size={16} aria-hidden /> Male cooks in 8 more cities</span><ArrowRight size={16} /></Link>
              </div>
              <h4>More</h4>
              <div className="sheet-list">
                <Link href="/services"><span>All cook services</span><ArrowRight size={16} /></Link>
                <Link href="/how-it-works"><span>How it works</span><ArrowRight size={16} /></Link>
                <Link href="/faq"><span>FAQs</span><ArrowRight size={16} /></Link>
                <Link href="/about"><span>About us</span><ArrowRight size={16} /></Link>
                <Link href="/contact"><span>Contact</span><ArrowRight size={16} /></Link>
              </div>
              <div className="actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <a className="btn btn-green" href={site.phoneHref}><Phone size={18} /> Call</a>
                <a className="btn btn-wa" href={site.whatsappHref()} target="_blank" rel="noopener"><WaIcon size={18} /> WhatsApp</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
