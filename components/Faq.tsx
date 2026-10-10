export default function Faq({ items, openFirst = true }: { items: { q: string; a: string }[]; openFirst?: boolean }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q} open={openFirst && i === 0}>
          <summary>{f.q}</summary>
          <div>{f.a}</div>
        </details>
      ))}
    </div>
  );
}
