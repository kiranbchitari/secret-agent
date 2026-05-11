'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function JoinRoomForm() {
  const router = useRouter();
  const [roomInput, setRoomInput] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    const raw = roomInput.trim().toLowerCase();
    if (!raw) {
      setError('ENTER A CHANNEL ID OR FULL URL');
      return;
    }

    let roomId = raw;

    // If it's a full URL, extract path
    try {
      const url = new URL(raw.startsWith('http') ? raw : `https://placeholder.com${raw}`);
      const parts = url.pathname.split('/room/');
      if (parts[1]) {
        roomId = parts[1].split('/')[0].toLowerCase();
      }
    } catch {
      // Not a URL — treat as raw room ID
    }

    // Allow alphanumeric and hyphens
    roomId = roomId.replace(/[^a-z0-9-]/g, '');

    if (!roomId) {
      setError('INVALID CHANNEL ID');
      return;
    }

    router.push(`/room/${roomId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full flex flex-col gap-2"
    >
      <div
        className="text-xs uppercase tracking-widest text-center"
        style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
      >
        ─── OR JOIN EXISTING CHANNEL ───
      </div>

      <div className="flex gap-2">
        <input
          id="join-room-input"
          type="text"
          value={roomInput}
          onChange={(e) => {
            setRoomInput(e.target.value);
            setError('');
          }}
          placeholder="CHANNEL ID OR LINK"
          className="agent-input flex-1 px-4 py-3 rounded-lg"
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          autoComplete="off"
          spellCheck={false}
        />
        <motion.button
          id="join-room-btn"
          whileTap={{ scale: 0.95 }}
          onClick={handleJoin}
          className="agent-btn px-4 py-3 rounded-lg"
          style={{ minWidth: 64 }}
        >
          JOIN
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-center"
          style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}
        >
          ⚠ {error}
        </motion.div>
      )}
    </motion.div>
  );
}
