import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  try {
    const weakTopics = store.detectWeakTopics();
    return NextResponse.json({
      weak_topics: weakTopics,
      total_count: weakTopics.length,
    });
  } catch (error) {
    console.error('Error fetching weak topics:', error);
    return NextResponse.json({ error: 'Failed to fetch weak topics' }, { status: 500 });
  }
}
