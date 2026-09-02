'use client';

import React from 'react';
import { X, Target, HelpCircle, AlertCircle, ShieldAlert, ChevronRight } from 'lucide-react';
import { PriorityBreakdown } from '@/lib/types';

interface PriorityExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  priority: PriorityBreakdown | null;
}

export const PriorityExplainModal: React.FC<PriorityExplainModalProps> = ({
  isOpen,
  onClose,
  priority,
}) => {
  if (!isOpen || !priority) return null;

  const factors = [
    {
      label: 'Topic Base Importance',
      weight: '25%',
      value: priority.importance,
      description: 'Foundational value for real-world enterprise analytics & production systems.',
      color: 'bg-blue-500',
    },
    {
      label: 'Dependency Impact',
      weight: '20%',
      value: priority.dependency_impact,
      description: 'Blocks upcoming project milestones (e.g. Month 2 Analytics DB Staging deduplication).',
      color: 'bg-indigo-500',
    },
    {
      label: 'Topic Difficulty',
      weight: '15%',
      value: priority.difficulty,
      description: 'Cognitive load and syntax complexity (window frame clauses, ties, partition keys).',
      color: 'bg-purple-500',
    },
    {
      label: 'Missed Task Penalty',
      weight: '20%',
      value: Math.min(priority.missed_count * 25, 100),
      description: `${priority.missed_count} incomplete or overdue tasks associated with this topic.`,
      color: 'bg-rose-500',
    },
    {
      label: 'Student Weakness Score',
      weight: '10%',
      value: priority.weakness_score,
      description: 'Calculated from quiz accuracy and practice exercise completion rates.',
      color: 'bg-amber-500',
    },
    {
      label: 'Deadline Pressure',
      weight: '10%',
      value: priority.deadline_pressure,
      description: 'Proximity to the current active learning week and scheduled project deadline.',
      color: 'bg-cyan-500',
    },
  ];

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2A2D35] flex items-center justify-between bg-[#15171C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#15171C] text-[#4ADE80] border border-[#2A2D35] flex items-center justify-center font-mono">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E0E0E0] flex items-center gap-2 font-mono">
                <span>DYNAMIC_PRIORITY_ENGINE</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getBadgeStyle(priority.priority_level)}`}>
                  {priority.priority_level} ({priority.calculated_score}/100)
                </span>
              </h3>
              <p className="text-[11px] font-mono text-[#8E9299]">{priority.topic_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E9299] hover:text-[#E0E0E0] p-1.5 rounded hover:bg-[#2A2D35] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-[#15171C] rounded border border-[#2A2D35] text-xs text-[#8E9299] font-mono leading-relaxed flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
            <p>
              Priority is recalculated in real time. Rather than static tags, the engine evaluates 6 distinct dimensions so high-yield topics with missed work automatically surface to the top of your dashboard.
            </p>
          </div>

          {/* Factor Breakdown */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E9299]">
              FACTOR_BREAKDOWN (0 - 100 SCALE)
            </h4>
            <div className="space-y-2.5">
              {factors.map((f, i) => (
                <div key={i} className="p-2.5 rounded bg-[#15171C] border border-[#2A2D35] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
                      <span>{f.label}</span>
                      <span className="text-[10px] text-[#8E9299]">({f.weight})</span>
                    </span>
                    <span className="font-bold text-[#4ADE80]">{f.value}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0F1115] rounded-full overflow-hidden border border-[#2A2D35]">
                    <div
                      className="h-full bg-[#4ADE80] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(f.value, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#8E9299]">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formula Summary Box */}
          <div className="p-3 bg-[#0F1115] border border-[#2A2D35] rounded text-xs space-y-1 font-mono text-[#8E9299]">
            <div className="text-[11px] text-[#4ADE80] font-semibold uppercase">NORMALIZATION_FORMULA</div>
            <div className="text-[#E0E0E0]">
              Score = (Imp × 0.25) + (Dep × 0.20) + (Diff × 0.15) + (Missed × 0.20) + (Weakness × 0.10) + (Deadline × 0.10)
            </div>
            <div className="text-[#4ADE80] font-bold pt-1">
              Final Computed: {priority.calculated_score}/100 → Level: {priority.priority_level}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#2A2D35] bg-[#15171C] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#2A2D35] hover:bg-[#343842] text-[#E0E0E0] border border-[#3E424D] px-4 py-1.5 rounded text-xs font-mono transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
