import 'server-only';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, existsSync, readFileSync, renameSync } from 'node:fs';
import path from 'node:path';
import { scryptSync, randomBytes } from 'node:crypto';

// Single SQLite file for leads, clients, cooks, settings and admin users.
const DIR = process.env.LEADS_DIR || path.join(process.cwd(), 'data');
const FILE = path.join(DIR, 'hirecook.db');

declare global {
  var __hcdb: DatabaseSync | undefined;
}

export function db(): DatabaseSync {
  if (globalThis.__hcdb) return globalThis.__hcdb;
  mkdirSync(DIR, { recursive: true });
  const d = new DatabaseSync(FILE);
  d.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      name TEXT NOT NULL, phone TEXT NOT NULL,
      city TEXT, area TEXT, service TEXT, schedule TEXT, people TEXT, budget TEXT, start TEXT,
      notes TEXT, page TEXT, ip TEXT,
      source TEXT NOT NULL DEFAULT 'website',
      status TEXT NOT NULL DEFAULT 'new',
      admin_notes TEXT, follow_up TEXT, client_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT,
      city TEXT, area TEXT, address TEXT, service TEXT,
      cook_id INTEGER, start_date TEXT, fee TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      notes TEXT, lead_id INTEGER
    );
    CREATE TABLE IF NOT EXISTS cooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      name TEXT NOT NULL, phone TEXT, cnic TEXT,
      city TEXT, area TEXT, speciality TEXT, experience TEXT, schedule TEXT,
      verified INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'available',
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL, name TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS leads_created ON leads(created_at);
  `);
  globalThis.__hcdb = d;
  seed(d);
  return d;
}

export function hashPassword(pw: string) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(pw, salt, 64).toString('hex')}`;
}

function seed(d: DatabaseSync) {
  // First admin from env (ADMIN_USER / ADMIN_PASSWORD).
  const n = d.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number };
  if (!n.n && process.env.ADMIN_PASSWORD) {
    d.prepare('INSERT INTO users (username, name, password_hash, role) VALUES (?, ?, ?, ?)').run(
      process.env.ADMIN_USER || 'admin', 'Administrator', hashPassword(process.env.ADMIN_PASSWORD), 'admin',
    );
  }
  // One-time import of leads saved by the earlier JSONL version.
  const legacy = path.join(DIR, 'leads.jsonl');
  if (existsSync(legacy)) {
    const ins = d.prepare('INSERT INTO leads (created_at, updated_at, name, phone, city, area, service, schedule, people, budget, start, notes, page, ip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    for (const line of readFileSync(legacy, 'utf8').split('\n').filter(Boolean)) {
      try {
        const l = JSON.parse(line);
        const at = String(l.at || '').replace('T', ' ').slice(0, 19);
        ins.run(at, at, l.name || '', l.phone || '', l.city || '', l.area || '', l.service || '', l.schedule || '', l.people || '', l.budget || '', l.start || '', l.notes || '', l.page || '', l.ip || '');
      } catch {}
    }
    renameSync(legacy, legacy + '.imported');
  }
}

export type Row = Record<string, string | number | null>;
