import { CheckCircle2, ListChecks } from 'lucide-react';
import type { Article } from '@/lib/longform';

/** Long-form hiring guide with key takeaways and a table of contents. */
export default function LongForm({ a, title }: { a: Article; title: string }) {
  return (
    <section className="wrap section longform" aria-labelledby="guide-title" style={{ paddingTop: 0 }}>
      <div className="lf-grid">
        <aside className="lf-toc">
          <p className="eyebrow">In this guide</p>
          <ol>
            {a.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.h2}</a></li>)}
          </ol>
        </aside>
        <article className="prose lf-body">
          <div className="lf-takeaways">
            <h2 id="guide-title"><ListChecks size={20} /> Key takeaways: {title}</h2>
            <ul>{a.takeaways.map((t) => <li key={t}><CheckCircle2 size={16} /> {t}</li>)}</ul>
          </div>
          {a.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.h2}</h2>
              {s.paras.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
              {s.list && (s.ordered ? (
                <ol>{s.list.map((l) => <li key={l.d}>{l.t && <strong>{l.t}: </strong>}{l.d}</li>)}</ol>
              ) : (
                <ul>{s.list.map((l) => <li key={l.d}>{l.t && <strong>{l.t}: </strong>}{l.d}</li>)}</ul>
              ))}
              {s.table && (
                <div className="lf-table">
                  <table className="table">
                    <thead><tr>{s.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>{s.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
              {s.after?.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
