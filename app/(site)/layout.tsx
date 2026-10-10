import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Dock from '@/components/Dock';
import JsonLd from '@/components/JsonLd';
import { SiteProvider } from '@/components/SiteContext';
import { publicSite } from '@/lib/site';
import { orgSchema } from '@/lib/schema';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteProvider value={publicSite()}>
      <a className="skip" href="#main">Skip to content</a>
      <JsonLd data={orgSchema()} />
      <Header />
      {children}
      <Footer />
      <Dock />
    </SiteProvider>
  );
}
