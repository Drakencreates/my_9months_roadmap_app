import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  try {
    const dashboard = store.getDashboardData();
    return NextResponse.json(dashboard.today);
  } catch (error) {
    console.error('Error fetching today’s tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch today data' }, { status: 500 });
  }
}
