import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Search, Download, Plus, Phone } from 'lucide-react';
import { db } from '@/lib/db';
import { entities, isEntity } from '@/lib/admin-config';
import { fmtDate, waHref } from '../../ui';

const PAGE = 50;

export default async function List({ params, searchParams }: { params: Promise<{ entity: string }>; searchParams: Promise<{ q?: string; status?: string; p?: string; deleted?: string }> }) {
  const { entity } = await params;
  if (!isEntity(entity)) notFound();
  const sp = await searchParams;
  const cfg = entities[entity];
  const q = (sp.q || '').trim();
  const status = (cfg.statuses as readonly string[]).includes(sp.status || '') ? sp.status! : '';
  const page = Math.max(1, Number(sp.p) || 1);

  const where: string[] = [];
  const args: string[] = [];
  if (q) {
    where.push('(' + cfg.search.map((c) => `t.${c} LIKE ?`).join(' OR ') + ')');
    cfg.search.forEach(() => args.push(`%${q}%`));
  }
  if (status) { where.push('t.status = ?'); args.push(status); }
  const w = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const from = entity === 'clients' ? 'clients t LEFT JOIN cooks c ON c.id = t.cook_id' : `${entity} t`;
  const sel = entity === 'clients' ? 't.*, c.name AS cook_name' : 't.*';
  const d = db();
  const total = (d.prepare(`SELECT COUNT(*) n FROM ${from} ${w}`).get(...args) as { n: number }).n;
  const rows = d.prepare(`SELECT ${sel} FROM ${from} ${w} ORDER BY t.id DESC LIMIT ${PAGE} OFFSET ${(page - 1) * PAGE}`).all(...args) as Record<string, string | number>[];
  const counts = Object.fromEntries((d.prepare(`SELECT status, COUNT(*) n FROM ${entity} GROUP BY status`).all() as { status: string; n: number }[]).map((r) => [r.status, r.n]));
  const qs = (o: Record<string, string | number>) => '?' + new URLSearchParams(Object.entries({ q, status, ...o }).filter(([, v]) => v !== '' && v != null).map(([k, v]) => [k, String(v)])).toString();

  const cell = (r: Record<string, string | number>, k: string) => {
    const v = r[k];
    if (k === 'status') return <span className={`pill st-${v}`}>{v}</span>;
    if (k === 'created_at') return fmtDate(String(v));
    if (k === 'verified') return v ? '✓ Yes' : 'No';
    if (k === 'phone') return v ? <a href={`tel:${v}`} className="adm-link">{v}</a> : '';
    return v ?? '';
  };

  return (
    <>
      <header className="adm-head">
        <div><h1>{cfg.title}</h1><p className="muted">{total} {total === 1 ? cfg.singular.toLowerCase() : cfg.title.toLowerCase()}{status ? ` · ${status}` : ''}{q ? ` · “${q}”` : ''}</p></div>
        <div className="adm-actions">
          <a className="btn btn-outline btn-sm" href={`/admin/export?type=${entity}`}><Download size={16} /> CSV</a>
          <Link className="btn btn-primary btn-sm" href={`/admin/${entity}/new`}><Plus size={16} /> Add {cfg.singular.toLowerCase()}</Link>
        </div>
      </header>
      {sp.deleted && <p className="adm-ok">Deleted.</p>}
      <form className="adm-search">
        <Search size={18} />
        <input name="q" defaultValue={q} placeholder={`Search ${cfg.title.toLowerCase()} by name, phone, area…`} type="search" />
        {status && <input type="hidden" name="status" value={status} />}
      </form>
      <div className="tabs">
        <Link className={'chip' + (!status ? ' active' : '')} href={qs({ status: '', p: '' })}>All</Link>
        {cfg.statuses.map((s) => <Link key={s} className={'chip' + (status === s ? ' active' : '')} href={qs({ status: s, p: '' })}>{s} <small>{counts[s] || 0}</small></Link>)}
      </div>

      {rows.length ? (
        <div className="adm-table">
          <table>
            <thead><tr>{cfg.columns.map(([, l]) => <th key={l}>{l}</th>)}<th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {cfg.columns.map(([k, l], i) => (
                    <td key={k} data-l={l}>{i === 0 ? <Link href={`/admin/${entity}/${r.id}`} className="adm-rowlink">{String(r[k] || '—')}</Link> : cell(r, k)}</td>
                  ))}
                  <td className="adm-rowact">
                    {r.phone ? <><a className="adm-icon" href={`tel:${r.phone}`} aria-label="Call"><Phone size={15} /></a><a className="adm-icon wa" href={waHref(String(r.phone))} target="_blank" rel="noopener">WA</a></> : null}
                    <Link className="adm-link" href={`/admin/${entity}/${r.id}`}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="adm-panel center"><p className="muted">Nothing here yet.</p><Link className="btn btn-primary btn-sm" href={`/admin/${entity}/new`}>Add {cfg.singular.toLowerCase()}</Link></div>
      )}
      {total > PAGE && (
        <nav className="adm-pager">
          {page > 1 && <Link className="chip" href={qs({ p: page - 1 })}>← Prev</Link>}
          <span>Page {page} of {Math.ceil(total / PAGE)}</span>
          {page * PAGE < total && <Link className="chip" href={qs({ p: page + 1 })}>Next →</Link>}
        </nav>
      )}
    </>
  );
}
