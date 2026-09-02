'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  FolderGit2, 
  BookOpen,
  MapPin
} from 'lucide-react';
import { Month, Project } from '@/lib/types';

interface RoadmapViewProps {
  months: Month[];
  projects: Project[];
  currentDayNumber: number;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  months,
  projects,
  currentDayNumber,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(2);

  const month = months.find((m) => m.month_number === selectedMonth) || months[0];
  const project = projects.find((p) => p.month_number === selectedMonth);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_15px_rgba(74,222,128,0.04)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>9-MONTH CURRICULUM ARCHITECTURE</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-[#E0E0E0] tracking-tight">
            270-DAY TECHNICAL MASTERY PATHWAY
          </h1>
          <p className="text-xs font-mono text-[#8E9299] mt-1">
            Cadence: 3h/day | SQL → Advanced DBs → Python DE → Quality/Stats → Time-Series/ML → AI/LLMs → Airflow → Go/React → DevOps
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#15171C] px-3.5 py-2 rounded border border-[#2A2D35] shrink-0 font-mono">
          <MapPin className="w-4 h-4 text-[#4ADE80]" />
          <div className="text-xs">
            <span className="text-[#8E9299]">CURRENT_POSITION: </span>
            <strong className="text-[#4ADE80]">MONTH 2 (DAY {currentDayNumber})</strong>
          </div>
        </div>
      </div>

      {/* Month Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {months.map((m) => {
          const isSelected = m.month_number === selectedMonth;
          const isCurrent = m.month_number === 2;
          const isPast = m.month_number === 1;

          return (
            <button
              key={m.id}
              onClick={() => setSelectedMonth(m.month_number)}
              className={`px-3.5 py-2 rounded text-xs font-mono font-bold transition-all whitespace-nowrap border shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#4ADE80] border-[#4ADE80] text-[#0F1115] shadow-[0_0_10px_rgba(74,222,128,0.2)]'
                  : 'bg-[#1A1D24] border-[#2A2D35] text-[#8E9299] hover:text-[#E0E0E0] hover:border-[#3E424D]'
              }`}
            >
              <span>M{m.month_number}: {m.technology.split(' ')[0]}</span>
              {isPast && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" title="Completed" />
              )}
              {isCurrent && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" title="Active" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Month Detail Card */}
      {month && (
        <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2D35] pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#8E9299] mb-1">
                <span className="bg-[#2A2D35] text-[#4ADE80] px-2 py-0.5 rounded font-bold uppercase">
                  {month.technology}
                </span>
                <span>•</span>
                <span>DAYS {((month.month_number - 1) * 30) + 1} – {month.month_number * 30}</span>
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-[#E0E0E0]">
                MONTH {month.month_number}: {month.title}
              </h2>
              <p className="text-xs text-[#8E9299] mt-1 max-w-2xl leading-relaxed">
                {month.description}
              </p>
            </div>

            <div className="bg-[#15171C] border border-[#2A2D35] p-4 rounded text-left md:text-right shrink-0">
              <div className="text-[10px] text-[#8E9299] uppercase font-mono">MONTHLY_GOAL</div>
              <div className="text-xs font-mono text-[#E0E0E0] mt-0.5 max-w-xs">
                {month.goal}
              </div>
            </div>
          </div>

          {/* Month Project Showcase */}
          {project && (
            <div className="bg-[#15171C] border border-[#2A2D35] rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#2A2D35] text-[#4ADE80] flex items-center justify-center">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#E0E0E0]">
                      SIGNATURE_PROJECT // {project.title}
                    </h3>
                    <p className="text-xs text-[#8E9299]">{project.description}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#4ADE80]">
                  {project.progress_percentage}% DONE
                </span>
              </div>

              {project.architecture_diagram && (
                <div className="p-3 bg-[#0F1115] rounded border border-[#2A2D35] font-mono text-xs text-[#4ADE80] overflow-x-auto whitespace-pre">
                  {project.architecture_diagram}
                </div>
              )}
            </div>
          )}

          {/* Weeks Breakdown for Month */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8E9299]">
              WEEKLY_CURRICULUM_PROGRESSION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((weekNum) => {
                const globalWeek = (month.month_number - 1) * 4 + weekNum;
                const isCurrentWeek = globalWeek === 7;

                return (
                  <div
                    key={weekNum}
                    className={`p-4 rounded-lg border transition-all ${
                      isCurrentWeek
                        ? 'bg-[#15171C] border-[#4ADE80]/50 shadow-[0_0_10px_rgba(74,222,128,0.05)]'
                        : 'bg-[#15171C] border-[#2A2D35]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="font-bold text-[#8E9299]">
                        WEEK_{globalWeek} (M{month.month_number} • PART_{weekNum})
                      </span>
                      {isCurrentWeek && (
                        <span className="text-[10px] bg-[#4ADE80] text-[#0F1115] px-1.5 py-0.5 rounded font-bold uppercase">
                          ACTIVE_WEEK
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-[#E0E0E0]">
                      {weekNum === 1 && 'Foundational Syntax & Execution Model'}
                      {weekNum === 2 && 'Optimization, Benchmarks & Deep Dive'}
                      {weekNum === 3 && 'Complex Problem Solving & Pipeline Integration'}
                      {weekNum === 4 && 'End-to-End Milestone Project & Code Review'}
                    </h4>
                    <p className="text-xs text-[#8E9299] mt-1 leading-relaxed font-mono">
                      21 hours of dedicated study (3 hours × 7 days) covering theoretical grounding, hands-on SQL/code exercises, and architecture integration.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
