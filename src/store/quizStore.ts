
import { create } from 'zustand';
import { Question, QuizResults, QuizSetup, UserAnswer } from '../types';
import { calculateResults, generateQuiz } from '../services/quizService';
import { toast } from 'sonner';

interface QuizState {
  // Quiz setup
  setup: QuizSetup | null;
  questions: Question[];
  currentQuestionIndex: number;
  
  // User answers
  userAnswers: UserAnswer[];
  
  // UI states
  isLoading: boolean;
  isQuizStarted: boolean;
  isQuizFinished: boolean;
  results: QuizResults | null;
  
  // Actions
  setQuizSetup: (setup: QuizSetup) => void;
  startQuiz: () => Promise<void>;
  answerQuestion: (answer: string | null) => void;
  skipQuestion: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  setup: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  isLoading: false,
  isQuizStarted: false,
  isQuizFinished: false,
  results: null,

  // Actions
  setQuizSetup: (setup) => set({ setup }),
  
  startQuiz: async () => {
    const { setup } = get();
    if (!setup) return;
    
    try {
      set({ isLoading: true });
      const questions = await generateQuiz(setup);
      set({ 
        questions, 
        isQuizStarted: true, 
        isLoading: false,
        userAnswers: Array(questions.length).fill(null).map(() => ({
          questionId: '',
          selectedOptionId: null,
          isCorrect: false,
          timeTaken: 0
        }))
      });
    } catch (error) {
      console.error('Failed to start quiz:', error);
      toast.error('Failed to generate quiz questions. Please try again.');
      set({ isLoading: false });
    }
  },
  
  answerQuestion: (optionId) => {
    const { questions, currentQuestionIndex, userAnswers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;
    
    const isCorrect = optionId === currentQuestion.correctAnswerId;
    
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      isCorrect,
      timeTaken: 30 // Mock time taken (seconds)
    };
    
    set({ userAnswers: updatedAnswers });
  },
  
  skipQuestion: () => {
    const { questions, currentQuestionIndex, userAnswers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;
    
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selectedOptionId: null,
      isCorrect: false,
      timeTaken: 30 // Mock time taken (seconds)
    };
    
    set({ userAnswers: updatedAnswers });
    get().nextQuestion();
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    } else {
      // Auto-finish if this was the last question
      get().finishQuiz();
    }
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },
  
  finishQuiz: async () => {
    const { questions, userAnswers } = get();
    
    try {
      set({ isLoading: true });
      // Fill in missing answers as skipped
      const finalAnswers = userAnswers.map((answer, index) => {
        if (!answer.questionId) {
          return {
            questionId: questions[index].id,
            selectedOptionId: null,
            isCorrect: false,
            timeTaken: 30 // Mock time
          };
        }
        return answer;
      });
      
      const results = await calculateResults(questions, finalAnswers);
      set({ 
        results, 
        isQuizFinished: true, 
        isLoading: false,
        userAnswers: finalAnswers
      });
    } catch (error) {
      console.error('Failed to finish quiz:', error);
      toast.error('Failed to calculate results. Please try again.');
      set({ isLoading: false });
    }
  },
  
  resetQuiz: () => {
    set({
      setup: null,
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      isQuizStarted: false,
      isQuizFinished: false,
      results: null
    });
  }
}));
