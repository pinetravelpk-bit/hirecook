'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Landmark, ChefHat, ArrowRight } from 'lucide-react';
import { areas } from '@/lib/areas';

const types = ['Home cook', 'Male cook', 'Full-time cook', 'Part-time cook', 'Live-in cook', 'Private chef', 'Desi cook', 'BBQ chef', 'Chinese chef', 'Restaurant chef', 'Office cook', 'Event / dawat cook'];

export default function Finder() {
  const router = useRouter();
  const [city, setCity] = useState('Islamabad');
  const [area, setArea] = useState('');
  const [type, setType] = useState('');
  const list = areas.filter((a) => a.city === city && a.name !== 'Rawalpindi');
  return (
    <form
      className="finder"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/hire?city=${encodeURIComponent(city)}&area=${encodeURIComponent(area)}&type=${encodeURIComponent(type || 'Home cook')}#hire-form`);
      }}
    >
      <label><MapPin size={20} aria-hidden /><span className="sr-only">City</span>
        <select value={city} onChange={(e) => { setCity(e.target.value); setArea(''); }}>
          <option>Islamabad</option><option>Rawalpindi</option>
        </select>
      </label>
      <label><Landmark size={20} aria-hidden /><span className="sr-only">Area</span>
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Select area</option>
          {list.map((a) => <option key={a.name}>{a.name}</option>)}
        </select>
      </label>
      <label><ChefHat size={20} aria-hidden /><span className="sr-only">Cook type</span>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Cook type</option>
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <button className="btn btn-primary">Find a Cook <ArrowRight size={18} /></button>
    </form>
  );
}
