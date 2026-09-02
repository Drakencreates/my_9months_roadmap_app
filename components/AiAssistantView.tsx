'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Code2, 
  CheckCircle2, 
  RefreshCw, 
  BookOpen, 
  Lightbulb,
  Plus
} from 'lucide-react';
import { DashboardData } from '@/lib/types';

interface AiAssistantViewProps {
  data: DashboardData;
  onAddRecommendationToRoadmap: (rec: any) => Promise<void>;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  data,
  onAddRecommendationToRoadmap,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: `Hello Abhinav! I am your AI Study Mentor for the **${data.roadmap.name}**.\n\nYou are on **Day ${data.current_day_number}** (Goal: *${data.today.goal}*). You currently have **${data.attention.missed_tasks_count} missed tasks** pending action and a **12-day study streak**.\n\nHow can I support your 3-hour learning session today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [practiceProblem, setPracticeProblem] = useState<any | null>(null);
  const [generatingPractice, setGeneratingPractice] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [addedRec, setAddedRec] = useState<boolean>(false);
  const messageIdCounter = React.useRef<number>(100);

  const quickPrompts = [
    'What should I focus on today?',
    'Why is window functions marked high priority?',
    'What did I miss this week?',
    'Am I falling behind?',
    'Explain what I need to learn before Airflow.',
    'Give me a SQL practice question based on today.',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || isGenerating) return;

    messageIdCounter.current += 1;
    const currentId = messageIdCounter.current;

    const userMsg: ChatMessage = {
      id: `usr_${currentId}`,
      sender: 'user',
      text: q,
      timestamp: 'Sent',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const resData = await res.json();

      messageIdCounter.current += 1;
      const replyId = messageIdCounter.current;

      const assistantMsg: ChatMessage = {
        id: `ai_${replyId}`,
        sender: 'assistant',
        text: resData.reply || 'I processed your request. Let me know if you need more details!',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      messageIdCounter.current += 1;
      const errId = messageIdCounter.current;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${errId}`,
          sender: 'assistant',
          text: 'Unable to reach mentor server. Please verify your connection or retry.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePractice = async () => {
    setGeneratingPractice(true);
    setShowSolution(false);
    try {
      const res = await fetch('/api/ai/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'SQL Window Functions (ROW_NUMBER, RANK, DENSE_RANK)' }),
      });
      const data = await res.json();
      if (data.problem) {
        setPracticeProblem(data.problem);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPractice(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-6 space-y-4 shadow-[0_0_15px_rgba(74,222,128,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2A2D35] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ADE80] uppercase tracking-wider mb-1">
              <Bot className="w-3.5 h-3.5" />
              <span>GROUNDED AI STUDY MENTOR (GEMINI 3.8 FLASH)</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#E0E0E0] tracking-tight">
              INTERACTIVE CURRICULUM MENTOR & LABS
            </h1>
            <p className="text-xs font-mono text-[#8E9299] mt-1">
              Grounded in your actual curriculum schedule, weak topics, and active project dependencies.
            </p>
          </div>

          <button
            onClick={handleGeneratePractice}
            disabled={generatingPractice}
            className="bg-[#2A2D35] hover:bg-[#343842] text-[#E0E0E0] border border-[#3E424D] text-xs font-mono font-bold px-3.5 py-2 rounded flex items-center gap-2 transition-colors shrink-0"
          >
            {generatingPractice ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#4ADE80]" />
            ) : (
              <Code2 className="w-4 h-4 text-[#4ADE80]" />
            )}
            <span>GENERATE_PRACTICE_LAB</span>
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="space-y-1.5 font-mono">
          <div className="text-[11px] text-[#8E9299] font-semibold">SUGGESTED_QUERIES:</div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isGenerating}
                className="bg-[#15171C] border border-[#2A2D35] hover:border-[#4ADE80]/40 text-[#8E9299] hover:text-[#E0E0E0] text-xs px-3 py-1.5 rounded transition-all text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Challenge Card (If Generated) */}
      {practiceProblem && (
        <div className="bg-[#1A1D24] border border-[#4ADE80]/50 rounded-lg p-6 space-y-4 shadow-[0_0_15px_rgba(74,222,128,0.06)] animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#2A2D35] pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#4ADE80]" />
              <div>
                <h3 className="text-sm font-bold text-[#E0E0E0] font-mono">{practiceProblem.title}</h3>
                <span className="text-[10px] bg-[#2A2D35] text-[#4ADE80] font-mono px-2 py-0.5 rounded font-bold uppercase">
                  {practiceProblem.difficulty}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-xs font-mono text-[#4ADE80] hover:underline font-semibold"
            >
              {showSolution ? 'HIDE_SOLUTION' : 'REVEAL_SOLUTION_CODE'}
            </button>
          </div>

          <div className="text-xs font-mono text-[#8E9299] whitespace-pre-wrap leading-relaxed">
            {practiceProblem.scenario}
          </div>

          {showSolution && (
            <div className="space-y-3 pt-2 border-t border-[#2A2D35] animate-in fade-in">
              <div className="p-3 bg-[#0F1115] rounded border border-[#2A2D35] font-mono text-xs text-[#4ADE80] overflow-x-auto whitespace-pre">
                {practiceProblem.solution_code}
              </div>
              <p className="text-xs font-mono text-[#8E9299] leading-relaxed bg-[#15171C] p-3 rounded border border-[#2A2D35]">
                <strong className="text-[#E0E0E0]">EXPLANATION: </strong>
                {practiceProblem.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* AI Recommendation Banner (Section 14) */}
      <div className="bg-[#15171C] border border-[#2A2D35] rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4ADE80] uppercase">
            <Lightbulb className="w-4 h-4 text-[#FBBF24]" />
            <span>AI_CURRICULUM_RECOMMENDATION</span>
          </div>
          <h4 className="text-sm font-bold text-[#E0E0E0]">
            Window Functions Tie-Breakers Revision — 30 minutes
          </h4>
          <p className="text-xs text-[#8E9299]">
            Reason: Low quiz accuracy (61%) on tie handling + 3 incomplete tasks.
          </p>
        </div>

        <button
          onClick={async () => {
            await onAddRecommendationToRoadmap({
              title: 'Window Functions Tie-Breakers Revision — 30m',
              description: 'Solve DENSE_RANK tie situations before starting CTEs.',
              estimated_minutes: 30,
              priority_level: 'HIGH',
              topic_name: 'SQL Window Functions',
            });
            setAddedRec(true);
          }}
          disabled={addedRec}
          className={`px-4 py-2 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shrink-0 ${
            addedRec
              ? 'bg-[#152A1C] text-[#4ADE80] border border-[#1A5528]'
              : 'bg-[#4ADE80] hover:bg-[#4ADE80]/90 text-[#0F1115]'
          }`}
        >
          {addedRec ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{addedRec ? 'ADDED_TO_ROADMAP' : 'ADD_TO_ROADMAP'}</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#1A1D24] border border-[#2A2D35] rounded-lg p-5 flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center shrink-0 font-mono ${
                    isAi
                      ? 'bg-[#15171C] text-[#4ADE80] border border-[#2A2D35]'
                      : 'bg-[#4ADE80] text-[#0F1115] font-bold'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <span className="text-xs font-bold">AG</span>}
                </div>

                <div
                  className={`max-w-2xl rounded-lg p-4 text-xs font-mono leading-relaxed ${
                    isAi
                      ? 'bg-[#15171C] border border-[#2A2D35] text-[#E0E0E0]'
                      : 'bg-[#2A2D35] border border-[#3E424D] text-[#E0E0E0]'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div className="text-[10px] mt-1.5 text-[#8E9299]">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#15171C] text-[#4ADE80] border border-[#2A2D35] flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#15171C] border border-[#2A2D35] rounded-lg px-4 py-3 text-xs font-mono text-[#8E9299] flex items-center gap-2">
                <span>Analyzing curriculum progress & formulating response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 pt-3 border-t border-[#2A2D35] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask mentor (e.g. How does DENSE_RANK resolve ties? What did I miss this week?)..."
            className="flex-1 bg-[#15171C] border border-[#2A2D35] rounded px-4 py-2.5 text-xs font-mono text-[#E0E0E0] placeholder:text-[#8E9299] focus:outline-none focus:border-[#4ADE80]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="bg-[#4ADE80] hover:bg-[#4ADE80]/90 disabled:opacity-50 text-[#0F1115] px-4 py-2.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-opacity shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SEND</span>
          </button>
        </form>
      </div>
    </div>
  );
};
