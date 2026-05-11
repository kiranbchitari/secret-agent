'use client';

import { useEffect, useRef } from 'react';

/**
 * Scrolls a container ref to the bottom whenever deps change.
 * Returns the ref to attach to the scroll container.
 */
export function useAutoScroll<T extends HTMLElement>(deps: unknown[]) {
  const containerRef = useRef<T | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isUserScrollingRef = useRef(false);

  // Detect user scrolling up
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 60;
      isUserScrollingRef.current = !isAtBottom;
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!isUserScrollingRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { containerRef, bottomRef };
}
