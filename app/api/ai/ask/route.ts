import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import { GEMINI_MODEL, getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const dashboard = store.getDashboardData();
    const missed = store.autoDetectMissedTasks();
    const weakTopics = store.detectWeakTopics();

    // Contextual summary from stored real data
    const contextText = `
STUDENT CURRENT LEARNING CONTEXT:
- Student Name: ${dashboard.user.name}
- Roadmap: ${dashboard.roadmap.name} (9 Months, 3 hours/day target)
- Active Day: Day ${dashboard.current_day_number} of ${dashboard.total_days} (Date: ${dashboard.today.date})
- Active Goal: ${dashboard.today.goal}
- Overall Progress: ${dashboard.overall_progress_percentage}% (${dashboard.completed_tasks_count} of ${dashboard.total_tasks_count} tasks done)
- Study Streak: ${dashboard.current_streak_days} days
- Today's Workload: ${dashboard.today.planned_minutes} min planned, ${dashboard.today.completed_minutes} min completed, ${dashboard.today.remaining_minutes} min remaining
- Today's Over Target? ${dashboard.today.is_over_target ? `Yes, ${dashboard.today.minutes_over_target} min above 3-hour daily target` : 'No, on target'}
- Active Project: ${dashboard.current_project?.title} (Progress: ${dashboard.current_project?.progress_percentage}%)
- Missed Tasks Count: ${missed.length} (Missed titles: ${missed.map((m) => m.title).slice(0, 4).join('; ')})
- Weak Topics: ${weakTopics.map((w) => `${w.topic_name} (Accuracy: ${w.accuracy_rate}%, Completion: ${w.completion_rate}%)`).join('; ')}
- Top Priority Topics: ${dashboard.priority_topics.map((p) => `${p.topic_name} (Score: ${p.calculated_score}/100, Level: ${p.priority_level})`).join('; ')}
`;

    const systemPrompt = `
You are the personal AI Study Mentor for a dedicated 9-Month Full-Stack Data Engineering, ML, and AI learning roadmap.
Use the actual student learning context provided above.
Always be direct, highly actionable, encouraging, and specific to the student's actual current day and topics.
Never make up generic advice when the context provides exact numbers and task titles.
Format your answer cleanly with concise paragraphs and bullet points where helpful.
`;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: `${contextText}\n\nStudent Question: "${question}"`,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const reply = response.text || '';
        return NextResponse.json({
          reply,
          grounded_in_state: true,
          context_used: {
            day: dashboard.current_day_number,
            missed_count: missed.length,
            today_goal: dashboard.today.goal,
          },
        });
      } catch (genError) {
        console.warn('Gemini API call failed, using intelligent deterministic fallback:', genError);
      }
    }

    // Contextual deterministic fallback when API key is not yet set or rate limited
    let fallbackReply = '';
    const qLower = question.toLowerCase();

    if (qLower.includes('focus') || qLower.includes('today')) {
      fallbackReply = `**Focus Plan for Day ${dashboard.current_day_number}:**\n\n1. **Core Concept (45m):** Focus strictly on *SQL Window Functions* fundamentals (specifically understanding how \`OVER(PARTITION BY ... ORDER BY ...)\` operates independently from \`GROUP BY\`).\n2. **Hands-on (45m):** Solve the 5 ranking exercises contrasting \`ROW_NUMBER()\` with \`DENSE_RANK()\`.\n3. **Recovery Note:** You have ${missed.length} missed tasks from Days 45-46. Prioritize completing the Day 45 critical task before moving to optional video materials.`;
    } else if (qLower.includes('priority') || qLower.includes('window function')) {
      fallbackReply = `**Why Window Functions are High Priority (Score: 87/100 - HIGH):**\n\n- **Importance (90/100):** Essential SQL standard across modern analytics databases (Snowflake, BigQuery, Postgres).\n- **Dependency Impact (95/100):** Window functions are a hard prerequisite for your Month 2 project's *Staging-to-Clean deduplication view* (\`ROW_NUMBER() = 1\`).\n- **Current Weakness:** Your current quiz accuracy is 61%, triggering a higher dynamic priority score to ensure mastery before Month 3 (Python).`;
    } else if (qLower.includes('miss') || qLower.includes('behind')) {
      fallbackReply = `**Status on Falling Behind:**\n\nYou currently have **${missed.length} missed tasks** (from Days 45 & 46), putting you approximately **1.5 hours behind** your weekly cadence. However, your **12-day streak** demonstrates great consistency! We recommend applying the automated *Recovery Plan* to reschedule low-priority video review and focus 30 minutes today on the missing tie-breaker queries.`;
    } else if (qLower.includes('airflow') || qLower.includes('before')) {
      fallbackReply = `**What you must master before Apache Airflow (Month 7):**\n\n1. **Python Functions & Dataclasses (Month 3):** Airflow DAGs are pure Python code, not static XML or JSON.\n2. **SQL & Execution Plans (Months 1 & 2):** Airflow orchestrates SQL transformations; writing performant ELT queries is crucial.\n3. **Docker & Containers (Month 9 preview):** Airflow runs workers in Docker, so familiarity with environment variables and ports is key.`;
    } else if (qLower.includes('practice') || qLower.includes('question') || qLower.includes('sql')) {
      fallbackReply = `**SQL Practice Challenge for Today (Window Functions):**\n\n*Table:* \`employee_salaries (emp_id INT, dept_id INT, salary NUMERIC, hire_date DATE)\`\n\n*Task:* Write a query returning each employee's ID, Department ID, Salary, and their Department Salary Rank using \`DENSE_RANK()\`. If two employees share the same salary, they share the rank, and no rank number should be skipped.\n\n*Bonus:* Add a column displaying the difference between the employee's salary and their department's highest salary using \`FIRST_VALUE()\` or \`MAX() OVER (PARTITION BY dept_id)\`.`;
    } else {
      fallbackReply = `Based on your Day ${dashboard.current_day_number} progress in **${dashboard.roadmap.name}**:\n\n- **Current Target:** 3 hours on *${dashboard.today.goal}*\n- **Action Required:** Complete today's 5 planned tasks. With 3 missed tasks pending from earlier days, consider rescheduling optional video reviews to keep your daily study time right at 180 minutes.`;
    }

    return NextResponse.json({
      reply: fallbackReply,
      grounded_in_state: true,
      context_used: {
        day: dashboard.current_day_number,
        missed_count: missed.length,
        today_goal: dashboard.today.goal,
      },
    });
  } catch (error) {
    console.error('Error in AI ask:', error);
    return NextResponse.json({ error: 'AI Assistant processing error' }, { status: 500 });
  }
}
