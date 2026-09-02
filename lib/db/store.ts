import fs from 'fs';
import path from 'path';
import {
  AnalyticsData,
  DashboardData,
  Day,
  Month,
  PriorityBreakdown,
  PriorityLevel,
  Project,
  RecoveryPlan,
  Resource,
  ResourceProgress,
  Roadmap,
  Task,
  TaskProgress,
  TaskStatus,
  TaskType,
  Topic,
  User,
  WeakTopicReport,
  Week,
} from '../types';
import {
  INITIAL_ROADMAP,
  INITIAL_USER,
  MONTHS_SEED,
  PROJECTS_SEED,
  RESOURCES_SEED,
  TOPICS_SEED,
  getTomorrowDate,
} from './seed-data';

interface StoreState {
  user: User;
  roadmap: Roadmap;
  months: Month[];
  weeks: Week[];
  days: Day[];
  topics: Topic[];
  tasks: Task[];
  task_progress: TaskProgress[];
  resources: Resource[];
  resource_progress: ResourceProgress[];
  projects: Project[];
  simulated_today_day_number: number; // 1 to 270
  simulated_current_date: string; // YYYY-MM-DD
}

const PERSISTENCE_FILE = path.join(process.cwd(), '.roadmap_data.json');

// Helper to add days to a date string YYYY-MM-DD
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

class RoadmapStore {
  private state: StoreState;

  constructor() {
    this.state = this.loadFromDisk() || this.initFreshState();
  }

