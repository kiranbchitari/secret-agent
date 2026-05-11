'use client';

import { RoomState } from '@/lib/types';

interface ConnectionStatusProps {
  status: RoomState['connectionStatus'];
  userCount: number;
}

const STATUS_LABELS: Record<RoomState['connectionStatus'], string> = {
  connecting: 'CONNECTING',
  connected: 'SECURE',
  disconnected: 'OFFLINE',
  error: 'ERROR',
  full: 'CHANNEL FULL',
};

export function ConnectionStatus({ status, userCount }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`status-dot ${status}`} />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: status === 'connected' ? 'var(--green-dim)' : 'var(--text-dim)',
          letterSpacing: '0.08em',
        }}
      >
        {STATUS_LABELS[status]}
      </span>
      {status === 'connected' && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-dim)',
            letterSpacing: '0.06em',
          }}
        >
          · {userCount}/2
        </span>
      )}
    </div>
  );
}
