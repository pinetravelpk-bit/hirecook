'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import WaIcon from './WaIcon';
import { useSite } from './SiteContext';
import { areas } from '@/lib/areas';
import { cities, isFullService } from '@/lib/cities';

const cookTypes = ['Home cook', 'Male cook', 'Full-time cook', 'Part-time cook', 'Live-in cook', 'Private / personal chef', 'Desi / Pakistani food cook', 'BBQ / tandoor cook', 'Chinese / continental chef', 'Bakery / pastry chef', 'Diet / meal prep chef', 'Restaurant / hotel chef', 'Office / canteen / mess cook', 'Event / wedding / dawat cook'];
const maleTypes = ['Male home cook', 'Full-time male cook', 'Part-time male cook', 'Live-in male cook', 'Live-out male cook'];
const schedules = ['Full-time', 'Part-time', 'Live-in', 'Live-out', 'Morning', 'Evening', 'Weekend', 'One-off event'];

type Props = { service?: string; city?: string; area?: string; compact?: boolean; id?: string };

export default function HireForm({ service = '', city: city0 = 'Islamabad', area: area0 = '', compact, id = 'hire-form' }: Props) {
  const site = useSite();
  const [city, setCity] = useState(cities.some((c) => c.name === city0) ? city0 : city0.includes('Rawalpindi') ? 'Rawalpindi' : 'Islamabad');
  const [area, setArea] = useState(area0);
  const [type, setType] = useState(service);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const pc = p.get('city');
    if (pc && cities.some((c) => c.name === pc)) setCity(pc);
    if (p.get('area')) setArea(p.get('area')!);
    if (p.get('service') || p.get('type')) setType(p.get('service') || p.get('type')!);
  }, []);

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    data.city = city;
    data.page = window.location.pathname;
    const text = `Assalam o Alaikum HireCook.pk, I want to hire a cook.\nName: ${data.name}\nPhone: ${data.phone}\nCity/Area: ${data.area}, ${city}\nCook needed: ${data.service}\nSchedule: ${data.schedule}\nFamily size / guests: ${data.people || '-'}\nTimings: ${data.budget || '-'}\nStart: ${data.start || '-'}\nDetails: ${data.notes || '-'}`;
    setSummary(text);
    setState('sending');
    try {
      const r = await fetch('/api/hire', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error();
      setState('done');
      const w = window as unknown as { gtag?: (...a: unknown[]) => void };
      w.gtag?.('event', 'generate_lead', { service: data.service, city });
    } catch {
      setState('error');
    }
  }

  const cityAreas = areas.filter((a) => a.city === city && a.name !== 'Rawalpindi');

  return (
    <div className="panel" id={id}>
      <AnimatePresence mode="wait">
        {state === 'done' ? (
          <motion.div key="ok" className="form-ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="ok-ic"><CheckCircle2 size={40} /></div>
            <h3>Request received!</h3>
            <p>Our team will call or WhatsApp you shortly with suitable cook profiles. For a faster reply, send your request on WhatsApp now.</p>
            <a className="btn btn-wa btn-block" href={site.whatsappHref(summary)} target="_blank" rel="noopener"><WaIcon size={20} /> Send on WhatsApp</a>
          </motion.div>
        ) : (
          <motion.form key="form" className="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!compact && (
              <div>
                <h3>Hire a cook in 2 minutes</h3>
                <p className="muted" style={{ margin: 0 }}>Free request. No obligation. We reply within working hours.</p>
              </div>
            )}
            <input className="hp" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden />
            <div className="form-grid">
              <label className="field">Your name<input name="name" required autoComplete="name" placeholder="Full name" /></label>
              <label className="field">Phone / WhatsApp<input name="phone" required type="tel" inputMode="tel" autoComplete="tel" placeholder="03XX XXXXXXX" pattern="[0-9+\-\s]{10,16}" /></label>
            </div>
            <label className="field">City
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                {cities.map((c) => <option key={c.name} value={c.name}>{c.name}{c.full ? '' : ' (male cooks)'}</option>)}
              </select>
            </label>
            {!isFullService(city) && <p className="scope-note" style={{ margin: 0 }}>In {city} we currently provide male cooks only: home, full-time, part-time and live-in.</p>}
            <div className="form-grid">
              <label className="field">Area / sector / society
                <input name="area" required list={id + '-areas'} value={area} onChange={(e) => setArea(e.target.value)} placeholder={isFullService(city) ? 'e.g. F-10, Bahria Phase 7' : 'Your area / society'} />
                <datalist id={id + '-areas'}>{cityAreas.map((a) => <option key={a.name} value={a.name} />)}</datalist>
              </label>
              <label className="field">Cook needed
                <input name="service" required list={id + '-types'} value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. Male home cook" />
                <datalist id={id + '-types'}>{(isFullService(city) ? cookTypes : maleTypes).map((t) => <option key={t} value={t} />)}</datalist>
              </label>
            </div>
            <div className="field">
              Schedule
              <div className="seg">
                {schedules.map((s, i) => (
                  <label key={s}><input type="radio" name="schedule" value={s} defaultChecked={i === 0} /><span>{s}</span></label>
                ))}
              </div>
            </div>
            <div className="form-grid">
              <label className="field">Family size / guests<input name="people" inputMode="numeric" placeholder="e.g. 5 people" /></label>
              <label className="field">Preferred timings<input name="budget" placeholder="e.g. 9am – 6pm" /></label>
            </div>
            {!compact && <label className="field">Start date<input name="start" type="date" /></label>}
            <label className="field">Cuisine &amp; details<textarea name="notes" rows={compact ? 2 : 3} placeholder="Desi, BBQ, Chinese… timings, accommodation, special diets" /></label>
            {state === 'error' && <p className="err" role="alert">Could not send right now. Please send your request on WhatsApp below.</p>}
            <button className="btn btn-primary btn-block" disabled={state === 'sending'}>
              {state === 'sending' ? <Loader2 size={18} className="spin" /> : <Send size={18} />} {state === 'sending' ? 'Sending…' : 'Send Hiring Request'}
            </button>
            <a className="btn btn-wa btn-block" href={site.whatsappHref(summary || `Assalam o Alaikum, I want to hire a ${type || 'cook'} in ${area ? area + ', ' : ''}${city}.`)} target="_blank" rel="noopener"><WaIcon size={18} /> Or WhatsApp us directly</a>
            <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>By sending, you agree to be contacted about your request. See our <a href="/privacy" style={{ textDecoration: 'underline' }}>privacy policy</a>.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
