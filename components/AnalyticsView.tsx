'use client';

import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  History,
  TrendingUp,
  Brain
} from 'lucide-react';
import { AnalyticsData } from '@/lib/types';

interface AnalyticsViewProps {
  data: AnalyticsData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4 shadow-[0_0_15px_rgba(74,222,128,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2A2D35] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>LEARNING TELEMETRY & QUANTITATIVE HEALTH</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#E0E0E0] tracking-tight">
              PROGRESS & MASTERY ANALYTICS
            </h1>
            <p className="text-xs font-mono text-[#8E9299] mt-1">
              Real-time measurement of study pacing, topic retention, technology progress, and append-only audit trail.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#15171C] px-3.5 py-2 rounded border border-[#2A2D35] text-right font-mono">
              <div className="text-[10px] text-[#8E9299] uppercase">TOTAL_HOURS</div>
              <div className="text-sm font-bold text-[#E0E0E0]">
                {data.study_hours_formatted}
              </div>
            </div>
            <div className="bg-[#15171C] px-3.5 py-2 rounded border border-[#2A2D35] text-right font-mono">
              <div className="text-[10px] text-[#8E9299] uppercase">STREAK</div>
              <div className="text-sm font-bold text-[#4ADE80]">
                {data.current_streak} DAYS
              </div>
            </div>
          </div>
        </div>

        {/* High-level Task Status Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3 bg-[#15171C] rounded border border-[#2A2D35]">
            <div className="text-[10px] text-[#8E9299] uppercase">COMPLETED</div>
            <div className="text-lg font-bold text-[#4ADE80] mt-0.5">
              {data.tasks_completed}
            </div>
          </div>
          <div className="p-3 bg-[#15171C] rounded border border-[#2A2D35]">
            <div className="text-[10px] text-[#8E9299] uppercase">MISSED_PENDING</div>
            <div className="text-lg font-bold text-[#EF4444] mt-0.5">
              {data.tasks_missed}
            </div>
          </div>
          <div className="p-3 bg-[#15171C] rounded border border-[#2A2D35]">
            <div className="text-[10px] text-[#8E9299] uppercase">RESCHEDULED</div>
            <div className="text-lg font-bold text-[#E0E0E0] mt-0.5">
              {data.tasks_rescheduled}
            </div>
          </div>
          <div className="p-3 bg-[#15171C] rounded border border-[#2A2D35]">
            <div className="text-[10px] text-[#8E9299] uppercase">SKIPPED (AUDITED)</div>
            <div className="text-lg font-bold text-[#8E9299] mt-0.5">
              {data.tasks_skipped}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TECHNOLOGY PROGRESS BARS */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2D35] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
            <h3 className="text-sm font-mono font-bold text-[#E0E0E0] uppercase">TECHNOLOGY_PROGRESS_BREAKDOWN</h3>
          </div>
          <span className="text-xs text-[#8E9299] font-mono">RELATIVE COMPLETION</span>
        </div>

        <div className="space-y-4 pt-1">
          {data.tech_progress.map((tp) => (
            <div key={tp.technology} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#E0E0E0]">{tp.technology}</span>
                <span className="text-[#8E9299]">
                  <strong className="text-[#4ADE80]">{tp.percentage}%</strong> ({tp.completed}/{tp.total} tasks)
                </span>
              </div>
              <div className="w-full bg-[#15171C] rounded-full h-2 overflow-hidden border border-[#2A2D35]">
                <div
                  className="h-full rounded-full transition-all duration-700 bg-[#4ADE80]"
                  style={{ width: `${tp.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TOPIC DISTRIBUTION & STUDY LOG */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Mastery Distribution */}
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#2A2D35] pb-3">
            <Brain className="w-4 h-4 text-[#4ADE80]" />
            <h3 className="text-sm font-mono font-bold text-[#E0E0E0] uppercase">TOPIC_MASTERY_HEALTH</h3>
          </div>

          <div className="space-y-3 font-mono">
            <div className="flex items-center justify-between p-2.5 rounded bg-[#15171C] border border-[#2A2D35] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                <span className="text-[#E0E0E0]">STRONG (&gt; 80%)</span>
              </div>
              <span className="font-bold text-[#4ADE80]">
                {data.topic_distribution.strong} TOPICS
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#15171C] border border-[#2A2D35] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                <span className="text-[#E0E0E0]">AVERAGE (65-80%)</span>
              </div>
              <span className="font-bold text-[#FBBF24]">
                {data.topic_distribution.average} TOPICS
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#15171C] border border-[#2A2D35] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-[#E0E0E0]">WEAK (&lt; 65%)</span>
              </div>
              <span className="font-bold text-[#EF4444]">
                {data.topic_distribution.weak} TOPICS
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#15171C] border border-[#2A2D35] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8E9299]" />
                <span className="text-[#8E9299]">UPCOMING IN ROADMAP</span>
              </div>
              <span className="font-bold text-[#8E9299]">
                {data.topic_distribution.not_started} TOPICS
              </span>
            </div>
          </div>
        </div>

        {/* Append-Only Historical Activity Audit */}
        <div className="lg:col-span-2 bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2D35] pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#4ADE80]" />
              <h3 className="text-sm font-mono font-bold text-[#E0E0E0] uppercase">LEARNING_AUDIT_HISTORY</h3>
            </div>
            <span className="text-[10px] font-mono text-[#8E9299]">APPEND-ONLY EVENT STREAM</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {data.recent_activity.map((act) => (
              <div
                key={act.id}
                className="p-2.5 rounded bg-[#15171C] border border-[#2A2D35] flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                      act.status === 'COMPLETED'
                        ? 'bg-[#152A1C] text-[#4ADE80] border-[#1A5528]'
                        : act.status === 'RESCHEDULED'
                        ? 'bg-[#15171C] text-[#E0E0E0] border-[#2A2D35]'
                        : act.status === 'MISSED'
                        ? 'bg-[#2A1517] text-[#EF4444] border-[#551A1A]'
                        : 'bg-[#2A2D35] text-[#8E9299] border-[#3E424D]'
                    }`}
                  >
                    {act.status}
                  </span>
                  <span className="text-[#E0E0E0] truncate">
                    {act.notes || 'Status logged'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#8E9299] shrink-0">
                  {(act.actual_minutes ?? 0) > 0 && <span className="text-[#4ADE80]">{act.actual_minutes}m</span>}
                  <span>{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
