import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Brand from './Brand';
import { site } from '@/lib/site';
import { entries, groups, titleCase } from '@/lib/content';

export default function Footer() {
  const popular = entries.filter((e) => e.group === 'Cook hiring').slice(0, 10);
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Brand />
            <p style={{ marginTop: 14, maxWidth: 340 }}>{site.description}</p>
            <div className="foot-list">
              <a href={site.phoneHref}><Phone size={14} aria-hidden /> {site.phone}</a>
              <a href={`mailto:${site.email}`}><Mail size={14} aria-hidden /> {site.email}</a>
              <span><MapPin size={14} aria-hidden /> {site.addressLine}, Pakistan</span>
              <span><Clock size={14} aria-hidden /> {site.hours.label}</span>
            </div>
          </div>
          <div>
            <h4>Categories</h4>
            <div className="foot-list">
              {groups.map((g) => <Link key={g.slug} href={`/c/${g.slug}`}>{g.title}</Link>)}
            </div>
          </div>
          <div>
            <h4>Popular</h4>
            <div className="foot-list">
              {popular.map((e) => <Link key={e.slug} href={`/${e.slug}`}>{titleCase(e.keyword)}</Link>)}
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <div className="foot-list">
              <Link href="/about">About HireCook.pk</Link>
              <Link href="/how-it-works">How it works</Link>
              <Link href="/faq">FAQs</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/hire">Hire a cook</Link>
            </div>
          </div>
          <div>
            <h4>Legal</h4>
            <div className="foot-list">
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/terms">Terms of service</Link>
              <Link href="/services">All services</Link>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {site.name}. Cook &amp; chef hiring in Islamabad and Rawalpindi.</span>
          <span className="powered">Powered by <a href={site.poweredBy.url} target="_blank" rel="noopener">{site.poweredBy.name}</a></span>
        </div>
      </div>
    </footer>
  );
}
