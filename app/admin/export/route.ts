import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { isEntity } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

// CSV export: /admin/export?type=leads|clients|cooks  (opens in Excel / Google Sheets)
export async function GET(req: Request) {
  if (!(await currentUser())) return new Response('Unauthorized', { status: 401 });
  const type = new URL(req.url).searchParams.get('type') || 'leads';
  if (!isEntity(type)) return new Response('Bad type', { status: 400 });
  const rows = db().prepare(`SELECT * FROM ${type} ORDER BY id DESC`).all() as Record<string, unknown>[];
  const cols = rows.length ? Object.keys(rows[0]) : ['id'];
  const esc = (v: unknown) => {
    let s = v == null ? '' : String(v);
    if (/^[=+\-@]/.test(s)) s = "'" + s; // block spreadsheet formula injection
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = '﻿' + [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\r\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="hirecook-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
