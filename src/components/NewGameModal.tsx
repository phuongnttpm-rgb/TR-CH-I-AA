import React, { useState } from 'react';
import { Question } from '../types/quiz';
import { Sparkles, FileText, Youtube, BookOpen, AlertCircle, Loader2, X, CheckCircle } from 'lucide-react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameGenerated: (newQuestions: Question[], topicName: string) => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onGameGenerated,
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<string>('amino_acid');
  const [sourceText, setSourceText] = useState<string>('');
  const [sourceTitle, setSourceTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'amino_acid',
      title: 'Bài 9: Amino acid và Peptide (SGK Hóa 12 KNTT)',
      desc: '15 câu hỏi phân hóa từ Nhận biết cấu tạo, ion lưỡng cực đến phản ứng màu biuret và thủy phân',
      pages: 'Trang 41 - 46',
    },
    {
      id: 'ester_lipid',
      title: 'Bài 1: Ester - Lipid (SGK Hóa 12 KNTT)',
      desc: 'Khái niệm ester, phản ứng xà phòng hóa, chất béo, acid béo no/không no, omega-3, omega-6',
      pages: 'Trang 6 - 13',
    },
    {
      id: 'carbohydrate',
      title: 'Bài 4: Glucose và Fructose (SGK Hóa 12 KNTT)',
      desc: 'Cấu tạo mạch hở/vòng, tính chất polyalcohol, phản ứng tráng bạc thuốc thử Tollens, lên men',
      pages: 'Trang 20 - 25',
    },
    {
      id: 'amine',
      title: 'Bài 8: Amine (SGK Hóa 12 KNTT)',
      desc: 'Bậc amine, tính base, phản ứng với acid, tạo phức Cu(OH)2, phản ứng với nitrous acid & bromine',
      pages: 'Trang 35 - 40',
    },
    {
      id: 'polymer',
      title: 'Bài 12: Đại Cương Về Polymer (SGK Hóa 12 KNTT)',
      desc: 'Phản ứng trùng hợp, trùng ngưng, cao su lưu hóa, tính chất cơ lý và vật liệu polymer',
      pages: 'Trang 51 - 56',
    },
    {
      id: 'pin_dien',
      title: 'Bài 15: Pin Điện và Điện Phân (SGK Hóa 12 KNTT)',
      desc: 'Cặp oxi hóa - khử, thế điện cực chuẩn, pin Galvani Zn-Cu, cầu muối, thứ tự điện phân',
      pages: 'Trang 67 - 77',
    },
  ];

  const handleGenerateFromPreset = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'preset',
          presetId: selectedPreset,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.questions || data.questions.length < 15) {
        throw new Error(data.error || 'Không thể tạo đủ 15 câu hỏi từ nguồn đã chọn');
      }

      const presetItem = presets.find((p) => p.id === selectedPreset);
      onGameGenerated(data.questions, presetItem?.title || 'Gameshow Mới');
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Lỗi kết nối khi tạo câu hỏi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFromCustom = async () => {
    if (sourceText.trim().length < 120) {
      setErrorMessage('Nguồn tài liệu quá ngắn (cần tối thiểu 120 ký tự). Vui lòng dán thêm nội dung tài liệu SGK hoặc kịch bản/transcript video YouTube để đảm bảo đủ dữ liệu tạo 15 câu hỏi chuẩn xác!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'custom',
          sourceText: sourceText.trim(),
          sourceTitle: sourceTitle.trim() || 'Tài liệu giáo viên cung cấp',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.questions) {
        throw new Error(data.error || 'Nguồn tài liệu chưa đủ dữ liệu để tạo trọn vẹn 15 câu hỏi');
      }

      onGameGenerated(data.questions, sourceTitle.trim() || 'Gameshow Tùy Chỉnh');
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Lỗi khi tạo câu hỏi từ tài liệu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl shadow-amber-950/80 text-white max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-black text-amber-300">TẠO GAME MỚI TỪ NGUỒN TÀI LIỆU</h3>
              <p className="text-xs text-slate-300">
                Tự động tạo 15 câu hỏi từ dễ đến khó chỉ từ tài liệu chỉ định (không tự bịa kiến thức)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex gap-2 mt-4 p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
          <button
            onClick={() => { setActiveTab('preset'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'preset'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>CHUYÊN ĐỀ SGK HÓA HỌC 12</span>
          </button>

          <button
            onClick={() => { setActiveTab('custom'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
              activeTab === 'custom'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>DÁN VĂN BẢN / YOUTUBE TRANSCRIPT</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-600/80 text-rose-200 text-xs flex items-start gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Thông báo nguồn:</span> {errorMessage}
            </div>
          </div>
        )}

        {/* Body content */}
        <div className="flex-1 overflow-y-auto py-4">
          {activeTab === 'preset' ? (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-400 mb-2">
                Chọn một chuyên đề trong sách giáo khoa Hóa học 12 đã tải lên để tạo trọn bộ 15 câu hỏi gameshow:
              </p>
              {presets.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                        {preset.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{preset.desc}</p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-mono shrink-0 ml-3">
                      {preset.pages}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tiêu đề bài học / Chủ đề video:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tóm tắt bài giảng Amino Acid &amp; Peptide - Thầy Hoàng"
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Dán nội dung tài liệu hoặc kịch bản video YouTube:</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Tối thiểu 120 ký tự ({sourceText.length} ký tự)
                  </span>
                </label>
                <textarea
                  rows={8}
                  placeholder="Dán toàn bộ văn bản tài liệu, ghi chú hoặc phụ đề bài giảng YouTube tại đây... AI sẽ bám sát 100% nội dung được cung cấp để sinh ra 15 câu hỏi gameshow, tuyệt đối không tự thêm kiến thức ngoài nguồn."
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm focus:border-amber-400 focus:outline-none resize-none font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 hidden sm:inline">
            ⚙️ Tự động chia tỉ lệ 15 mức: Dễ (1-5) ➔ Trung bình (6-10) ➔ Khó (11-15)
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              HỦY BỎ
            </button>

            <button
              onClick={activeTab === 'preset' ? handleGenerateFromPreset : handleGenerateFromCustom}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>ĐANG TẠO 15 CÂU HỎI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>BẮT ĐẦU TẠO GAME MỚI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
