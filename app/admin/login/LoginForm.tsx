'use client';
import { useActionState } from 'react';
import { ChefHat, Loader2, LogIn } from 'lucide-react';
import { loginAction } from '../actions';

export default function LoginForm() {
  const [error, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="adm-login-card">
      <div className="adm-brand"><ChefHat size={30} /> HireCook<span>.pk</span></div>
      <h1>Admin panel</h1>
      <p className="muted">Sign in to manage leads, clients, cooks and website settings.</p>
      <label className="field">Username<input name="username" autoComplete="username" required autoFocus /></label>
      <label className="field">Password<input name="password" type="password" autoComplete="current-password" required /></label>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn btn-primary btn-block" disabled={pending}>{pending ? <Loader2 className="spin" size={18} /> : <LogIn size={18} />} Sign in</button>
    </form>
  );
}
