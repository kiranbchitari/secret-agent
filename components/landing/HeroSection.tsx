'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalText } from '@/components/ui/TerminalText';

const STATUS_LINES = [
  'INITIALIZING SECURE PROTOCOL...',
  'ESTABLISHING ENCRYPTED TUNNEL...',
  'ROUTING THROUGH ANONYMOUS NODES...',
  'OBFUSCATING METADATA...',
  'CHANNEL READY.',
];

export function HeroSection() {
  const [lineIndex, setLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  const currentLine = STATUS_LINES[lineIndex];

  const handleLineComplete = () => {
    if (lineIndex < STATUS_LINES.length - 1) {
      setCompletedLines((p) => [...p, STATUS_LINES[lineIndex]]);
      setTimeout(() => setLineIndex((i) => i + 1), 200);
    } else {
      setReady(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Glowing logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative"
      >
        {/* Outer ring */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            border: '1px solid rgba(0,255,65,0.3)',
            boxShadow: '0 0 40px rgba(0,255,65,0.2), inset 0 0 20px rgba(0,255,65,0.05)',
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              border: '1px solid rgba(0,255,65,0.5)',
              background: 'radial-gradient(circle, rgba(0,255,65,0.1) 0%, transparent 70%)',
            }}
          >
            {/* Lock icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#00ff41" strokeWidth="1.5" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="#00ff41" style={{ filter: 'drop-shadow(0 0 4px #00ff41)' }} />
            </svg>
          </div>
        </div>

        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            border: '1px dashed rgba(0,255,65,0.2)',
          }}
        />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h1
          className="text-4xl md:text-5xl font-black tracking-widest glow-text-lg"
          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.2em' }}
        >
          SECRET AGENT
        </h1>
        <p
          className="mt-2 text-sm tracking-[0.3em] uppercase"
          style={{ color: 'var(--text-mid)', fontFamily: 'var(--font-mono)' }}
        >
          ◈ Secure Burner Communication Terminal ◈
        </p>
      </motion.div>

      {/* Terminal log */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm rounded-lg p-4 text-left"
        style={{
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(0,255,65,0.1)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          minHeight: '164px',
        }}
      >
        <div className="mb-2" style={{ color: 'var(--text-dim)' }}>
          {'>'} SYSTEM::INIT
        </div>
        {completedLines.map((line, i) => (
          <div key={i} className="mb-1" style={{ color: 'var(--text-dim)' }}>
            <span style={{ color: 'var(--green-dark)' }}>{'▸'}</span> {line}
          </div>
        ))}
        {!ready && (
          <div style={{ color: 'var(--green-primary)' }}>
            <span>{'▸'} </span>
            <TerminalText
              text={currentLine}
              speed={30}
              onComplete={handleLineComplete}
              showCursor={false}
            />
            <span className="terminal-cursor" />
          </div>
        )}
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: 'var(--green-primary)' }}
          >
            <span>{'▸'} </span>CHANNEL READY.
            <span className="terminal-cursor" />
          </motion.div>
        )}
      </motion.div>

      {/* Encryption status row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 flex-wrap justify-center"
      >
        {[
          { label: 'END-TO-END', icon: '🔒' },
          { label: 'NO LOGS', icon: '🚫' },
          { label: 'SELF-DESTRUCTS', icon: '💥' },
        ].map(({ label, icon }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{
              border: '1px solid rgba(0,255,65,0.15)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-mid)',
              letterSpacing: '0.08em',
            }}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
