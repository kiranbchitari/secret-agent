'use client';

import { motion } from 'framer-motion';

interface BurnButtonProps {
  onClick: () => void;
}

export function BurnButton({ onClick }: BurnButtonProps) {
  return (
    <motion.button
      id="burn-btn"
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg agent-btn-danger"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.1em',
        border: '1px solid rgba(255,51,51,0.3)',
        background: 'rgba(255,51,51,0.05)',
        color: '#ff6666',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      aria-label="Burn and destroy this chat room"
    >
      <span role="img" aria-hidden style={{ fontSize: 12 }}>🔥</span>
      <span>BURN</span>
    </motion.button>
  );
}
