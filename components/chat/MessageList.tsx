'use client';

import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Message } from '@/lib/types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface MessageListProps {
  messages: Message[];
  typingAgents: Record<string, { alias: string; at: number }>;
}

export function MessageList({ messages, typingAgents }: MessageListProps) {
  const { containerRef, bottomRef } = useAutoScroll<HTMLDivElement>([messages.length, typingAgents]);
  const typingEntries = Object.entries(typingAgents);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto py-3"
      style={{ overscrollBehavior: 'contain' }}
    >
      {messages.length === 0 && (
        <div
          className="flex flex-col items-center justify-center h-full gap-3 px-8"
          style={{ minHeight: 200 }}
        >
          <div
            style={{
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              textAlign: 'center',
              lineHeight: 1.8,
              letterSpacing: '0.08em',
            }}
          >
            ◈ CHANNEL ACTIVE<br />
            ▸ MESSAGES NOT STORED<br />
            ▸ END-TO-END ENCRYPTED<br />
            ▸ AUTO-DESTROY IN 30 MIN
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </AnimatePresence>

      {/* Typing indicators */}
      <AnimatePresence>
        {typingEntries.map(([agentId, { alias }]) => (
          <TypingIndicator key={agentId} alias={alias} />
        ))}
      </AnimatePresence>

      {/* Scroll anchor */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
