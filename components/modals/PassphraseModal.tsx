'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { hashPassphrase, normalizePassphrase } from '@/lib/room-utils';
import { GlowBorder } from '@/components/ui/GlowBorder';

interface PassphraseModalProps {
  onSuccess: (passphrase: string) => void;
  onBack: () => void;
  roomId: string;
}

export function PassphraseModal({ onSuccess, onBack, roomId }: PassphraseModalProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    // If they leave it blank, they are trying to join an open room
    // The Pusher channel connection itself acts as the security boundary
    onSuccess(input.trim());
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{
        background: 'var(--bg-void)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <GlowBorder strong className="p-6 flex flex-col gap-5">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: 'var(--bg-glass)',
                border: 'var(--border-strong)',
                boxShadow: 'var(--glow-sm)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="var(--green-primary)" strokeWidth="1.5" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="var(--green-primary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2
              className="mono-heading text-base mb-1"
              style={{ letterSpacing: '0.15em' }}
            >
              AUTHENTICATION REQUIRED
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-dim)',
                letterSpacing: '0.08em',
              }}
            >
              CHANNEL: {roomId}
            </p>
          </div>

          {/* Input */}
          <div className="flex flex-col gap-2">
            <div
              className="text-center"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-dim)',
                letterSpacing: '0.06em',
                marginBottom: 4,
              }}
            >
              (LEAVE BLANK IF OPEN CHANNEL)
            </div>
            <input
              id="passphrase-input"
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENTER PASSPHRASE"
              className="agent-input w-full px-4 py-3 rounded-lg text-center"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button
              id="passphrase-submit-btn"
              onClick={handleSubmit}
              className="agent-btn agent-btn-primary w-full py-3 rounded-lg"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
            >
              ◈ AUTHENTICATE
            </button>
            <button
              onClick={onBack}
              className="text-xs text-center"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ← ABORT MISSION
            </button>
          </div>
        </GlowBorder>
      </motion.div>
    </div>
  );
}
