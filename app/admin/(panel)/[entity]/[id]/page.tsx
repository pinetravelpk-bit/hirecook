import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, UserPlus, Trash2, Save, Globe } from 'lucide-react';
import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { entities, isEntity, type Field } from '@/lib/admin-config';
import { saveRecord, deleteRecord, convertLead, setLeadStatus } from '../../../actions';
import { fmtDate, waHref } from '../../../ui';
import ConfirmButton from '../../ConfirmButton';

type Rec = Record<string, string | number | null>;

export default async function Edit({ params, searchParams }: { params: Promise<{ entity: string; id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { entity, id } = await params;
  if (!isEntity(entity)) notFound();
  const me = await requireUser();
  const { saved } = await searchParams;
  const cfg = entities[entity];
  const isNew = id === 'new';
  const d = db();
  const rec: Rec = isNew ? { status: cfg.statuses[0], source: 'phone' } : ((d.prepare(`SELECT * FROM ${entity} WHERE id = ?`).get(Number(id)) as Rec | undefined) ?? notFound());
  const cooks = d.prepare("SELECT id, name, speciality, status FROM cooks ORDER BY status = 'available' DESC, name").all() as { id: number; name: string; speciality: string; status: string }[];
  const recId = isNew ? null : Number(id);
  const save = saveRecord.bind(null, entity, recId);

  // Related records
  const clientsOfCook = entity === 'cooks' && recId ? (d.prepare('SELECT id, name, area, status FROM clients WHERE cook_id = ? ORDER BY id DESC').all(recId) as Rec[]) : [];
  const lead = entity === 'clients' && rec.lead_id ? (d.prepare('SELECT id, created_at, page FROM leads WHERE id = ?').get(rec.lead_id) as Rec | undefined) : undefined;

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href={`/admin/${entity}`} className="adm-link"><ArrowLeft size={14} /> {cfg.title}</Link>
          <h1>{isNew ? `New ${cfg.singular.toLowerCase()}` : String(rec.name)}</h1>
          {!isNew && <p className="muted">Added {fmtDate(String(rec.created_at))}{rec.updated_at !== rec.created_at ? ` · updated ${fmtDate(String(rec.updated_at))}` : ''}</p>}
        </div>
        {!isNew && rec.phone && (
          <div className="adm-actions">
            <a className="btn btn-green btn-sm" href={`tel:${rec.phone}`}><Phone size={16} /> Call</a>
            <a className="btn btn-wa btn-sm" href={waHref(String(rec.phone))} target="_blank" rel="noopener">WhatsApp</a>
          </div>
        )}
      </header>
      {saved && <p className="adm-ok">Saved.</p>}

      {entity === 'leads' && !isNew && (
        <section className="adm-panel">
          <h2>Quick status</h2>
          <div className="tabs">
            {cfg.statuses.map((s) => (
              <form key={s} action={setLeadStatus.bind(null, Number(id), s)}>
                <button className={'chip' + (rec.status === s ? ' active' : '')}>{s}</button>
              </form>
            ))}
          </div>
          <div className="adm-actions" style={{ marginTop: 12 }}>
            {rec.client_id ? (
              <Link className="btn btn-outline btn-sm" href={`/admin/clients/${rec.client_id}`}>Open client record</Link>
            ) : (
              <form action={convertLead.bind(null, Number(id))}><button className="btn btn-primary btn-sm"><UserPlus size={16} /> Convert to client</button></form>
            )}
            {rec.page && <a className="adm-link" href={String(rec.page)} target="_blank" rel="noopener"><Globe size={14} /> Came from {String(rec.page)}</a>}
          </div>
        </section>
      )}

      <form action={save} className="adm-panel adm-form">
        {(cfg.fields as Field[]).map((f) => (
          <FieldInput key={f.name} f={f} v={rec[f.name]} cooks={cooks} />
        ))}
        <div className="adm-formbar">
          <button className="btn btn-primary"><Save size={17} /> {isNew ? 'Create' : 'Save changes'}</button>
          <Link href={`/admin/${entity}`} className="btn btn-outline">Cancel</Link>
        </div>
      </form>

      {lead && <p className="muted">Created from <Link className="adm-link" href={`/admin/leads/${lead.id}`}>lead #{String(lead.id)}</Link> received {fmtDate(String(lead.created_at))}.</p>}
      {clientsOfCook.length > 0 && (
        <section className="adm-panel">
          <h2>Placements</h2>
          <ul className="adm-top">{clientsOfCook.map((c) => <li key={String(c.id)}><Link className="adm-link" href={`/admin/clients/${c.id}`}>{String(c.name)}, {String(c.area || '')}</Link><span className={`pill st-${c.status}`}>{String(c.status)}</span></li>)}</ul>
        </section>
      )}

      {!isNew && me.role === 'admin' && (
        <form action={deleteRecord.bind(null, entity, Number(id))} className="adm-danger">
          <ConfirmButton message={`Delete this ${cfg.singular.toLowerCase()} permanently?`}><Trash2 size={16} /> Delete {cfg.singular.toLowerCase()}</ConfirmButton>
        </form>
      )}
    </>
  );
}

function FieldInput({ f, v, cooks }: { f: Field; v: string | number | null | undefined; cooks: { id: number; name: string; speciality: string; status: string }[] }) {
  const val = v == null ? '' : String(v);
  const cls = 'field' + (f.wide || f.type === 'textarea' ? ' wide' : '');
  switch (f.type) {
    case 'textarea':
      return <label className={cls}>{f.label}<textarea name={f.name} defaultValue={val} rows={4} /></label>;
    case 'select':
      return (
        <label className={cls}>{f.label}
          <select name={f.name} defaultValue={val}>
            <option value="">—</option>
            {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
            {val && !f.options!.includes(val) && <option value={val}>{val}</option>}
          </select>
        </label>
      );
    case 'cook':
      return (
        <label className={cls}>{f.label}
          <select name={f.name} defaultValue={val}>
            <option value="">Not assigned</option>
            {cooks.map((c) => <option key={c.id} value={c.id}>{c.name}{c.speciality ? ` (${c.speciality})` : ''}{c.status !== 'available' ? ` · ${c.status}` : ''}</option>)}
          </select>
        </label>
      );
    case 'checkbox':
      return <label className="field check"><input type="checkbox" name={f.name} defaultChecked={!!Number(val)} /> {f.label}</label>;
    default:
      return <label className={cls}>{f.label}<input name={f.name} type={f.type || 'text'} defaultValue={val} required={f.required} /></label>;
  }
}
