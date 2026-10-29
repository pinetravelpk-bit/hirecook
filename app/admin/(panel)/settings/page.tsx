import { requireUser } from '@/lib/auth';
import { getSettings } from '@/lib/site';
import { saveSettingsAction } from '../../actions';
import { Save } from 'lucide-react';

const groups: { title: string; note?: string; fields: [string, string, string?][] }[] = [
  { title: 'Contact', note: 'Shown on every page and used by the Call / WhatsApp buttons.', fields: [['phone', 'Phone (as displayed)', '0339-1222233'], ['whatsapp', 'WhatsApp number (with country code)', '923221223666'], ['email', 'Email']] },
  { title: 'Office address (Google Business Profile must match exactly)', fields: [['street', 'Street / area'], ['locality', 'City'], ['region', 'Province'], ['postalCode', 'Postal code'], ['lat', 'Latitude'], ['lng', 'Longitude']] },
  { title: 'Opening hours', fields: [['hoursLabel', 'Hours (as displayed)'], ['opens', 'Opens (HH:MM)'], ['closes', 'Closes (HH:MM)']] },
  { title: 'Footer & tracking', fields: [['poweredBy', 'Powered by (name)'], ['poweredByUrl', 'Powered by (link)'], ['developedBy', 'Designed & developed by (name)'], ['developedByUrl', 'Designed & developed by (link)'], ['gaId', 'Google Analytics ID (G-XXXX)'], ['gscVerification', 'Google Search Console verification code'], ['bingVerification', 'Bing Webmaster verification code (msvalidate.01)'], ['socialLinks', 'Social profile links (Google Business, Facebook, Instagram, LinkedIn…), comma separated']] },
];

export default async function Settings({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireUser('admin');
  const { saved } = await searchParams;
  const s = getSettings() as Record<string, string>;
  return (
    <>
      <header className="adm-head"><div><h1>Website settings</h1><p className="muted">Changes go live on the website immediately after saving.</p></div></header>
      {saved && <p className="adm-ok">Saved. The website now shows the new details.</p>}
      <form action={saveSettingsAction}>
        {groups.map((g) => (
          <section className="adm-panel adm-form" key={g.title}>
            <h2 className="wide">{g.title}</h2>
            {g.note && <p className="muted wide" style={{ marginTop: -8 }}>{g.note}</p>}
            {g.fields.map(([k, label, ph]) => (
              <label className="field" key={k}>{label}<input name={k} defaultValue={s[k]} placeholder={ph} /></label>
            ))}
          </section>
        ))}
        <div className="adm-formbar sticky"><button className="btn btn-primary"><Save size={17} /> Save settings</button></div>
      </form>
    </>
  );
}
