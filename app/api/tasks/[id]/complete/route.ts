import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let actualMinutes = 45;
    let notes = '';

    try {
      const body = await req.json();
      if (body.actual_minutes) actualMinutes = body.actual_minutes;
      if (body.notes) notes = body.notes;
    } catch {
      // Body is optional
    }

    const task = store.completeTask(id, actualMinutes, notes);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json({ error: 'Failed to complete task' }, { status: 500 });
  }
}
