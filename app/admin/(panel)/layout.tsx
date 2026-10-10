import type { Metadata } from 'next';
import Link from 'next/link';
import { LayoutDashboard, Inbox, Users, ChefHat, Settings, UserCog, LogOut, ExternalLink } from 'lucide-react';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { logoutAction } from '../actions';
import NavLink from './NavLink';
import '../admin.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin | HireCook.pk', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser();
  const fresh = (db().prepare("SELECT COUNT(*) AS n FROM leads WHERE status = 'new'").get() as { n: number }).n;
  const nav = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/admin/leads', label: 'Leads', icon: <Inbox size={20} />, badge: fresh },
    { href: '/admin/clients', label: 'Clients', icon: <Users size={20} /> },
    { href: '/admin/cooks', label: 'Cooks', icon: <ChefHat size={20} /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
    { href: '/admin/users', label: 'Users', icon: <UserCog size={20} /> },
  ];
  return (
    <div className="adm">
      <aside className="adm-side">
        <Link href="/admin" className="adm-brand"><ChefHat size={26} /> HireCook<span>.pk</span></Link>
        <nav>
          {nav.map((n) => <NavLink key={n.href} {...n} />)}
        </nav>
        <div className="adm-me">
          <a href="/" target="_blank" rel="noopener"><ExternalLink size={16} /> View website</a>
          <span>Signed in as <b>{me.name || me.username}</b> ({me.role})</span>
          <form action={logoutAction}><button className="adm-link"><LogOut size={16} /> Sign out</button></form>
        </div>
      </aside>
      <div className="adm-main">
        <div className="adm-mobile-out"><span>Hi, <b>{me.name || me.username}</b></span><form action={logoutAction}><button className="adm-link"><LogOut size={14} /> Sign out</button></form></div>
        {children}
      </div>
    </div>
  );
}
