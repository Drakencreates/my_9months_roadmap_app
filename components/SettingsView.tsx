'use client';

import React, { useState } from 'react';
import { Settings, Calendar, Clock, RotateCcw, CheckCircle2, FastForward } from 'lucide-react';
import { DashboardData } from '@/lib/types';

interface SettingsViewProps {
  data: DashboardData;
  onRefresh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ data, onRefresh }) => {
  const [startDate, setStartDate] = useState<string>(data.roadmap.start_date);
  const [jumpDay, setJumpDay] = useState<number>(data.current_day_number);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdateStartDate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: startDate }),
      });
      const resData = await res.json();
      if (resData.success) {
        setMessage('Roadmap start date updated! Calendar schedules recalculated.');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to update start date.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleJumpToDay = async (dayNum: number) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jump_to_day: dayNum }),
      });
      const resData = await res.json();
      if (resData.success) {
        setJumpDay(dayNum);
        setMessage(`Jumped to Day ${dayNum}! Tasks and missed schedules re-evaluated.`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to jump to day.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDayOne = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_to_day_one: true }),
      });
      const resData = await res.json();
      if (resData.success) {
        setStartDate(resData.start_date);
        setJumpDay(1);
        setMessage('Roadmap reset! Starting fresh from Day 1 tomorrow with SQL Foundations.');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to reset roadmap.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4 shadow-[0_0_15px_rgba(74,222,128,0.04)]">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5" />
          <span>ROADMAP SCHEDULE CONFIGURATION & SIMULATION SANDBOX</span>
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-[#E0E0E0] tracking-tight">
          ROADMAP SETTINGS & EDGE-CASE TESTING
        </h1>
        <p className="text-xs font-mono text-[#8E9299]">
          Adjust the 9-month curriculum anchor date or simulate jumping through days to test missed work alerts, overdue detections, and recovery plans.
        </p>

        {message && (
          <div className="p-3 bg-[#152A1C] border border-[#1A5528] rounded text-xs text-[#4ADE80] font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
            <span>{message}</span>
          </div>
        )}
      </div>

      {/* Start Date Configuration */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-mono font-bold text-[#E0E0E0] flex items-center gap-2 uppercase">
          <Calendar className="w-4 h-4 text-[#4ADE80]" />
          <span>START_DATE_&_CALENDAR_RECALCULATION</span>
        </h2>
        <p className="text-xs font-mono text-[#8E9299]">
          All 270 days and 39 weeks automatically recalculate their calendar dates based on your anchor date.
        </p>

        <form onSubmit={handleUpdateStartDate} className="space-y-4 max-w-md font-mono">
          <div>
            <label className="block text-xs text-[#8E9299] font-bold mb-1.5 uppercase">
              ROADMAP_START_DATE (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#15171C] border border-[#2A2D35] rounded px-4 py-2 text-xs text-[#E0E0E0] font-mono focus:outline-none focus:border-[#4ADE80]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0F1115] text-xs font-mono font-bold px-4 py-2 rounded flex items-center gap-2 transition-opacity disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isSaving ? 'UPDATING...' : 'SAVE_&_RECALCULATE_DATES'}</span>
          </button>
        </form>
      </div>

      {/* Quick Reset to Day 1 (Starts Tomorrow) */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#4ADE80]" />
          <h2 className="text-sm font-mono font-bold text-[#E0E0E0] uppercase">
            RESET_ROADMAP_TO_DAY_1 (STARTS_TOMORROW)
          </h2>
        </div>
        <p className="text-xs font-mono text-[#8E9299] leading-relaxed">
          Reset all progress, streaks, and tasks back to Day 1 starting fresh tomorrow with SQL Foundations. This will set Day 1 active with 5 fundamental SQL tasks (180 minutes) and initialize all 9 months.
        </p>

        <button
          type="button"
          onClick={handleResetToDayOne}
          disabled={isSaving}
          className="bg-[#152A1C] border border-[#4ADE80] hover:bg-[#1A3824] text-[#4ADE80] text-xs font-mono font-bold px-4 py-2.5 rounded flex items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_12px_rgba(74,222,128,0.15)]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isSaving ? 'RESETTING...' : 'RESET_TO_DAY_1_TOMORROW'}</span>
        </button>
      </div>

      {/* Simulation Sandbox (Testing Edge Cases) */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FastForward className="w-4 h-4 text-[#4ADE80]" />
          <h2 className="text-sm font-mono font-bold text-[#E0E0E0] uppercase">
            SIMULATED_DAY_JUMPER (TEST_DETECTION_&_RECOVERY)
          </h2>
        </div>
        <p className="text-xs font-mono text-[#8E9299] leading-relaxed">
          Quickly switch the active simulation date to verify how overdue tasks trigger attention banners, recovery recommendations, and 3-hour constraint warnings.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 font-mono">
          {[
            { day: 1, label: 'Day 1 (SQL Intro)' },
            { day: 15, label: 'Day 15 (Joins Deep Dive)' },
            { day: 45, label: 'Day 45 (Window Ties)' },
            { day: 47, label: 'Day 47 (Active Window Functions)' },
            { day: 48, label: 'Day 48 (Advance 1 Day)' },
            { day: 65, label: 'Day 65 (Month 3 Python)' },
            { day: 120, label: 'Day 120 (Month 4 Stats)' },
            { day: 180, label: 'Day 180 (Month 6 LLMs)' },
          ].map((item) => (
            <button
              key={item.day}
              onClick={() => handleJumpToDay(item.day)}
              className={`p-3 rounded border text-left text-xs transition-all ${
                data.current_day_number === item.day
                  ? 'bg-[#152A1C] border-[#4ADE80] text-[#4ADE80] font-bold shadow-[0_0_10px_rgba(74,222,128,0.1)]'
                  : 'bg-[#15171C] border-[#2A2D35] text-[#8E9299] hover:border-[#3E424D] hover:text-[#E0E0E0]'
              }`}
            >
              <div className="text-[10px] text-[#8E9299]">JUMP_TO:</div>
              <div className="font-semibold truncate text-[#E0E0E0]">{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