  private loadFromDisk(): StoreState | null {
    try {
      if (fs.existsSync(PERSISTENCE_FILE)) {
        const data = fs.readFileSync(PERSISTENCE_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch {
      // fallback to fresh
    }
    return null;
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch {
      // In read-only or dev environments, state remains in memory
    }
  }

  public initFreshState(customStartDate?: string): StoreState {
    const user: User = { ...INITIAL_USER };
    const roadmap: Roadmap = { ...INITIAL_ROADMAP };
    if (customStartDate) {
      roadmap.start_date = customStartDate;
      roadmap.end_date = addDays(customStartDate, 270);
    }
    const months: Month[] = MONTHS_SEED.map((m) => ({ ...m, roadmap_id: roadmap.id }));
    const projects: Project[] = JSON.parse(JSON.stringify(PROJECTS_SEED));
    const topics: Topic[] = JSON.parse(JSON.stringify(TOPICS_SEED));
    const resources: Resource[] = JSON.parse(JSON.stringify(RESOURCES_SEED));
    const resource_progress: ResourceProgress[] = [];

    const weeks: Week[] = [];
    const days: Day[] = [];
    const tasks: Task[] = [];
    const task_progress: TaskProgress[] = [];

    const TOTAL_DAYS = 270;
    const DAYS_PER_WEEK = 7;
    const WEEKS_COUNT = 39; // ~9 months

    const startDate = roadmap.start_date;
    const SIMULATED_TODAY_DAY = 1; // Starts tomorrow from Day 1!
    const simulatedCurrentDate = addDays(startDate, SIMULATED_TODAY_DAY - 1);

    // Generate weeks
    for (let w = 1; w <= WEEKS_COUNT; w++) {
      const monthIndex = Math.min(Math.floor((w - 1) / 4.3), 8);
      const monthId = months[monthIndex].id;
      weeks.push({
        id: `week_${w}`,
        month_id: monthId,
        week_number: w,
        title: `Week ${w}: ${months[monthIndex].title} Phase ${((w - 1) % 4) + 1}`,
        goal: `Master core practical techniques for ${months[monthIndex].technology}.`,
      });
    }

    // Generate 270 days and realistic tasks
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const weekIndex = Math.min(Math.floor((d - 1) / DAYS_PER_WEEK), weeks.length - 1);
      const week = weeks[weekIndex];
      const monthIndex = Math.min(Math.floor((d - 1) / 30), 8);
      const month = months[monthIndex];
      const calendarDate = addDays(startDate, d - 1);

      let dayTitle = `Day ${d}: ${month.technology} Studies`;
      let dayDesc = `Dedicated 3-hour deep dive into ${month.technology}.`;
      let dayStatus: Day['status'] = 'NOT_STARTED';

      if (d === SIMULATED_TODAY_DAY) {
        dayStatus = 'IN_PROGRESS';
        dayTitle = 'Day 1: SQL Relational Foundations & SELECT Projections';
        dayDesc = 'Kickstart your 9-month journey with 3 hours of relational theory, table projections, and local environment setup.';
      } else {
        dayStatus = 'NOT_STARTED';
      }

      const dayId = `day_${d}`;
      days.push({
        id: dayId,
        week_id: week.id,
        day_number: d,
        calendar_date: calendarDate,
        title: dayTitle,
        description: dayDesc,
        estimated_minutes: 180,
        status: dayStatus,
      });

      // Generate Tasks for the day
      if (d === 1) {
        // EXACT Tasks for Day 1 (Month 1: SQL Foundations):
        // 1. LEARN — 45 min: Relational Database Concepts & SQL Execution Model
        // 2. LEARN — 30 min: Basic SELECT & Column Aliasing (AS)
        // 3. PRACTICE — 45 min: Write 5 foundational SELECT queries on sample tables
        // 4. VIDEO — 30 min: Recommended Video: SQL Basics for Beginners (Alex The Analyst)
        // 5. PROJECT — 30 min: Project Kickoff: Initialize SQL Data Explorer schema
        // Total: 180 min (exact 3-hour daily target)
        const day1Tasks: Task[] = [
          {
            id: `task_d1_1`,
            day_id: dayId,
            day_number: d,
            title: 'Learn Relational Database Concepts & SQL Execution Model',
            description: 'Understand relational models, tables, columns, data types, primary keys, and how SQL declaratively interprets queries.',
            task_type: 'LEARN',
            estimated_minutes: 45,
            priority_score: 92,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SELECT & FROM',
          },
          {
            id: `task_d1_2`,
            day_id: dayId,
            day_number: d,
            title: 'Master Basic SELECT & Column Aliasing (AS)',
            description: 'Practice column projection, SELECT *, column expressions, arithmetic operations, and custom aliasing syntax.',
            task_type: 'LEARN',
            estimated_minutes: 30,
            priority_score: 88,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SELECT & FROM',
            depends_on_task_ids: [`task_d1_1`],
          },
          {
            id: `task_d1_3`,
            day_id: dayId,
            day_number: d,
            title: 'Write 5 foundational SELECT queries on sample tables',
            description: 'Hands-on query execution projecting customers, products, and order headers in Postgres sandbox or SQL Fiddle.',
            task_type: 'PRACTICE',
            estimated_minutes: 45,
            priority_score: 85,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SELECT & FROM',
            depends_on_task_ids: [`task_d1_2`],
          },
          {
            id: `task_d1_4`,
            day_id: dayId,
            day_number: d,
            title: 'Watch recommended YouTube lesson: SQL Basics for Beginners',
            description: 'Complete visual walkthrough on database schemas, table structures, and first queries with Alex The Analyst.',
            task_type: 'WATCH_VIDEO',
            estimated_minutes: 30,
            priority_score: 78,
            priority_level: 'MEDIUM',
            is_required: false,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SELECT & FROM',
          },
          {
            id: `task_d1_5`,
            day_id: dayId,
            day_number: d,
            title: 'Project Kickoff: Initialize SQL Data Explorer schema',
            description: 'Set up the Month 1 project repository, initialize sample database tables, and verify initial connection query.',
            task_type: 'PROJECT',
            estimated_minutes: 30,
            priority_score: 90,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SELECT & FROM',
            project_id: 'proj_m1',
          },
        ];
        tasks.push(...day1Tasks);
      } else if (d === 47) {
        // Detailed Window Functions tasks for simulation jumping to Day 47
        const day47Tasks: Task[] = [
          {
            id: `task_d47_1`,
            day_id: dayId,
            day_number: d,
            title: 'Learn Window Functions fundamentals',
            description: 'Understand OVER(), window frame clauses, differences from GROUP BY, and syntax execution order.',
            task_type: 'LEARN',
            estimated_minutes: 45,
            priority_score: 87,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
          },
          {
            id: `task_d47_2`,
            day_id: dayId,
            day_number: d,
            title: 'Master PARTITION BY and ORDER BY within OVER()',
            description: 'Apply multi-column partitions and window frames (ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).',
            task_type: 'LEARN',
            estimated_minutes: 30,
            priority_score: 85,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
            depends_on_task_ids: [`task_d47_1`],
          },
          {
            id: `task_d47_3`,
            day_id: dayId,
            day_number: d,
            title: 'Solve 5 SQL ranking & deduplication problems',
            description: 'Write queries distinguishing ROW_NUMBER vs RANK vs DENSE_RANK on real employee salary datasets.',
            task_type: 'PRACTICE',
            estimated_minutes: 45,
            priority_score: 82,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
            depends_on_task_ids: [`task_d47_2`],
          },
          {
            id: `task_d47_4`,
            day_id: dayId,
            day_number: d,
            title: 'Watch recommended YouTube lesson: Window Functions Explained',
            description: 'Watch Alex The Analyst & Luke Barousse deep-dive with animated partition visualizer.',
            task_type: 'WATCH_VIDEO',
            estimated_minutes: 30,
            priority_score: 74,
            priority_level: 'MEDIUM',
            is_required: false,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
          },
          {
            id: `task_d47_5`,
            day_id: dayId,
            day_number: d,
            title: 'Project implementation: Add ranking queries to Analytics DB',
            description: 'Implement staging-to-clean deduplication view in Month 2 Analytics Database using ROW_NUMBER() = 1.',
            task_type: 'PROJECT',
            estimated_minutes: 30,
            priority_score: 89,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
            project_id: 'proj_m2',
          },
        ];
        tasks.push(...day47Tasks);
      } else if (d === 45) {
        // Window Functions foundations tasks for Day 45
        tasks.push(
          {
            id: `task_d45_1`,
            day_id: dayId,
            day_number: d,
            title: 'ROW_NUMBER vs RANK vs DENSE_RANK deep dive',
            description: 'Detailed analysis of tie-breaking behavior and row gap sequences.',
            task_type: 'LEARN',
            estimated_minutes: 45,
            priority_score: 91,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
          },
          {
            id: `task_d45_2`,
            day_id: dayId,
            day_number: d,
            title: 'Solve 4 tie-breaker challenge queries on HackerRank/LeetCode',
            description: 'Solve Department Top Three Salaries using DENSE_RANK().',
            task_type: 'PRACTICE',
            estimated_minutes: 45,
            priority_score: 86,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
          },
          {
            id: `task_d45_3`,
            day_id: dayId,
            day_number: d,
            title: 'Watch video: Window Functions common pitfalls',
            description: 'Avoiding performance traps and missing ORDER BY in window specifications.',
            task_type: 'WATCH_VIDEO',
            estimated_minutes: 30,
            priority_score: 65,
            priority_level: 'MEDIUM',
            is_required: false,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
          }
        );
      } else if (d === 46) {
        // Offset tasks for Day 46
        tasks.push(
          {
            id: `task_d46_1`,
            day_id: dayId,
            day_number: d,
            title: 'LAG and LEAD offsets for previous period comparisons',
            description: 'Calculate month-over-month growth and delta metrics using LAG(val, 1) OVER().',
            task_type: 'LEARN',
            estimated_minutes: 45,
            priority_score: 88,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
          },
          {
            id: `task_d46_2`,
            day_id: dayId,
            day_number: d,
            title: 'Practice: Compute daily churn and retention delta in SQL',
            description: 'Write window difference expressions with default values for null offsets.',
            task_type: 'CODE',
            estimated_minutes: 45,
            priority_score: 84,
            priority_level: 'HIGH',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: 'SQL Window Functions',
          }
        );
      } else {
        // Standard planned curriculum days
        const taskTypes: TaskType[] = ['LEARN', 'PRACTICE', 'CODE'];
        tasks.push(
          {
            id: `task_d${d}_1`,
            day_id: dayId,
            day_number: d,
            title: `Study Session: ${month.title} (Part 1)`,
            description: `Core theoretical foundation and official documentation.`,
            task_type: taskTypes[d % 3],
            estimated_minutes: 60,
            priority_score: 70,
            priority_level: 'MEDIUM',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: month.technology,
          },
          {
            id: `task_d${d}_2`,
            day_id: dayId,
            day_number: d,
            title: `Practical Implementation: ${month.title} (Part 2)`,
            description: `Code exercises and pipeline testing.`,
            task_type: 'PRACTICE',
            estimated_minutes: 60,
            priority_score: 65,
            priority_level: 'MEDIUM',
            is_required: true,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: month.technology,
          },
          {
            id: `task_d${d}_3`,
            day_id: dayId,
            day_number: d,
            title: `Project Milestones: ${month.title} (Part 3)`,
            description: `Architecture integration and validation checks.`,
            task_type: 'PROJECT',
            estimated_minutes: 60,
            priority_score: 60,
            priority_level: 'MEDIUM',
            is_required: false,
            status: 'PLANNED',
            due_date: calendarDate,
            created_at: `${calendarDate}T08:00:00Z`,
            topic_name: month.technology,
          }
        );
      }
    }

    const state: StoreState = {
      user,
      roadmap,
      months,
      weeks,
      days,
      topics,
      tasks,
      task_progress,
      resources,
      resource_progress,
      projects,
      simulated_today_day_number: SIMULATED_TODAY_DAY,
      simulated_current_date: simulatedCurrentDate,
    };

    return state;
  }

  // Calculate dynamic priority score for a topic
  // Priority Score = Topic Importance + Dependency Importance + Difficulty + Missed Count + Weakness Score + Deadline Pressure
  // Normalized to 0 - 100
  public calculateTopicPriority(topicId: string): PriorityBreakdown {
    const topic = this.state.topics.find((t) => t.id === topicId);
    if (!topic) {
      return {
        topic_id: topicId,
        topic_name: 'Unknown',
        importance: 50,
        difficulty: 50,
        missed_count: 0,
        dependency_impact: 50,
        weakness_score: 50,
        deadline_pressure: 50,
        calculated_score: 50,
        priority_level: 'MEDIUM',
      };
    }

    // Factors
    const importance = topic.base_importance; // 0-100
    const difficulty = topic.base_difficulty; // 0-100

    // Count missed tasks associated with this topic
    const topicTasks = this.state.tasks.filter((t) =>
      t.topic_name?.toLowerCase().includes(topic.name.toLowerCase()) ||
      t.title.toLowerCase().includes(topic.name.toLowerCase())
    );
    const missedTasks = topicTasks.filter((t) => t.status === 'MISSED');
    const missedCountScore = Math.min(missedTasks.length * 20, 100);

    // Dependency impact (high if other topics or project milestones depend on it)
    let dependencyImpact = 60;
    if (topic.id === 'top_select_from') dependencyImpact = 95; // Prerequisite for all SQL queries
    if (topic.id === 'top_where_ops') dependencyImpact = 90;
    if (topic.id === 'top_joins') dependencyImpact = 90;
    if (topic.id === 'top_subqueries_ctes') dependencyImpact = 85;
    if (topic.id === 'top_window_functions') dependencyImpact = 95; // Prerequisite for staging/clean deduplication
    if (topic.id === 'top_airflow_dags') dependencyImpact = 90;

    // Weakness score based on quiz accuracy and completion rate
    const accuracy = topic.quiz_accuracy ?? 75;
    const weaknessScore = Math.round(100 - accuracy); // Lower accuracy => higher weakness score

    // Deadline pressure (how close to current day / active month)
    let deadlinePressure = 60;
    if (this.state.simulated_today_day_number <= 30) {
      if (topic.id === 'top_select_from') deadlinePressure = 95;
      else if (topic.id === 'top_where_ops') deadlinePressure = 88;
    } else if (topic.id === 'top_window_functions') {
      deadlinePressure = 90;
    }

    // Weighted combination normalized to 0-100
    // Importance: 25%, Dependency: 20%, Difficulty: 15%, Missed: 20%, Weakness: 10%, Deadline: 10%
    const rawScore =
      importance * 0.25 +
      dependencyImpact * 0.2 +
      difficulty * 0.15 +
      missedCountScore * 0.2 +
      weaknessScore * 0.1 +
      deadlinePressure * 0.1;

    const calculatedScore = Math.min(Math.max(Math.round(rawScore), 0), 100);

    let priorityLevel: PriorityLevel = 'MEDIUM';
    if (calculatedScore >= 90) priorityLevel = 'CRITICAL';
    else if (calculatedScore >= 75) priorityLevel = 'HIGH';
    else if (calculatedScore >= 50) priorityLevel = 'MEDIUM';
    else priorityLevel = 'LOW';

    return {
      topic_id: topic.id,
      topic_name: topic.name,
      importance,
      difficulty,
      missed_count: missedTasks.length,
      dependency_impact: dependencyImpact,
      weakness_score: weaknessScore,
      deadline_pressure: deadlinePressure,
      calculated_score: calculatedScore,
      priority_level: priorityLevel,
    };
  }

  // Automatic detection of missed tasks
  public autoDetectMissedTasks(): Task[] {
    const todayDate = this.state.simulated_current_date;
    const missedList: Task[] = [];

    for (const task of this.state.tasks) {
      if (task.due_date < todayDate && task.status !== 'COMPLETED' && task.status !== 'SKIPPED') {
        if (task.status !== 'MISSED') {
          task.status = 'MISSED';
          this.logProgress(task.id, 'MISSED', 0, 'Auto-flagged as overdue missed task');
        }
        missedList.push(task);
      }
    }
    this.saveToDisk();
    return missedList;
  }

  // Weak topic detection
  public detectWeakTopics(): WeakTopicReport[] {
    const reports: WeakTopicReport[] = [];

    for (const topic of this.state.topics) {
      const topicTasks = this.state.tasks.filter((t) =>
        t.topic_name?.toLowerCase().includes(topic.name.toLowerCase()) ||
        t.title.toLowerCase().includes(topic.name.toLowerCase())
      );
      const completed = topicTasks.filter((t) => t.status === 'COMPLETED').length;
      const total = topicTasks.length || 1;
      const completionRate = Math.round((completed / total) * 100);
      const accuracyRate = topic.quiz_accuracy ?? 75;

      // Only flag as weak if user has attempted tasks or missed tasks in this topic
      const hasAttempted = topicTasks.some((t) => t.status === 'COMPLETED' || t.status === 'MISSED');
      const isWeak = hasAttempted && (completionRate < 60 || accuracyRate < 70);

      let recommendation = `Continue regular study pace for ${topic.name}.`;
      let suggestedMinutes = 30;

      if (topic.id === 'top_select_from') {
        recommendation = 'Spend 30 minutes reinforcing core SQL projections and alias syntax.';
        suggestedMinutes = 30;
      } else if (topic.id === 'top_window_functions') {
        recommendation = 'Spend an additional 45 minutes reviewing ROW_NUMBER, RANK, and PARTITION BY with real dataset queries.';
        suggestedMinutes = 45;
      } else if (topic.id === 'top_subqueries_ctes') {
        recommendation = 'Practice CTE recursion benchmarks and multi-CTE pipeline structuring for 30 minutes.';
        suggestedMinutes = 30;
      } else if (topic.id === 'top_airflow_dags') {
        recommendation = 'Review DAG dependency syntax (>> operator) and sensor timeout parameters.';
        suggestedMinutes = 45;
      }

      reports.push({
        topic_id: topic.id,
        topic_name: topic.name,
        technology: topic.technology,
        completion_rate: completionRate,
        accuracy_rate: accuracyRate,
        is_weak: isWeak,
        recommendation,
        suggested_minutes: suggestedMinutes,
        related_subtopics: topic.description.split(',').map((s) => s.trim()),
      });
    }

    return reports.filter((r) => r.is_weak);
  }

  // Generate recovery plan for a missed day
  public generateRecoveryPlan(missedDayNumber: number): RecoveryPlan {
    const day = this.state.days.find((d) => d.day_number === missedDayNumber);
    const dayTasks = this.state.tasks.filter((t) => t.day_number === missedDayNumber);

    const originalWorkload = dayTasks.reduce((sum, t) => sum + t.estimated_minutes, 0) || 180;
    const tomorrowTasks = this.state.tasks.filter((t) => t.day_number === this.state.simulated_today_day_number + 1);
    const tomorrowWorkload = tomorrowTasks.reduce((sum, t) => sum + t.estimated_minutes, 0) || 180;

    const recommendedActions = dayTasks.map((task) => {
      let action: 'COMPLETE_CRITICAL' | 'COMPLETE_DEPENDENCY' | 'RESCHEDULE' | 'MOVE_OPTIONAL' = 'RESCHEDULE';
      let reason = 'Rescheduled to distribute workload over upcoming rest window.';

      if (task.priority_level === 'CRITICAL' || task.is_required) {
        action = 'COMPLETE_CRITICAL';
        reason = 'Critical milestone for current project block.';
      } else if (task.depends_on_task_ids && task.depends_on_task_ids.length > 0) {
        action = 'COMPLETE_DEPENDENCY';
        reason = 'Required as prerequisite for tomorrow’s coding exercises.';
      } else if (task.task_type === 'WATCH_VIDEO') {
        action = 'MOVE_OPTIONAL';
        reason = 'Optional video resource can be watched during commute or weekend review.';
      }

      return {
        id: `rec_${task.id}`,
        task_id: task.id,
        title: task.title,
        action,
        duration_minutes: task.estimated_minutes,
        priority_level: task.priority_level,
        reason,
      };
    });

    return {
      missed_day_number: missedDayNumber,
      missed_date: day?.calendar_date || 'N/A',
      original_workload_minutes: originalWorkload,
      tomorrow_workload_minutes: tomorrowWorkload,
      recommended_actions: recommendedActions,
    };
  }

  // Apply Recovery Plan
  public applyRecoveryPlan(plan: RecoveryPlan): { success: boolean; appliedCount: number } {
    let appliedCount = 0;
    for (const item of plan.recommended_actions) {
      const task = this.state.tasks.find((t) => t.id === item.task_id);
      if (task) {
        if (item.action === 'COMPLETE_CRITICAL') {
          // move to today's active day
          task.day_number = this.state.simulated_today_day_number;
          task.due_date = this.state.simulated_current_date;
          task.status = 'PLANNED';
          this.logProgress(task.id, 'RESCHEDULED', 0, 'Moved to today via Recovery Plan');
        } else if (item.action === 'RESCHEDULE') {
          // move to day after tomorrow
          const targetDay = this.state.simulated_today_day_number + 1;
          task.day_number = targetDay;
          task.due_date = addDays(this.state.roadmap.start_date, targetDay - 1);
          task.status = 'RESCHEDULED';
          this.logProgress(task.id, 'RESCHEDULED', 0, 'Rescheduled via Recovery Plan');
        } else if (item.action === 'MOVE_OPTIONAL') {
          task.status = 'SKIPPED';
          this.logProgress(task.id, 'SKIPPED', 0, 'Moved to optional review queue via Recovery Plan');
        }
        appliedCount++;
      }
    }
    this.saveToDisk();
    return { success: true, appliedCount };
  }

  // Log task progress without overwriting history
  public logProgress(
    taskId: string,
    status: TaskStatus,
    actualMinutes: number = 0,
    notes: string = ''
  ): TaskProgress {
    const entry: TaskProgress = {
      id: `tp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      task_id: taskId,
      user_id: this.state.user.id,
      status,
      completed_at: status === 'COMPLETED' ? new Date().toISOString() : undefined,
      actual_minutes: actualMinutes,
      notes,
      created_at: new Date().toISOString(),
    };
    this.state.task_progress.push(entry);
    return entry;
  }

  // Mark task completed
  public completeTask(taskId: string, actualMinutes: number = 45, notes: string = ''): Task | null {
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (!task) return null;

    task.status = 'COMPLETED';
    task.completed_at = new Date().toISOString();
    this.logProgress(taskId, 'COMPLETED', actualMinutes, notes || 'Completed by user');

    // Check if day is complete
    const dayTasks = this.state.tasks.filter((t) => t.day_number === task.day_number);
    const allDone = dayTasks.every((t) => t.status === 'COMPLETED' || t.status === 'SKIPPED');
    if (allDone) {
      const day = this.state.days.find((d) => d.day_number === task.day_number);
      if (day) day.status = 'COMPLETED';
    }

    this.saveToDisk();
    return task;
  }

  // Reschedule task
  public rescheduleTask(taskId: string, targetDayNumber?: number, targetDate?: string): Task | null {
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (!task) return null;

    const newDayNum = targetDayNumber || this.state.simulated_today_day_number + 1;
    const newDate = targetDate || addDays(this.state.roadmap.start_date, newDayNum - 1);

    task.day_number = newDayNum;
    task.due_date = newDate;
    task.status = 'RESCHEDULED';

    this.logProgress(taskId, 'RESCHEDULED', 0, `Rescheduled to Day ${newDayNum} (${newDate})`);
    this.saveToDisk();
    return task;
  }

  // Skip task
  public skipTask(taskId: string, reason: string = 'User marked skipped'): Task | null {
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (!task) return null;

    task.status = 'SKIPPED';
    this.logProgress(taskId, 'SKIPPED', 0, reason);
    this.saveToDisk();
    return task;
  }

  // Update resource watch progress
  public updateResourceProgress(
    resourceId: string,
    status: ResourceProgress['status'],
    rating?: number,
    notes?: string
  ): ResourceProgress {
    let progress = this.state.resource_progress.find((p) => p.resource_id === resourceId);
    if (!progress) {
      progress = {
        id: `rp_${Date.now()}`,
        resource_id: resourceId,
        user_id: this.state.user.id,
        status,
        watched_percentage: status === 'COMPLETED' ? 100 : 50,
        completed_at: status === 'COMPLETED' ? new Date().toISOString() : undefined,
        rating,
        notes,
      };
      this.state.resource_progress.push(progress);
    } else {
      progress.status = status;
      if (status === 'COMPLETED') {
        progress.watched_percentage = 100;
        progress.completed_at = new Date().toISOString();
      }
      if (rating) progress.rating = rating;
      if (notes) progress.notes = notes;
    }
    this.saveToDisk();
    return progress;
  }

  // Add an AI recommended task to the roadmap
  public addTaskToRoadmap(taskData: {
    title: string;
    description: string;
    task_type: TaskType;
    estimated_minutes: number;
    priority_level: PriorityLevel;
    topic_name: string;
    day_number?: number;
  }): Task {
    const targetDay = taskData.day_number || this.state.simulated_today_day_number;
    const calendarDate = addDays(this.state.roadmap.start_date, targetDay - 1);

    const newTask: Task = {
      id: `task_ai_${Date.now()}`,
      day_id: `day_${targetDay}`,
      day_number: targetDay,
      title: taskData.title,
      description: taskData.description,
      task_type: taskData.task_type,
      estimated_minutes: taskData.estimated_minutes,
      priority_score: taskData.priority_level === 'CRITICAL' ? 95 : 85,
      priority_level: taskData.priority_level,
      is_required: true,
      status: 'PLANNED',
      due_date: calendarDate,
      created_at: new Date().toISOString(),
      topic_name: taskData.topic_name,
    };

    this.state.tasks.push(newTask);
    this.logProgress(newTask.id, 'PLANNED', 0, 'Added by AI Learning Assistant');
    this.saveToDisk();
    return newTask;
  }

  // Change roadmap start date and recalculate calendar dates
  public updateStartDate(newStartDate: string) {
    this.state.roadmap.start_date = newStartDate;
    this.state.roadmap.end_date = addDays(newStartDate, 270);
    this.state.simulated_current_date = addDays(newStartDate, this.state.simulated_today_day_number - 1);

    // Recalculate day calendar dates
    for (const day of this.state.days) {
      day.calendar_date = addDays(newStartDate, day.day_number - 1);
    }
    for (const task of this.state.tasks) {
      task.due_date = addDays(newStartDate, task.day_number - 1);
    }
    this.saveToDisk();
  }

  // Simulate jumping to a specific day number
  public setSimulatedDay(dayNumber: number) {
    this.state.simulated_today_day_number = Math.min(Math.max(dayNumber, 1), 270);
    this.state.simulated_current_date = addDays(
      this.state.roadmap.start_date,
      this.state.simulated_today_day_number - 1
    );
    this.autoDetectMissedTasks();
    this.saveToDisk();
  }

  // Toggle project checklist item
  public toggleProjectChecklist(projectId: string, checklistId: string): Project | null {
    const project = this.state.projects.find((p) => p.id === projectId);
    if (!project) return null;

    const item = project.checklist.find((c) => c.id === checklistId);
    if (item) {
      item.completed = !item.completed;
      const completedCount = project.checklist.filter((c) => c.completed).length;
      project.progress_percentage = Math.round((completedCount / project.checklist.length) * 100);
      if (project.progress_percentage === 100) project.status = 'COMPLETED';
      else if (project.progress_percentage > 0) project.status = 'IN_PROGRESS';
      this.saveToDisk();
    }
    return project;
  }

  // Build complete Dashboard response
  public getDashboardData(): DashboardData {
    this.autoDetectMissedTasks();

    const todayDayNum = this.state.simulated_today_day_number;
    const todayTasks = this.state.tasks.filter((t) => t.day_number === todayDayNum);
    const dayObj = this.state.days.find((d) => d.day_number === todayDayNum);

    const plannedMinutes = todayTasks.reduce((sum, t) => sum + t.estimated_minutes, 0);
    const completedTasks = todayTasks.filter((t) => t.status === 'COMPLETED');
    const completedMinutes = completedTasks.reduce((sum, t) => sum + t.estimated_minutes, 0);
    const remainingMinutes = Math.max(plannedMinutes - completedMinutes, 0);

    const isOverTarget = plannedMinutes > 180;
    const minutesOverTarget = Math.max(plannedMinutes - 180, 0);
    const todayProgressPct = plannedMinutes > 0 ? Math.round((completedMinutes / plannedMinutes) * 100) : 0;

    // Overall progress
    const allCompleted = this.state.tasks.filter((t) => t.status === 'COMPLETED').length;
    const allTotal = this.state.tasks.length || 1;
    const overallPct = Math.round((allCompleted / allTotal) * 100);

    // Current month calculation
    const currentMonthNum = Math.min(Math.floor((todayDayNum - 1) / 30) + 1, 9);

    // Attention alerts
    const missedTasks = this.state.tasks.filter((t) => t.status === 'MISSED');
    const weakTopics = this.detectWeakTopics();
    const overdueProjects = this.state.projects.filter(
      (p) => p.month_number < currentMonthNum && p.status !== 'COMPLETED'
    );

    const criticalAlerts: string[] = [];
    const warningAlerts: string[] = [];
    const healthyAlerts: string[] = [];

    if (missedTasks.length > 0) {
      warningAlerts.push(`${missedTasks.length} missed tasks detected from previous days`);
    }
    if (weakTopics.length > 0) {
      warningAlerts.push(`${weakTopics.length} high-priority topics need attention (${weakTopics.map((w) => w.topic_name).join(', ')})`);
    }
    if (overdueProjects.length > 0) {
      criticalAlerts.push(`${overdueProjects.length} overdue project milestone`);
    }
    if (todayProgressPct === 100) {
      healthyAlerts.push(`Day ${todayDayNum} 100% completed! Daily 3-hour target achieved.`);
    } else if (todayDayNum === 1 && todayProgressPct === 0) {
      healthyAlerts.push('Roadmap starts tomorrow! Day 1 (SQL Foundations) is scheduled and ready. Daily 3-hour target: 180 min.');
    }

    // Streak calculation based on completed prior days
    let streakDays = 0;
    for (let d = todayDayNum - 1; d >= 1; d--) {
      const dayTasks = this.state.tasks.filter((t) => t.day_number === d);
      if (dayTasks.length > 0 && dayTasks.every((t) => t.status === 'COMPLETED' || t.status === 'SKIPPED')) {
        streakDays++;
      } else {
        break;
      }
    }
    if (streakDays > 0) {
      healthyAlerts.push(`${streakDays}-day study streak active! You're consistently studying 3h/day.`);
    }

    // Priority topics
    const priorityTopicIds = todayDayNum <= 30
      ? ['top_select_from', 'top_where_ops', 'top_aggregations', 'top_joins']
      : ['top_window_functions', 'top_data_quality_stats', 'top_airflow_dags', 'top_text_to_sql'];

    const priorityTopics: PriorityBreakdown[] = priorityTopicIds
      .map((id) => this.calculateTopicPriority(id))
      .sort((a, b) => b.calculated_score - a.calculated_score);

    // Monthly progress
    const monthlyProgress = this.state.months.map((m) => {
      const monthTasks = this.state.tasks.filter((t) => {
        const d = this.state.days.find((day) => day.id === t.day_id);
        if (!d) return false;
        const w = this.state.weeks.find((week) => week.id === d.week_id);
        return w?.month_id === m.id;
      });
      const comp = monthTasks.filter((t) => t.status === 'COMPLETED').length;
      const tot = monthTasks.length || 1;
      return {
        month_number: m.month_number,
        title: m.title,
        technology: m.technology,
        progress_percentage: Math.round((comp / tot) * 100),
        completed_tasks: comp,
        total_tasks: tot,
      };
    });

    // Technology breakdown
    const techCategories = [
      { technology: 'SQL & Foundations', key: 'SQL' },
      { technology: 'Database Engineering', key: 'Database Engineering' },
      { technology: 'Python & Pandas', key: 'Python' },
      { technology: 'Statistics & Quality', key: 'Statistics' },
      { technology: 'Forecasting & ML', key: 'Time Series' },
      { technology: 'AI & LLMs / Text-to-SQL', key: 'AI & LLMs' },
      { technology: 'Airflow & Agents', key: 'Airflow' },
      { technology: 'Go Backend', key: 'Go' },
      { technology: 'React Frontend', key: 'React' },
      { technology: 'DevOps & Docker', key: 'Docker' },
    ];

    const techBreakdown = techCategories.map((tc) => {
      const matchTasks = this.state.tasks.filter((t) =>
        t.topic_name?.toLowerCase().includes(tc.key.toLowerCase()) ||
        t.title.toLowerCase().includes(tc.key.toLowerCase())
      );
      const comp = matchTasks.filter((t) => t.status === 'COMPLETED').length;
      const tot = matchTasks.length || 30;
      return {
        technology: tc.technology,
        percentage: Math.round((comp / tot) * 100),
        completed: comp,
        total: tot,
      };
    });

    const currentProject = this.state.projects.find((p) => p.month_number === currentMonthNum) || this.state.projects[0] || null;
    const totalStudyMinutes = this.state.task_progress
      .filter((tp) => tp.status === 'COMPLETED')
      .reduce((sum, tp) => sum + (tp.actual_minutes || 0), 0);

    const activeTopics = todayDayNum <= 30
      ? this.state.topics.filter((top) => top.id === 'top_select_from' || top.id === 'top_where_ops')
      : this.state.topics.filter((top) => top.id === 'top_window_functions');

    const activeResources = todayDayNum <= 30
      ? this.state.resources.filter((r) => r.topic_id === 'top_select_from' || r.topic_id === 'top_where_ops')
      : this.state.resources.filter((r) => r.topic_id === 'top_window_functions');

    return {
      user: this.state.user,
      roadmap: this.state.roadmap,
      current_day_number: todayDayNum,
      total_days: 270,
      overall_progress_percentage: overallPct,
      current_streak_days: streakDays,
      longest_streak_days: streakDays,
      completed_tasks_count: allCompleted,
      total_tasks_count: allTotal,
      total_study_minutes: totalStudyMinutes,
      today: {
        day_number: todayDayNum,
        title: dayObj?.title || `Day ${todayDayNum}: Tasks`,
        description: dayObj?.description || '3-hour learning roadmap session.',
        goal: todayDayNum === 1
          ? 'Master relational database fundamentals, SELECT projection, column aliases, and initialize the SQL Data Explorer project.'
          : (todayDayNum === 47
              ? 'Master SQL Window Functions (ROW_NUMBER, RANK, DENSE_RANK, PARTITION BY)'
              : `Deep dive into ${dayObj?.title || 'curriculum'}`),
        date: this.state.simulated_current_date,
        planned_minutes: plannedMinutes,
        completed_minutes: completedMinutes,
        remaining_minutes: remainingMinutes,
        is_over_target: isOverTarget,
        minutes_over_target: minutesOverTarget,
        progress_percentage: todayProgressPct,
        tasks: todayTasks,
        topics: activeTopics,
        recommended_resources: activeResources,
      },
      attention: {
        critical_alerts: criticalAlerts,
        warning_alerts: warningAlerts,
        healthy_alerts: healthyAlerts,
        missed_tasks_count: missedTasks.length,
        weak_topics_count: weakTopics.length,
        overdue_projects_count: overdueProjects.length,
        missed_tasks: missedTasks,
      },
      priority_topics: priorityTopics,
      weak_topics: weakTopics,
      tech_breakdown: techBreakdown,
      monthly_progress: monthlyProgress,
      current_project: currentProject,
    };
  }

  // Complete analytics metrics
  public getAnalyticsData(): AnalyticsData {
    const completedTasks = this.state.tasks.filter((t) => t.status === 'COMPLETED');
    const totalMinutes = this.state.task_progress
      .filter((tp) => tp.status === 'COMPLETED')
      .reduce((sum, tp) => sum + (tp.actual_minutes || 0), 0);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    const completed = completedTasks.length;
    const missed = this.state.tasks.filter((t) => t.status === 'MISSED').length;
    const rescheduled = this.state.tasks.filter((t) => t.status === 'RESCHEDULED').length;
    const skipped = this.state.tasks.filter((t) => t.status === 'SKIPPED').length;
    const totalTasks = this.state.tasks.length || 1;

    let streakDays = 0;
    for (let d = this.state.simulated_today_day_number - 1; d >= 1; d--) {
      const dayTasks = this.state.tasks.filter((t) => t.day_number === d);
      if (dayTasks.length > 0 && dayTasks.every((t) => t.status === 'COMPLETED' || t.status === 'SKIPPED')) {
        streakDays++;
      } else {
        break;
      }
    }

    const techProgress = [
      { technology: 'SQL', color: '#3b82f6', key: 'SQL' },
      { technology: 'Python', color: '#10b981', key: 'Python' },
      { technology: 'Statistics', color: '#f59e0b', key: 'Statistics' },
      { technology: 'ML & Forecasting', color: '#8b5cf6', key: 'Time Series' },
      { technology: 'AI & LLMs', color: '#ec4899', key: 'AI & LLMs' },
      { technology: 'Go Backend', color: '#06b6d4', key: 'Go' },
      { technology: 'React Frontend', color: '#6366f1', key: 'React' },
      { technology: 'Airflow & Orchestration', color: '#ef4444', key: 'Airflow' },
      { technology: 'DevOps & Cloud', color: '#64748b', key: 'DevOps' },
    ].map((item) => {
      const matchTasks = this.state.tasks.filter((t) =>
        t.topic_name?.toLowerCase().includes(item.key.toLowerCase()) ||
        t.title.toLowerCase().includes(item.key.toLowerCase())
      );
      const comp = matchTasks.filter((t) => t.status === 'COMPLETED').length;
      const tot = matchTasks.length || 30;
      return {
        technology: item.technology,
        percentage: Math.round((comp / tot) * 100),
        completed: comp,
        total: tot,
        color: item.color,
      };
    });

    const monthlyOverview = this.state.months.map((m) => {
      const monthTasks = this.state.tasks.filter((t) => {
        const d = this.state.days.find((day) => day.id === t.day_id);
        if (!d) return false;
        const w = this.state.weeks.find((week) => week.id === d.week_id);
        return w?.month_id === m.id;
      });
      const comp = monthTasks.filter((t) => t.status === 'COMPLETED').length;
      const tot = monthTasks.length || 1;
      const pct = Math.round((comp / tot) * 100);
      let status = 'Not Started';
      if (pct === 100) status = 'Completed';
      else if (pct > 0 || (m.month_number === 1 && this.state.simulated_today_day_number <= 30)) status = 'In Progress';

      return {
        month_number: m.month_number,
        title: m.title,
        goal: m.goal,
        percentage: pct,
        status,
      };
    });

    return {
      overall_progress_percentage: Math.round((completed / totalTasks) * 100),
      study_hours_formatted: `${hours}h ${mins}m`,
      total_study_minutes: totalMinutes,
      current_streak: streakDays,
      longest_streak: streakDays,
      tasks_completed: completed,
      tasks_missed: missed,
      tasks_rescheduled: rescheduled,
      tasks_skipped: skipped,
      total_tasks: totalTasks,
      tech_progress: techProgress,
      monthly_overview: monthlyOverview,
      topic_distribution: {
        strong: this.state.topics.filter((t) => (t.quiz_accuracy ?? 0) >= 80).length,
        average: this.state.topics.filter((t) => (t.quiz_accuracy ?? 0) >= 60 && (t.quiz_accuracy ?? 0) < 80).length,
        weak: this.state.topics.filter((t) => (t.quiz_accuracy ?? 0) < 60 && (t.quiz_accuracy ?? 0) > 0).length,
        not_started: this.state.topics.filter((t) => !t.quiz_accuracy).length,
      },
      recent_activity: this.state.task_progress.slice(-10).reverse(),
    };
  }

  // Reset roadmap to Day 1 starting tomorrow (or custom date)
  public resetToDayOne(customStartDate?: string) {
    const startDate = customStartDate || getTomorrowDate();
    this.state = this.initFreshState(startDate);
    this.saveToDisk();
    return this.state;
  }

  // Get raw state getters
  public getState(): StoreState {
    return this.state;
  }
}

// Global singleton instance
const globalForStore = globalThis as unknown as { __roadmap_store?: RoadmapStore };
export const store = globalForStore.__roadmap_store ?? new RoadmapStore();
if (process.env.NODE_ENV !== 'production') globalForStore.__roadmap_store = store;
