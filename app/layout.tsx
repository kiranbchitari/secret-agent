import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#020804',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: 'Secret Agent — Secure Burner Chat',
  description:
    'Anonymous, self-destructing, real-time encrypted chat channels. No logs. No accounts. No traces.',
  keywords: ['anonymous chat', 'burner chat', 'encrypted messaging', 'ephemeral chat', 'private chat'],
  robots: 'noindex, nofollow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        {/* JetBrains Mono for terminal aesthetic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#020804" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ background: '#020804', minHeight: '100dvh' }}>
        {/* Scanline overlay for terminal effect */}
        <div className="scanlines" aria-hidden />
        {children}
      </body>
    </html>
  );
}
