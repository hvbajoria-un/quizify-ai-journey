
export interface QuizOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
  timeLimit?: number; // Time limit in seconds, if applicable
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string | null; // null if skipped
  isCorrect: boolean;
  timeTaken: number; // Time taken to answer in seconds
}

export type QuizTopic = 
  | "Percentage" 
  | "Time" 
  | "Distance" 
  | "Speed" 
  | "Probability" 
  | "Ratio and Proportion"
  | "Averages";

export type QuizDifficulty = 
  | "Novice" 
  | "Beginner" 
  | "Intermediate" 
  | "Expert" 
  | "Master";

export interface QuizSetup {
  topic: QuizTopic;
  difficulty: QuizDifficulty;
  instructions?: string;
  numberOfQuestions: number;
}

export interface QuizResults {
  totalQuestions: number;
  correct: number;
  incorrect: number;
  skipped: number;
  timeTaken: number;
  strengths: string[];
  areasOfImprovement: string[];
  recommendations: string[];
  answers: UserAnswer[];
}
