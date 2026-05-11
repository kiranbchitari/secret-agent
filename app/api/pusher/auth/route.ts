import { NextRequest, NextResponse } from 'next/server';
import { getPusherServer } from '@/lib/pusher-server';

/**
 * Pusher presence channel authentication endpoint.
 * Required for presence channels (which give us member count tracking).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');

    if (!socketId || !channelName) {
      return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 });
    }

    // Validate it's a presence channel for our rooms
    if (!channelName.startsWith('presence-room-')) {
      return NextResponse.json({ error: 'Invalid channel' }, { status: 403 });
    }

    // Extract agent info from request headers (set by client)
    const agentId = req.headers.get('x-agent-id') || `agent-${socketId.slice(0, 8)}`;
    const agentAlias = req.headers.get('x-agent-alias') || 'UNKNOWN-AGENT';

    const userData = {
      user_id: agentId,
      user_info: {
        agentAlias,
      },
    };

    const pusher = getPusherServer();
    const authResponse = pusher.authorizeChannel(socketId, channelName, userData);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
