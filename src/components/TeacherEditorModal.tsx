import React, { useState } from 'react';
import { Question, OptionKey } from '../types/quiz';
import { INITIAL_QUESTIONS, SPARE_QUESTIONS } from '../data/chemQuestions';
import { X, Save, Plus, Trash2, ArrowUpDown, RefreshCw, Check, BookOpen, AlertCircle } from 'lucide-react';

interface TeacherEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSaveQuestions: (newQuestions: Question[]) => void;
}

export const TeacherEditorModal: React.FC<TeacherEditorModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSaveQuestions,
}) => {
  const [editableQuestions, setEditableQuestions] = useState<Question[]>(() => JSON.parse(JSON.stringify(questions)));
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = editableQuestions[selectedIdx] || editableQuestions[0];

  const handleFieldChange = (field: keyof Question, value: unknown) => {
    const updated = [...editableQuestions];
    updated[selectedIdx] = {
      ...updated[selectedIdx],
      [field]: value,
    };
    setEditableQuestions(updated);
  };

  const handleOptionChange = (optKey: OptionKey, value: string) => {
    const updated = [...editableQuestions];
    updated[selectedIdx] = {
      ...updated[selectedIdx],
      options: {
        ...updated[selectedIdx].options,
        [optKey]: value,
      },
    };
    setEditableQuestions(updated);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Khôi phục danh sách câu hỏi gốc từ SGK Hóa học 12 (Bài 9)?')) {
      const reset = JSON.parse(JSON.stringify(INITIAL_QUESTIONS));
      setEditableQuestions(reset);
      setSelectedIdx(0);
    }
  };

  const handleSwapWithSpare = (spareQ: Question) => {
    const updated = [...editableQuestions];
    updated[selectedIdx] = {
      ...spareQ,
      id: updated[selectedIdx].id,
      level: updated[selectedIdx].level,
    };
    setEditableQuestions(updated);
  };

  const handleSave = () => {
    // Ensure exactly 15 questions and valid levels
    const formatted = editableQuestions.slice(0, 15).map((q, i) => ({
      ...q,
      level: i + 1,
    }));
    onSaveQuestions(formatted);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] flex flex-col p-5 rounded-3xl bg-slate-900 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/80 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-500/40 text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-cyan-300">
                CHẾ ĐỘ GIÁO VIÊN: QUẢN LÝ &amp; CHỈNH SỬA BỘ CÂU HỎI
              </h2>
              <p className="text-xs text-slate-400">
                Xem lại, hiệu chỉnh nội dung, đáp án và trích dẫn trang sách trước khi cho học sinh bắt đầu gameshow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
              title="Khôi phục câu hỏi mặc định từ SGK"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khôi phục gốc</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 py-4 overflow-hidden">
          {/* Question List Sidebar (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-1.5 overflow-y-auto pr-1 border-r border-slate-800/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
              Danh sách 15 Câu Hỏi:
            </span>
            {editableQuestions.map((q, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-600/30 text-white border border-cyan-400 font-bold shadow-md'
                      : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-black text-xs ${
                    idx === 4 || idx === 9 || idx === 14
                      ? 'bg-amber-400 text-slate-950'
                      : isSelected
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 truncate text-xs">
                    <p className="truncate font-medium">{q.question}</p>
                    <span className="text-[10px] text-cyan-400/80 font-mono">Đ/A: {q.correctAnswer}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Question Edit Form (8 cols) */}
          {currentQ && (
            <div className="md:col-span-8 flex flex-col gap-3 overflow-y-auto pr-2">
              <div className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-black text-xs border border-cyan-500/40">
                    CÂU {selectedIdx + 1}/15
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Mức độ: {currentQ.difficultyLabel || 'Hóa 12'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-300 font-semibold">Đáp án ĐÚNG:</label>
                  <select
                    value={currentQ.correctAnswer}
                    onChange={(e) => handleFieldChange('correctAnswer', e.target.value as OptionKey)}
                    className="bg-slate-800 text-emerald-300 font-black text-sm px-3 py-1 rounded-lg border border-emerald-500 focus:outline-none"
                  >
                    <option value="A">Đáp án A</option>
                    <option value="B">Đáp án B</option>
                    <option value="C">Đáp án C</option>
                    <option value="D">Đáp án D</option>
                  </select>
                </div>
              </div>

              {/* Question text */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nội dung câu hỏi:
                </label>
                <textarea
                  rows={3}
                  value={currentQ.question}
                  onChange={(e) => handleFieldChange('question', e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(['A', 'B', 'C', 'D'] as OptionKey[]).map((opt) => (
                  <div key={opt} className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                    <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-black text-xs ${
                      currentQ.correctAnswer === opt ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {opt}
                    </span>
                    <input
                      type="text"
                      value={currentQ.options[opt]}
                      onChange={(e) => handleOptionChange(opt, e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Explanation & Source reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Giải thích khoa học (chuẩn SGK):
                  </label>
                  <textarea
                    rows={3}
                    value={currentQ.explanation}
                    onChange={(e) => handleFieldChange('explanation', e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nguồn tham khảo (Bài &amp; Trang SGK):
                    </label>
                    <input
                      type="text"
                      value={currentQ.sourceReference}
                      onChange={(e) => handleFieldChange('sourceReference', e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Diagram picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Hình minh họa hóa học đính kèm:
                    </label>
                    <select
                      value={currentQ.diagramType || ''}
                      onChange={(e) => handleFieldChange('diagramType', e.target.value || undefined)}
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-cyan-300 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="">Không kèm hình</option>
                      <option value="general_structure">Cấu tạo chung amino acid (H₂N-CH(R)-COOH)</option>
                      <option value="zwitterion">Dạng ion lưỡng cực (H₃N⁺-CH(R)-COO⁻)</option>
                      <option value="glycine">Glycine (Gly) - M=75</option>
                      <option value="alanine">Alanine (Ala) - M=89</option>
                      <option value="valine">Valine (Val) - M=117</option>
                      <option value="lysine">Lysine (Lys) - 2 nhóm NH₂</option>
                      <option value="glutamic_acid">Glutamic acid (Glu) - 2 nhóm COOH</option>
                      <option value="peptide_bond">Liên kết peptide (-CO-NH-)</option>
                      <option value="tripeptide">Tripeptide Val-Gly-Ala</option>
                      <option value="biuret">Phản ứng màu biuret tím</option>
                      <option value="electrophoresis">Hiện tượng điện di theo pH</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Spare question swap helper */}
              <div className="mt-2 p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
                  Hoán đổi nhanh với câu hỏi dự phòng từ Bài 9:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SPARE_QUESTIONS.map((spare, sIdx) => (
                    <button
                      key={spare.id}
                      onClick={() => handleSwapWithSpare(spare)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-900/40 hover:bg-indigo-800 text-xs text-indigo-200 border border-indigo-700 transition"
                    >
                      Dự phòng #{sIdx + 1}: {spare.question.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
            <span>Mọi thay đổi sẽ được áp dụng trực tiếp cho ván đấu ngay sau khi lưu.</span>
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              HỦY BỎ
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition active:scale-95"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>ĐÃ LƯU THÀNH CÔNG!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>LƯU &amp; ÁP DỤNG BỘ CÂU HỎI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
