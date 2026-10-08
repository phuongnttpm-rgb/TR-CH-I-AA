import React from 'react';
import { Question, OptionKey, GamePhase } from '../types/quiz';
import { ChemistryDiagram } from './ChemistryDiagram';
import { Lock, ShieldAlert, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOption: OptionKey | null;
  onSelectOption: (option: OptionKey) => void;
  onLockAnswer: () => void;
  gamePhase: GamePhase;
  hiddenOptions: OptionKey[]; // from 50:50
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  onLockAnswer,
  gamePhase,
  hiddenOptions,
}) => {
  const optionKeys: OptionKey[] = ['A', 'B', 'C', 'D'];
  const isLocking = gamePhase === 'locking_suspense';
  const isRevealed = gamePhase === 'result_revealed' || gamePhase === 'milestone_reward' || gamePhase === 'game_over' || gamePhase === 'grand_victory';

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto justify-center gap-2.5 sm:gap-3 py-1">
      {/* Main Question Display Box */}
      <div className="relative px-5 py-4 sm:py-5 rounded-2xl bg-gradient-to-b from-indigo-950/95 via-slate-900/95 to-slate-950/95 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/10 backdrop-blur-md text-center shrink-0">
        {/* Glow corner decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl pointer-events-none" />

        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-relaxed tracking-wide select-none">
          {question.question}
        </h2>

        {/* Chemical Diagram preview if relevant to question */}
        {question.diagramType && (
          <div className="mt-2 max-w-md mx-auto">
            <ChemistryDiagram
              type={question.diagramType}
              caption={question.diagramCaption}
            />
          </div>
        )}
      </div>

      {/* 4 Options Grid (A, B, C, D) - 2 columns, 2 rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {optionKeys.map((key) => {
          const isSelected = selectedOption === key;
          const isHidden = hiddenOptions.includes(key);
          const isCorrectAnswer = question.correctAnswer === key;

          // State styling
          let buttonStyle = 'bg-slate-900/85 hover:bg-slate-800/95 text-slate-100 border-slate-700/80 hover:border-cyan-400 shadow-md';
          let badgeStyle = 'bg-slate-800 text-cyan-300 border-slate-700';

          if (isHidden) {
            buttonStyle = 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed opacity-25 pointer-events-none';
            badgeStyle = 'bg-slate-900 text-slate-600 border-slate-800';
          } else if (isRevealed) {
            if (isCorrectAnswer) {
              // Glowing Neon Green for Correct
              buttonStyle = 'bg-emerald-950/95 text-emerald-100 border-emerald-400 shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-400 animate-pulse font-extrabold';
              badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-300 font-black';
            } else if (isSelected && !isCorrectAnswer) {
              // Glowing Neon Red for Wrong Selection
              buttonStyle = 'bg-rose-950/95 text-rose-100 border-rose-500 shadow-lg shadow-rose-500/50 ring-2 ring-rose-500 font-extrabold';
              badgeStyle = 'bg-rose-600 text-white border-rose-400 font-black';
            } else {
              buttonStyle = 'bg-slate-950/60 text-slate-500 border-slate-800 opacity-40';
              badgeStyle = 'bg-slate-900 text-slate-600 border-slate-800';
            }
          } else if (isLocking && isSelected) {
            // Suspense countdown: Intense Amber Flash
            buttonStyle = 'bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-950 text-amber-200 border-amber-400 shadow-2xl shadow-amber-500/50 ring-4 ring-amber-400/80 animate-pulse scale-[1.01] font-bold';
            badgeStyle = 'bg-amber-400 text-slate-950 border-amber-300 font-black';
          } else if (isSelected) {
            // Player selected this option, waiting to lock
            buttonStyle = 'bg-amber-950/80 text-amber-100 border-amber-400 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/80 font-bold';
            badgeStyle = 'bg-amber-400 text-slate-950 border-amber-300 font-black';
          }

          return (
            <button
              key={key}
              disabled={isHidden || isLocking || isRevealed}
              onClick={() => onSelectOption(key)}
              className={`relative flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border-2 transition-all duration-200 text-left active:scale-[0.98] ${buttonStyle}`}
            >
              {/* Option Letter Badge */}
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center font-black text-sm sm:text-base border shadow-inner ${badgeStyle}`}>
                {key}
              </div>

              {/* Option Content Text */}
              <div className="flex-1 font-semibold text-xs sm:text-sm md:text-base leading-snug">
                {question.options[key]}
              </div>

              {/* Status indicator ping */}
              {isSelected && !isRevealed && !isLocking && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* "CHỐT ĐÁP ÁN" Action Button */}
      <div className="flex items-center justify-center pt-1 min-h-[52px]">
        {selectedOption && !isRevealed && (
          <button
            onClick={onLockAnswer}
            disabled={isLocking}
            className={`w-full max-w-md py-3 px-6 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
              isLocking
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 ring-4 ring-amber-400/60 animate-pulse cursor-wait'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 hover:scale-105 active:scale-95 shadow-amber-500/40 ring-2 ring-yellow-300'
            }`}
          >
            {isLocking ? (
              <>
                <ShieldAlert className="w-5 h-5 text-slate-950 animate-bounce" />
                <span>ĐANG HỒI HỘP CHỜ KẾT QUẢ...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 text-slate-950" />
                <span>CHỐT ĐÁP ÁN ({selectedOption})</span>
                <Sparkles className="w-5 h-5 text-slate-950" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
