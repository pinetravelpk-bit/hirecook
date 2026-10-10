import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import LoginForm from './LoginForm';
import '../admin.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Admin login | HireCook.pk', robots: { index: false, follow: false } };

export default async function Login() {
  if (await currentUser()) redirect('/admin');
  return (
    <main className="adm-login">
      <LoginForm />
    </main>
  );
}
