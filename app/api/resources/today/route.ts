import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  try {
    const state = store.getState();
    const todayTopicId = 'top_window_functions';
    const todayResources = state.resources.filter((r) => r.topic_id === todayTopicId);

    const enriched = todayResources.map((res) => {
      const progress = state.resource_progress.find((p) => p.resource_id === res.id);
      return {
        ...res,
        progress: progress || {
          status: 'UNWATCHED',
          watched_percentage: 0,
          rating: 0,
        },
      };
    });

    return NextResponse.json({
      topic_id: todayTopicId,
      topic_name: 'SQL Window Functions',
      resources: enriched,
    });
  } catch (error) {
    console.error('Error fetching today resources:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}
