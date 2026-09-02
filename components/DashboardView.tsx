'use client';

import React from 'react';
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Target,
  Sparkles,
  Video,
  Rocket,
  BrainCircuit,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Play
} from 'lucide-react';
import { DashboardData, PriorityBreakdown, Resource } from '@/lib/types';

interface DashboardViewProps {
  data: DashboardData;
  onNavigateToToday: () => void;
  onOpenMissedModal: () => void;
  onSelectPriorityTopic: (priority: PriorityBreakdown) => void;
  onSelectResource: (resource: Resource) => void;
  onNavigateToTab: (tab: any) => void;
  onAddAiRecommendation: (rec: any) => Promise<void>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onNavigateToToday,
  onOpenMissedModal,
  onSelectPriorityTopic,
  onSelectResource,
  onNavigateToTab,
  onAddAiRecommendation,
}) => {
  const missedCount = data.attention.missed_tasks_count;
  const weakCount = data.attention.weak_topics_count;
  const primaryResource = data.today.recommended_resources[0];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. HERO STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Overall Progress */}
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-4 flex flex-col justify-between hover:border-[#4ADE80]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8E9299] text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">ROADMAP_PROGRESS</span>
            <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-[#4ADE80] font-mono">
              {data.overall_progress_percentage}%
            </span>
            <span className="text-xs font-mono text-[#8E9299]">/ 9 MONTHS</span>
          </div>
          <div className="w-full bg-[#2A2D35] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#4ADE80] h-full rounded-full transition-all duration-700"
              style={{ width: `${data.overall_progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Study Streak */}
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-4 flex flex-col justify-between hover:border-[#FBBF24]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8E9299] text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">ACTIVE_STREAK</span>
            <Flame className="w-4 h-4 text-[#FBBF24]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-[#FBBF24] font-mono">
              {data.current_streak_days}D
            </span>
            <span className="text-xs font-mono text-[#8E9299]">CONTINUOUS</span>
          </div>
          <p className="text-[11px] font-mono text-[#FBBF24]/80 truncate">
            RECORD: {data.longest_streak_days}D • 3H/DAY CADENCE
          </p>
        </div>

        {/* Tasks Done */}
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-4 flex flex-col justify-between hover:border-[#4ADE80]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8E9299] text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">COMPLETED_TASKS</span>
            <Target className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-[#E0E0E0] font-mono">
              {data.completed_tasks_count}
            </span>
            <span className="text-xs font-mono text-[#8E9299]">/ {data.total_tasks_count}</span>
          </div>
          <div className="w-full bg-[#2A2D35] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#4ADE80] h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(
                  Math.round((data.completed_tasks_count / data.total_tasks_count) * 100),
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-4 flex flex-col justify-between hover:border-[#4ADE80]/40 transition-colors">
          <div className="flex items-center justify-between text-[#8E9299] text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider">INVESTED_TIME</span>
            <Clock className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-[#E0E0E0] font-mono">
              {Math.floor((data.total_study_minutes || 0) / 60)}h {(data.total_study_minutes || 0) % 60}m
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#8E9299] truncate">
            PACING: 21H / WEEK (3H/DAY)
          </p>
        </div>
      </div>

      {/* 2. ATTENTION REQUIRED BANNER (If Missed Tasks Exist) */}
      {missedCount > 0 && (
        <div className="bg-[#211515] border border-[#442222] rounded-lg p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_15px_rgba(248,113,113,0.1)]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded bg-[#331818] border border-[#552525] flex items-center justify-center text-[#F87171] shrink-0 font-mono">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-mono font-bold text-[#FCA5A5] uppercase tracking-wide">
                  ATTENTION // {missedCount} OVERDUE TASKS DETECTED
                </h3>
                <span className="text-[10px] font-mono bg-[#F87171] text-[#0F1115] px-1.5 py-0.2 font-bold rounded">
                  SCHEDULE_RISK
                </span>
              </div>
              <p className="text-xs text-[#FCA5A5]/80 mt-1 leading-relaxed">
                {(() => {
                  const missedDays = Array.from(new Set(data.attention.missed_tasks?.map((t) => t.day_number) || [])).sort((a, b) => a - b);
                  const daysStr = missedDays.length > 0 ? `Day ${missedDays.join(', ')}` : 'previous sessions';
                  return `Tasks from ${daysStr} are overdue. Non-destructive recovery generated to protect your 3-hour daily cadence.`;
                })()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenMissedModal}
              className="w-full md:w-auto bg-[#F87171] hover:bg-[#F87171]/90 text-[#0F1115] text-xs font-mono font-bold px-4 py-2 rounded flex items-center justify-center gap-2 transition-opacity"
            >
              <span>RECOVER_OVERDUE_WORK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. TODAY'S WORK CARD */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-5 lg:p-6 shadow-[0_0_15px_rgba(74,222,128,0.04)] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#2A2D35]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] tracking-wider uppercase mb-1">
              <span>TODAY_FOCUS // DAY {data.today.day_number}</span>
              <span className="text-[#8E9299]">•</span>
              <span className="text-[#8E9299]">{data.today.date}</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-[#E0E0E0] tracking-tight">
              {data.today.goal}
            </h2>
            <p className="text-xs text-[#8E9299] mt-1 font-mono">
              WORKLOAD: 3 HOURS (180 MIN) • 5 TARGETED LEARNING &amp; LAB TASKS
            </p>
          </div>

          <button
            onClick={onNavigateToToday}
            className="self-start lg:self-auto bg-[#4ADE80] text-[#0F1115] hover:bg-[#4ADE80]/90 font-mono font-bold text-xs px-5 py-2.5 rounded flex items-center gap-2 transition-opacity shadow-[0_0_12px_rgba(74,222,128,0.2)]"
          >
            <span>START_TODAY_TASKS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Hour Constraint Visualizer */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-[#15171C] rounded border border-[#2A2D35]">
            <div className="flex items-center justify-between text-xs text-[#8E9299] mb-1">
              <span className="font-mono text-[10px] uppercase">PLANNED_TIME</span>
              <span className="font-mono font-bold text-[#E0E0E0]">{data.today.planned_minutes}m</span>
            </div>
            <div className="text-[11px] font-mono text-[#8E9299]">TARGET: 180 MIN (3H)</div>
          </div>

          <div className="p-3 bg-[#15171C] rounded border border-[#2A2D35]">
            <div className="flex items-center justify-between text-xs text-[#8E9299] mb-1">
              <span className="font-mono text-[10px] uppercase">COMPLETED_TODAY</span>
              <span className="font-mono font-bold text-[#4ADE80]">{data.today.completed_minutes}m</span>
            </div>
            <div className="text-[11px] font-mono text-[#8E9299]">{data.today.progress_percentage}% SESSION COMPLETED</div>
          </div>

          <div className="p-3 bg-[#15171C] rounded border border-[#2A2D35]">
            <div className="flex items-center justify-between text-xs text-[#8E9299] mb-1">
              <span className="font-mono text-[10px] uppercase">REMAINING</span>
              <span className="font-mono font-bold text-[#4ADE80]">{data.today.remaining_minutes}m</span>
            </div>
            <div className="text-[11px] font-mono text-[#8E9299]">
              {data.today.is_over_target ? (
                <span className="text-[#FBBF24] font-semibold">
                  +{data.today.minutes_over_target}M OVER CADENCE
                </span>
              ) : (
                'BALANCED AT 3.0 HOURS'
              )}
            </div>
          </div>
        </div>

        {/* Task Mini-List Preview */}
        <div className="mt-4 space-y-2">
          {data.today.tasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2.5 rounded bg-[#15171C] border border-[#2A2D35] text-xs hover:border-[#4ADE80]/40 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    task.status === 'COMPLETED' ? 'bg-[#4ADE80]' : 'bg-[#8E9299]'
                  }`}
                />
                <span className="text-[10px] bg-[#2A2D35] text-[#8E9299] px-1.5 py-0.5 rounded font-mono">
                  {task.task_type}
                </span>
                <span className="text-[#E0E0E0] font-medium truncate">{task.title}</span>
              </div>
              <span className="text-[#8E9299] font-mono text-[11px] shrink-0">
                {task.estimated_minutes}m
              </span>
            </div>
          ))}
          {data.today.tasks.length > 3 && (
            <button
              onClick={onNavigateToToday}
              className="text-xs font-mono text-[#4ADE80] hover:underline flex items-center gap-1 pt-1"
            >
              <span>+ {data.today.tasks.length - 3} MORE TASKS IN TODAY SESSION</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. TWO COLUMN SECTION: DYNAMIC PRIORITIES & WEAK TOPIC RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Dynamic Priority Engine */}
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#2A2D35] pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#4ADE80]" />
              <h3 className="text-xs font-mono font-bold text-[#E0E0E0] uppercase tracking-wide">DYNAMIC PRIORITY TOPICS</h3>
            </div>
            <span className="text-[10px] text-[#4ADE80] font-mono">
              ALGO_SCORE (0-100)
            </span>
          </div>

          <p className="text-xs text-[#8E9299] leading-relaxed">
            Priorities dynamically factor in Topic Importance + Dependency Impact + Difficulty + Missed Count + Weakness Score + Deadline Pressure.
          </p>

          <div className="space-y-2 pt-1">
            {data.priority_topics.map((item) => (
              <button
                key={item.topic_id}
                onClick={() => onSelectPriorityTopic(item)}
                className="w-full flex items-center justify-between p-3 rounded bg-[#15171C] border border-[#2A2D35] hover:border-[#4ADE80]/50 text-left transition-all group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#E0E0E0] group-hover:text-[#4ADE80] transition-colors truncate">
                      {item.topic_name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        item.priority_level === 'CRITICAL'
                          ? 'bg-[#F87171] text-[#0F1115]'
                          : item.priority_level === 'HIGH'
                          ? 'bg-[#FBBF24] text-[#0F1115]'
                          : 'bg-[#2A2D35] text-[#4ADE80]'
                      }`}
                    >
                      {item.priority_level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#8E9299] font-mono">
                    <span>IMPACT: {item.dependency_impact}/100</span>
                    <span>MISSED: {item.missed_count}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold font-mono text-[#4ADE80]">
                    {item.calculated_score}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8E9299] group-hover:text-[#4ADE80] transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Weak Topic Radar */}
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[#2A2D35] pb-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#FBBF24]" />
              <h3 className="text-xs font-mono font-bold text-[#E0E0E0] uppercase tracking-wide">WEAK TOPIC RADAR</h3>
            </div>
            <span className="text-[10px] text-[#FBBF24] font-mono font-bold">
              {weakCount} NEEDS_ATTENTION
            </span>
          </div>

          <p className="text-xs text-[#8E9299] leading-relaxed">
            Identified by lower quiz accuracy (&lt;70%) and delayed completion rates. Targeted remedial sessions prevent compounding skill gaps.
          </p>

          <div className="space-y-2.5 pt-1">
            {data.weak_topics.map((weak) => (
              <div
                key={weak.topic_id}
                className="p-3 bg-[#15171C] border border-[#2A2D35] rounded space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#E0E0E0]">{weak.topic_name}</span>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-[#F87171]">ACCURACY: {weak.accuracy_rate}%</span>
                    <span className="text-[#8E9299]">•</span>
                    <span className="text-[#4ADE80]">DONE: {weak.completion_rate}%</span>
                  </div>
                </div>

                <p className="text-xs text-[#E0E0E0] leading-relaxed bg-[#1A1D24] p-2 rounded border border-[#2A2D35]">
                  {weak.recommendation}
                </p>

                <div className="flex items-center justify-between pt-1 font-mono">
                  <span className="text-[11px] text-[#8E9299]">
                    SESSION: +{weak.suggested_minutes}M
                  </span>
                  <button
                    onClick={() =>
                      onAddAiRecommendation({
                        title: `${weak.topic_name} Targeted Remedial Session`,
                        description: weak.recommendation,
                        estimated_minutes: weak.suggested_minutes,
                        priority_level: 'HIGH',
                        topic_name: weak.topic_name,
                      })
                    }
                    className="text-xs font-mono font-bold text-[#4ADE80] hover:underline flex items-center gap-1"
                  >
                    <span>+ ADD_TO_ROADMAP</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RECOMMENDATIONS ROW: CURATED VIDEO & AI MENTOR SUGGESTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Curated YouTube Video Card */}
        {primaryResource && (
          <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#F87171] text-xs font-mono font-bold uppercase tracking-wider">
                  <Video className="w-4 h-4" />
                  <span>CURATED_YOUTUBE // HIGH_YIELD</span>
                </div>
                <span className="text-[10px] bg-[#2A2D35] text-[#4ADE80] px-2 py-0.5 rounded font-mono font-bold">
                  {primaryResource.relevance_score}% MATCH
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#E0E0E0]">{primaryResource.title}</h4>
              <p className="text-xs text-[#8E9299] font-mono">
                CHANNEL: <span className="text-[#E0E0E0]">{primaryResource.channel}</span> • DURATION:{' '}
                <span className="text-[#E0E0E0]">{primaryResource.duration_minutes} MIN</span> • DIFFICULTY:{' '}
                <span className="text-[#E0E0E0]">{primaryResource.difficulty}</span>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center justify-between">
              <span className="text-xs font-mono text-[#8E9299]">HIGH-YIELD VISUAL ANIMATION</span>
              <button
                onClick={() => onSelectResource(primaryResource)}
                className="bg-[#2A2D35] hover:bg-[#343842] text-[#E0E0E0] border border-[#3E424D] text-xs font-mono font-bold px-4 py-2 rounded flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-[#4ADE80] text-[#4ADE80]" />
                <span>WATCH_LESSON</span>
              </button>
            </div>
          </div>
        )}

        {/* AI Learning Mentor Suggestion Card */}
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#4ADE80] text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#4ADE80]" />
                <span>AI_MENTOR // ADVISORY</span>
              </div>
              <span className="text-[10px] bg-[#2A2D35] text-[#4ADE80] px-2 py-0.5 rounded font-mono">
                GEMINI_LIVE
              </span>
            </div>

            <h4 className="text-sm font-bold text-[#E0E0E0]">
              Prerequisite Guard: Window Functions before CTE Optimization
            </h4>
            <p className="text-xs text-[#8E9299] leading-relaxed">
              &ldquo;Focus strictly on Window Functions today. Do not start complex multi-CTE query restructuring yet because window frame behavior is a hard dependency for your deduplication pipeline.&rdquo;
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center justify-between">
            <span className="text-xs font-mono text-[#8E9299]">30 MIN TARGETED REVIEW</span>
            <button
              onClick={() =>
                onAddAiRecommendation({
                  title: 'Window Functions Tie-Breakers Review — 30m',
                  description: 'Solve DENSE_RANK tie situations before starting CTEs.',
                  estimated_minutes: 30,
                  priority_level: 'HIGH',
                  topic_name: 'SQL Window Functions',
                })
              }
              className="bg-[#4ADE80] text-[#0F1115] hover:bg-[#4ADE80]/90 text-xs font-mono font-bold px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-opacity"
            >
              <span>+ ADD_TO_ROADMAP</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. CURRENT MILESTONE PROJECT STATUS */}
      {data.current_project && (
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2D35] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#2A2D35] text-[#4ADE80] flex items-center justify-center font-mono">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-[#E0E0E0] uppercase tracking-wide">
                  MONTH 2 MILESTONE PROJECT // {data.current_project.title}
                </h3>
                <p className="text-xs text-[#8E9299]">{data.current_project.description}</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('projects')}
              className="text-xs font-mono font-bold text-[#4ADE80] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>ARCHITECTURE & CHECKLIST</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8E9299]">PROJECT_PROGRESS</span>
              <span className="font-bold text-[#4ADE80]">
                {data.current_project.progress_percentage}%
              </span>
            </div>
            <div className="w-full bg-[#2A2D35] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#4ADE80] h-full rounded-full transition-all duration-700"
                style={{ width: `${data.current_project.progress_percentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. MONTHLY TIMELINE PROGRESS */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2D35] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
            <h3 className="text-xs font-mono font-bold text-[#E0E0E0] uppercase tracking-wide">9-MONTH CURRICULUM PIPELINE</h3>
          </div>
          <button
            onClick={() => onNavigateToTab('roadmap')}
            className="text-xs font-mono font-bold text-[#4ADE80] hover:underline flex items-center gap-1"
          >
            <span>EXPLORE 270-DAY ROADMAP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.monthly_progress.slice(0, 3).map((m) => (
            <div
              key={m.month_number}
              className="p-3 bg-[#15171C] rounded border border-[#2A2D35] space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#E0E0E0]">
                  Month {m.month_number}: {m.technology}
                </span>
                <span className="font-mono font-bold text-[#4ADE80]">{m.progress_percentage}%</span>
              </div>
              <div className="w-full bg-[#2A2D35] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#4ADE80] h-full rounded-full transition-all"
                  style={{ width: `${m.progress_percentage}%` }}
                />
              </div>
              <div className="text-[11px] text-[#8E9299] truncate font-mono">{m.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
