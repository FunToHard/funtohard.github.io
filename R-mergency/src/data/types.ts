export type ExamDifficulty = 'Moderate' | 'Painful' | 'Severe';

export interface LanguageInfo {
  id: string;
  name: string;
  shortCode: string;
  prismLang: string;
  status: 'active' | 'upcoming';
  description: string;
  examDifficulty: ExamDifficulty;
  typicalCramHours: number;
  primaryTarget: string;
  goldenRule: string;
}

export interface ModuleSection {
  heading: string;
  explanation: string;
  code?: string;
  trapNote?: string;
  outputExample?: string;
}

export interface ExamModule {
  id: string;
  sectionNumber: string;
  title: string;
  cramTimeMinutes: number;
  overview: string;
  sections: ModuleSection[];
}

export interface QuizQuestion {
  id: string;
  langId: string;
  trapCategory: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CramCard {
  title: string;
  items: { label: string; snippet: string; note?: string }[];
}

export interface LanguageBundle {
  info: LanguageInfo;
  modules: ExamModule[];
  quizzes: QuizQuestion[];
  cramSheet: CramCard[];
}
