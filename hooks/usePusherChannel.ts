'use client';

import { useEffect, useRef, useCallback } from 'react';
import { PresenceChannel } from 'pusher-js';
import { getPusherClient } from '@/lib/pusher-client';
import { getRoomChannel } from '@/lib/room-utils';
import { useChatStore } from '@/store/useChatStore';
import {
  PusherMessagePayload,
  PusherTypingPayload,
  PusherBurnPayload,
} from '@/lib/types';

interface UsePusherChannelOptions {
  roomId: string;
  passphrase?: string;
  agentId: string;
  agentAlias: string;
  onBurn?: () => void;
  onMemberAdded?: (count: number) => void;
  onMemberRemoved?: (count: number) => void;
}

export function usePusherChannel({
  roomId,
  passphrase,
  agentId,
  agentAlias,
  onBurn,
  onMemberAdded,
  onMemberRemoved,
}: UsePusherChannelOptions) {
  const channelRef = useRef<PresenceChannel | null>(null);
  const isConnectedRef = useRef(false);

  // Use store actions directly (stable references from Zustand)
  const addMessage = useChatStore((s) => s.addMessage);
  const addSystemMessage = useChatStore((s) => s.addSystemMessage);
  const setTyping = useChatStore((s) => s.setTyping);
  const updateRoomState = useChatStore((s) => s.updateRoomState);
  const setBurning = useChatStore((s) => s.setBurning);

  const sendMessage = useCallback((text: string) => {
    const payload: PusherMessagePayload = {
      id: crypto.randomUUID(),
      agentId,
      agentAlias,
      text,
      timestamp: Date.now(),
    };

    // Always add own message to local state immediately
    addMessage({
      agentId,
      agentAlias,
      text,
      timestamp: payload.timestamp,
      role: 'self',
    });

    // Send to other users if connected
    if (channelRef.current && isConnectedRef.current) {
      try {
        channelRef.current.trigger('client-message', payload);
      } catch (e) {
        console.warn('Failed to trigger Pusher event:', e);
      }
    }
  }, [agentId, agentAlias, addMessage]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!channelRef.current || !isConnectedRef.current) return;
    const payload: PusherTypingPayload = { agentId, agentAlias, isTyping };
    try {
      channelRef.current.trigger('client-typing', payload);
    } catch { /* noop */ }
  }, [agentId, agentAlias]);

  useEffect(() => {
    // Don't subscribe until agent identity is established
    if (!agentId) return;

    const pusher = getPusherClient(agentId, agentAlias);
    const channelName = getRoomChannel(roomId, passphrase);

    updateRoomState({ connectionStatus: 'connecting' });

    const channel = pusher.subscribe(channelName) as PresenceChannel;
    channelRef.current = channel;

    channel.bind('pusher:subscription_succeeded', (members: { count: number }) => {
      isConnectedRef.current = true;
      updateRoomState({ connectionStatus: 'connected', isConnected: true, userCount: members.count });
      addSystemMessage('▶ SECURE CHANNEL ESTABLISHED. ENCRYPTION ACTIVE.');
    });

    channel.bind('pusher:subscription_error', (err: unknown) => {
      console.error('Pusher subscription error:', err);
      isConnectedRef.current = false;
      updateRoomState({ connectionStatus: 'error', isConnected: false });
    });

    channel.bind('pusher:member_added', () => {
      const count = (channel.members as { count: number }).count;
      updateRoomState({ userCount: count });
      addSystemMessage(`▶ AGENT JOINED. ${count}/2 OPERATIVES CONNECTED.`);
      onMemberAdded?.(count);
    });

    channel.bind('pusher:member_removed', () => {
      const count = (channel.members as { count: number }).count;
      updateRoomState({ userCount: count });
      addSystemMessage(`▶ AGENT DISCONNECTED. ${count}/2 OPERATIVES CONNECTED.`);
      onMemberRemoved?.(count);
    });

    // Incoming message from other user
    channel.bind('client-message', (data: PusherMessagePayload) => {
      if (data.agentId === agentId) return; // already added locally
      addMessage({
        agentId: data.agentId,
        agentAlias: data.agentAlias,
        text: data.text,
        timestamp: data.timestamp,
        role: 'other',
      });
    });

    // Typing indicator
    channel.bind('client-typing', (data: PusherTypingPayload) => {
      if (data.agentId === agentId) return;
      setTyping(data.agentId, data.agentAlias, data.isTyping);
    });

    // Burn event (server-triggered)
    channel.bind('room:burn', (_data: PusherBurnPayload) => {
      setBurning(true);
      onBurn?.();
    });

    return () => {
      isConnectedRef.current = false;
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      channelRef.current = null;
      updateRoomState({ connectionStatus: 'disconnected', isConnected: false });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, agentId, passphrase]);

  return { sendMessage, sendTyping };
}
