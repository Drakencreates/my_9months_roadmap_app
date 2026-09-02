'use client';

import React from 'react';
import { Rocket, CheckSquare, Square, FolderGit2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectsViewProps {
  projects: Project[];
  onToggleChecklist: (projectId: string, checklistId: string) => Promise<void>;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onToggleChecklist,
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4 shadow-[0_0_15px_rgba(74,222,128,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2A2D35] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider mb-1">
              <Rocket className="w-3.5 h-3.5" />
              <span>9 PRODUCTION-GRADE SIGNATURE PROJECTS</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#E0E0E0] tracking-tight">
              MILESTONE PROJECTS PORTFOLIO
            </h1>
            <p className="text-xs font-mono text-[#8E9299] mt-1">
              Every month concludes with an end-to-end engineered portfolio system proving production mastery.
            </p>
          </div>

          <div className="bg-[#15171C] px-3.5 py-2 rounded border border-[#2A2D35] text-xs text-[#4ADE80] font-mono shrink-0 font-bold">
            <span>PORTFOLIO_BENCHMARKS</span>
          </div>
        </div>
      </div>

      {/* Projects Cards List */}
      <div className="space-y-5">
        {projects.map((proj) => {
          const isComplete = proj.status === 'COMPLETED';
          const isInProgress = proj.status === 'IN_PROGRESS';

          return (
            <div
              key={proj.id}
              className={`p-6 rounded-lg border transition-all space-y-4 ${
                isInProgress
                  ? 'bg-[#1A1D24] border-[#4ADE80]/50 shadow-[0_0_15px_rgba(74,222,128,0.06)]'
                  : 'bg-[#1A1D24] border-[#2A2D35]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2D35] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8E9299] mb-1">
                    <span className="bg-[#2A2D35] text-[#4ADE80] px-2 py-0.5 rounded font-bold uppercase">
                      MONTH {proj.month_number}
                    </span>
                    <span>•</span>
                    <span
                      className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded border font-mono ${
                        isComplete
                          ? 'bg-[#152A1C] text-[#4ADE80] border-[#1A5528]'
                          : isInProgress
                          ? 'bg-[#15171C] text-[#4ADE80] border-[#4ADE80]/40'
                          : 'bg-[#2A2D35] text-[#8E9299] border-[#3E424D]'
                      }`}
                    >
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-base lg:text-lg font-bold text-[#E0E0E0]">{proj.title}</h2>
                  <p className="text-xs text-[#8E9299] mt-1 leading-relaxed font-mono">{proj.description}</p>
                </div>

                <div className="text-left sm:text-right shrink-0 font-mono">
                  <div className="text-xl font-bold text-[#4ADE80]">
                    {proj.progress_percentage}%
                  </div>
                  <div className="text-[11px] text-[#8E9299]">
                    {proj.checklist.filter((c) => c.completed).length} / {proj.checklist.length} MILESTONES
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#15171C] rounded-full h-1.5 overflow-hidden border border-[#2A2D35]">
                <div
                  className="bg-[#4ADE80] h-full rounded-full transition-all duration-700"
                  style={{ width: `${proj.progress_percentage}%` }}
                />
              </div>

              {/* Architecture Diagram */}
              {proj.architecture_diagram && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono text-[#8E9299] font-bold">
                    ARCHITECTURE_BLUEPRINT
                  </div>
                  <div className="p-3 bg-[#0F1115] rounded border border-[#2A2D35] font-mono text-xs text-[#4ADE80] overflow-x-auto whitespace-pre">
                    {proj.architecture_diagram}
                  </div>
                </div>
              )}

              {/* Interactive Checklist */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8E9299]">
                  DELIVERABLE_CHECKLIST
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {proj.checklist.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onToggleChecklist(proj.id, item.id)}
                      className="flex items-center gap-2.5 p-2.5 rounded bg-[#15171C] border border-[#2A2D35] hover:border-[#4ADE80]/40 text-left transition-all text-xs font-mono group"
                    >
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-[#4ADE80] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#8E9299] group-hover:text-[#E0E0E0] shrink-0" />
                      )}
                      <span
                        className={`font-medium ${
                          item.completed ? 'line-through text-[#8E9299]' : 'text-[#E0E0E0]'
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
