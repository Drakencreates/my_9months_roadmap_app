'use client';

import React, { useState } from 'react';
import { X, Video, Star, CheckCircle2, ExternalLink } from 'lucide-react';
import { Resource } from '@/lib/types';

interface VideoEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  onUpdateProgress: (resourceId: string, status: 'COMPLETED' | 'WATCHING' | 'NOT_USEFUL', rating?: number) => Promise<void>;
}

export const VideoEmbedModal: React.FC<VideoEmbedModalProps> = ({
  isOpen,
  onClose,
  resource,
  onUpdateProgress,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!isOpen || !resource) return null;

  // Extract video ID from youtube URL if possible
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
      }
    } catch {
      // fallback
    }
    return null;
  };

  const embedUrl = getYouTubeEmbedUrl(resource.url);

  const handleMarkDone = async () => {
    setIsUpdating(true);
    try {
      await onUpdateProgress(resource.id, 'COMPLETED', rating);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#2A2D35] flex items-center justify-between bg-[#15171C]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-[#15171C] border border-[#2A2D35] text-[#4ADE80] flex items-center justify-center shrink-0 font-mono">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0 font-mono">
              <h3 className="text-sm font-bold text-[#E0E0E0] truncate">{resource.title}</h3>
              <p className="text-[11px] text-[#8E9299] truncate">
                {resource.channel} • {resource.duration_minutes} MIN • {resource.difficulty}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E9299] hover:text-[#E0E0E0] p-1.5 rounded hover:bg-[#2A2D35] shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player or Fallback Card */}
        <div className="aspect-video w-full bg-[#0F1115] relative">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={resource.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center font-mono">
              <Video className="w-12 h-12 text-[#4ADE80] mb-2" />
              <h4 className="text-sm font-bold text-[#E0E0E0] mb-1">{resource.title}</h4>
              <p className="text-xs text-[#8E9299] mb-4 max-w-sm">
                Curated educational video for today’s learning objective.
              </p>
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="bg-[#2A2D35] hover:bg-[#343842] text-[#4ADE80] border border-[#3E424D] text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors"
              >
                <span>OPEN_IN_YOUTUBE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-[#2A2D35] bg-[#15171C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8E9299]">RATE_RESOURCE:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-[#2A2D35]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#8E9299] hover:text-[#E0E0E0] px-3 py-1.5 rounded border border-[#2A2D35] bg-[#15171C] hover:bg-[#2A2D35] flex items-center gap-1.5 transition-colors"
            >
              <span>WATCH_ON_YOUTUBE</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={handleMarkDone}
              disabled={isUpdating}
              className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0F1115] text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 transition-opacity disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isUpdating ? 'SAVING...' : 'MARK_WATCHED (+30M)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
