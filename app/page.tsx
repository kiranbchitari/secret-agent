'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { HeroSection } from '@/components/landing/HeroSection';
import { CreateRoomButton } from '@/components/landing/CreateRoomButton';
import { JoinRoomForm } from '@/components/landing/JoinRoomForm';
import { useChatStore } from '@/store/useChatStore';

function BurnedBanner() {
  const params = useSearchParams();
  const burned = params.get('burned');
  if (!burned) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full text-center py-3 px-4 rounded-lg mb-4"
      style={{
        background: 'rgba(255,51,51,0.08)',
        border: '1px solid rgba(255,51,51,0.25)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: '#ff6666',
        letterSpacing: '0.1em',
      }}
    >
      🔥 SECURE CHANNEL DESTROYED — ALL DATA PURGED
    </motion.div>
  );
}

export default function HomePage() {
  const initAgent = useChatStore((s) => s.initAgent);

  // Pre-initialize agent identity so it's ready when entering a room
  useEffect(() => {
    initAgent();
  }, [initAgent]);
  return (
    <main
      className="relative min-h-dvh flex flex-col items-center justify-center p-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,65,0.04) 0%, transparent 60%)',
      }}
    >
      {/* Animated particle background */}
      <ParticleBackground />

      {/* Corner decorations */}
      <div
        className="fixed top-4 left-4 w-8 h-8 opacity-30"
        style={{
          borderTop: '1px solid var(--green-primary)',
          borderLeft: '1px solid var(--green-primary)',
        }}
      />
      <div
        className="fixed top-4 right-4 w-8 h-8 opacity-30"
        style={{
          borderTop: '1px solid var(--green-primary)',
          borderRight: '1px solid var(--green-primary)',
        }}
      />
      <div
        className="fixed bottom-4 left-4 w-8 h-8 opacity-30"
        style={{
          borderBottom: '1px solid var(--green-primary)',
          borderLeft: '1px solid var(--green-primary)',
        }}
      />
      <div
        className="fixed bottom-4 right-4 w-8 h-8 opacity-30"
        style={{
          borderBottom: '1px solid var(--green-primary)',
          borderRight: '1px solid var(--green-primary)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col gap-8">
        {/* Burned notification */}
        <Suspense>
          <BurnedBanner />
        </Suspense>

        {/* Hero */}
        <HeroSection />

        {/* Actions panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-4 p-5 rounded-2xl"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(0,255,65,0.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <CreateRoomButton />
          <JoinRoomForm />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-dim)',
            letterSpacing: '0.1em',
            lineHeight: 1.8,
          }}
        >
          ◈ MESSAGES ARE NOT STORED OR LOGGED<br />
          ◈ CHANNELS AUTO-DESTROY AFTER 30 MINUTES<br />
          ◈ MAX 2 OPERATIVES PER CHANNEL
        </motion.div>
      </div>
    </main>
  );
}
