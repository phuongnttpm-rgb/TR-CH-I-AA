import React from 'react';
import { PRIZE_LADDER } from '../data/chemQuestions';
import { Trophy, ShieldCheck, Star } from 'lucide-react';

interface LadderProps {
  currentLevel: number; // 1 to 15
  isAnswerLocked?: boolean;
}

export const Ladder: React.FC<LadderProps> = ({ currentLevel }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 p-2 sm:p-2.5 shadow-xl justify-between overflow-hidden">
      <div className="flex items-center justify-between px-2 pb-1.5 mb-1 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Thang Điểm 15 Câu
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold">
          {currentLevel}/15
        </span>
      </div>

      {/* Ladder levels (Descending from 15 to 1) */}
      <div className="flex-1 flex flex-col justify-between gap-0.5 min-h-0 overflow-hidden pr-0.5">
        {PRIZE_LADDER.map((milestone) => {
          const isCurrent = milestone.level === currentLevel;
          const isPassed = milestone.level < currentLevel;
          const isSafety = milestone.isSafetyStop;

          return (
            <div
              key={milestone.level}
              className={`flex items-center justify-between px-2 sm:px-2.5 py-1 rounded-md text-[11px] font-bold transition-all duration-200 ${
                isCurrent
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-md shadow-yellow-500/30 scale-[1.01] ring-1 ring-yellow-300 font-black'
                  : isPassed
                  ? 'bg-slate-900/30 text-emerald-400 border border-emerald-900/30 opacity-75'
                  : isSafety
                  ? 'bg-indigo-950/70 text-amber-200 border border-indigo-700/60'
                  : 'bg-slate-900/20 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-4 text-center font-mono text-[10px] ${
                  isCurrent ? 'text-slate-950 font-black' : isSafety ? 'text-amber-300' : 'text-slate-500'
                }`}>
                  {milestone.level}
                </span>

                {isSafety && (
                  <span title="Mốc an toàn">
                    {milestone.level === 15 ? (
                      <Star className={`w-3 h-3 ${isCurrent ? 'text-slate-950' : 'text-amber-300'}`} />
                    ) : (
                      <ShieldCheck className={`w-3 h-3 ${isCurrent ? 'text-slate-950' : 'text-cyan-400'}`} />
                    )}
                  </span>
                )}

                <span className="truncate max-w-[80px] text-[10px] font-medium hidden sm:inline">
                  {milestone.title.replace(/👑|🏆|🎖️/g, '').trim()}
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono tracking-tight text-[11px]">
                <span className={isCurrent ? 'text-slate-950 font-black text-xs' : isSafety ? 'text-amber-300 font-extrabold' : ''}>
                  {milestone.rewardText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-1 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-around shrink-0">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-cyan-400" /> Mốc 5 &amp; 10
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400" /> Mốc 15 Đỉnh Cao
        </span>
      </div>
    </div>
  );
};
