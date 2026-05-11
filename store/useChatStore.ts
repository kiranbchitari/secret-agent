import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Message, RoomState } from '@/lib/types';
import { generateAgentId, generateAgentAlias } from '@/lib/room-utils';
import { v4 as uuidv4 } from 'uuid';

// ── Store interface ─────────────────────────────────────────────────────────
interface ChatStore {
  // Agent (initialized client-side only to prevent SSR hydration mismatch)
  agentId: string;
  agentAlias: string;
  agentReady: boolean;
  initAgent: () => void;

  // Messages (in-memory only)
  messages: Message[];

  // Room state
  roomState: RoomState | null;

  // UI state
  isTyping: Record<string, { alias: string; at: number }>;
  isBurning: boolean;

  // Actions
  setRoomState: (state: RoomState) => void;
  updateRoomState: (partial: Partial<RoomState>) => void;
  clearRoomState: () => void;

  addMessage: (msg: Omit<Message, 'id'>) => void;
  addSystemMessage: (text: string) => void;
  clearMessages: () => void;

  setTyping: (agentId: string, alias: string, isTyping: boolean) => void;
  clearTyping: () => void;

  setBurning: (v: boolean) => void;
  burnRoom: () => void;
}

// ── Store ────────────────────────────────────────────────────────────────────
export const useChatStore = create<ChatStore>()(
  subscribeWithSelector((set, get) => ({
    // Start with empty strings — populated client-side in initAgent()
    agentId: '',
    agentAlias: '',
    agentReady: false,

    initAgent: () => {
      if (get().agentReady) return; // already initialized

      let agentId = sessionStorage.getItem('agentId');
      let agentAlias = sessionStorage.getItem('agentAlias');

      if (!agentId) {
        agentId = generateAgentId();
        sessionStorage.setItem('agentId', agentId);
      }
      if (!agentAlias) {
        agentAlias = generateAgentAlias();
        sessionStorage.setItem('agentAlias', agentAlias);
      }

      set({ agentId, agentAlias, agentReady: true });
    },

    messages: [],
    roomState: null,
    isTyping: {},
    isBurning: false,

    setRoomState: (state) => set({ roomState: state }),

    updateRoomState: (partial) =>
      set((s) => ({
        roomState: s.roomState ? { ...s.roomState, ...partial } : null,
      })),

    clearRoomState: () => set({ roomState: null }),

    addMessage: (msg) =>
      set((s) => ({
        messages: [
          ...s.messages,
          { ...msg, id: uuidv4() },
        ],
      })),

    addSystemMessage: (text) =>
      set((s) => ({
        messages: [
          ...s.messages,
          {
            id: uuidv4(),
            agentId: 'system',
            agentAlias: 'SYSTEM',
            text,
            timestamp: Date.now(),
            role: 'system' as const,
          },
        ],
      })),

    clearMessages: () => set({ messages: [] }),

    setTyping: (agentId, alias, isTyping) =>
      set((s) => {
        const next = { ...s.isTyping };
        if (isTyping) {
          next[agentId] = { alias, at: Date.now() };
        } else {
          delete next[agentId];
        }
        return { isTyping: next };
      }),

    clearTyping: () => set({ isTyping: {} }),

    setBurning: (v) => set({ isBurning: v }),

    burnRoom: () => {
      set({ isBurning: true, messages: [], isTyping: {} });
    },
  }))
);
