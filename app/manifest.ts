import type { MetadataRoute } from 'next';

// Installable PWA so the site opens like an app on phones.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HireCook.pk: Hire Cooks in Islamabad & Rawalpindi',
    short_name: 'HireCook',
    description: 'Hire home cooks, male cooks and chefs in Islamabad and Rawalpindi.',
    start_url: '/?source=pwa',
    display: 'standalone',
    background_color: '#faf7ef',
    theme_color: '#163f32',
    orientation: 'portrait',
    categories: ['lifestyle', 'food', 'business'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Hire a cook', url: '/hire' },
      { name: 'All services', url: '/services' },
      { name: 'Contact', url: '/contact' },
    ],
  };
}
