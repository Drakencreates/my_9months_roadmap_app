import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let targetDayNumber: number | undefined;
    let targetDate: string | undefined;

    try {
      const body = await req.json();
      if (body.target_day_number) targetDayNumber = body.target_day_number;
      if (body.target_date) targetDate = body.target_date;
    } catch {
      // Body optional
    }

    const task = store.rescheduleTask(id, targetDayNumber, targetDate);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Error rescheduling task:', error);
    return NextResponse.json({ error: 'Failed to reschedule task' }, { status: 500 });
  }
}
