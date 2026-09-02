import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  try {
    const topics = store.getState().topics;
    const priorities = topics.map((t) => store.calculateTopicPriority(t.id));
    priorities.sort((a, b) => b.calculated_score - a.calculated_score);

    return NextResponse.json({
      priorities,
      formula: {
        description: 'Priority Score = Topic Importance (25%) + Dependency Impact (20%) + Difficulty (15%) + Missed Count (20%) + Weakness Score (10%) + Deadline Pressure (10%)',
        levels: {
          critical: '90–100',
          high: '75–89',
          medium: '50–74',
          low: '0–49',
        },
      },
    });
  } catch (error) {
    console.error('Error fetching priorities:', error);
    return NextResponse.json({ error: 'Failed to fetch priorities' }, { status: 500 });
  }
}
