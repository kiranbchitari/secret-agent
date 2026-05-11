import { Suspense } from 'react';
import type { Metadata } from 'next';
import RoomPageClient from './RoomPageClient';

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { roomId } = await params;
  return {
    title: `Channel ${roomId} — Secret Agent`,
    description: 'Secure encrypted burner chat channel. Self-destructs automatically.',
    robots: 'noindex, nofollow',
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;

  return (
    <Suspense
      fallback={
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: '#020804' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-dim)',
              letterSpacing: '0.12em',
            }}
          >
            ESTABLISHING SECURE CHANNEL...
          </div>
        </div>
      }
    >
      <RoomPageClient roomId={roomId.toUpperCase()} />
    </Suspense>
  );
}
