'use client';

import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Map,
  BookOpen,
  Video,
  BarChart3,
  Rocket,
  Bot,
  Settings,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'today'
  | 'roadmap'
  | 'topics'
  | 'resources'
  | 'analytics'
  | 'projects'
  | 'ai'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  missedCount: number;
  todayRemainingCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  missedCount,
  todayRemainingCount,
}) => {
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'today',
      label: "Today's Tasks",
      icon: CheckSquare,
      badge: todayRemainingCount > 0 ? todayRemainingCount : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'roadmap',
      label: '9-Month Roadmap',
      icon: Map,
    },
    {
      id: 'topics',
      label: 'Topics & Priority',
      icon: BookOpen,
    },
    {
      id: 'resources',
      label: 'YouTube & Learn',
      icon: Video,
    },
    {
      id: 'analytics',
      label: 'Analytics & Health',
      icon: BarChart3,
    },
    {
      id: 'projects',
      label: 'Milestone Projects',
      icon: Rocket,
      badge: '9 Months',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'ai',
      label: 'AI Learning Mentor',
      icon: Bot,
      badge: 'Gemini',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'settings',
      label: 'Settings & Sandbox',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-[#15171C] border-r border-[#2A2D35] flex flex-col shrink-0 h-screen sticky top-0 select-none font-sans">
      {/* Brand */}
      <div className="p-4 border-b border-[#2A2D35] flex items-center gap-3">
        <div className="w-10 h-10 bg-[#4ADE80] rounded flex items-center justify-center text-[#0F1115] font-bold text-xl shrink-0 font-mono shadow-[0_0_12px_rgba(74,222,128,0.2)]">
          L
        </div>
        <div className="min-w-0">
          <h2 className="text-xs font-mono font-bold text-[#E0E0E0] tracking-wider uppercase truncate">
            LEARNING_OS
          </h2>
          <p className="text-[11px] text-[#8E9299] font-mono truncate">
            9M_PIPELINE // 3H/DAY
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#1A1D24] text-[#4ADE80] border-l-2 border-[#4ADE80] shadow-[0_0_15px_rgba(74,222,128,0.06)]'
                  : 'text-[#8E9299] hover:text-[#E0E0E0] hover:bg-[#1A1D24]/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#4ADE80]' : 'text-[#8E9299] group-hover:text-[#E0E0E0]'
                  }`}
                />
                <span className="truncate tracking-tight">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-medium ${
                    isActive
                      ? 'bg-[#4ADE80]/20 text-[#4ADE80] border-[#4ADE80]/40'
                      : 'bg-[#2A2D35] text-[#8E9299] border-[#2A2D35]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Attention Box */}
      {missedCount > 0 && (
        <div className="p-3 m-3 bg-[#211515] border border-[#442222] rounded">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-mono font-bold text-[#FCA5A5]">
                {missedCount} MISSED TASKS
              </p>
              <p className="text-[11px] text-[#FCA5A5]/80 mt-0.5 leading-relaxed">
                Prioritize recovery to maintain 3h/day cadence.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Footer */}
      <div className="p-3 border-t border-[#2A2D35] bg-[#121419] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded bg-[#2A2D35] border border-[#3E424D] text-[#4ADE80] flex items-center justify-center font-mono font-bold text-xs">
            AG
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#E0E0E0] truncate">Abhinav Giri</p>
            <p className="text-[10px] font-mono text-[#8E9299] truncate">3H TARGET // METRICS OK</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
