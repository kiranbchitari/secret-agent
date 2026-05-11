'use client';

import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  alias: string;
}

export function TypingIndicator({ alias }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-2 px-3 my-1"
    >
      {/* Bubble */}
      <div className="flex flex-col items-start">
        <div
          className="mb-1 px-1"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-dim)',
            letterSpacing: '0.1em',
          }}
        >
          ▸ {alias}
        </div>
        <div
          className="bubble-other rounded-2xl px-4 py-3 flex items-center gap-1.5"
          style={{ borderBottomLeftRadius: 4 }}
        >
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </motion.div>
  );
}
