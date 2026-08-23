export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LessonStep {
  id: string;
  title: string;
  conceptSummary: string;
  explanationMarkdown: string;
  mathFormula?: string;
  keyTakeaway: string;
  circuitSnippet?: {
    qubits: number;
    gates: Array<{
      type: string;
      targetQubit: number;
      controlQubit?: number;
      column: number;
    }>;
  };
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Fundamentals' | 'Circuits' | 'Algorithms' | 'Error Correction' | 'Hardware';
  difficulty: DifficultyLevel;
  durationMinutes: number;
  xpReward: number;
  description: string;
  prerequisites: string[];
  totalSteps: number;
  steps: LessonStep[];
  completed?: boolean;
}

export interface QuantumAlgorithm {
  id: string;
  name: string;
  subtitle: string;
  category: 'Search' | 'Arithmetic & Fourier' | 'Oracular' | 'Communication' | 'Optimization';
  difficulty: DifficultyLevel;
  inventor: string;
  year: number;
  speedupType: 'Exponential' | 'Quadratic' | 'Polynomial' | 'Communication';
  classicalComplexity: string; // e.g. "O(N)"
  quantumComplexity: string; // e.g. "O(√N)"
  purpose: string;
  overview: string;
  mathFormalism: string;
  stepsExplanation: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  realWorldApplications: string[];
  defaultCircuitPresetId: string;
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  category: 'Superposition' | 'Entanglement' | 'Phase & Interference' | 'Algorithms' | 'Optimization' | 'Circuits';
  difficulty: DifficultyLevel;
  xp: number;
  description: string;
  instructions: string[];
  targetQubits: number;
  expectedDistribution: Record<string, number>; // e.g. {"00": 0.5, "11": 0.5}
  hints: string[];
  starterGates?: Array<{
    type: string;
    targetQubit: number;
    controlQubit?: number;
    column: number;
  }>;
  completed?: boolean;
}

export interface UserProgress {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  algorithmsMastered: number;
  totalAlgorithms: number;
  challengesCompleted: number;
  totalChallenges: number;
  simulationsRun: number;
  timeSpentMinutes: number;
  completedLessonIds: string[];
  completedChallengeIds: string[];
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }[];
  weeklyActivity: {
    day: string;
    simulations: number;
    minutes: number;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  circuitSnapshot?: string;
  suggestedPrompts?: string[];
}
