import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/plus-jakarta-sans';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Dock from '@/components/Dock';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/site';
import { orgSchema } from '@/lib/schema';


export const metadata: Metadata = {
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
    'geo.region': 'PK-IS',
    'geo.placename': 'Islamabad',
    'geo.position': `${site.geo.lat};${site.geo.lng}`,
    ICBM: `${site.geo.lat}, ${site.geo.lng}`,
    'mobile-web-app-capable': 'yes',
  },
  verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined },
};

export const viewport: Viewport = {
  themeColor: '#163f32',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const GA = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <JsonLd data={orgSchema()} />
        <Header />
        {children}
        <Footer />
        <Dock />
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
