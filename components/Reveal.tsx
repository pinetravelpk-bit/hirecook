'use client';
import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

// Scroll-reveal animation. Content is fully visible without JS (SEO / no-JS safe); the
// hidden start state only applies once <html class="js"> is set.
export default function Reveal({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.dataset.in = '1';
      return;
    }
    const io = new IntersectionObserver(
      (ents) => {
        if (ents.some((e) => e.isIntersecting)) {
          el.dataset.in = '1';
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-reveal="" className={className} style={{ ...style, transitionDelay: delay ? `${delay}s` : undefined }}>
      {children}
    </div>
  );
}
