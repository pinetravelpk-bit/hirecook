import type { Metadata } from 'next';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Leads', robots: { index: false, follow: false } };

type Lead = Record<string, string>;

// View hiring requests: /admin/leads?key=YOUR_ADMIN_KEY (set ADMIN_KEY env var).
export default async function Leads({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) notFound();
  let leads: Lead[] = [];
  try {
    const raw = await readFile(path.join(process.env.LEADS_DIR || path.join(process.cwd(), 'data'), 'leads.jsonl'), 'utf8');
    leads = raw.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)).reverse();
  } catch {}
  return (
    <main id="main" className="wrap section">
      <h1>Hiring requests ({leads.length})</h1>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead><tr>{['Date', 'Name', 'Phone', 'City', 'Area', 'Service', 'Schedule', 'People', 'Budget', 'Notes', 'Page'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i}>
                <td>{new Date(l.at).toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</td>
                <td>{l.name}</td>
                <td><a href={`https://wa.me/${l.phone.replace(/\D/g, '').replace(/^0/, '92')}`} target="_blank" rel="noopener">{l.phone}</a></td>
                <td>{l.city}</td><td>{l.area}</td><td>{l.service}</td><td>{l.schedule}</td><td>{l.people}</td><td>{l.budget}</td><td>{l.notes}</td><td>{l.page}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
