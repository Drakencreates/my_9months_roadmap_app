import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  try {
    const projects = store.getState().projects;
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project_id, checklist_id } = body;

    if (!project_id || !checklist_id) {
      return NextResponse.json({ error: 'project_id and checklist_id required' }, { status: 400 });
    }

    const updatedProject = store.toggleProjectChecklist(project_id, checklist_id);
    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error toggling project checklist:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
