'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface BurnModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isBurning: boolean;
}

export function BurnModal({ onConfirm, onCancel, isBurning }: BurnModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{
        background: isBurning
          ? 'rgba(80,0,0,0.9)'
          : 'rgba(2,8,4,0.92)',
        backdropFilter: 'blur(16px)',
        zIndex: 200,
        transition: 'background 0.5s ease',
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xs flex flex-col items-center gap-6 text-center"
      >
        {isBurning ? (
          <BurningAnimation />
        ) : (
          <ConfirmContent onConfirm={onConfirm} onCancel={onCancel} />
        )}
      </motion.div>
    </motion.div>
  );
}

function BurningAnimation() {
  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 0.9, 1.3, 0.8, 1.1, 1],
          rotate: [0, -5, 5, -3, 3, 0],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ fontSize: 64 }}
      >
        🔥
      </motion.div>
      <motion.h2
        className="glitch-text"
        data-text="DESTROYING CHANNEL"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.3, repeat: Infinity }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 18,
          fontWeight: 900,
          color: '#ff3333',
          letterSpacing: '0.12em',
          textShadow: '0 0 20px rgba(255,51,51,0.8)',
        }}
      >
        DESTROYING CHANNEL
      </motion.h2>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'rgba(255,100,100,0.7)',
          letterSpacing: '0.1em',
        }}
      >
        PURGING ALL DATA...
      </div>
    </motion.div>
  );
}

function ConfirmContent({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <>
      {/* Warning icon */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(255,51,51,0.1)',
          border: '1px solid rgba(255,51,51,0.4)',
          boxShadow: '0 0 20px rgba(255,51,51,0.3)',
          fontSize: 28,
        }}
      >
        🔥
      </div>

      <div className="flex flex-col gap-2">
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 16,
            fontWeight: 900,
            color: '#ff6666',
            letterSpacing: '0.1em',
          }}
        >
          BURN CHANNEL?
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
            lineHeight: 1.8,
            letterSpacing: '0.06em',
          }}
        >
          This will IMMEDIATELY destroy the channel,
          disconnect all operatives, and
          permanently erase all messages.
          This action CANNOT be undone.
        </p>
      </div>

      {/* Confirm checkbox */}
      <label
        className="flex items-start gap-2 cursor-pointer"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-mid)',
          letterSpacing: '0.06em',
        }}
      >
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          style={{ accentColor: '#ff3333', marginTop: 2 }}
        />
        I UNDERSTAND THIS IS IRREVERSIBLE
      </label>

      {/* Buttons */}
      <div className="flex flex-col gap-2 w-full">
        <button
          id="burn-confirm-btn"
          onClick={onConfirm}
          disabled={!confirmed}
          className="w-full py-3 rounded-lg"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.1em',
            background: confirmed ? 'rgba(255,51,51,0.15)' : 'rgba(255,51,51,0.05)',
            border: `1px solid ${confirmed ? 'rgba(255,51,51,0.5)' : 'rgba(255,51,51,0.2)'}`,
            color: confirmed ? '#ff3333' : 'rgba(255,51,51,0.4)',
            boxShadow: confirmed ? '0 0 20px rgba(255,51,51,0.3)' : 'none',
            cursor: confirmed ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
          }}
        >
          🔥 DESTROY CHANNEL
        </button>
        <button
          id="burn-cancel-btn"
          onClick={onCancel}
          className="w-full py-3 rounded-lg agent-btn"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
        >
          ← ABORT
        </button>
      </div>
    </>
  );
}
