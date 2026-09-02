'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { Sidebar, ActiveTab } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { TodayView } from '@/components/TodayView';
import { RoadmapView } from '@/components/RoadmapView';
import { TopicsView } from '@/components/TopicsView';
import { ResourcesView } from '@/components/ResourcesView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { ProjectsView } from '@/components/ProjectsView';
import { AiAssistantView } from '@/components/AiAssistantView';
import { SettingsView } from '@/components/SettingsView';
import { MissedTaskModal } from '@/components/MissedTaskModal';
import { TaskCompleteModal } from '@/components/TaskCompleteModal';
import { PriorityExplainModal } from '@/components/PriorityExplainModal';
import { VideoEmbedModal } from '@/components/VideoEmbedModal';
import {
  AnalyticsData,
  DashboardData,
  Month,
  PriorityBreakdown,
  Project,
  Resource,
  Task,
  Topic,
} from '@/lib/types';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [months, setMonths] = useState<Month[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [priorities, setPriorities] = useState<PriorityBreakdown[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [missedTasks, setMissedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [isMissedModalOpen, setIsMissedModalOpen] = useState<boolean>(false);
  const [taskForCompleteModal, setTaskForCompleteModal] = useState<Task | null>(null);
  const [selectedPriorityForModal, setSelectedPriorityForModal] = useState<PriorityBreakdown | null>(null);
  const [selectedResourceForModal, setSelectedResourceForModal] = useState<Resource | null>(null);

  // Load all data
  const fetchData = useCallback(async () => {
    try {
      const [dashRes, anaRes, roadRes, prioRes, missRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/analytics'),
        fetch('/api/roadmap'),
        fetch('/api/priorities'),
        fetch('/api/missed'),
      ]);

      const [dash, ana, road, prio, miss] = await Promise.all([
        dashRes.json(),
        anaRes.json(),
        roadRes.json(),
        prioRes.json(),
        missRes.json(),
      ]);

      setDashboardData(dash);
      setAnalyticsData(ana);
      if (road.months) setMonths(road.months);
      if (road.projects) setProjects(road.projects);
      if (prio.priorities) setPriorities(prio.priorities);
      if (miss.missed_tasks) setMissedTasks(miss.missed_tasks);

      // fetch topics and resources
      if (dash.today?.recommended_resources) {
        setResources(dash.today.recommended_resources);
      }
    } catch (err) {
      console.error('Failed to load roadmap data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [dashRes, anaRes, roadRes, prioRes, missRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/analytics'),
          fetch('/api/roadmap'),
          fetch('/api/priorities'),
          fetch('/api/missed'),
        ]);

        const [dash, ana, road, prio, miss] = await Promise.all([
          dashRes.json(),
          anaRes.json(),
          roadRes.json(),
          prioRes.json(),
          missRes.json(),
        ]);

        if (!isMounted) return;

        setDashboardData(dash);
        setAnalyticsData(ana);
        if (road.months) setMonths(road.months);
        if (road.projects) setProjects(road.projects);
        if (prio.priorities) setPriorities(prio.priorities);
        if (miss.missed_tasks) setMissedTasks(miss.missed_tasks);

        if (dash.today?.recommended_resources) {
          setResources(dash.today.recommended_resources);
        }
      } catch (err) {
        console.error('Failed to load roadmap data:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Task actions
  const handleQuickCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actual_minutes: 45, notes: 'Completed from Today view' }),
      });
      if (res.ok) {
        await fetchData();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmTaskComplete = async (taskId: string, actualMinutes: number, notes: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actual_minutes: actualMinutes, notes }),
      });
      if (res.ok) {
        await fetchData();
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkipTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/skip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Skipped by user' }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProjectChecklist = async (projectId: string, checklistId: string) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, checklist_id: checklistId }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAiRecommendation = async (rec: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: rec.title,
          description: rec.description,
          task_type: rec.task_type || 'LEARN',
          estimated_minutes: rec.estimated_minutes || 30,
          priority_level: rec.priority_level || 'HIGH',
          topic_name: rec.topic_name || 'General',
        }),
      });
      if (res.ok) {
        await fetchData();
        confetti({ particleCount: 40, spread: 50 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateResourceProgress = async (
    resourceId: string,
    status: 'COMPLETED' | 'WATCHING' | 'NOT_USEFUL',
    rating?: number
  ) => {
    try {
      await fetch(`/api/resources/${resourceId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rating }),
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-base font-bold text-slate-200">
          Loading 9-Month Roadmap & Telemetry Engine...
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Evaluating 270 days, dynamic priority matrix, and attention alerts.
        </p>
      </div>
    );
  }

  const todayRemainingCount = dashboardData.today.tasks.filter((t) => t.status !== 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] flex flex-row font-sans">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        missedCount={dashboardData.attention.missed_tasks_count}
        todayRemainingCount={todayRemainingCount}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Sticky Top Header */}
        <Header
          data={dashboardData}
          onOpenMissedModal={() => setIsMissedModalOpen(true)}
          onOpenAi={() => setActiveTab('ai')}
        />

        {/* View Switcher Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              data={dashboardData}
              onNavigateToToday={() => setActiveTab('today')}
              onOpenMissedModal={() => setIsMissedModalOpen(true)}
              onSelectPriorityTopic={(p) => setSelectedPriorityForModal(p)}
              onSelectResource={(r) => setSelectedResourceForModal(r)}
              onNavigateToTab={(t) => setActiveTab(t)}
              onAddAiRecommendation={handleAddAiRecommendation}
            />
          )}

          {activeTab === 'today' && (
            <TodayView
              data={dashboardData}
              onOpenCompleteModal={(t) => setTaskForCompleteModal(t)}
              onQuickCompleteTask={handleQuickCompleteTask}
              onRescheduleTask={handleRescheduleTask}
              onWatchVideo={(t) => {
                const r = dashboardData.today.recommended_resources[0];
                if (r) setSelectedResourceForModal(r);
                else setActiveTab('resources');
              }}
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapView
              months={months}
              projects={projects}
              currentDayNumber={dashboardData.current_day_number}
            />
          )}

          {activeTab === 'topics' && (
            <TopicsView
              topics={dashboardData.today.topics.length > 0 ? dashboardData.today.topics : months.map((m) => ({
                id: `top_${m.month_number}`,
                name: m.technology,
                description: m.description,
                technology: m.technology,
                difficulty: 'INTERMEDIATE',
                base_importance: 85,
                base_difficulty: 65,
                estimated_minutes: 180,
                quiz_accuracy: 75,
              }))}
              priorities={priorities}
              onSelectPriority={(p) => setSelectedPriorityForModal(p)}
            />
          )}

          {activeTab === 'resources' && (
            <ResourcesView
              resources={resources.length > 0 ? resources : dashboardData.today.recommended_resources}
              onSelectResource={(r) => setSelectedResourceForModal(r)}
            />
          )}

          {activeTab === 'analytics' && analyticsData && (
            <AnalyticsView data={analyticsData} />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onToggleChecklist={handleToggleProjectChecklist}
            />
          )}

          {activeTab === 'ai' && (
            <AiAssistantView
              data={dashboardData}
              onAddRecommendationToRoadmap={handleAddAiRecommendation}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView data={dashboardData} onRefresh={fetchData} />
          )}
        </main>

        {/* Technical Telemetry Footer */}
        <footer className="h-10 border-t border-[#2A2D35] bg-[#0F1115] px-6 flex items-center justify-between text-[10px] font-mono text-[#4F545C] uppercase tracking-widest shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]"></span>
            <span>SYSTEM STATUS: OPTIMAL // LOCAL CADENCE: 3H/DAY</span>
          </div>
          <div className="hidden md:block">
            9-MONTH PIPELINE INGESTION COMPLETE
          </div>
          <div className="flex items-center gap-3">
            <span>SYNC: CLOUD_POSTGRES_PROD</span>
            <span className="text-[#8E9299]">BUILD: 1.0.4</span>
          </div>
        </footer>
      </div>

      {/* Global Modals */}
      <MissedTaskModal
        isOpen={isMissedModalOpen}
        onClose={() => setIsMissedModalOpen(false)}
        missedTasks={missedTasks}
        onCompleteTask={handleQuickCompleteTask}
        onRescheduleTask={handleRescheduleTask}
        onSkipTask={handleSkipTask}
        onRefresh={fetchData}
      />

      <TaskCompleteModal
        isOpen={taskForCompleteModal !== null}
        onClose={() => setTaskForCompleteModal(null)}
        task={taskForCompleteModal}
        onConfirm={handleConfirmTaskComplete}
      />

      <PriorityExplainModal
        isOpen={selectedPriorityForModal !== null}
        onClose={() => setSelectedPriorityForModal(null)}
        priority={selectedPriorityForModal}
      />

      <VideoEmbedModal
        isOpen={selectedResourceForModal !== null}
        onClose={() => setSelectedResourceForModal(null)}
        resource={selectedResourceForModal}
        onUpdateProgress={handleUpdateResourceProgress}
      />
    </div>
  );
}
