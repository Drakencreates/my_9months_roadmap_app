import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  try {
    const state = store.getState();
    return NextResponse.json({
      start_date: state.roadmap.start_date,
      end_date: state.roadmap.end_date,
      current_day_number: state.simulated_today_day_number,
      simulated_current_date: state.simulated_current_date,
      daily_hours: state.roadmap.daily_hours,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { start_date, jump_to_day, reset_to_day_one } = body;

    if (reset_to_day_one) {
      store.resetToDayOne(start_date);
    } else {
      if (start_date) {
        store.updateStartDate(start_date);
      }
      if (jump_to_day !== undefined) {
        store.setSimulatedDay(Number(jump_to_day));
      }
    }

    const state = store.getState();
    return NextResponse.json({
      success: true,
      start_date: state.roadmap.start_date,
      current_day_number: state.simulated_today_day_number,
      simulated_current_date: state.simulated_current_date,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
