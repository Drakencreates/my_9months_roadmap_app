'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Video,
  Code2,
  BookOpen,
  FolderGit2,
  Calendar,
  Check
} from 'lucide-react';
import { DashboardData, Task } from '@/lib/types';

interface TodayViewProps {
  data: DashboardData;
  onOpenCompleteModal: (task: Task) => void;
  onQuickCompleteTask: (taskId: string) => Promise<void>;
  onRescheduleTask: (taskId: string) => Promise<void>;
  onWatchVideo: (task: Task) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  data,
  onOpenCompleteModal,
  onQuickCompleteTask,
  onRescheduleTask,
  onWatchVideo,
}) => {
  const { today } = data;
  const [activeTimerTask, setActiveTimerTask] = useState<Task | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Timer tick
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          try {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTaskTimer = (task: Task) => {
    setActiveTimerTask(task);
    setTimerSeconds(task.estimated_minutes * 60);
    setIsTimerRunning(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'LEARN':
        return BookOpen;
      case 'PRACTICE':
      case 'CODE':
        return Code2;
      case 'WATCH_VIDEO':
        return Video;
      case 'PROJECT':
        return FolderGit2;
      default:
        return BookOpen;
    }
  };

  const allCompleted = today.tasks.length > 0 && today.tasks.every((t) => t.status === 'COMPLETED');

  useEffect(() => {
    if (allCompleted) {
      try {
        confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      } catch {}
    }
  }, [allCompleted]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      {/* 1. HEADER & DAILY GOAL */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4 shadow-[0_0_15px_rgba(74,222,128,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2A2D35] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>DAY {today.day_number} OF 270</span>
              <span className="text-[#8E9299]">•</span>
              <span className="text-[#8E9299]">{today.date}</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#E0E0E0] tracking-tight">
              GOAL: {today.goal}
            </h1>
            <p className="text-xs text-[#8E9299] mt-1 font-mono">{today.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-[#15171C] border border-[#2A2D35] px-3.5 py-2 rounded text-right font-mono">
              <div className="text-[10px] text-[#8E9299] uppercase">DAILY CADENCE</div>
              <div className="text-sm font-bold text-[#4ADE80]">3H / 180 MIN</div>
            </div>
          </div>
        </div>

        {/* 3-Hour Constraint Capacity Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#8E9299] uppercase">3-Hour Budget Allocation</span>
            <span className="text-[#4ADE80] font-bold">
              {today.completed_minutes}m of {today.planned_minutes}m completed
            </span>
          </div>

          <div className="w-full bg-[#15171C] rounded-full h-2 overflow-hidden border border-[#2A2D35] flex">
            <div
              className="bg-[#4ADE80] h-full transition-all duration-500"
              style={{
                width: `${today.planned_minutes > 0 ? (today.completed_minutes / today.planned_minutes) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono">
            <div className="flex items-center gap-3 text-[#8E9299]">
              <span>PLANNED: <strong className="text-[#E0E0E0]">{today.planned_minutes}m</strong></span>
              <span>DONE: <strong className="text-[#4ADE80]">{today.completed_minutes}m</strong></span>
              <span>REMAINING: <strong className="text-[#4ADE80]">{today.remaining_minutes}m</strong></span>
            </div>

            {today.is_over_target ? (
              <div className="flex items-center gap-1.5 text-[#FBBF24] bg-[#2A2415] border border-[#554415] px-2 py-0.5 rounded text-[11px] font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Workload is {today.minutes_over_target}m above 3-hour target.</span>
              </div>
            ) : (
              <div className="text-[#4ADE80] text-xs flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Paced within 3-hour constraint</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE STUDY TIMER (If Started) */}
      {activeTimerTask && (
        <div className="bg-[#15171C] border border-[#4ADE80]/50 rounded-lg p-5 shadow-[0_0_15px_rgba(74,222,128,0.1)] flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded bg-[#2A2D35] border border-[#3E424D] flex items-center justify-center text-[#4ADE80] font-mono text-lg font-bold">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-[#4ADE80] font-bold tracking-wider">
                ACTIVE_STUDY_SESSION
              </div>
              <h3 className="text-sm font-bold text-[#E0E0E0]">{activeTimerTask.title}</h3>
              <p className="text-xs text-[#8E9299]">{activeTimerTask.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-3xl font-mono font-bold text-[#4ADE80] tracking-wider">
              {formatTime(timerSeconds)}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`w-9 h-9 rounded flex items-center justify-center font-mono transition-all ${
                  isTimerRunning ? 'bg-[#FBBF24] text-[#0F1115]' : 'bg-[#4ADE80] text-[#0F1115]'
                }`}
                title={isTimerRunning ? 'Pause' : 'Start'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={() => setTimerSeconds(activeTimerTask.estimated_minutes * 60)}
                className="w-9 h-9 rounded bg-[#2A2D35] hover:bg-[#343842] flex items-center justify-center text-[#E0E0E0] border border-[#3E424D]"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  onOpenCompleteModal(activeTimerTask);
                }}
                className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0F1115] text-xs font-mono font-bold px-3.5 py-2 rounded flex items-center gap-1.5 transition-opacity"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>MARK_DONE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TODAY'S 5 STRUCTURED TASKS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8E9299]">
            CURRICULUM_SCHEDULE // {today.tasks.length} TASKS
          </h2>
          <span className="text-[11px] font-mono text-[#8E9299]">CLICK TO LOG TIME / RECOVER</span>
        </div>

        {today.tasks.map((task, index) => {
          const Icon = getTaskIcon(task.task_type);
          const isDone = task.status === 'COMPLETED';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDone
                  ? 'bg-[#15171C] border-[#2A2D35] opacity-75'
                  : 'bg-[#1A1D24] border-[#2A2D35] hover:border-[#4ADE80]/40'
              }`}
            >
              {/* Task Left Info */}
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  onClick={() => onQuickCompleteTask(task.id)}
                  className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all mt-0.5 shrink-0 ${
                    isDone
                      ? 'bg-[#4ADE80] border-[#4ADE80] text-[#0F1115]'
                      : 'border-[#2A2D35] hover:border-[#4ADE80] text-transparent'
                  }`}
                  title={isDone ? 'Task Completed' : 'Quick mark done'}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#8E9299]">
                      STEP_{index + 1}
                    </span>
                    <span className="text-[10px] bg-[#2A2D35] text-[#8E9299] px-2 py-0.5 rounded font-mono font-semibold">
                      {task.task_type}
                    </span>
                    <span className="text-xs text-[#4ADE80] font-mono flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-[#4ADE80]" />
                      {task.estimated_minutes} MIN
                    </span>
                    {task.priority_level === 'HIGH' && (
                      <span className="text-[10px] bg-[#FBBF24] text-[#0F1115] px-1.5 py-0.2 rounded font-mono font-bold">
                        HIGH_PRIORITY
                      </span>
                    )}
                    {task.depends_on_task_ids && task.depends_on_task_ids.length > 0 && (
                      <span className="text-[10px] text-[#4ADE80] bg-[#2A2D35] px-1.5 py-0.2 rounded font-mono">
                        HAS_PREREQUISITE
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-sm font-bold ${
                      isDone ? 'line-through text-[#8E9299]' : 'text-[#E0E0E0]'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-[#8E9299] leading-relaxed">{task.description}</p>
                </div>
              </div>

              {/* Task Right Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {task.task_type === 'WATCH_VIDEO' && (
                  <button
                    onClick={() => onWatchVideo(task)}
                    className="bg-[#2A2D35] hover:bg-[#343842] text-[#E0E0E0] border border-[#3E424D] text-xs font-mono font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-[#4ADE80]" />
                    <span>WATCH_LESSON</span>
                  </button>
                )}

                {!isDone ? (
                  <>
                    <button
                      onClick={() => startTaskTimer(task)}
                      className="bg-[#2A2D35] hover:bg-[#343842] text-[#E0E0E0] text-xs font-mono font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors border border-[#3E424D]"
                    >
                      <Play className="w-3.5 h-3.5 text-[#4ADE80] fill-[#4ADE80]" />
                      <span>TIMER</span>
                    </button>

                    <button
                      onClick={() => onOpenCompleteModal(task)}
                      className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0F1115] text-xs font-mono font-bold px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-opacity"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>COMPLETE</span>
                    </button>

                    <button
                      onClick={() => onRescheduleTask(task.id)}
                      className="text-xs font-mono text-[#8E9299] hover:text-[#E0E0E0] px-2 py-1.5 rounded hover:bg-[#2A2D35]"
                      title="Reschedule to tomorrow"
                    >
                      RESCHEDULE
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#4ADE80] bg-[#15171C] border border-[#2A2D35] px-3 py-1.5 rounded">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DONE</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. COMPLETED ALL TASKS CARD */}
      {allCompleted && (
        <div className="bg-[#1A1D24] border border-[#4ADE80]/50 rounded-lg p-6 text-center space-y-2">
          <Sparkles className="w-10 h-10 text-[#4ADE80] mx-auto animate-bounce" />
          <h3 className="text-base font-mono font-bold text-[#E0E0E0] uppercase tracking-wide">
            DAY {today.day_number} 100% COMPLETED
          </h3>
          <p className="text-xs font-mono text-[#8E9299] max-w-md mx-auto">
            You successfully completed your 3-hour learning target for SQL Window Functions. Your streak advances to 13 days!
          </p>
        </div>
      )}
    </div>
  );
};
