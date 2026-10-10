'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, label, icon, badge }: { href: string; label: string; icon: React.ReactNode; badge?: number }) {
  const path = usePathname();
  const active = href === '/admin' ? path === href : path.startsWith(href);
  return (
    <Link href={href} className={'adm-nav' + (active ? ' on' : '')} aria-current={active ? 'page' : undefined}>
      {icon}
      <span>{label}</span>
      {!!badge && <i>{badge}</i>}
    </Link>
  );
}
