import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/plus-jakarta-sans';
import './globals.css';
import { site, getSettings } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const s = getSettings();
  return {
    metadataBase: new URL(site.url),
    title: { default: 'Hire Cook in Islamabad & Rawalpindi | Male Cooks – HireCook.pk', template: '%s' },
    description: 'Hire screened male cooks, home cooks & chefs in Islamabad and Rawalpindi. Full-time, part-time, live-in. Trial cook first, shortlist in 24–48h.',
    applicationName: site.name,
    keywords: ['hire cook in Islamabad', 'male cook Islamabad', 'home cook Islamabad', 'cook agency Islamabad', 'private chef Islamabad', 'hire cook in Rawalpindi', 'cook near me'],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    formatDetection: { telephone: true },
    openGraph: { type: 'website', locale: 'en_PK', siteName: site.name, url: site.url },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    appleWebApp: { capable: true, title: 'HireCook', statusBarStyle: 'default' },
    other: {
      'geo.region': 'PK-PB',
      'geo.placename': `${s.locality}, Pakistan`,
      'geo.position': `${s.lat};${s.lng}`,
      ICBM: `${s.lat}, ${s.lng}`,
      'mobile-web-app-capable': 'yes',
    },
    verification: { google: s.gscVerification || process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined },
  };
}

export const viewport: Viewport = {
  themeColor: '#163f32',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA = getSettings().gaId || process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en-PK" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        {GA && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}');`}</Script>
          </>
        )}
      </body>
    </html>
  );
}
