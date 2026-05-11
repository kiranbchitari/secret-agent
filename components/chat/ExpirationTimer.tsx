'use client';

import { useEffect, useState } from 'react';
import { formatTimeRemaining } from '@/lib/room-utils';

interface ExpirationTimerProps {
  expiresAt: number;
  onExpired?: () => void;
}

export function ExpirationTimer({ expiresAt, onExpired }: ExpirationTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => formatTimeRemaining(expiresAt));
  const [isWarning, setIsWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft('00:00');
        setIsExpired(true);
        onExpired?.();
        return;
      }
      setTimeLeft(formatTimeRemaining(expiresAt));
      setIsWarning(remaining < 5 * 60 * 1000); // warn at 5 min
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  return (
    <div className="flex items-center gap-1.5">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={isWarning ? '#ff6666' : 'var(--green-dark)'} strokeWidth="2" />
        <path
          d="M12 6v6l4 2"
          stroke={isWarning ? '#ff6666' : 'var(--green-dim)'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: isWarning
            ? isExpired ? 'var(--danger)' : '#ff9966'
            : 'var(--text-dim)',
          letterSpacing: '0.05em',
          animation: isWarning && !isExpired ? 'blink 1s step-end infinite' : 'none',
        }}
      >
        {isExpired ? 'EXPIRED' : timeLeft}
      </span>
    </div>
  );
}
