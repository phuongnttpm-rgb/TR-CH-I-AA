import React from 'react';
import { PRIZE_LADDER } from '../data/chemQuestions';
import { Trophy, ShieldCheck, Star } from 'lucide-react';

interface LadderProps {
  currentLevel: number; // 1 to 15
  isAnswerLocked?: boolean;
}

export const Ladder: React.FC<LadderProps> = ({ currentLevel }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950/85 backdrop-blur-md rounded-2xl border-2 border-slate-800 p-2 sm:p-3 shadow-2xl justify-between overflow-hidden">
      <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            THANG ĐIỂM 15 CÂU
          </span>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono font-black">
          {currentLevel}/15
        </span>
      </div>

      {/* Ladder levels (Descending from 15 to 1) with LARGER FONT SIZES */}
      <div className="flex-1 flex flex-col justify-between gap-1 min-h-0 overflow-hidden pr-0.5">
        {PRIZE_LADDER.map((milestone) => {
          const isCurrent = milestone.level === currentLevel;
          const isPassed = milestone.level < currentLevel;
          const isSafety = milestone.isSafetyStop;

          return (
            <div
              key={milestone.level}
              className={`flex items-center justify-between px-2.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-[13px] font-bold transition-all duration-200 ${
                isCurrent
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-lg shadow-yellow-500/40 scale-[1.02] ring-2 ring-yellow-300 font-black'
                  : isPassed
                  ? 'bg-slate-900/40 text-emerald-400 border border-emerald-900/40 opacity-80'
                  : isSafety
                  ? 'bg-indigo-950/80 text-amber-200 border border-indigo-700/80'
                  : 'bg-slate-900/25 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-5 text-center font-mono font-black text-xs sm:text-sm ${
                  isCurrent ? 'text-slate-950 font-black' : isSafety ? 'text-amber-300' : 'text-slate-400'
                }`}>
                  {milestone.level}
                </span>

                {isSafety && (
                  <span title="Mốc an toàn">
                    {milestone.level === 15 ? (
                      <Star className={`w-3.5 h-3.5 ${isCurrent ? 'text-slate-950' : 'text-amber-300'}`} />
                    ) : (
                      <ShieldCheck className={`w-3.5 h-3.5 ${isCurrent ? 'text-slate-950' : 'text-cyan-400'}`} />
                    )}
                  </span>
                )}

                <span className="truncate max-w-[95px] sm:max-w-[110px] text-xs sm:text-[12px] font-semibold hidden xs:inline">
                  {milestone.title.replace(/👑|🏆|🎖️/g, '').trim()}
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono tracking-tight text-xs sm:text-sm md:text-[14px]">
                <span className={isCurrent ? 'text-slate-950 font-black text-sm sm:text-base' : isSafety ? 'text-amber-300 font-extrabold' : 'font-bold'}>
                  {milestone.rewardText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-around shrink-0 font-medium">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Mốc 5 &amp; 10
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400" /> Mốc 15 Đỉnh Cao
        </span>
      </div>
    </div>
  );
};
