import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Photo from './Photo';
import Reveal from './Reveal';
import { cities } from '@/lib/cities';
import { areasOf } from '@/lib/areas';

/** Cards for all 10 cities: full service in the twin cities, male cooks elsewhere. */
export default function CityGrid({ only }: { only?: 'outside' }) {
  const list = only === 'outside' ? cities.filter((c) => !c.full) : cities;
  return (
    <div className="city-grid scroller">
      {list.map((c, i) => (
        <Reveal key={c.name} delay={(i % 4) * 0.06}>
          <Link className="card city-card" href={`/c/${c.slug}`} style={{ height: '100%' }}>
            <div className="media">
              <Photo k={c.photo} sizes="(max-width: 820px) 62vw, 25vw" alt={`${c.name}, ${c.province}`} />
              <span className={'tag' + (c.full ? ' full' : '')}>{c.full ? 'All cook services' : 'Male cooks'}</span>
            </div>
            <div className="body">
              <h3>{c.full ? 'Cooks' : 'Male Cooks'} in {c.name}</h3>
              <p>{areasOf(c.name).length} areas · {c.province}</p>
              <span className="more">View areas <ArrowRight size={15} /></span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
