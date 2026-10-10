'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { IdCard, Users, CookingPot, FileSignature } from 'lucide-react';

// Stylised twin-cities map: roads draw in, sector blocks fade in, area pins drop one by one.
const sectors = [
  // [x, y, label]  Islamabad grid (Margalla Hills to the north)
  [150, 92, 'E-11'], [250, 92, 'E-7'],
  [130, 140, 'F-11'], [180, 140, 'F-10'], [230, 140, 'F-8'], [280, 140, 'F-7'], [330, 140, 'F-6'],
  [80, 188, 'G-13'], [130, 188, 'G-11'], [180, 188, 'G-10'], [230, 188, 'G-9'], [280, 188, 'G-8'], [330, 188, 'G-7'], [380, 188, 'G-6'],
  [180, 236, 'I-10'], [230, 236, 'I-9'], [280, 236, 'I-8'],
] as const;

const pins = [
  [180, 140, 'F-10'], [130, 188, 'G-11'], [280, 140, 'F-7'], [250, 92, 'E-7'], [230, 236, 'I-9'],
  [470, 110, 'Bani Gala'], [455, 165, 'Bahria Enclave'], [430, 300, 'PWD'], [380, 340, 'DHA Phase 2'],
  [300, 360, 'Bahria Town'], [520, 300, 'Satellite Town'], [565, 330, 'Saddar'], [500, 360, 'Chaklala'],
  [420, 380, 'Askari 14'], [600, 270, 'Westridge'],
] as const;

export function CoverageMap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div className="info-card map-card" ref={ref}>
      <h3>66 areas. Two cities. One call.</h3>
      <p className="muted">From Margalla Hills to Saddar, we place cooks close to your home.</p>
      <svg viewBox="0 0 680 420" role="img" aria-label="Map of HireCook.pk coverage across Islamabad and Rawalpindi">
        <defs>
          <linearGradient id="hills" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3d7a63" stopOpacity=".55" />
            <stop offset="1" stopColor="#3d7a63" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Margalla Hills */}
        <motion.path d="M0 70 L60 30 L110 55 L170 15 L230 50 L290 20 L350 52 L420 25 L480 60 L540 35 L600 62 L680 40 L680 0 L0 0Z" fill="url(#hills)" initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} />
        <text x="24" y="28" className="map-lbl soft">Margalla Hills</text>
        {/* Rawal Lake */}
        <motion.ellipse cx="520" cy="120" rx="42" ry="20" fill="#9bc3d8" initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.3 }} style={{ transformOrigin: '520px 120px' }} />
        <text x="490" y="152" className="map-lbl soft">Rawal Lake</text>
        {/* Roads */}
        {[
          'M40 270 C 200 270, 320 300, 680 300',          // Kashmir Hwy / Murree Rd feel
          'M420 60 C 430 160, 440 260, 420 420',          // Expressway
          'M0 330 C 200 330, 400 360, 680 380',           // GT Road
          'M560 200 C 560 260, 570 330, 590 420',         // Murree Road (Rawalpindi)
        ].map((d, i) => (
          <motion.path key={d} d={d} fill="none" stroke="#d6cfbb" strokeWidth={i === 2 ? 7 : 5} strokeLinecap="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.4, delay: 0.2 + i * 0.2 }} />
        ))}
        {/* Islamabad sectors */}
        {sectors.map(([x, y, l], i) => (
          <motion.g key={l} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 + i * 0.03 }}>
            <rect x={x - 21} y={y - 18} width="42" height="36" rx="7" fill="#e7efe9" stroke="#cfe0d5" />
            <text x={x} y={y + 4} textAnchor="middle" className="map-sec">{l}</text>
          </motion.g>
        ))}
        {/* Rawalpindi zone */}
        <motion.path d="M470 250 C 540 220, 650 230, 670 300 C 680 380, 600 410, 520 400 C 450 390, 430 300, 470 250Z" fill="#fbe9df" stroke="#f3c9b2" initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.6 }} style={{ transformOrigin: '560px 320px' }} />
        <text x="190" y="62" className="map-city">ISLAMABAD</text>
        <text x="520" y="252" className="map-city orange">RAWALPINDI</text>
        {/* Pins */}
        {pins.map(([x, y, l], i) => (
          <motion.g key={l} initial={{ opacity: 0, y: -14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 + i * 0.12, type: 'spring', stiffness: 260, damping: 14 }}>
            <circle cx={x} cy={y} r="11" className="pin-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            <circle cx={x} cy={y} r="6" fill="#d64e19" stroke="#fff" strokeWidth="2.5" />
            <text x={x} y={y - 12} textAnchor="middle" className="map-lbl">{l}</text>
          </motion.g>
        ))}
        {/* Office */}
        <motion.g initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 2.9, type: 'spring' }} style={{ transformOrigin: '585px 300px' }}>
          <rect x="560" y="286" width="50" height="28" rx="8" fill="#163f32" />
          <text x="585" y="305" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">HQ</text>
        </motion.g>
      </svg>
      <p className="map-foot"><b>HQ:</b> Chandni Chowk, Rawalpindi · serving every sector &amp; society in the twin cities</p>
    </div>
  );
}

const steps = [
  { Icon: IdCard, t: 'CNIC checked', d: 'Identity on file' },
  { Icon: Users, t: 'References verified', d: 'Previous employers' },
  { Icon: CookingPot, t: 'Trial cook', d: 'In your kitchen' },
  { Icon: FileSignature, t: 'Written terms', d: 'Duties & timings' },
];

/** Four animated rings: the checks every cook goes through. */
export function TrustRings({ title = 'Every cook goes through 4 checks' }: { title?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const C = 2 * Math.PI * 34;
  return (
    <div className="info-card" ref={ref}>
      <h3>{title}</h3>
      <p className="muted">Before any cook enters your home.</p>
      <div className="rings">
        {steps.map(({ Icon, t, d }, i) => (
          <div className="ring" key={t}>
            <svg viewBox="0 0 80 80" width="88" height="88" aria-hidden>
              <circle cx="40" cy="40" r="34" fill="none" stroke="#f3eee1" strokeWidth="7" />
              <motion.circle cx="40" cy="40" r="34" fill="none" stroke={i % 2 ? '#163f32' : '#d64e19'} strokeWidth="7" strokeLinecap="round" transform="rotate(-90 40 40)" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={inView ? { strokeDashoffset: 0 } : {}} transition={{ duration: 1.1, delay: i * 0.3, ease: 'easeInOut' }} />
            </svg>
            <motion.span className="ring-ic" initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.6 + i * 0.3, type: 'spring' }}><Icon size={24} /></motion.span>
            <b>{t}</b>
            <small>{d}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
