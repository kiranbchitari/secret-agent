export type MessageRole = 'self' | 'other' | 'system';

export interface Message {
  id: string;
  agentId: string;
  agentAlias: string; // e.g. "AGENT-7F3A"
  text: string;
  timestamp: number;
  role: MessageRole;
}

export interface TypingEvent {
  agentId: string;
  agentAlias: string;
  isTyping: boolean;
}

export interface RoomState {
  roomId: string;
  agentId: string;
  agentAlias: string;
  passphrase: string;
  userCount: number;
  expiresAt: number; // unix ms — 30 min from room creation
  isBurned: boolean;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error' | 'full';
}

export interface PusherMessagePayload {
  id: string;
  agentId: string;
  agentAlias: string;
  text: string;
  timestamp: number;
}

export interface PusherTypingPayload {
  agentId: string;
  agentAlias: string;
  isTyping: boolean;
}

export interface PusherBurnPayload {
  triggeredBy: string;
}

export interface PusherMember {
  id: string;
  info: {
    agentAlias: string;
  };
}
