'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { MessageSquareText, ListChecks, CookingPot, BadgeCheck } from 'lucide-react';

const COLORS = ['#d64e19', '#163f32', '#e8955f', '#3d7a63', '#a56535', '#9bbcaa'];

/** Animated donut: how a cook's working day is split. */
export function DayDonut({ title, items }: { title: string; items: { label: string; h: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const total = items.reduce((s, x) => s + x.h, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="info-card" ref={ref}>
      <h3>{title}</h3>
      <p className="muted">Approximate hours, total {total} hrs. Adjusted to your home.</p>
      <div className="donut-wrap">
        <svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label={`${title}: ${items.map((i) => `${i.label} ${i.h} hours`).join(', ')}`}>
          <circle cx="100" cy="100" r={R} fill="none" stroke="#f3eee1" strokeWidth="26" />
          {items.map((it, i) => {
            const len = (it.h / total) * C;
            const off = acc;
            acc += len;
            return (
              <motion.circle
                key={it.label}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth="26"
                strokeDashoffset={-off}
                transform="rotate(-90 100 100)"
                initial={{ strokeDasharray: `0 ${C}` }}
                animate={inView ? { strokeDasharray: `${Math.max(len - 2, 0)} ${C - len + 2}` } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              />
            );
          })}
          <text x="100" y="96" textAnchor="middle" fontSize="34" fontWeight="700" fill="#163f32" fontFamily="Georgia, serif">{total}h</text>
          <text x="100" y="118" textAnchor="middle" fontSize="12" fill="#5f6a62">per day</text>
        </svg>
        <ul className="legend">
          {items.map((it, i) => (
            <motion.li key={it.label} initial={{ opacity: 0, x: 12 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }}>
              <i style={{ background: COLORS[i % COLORS.length] }} />
              {it.label}
              <b>{it.h}h</b>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Animated hiring timeline. */
export function HiringTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const steps = [
    { Icon: MessageSquareText, t: 'Share needs', s: '5 minutes' },
    { Icon: ListChecks, t: 'Get shortlist', s: '24–48 hours' },
    { Icon: CookingPot, t: 'Trial cook', s: 'At your home' },
    { Icon: BadgeCheck, t: 'Hire & start', s: 'Same week' },
  ];
  return (
    <div className="info-card" ref={ref}>
      <h3>From WhatsApp to your first meal</h3>
      <p className="muted">The typical HireCook.pk hiring journey.</p>
      <div className="timeline">
        <div className="rail"><motion.i initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.6, ease: 'easeInOut' }} /></div>
        {steps.map(({ Icon, t, s }, i) => (
          <motion.div className="tl-step" key={t} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 + i * 0.35 }}>
            <div className="dot"><Icon size={20} /></div>
            <b>{t}</b>
            <small>{s}</small>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Animated coverage bars per category. */
export function CoverageBars({ rows }: { rows: { label: string; value: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const top = Math.max(...rows.map((r) => r.value));
  return (
    <div className="info-card" ref={ref}>
      <h3>What families hire us for</h3>
      <p className="muted">Number of dedicated service pages by category.</p>
      <div className="bars">
        {rows.map((r, i) => (
          <div className={'bar-row' + (i === 0 ? ' hl' : '')} key={r.label}>
            <div className="lbl"><span>{r.label}</span><span>{r.value}</span></div>
            <div className="bar-track">
              <motion.div className="bar-fill" style={{ left: 0 }} initial={{ width: 0 }} animate={inView ? { width: `${(r.value / top) * 100}%` } : {}} transition={{ duration: 1, delay: i * 0.1 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
