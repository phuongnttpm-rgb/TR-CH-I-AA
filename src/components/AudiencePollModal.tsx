import React from 'react';
import { AudiencePollResult, OptionKey } from '../types/quiz';
import { Users, X } from 'lucide-react';

interface AudiencePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  pollResults: AudiencePollResult;
  questionNumber: number;
}

export const AudiencePollModal: React.FC<AudiencePollModalProps> = ({
  isOpen,
  onClose,
  pollResults,
  questionNumber,
}) => {
  if (!isOpen) return null;

  const options: OptionKey[] = ['A', 'B', 'C', 'D'];
  const maxPercent = Math.max(pollResults.A, pollResults.B, pollResults.C, pollResults.D);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/40 text-cyan-400">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-cyan-300">Ý KIẾN KHÁN GIẢ TRƯỜNG QUAY</h3>
            <p className="text-xs text-slate-300">Kết quả bình chọn trực tiếp từ 100 khán giả &amp; học sinh cho Câu {questionNumber}</p>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="grid grid-cols-4 gap-4 items-end h-56 pt-8 pb-4 px-2 bg-slate-950/60 rounded-xl border border-slate-800">
          {options.map((opt) => {
            const percent = pollResults[opt];
            const isHighest = percent === maxPercent;

            return (
              <div key={opt} className="flex flex-col items-center h-full justify-end group">
                <span className={`text-sm font-extrabold mb-1.5 transition-all ${isHighest ? 'text-cyan-300 text-base scale-110' : 'text-slate-400'}`}>
                  {percent}%
                </span>

                {/* Animated bar */}
                <div className="w-full max-w-[50px] bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5 relative">
                  <div
                    className={`w-full rounded-t-md transition-all duration-1000 ease-out ${
                      isHighest
                        ? 'bg-gradient-to-t from-cyan-600 via-cyan-400 to-amber-300 shadow-lg shadow-cyan-500/50'
                        : 'bg-gradient-to-t from-indigo-900 to-indigo-600'
                    }`}
                    style={{ height: `${percent * 1.8}%` }}
                  />
                </div>

                {/* Label badge */}
                <div className={`mt-2 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border ${
                  isHighest
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-400/40 ring-2 ring-cyan-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {opt}
                </div>
              </div>
            );
          })}
        </div>

        {/* Advice text */}
        <div className="mt-4 p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-slate-300 text-center">
          💡 Đa số khán giả chọn đáp án <span className="text-amber-400 font-bold">
            {options.find(o => pollResults[o] === maxPercent)} ({maxPercent}%)
          </span>. Hãy cân nhắc kỹ trước khi bấm <span className="text-amber-300 font-bold">CHỐT ĐÁP ÁN</span>!
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30 transition transform active:scale-98"
        >
          TIẾP TỤC TRẢ LỜI
        </button>
      </div>
    </div>
  );
};
