'use client';

import { ReactNode } from 'react';

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  danger?: boolean;
  strong?: boolean;
  style?: React.CSSProperties;
}

export function GlowBorder({
  children,
  className = '',
  danger = false,
  strong = false,
  style,
}: GlowBorderProps) {
  const borderClass = danger
    ? 'danger-border'
    : strong
    ? 'neon-border'
    : 'glass-panel';

  return (
    <div
      className={`${borderClass} rounded-xl ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
