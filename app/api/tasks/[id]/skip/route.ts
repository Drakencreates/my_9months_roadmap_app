import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let reason = 'User marked skipped';

    try {
      const body = await req.json();
      if (body.reason) reason = body.reason;
    } catch {
      // Body optional
    }

    const task = store.skipTask(id, reason);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Error skipping task:', error);
    return NextResponse.json({ error: 'Failed to skip task' }, { status: 500 });
  }
}
