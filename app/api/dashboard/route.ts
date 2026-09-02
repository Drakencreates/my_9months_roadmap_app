import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  try {
    const data = store.getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
