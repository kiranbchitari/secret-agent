import Pusher from 'pusher-js';

let pusherInstance: Pusher | null = null;

export function getPusherClient(agentId?: string, agentAlias?: string): Pusher {
  if (typeof window === 'undefined') {
    throw new Error('Pusher client cannot be used on the server side');
  }

  if (!pusherInstance) {
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
      channelAuthorization: {
        endpoint: '/api/pusher/auth',
        transport: 'ajax',
        headers: {
          'x-agent-id': agentId || '',
          'x-agent-alias': agentAlias || '',
        },
      },
    });
  }

  return pusherInstance;
}

export function disconnectPusher(): void {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}
