import React from 'react';
import { LifelineState } from '../types/quiz';
import { Split, Users, Bot, RefreshCw } from 'lucide-react';

interface LifelinesProps {
  lifelines: LifelineState;
  onUseFiftyFifty: () => void;
  onUseAudiencePoll: () => void;
  onUseAiHint: () => void;
  onUseSwitchQuestion: () => void;
  disabled?: boolean;
}

export const Lifelines: React.FC<LifelinesProps> = ({
  lifelines,
  onUseFiftyFifty,
  onUseAudiencePoll,
  onUseAiHint,
  onUseSwitchQuestion,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 p-2 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-lg">
      {/* 50:50 */}
      <button
        onClick={onUseFiftyFifty}
        disabled={disabled || !lifelines.fiftyFifty}
        title="50:50 - Loại bỏ 2 đáp án sai"
        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
          lifelines.fiftyFifty && !disabled
            ? 'bg-gradient-to-b from-blue-600 to-indigo-800 text-white border border-blue-400 shadow-md shadow-blue-500/20 hover:scale-105 hover:border-cyan-300 active:scale-95'
            : 'bg-slate-900/60 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
        }`}
      >
        <Split className="w-4 h-4" />
        <span>50:50</span>
        {!lifelines.fiftyFifty && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/70 text-red-500 font-extrabold text-lg">
            ✕
          </div>
        )}
      </button>

      {/* Hỏi khán giả */}
      <button
        onClick={onUseAudiencePoll}
        disabled={disabled || !lifelines.audiencePoll}
        title="Hỏi ý kiến khán giả trường quay"
        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
          lifelines.audiencePoll && !disabled
            ? 'bg-gradient-to-b from-cyan-600 to-blue-800 text-white border border-cyan-400 shadow-md shadow-cyan-500/20 hover:scale-105 hover:border-cyan-200 active:scale-95'
            : 'bg-slate-900/60 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
        }`}
      >
        <Users className="w-4 h-4" />
        <span className="hidden xs:inline">Khán Giả</span>
        <span className="xs:hidden">Ý Kiến</span>
        {!lifelines.audiencePoll && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/70 text-red-500 font-extrabold text-lg">
            ✕
          </div>
        )}
      </button>

      {/* AI Gợi Ý */}
      <button
        onClick={onUseAiHint}
        disabled={disabled || !lifelines.aiHint}
        title="AI gợi ý kiến thức từ SGK Hóa học 12"
        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
          lifelines.aiHint && !disabled
            ? 'bg-gradient-to-b from-purple-600 to-indigo-900 text-white border border-purple-400 shadow-md shadow-purple-500/20 hover:scale-105 hover:border-purple-200 active:scale-95'
            : 'bg-slate-900/60 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
        }`}
      >
        <Bot className="w-4 h-4 text-purple-200" />
        <span>AI Gợi Ý</span>
        {!lifelines.aiHint && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/70 text-red-500 font-extrabold text-lg">
            ✕
          </div>
        )}
      </button>

      {/* Đổi câu hỏi */}
      <button
        onClick={onUseSwitchQuestion}
        disabled={disabled || !lifelines.switchQuestion}
        title="Đổi sang câu hỏi khác trong cùng chuyên đề"
        className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
          lifelines.switchQuestion && !disabled
            ? 'bg-gradient-to-b from-emerald-600 to-teal-800 text-white border border-emerald-400 shadow-md shadow-emerald-500/20 hover:scale-105 hover:border-emerald-200 active:scale-95'
            : 'bg-slate-900/60 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
        }`}
      >
        <RefreshCw className="w-4 h-4" />
        <span className="hidden xs:inline">Đổi Câu</span>
        <span className="xs:hidden">Đổi</span>
        {!lifelines.switchQuestion && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/70 text-red-500 font-extrabold text-lg">
            ✕
          </div>
        )}
      </button>
    </div>
  );
};
