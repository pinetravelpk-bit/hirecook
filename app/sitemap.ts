import type { MetadataRoute } from 'next';
import { entries, groups, buildPage } from '@/lib/content';
import { site } from '@/lib/site';
import { photoSrc } from '@/lib/images';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed = ['', '/hire', '/services', '/how-it-works', '/faq', '/about', '/contact'].map((p) => ({
    url: site.url + p,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : p === '/hire' ? 0.9 : 0.7,
  }));
  const cats = groups.map((g) => ({ url: `${site.url}/c/${g.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 }));
  const pages = entries.map((e) => {
    const p = buildPage(e);
    return { url: `${site.url}/${e.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: e.group === 'Cook hiring' ? 0.9 : 0.8, images: [site.url + photoSrc(p.image)] };
  });
  return [...fixed, ...cats, ...pages, { url: `${site.url}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 }, { url: `${site.url}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 }];
}
