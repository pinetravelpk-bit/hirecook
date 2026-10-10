import { db } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { addUser, deleteUser, changePassword } from '../../actions';
import { fmtDate } from '../../ui';
import ConfirmButton from '../ConfirmButton';

export default async function Users({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const me = await requireUser();
  const { saved, error } = await searchParams;
  const users = db().prepare('SELECT id, username, name, role, created_at FROM users ORDER BY id').all() as { id: number; username: string; name: string; role: string; created_at: string }[];
  return (
    <>
      <header className="adm-head"><div><h1>Users &amp; password</h1><p className="muted">Admins can manage everything. Staff can manage leads, clients and cooks but cannot delete records or change settings.</p></div></header>
      {saved && <p className="adm-ok">{saved === '1' ? 'Saved.' : saved}</p>}
      {error && <p className="err">{error}</p>}

      <section className="adm-panel">
        <h2>Change my password</h2>
        <form action={changePassword} className="adm-form">
          <label className="field">Current password<input name="current" type="password" autoComplete="current-password" required /></label>
          <label className="field">New password (8+ characters)<input name="next" type="password" autoComplete="new-password" minLength={8} required /></label>
          <div className="adm-formbar"><button className="btn btn-primary btn-sm">Update password</button></div>
        </form>
      </section>

      {me.role === 'admin' && (
        <>
          <section className="adm-panel">
            <h2>Team</h2>
            <ul className="adm-top">
              {users.map((u) => (
                <li key={u.id}>
                  <span><b>{u.name || u.username}</b> · @{u.username} · <span className={`pill st-${u.role === 'admin' ? 'hired' : 'contacted'}`}>{u.role}</span> <small className="muted">since {fmtDate(u.created_at)}</small></span>
                  {u.id !== me.id && (
                    <form action={deleteUser.bind(null, u.id)}><ConfirmButton message={`Remove ${u.username}?`}>Remove</ConfirmButton></form>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section className="adm-panel">
            <h2>Add team member</h2>
            <form action={addUser} className="adm-form">
              <label className="field">Full name<input name="name" /></label>
              <label className="field">Username<input name="username" required pattern="[a-zA-Z0-9._\-]{3,40}" /></label>
              <label className="field">Password (8+ characters)<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
              <label className="field">Role<select name="role" defaultValue="staff"><option value="staff">Staff</option><option value="admin">Admin</option></select></label>
              <div className="adm-formbar"><button className="btn btn-primary btn-sm">Add user</button></div>
            </form>
          </section>
        </>
      )}
    </>
  );
}
