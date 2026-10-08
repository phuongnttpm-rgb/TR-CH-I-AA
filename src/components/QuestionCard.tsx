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
    <div className="flex flex-col w-full mx-auto justify-between gap-3 sm:gap-4 my-auto py-1 px-1 sm:px-2">
      {/* Main Question Display Box - expanded, prominent, high readability for projector */}
      <div className="relative px-6 py-4 sm:py-5 md:py-6 rounded-2xl bg-gradient-to-b from-indigo-950/95 via-slate-900/95 to-slate-950/95 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/15 backdrop-blur-md text-center shrink-0">
        {/* Glow corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-2xl pointer-events-none" />

        {/* Large Prominent Question Text - visible from back of classroom */}
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[26px] xl:text-[28px] font-black text-white leading-snug tracking-wide select-none drop-shadow-md">
          {question.question}
        </h2>

        {/* Compact Chemical Diagram */}
        {question.diagramType && (
          <div className="mt-2 max-w-sm sm:max-w-md mx-auto">
            <ChemistryDiagram
              type={question.diagramType}
              caption={question.diagramCaption}
            />
          </div>
        )}
      </div>

      {/* 4 Options Grid (A, B, C, D) - EXPANDED WIDTH & PROMINENT FONT SIZE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {optionKeys.map((key) => {
          const isSelected = selectedOption === key;
          const isHidden = hiddenOptions.includes(key);
          const isCorrectAnswer = question.correctAnswer === key;

          // State styling
          let buttonStyle = 'bg-slate-900/90 hover:bg-slate-800/95 text-slate-100 border-slate-700/80 hover:border-cyan-400 shadow-lg';
          let badgeStyle = 'bg-slate-800 text-cyan-300 border-slate-700';

          if (isHidden) {
            buttonStyle = 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed opacity-25 pointer-events-none';
            badgeStyle = 'bg-slate-900 text-slate-600 border-slate-800';
          } else if (isRevealed) {
            if (isCorrectAnswer) {
              // Glowing Neon Green for Correct
              buttonStyle = 'bg-emerald-950/95 text-emerald-100 border-emerald-400 shadow-xl shadow-emerald-500/60 ring-4 ring-emerald-400 animate-pulse font-black';
              badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-300 font-black';
            } else if (isSelected && !isCorrectAnswer) {
              // Glowing Neon Red for Wrong Selection
              buttonStyle = 'bg-rose-950/95 text-rose-100 border-rose-500 shadow-xl shadow-rose-500/60 ring-4 ring-rose-500 font-black';
              badgeStyle = 'bg-rose-600 text-white border-rose-400 font-black';
            } else {
              buttonStyle = 'bg-slate-950/60 text-slate-500 border-slate-800 opacity-40';
              badgeStyle = 'bg-slate-900 text-slate-600 border-slate-800';
            }
          } else if (isLocking && isSelected) {
            // Suspense countdown: Intense Amber Flash
            buttonStyle = 'bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-950 text-amber-200 border-amber-400 shadow-2xl shadow-amber-500/60 ring-4 ring-amber-400 animate-pulse scale-[1.01] font-black';
            badgeStyle = 'bg-amber-400 text-slate-950 border-amber-300 font-black';
          } else if (isSelected) {
            // Player selected this option, waiting to lock
            buttonStyle = 'bg-amber-950/85 text-amber-100 border-amber-400 shadow-xl shadow-amber-500/40 ring-2 ring-amber-400 font-black';
            badgeStyle = 'bg-amber-400 text-slate-950 border-amber-300 font-black';
          }

          return (
            <button
              key={key}
              disabled={isHidden || isLocking || isRevealed}
              onClick={() => onSelectOption(key)}
              className={`relative flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 text-left active:scale-[0.98] ${buttonStyle}`}
            >
              {/* Option Letter Badge (A, B, C, D) - Extra Large & Prominent */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl shrink-0 flex items-center justify-center font-black text-lg sm:text-xl md:text-2xl border-2 shadow-md ${badgeStyle}`}>
                {key}
              </div>

              {/* Option Content Text - Extra Large font size for projector readability */}
              <div className="flex-1 font-bold text-base sm:text-lg md:text-xl lg:text-[22px] leading-snug">
                {question.options[key]}
              </div>

              {/* Status indicator ping */}
              {isSelected && !isRevealed && !isLocking && (
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* "CHỐT ĐÁP ÁN" Action Button - Prominent */}
      <div className="flex items-center justify-center min-h-[52px]">
        {selectedOption && !isRevealed && (
          <button
            onClick={onLockAnswer}
            disabled={isLocking}
            className={`w-full max-w-xl py-3.5 sm:py-4 px-8 rounded-2xl font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl ${
              isLocking
                ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 ring-4 ring-amber-400/80 animate-pulse cursor-wait'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 hover:scale-105 active:scale-95 shadow-amber-500/50 ring-4 ring-yellow-300'
            }`}
          >
            {isLocking ? (
              <>
                <ShieldAlert className="w-6 h-6 text-slate-950 animate-bounce" />
                <span>ĐANG HỒI HỘP CHỜ KẾT QUẢ...</span>
              </>
            ) : (
              <>
                <Lock className="w-6 h-6 text-slate-950" />
                <span>CHỐT ĐÁP ÁN ({selectedOption})</span>
                <Sparkles className="w-6 h-6 text-slate-950" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
