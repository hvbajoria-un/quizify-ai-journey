
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
  
  // Reports
  reportsList: QuizResults[];
  
  // Actions
  setQuizSetup: (setup: QuizSetup) => void;
  startQuiz: () => Promise<void>;
  answerQuestion: (answer: string | null, timeTaken?: number) => void;
  skipQuestion: (timeTaken?: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
  loadReports: () => void;
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
  reportsList: [],

  // Actions
  setQuizSetup: (setup) => set({ setup }),
  
  startQuiz: async () => {
    const { setup } = get();
    if (!setup) return;
    
    try {
      set({ isLoading: true });
      
      // Enforce a minimum 5-second loading time
      const startTime = Date.now();
      const questions = await generateQuiz(setup);
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 5000 - elapsed);
      
      // Wait for the remaining time if needed
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
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
  
  answerQuestion: (optionId, timeTaken = 30) => {
    const { questions, currentQuestionIndex, userAnswers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;
    
    const isCorrect = optionId === currentQuestion.correctAnswerId;
    
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      isCorrect,
      timeTaken
    };
    
    set({ userAnswers: updatedAnswers });
  },
  
  skipQuestion: (timeTaken = 30) => {
    const { questions, currentQuestionIndex, userAnswers } = get();
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;
    
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selectedOptionId: null,
      isCorrect: false,
      timeTaken
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
            timeTaken: questions[index].timeLimit || 30 // Use question's time limit or default
          };
        }
        return answer;
      });
      
      // Start loading timer
      const startTime = Date.now();
      const results = await calculateResults(questions, finalAnswers);
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 5000 - elapsed);
      
      // Wait for the remaining time if needed
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      // Store the results in the local reports list
      const updatedReports = [...get().reportsList, results];
      
      set({ 
        results, 
        isQuizFinished: true, 
        isLoading: false,
        userAnswers: finalAnswers,
        reportsList: updatedReports
      });
      
      // Persist reports to localStorage
      localStorage.setItem('quizReports', JSON.stringify(updatedReports));
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
  },
  
  loadReports: () => {
    try {
      const savedReports = localStorage.getItem('quizReports');
      if (savedReports) {
        set({ reportsList: JSON.parse(savedReports) });
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
      toast.error('Failed to load saved reports.');
    }
  }
}));
