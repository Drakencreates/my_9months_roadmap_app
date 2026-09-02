import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import { GEMINI_MODEL, getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    let topicName = 'SQL Window Functions';
    try {
      const body = await req.json();
      if (body.topic_name) topicName = body.topic_name;
    } catch {
      // Body optional
    }

    const weakTopics = store.detectWeakTopics();
    const weakTopic = weakTopics.find((w) => w.topic_name.toLowerCase().includes(topicName.toLowerCase())) || weakTopics[0];

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `
The student is struggling with the topic: "${weakTopic?.topic_name || topicName}".
Accuracy: ${weakTopic?.accuracy_rate || 61}%, Completion: ${weakTopic?.completion_rate || 45}%.
Generate a specific, concise remedial study recommendation.
Return JSON with keys:
- "title": string (e.g. "Window Functions Revision & Frame Clauses — 30m")
- "description": string (e.g. "Focus on tie-breaking with DENSE_RANK and window frames")
- "duration_minutes": number (e.g. 30 or 45)
- "reason": string (e.g. "3 incomplete tasks + low quiz accuracy (61%)")
- "task_type": string ("PRACTICE" or "REVIEW")
`;
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.5,
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.title) {
          return NextResponse.json({
            recommendation: {
              title: parsed.title,
              description: parsed.description,
              duration_minutes: parsed.duration_minutes || 30,
              reason: parsed.reason,
              task_type: parsed.task_type || 'PRACTICE',
              topic_name: weakTopic?.topic_name || topicName,
            },
          });
        }
      } catch (err) {
        console.warn('AI recommend fallback:', err);
      }
    }

    // High quality deterministic fallback
    return NextResponse.json({
      recommendation: {
        title: `${weakTopic?.topic_name || topicName} Revision & Practice — 30 minutes`,
        description: 'Review ROW_NUMBER vs RANK vs DENSE_RANK ties and solve 3 targeted edge-case queries.',
        duration_minutes: 30,
        reason: `${weakTopic?.topic_name || 'Topic'} has low quiz accuracy (${weakTopic?.accuracy_rate || 61}%) and incomplete prerequisite tasks.`,
        task_type: 'PRACTICE',
        topic_name: weakTopic?.topic_name || topicName,
      },
    });
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return NextResponse.json({ error: 'Failed to generate recommendation' }, { status: 500 });
  }
}
