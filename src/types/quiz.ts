export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: number;
  level: number; // 1 to 15
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: OptionKey;
  explanation: string;
  sourceReference: string; // e.g. "SGK Hóa học 12 KNTT - Bài 9, Trang 41"
  diagramType?: 'general_structure' | 'zwitterion' | 'glycine' | 'alanine' | 'valine' | 'lysine' | 'glutamic_acid' | 'peptide_bond' | 'tripeptide' | 'biuret' | 'electrophoresis';
  diagramCaption?: string;
  difficultyLabel?: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
}

export interface PrizeMilestone {
  level: number;
  points: number;
  rewardText: string;
  isSafetyStop: boolean; // Levels 5, 10, 15
  title: string;
}

export interface LifelineState {
  fiftyFifty: boolean;      // true if available, false if used
  audiencePoll: boolean;
  aiHint: boolean;
  switchQuestion: boolean;
}

export interface AudiencePollResult {
  A: number;
  B: number;
  C: number;
  D: number;
}

export type GamePhase = 
  | 'welcome'           // Introduction / Start screen
  | 'question_active'   // Reading and selecting answer
  | 'answer_selected'   // Answer highlighted, waiting for "Chốt"
  | 'locking_suspense'  // Dramatic suspense countdown before reveal
  | 'result_revealed'   // Outcome shown (correct/wrong) with explanation
  | 'milestone_reward'  // Celebrating milestone 5, 10
  | 'game_over'         // Player answered wrong
  | 'grand_victory'     // Conquered all 15 questions!
  | 'teacher_editor'    // Teacher reviewing/editing questions
  | 'new_game_modal';   // Generator modal
