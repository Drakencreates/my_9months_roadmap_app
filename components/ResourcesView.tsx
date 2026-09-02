'use client';

import React, { useState } from 'react';
import { Video, Star, ExternalLink, Play, CheckCircle2, Search, Filter } from 'lucide-react';
import { Resource } from '@/lib/types';

interface ResourcesViewProps {
  resources: Resource[];
  onSelectResource: (resource: Resource) => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  onSelectResource,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.channel?.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = selectedDifficulty === 'ALL' || r.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4 shadow-[0_0_15px_rgba(74,222,128,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2A2D35] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider mb-1">
              <Video className="w-3.5 h-3.5" />
              <span>CURATED TECHNICAL VIDEO LIBRARY</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#E0E0E0] tracking-tight">
              VIDEO LESSONS & ARCHITECTURAL LABS
            </h1>
            <p className="text-xs font-mono text-[#8E9299] mt-1">
              Screened for technical rigor, practical benchmarks, and production-grade software patterns.
            </p>
          </div>

          <div className="bg-[#15171C] px-3.5 py-2 rounded border border-[#2A2D35] text-xs font-mono text-[#4ADE80] shrink-0 font-bold">
            <span>{resources.length} CURATED_LESSONS</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8E9299]" />
            <input
              type="text"
              placeholder="Search library (e.g. Alex The Analyst, Postgres, Go, Docker)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#15171C] border border-[#2A2D35] rounded pl-10 pr-4 py-2 text-xs font-mono text-[#E0E0E0] placeholder:text-[#8E9299] focus:outline-none focus:border-[#4ADE80]"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-[#15171C] border border-[#2A2D35] rounded px-3 py-2 text-xs font-mono text-[#E0E0E0] focus:outline-none focus:border-[#4ADE80]"
          >
            <option value="ALL">ALL LEVELS</option>
            <option value="BEGINNER">BEGINNER</option>
            <option value="INTERMEDIATE">INTERMEDIATE</option>
            <option value="ADVANCED">ADVANCED</option>
          </select>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-lg bg-[#1A1D24] border border-[#2A2D35] hover:border-[#4ADE80]/40 flex flex-col justify-between space-y-4 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[10px] bg-[#2A2D35] text-[#4ADE80] font-bold px-2 py-0.5 rounded border border-[#3E424D]">
                  {res.platform}
                </span>
                <span className="text-[10px] bg-[#15171C] text-[#8E9299] px-2 py-0.5 rounded border border-[#2A2D35]">
                  {res.difficulty}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#E0E0E0] group-hover:text-[#4ADE80] transition-colors line-clamp-2">
                {res.title}
              </h3>

              <p className="text-xs font-mono text-[#8E9299]">
                SOURCE: <strong className="text-[#E0E0E0]">{res.channel}</strong> • {res.duration_minutes}m
              </p>
            </div>

            <div className="pt-3 border-t border-[#2A2D35] flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#FBBF24]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-mono font-bold">4.9</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectResource(res)}
                  className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0F1115] text-xs font-mono font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-opacity"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>WATCH</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
