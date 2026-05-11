'use client';

import { motion } from 'framer-motion';
import { Message } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { role, agentAlias, text, timestamp } = message;

  if (role === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center my-1 px-4"
      >
        <div
          className="bubble-system rounded-lg px-3 py-1.5 text-center max-w-xs"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-dim)',
            letterSpacing: '0.06em',
          }}
        >
          {text}
        </div>
      </motion.div>
    );
  }

  const isSelf = role === 'self';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex flex-col px-3 my-1 ${isSelf ? 'items-end' : 'items-start'}`}
    >
      {/* Agent alias */}
      <div
        className="mb-1 px-1"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: isSelf ? 'var(--green-dim)' : 'var(--text-dim)',
          letterSpacing: '0.1em',
          userSelect: 'none',
        }}
      >
        {isSelf ? '◈ YOU' : `▸ ${agentAlias}`}
      </div>

      {/* Bubble */}
      <div
        className={`
          relative max-w-[80%] px-4 py-2.5 rounded-2xl
          ${isSelf ? 'bubble-self' : 'bubble-other'}
        `}
        style={{ wordBreak: 'break-word' }}
      >
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {text}
        </p>

        {/* Timestamp */}
        <div
          className={`mt-1 text-right`}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-dim)',
            letterSpacing: '0.06em',
          }}
        >
          {formatTime(timestamp)}
        </div>
      </div>
    </motion.div>
  );
}
