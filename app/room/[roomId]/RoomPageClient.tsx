'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { PassphraseModal } from '@/components/modals/PassphraseModal';
import { useChatStore } from '@/store/useChatStore';

interface RoomPageClientProps {
  roomId: string;
}

export default function RoomPageClient({ roomId }: RoomPageClientProps) {
  const router = useRouter();

  // If passphrase is in store, it means they just created the room
  const storedPassphrase = useChatStore(s => s.roomState?.passphrase);
  const theme = useChatStore(s => s.theme);

  const [authenticated, setAuthenticated] = useState(storedPassphrase !== undefined);
  const [passphrase, setPassphrase] = useState(storedPassphrase || '');
  const [expired, setExpired] = useState(false);

  // Local 30 min expiration from join
  const [expiresAt] = useState(() => Date.now() + 30 * 60 * 1000);

  useEffect(() => {
    if (expiresAt < Date.now()) {
      setExpired(true);
    }
  }, [expiresAt]);

  if (expired) {
    return (
      <div className={theme === 'camo' ? 'theme-camo' : ''}>
        <div
          className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center"
          style={{ background: 'var(--bg-void)' }}
        >
          <div style={{ fontSize: 48 }}>💀</div>
          <h1
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              color: 'var(--danger)',
              letterSpacing: '0.12em',
            }}
          >
            CHANNEL EXPIRED
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-dim)',
              letterSpacing: '0.06em',
            }}
          >
            This secure channel has self-destructed.
          </p>
          <button
            onClick={() => router.push('/')}
            className="agent-btn agent-btn-primary px-6 py-2.5 rounded-lg"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
          >
            ← RETURN TO BASE
          </button>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className={theme === 'camo' ? 'theme-camo' : ''}>
        <PassphraseModal
          onSuccess={(p) => {
            setPassphrase(p);
            setAuthenticated(true);
          }}
          onBack={() => router.push('/')}
          roomId={roomId}
        />
      </div>
    );
  }

  return <ChatRoom roomId={roomId} expiresAt={expiresAt} passphrase={passphrase} />;
}
