import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

const hits = new Map<string, number[]>();

function clean(v: unknown, max = 500) {
  return String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
}

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 });
  hits.set(ip, [...recent, now]);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (body.company) return NextResponse.json({ ok: true }); // honeypot

  const lead = {
    at: new Date().toISOString(),
    name: clean(body.name, 80),
    phone: clean(body.phone, 20),
    city: clean(body.city, 30),
    area: clean(body.area, 80),
    service: clean(body.service, 120),
    schedule: clean(body.schedule, 40),
    people: clean(body.people, 40),
    budget: clean(body.budget, 40),
    start: clean(body.start, 20),
    notes: clean(body.notes, 1000),
    page: clean(body.page, 200),
    ip,
  };
  if (!lead.name || !/^[0-9+\-\s]{10,16}$/.test(lead.phone)) {
    return NextResponse.json({ ok: false, error: 'Invalid name or phone' }, { status: 400 });
  }

  db().prepare('INSERT INTO leads (name, phone, city, area, service, schedule, people, budget, start, notes, page, ip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(lead.name, lead.phone, lead.city, lead.area, lead.service, lead.schedule, lead.people, lead.budget, lead.start, lead.notes, lead.page, lead.ip);

  const text = `New cook request (HireCook.pk)\n${lead.name} · ${lead.phone}\n${lead.service} · ${lead.schedule}\n${lead.area}, ${lead.city}\nPeople: ${lead.people} · Timings: ${lead.budget} · Start: ${lead.start}\n${lead.notes}\nPage: ${lead.page}`;

  // Optional email notification (set SMTP_* env vars).
  if (process.env.SMTP_HOST && process.env.LEADS_EMAIL_TO) {
    try {
      const nodemailer = await import('nodemailer');
      const t = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_PORT === '465',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await t.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: process.env.LEADS_EMAIL_TO, subject: `New cook request: ${lead.service} – ${lead.area}`, text });
    } catch (err) {
      console.error('lead email failed', err);
    }
  }

  // Optional Telegram notification (set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID).
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text }),
    }).catch((err) => console.error('lead telegram failed', err));
  }

  return NextResponse.json({ ok: true });
}
