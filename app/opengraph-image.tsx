import { ImageResponse } from 'next/og';

export const alt = 'HireCook.pk: Hire cooks & chefs in Islamabad and Rawalpindi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#163f32', padding: 70, color: '#faf7ef' }}>
        <div style={{ display: 'flex', fontSize: 44, fontWeight: 700 }}>
          HireCook<span style={{ color: '#f08a5d' }}>.pk</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Hire a Cook in Islamabad &amp; Rawalpindi</div>
          <div style={{ fontSize: 34, marginTop: 24, color: '#c9d6cc' }}>Male cooks · Home cooks · Private chefs · Restaurant &amp; event cooks</div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Screened cooks', 'Trial cook first', 'Shortlist in 24–48h'].map((t) => (
            <div key={t} style={{ display: 'flex', background: '#d64e19', borderRadius: 999, padding: '12px 26px', fontSize: 26 }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
