export type TaskType = 
  | 'LEARN' 
  | 'PRACTICE' 
  | 'CODE' 
  | 'PROJECT' 
  | 'REVIEW' 
  | 'QUIZ' 
  | 'WATCH_VIDEO';

export type TaskStatus = 
  | 'PLANNED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'MISSED' 
  | 'SKIPPED' 
  | 'RESCHEDULED';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  total_months: number;
  daily_hours: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  created_at: string;
}

export interface Month {
  id: string;
  roadmap_id: string;
  month_number: number;
  title: string;
  description: string;
  goal: string;
  technology: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  project_id?: string;
}

export interface Week {
  id: string;
  month_id: string;
  week_number: number;
  title: string;
  goal: string;
}

export interface Day {
  id: string;
  week_id: string;
  day_number: number;
  calendar_date: string; // ISO format YYYY-MM-DD computed from start_date
  title: string;
  description: string;
  estimated_minutes: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  technology: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  base_importance: number; // 0-100
  base_difficulty: number; // 0-100
  estimated_minutes: number;
  quiz_accuracy?: number; // 0-100%
  completed_tasks_count?: number;
  total_tasks_count?: number;
}

export interface DayTopic {
  id: string;
  day_id: string;
  topic_id: string;
  priority: PriorityLevel;
}

export interface Task {
  id: string;
  day_id: string;
  day_number: number;
  title: string;
  description: string;
  task_type: TaskType;
  estimated_minutes: number;
  priority_score: number; // 0 - 100 calculated
  priority_level: PriorityLevel;
  is_required: boolean;
  status: TaskStatus;
  due_date: string; // YYYY-MM-DD
  completed_at?: string;
  created_at: string;
  topic_name?: string;
  depends_on_task_ids?: string[];
  project_id?: string;
}

export interface TaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
}

export interface TaskProgress {
  id: string;
  task_id: string;
  user_id: string;
  status: TaskStatus;
  started_at?: string;
  completed_at?: string;
  actual_minutes?: number;
  notes?: string;
  created_at: string;
}

export interface Resource {
  id: string;
  topic_id: string;
  topic_name: string;
  title: string;
  url: string;
  platform: 'YouTube' | 'Documentation' | 'Article';
  channel: string;
  duration_minutes: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  relevance_score: number; // 0 - 100
  published_at: string;
  is_recommended: boolean;
  thumbnail_url?: string;
}

export interface ResourceProgress {
  id: string;
  resource_id: string;
  user_id: string;
  status: 'UNWATCHED' | 'WATCHING' | 'COMPLETED' | 'NOT_USEFUL';
  watched_percentage: number;
  completed_at?: string;
  rating?: number; // 1-5
  notes?: string;
}

export interface ProjectChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  task_id?: string;
}

export interface Project {
  id: string;
  month_number: number;
  title: string;
  description: string;
  architecture_diagram?: string;
  progress_percentage: number;
  checklist: ProjectChecklistItem[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface PriorityBreakdown {
  topic_id: string;
  topic_name: string;
  importance: number;
  difficulty: number;
  missed_count: number;
  dependency_impact: number;
  weakness_score: number;
  deadline_pressure: number;
  calculated_score: number;
  priority_level: PriorityLevel;
}

export interface WeakTopicReport {
  topic_id: string;
  topic_name: string;
  technology: string;
  completion_rate: number; // 0-100%
  accuracy_rate: number; // 0-100%
  is_weak: boolean;
  recommendation: string;
  suggested_minutes: number;
  related_subtopics: string[];
}

export interface RecoveryPlanItem {
  id: string;
  task_id: string;
  title: string;
  action: 'COMPLETE_CRITICAL' | 'COMPLETE_DEPENDENCY' | 'RESCHEDULE' | 'MOVE_OPTIONAL';
  duration_minutes: number;
  priority_level: PriorityLevel;
  reason: string;
}

export interface RecoveryPlan {
  missed_day_number: number;
  missed_date: string;
  original_workload_minutes: number;
  tomorrow_workload_minutes: number;
  recommended_actions: RecoveryPlanItem[];
}

export interface DashboardData {
  user: User;
  roadmap: Roadmap;
  current_day_number: number;
  total_days: number;
  overall_progress_percentage: number;
  current_streak_days: number;
  longest_streak_days: number;
  completed_tasks_count: number;
  total_tasks_count: number;
  total_study_minutes: number;
  today: {
    day_number: number;
    title: string;
    description: string;
    goal: string;
    date: string;
    planned_minutes: number;
    completed_minutes: number;
    remaining_minutes: number;
    is_over_target: boolean;
    minutes_over_target: number;
    progress_percentage: number;
    tasks: Task[];
    topics: Topic[];
    recommended_resources: Resource[];
  };
  attention: {
    critical_alerts: string[];
    warning_alerts: string[];
    healthy_alerts: string[];
    missed_tasks_count: number;
    weak_topics_count: number;
    overdue_projects_count: number;
    missed_tasks: Task[];
  };
  priority_topics: PriorityBreakdown[];
  weak_topics: WeakTopicReport[];
  tech_breakdown: {
    technology: string;
    percentage: number;
    completed: number;
    total: number;
  }[];
  monthly_progress: {
    month_number: number;
    title: string;
    technology: string;
    progress_percentage: number;
    completed_tasks: number;
    total_tasks: number;
  }[];
  current_project: Project | null;
}

export interface AnalyticsData {
  overall_progress_percentage: number;
  study_hours_formatted: string;
  total_study_minutes: number;
  current_streak: number;
  longest_streak: number;
  tasks_completed: number;
  tasks_missed: number;
  tasks_rescheduled: number;
  tasks_skipped: number;
  total_tasks: number;
  tech_progress: {
    technology: string;
    percentage: number;
    completed: number;
    total: number;
    color: string;
  }[];
  monthly_overview: {
    month_number: number;
    title: string;
    goal: string;
    percentage: number;
    status: string;
  }[];
  topic_distribution: {
    strong: number;
    average: number;
    weak: number;
    not_started: number;
  };
  recent_activity: TaskProgress[];
}
