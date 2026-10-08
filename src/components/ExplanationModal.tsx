import React from 'react';
import { Question, OptionKey } from '../types/quiz';
import { ChemistryDiagram } from './ChemistryDiagram';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, Award, RotateCcw } from 'lucide-react';

interface ExplanationModalProps {
  isOpen: boolean;
  question: Question;
  selectedAnswer: OptionKey | null;
  isCorrect: boolean;
  isGameOver: boolean;
  isMilestone: boolean;
  isVictory: boolean;
  onNextQuestion: () => void;
  onRestart: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  question,
  selectedAnswer,
  isCorrect,
  isGameOver,
  isMilestone,
  isVictory,
  onNextQuestion,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-xl p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 shadow-2xl text-white ${
        isCorrect ? 'border-emerald-500/60 shadow-emerald-500/20' : 'border-rose-500/60 shadow-rose-500/20'
      }`}>
        {/* Status Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-2xl border ${
            isCorrect
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
          }`}>
            {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-2xl font-black ${isCorrect ? 'text-emerald-300' : 'text-rose-400'}`}>
                {isVictory
                  ? '👑 CHIẾN THẮNG ĐỈNH CAO 15/15!'
                  : isMilestone && isCorrect
                  ? '🎉 CHÚC MỪNG VƯỢT MỐC AN TOÀN!'
                  : isCorrect
                  ? 'CHÍNH XÁC HOÀN TOÀN!'
                  : 'RẤT TIẾC, ĐÁP ÁN CHƯA ĐÚNG!'}
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              {isCorrect 
                ? `Bạn đã xuất sắc vượt qua Câu số ${question.level}!` 
                : `Lựa chọn của bạn: ${selectedAnswer} | Đáp án chuẩn SGK: ${question.correctAnswer}`}
            </p>
          </div>
        </div>

        {/* Answer comparison */}
        <div className="mb-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Đáp án đúng của câu hỏi:</span>
            <span className="font-mono text-emerald-400 font-bold">LỰA CHỌN {question.correctAnswer}</span>
          </div>
          <p className="text-emerald-300 font-semibold text-base">
            {question.options[question.correctAnswer]}
          </p>
        </div>

        {/* Chemical Diagram if available */}
        {question.diagramType && (
          <div className="mb-4">
            <ChemistryDiagram
              type={question.diagramType}
              caption={question.diagramCaption}
            />
          </div>
        )}

        {/* Text and Source Explanation */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Giải thích khoa học chuẩn SGK:</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line pl-3 border-l-2 border-cyan-500/40">
            {question.explanation}
          </p>
          <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Căn cứ tài liệu:</span>
            <span className="text-amber-400 font-medium">{question.sourceReference}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center gap-3">
          {isGameOver ? (
            <button
              onClick={onRestart}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <RotateCcw className="w-5 h-5" />
              <span>CHƠI LẠI TỪ ĐẦU</span>
            </button>
          ) : isVictory ? (
            <button
              onClick={onRestart}
              className="flex-1 py-3.5 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base rounded-xl shadow-xl shadow-amber-500/40 flex items-center justify-center gap-2 transition hover:brightness-110 active:scale-98"
            >
              <Award className="w-6 h-6 text-slate-950" />
              <span>VINH DANH NHÀ VÔ ĐỊCH - BẮT ĐẦU VÁN MỚI</span>
            </button>
          ) : (
            <button
              onClick={onNextQuestion}
              className="flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-base rounded-xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <span>TIẾP TỤC CÂU SỐ {question.level + 1}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
