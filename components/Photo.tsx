import Image from 'next/image';
import { photos, photoSrc, type PhotoKey } from '@/lib/images';

export default function Photo({ k, alt, priority, sizes = '(max-width: 820px) 100vw, 50vw', pos }: { k: PhotoKey; alt?: string; priority?: boolean; sizes?: string; pos?: string }) {
  return (
    <Image
      src={photoSrc(k)}
      alt={alt || photos[k]}
      fill
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      sizes={sizes}
      style={{ objectFit: 'cover', objectPosition: pos || 'center' }}
    />
  );
}
