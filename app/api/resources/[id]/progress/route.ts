import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const status = body.status || 'COMPLETED';
    const rating = body.rating;
    const notes = body.notes;

    const progress = store.updateResourceProgress(id, status, rating, notes);
    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating resource progress:', error);
    return NextResponse.json({ error: 'Failed to update resource progress' }, { status: 500 });
  }
}
