import { NextRequest, NextResponse } from 'next/server';
import { getPusherServer } from '@/lib/pusher-server';

export async function POST(req: NextRequest) {
  try {
    const { channel, event, data } = await req.json();

    if (!channel || !event) {
      return NextResponse.json({ error: 'Missing channel or event' }, { status: 400 });
    }

    // Only allow burn events through this endpoint
    if (event !== 'room:burn') {
      return NextResponse.json({ error: 'Unauthorized event' }, { status: 403 });
    }

    // Validate channel format
    if (!/^presence-room-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(channel)) {
      return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
    }

    const pusher = getPusherServer();
    await pusher.trigger(channel, event, data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Pusher trigger error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
