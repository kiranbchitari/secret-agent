'use client';

import { useEffect, useState } from 'react';

interface TerminalTextProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

export function TerminalText({
  text,
  speed = 40,
  className = '',
  onComplete,
  showCursor = true,
}: TerminalTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span
      className={`font-mono ${className}`}
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      {displayed}
      {showCursor && (
        <span
          className={done ? 'terminal-cursor' : ''}
          style={{
            opacity: done ? undefined : 1,
            color: 'var(--green-primary)',
            animation: !done ? 'none' : undefined,
          }}
        >
          {!done ? '█' : ''}
        </span>
      )}
    </span>
  );
}
