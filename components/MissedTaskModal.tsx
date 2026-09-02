'use client';

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  SkipForward, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { RecoveryPlan, Task } from '@/lib/types';

interface MissedTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  missedTasks: Task[];
  onCompleteTask: (taskId: string) => Promise<void>;
  onRescheduleTask: (taskId: string) => Promise<void>;
  onSkipTask: (taskId: string) => Promise<void>;
  onRefresh: () => void;
}

export const MissedTaskModal: React.FC<MissedTaskModalProps> = ({
  isOpen,
  onClose,
  missedTasks,
  onCompleteTask,
  onRescheduleTask,
  onSkipTask,
  onRefresh,
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<boolean>(false);
  const [applyingPlan, setApplyingPlan] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGeneratePlan = async (dayNumber: number) => {
    setLoadingPlan(true);
    try {
      const res = await fetch('/api/missed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_plan', day_number: dayNumber }),
      });
      const data = await res.json();
      if (data.plan) {
        setRecoveryPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleApplyPlan = async () => {
    if (!recoveryPlan) return;
    setApplyingPlan(true);
    try {
      const res = await fetch('/api/missed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply_plan', plan: recoveryPlan }),
      });
      const data = await res.json();
      if (data.success) {
        setRecoveryPlan(null);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingPlan(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2A2D35] flex items-center justify-between bg-[#15171C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#2A1517] border border-[#551A1A] flex items-center justify-center text-[#EF4444]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-bold text-[#E0E0E0] flex items-center gap-2 font-mono">
                <span>MISSED_TASK_ATTENTION_&_RECOVERY</span>
                <span className="text-[10px] bg-[#2A1517] text-[#EF4444] px-2 py-0.5 rounded border border-[#551A1A]">
                  {missedTasks.length} OVERDUE
                </span>
              </h3>
              <p className="text-xs font-mono text-[#8E9299]">
                Automated detection: Due date &lt; today with uncompleted status. History is fully preserved.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E9299] hover:text-[#E0E0E0] p-1.5 rounded hover:bg-[#2A2D35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Recovery Plan Banner */}
          <div className="bg-[#15171C] border border-[#2A2D35] rounded-lg p-4 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#E0E0E0] flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-4 h-4 text-[#4ADE80]" />
                  <span>SMART_RECOVERY_ENGINE</span>
                </h4>
                <p className="text-xs text-[#8E9299] mt-1">
                  Avoids simply shifting the entire 9-month schedule. Distributes workload while keeping critical project dependencies on track.
                </p>
              </div>
              <button
                onClick={() => handleGeneratePlan(45)}
                disabled={loadingPlan}
                className="self-start sm:self-auto bg-[#2A2D35] hover:bg-[#343842] text-[#4ADE80] border border-[#3E424D] px-3.5 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0"
              >
                {loadingPlan ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>GENERATE_RECOVERY_PLAN</span>
              </button>
            </div>

            {/* Render Active Recovery Plan if generated */}
            {recoveryPlan && (
              <div className="mt-4 p-4 bg-[#0F1115] border border-[#2A2D35] rounded space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-[#2A2D35] pb-2 text-xs">
                  <div className="text-[#E0E0E0] font-bold">
                    PLAN FOR DAY {recoveryPlan.missed_day_number} (WORKLOAD: {recoveryPlan.original_workload_minutes}m)
                  </div>
                  <div className="text-[11px] text-[#4ADE80]">
                    TOMORROW_CAPACITY: {recoveryPlan.tomorrow_workload_minutes}m
                  </div>
                </div>

                <div className="space-y-2">
                  {recoveryPlan.recommended_actions.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-2 rounded bg-[#15171C] border border-[#2A2D35] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {act.action === 'COMPLETE_CRITICAL' && (
                          <span className="text-[10px] bg-[#2A1517] text-[#EF4444] px-1.5 py-0.5 rounded border border-[#551A1A]">
                            CRITICAL (Today)
                          </span>
                        )}
                        {act.action === 'COMPLETE_DEPENDENCY' && (
                          <span className="text-[10px] bg-[#2A2315] text-[#FBBF24] px-1.5 py-0.5 rounded border border-[#55401A]">
                            DEPENDENCY
                          </span>
                        )}
                        {act.action === 'RESCHEDULE' && (
                          <span className="text-[10px] bg-[#15171C] text-[#E0E0E0] px-1.5 py-0.5 rounded border border-[#2A2D35]">
                            RESCHEDULE (+1 Day)
                          </span>
                        )}
                        {act.action === 'MOVE_OPTIONAL' && (
                          <span className="text-[10px] bg-[#2A2D35] text-[#8E9299] px-1.5 py-0.5 rounded border border-[#3E424D]">
                            OPTIONAL REVIEW
                          </span>
                        )}
                        <span className="text-[#E0E0E0]">{act.title}</span>
                      </div>
                      <span className="text-[#8E9299]">{act.duration_minutes}m</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleApplyPlan}
                    disabled={applyingPlan}
                    className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0F1115] text-xs font-mono font-bold px-4 py-2 rounded flex items-center gap-2 transition-opacity disabled:opacity-50"
                  >
                    {applyingPlan ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>APPLY_RECOVERY_PLAN</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Missed Task Cards */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E9299]">
              UNFINISHED_TASKS_PENDING_ACTION
            </h4>

            {missedTasks.length === 0 ? (
              <div className="p-8 text-center bg-[#15171C] rounded border border-[#2A2D35] text-[#8E9299]">
                <CheckCircle2 className="w-8 h-8 text-[#4ADE80] mx-auto mb-2" />
                <p className="font-semibold text-[#E0E0E0]">No overdue missed tasks!</p>
                <p className="text-xs text-[#8E9299] mt-1">You are completely up-to-date with your 3-hour learning plan.</p>
              </div>
            ) : (
              missedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-[#15171C] border border-[#2A2D35] hover:border-[#EF4444]/40 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#EF4444] bg-[#2A1517] px-2 py-0.5 rounded border border-[#551A1A]">
                        DAY {task.day_number}
                      </span>
                      <span className="text-[10px] bg-[#2A2D35] text-[#8E9299] px-2 py-0.5 rounded">
                        {task.task_type}
                      </span>
                      {task.priority_level === 'CRITICAL' && (
                        <span className="text-[10px] bg-[#EF4444] text-[#0F1115] font-bold px-1.5 py-0.5 rounded">
                          CRITICAL
                        </span>
                      )}
                      <span className="text-xs text-[#8E9299] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#8E9299]" />
                        {task.estimated_minutes} min
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-[#E0E0E0]">{task.title}</h5>
                    <p className="text-xs text-[#8E9299]">{task.description}</p>
                    <div className="text-[11px] text-[#8E9299] flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>Original Due Date: {task.due_date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={async () => {
                        setLoadingId(task.id);
                        await onCompleteTask(task.id);
                        setLoadingId(null);
                      }}
                      disabled={loadingId === task.id}
                      className="bg-[#152A1C] hover:bg-[#1C3825] text-[#4ADE80] border border-[#1A5528] text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>

                    <button
                      onClick={async () => {
                        setLoadingId(task.id);
                        await onRescheduleTask(task.id);
                        setLoadingId(null);
                      }}
                      disabled={loadingId === task.id}
                      className="bg-[#2A2D35] hover:bg-[#343842] text-[#E0E0E0] border border-[#3E424D] text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      onClick={async () => {
                        setLoadingId(task.id);
                        await onSkipTask(task.id);
                        setLoadingId(null);
                      }}
                      disabled={loadingId === task.id}
                      className="bg-[#15171C] hover:bg-[#2A2D35] text-[#8E9299] border border-[#2A2D35] text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
                    >
                      <SkipForward className="w-3.5 h-3.5 text-[#8E9299]" />
                      <span>Skip</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2A2D35] bg-[#15171C] flex items-center justify-between text-xs font-mono text-[#8E9299]">
          <span>COMPLETED/SKIPPED ACTIONS PERMANENTLY LOGGED TO AUDIT TRAIL</span>
          <button
            onClick={onClose}
            className="bg-[#2A2D35] hover:bg-[#343842] text-[#E0E0E0] border border-[#3E424D] px-4 py-1.5 rounded transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
