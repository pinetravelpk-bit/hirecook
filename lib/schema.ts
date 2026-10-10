import { site, registrations } from './site';
import { areas } from './areas';
import type { Page } from './content';
import { photoSrc } from './images';

const ORG_ID = `${site.url}/#organization`;
const BIZ_ID = `${site.url}/#localbusiness`;

export function orgSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORG_ID,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: `${site.url}/icon-512.png`,
      email: site.email,
      telephone: site.phoneIntl,
      sameAs: site.social,
      contactPoint: [{ '@type': 'ContactPoint', telephone: site.phoneIntl, contactType: 'customer service', areaServed: 'PK', availableLanguage: ['English', 'Urdu'] }],
    },
    {
      '@context': 'https://schema.org',
      '@type': ['EmploymentAgency', 'LocalBusiness'],
      '@id': BIZ_ID,
      name: site.name,
      description: site.description,
      url: site.url,
      image: `${site.url}${photoSrc('hero-chef')}`,
      logo: `${site.url}/icon-512.png`,
      telephone: site.phoneIntl,
      email: site.email,
      parentOrganization: { '@id': ORG_ID },
      address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.locality, addressRegion: site.address.region, postalCode: site.address.postalCode, addressCountry: site.address.country },
      geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: site.hours.opens, closes: site.hours.closes }],
      areaServed: [
        { '@type': 'City', name: 'Islamabad', sameAs: 'https://en.wikipedia.org/wiki/Islamabad' },
        { '@type': 'City', name: 'Rawalpindi', sameAs: 'https://en.wikipedia.org/wiki/Rawalpindi' },
        ...areas.filter((a) => a.name !== 'Rawalpindi').map((a) => ({ '@type': 'Place', name: `${a.name}, ${a.city}` })),
      ],
      hasCredential: registrationsSchema(),
      knowsAbout: ['Home cook hiring', 'Male cooks', 'Private chefs', 'Live-in cooks', 'Pakistani cuisine', 'BBQ', 'Catering', 'Restaurant staffing'],
      hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('HireCook.pk ' + site.addressLine)}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: 'en-PK',
      publisher: { '@id': ORG_ID },
      potentialAction: { '@type': 'SearchAction', target: `${site.url}/services?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
    },
  ];
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: site.url + it.path })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function howToSchema(name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    totalTime: 'P2D',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Share your requirements', text: 'Send your area, cuisine, family size, timings and budget via WhatsApp, call or the online hire form.' },
      { '@type': 'HowToStep', position: 2, name: 'Get a shortlist', text: 'HireCook.pk shortlists screened cooks who match your needs, usually within 24–48 hours.' },
      { '@type': 'HowToStep', position: 3, name: 'Interview and trial cook', text: 'Meet the cook and take a trial cook in your own kitchen.' },
      { '@type': 'HowToStep', position: 4, name: 'Hire with clear terms', text: 'Agree duties, timings, off days and notice period in writing, then the cook starts.' },
    ],
  };
}

export function servicePageSchema(p: Page) {
  const url = `${site.url}/${p.e.slug}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${url}#service`,
      name: p.H1,
      serviceType: p.who,
      description: p.description,
      url,
      image: `${site.url}${photoSrc(p.image)}`,
      provider: { '@id': BIZ_ID },
      areaServed: p.area && p.area.name !== 'Rawalpindi'
        ? { '@type': 'Place', name: `${p.area.name}, ${p.area.city}`, containedInPlace: { '@type': 'City', name: p.area.city } }
        : p.city.includes('&') ? [{ '@type': 'City', name: 'Islamabad' }, { '@type': 'City', name: 'Rawalpindi' }] : { '@type': 'City', name: p.city },
      offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', areaServed: p.city },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': url,
      url,
      name: p.title,
      description: p.description,
      inLanguage: 'en-PK',
      isPartOf: { '@id': `${site.url}/#website` },
      about: { '@id': `${url}#service` },
      primaryImageOfPage: `${site.url}${photoSrc(p.image)}`,
      dateModified: new Date().toISOString().slice(0, 10),
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.quick-answer', 'h1'] },
    },
  ];
}

function registrationsSchema() {
  return registrations.map((r) => ({ '@type': 'EducationalOccupationalCredential', name: r.title, recognizedBy: { '@type': 'GovernmentOrganization', name: r.sub } }));
}
