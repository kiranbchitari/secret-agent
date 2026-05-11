'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/useChatStore';
import { usePusherChannel } from '@/hooks/usePusherChannel';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ConnectionStatus } from './ConnectionStatus';
import { ExpirationTimer } from './ExpirationTimer';
import { BurnButton } from './BurnButton';
import { BurnModal } from '@/components/modals/BurnModal';

interface ChatRoomProps {
  roomId: string;
  expiresAt: number;
  passphrase?: string;
}

export function ChatRoom({ roomId, expiresAt, passphrase }: ChatRoomProps) {
  const router = useRouter();
  const [showBurnModal, setShowBurnModal] = useState(false);

  const {
    agentId,
    agentAlias,
    agentReady,
    initAgent,
    messages,
    roomState,
    isTyping,
    isBurning,
    setBurning,
    burnRoom,
    clearMessages,
    clearRoomState,
    setRoomState,
    theme,
    toggleTheme,
  } = useChatStore();

  // Initialize agent identity on client (prevents SSR hydration mismatch)
  useEffect(() => {
    initAgent();
  }, [initAgent]);

  // Set initial room state only after agent identity is ready
  useEffect(() => {
    if (!agentReady) return;
    setRoomState({
      roomId,
      agentId,
      agentAlias,
      passphrase: '',
      userCount: 0,
      expiresAt,
      isBurned: false,
      isConnected: false,
      connectionStatus: 'connecting',
    });
    return () => clearRoomState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, agentReady]);

  // Burn handler — calls server to trigger burn event for all users
  const handleBurn = useCallback(async () => {
    setBurning(true);
    try {
      await fetch('/api/pusher/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: `presence-room-${roomId}`,
          event: 'room:burn',
          data: { triggeredBy: agentId },
        }),
      });
    } catch {
      // Still proceed with local burn
    }
    executeBurn();
  }, [roomId, agentId, setBurning]);

  const executeBurn = useCallback(() => {
    burnRoom();
    setTimeout(() => {
      clearMessages();
      clearRoomState();
      router.push('/?burned=true');
    }, 2000);
  }, [burnRoom, clearMessages, clearRoomState, router]);

  // Listen for remote burn
  const handleRemoteBurn = useCallback(() => {
    if (isBurning) return;
    setBurning(true);
    setShowBurnModal(false);
    executeBurn();
  }, [isBurning, setBurning, executeBurn]);

  // Room expiry handler
  const handleExpired = useCallback(() => {
    executeBurn();
  }, [executeBurn]);

  const { sendMessage, sendTyping } = usePusherChannel({
    roomId,
    passphrase,
    agentId,
    agentAlias,
    onBurn: handleRemoteBurn,
  });

  // Copy room ID
  const handleCopyId = () => {
    navigator.clipboard.writeText(roomId).catch(() => {});
  };

  const typingOthers = Object.fromEntries(
    Object.entries(isTyping).filter(([id]) => id !== agentId)
  );

  return (
    <>
      {/* Burn overlay */}
      <AnimatePresence>
        {isBurning && (
          <BurnModal
            onConfirm={handleBurn}
            onCancel={() => {}}
            isBurning={true}
          />
        )}
      </AnimatePresence>

      {/* Burn confirm modal */}
      <AnimatePresence>
        {showBurnModal && !isBurning && (
          <BurnModal
            onConfirm={() => {
              setShowBurnModal(false);
              handleBurn();
            }}
            onCancel={() => setShowBurnModal(false)}
            isBurning={false}
          />
        )}
      </AnimatePresence>

      {/* Main layout — full height flex column */}
      <div
        className={`flex flex-col fixed inset-0 ${theme === 'camo' ? 'theme-camo' : ''}`}
        style={{ overflow: 'hidden', background: 'var(--bg-void)' }}
      >
        {/* Top bar */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-3 py-2"
          style={{
            paddingTop: 'max(8px, env(safe-area-inset-top))',
            borderBottom: 'var(--border-glass)',
            background: 'var(--bg-surface)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Left: back + room ID */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              id="back-btn"
              onClick={() => router.push('/')}
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: 'transparent',
                border: 'var(--border-glass)',
                color: 'var(--text-dim)',
                cursor: 'pointer',
              }}
              aria-label="Back to home"
            >
              ←
            </button>

            <button
              id="copy-room-id-btn"
              onClick={handleCopyId}
              className="flex flex-col min-w-0"
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              title="Copy room ID"
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-dim)',
                  letterSpacing: '0.08em',
                }}
              >
                CHANNEL
              </span>
              <span
                className="glow-text truncate"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                }}
              >
                {roomId}
              </span>
            </button>
          </div>

          {/* Right: status + timer + burn */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ConnectionStatus
              status={roomState?.connectionStatus ?? 'connecting'}
              userCount={roomState?.userCount ?? 0}
            />
            <div
              style={{
                width: 1,
                height: 16,
                background: 'rgba(0,255,65,0.1)',
              }}
            />
            <ExpirationTimer expiresAt={expiresAt} onExpired={handleExpired} />
            <button
              onClick={toggleTheme}
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--bg-glass-hover)]"
              style={{
                background: 'transparent',
                border: 'var(--border-glass)',
                color: 'var(--text-mid)',
                cursor: 'pointer',
              }}
              title="Toggle Theme"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <div
              style={{
                width: 1,
                height: 16,
                background: 'var(--bg-glass-hover)',
              }}
            />
            <BurnButton onClick={() => setShowBurnModal(true)} />
          </div>
        </div>

        {/* Agent identity badge */}
        <div
          className="flex-shrink-0 flex items-center justify-center py-1.5"
          style={{
            borderBottom: 'var(--border-glass)',
            background: 'var(--bg-glass)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-dim)',
              letterSpacing: '0.12em',
            }}
          >
            OPERATING AS ◈ <span style={{ color: 'var(--green-dim)' }}>{agentAlias}</span>
          </span>
        </div>

        {/* Messages */}
        <MessageList messages={messages} typingAgents={typingOthers} />

        {/* Input */}
        <div className="flex-shrink-0">
          <MessageInput
            onSend={sendMessage}
            onTypingChange={sendTyping}
            disabled={isBurning}
          />
        </div>
      </div>
    </>
  );
}
