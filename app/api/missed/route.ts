import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET() {
  try {
    const missed = store.autoDetectMissedTasks();
    const recoveryPlans = [45, 46].map((dayNum) => store.generateRecoveryPlan(dayNum));
    return NextResponse.json({
      missed_tasks: missed,
      count: missed.length,
      recovery_plans: recoveryPlans,
    });
  } catch (error) {
    console.error('Error fetching missed tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch missed tasks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, day_number, plan } = body;

    if (action === 'generate_plan') {
      const recoveryPlan = store.generateRecoveryPlan(day_number || 45);
      return NextResponse.json({ plan: recoveryPlan });
    }

    if (action === 'apply_plan') {
      if (!plan) {
        return NextResponse.json({ error: 'Plan is required to apply' }, { status: 400 });
      }
      const result = store.applyRecoveryPlan(plan);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in missed recovery action:', error);
    return NextResponse.json({ error: 'Failed to process missed recovery' }, { status: 500 });
  }
}
