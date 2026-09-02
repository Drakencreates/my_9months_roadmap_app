import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const day = searchParams.get('day');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const tech = searchParams.get('technology');
    const query = searchParams.get('q')?.toLowerCase();

    let tasks = store.getState().tasks;

    if (day) {
      const dayNum = parseInt(day, 10);
      tasks = tasks.filter((t) => t.day_number === dayNum);
    }
    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    if (priority) {
      tasks = tasks.filter((t) => t.priority_level === priority);
    }
    if (tech) {
      tasks = tasks.filter((t) => t.topic_name?.toLowerCase().includes(tech.toLowerCase()));
    }
    if (query) {
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.topic_name?.toLowerCase().includes(query)
      );
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = store.addTaskToRoadmap({
      title: body.title,
      description: body.description || '',
      task_type: body.task_type || 'LEARN',
      estimated_minutes: body.estimated_minutes || 45,
      priority_level: body.priority_level || 'HIGH',
      topic_name: body.topic_name || 'General',
      day_number: body.day_number,
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
