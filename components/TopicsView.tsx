'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  SlidersHorizontal,
  BrainCircuit
} from 'lucide-react';
import { PriorityBreakdown, Topic } from '@/lib/types';

interface TopicsViewProps {
  topics: Topic[];
  priorities: PriorityBreakdown[];
  onSelectPriority: (priority: PriorityBreakdown) => void;
}

export const TopicsView: React.FC<TopicsViewProps> = ({
  topics,
  priorities,
  onSelectPriority,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string>('ALL');

  const filteredTopics = topics.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.technology.toLowerCase().includes(search.toLowerCase());
    const matchesTech = selectedTech === 'ALL' || t.technology.toLowerCase().includes(selectedTech.toLowerCase());
    return matchesSearch && matchesTech;
  });

  const getPriorityForTopic = (topicId: string): PriorityBreakdown => {
    return (
      priorities.find((p) => p.topic_id === topicId) || {
        topic_id: topicId,
        topic_name: 'Topic',
        importance: 80,
        difficulty: 60,
        missed_count: 0,
        dependency_impact: 70,
        weakness_score: 30,
        deadline_pressure: 50,
        calculated_score: 68,
        priority_level: 'MEDIUM',
      }
    );
  };

  const technologies = [
    'ALL',
    'SQL',
    'Database Engineering',
    'Python & Data Engineering',
    'Statistics & Anomaly Detection',
    'Time-Series Forecasting',
    'AI & LLMs',
    'Airflow & Agents',
    'Go & Backend',
    'React & Frontend',
    'DevOps & Deployment',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4 shadow-[0_0_15px_rgba(74,222,128,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2A2D35] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>SKILL KNOWLEDGE GRAPH & PRIORITY ENGINE</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#E0E0E0] tracking-tight">
              CURRICULUM TOPICS & PRIORITY ENGINE
            </h1>
            <p className="text-xs font-mono text-[#8E9299] mt-1">
              Formula: 0.25×Imp + 0.20×Missed + 0.15×Dep + 0.15×Diff + 0.15×Weak + 0.10×Deadline
            </p>
          </div>

          <div className="bg-[#15171C] px-3.5 py-2 rounded border border-[#2A2D35] text-xs font-mono text-[#8E9299] flex items-center gap-2 shrink-0">
            <Target className="w-4 h-4 text-[#4ADE80]" />
            <span>CLICK TO INSPECT FORMULA WEIGHTS</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8E9299]" />
            <input
              type="text"
              placeholder="Filter topics (e.g. Window Functions, CTE, Airflow, Go)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#15171C] border border-[#2A2D35] rounded pl-10 pr-4 py-2 text-xs font-mono text-[#E0E0E0] placeholder:text-[#8E9299] focus:outline-none focus:border-[#4ADE80]"
            />
          </div>

          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="bg-[#15171C] border border-[#2A2D35] rounded px-3 py-2 text-xs font-mono text-[#E0E0E0] focus:outline-none focus:border-[#4ADE80]"
          >
            {technologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => {
          const p = getPriorityForTopic(topic.id);
          const isWeak = (topic.quiz_accuracy || 75) < 70;

          return (
            <div
              key={topic.id}
              onClick={() => onSelectPriority(p)}
              className="p-5 rounded-lg bg-[#1A1D24] border border-[#2A2D35] hover:border-[#4ADE80]/50 cursor-pointer transition-all group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] bg-[#2A2D35] text-[#8E9299] font-mono px-2 py-0.5 rounded font-bold uppercase">
                    {topic.technology}
                  </span>

                  <div className="flex items-center gap-1.5 font-mono">
                    {isWeak && (
                      <span className="text-[10px] bg-[#2A2415] text-[#FBBF24] border border-[#554415] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>WEAK_TOPIC</span>
                      </span>
                    )}

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold border font-mono ${
                        p.priority_level === 'CRITICAL'
                          ? 'bg-[#2A1517] text-[#EF4444] border-[#551A1A]'
                          : p.priority_level === 'HIGH'
                          ? 'bg-[#2A2415] text-[#FBBF24] border-[#554415]'
                          : 'bg-[#152A1C] text-[#4ADE80] border-[#1A5528]'
                      }`}
                    >
                      {p.priority_level} ({p.calculated_score})
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#E0E0E0] group-hover:text-[#4ADE80] transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs text-[#8E9299] leading-relaxed">{topic.description}</p>
              </div>

              <div className="pt-3 border-t border-[#2A2D35] flex items-center justify-between text-xs font-mono text-[#8E9299]">
                <div className="flex items-center gap-3 text-[11px]">
                  <span>ACCURACY: <strong className={isWeak ? 'text-[#EF4444]' : 'text-[#4ADE80]'}>{topic.quiz_accuracy}%</strong></span>
                  <span>•</span>
                  <span>EST: <strong className="text-[#E0E0E0]">{topic.estimated_minutes}m</strong></span>
                </div>

                <span className="text-[#4ADE80] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-[11px]">
                  <span>WEIGHTS</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
