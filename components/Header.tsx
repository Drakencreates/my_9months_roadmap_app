'use client';

import React from 'react';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { DashboardData } from '@/lib/types';

interface HeaderProps {
  data: DashboardData | null;
  onOpenMissedModal: () => void;
  onOpenAi: () => void;
}

export const Header: React.FC<HeaderProps> = ({ data, onOpenMissedModal, onOpenAi }) => {
  if (!data) return null;

  const missedCount = data.attention.missed_tasks_count;

  return (
    <header className="sticky top-0 z-30 bg-[#15171C] border-b border-[#2A2D35] px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Active Day & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1A1D24] border border-[#2A2D35] px-3 py-1.5 rounded text-[#4ADE80] font-mono text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
            <span>DAY {data.current_day_number}/{data.total_days}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#4ADE80]">v1.0.4-stable</span>
              <span className="text-[#8E9299] text-xs">•</span>
              <span className="text-[10px] font-mono uppercase bg-[#2A2D35] text-[#8E9299] px-1.5 py-0.5 rounded">
                3H/DAY CADENCE
              </span>
            </div>
            <h1 className="text-sm lg:text-base font-mono font-medium tracking-tight text-[#E0E0E0] uppercase flex items-center gap-2">
              LEARNING_OS // {data.today.title}
            </h1>
          </div>
        </div>

        {/* Right: Metrics & Attention Alert Trigger */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-[#1A1D24] border border-[#2A2D35] px-2.5 py-1.5 rounded text-xs font-mono text-[#FBBF24]" title="Active Streak">
            <Flame className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>{data.current_streak_days}D STREAK</span>
          </div>

          {/* Today Study Pace */}
          <div className="flex items-center gap-1.5 bg-[#1A1D24] border border-[#2A2D35] px-2.5 py-1.5 rounded text-xs font-mono text-[#E0E0E0]" title="Today's Study Pace">
            <Clock className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>{data.today.completed_minutes}M / {data.today.planned_minutes}M</span>
          </div>

          {/* Overall Progress Mini Bar */}
          <div className="hidden sm:flex items-center gap-2 bg-[#1A1D24] border border-[#2A2D35] px-3 py-1.5 rounded text-xs font-mono text-[#E0E0E0]">
            <span className="text-[10px] text-[#8E9299]">PROGRESS:</span>
            <div className="w-20 bg-[#2A2D35] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#4ADE80] h-full rounded-full transition-all"
                style={{ width: `${data.overall_progress_percentage}%` }}
              />
            </div>
            <span className="text-[#4ADE80] font-bold">{data.overall_progress_percentage}%</span>
          </div>

          {/* Attention / Missed Task Trigger Button */}
          {missedCount > 0 ? (
            <button
              onClick={onOpenMissedModal}
              className="flex items-center gap-1.5 bg-[#211515] hover:bg-[#2e1a1a] border border-[#442222] text-[#FCA5A5] px-2.5 py-1.5 rounded text-xs font-mono font-semibold transition-all shadow-[0_0_10px_rgba(248,113,113,0.15)]"
              title="Click to view and recover missed tasks"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#F87171] animate-pulse" />
              <span>{missedCount} OVERDUE</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-xs font-mono text-[#4ADE80] bg-[#1A1D24] border border-[#2A2D35] px-2.5 py-1.5 rounded">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SYS_OK</span>
            </div>
          )}

          {/* Ask AI quick button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 bg-[#4ADE80] text-[#0F1115] hover:bg-[#4ADE80]/90 font-mono font-bold px-3 py-1.5 rounded text-xs transition-opacity shadow-[0_0_12px_rgba(74,222,128,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI_MENTOR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
