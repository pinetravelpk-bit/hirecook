import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import WaIcon from './WaIcon';
import Reveal from './Reveal';
import { site } from '@/lib/site';

export default function Cta({ title = 'Your next great meal starts with the right cook.', text = 'Tell us what you need. We will shortlist suitable cooks, usually within 24–48 hours.', wa }: { title?: string; text?: string; wa?: string }) {
  return (
    <section className="wrap section" style={{ paddingTop: 20 }}>
      <Reveal className="cta-band">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="actions">
          <Link className="btn btn-light" href="/hire">Hire a Cook <ArrowRight size={18} /></Link>
          <a className="btn btn-wa" href={site.whatsappHref(wa)} target="_blank" rel="noopener"><WaIcon size={18} /> WhatsApp</a>
          <a className="btn btn-green" href={site.phoneHref}><Phone size={18} /> Call</a>
        </div>
      </Reveal>
    </section>
  );
}
