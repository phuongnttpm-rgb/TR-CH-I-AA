/**
 * Đấu Trường Hóa Học 12 - Gameshow Triệu Phú Tri Thức
 * Strictly grounded in Textbook "Hóa học 12 Kết nối tri thức với cuộc sống"
 * Bài 9: Amino acid và Peptide (Trang 41 - 46, Ôn tập Chương 3 trang 49-50)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Edit3, 
  PlusCircle, 
  Clock, 
  Sparkles, 
  FlaskConical, 
  ShieldCheck, 
  Award, 
  ChevronRight,
  BookOpen,
  Home
} from 'lucide-react';

import { Question, OptionKey, GamePhase, LifelineState, AudiencePollResult } from './types/quiz';
import { INITIAL_QUESTIONS, SPARE_QUESTIONS, PRIZE_LADDER } from './data/chemQuestions';
import { sounds } from './utils/sound';

import { QuestionCard } from './components/QuestionCard';
import { Ladder } from './components/Ladder';
import { Lifelines } from './components/Lifelines';
import { AudiencePollModal } from './components/AudiencePollModal';
import { AiHintModal } from './components/AiHintModal';
import { ExplanationModal } from './components/ExplanationModal';
import { TeacherEditorModal } from './components/TeacherEditorModal';
import { NewGameModal } from './components/NewGameModal';

export default function App() {
  // Game questions & current topic
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [topicTitle, setTopicTitle] = useState<string>('Bài 9: Amino acid và Peptide (SGK Hóa 12 KNTT)');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Gameplay state
  const [gamePhase, setGamePhase] = useState<GamePhase>('welcome');
  const [selectedOption, setSelectedOption] = useState<OptionKey | null>(null);
  const [hiddenOptions, setHiddenOptions] = useState<OptionKey[]>([]); // 50:50
  const [lifelines, setLifelines] = useState<LifelineState>({
    fiftyFifty: true,
    audiencePoll: true,
    aiHint: true,
    switchQuestion: true,
  });

  // Timer state
  const DEFAULT_TIME = 45; // 45 seconds per question
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIME);
  const [timerMode, setTimerMode] = useState<'timed' | 'unlimited'>('timed');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio & Fullscreen state
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Modals state
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState<boolean>(false);
  const [audiencePollResults, setAudiencePollResults] = useState<AudiencePollResult>({ A: 25, B: 25, C: 25, D: 25 });
  const [isAiHintModalOpen, setIsAiHintModalOpen] = useState<boolean>(false);
  const [aiHintText, setAiHintText] = useState<string | null>(null);
  const [isAiHintLoading, setIsAiHintLoading] = useState<boolean>(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);
  const [isTeacherEditorOpen, setIsTeacherEditorOpen] = useState<boolean>(false);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState<boolean>(false);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);

  // Current active question
  const currentQ = questions[currentQuestionIndex] || questions[0];
  const currentPrize = PRIZE_LADDER.find((p) => p.level === currentQ?.level)?.rewardText || '0 VNĐ';

  // Trigger grand victory fireworks
  const triggerGrandConfetti = useCallback(() => {
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#06b6d4', '#eab308', '#ec4899', '#10b981'],
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#06b6d4', '#eab308', '#ec4899', '#10b981'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Trigger milestone confetti
  const triggerMilestoneConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#facc15', '#38bdf8', '#34d399'],
    });
  }, []);

  // Stop Text-to-speech if running
  const stopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // SpeechSynthesis for Question and choices
  const toggleSpeech = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ tính năng đọc giọng nói Web Speech API.');
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    const textToRead = `Câu số ${currentQ.level}. ${currentQ.question}. Đáp án A: ${currentQ.options.A}. Đáp án B: ${currentQ.options.B}. Đáp án C: ${currentQ.options.C}. Đáp án D: ${currentQ.options.D}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;

    // Pick Vietnamese voice if available
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VIE'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [currentQ, isSpeaking, stopSpeech]);

  // Handle Fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Audio Mute toggle
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  // Timer tick effect
  useEffect(() => {
    if (gamePhase === 'question_active' || gamePhase === 'answer_selected') {
      if (timerMode === 'unlimited') return;

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeOut();
            return 0;
          }
          if (prev <= 6) {
            sounds.playTick(true);
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [gamePhase, timerMode]);

  // Timeout handler: Treat as wrong answer
  const handleTimeOut = () => {
    sounds.playWrong();
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 600);
    setGamePhase('game_over');
    setIsExplanationOpen(true);
  };

  // Start new game session
  const startNewGame = (customQuestions?: Question[], customTitle?: string) => {
    stopSpeech();
    if (customQuestions && customQuestions.length >= 15) {
      setQuestions(customQuestions);
    }
    if (customTitle) {
      setTopicTitle(customTitle);
    }
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHiddenOptions([]);
    setTimeLeft(DEFAULT_TIME);
    setLifelines({
      fiftyFifty: true,
      audiencePoll: true,
      aiHint: true,
      switchQuestion: true,
    });
    setGamePhase('question_active');
    sounds.startTensionDrone('low');
  };

  // User clicks an option
  const handleSelectOption = (key: OptionKey) => {
    if (gamePhase !== 'question_active' && gamePhase !== 'answer_selected') return;
    sounds.playSelect();
    setSelectedOption(key);
    setGamePhase('answer_selected');
  };

  // User clicks "CHỐT ĐÁP ÁN"
  const handleLockAnswer = () => {
    if (!selectedOption || gamePhase !== 'answer_selected') return;
    stopSpeech();

    // Enter dramatic tension locking phase
    setGamePhase('locking_suspense');
    sounds.playFinalAnswerLock();

    // 2.2 seconds suspense heartbeat build-up
    setTimeout(() => {
      evaluateAnswer();
    }, 2200);
  };

  // Evaluate the locked answer
  const evaluateAnswer = () => {
    const isCorrect = selectedOption === currentQ.correctAnswer;
    const isFinalQuestion = currentQuestionIndex === 14;
    const isMilestone = currentQ.level === 5 || currentQ.level === 10;

    if (isCorrect) {
      if (isFinalQuestion) {
        // Conquered Question 15!
        sounds.playVictory();
        triggerGrandConfetti();
        setGamePhase('grand_victory');
      } else if (isMilestone) {
        sounds.playCorrect(true);
        triggerMilestoneConfetti();
        setGamePhase('milestone_reward');
      } else {
        sounds.playCorrect(false);
        setGamePhase('result_revealed');
      }
    } else {
      // Wrong answer
      sounds.playWrong();
      setIsScreenShaking(true);
      setTimeout(() => setIsScreenShaking(false), 600);
      setGamePhase('game_over');
    }

    setIsExplanationOpen(true);
  };

  // Move to next question after reviewing explanation
  const handleNextQuestion = () => {
    setIsExplanationOpen(false);
    stopSpeech();
    const nextIdx = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIdx);
    setSelectedOption(null);
    setHiddenOptions([]);
    setTimeLeft(DEFAULT_TIME);
    setGamePhase('question_active');

    // Dynamic music intensity based on level
    if (nextIdx >= 10) {
      sounds.startTensionDrone('high');
    } else if (nextIdx >= 5) {
      sounds.startTensionDrone('medium');
    } else {
      sounds.startTensionDrone('low');
    }
  };

  // LIFELINES

  // 1. 50:50 Lifeline
  const handleUseFiftyFifty = () => {
    if (!lifelines.fiftyFifty || (gamePhase !== 'question_active' && gamePhase !== 'answer_selected')) return;
    sounds.playLifeline();

    const incorrectKeys: OptionKey[] = (['A', 'B', 'C', 'D'] as OptionKey[]).filter(
      (k) => k !== currentQ.correctAnswer
    );

    // Shuffle and pick 2 incorrect options to hide
    const shuffled = incorrectKeys.sort(() => 0.5 - Math.random());
    const toHide = shuffled.slice(0, 2);

    setHiddenOptions(toHide);
    setLifelines((prev) => ({ ...prev, fiftyFifty: false }));

    // Deselect if user had selected one of the hidden options
    if (selectedOption && toHide.includes(selectedOption)) {
      setSelectedOption(null);
      setGamePhase('question_active');
    }
  };

  // 2. Audience Poll Lifeline
  const handleUseAudiencePoll = () => {
    if (!lifelines.audiencePoll || (gamePhase !== 'question_active' && gamePhase !== 'answer_selected')) return;
    sounds.playLifeline();

    // Realistic distribution favoring the correct answer
    const correct = currentQ.correctAnswer;
    const remainingKeys = (['A', 'B', 'C', 'D'] as OptionKey[]).filter((k) => k !== correct);

    // Higher level = more variance in audience vote
    const level = currentQ.level;
    const correctScore = Math.max(48, Math.min(88, 88 - level * 2.5 + Math.floor(Math.random() * 8)));
    const remainingTotal = 100 - correctScore;

    const r1 = Math.floor(Math.random() * (remainingTotal - 6));
    const r2 = Math.floor(Math.random() * (remainingTotal - r1 - 3));
    const r3 = remainingTotal - r1 - r2;

    const poll: AudiencePollResult = {
      A: 0, B: 0, C: 0, D: 0,
    };
    poll[correct] = correctScore;
    poll[remainingKeys[0]] = r1;
    poll[remainingKeys[1]] = r2;
    poll[remainingKeys[2]] = r3;

    setAudiencePollResults(poll);
    setIsAudienceModalOpen(true);
    setLifelines((prev) => ({ ...prev, audiencePoll: false }));
  };

  // 3. AI Hint Lifeline
  const handleUseAiHint = async () => {
    if (!lifelines.aiHint || (gamePhase !== 'question_active' && gamePhase !== 'answer_selected')) return;
    sounds.playLifeline();

    setIsAiHintModalOpen(true);
    setIsAiHintLoading(true);
    setLifelines((prev) => ({ ...prev, aiHint: false }));

    try {
      const res = await fetch('/api/ai-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQ }),
      });
      const data = await res.json();
      setAiHintText(data.hint || null);
    } catch {
      setAiHintText(
        `Gợi ý từ SGK: Hãy chú ý định nghĩa và công thức cấu tạo của chất được nêu trong ${currentQ.sourceReference}. Đặc biệt lưu ý số lượng nhóm chức và tính chất đặc trưng!`
      );
    } finally {
      setIsAiHintLoading(false);
    }
  };

  // 4. Switch Question Lifeline
  const handleUseSwitchQuestion = () => {
    if (!lifelines.switchQuestion || (gamePhase !== 'question_active' && gamePhase !== 'answer_selected')) return;
    sounds.playLifeline();

    // Find a spare question from same difficulty pool
    const spare = SPARE_QUESTIONS.find((sq) => !questions.some((q) => q.id === sq.id)) || SPARE_QUESTIONS[0];

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...spare,
      level: currentQ.level,
      id: currentQ.id + 1000,
    };

    setQuestions(updatedQuestions);
    setSelectedOption(null);
    setHiddenOptions([]);
    setTimeLeft(DEFAULT_TIME);
    setLifelines((prev) => ({ ...prev, switchQuestion: false }));
  };

  return (
    <div className={`h-screen max-h-screen overflow-hidden bg-[#050814] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black ${
      isScreenShaking ? 'animate-shake' : ''
    }`}>
      {/* Background Neon Grid & Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-cyan-600/15 via-indigo-600/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[400px] bg-purple-900/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* TOP HEADER & CONTROL DECK (ĐẨY TOÀN BỘ 2 DÃY LÊN TRÊN ĐỂ GIẢI PHÓNG KHU VỰC CÂU HỎI) */}
      <header className="relative z-20 w-full bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/40 shrink-0">
        {/* Row 1: Brand & Top Utilities */}
        <div className="px-3 sm:px-5 py-2 flex items-center justify-between border-b border-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30">
              <FlaskConical className="w-4 h-4 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-black tracking-wider bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                  ĐẤU TRƯỜNG HÓA HỌC 12
                </h1>
                <span className="hidden md:inline px-1.5 py-0.2 rounded text-[9px] font-black bg-cyan-950 text-cyan-300 border border-cyan-800">
                  SGK KNTT
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] text-slate-400 font-medium hidden lg:inline mr-2 max-w-xs truncate">
              📖 {topicTitle}
            </span>

            {/* Teacher Mode Button */}
            <button
              onClick={() => setIsTeacherEditorOpen(true)}
              title="Chế độ Giáo Viên: Xem & Sửa câu hỏi"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/80 text-xs font-bold transition shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Giáo Viên</span>
            </button>

            {/* New Game Button */}
            <button
              onClick={() => setIsNewGameModalOpen(true)}
              title="Tạo gameshow mới từ SGK hoặc tài liệu/YouTube"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-600/60 text-xs font-bold transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tạo Game Mới</span>
            </button>

            {/* Sound Mute */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Bật âm thanh gameshow' : 'Tắt âm thanh'}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Fullscreen Projector Toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Trình chiếu Toàn Màn Hình (Máy chiếu lớp học)'}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            >
              {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Home / Reset */}
            {gamePhase !== 'welcome' && (
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn quay về màn hình chính?')) {
                    stopSpeech();
                    setGamePhase('welcome');
                    sounds.stopTensionDrone();
                  }
                }}
                title="Quay về trang bắt đầu"
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
              >
                <Home className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2 (DÃY 1 & DÃY 2 ĐƯỢC ĐẨY LÊN ĐÂY TRONG LÚC ĐẤU): Question Level + Prize + 4 Lifelines + Timer + Voice */}
        {gamePhase !== 'welcome' && (
          <div className="px-3 sm:px-5 py-1.5 bg-slate-950/95 flex flex-wrap items-center justify-between gap-2 shadow-inner">
            {/* Dãy Trái: CÂU X/15, Mức độ, Mức thưởng */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 font-black text-white text-xs sm:text-sm shadow-md shadow-cyan-600/30">
                CÂU {currentQ.level}/15
              </span>

              <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold text-xs hidden sm:inline">
                {currentQ.difficultyLabel || 'Hóa học 12'}
              </span>

              <span className="font-mono font-black text-amber-300 text-xs sm:text-sm md:text-base tracking-tight">
                {currentPrize}
              </span>
            </div>

            {/* Dãy Giữa: 4 Quyền Trợ Giúp (50:50, Khán Giả, AI Gợi Ý, Đổi Câu) */}
            <div className="flex items-center shrink-0">
              <Lifelines
                lifelines={lifelines}
                onUseFiftyFifty={handleUseFiftyFifty}
                onUseAudiencePoll={handleUseAudiencePoll}
                onUseAiHint={handleUseAiHint}
                onUseSwitchQuestion={handleUseSwitchQuestion}
                disabled={gamePhase === 'locking_suspense' || isExplanationOpen}
              />
            </div>

            {/* Dãy Phải: Đồng Hồ Đếm Ngược + Đọc Câu Hỏi */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Countdown Dial */}
              <div 
                onClick={() => setTimerMode((prev) => (prev === 'timed' ? 'unlimited' : 'timed'))}
                title={timerMode === 'timed' ? 'Bấm để đổi sang chế độ Vô hạn giờ' : 'Bấm để bật đếm ngược 45s'}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-mono font-black text-xs sm:text-sm cursor-pointer transition-all ${
                  timerMode === 'unlimited'
                    ? 'bg-slate-900 text-slate-400 border-slate-700'
                    : timeLeft <= 10
                    ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse shadow-md shadow-rose-900/50'
                    : 'bg-slate-900 text-cyan-300 border-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{timerMode === 'timed' ? `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}` : 'Vô Hạn'}</span>
              </div>

              {/* Read Question Speech Button */}
              <button
                onClick={toggleSpeech}
                title={isSpeaking ? 'Dừng đọc' : 'Đọc câu hỏi bằng giọng nói'}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  isSpeaking
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                <span className="hidden md:inline">{isSpeaking ? 'Dừng đọc' : 'Đọc câu hỏi'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA - TOÀN BỘ KHÔNG GIAN DÀNH TRỌN CHO CÂU HỎI VÀ ĐÁP ÁN (KHÔNG CẦN CUỘN CHUỘT) */}
      <main className="relative z-10 flex-1 min-h-0 overflow-hidden flex flex-col p-2 sm:p-3 max-w-7xl mx-auto w-full">
        {/* VIEW 1: WELCOME SCREEN */}
        {gamePhase === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-auto py-4 overflow-y-auto">
            {/* Visual Halo & Badge */}
            <div className="relative mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center p-1 shadow-2xl shadow-cyan-500/30 animate-pulse-glow">
                <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center">
                  <FlaskConical className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                15 CÂU
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
              ĐẤU TRƯỜNG HÓA HỌC 12
            </h2>

            <p className="text-sm sm:text-base text-cyan-300 font-bold mb-2">
              BẬC THẦY TRI THỨC - CHINH PHỤC ĐỈNH CAO 150 TRIỆU ĐIỂM
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-800/80 text-xs text-slate-300 mb-5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Chuyên đề SGK: <strong>{topicTitle}</strong></span>
            </div>

            {/* Gameshow Rules Card */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-left">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase mb-1">
                  <ShieldCheck className="w-4 h-4" /> 3 Mốc An Toàn
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vượt qua <strong>Câu 5</strong> (2M) và <strong>Câu 10</strong> (22M) để giữ chắc phần thưởng, hướng tới <strong>Câu 15</strong> (150M)!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs uppercase mb-1">
                  <Sparkles className="w-4 h-4" /> 4 Quyền Trợ Giúp
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gồm <strong>50:50</strong>, <strong>Hỏi Khán Giả</strong>, <strong>AI Gợi Ý</strong> từ SGK và <strong>Đổi Câu Hỏi</strong> khi gặp thế bí.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs uppercase mb-1">
                  <Award className="w-4 h-4" /> 100% Chuẩn SGK
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mọi câu hỏi, công thức hóa học và giải thích đều bám sát từng trang sách <strong>Hóa học 12 Kết nối tri thức</strong>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => startNewGame()}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base tracking-wide shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition transform hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>BẮT ĐẦU CHƠI NGAY</span>
              </button>

              <button
                onClick={() => setIsTeacherEditorOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition hover:border-cyan-400 active:scale-95"
              >
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>XEM &amp; SỬA BỘ CÂU HỎI</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE GAMESHOW ARENA - FULLY CONTAINED IN ONE VIEWPORT */}
        {gamePhase !== 'welcome' && (
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            {/* Left/Center Column: Spacious Question & Answers Area (9 cols) */}
            <div className="lg:col-span-9 flex flex-col justify-between h-full min-h-0 overflow-hidden">
              {/* Central Question & Options Card (Fits entirely on single page) */}
              <div className="flex-1 min-h-0 flex flex-col justify-center">
                <QuestionCard
                  question={currentQ}
                  selectedOption={selectedOption}
                  onSelectOption={handleSelectOption}
                  onLockAnswer={handleLockAnswer}
                  gamePhase={gamePhase}
                  hiddenOptions={hiddenOptions}
                />
              </div>

              {/* Status info bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pt-1 border-t border-slate-900/80 shrink-0">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Mốc an toàn gần nhất:{' '}
                  <strong className="text-slate-200">
                    {currentQ.level > 10 ? 'Mốc 10 (22 Triệu)' : currentQ.level > 5 ? 'Mốc 5 (2 Triệu)' : 'Khởi đầu'}
                  </strong>
                </span>

                <span className="text-cyan-400/90 font-mono truncate max-w-sm">
                  {currentQ.sourceReference}
                </span>
              </div>
            </div>

            {/* Right Column: 15-tier Ladder (3 cols) */}
            <div className="lg:col-span-3 h-full min-h-0 overflow-hidden">
              <Ladder
                currentLevel={currentQ.level}
                isAnswerLocked={gamePhase === 'locking_suspense'}
              />
            </div>
          </div>
        )}
      </main>

      {/* COMPACT FOOTER */}
      <footer className="relative z-10 w-full px-4 py-1.5 border-t border-slate-900 bg-slate-950/90 text-[10px] text-slate-500 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span>© 2026 Đấu Trường Hóa Học 12</span>
          <span>•</span>
          <span>Hóa học 12 KNTT (NXB Giáo Dục Việt Nam)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-500/80 font-mono">16:9 Cinema &amp; Projector Optimized (100% Single Screen)</span>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Audience Poll Modal */}
      <AudiencePollModal
        isOpen={isAudienceModalOpen}
        onClose={() => setIsAudienceModalOpen(false)}
        pollResults={audiencePollResults}
        questionNumber={currentQ.level}
      />

      {/* 2. AI Hint Modal */}
      <AiHintModal
        isOpen={isAiHintModalOpen}
        onClose={() => setIsAiHintModalOpen(false)}
        question={currentQ}
        hintText={aiHintText}
        isLoading={isAiHintLoading}
      />

      {/* 3. Explanation & Result Outcome Modal */}
      <ExplanationModal
        isOpen={isExplanationOpen}
        question={currentQ}
        selectedAnswer={selectedOption}
        isCorrect={selectedOption === currentQ.correctAnswer}
        isGameOver={gamePhase === 'game_over'}
        isMilestone={currentQ.level === 5 || currentQ.level === 10}
        isVictory={gamePhase === 'grand_victory'}
        onNextQuestion={handleNextQuestion}
        onRestart={() => {
          setIsExplanationOpen(false);
          startNewGame();
        }}
      />

      {/* 4. Teacher Editor Modal */}
      <TeacherEditorModal
        isOpen={isTeacherEditorOpen}
        onClose={() => setIsTeacherEditorOpen(false)}
        questions={questions}
        onSaveQuestions={(newQuestions) => {
          setQuestions(newQuestions);
          setCurrentQuestionIndex(0);
          setSelectedOption(null);
          setGamePhase('question_active');
        }}
      />

      {/* 5. Create New Game from Source Modal */}
      <NewGameModal
        isOpen={isNewGameModalOpen}
        onClose={() => setIsNewGameModalOpen(false)}
        onGameGenerated={(newQuestions, newTitle) => {
          startNewGame(newQuestions, newTitle);
        }}
      />
    </div>
  );
}
