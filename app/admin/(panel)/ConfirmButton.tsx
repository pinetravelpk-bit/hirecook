'use client';

export default function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <button className="btn btn-outline btn-sm danger" onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
