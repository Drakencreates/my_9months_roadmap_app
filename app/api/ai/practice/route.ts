import { NextRequest, NextResponse } from 'next/server';
import { GEMINI_MODEL, getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    let topic = 'SQL Window Functions';
    try {
      const body = await req.json();
      if (body.topic) topic = body.topic;
    } catch {
      // Optional
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `Generate an interview-grade practice question for the learning topic: "${topic}".
Return JSON:
{
  "title": "Title of problem",
  "difficulty": "INTERMEDIATE" | "ADVANCED" | "BEGINNER",
  "scenario": "Problem description with sample schema/data",
  "expected_output": "What the query/code should produce",
  "solution_code": "The reference SQL or Python code",
  "explanation": "Why this solution works and common pitfalls"
}`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        });

        const data = JSON.parse(response.text || '{}');
        return NextResponse.json({ problem: data });
      } catch (err) {
        console.warn('AI practice generator fallback:', err);
      }
    }

    // Default fallback problem
    return NextResponse.json({
      problem: {
        title: 'Department Top 3 Earning Employees (Dense Ranking)',
        difficulty: 'INTERMEDIATE',
        scenario: `Given a table 'employees':
- emp_id (INT)
- name (VARCHAR)
- salary (INT)
- department_id (INT)

Write a query to find the employees who earn the top 3 highest unique salaries in each department.`,
        expected_output: 'Table with (department_id, name, salary, salary_rank) where salary_rank <= 3.',
        solution_code: `WITH RankedSalaries AS (
  SELECT 
    department_id,
    name,
    salary,
    DENSE_RANK() OVER (
      PARTITION BY department_id 
      ORDER BY salary DESC
    ) AS salary_rank
  FROM employees
)
SELECT department_id, name, salary, salary_rank
FROM RankedSalaries
WHERE salary_rank <= 3
ORDER BY department_id, salary_rank, salary DESC;`,
        explanation: 'DENSE_RANK() is preferred over ROW_NUMBER() when employees sharing the exact same salary should be tied for the same rank without skipping subsequent ranks.',
      },
    });
  } catch (error) {
    console.error('Error generating practice question:', error);
    return NextResponse.json({ error: 'Failed to generate practice question' }, { status: 500 });
  }
}
