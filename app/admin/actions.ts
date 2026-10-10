'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db, hashPassword } from '@/lib/db';
import { login, logout, requireUser, verifyPassword } from '@/lib/auth';
import { entities, isEntity } from '@/lib/admin-config';
import { defaults, saveSettings, type SettingKey } from '@/lib/site';

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? '').trim().slice(0, max);

export async function loginAction(_: string | null, fd: FormData) {
  const err = await login(str(fd, 'username', 60), str(fd, 'password', 200));
  if (err) return err;
  redirect('/admin');
}

export async function logoutAction() {
  await logout();
  redirect('/admin/login');
}

export async function saveRecord(entity: string, id: number | null, fd: FormData) {
  await requireUser();
  if (!isEntity(entity)) throw new Error('Unknown entity');
  const fields = entities[entity].fields;
  const cols: string[] = [];
  const vals: (string | number | null)[] = [];
  for (const f of fields) {
    let v: string | number | null = f.type === 'checkbox' ? (fd.get(f.name) ? 1 : 0) : str(fd, f.name);
    if (f.type === 'cook') v = v ? Number(v) : null;
    if (f.required && !v) throw new Error(`${f.label} is required`);
    cols.push(f.name);
    vals.push(v);
  }
  const d = db();
  let newId = id;
  if (id) {
    d.prepare(`UPDATE ${entity} SET ${cols.map((c) => `${c} = ?`).join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...vals, id);
  } else {
    const r = d.prepare(`INSERT INTO ${entity} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`).run(...vals);
    newId = Number(r.lastInsertRowid);
  }
  // Keep cook status in sync when assigned to an active client.
  if (entity === 'clients') {
    const cook = Number(fd.get('cook_id')) || null;
    if (cook && str(fd, 'status') === 'active') d.prepare("UPDATE cooks SET status = 'placed', updated_at = datetime('now') WHERE id = ?").run(cook);
  }
  revalidatePath('/admin', 'layout');
  redirect(`/admin/${entity}/${newId}?saved=1`);
}

export async function deleteRecord(entity: string, id: number) {
  await requireUser('admin');
  if (!isEntity(entity)) throw new Error('Unknown entity');
  db().prepare(`DELETE FROM ${entity} WHERE id = ?`).run(id);
  revalidatePath('/admin', 'layout');
  redirect(`/admin/${entity}?deleted=1`);
}

export async function setLeadStatus(id: number, status: string) {
  await requireUser();
  if (!(entities.leads.statuses as readonly string[]).includes(status)) return;
  db().prepare("UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
  revalidatePath('/admin', 'layout');
}

export async function convertLead(id: number) {
  await requireUser();
  const d = db();
  const l = d.prepare('SELECT * FROM leads WHERE id = ?').get(id) as Record<string, string> | undefined;
  if (!l) redirect('/admin/leads');
  if (l.client_id) redirect(`/admin/clients/${l.client_id}`);
  const r = d.prepare('INSERT INTO clients (name, phone, city, area, service, start_date, notes, lead_id) VALUES (?,?,?,?,?,?,?,?)')
    .run(l.name, l.phone, l.city, l.area, l.service, l.start, [l.notes, l.admin_notes].filter(Boolean).join('\n\n'), id);
  const cid = Number(r.lastInsertRowid);
  d.prepare("UPDATE leads SET client_id = ?, status = 'hired', updated_at = datetime('now') WHERE id = ?").run(cid, id);
  revalidatePath('/admin', 'layout');
  redirect(`/admin/clients/${cid}?saved=1`);
}

export async function saveSettingsAction(fd: FormData) {
  await requireUser('admin');
  const vals: Partial<Record<SettingKey, string>> = {};
  for (const k of Object.keys(defaults) as SettingKey[]) vals[k] = str(fd, k, 300);
  saveSettings(vals);
  // Rebuild every public page with the new phone / address / hours.
  revalidatePath('/', 'layout');
  redirect('/admin/settings?saved=1');
}

export async function addUser(fd: FormData) {
  await requireUser('admin');
  const username = str(fd, 'username', 40).toLowerCase();
  const pw = str(fd, 'password', 200);
  if (!/^[a-z0-9._-]{3,40}$/.test(username) || pw.length < 8) redirect('/admin/users?error=Username (3+ letters/numbers) and password (8+ characters) required');
  try {
    db().prepare('INSERT INTO users (username, name, password_hash, role) VALUES (?,?,?,?)').run(username, str(fd, 'name', 80), hashPassword(pw), str(fd, 'role') === 'admin' ? 'admin' : 'staff');
  } catch {
    redirect('/admin/users?error=That username already exists');
  }
  redirect('/admin/users?saved=1');
}

export async function deleteUser(id: number) {
  const me = await requireUser('admin');
  if (id === me.id) redirect('/admin/users?error=You cannot delete yourself');
  db().prepare('DELETE FROM users WHERE id = ?').run(id);
  redirect('/admin/users?saved=1');
}

export async function changePassword(fd: FormData) {
  const me = await requireUser();
  const cur = str(fd, 'current', 200);
  const next = str(fd, 'next', 200);
  const row = db().prepare('SELECT password_hash FROM users WHERE id = ?').get(me.id) as { password_hash: string };
  if (!verifyPassword(cur, row.password_hash)) redirect('/admin/users?error=Current password is wrong');
  if (next.length < 8) redirect('/admin/users?error=New password must be at least 8 characters');
  db().prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(next), me.id);
  redirect('/admin/users?saved=Password changed');
}
