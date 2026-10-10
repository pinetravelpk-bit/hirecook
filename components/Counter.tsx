'use client';
import { animate, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

export default function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => (el.textContent = prefix + Math.round(v).toLocaleString('en-PK') + suffix) });
    return () => c.stop();
  }, [inView, to, suffix, prefix]);
  return <b ref={ref}>{prefix + to.toLocaleString('en-PK') + suffix}</b>;
}
