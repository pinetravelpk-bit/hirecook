'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight } from 'lucide-react';

type Item = { slug: string; title: string; group: string };

export default function Directory({ items, groups }: { items: Item[]; groups: string[] }) {
  const [q, setQ] = useState('');
  const [g, setG] = useState('All');
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQ(p.get('q') || '');
    if (p.get('group')) setG(p.get('group')!);
  }, []);
  const res = useMemo(() => items.filter((i) => (g === 'All' || i.group === g) && i.title.toLowerCase().includes(q.toLowerCase().trim())), [items, q, g]);
  const shown = g === 'All' ? groups : [g];
  return (
    <>
      <div className="dir-controls">
        <div className="search">
          <Search size={18} aria-hidden />
          <label className="sr-only" htmlFor="dir-q">Search services or areas</label>
          <input id="dir-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: male cook, F-10, BBQ, live in…" />
        </div>
      </div>
      <div className="tabs" role="tablist">
        {['All', ...groups].map((x) => (
          <button key={x} role="tab" aria-selected={g === x} className={'chip' + (g === x ? ' active' : '')} onClick={() => setG(x)}>{x}</button>
        ))}
      </div>
      <p className="muted">{res.length} of {items.length} services</p>
      {shown.map((grp) => {
        const list = res.filter((r) => r.group === grp);
        if (!list.length) return null;
        return (
          <section className="dir-group" key={grp}>
            <h2>{grp}</h2>
            <div className="related">
              {list.map((i) => (
                <Link key={i.slug} href={`/${i.slug}`}><span>{i.title}</span><ArrowUpRight size={16} /></Link>
              ))}
            </div>
          </section>
        );
      })}
      {!res.length && <p>No match. Try a shorter word like “cook”, “chef” or your sector name.</p>}
    </>
  );
}
