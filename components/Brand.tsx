import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="HireCook.pk home">
      <ChefHat size={34} strokeWidth={1.6} aria-hidden />
      <span>
        HireCook<span className="dot">.pk</span>
      </span>
    </Link>
  );
}
