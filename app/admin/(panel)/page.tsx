import Link from 'next/link';
import { Inbox, Sparkles, CalendarDays, CheckCircle2, Users, ChefHat, ArrowRight, Phone } from 'lucide-react';
import { db } from '@/lib/db';
import { leadStatuses } from '@/lib/admin-config';
import { fmtDate, waHref } from '../ui';

type N = { n: number };

export default async function Dashboard() {
  const d = db();
  const one = (sql: string) => (d.prepare(sql).get() as N).n;
  const cards = [
    { label: 'Total leads', value: one('SELECT COUNT(*) n FROM leads'), icon: Inbox, href: '/admin/leads' },
    { label: 'New (not contacted)', value: one("SELECT COUNT(*) n FROM leads WHERE status = 'new'"), icon: Sparkles, href: '/admin/leads?status=new', hot: true },
    { label: 'Leads this week', value: one("SELECT COUNT(*) n FROM leads WHERE created_at >= datetime('now', '-7 days')"), icon: CalendarDays, href: '/admin/leads' },
    { label: 'Hired', value: one("SELECT COUNT(*) n FROM leads WHERE status = 'hired'"), icon: CheckCircle2, href: '/admin/leads?status=hired' },
    { label: 'Active clients', value: one("SELECT COUNT(*) n FROM clients WHERE status = 'active'"), icon: Users, href: '/admin/clients?status=active' },
    { label: 'Available cooks', value: one("SELECT COUNT(*) n FROM cooks WHERE status = 'available'"), icon: ChefHat, href: '/admin/cooks?status=available' },
  ];

  // Leads per day, last 14 days.
  const rows = d.prepare("SELECT date(created_at, '+5 hours') AS day, COUNT(*) AS n FROM leads WHERE created_at >= datetime('now', '-14 days') GROUP BY day").all() as { day: string; n: number }[];
  const days = Array.from({ length: 14 }, (_, i) => {
    const dt = new Date(Date.now() + 5 * 3600_000 - (13 - i) * 86400_000).toISOString().slice(0, 10);
    return { day: dt, n: rows.find((r) => r.day === dt)?.n || 0 };
  });
  const max = Math.max(1, ...days.map((x) => x.n));

  const byStatus = leadStatuses.map((s) => ({ s, n: one(`SELECT COUNT(*) n FROM leads WHERE status = '${s}'`) }));
  const total = Math.max(1, byStatus.reduce((a, b) => a + b.n, 0));
  const top = (col: string) => d.prepare(`SELECT ${col} AS k, COUNT(*) AS n FROM leads WHERE ${col} != '' GROUP BY lower(${col}) ORDER BY n DESC LIMIT 6`).all() as { k: string; n: number }[];
  const recent = d.prepare('SELECT * FROM leads ORDER BY id DESC LIMIT 8').all() as Record<string, string>[];
  const follow = d.prepare("SELECT * FROM leads WHERE follow_up != '' AND follow_up <= date('now', '+5 hours', '+1 day') AND status NOT IN ('hired','lost') ORDER BY follow_up LIMIT 8").all() as Record<string, string>[];

  return (
    <>
      <header className="adm-head"><div><h1>Dashboard</h1><p className="muted">Overview of your cook hiring business.</p></div><Link className="btn btn-primary btn-sm" href="/admin/leads/new">+ Add lead</Link></header>
      <div className="adm-cards">
        {cards.map(({ label, value, icon: I, href, hot }, i) => (
          <Link key={label} href={href} className={'adm-card' + (hot && value ? ' hot' : '')} style={{ animationDelay: `${i * 60}ms` }}>
            <I size={22} />
            <b>{value}</b>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="adm-grid2">
        <section className="adm-panel">
          <h2>Leads, last 14 days</h2>
          <div className="adm-bars">
            {days.map((x, i) => (
              <div key={x.day} title={`${x.day}: ${x.n}`}>
                <span className="v">{x.n || ''}</span>
                <i style={{ height: `${(x.n / max) * 100}%`, animationDelay: `${i * 40}ms` }} />
                <small>{x.day.slice(8)}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="adm-panel">
          <h2>Pipeline</h2>
          <div className="adm-pipe">
            {byStatus.map(({ s, n }) => (
              <Link key={s} href={`/admin/leads?status=${s}`}>
                <span className={`pill st-${s}`}>{s}</span>
                <span className="track"><i style={{ width: `${(n / total) * 100}%` }} /></span>
                <b>{n}</b>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {follow.length > 0 && (
        <section className="adm-panel">
          <h2>Follow-ups due</h2>
          <LeadList rows={follow} />
        </section>
      )}

      <div className="adm-grid2">
        <section className="adm-panel">
          <h2>Most requested services</h2>
          <ol className="adm-top">{top('service').map((t) => <li key={t.k}><span>{t.k}</span><b>{t.n}</b></li>)}</ol>
        </section>
        <section className="adm-panel">
          <h2>Top areas</h2>
          <ol className="adm-top">{top('area').map((t) => <li key={t.k}><span>{t.k}</span><b>{t.n}</b></li>)}</ol>
        </section>
      </div>

      <section className="adm-panel">
        <div className="adm-head" style={{ margin: 0 }}><h2>Latest leads</h2><Link href="/admin/leads" className="adm-link">All leads <ArrowRight size={14} /></Link></div>
        <LeadList rows={recent} />
      </section>
    </>
  );
}

function LeadList({ rows }: { rows: Record<string, string>[] }) {
  if (!rows.length) return <p className="muted">No leads yet. They appear here as soon as someone submits the hire form.</p>;
  return (
    <ul className="adm-leads">
      {rows.map((l) => (
        <li key={l.id}>
          <Link href={`/admin/leads/${l.id}`}>
            <b>{l.name}</b>
            <span>{l.service || 'Cook'} · {l.area}{l.city ? ', ' + l.city : ''}</span>
            <small>{fmtDate(l.created_at)}{l.follow_up ? ` · follow-up ${l.follow_up}` : ''}</small>
          </Link>
          <span className={`pill st-${l.status}`}>{l.status}</span>
          <a className="adm-icon" href={`tel:${l.phone}`} aria-label="Call"><Phone size={16} /></a>
          <a className="adm-icon wa" href={waHref(l.phone)} target="_blank" rel="noopener" aria-label="WhatsApp">WA</a>
        </li>
      ))}
    </ul>
  );
}
