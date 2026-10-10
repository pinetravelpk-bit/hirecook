import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found | HireCook.pk', robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="wrap section center">
      <p className="eyebrow">404</p>
      <h1>This page has left the kitchen.</h1>
      <p className="lead">The page you are looking for does not exist. Try our services directory or hire a cook directly.</p>
      <div className="actions" style={{ justifyContent: 'center' }}>
        <Link className="btn btn-primary" href="/services">Browse services</Link>
        <Link className="btn btn-outline" href="/hire">Hire a cook</Link>
      </div>
    </main>
  );
}
