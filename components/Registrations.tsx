import { ShieldCheck, Landmark, FileCheck2, BadgeCheck, Check } from 'lucide-react';
import Reveal from './Reveal';
import { registrations } from '@/lib/site';

const icons = { shield: ShieldCheck, bank: Landmark, file: FileCheck2, badge: BadgeCheck };

/** Government registration badges (SECP, FBR, Labour Department, PESSI). */
export default function Registrations({ heading = true }: { heading?: boolean }) {
  return (
    <section className="wrap section" style={{ paddingTop: heading ? undefined : 0 }}>
      {heading && (
        <div className="center" style={{ marginBottom: 26 }}>
          <p className="eyebrow">Registered &amp; compliant</p>
          <h2>A legally registered cook agency.</h2>
        </div>
      )}
      <div className="reg-grid scroller">
        {registrations.map((r, i) => {
          const I = icons[r.icon];
          return (
            <Reveal className="reg" key={r.title} delay={i * 0.08}>
              <span className="reg-ic"><I size={22} /><i><Check size={10} strokeWidth={3} /></i></span>
              <h3>{r.title}</h3>
              <p>{r.sub}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
