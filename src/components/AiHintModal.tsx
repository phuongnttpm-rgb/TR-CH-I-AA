import React from 'react';
import { Bot, Sparkles, X, BookOpen, Loader2 } from 'lucide-react';
import { Question } from '../types/quiz';

interface AiHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  hintText: string | null;
  isLoading: boolean;
}

export const AiHintModal: React.FC<AiHintModalProps> = ({
  isOpen,
  onClose,
  question,
  hintText,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/40 text-purple-400 animate-pulse">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-purple-300">TRỢ LÝ CHUYÊN GIA AI</h3>
              <Sparkles className="w-4 h-4 text-amber-300 animate-bounce" />
            </div>
            <p className="text-xs text-slate-300">Tư vấn dựa trên tài liệu SGK Hóa học 12 (Bài 9: Amino acid &amp; peptide)</p>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-36 p-4 rounded-xl bg-slate-950/70 border border-purple-900/50 flex flex-col justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6 text-purple-300 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <p className="text-sm font-medium">Đang tra cứu cơ sở lý thuyết SGK Hóa học 12...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs font-semibold text-purple-300 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Gợi ý chiến thuật &amp; Điểm mấu chốt:</span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line pl-6 border-l-2 border-purple-500/50">
                {hintText || `Theo SGK Hóa học 12 (KNTT), hãy chú ý đến đặc điểm cấu tạo của nhóm chức và số lượng nguyên tử liên kết. ${question.sourceReference}`}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Nguồn tham khảo:</span>
                <span className="text-cyan-400 font-medium">{question.sourceReference}</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition transform active:scale-98"
        >
          ĐÃ HIỂU, TIẾP TỤC TRẬN ĐẤU
        </button>
      </div>
    </div>
  );
};
