import { v4 as uuidv4 } from 'uuid';

const AGENT_PREFIXES = [
  'SHADOW', 'GHOST', 'PHANTOM', 'CIPHER', 'VECTOR',
  'FALCON', 'VIPER', 'COBRA', 'RAVEN', 'SPECTRE',
  'NEXUS', 'NOVA', 'OMEGA', 'DELTA', 'SIGMA',
  'APEX', 'BLADE', 'STORM', 'FROST', 'WRAITH',
];

const ADJECTIVES = ['neon', 'cyber', 'stealth', 'phantom', 'rogue', 'shadow', 'covert', 'alpha', 'bravo', 'delta', 'echo', 'ghost', 'zero', 'dark'];
const NOUNS = ['strike', 'protocol', 'matrix', 'nexus', 'viper', 'eagle', 'falcon', 'wolf', 'raven', 'cipher', 'proxy', 'operative'];

/**
 * Generates a memorable room ID like "neon-ghost"
 */
export function generateRoomId(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj}-${noun}`;
}

/**
 * Generates a random agent alias like "SHADOW-7F3A"
 */
export function generateAgentAlias(): string {
  const prefix = AGENT_PREFIXES[Math.floor(Math.random() * AGENT_PREFIXES.length)];
  const suffix = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

/**
 * Generates a unique agent ID (full UUID)
 */
export function generateAgentId(): string {
  return uuidv4();
}

/**
 * Gets the Pusher channel name for a room.
 * By including the hashed passphrase in the channel name, we achieve "security by isolation".
 * Incorrect passphrases simply join an empty parallel dimension.
 */
export function getRoomChannel(roomId: string, passphrase?: string): string {
  const hash = passphrase ? hashPassphrase(passphrase) : 'open';
  return `presence-room-${roomId}-${hash}`;
}

/**
 * Computes room expiration time (30 minutes from now)
 */
export function computeExpiration(): number {
  return Date.now() + 30 * 60 * 1000;
}

/**
 * Formats remaining time as MM:SS
 */
export function formatTimeRemaining(expiresAt: number): string {
  const remaining = Math.max(0, expiresAt - Date.now());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Simple hash for passphrase comparison (not cryptographic — purely UX)
 */
export function hashPassphrase(passphrase: string): string {
  let hash = 0;
  const normalized = passphrase.trim().toUpperCase();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Builds the shareable room URL (now completely clean)
 */
export function buildRoomUrl(roomId: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/room/${roomId}`;
}

/**
 * Normalizes passphrase for comparison
 */
export function normalizePassphrase(p: string): string {
  return p.trim().toUpperCase();
}
