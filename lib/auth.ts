import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { db } from './db';

const COOKIE = 'hc_session';
const TTL = 60 * 60 * 24 * 14; // 14 days

export type User = { id: number; username: string; name: string | null; role: 'admin' | 'staff' };

function secret() {
  if (process.env.ADMIN_SECRET) return process.env.ADMIN_SECRET;
  const d = db();
  const row = d.prepare("SELECT value FROM settings WHERE key = '_session_secret'").get() as { value: string } | undefined;
  if (row) return row.value;
  const s = randomBytes(32).toString('hex');
  d.prepare("INSERT INTO settings (key, value) VALUES ('_session_secret', ?)").run(s);
  return s;
}

const sign = (v: string) => createHmac('sha256', secret()).update(v).digest('base64url');

export function verifyPassword(pw: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, 'hex');
  const b = scryptSync(pw, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}

const attempts = new Map<string, number[]>();

export async function login(username: string, password: string): Promise<string | null> {
  const key = username.toLowerCase();
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((t) => now - t < 15 * 60_000);
  if (recent.length >= 8) return 'Too many attempts. Try again in 15 minutes.';
  const u = db().prepare('SELECT id, password_hash FROM users WHERE lower(username) = ?').get(key) as { id: number; password_hash: string } | undefined;
  if (!u || !verifyPassword(password, u.password_hash)) {
    attempts.set(key, [...recent, now]);
    return 'Wrong username or password.';
  }
  attempts.delete(key);
  const exp = Math.floor(now / 1000) + TTL;
  const v = `${u.id}.${exp}`;
  (await cookies()).set(COOKIE, `${v}.${sign(v)}`, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: TTL });
  return null;
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return null;
  const [id, exp, sig] = c.split('.');
  if (!id || !exp || !sig) return null;
  const expected = sign(`${id}.${exp}`);
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  return (db().prepare('SELECT id, username, name, role FROM users WHERE id = ?').get(Number(id)) as User | undefined) || null;
}

/** Use at the top of every admin page and server action. */
export async function requireUser(role?: 'admin'): Promise<User> {
  const u = await currentUser();
  if (!u) redirect('/admin/login');
  if (role === 'admin' && u.role !== 'admin') redirect('/admin');
  return u;
}
