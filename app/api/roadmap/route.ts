import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  try {
    const state = store.getState();
    return NextResponse.json({
      roadmap: state.roadmap,
      months: state.months,
      weeks: state.weeks,
      days: state.days,
      projects: state.projects,
      current_day_number: state.simulated_today_day_number,
      current_date: state.simulated_current_date,
    });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmap' }, { status: 500 });
  }
}
