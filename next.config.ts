import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure Pusher server is not bundled client-side
  serverExternalPackages: ['pusher'],
};

export default nextConfig;
