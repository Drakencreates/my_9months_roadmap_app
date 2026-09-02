'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onConfirm: (taskId: string, actualMinutes: number, notes: string) => Promise<void>;
}

export const TaskCompleteModal: React.FC<TaskCompleteModalProps> = ({
  isOpen,
  onClose,
  task,
  onConfirm,
}) => {
  const [actualMinutes, setActualMinutes] = useState<number>(task?.estimated_minutes || 45);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(task.id, actualMinutes, notes);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2A2D35] flex items-center justify-between bg-[#15171C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#152A1C] border border-[#1A5528] text-[#4ADE80] flex items-center justify-center font-mono">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E0E0E0] font-mono">LOG_TASK_COMPLETION</h3>
              <p className="text-[11px] font-mono text-[#8E9299]">DAY {task.day_number} TASK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E9299] hover:text-[#E0E0E0] p-1.5 rounded hover:bg-[#2A2D35] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-mono">
          <div>
            <h4 className="text-sm font-bold text-[#E0E0E0] mb-1">{task.title}</h4>
            <p className="text-xs text-[#8E9299]">{task.description}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8E9299] mb-1.5 flex items-center gap-1.5 uppercase">
              <Clock className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>ACTUAL_STUDY_TIME (MINUTES)</span>
            </label>
            <input
              type="number"
              min="1"
              max="300"
              value={actualMinutes}
              onChange={(e) => setActualMinutes(Number(e.target.value))}
              className="w-full bg-[#15171C] border border-[#2A2D35] rounded px-3 py-2 text-xs text-[#E0E0E0] focus:outline-none focus:border-[#4ADE80] font-mono"
              required
            />
            <p className="text-[11px] text-[#8E9299] mt-1">
              Estimated: {task.estimated_minutes} minutes
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8E9299] mb-1.5 flex items-center gap-1.5 uppercase">
              <FileText className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>LEARNING_REFLECTIONS_&_NOTES (OPTIONAL)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mastered difference between ROW_NUMBER and DENSE_RANK. Remember to specify ORDER BY in OVER clause..."
              className="w-full bg-[#15171C] border border-[#2A2D35] rounded px-3 py-2 text-xs text-[#E0E0E0] placeholder:text-[#8E9299] focus:outline-none focus:border-[#4ADE80] resize-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded text-xs text-[#8E9299] hover:text-[#E0E0E0] bg-[#15171C] border border-[#2A2D35] hover:bg-[#2A2D35] transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded text-xs font-bold bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0F1115] flex items-center gap-1.5 transition-opacity disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'LOGGING...' : 'CONFIRM_&_COMPLETE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
