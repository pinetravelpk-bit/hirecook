// Small formatting helpers shared by admin pages.
export function fmtDate(s?: string | null) {
  if (!s) return '';
  const d = new Date(s.replace(' ', 'T') + (s.includes('T') || s.endsWith('Z') ? '' : 'Z'));
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString('en-PK', { timeZone: 'Asia/Karachi', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

export function waHref(phone: string, text = 'Assalam o Alaikum, this is HireCook.pk regarding your cook request.') {
  const d = String(phone || '').replace(/\D/g, '');
  const intl = d.startsWith('0') ? '92' + d.slice(1) : d;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}
