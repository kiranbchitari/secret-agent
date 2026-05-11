'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { generateRoomId, buildRoomUrl } from '@/lib/room-utils';
import { useChatStore } from '@/store/useChatStore';

export function CreateRoomButton() {
  const router = useRouter();
  const [showPassphraseInput, setShowPassphraseInput] = useState(false);
  const [customRoomId, setCustomRoomId] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createdUrl, setCreatedUrl] = useState('');

  const updateRoomState = useChatStore(s => s.updateRoomState);

  const handleCreate = async () => {
    if (isCreating) return;
    setIsCreating(true);

    await new Promise((r) => setTimeout(r, 600)); // dramatic pause

    const roomId = customRoomId.trim() ? customRoomId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') : generateRoomId();
    const url = buildRoomUrl(roomId);

    // Store the creator's passphrase so they don't get prompted when entering
    updateRoomState({ passphrase: passphrase.trim() });

    setCreatedUrl(url);
    setIsCreating(false);
  };

  const handleCopyAndEnter = async () => {
    await navigator.clipboard.writeText(createdUrl).catch(() => { });
    setCopied(true);
    setTimeout(() => {
      router.push(new URL(createdUrl).pathname);
    }, 500);
  };

  if (createdUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col gap-3"
      >
        <div
          className="rounded-lg p-3 text-xs break-all"
          style={{
            background: 'rgba(0,255,65,0.05)',
            border: '1px solid rgba(0,255,65,0.2)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-mid)',
          }}
        >
          <div style={{ color: 'var(--text-dim)', marginBottom: 4, fontSize: 10, letterSpacing: '0.1em' }}>
            ◈ SECURE CHANNEL LINK
          </div>
          {createdUrl}
        </div>

        <button
          id="copy-enter-btn"
          onClick={handleCopyAndEnter}
          className="agent-btn agent-btn-primary w-full py-3 rounded-lg"
        >
          {copied ? '✓ COPIED — ENTERING CHANNEL...' : '⊕ COPY LINK & ENTER CHANNEL'}
        </button>
      </motion.div>
    );
  }

  if (showPassphraseInput) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-3"
      >
        <div
          className="text-xs uppercase tracking-widest text-center"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
        >
          Optional — Leave blank for open channel
        </div>
        <div className="flex flex-col gap-2">
          <input
            id="create-roomid-input"
            type="text"
            value={customRoomId}
            onChange={(e) => setCustomRoomId(e.target.value)}
            placeholder="CUSTOM CHANNEL ID (OPTIONAL)"
            className="agent-input w-full px-4 py-3 rounded-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          <input
            id="create-passphrase-input"
            type="text"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="ENTER PASSPHRASE (OPTIONAL)"
            className="agent-input w-full px-4 py-3 rounded-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          id="confirm-create-btn"
          onClick={handleCreate}
          disabled={isCreating}
          className="agent-btn agent-btn-primary w-full py-3 rounded-lg"
        >
          {isCreating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
              GENERATING SECURE CHANNEL...
            </span>
          ) : (
            '◈ ESTABLISH SECURE CHANNEL'
          )}
        </button>
        <button
          onClick={() => setShowPassphraseInput(false)}
          className="text-xs"
          style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← BACK
        </button>
      </motion.div>
    );
  }

  return (
    <motion.button
      id="create-room-btn"
      whileTap={{ scale: 0.97 }}
      onClick={() => setShowPassphraseInput(true)}
      className="agent-btn agent-btn-primary w-full py-4 rounded-xl text-sm"
      style={{ fontSize: 13, letterSpacing: '0.12em' }}
    >
      ◈ CREATE SECURE CHANNEL
    </motion.button>
  );
}
