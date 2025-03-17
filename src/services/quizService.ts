
import { APIQuestion, APIQuestionsResponse, Question, QuizResults, QuizSetup, UserAnswer } from "../types";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Sample questions by topic and difficulty (in API format)
const questionBank: Record<string, APIQuestion[]> = {
  "Percentage-Beginner": [
    {
      id: 1,
      question: "What is 10% of 50?",
      options: [
        "5", 
        "10", 
        "15", 
        "20"
      ],
      correctAnswer: "5",
      explanation: "10% means 10/100 = 0.1, and 0.1 × 50 = 5",
      difficulty: "easy",
      duration: 30
    },
    {
      id: 2,
      question: "If 30% of a number is 15, what is the number?",
      options: [
        "45", 
        "50", 
        "30", 
        "60"
      ],
      correctAnswer: "50",
      explanation: "Let the number be x. Then 30% of x = 15, or 0.3x = 15. Therefore, x = 15/0.3 = 50.",
      difficulty: "medium",
      duration: 45
    },
    {
      id: 3,
      question: "A shirt costs $50 and is on sale for 20% off. What is the sale price?",
      options: [
        "$30", 
        "$35", 
        "$40", 
        "$45"
      ],
      correctAnswer: "$40",
      explanation: "The discount is 20% of $50, which is 0.2 × $50 = $10. So the sale price is $50 - $10 = $40.",
      difficulty: "easy",
      duration: 30
    }
  ],
  "Time-Intermediate": [
    {
      id: 1,
      question: "If it takes 6 hours to complete a task, how many tasks can be completed in 36 hours?",
      options: [
        "4", 
        "5", 
        "6", 
        "7"
      ],
      correctAnswer: "6",
      explanation: "36 hours ÷ 6 hours per task = 6 tasks",
      difficulty: "medium",
      duration: 45
    },
    {
      id: 2,
      question: "A train travels at a speed of 60 km/h for 3 hours and then at 80 km/h for 2 hours. What is the average speed?",
      options: [
        "68 km/h", 
        "70 km/h", 
        "72 km/h", 
        "75 km/h"
      ],
      correctAnswer: "68 km/h",
      explanation: "Total distance = (60 × 3) + (80 × 2) = 180 + 160 = 340 km. Total time = 3 + 2 = 5 hours. Average speed = 340 ÷ 5 = 68 km/h.",
      difficulty: "hard",
      duration: 60
    },
    {
      id: 3,
      question: "If A can do a piece of work in 20 days and B can do it in 15 days, how long will they take to complete it working together?",
      options: [
        "6 days", 
        "8.57 days", 
        "9 days", 
        "10 days"
      ],
      correctAnswer: "8.57 days",
      explanation: "A's rate = 1/20 work per day. B's rate = 1/15 work per day. Combined rate = 1/20 + 1/15 = (3+4)/60 = 7/60 work per day. Time taken = 1 ÷ (7/60) = 60/7 = 8.57 days.",
      difficulty: "hard",
      duration: 60
    }
  ],
  "Distance-Expert": [
    {
      id: 1,
      question: "A car travels 200 km at a speed of 40 km/h and returns at a speed of 60 km/h. What is the average speed for the entire journey?",
      options: [
        "45 km/h", 
        "48 km/h", 
        "50 km/h", 
        "52 km/h"
      ],
      correctAnswer: "48 km/h",
      explanation: "Total distance = 200 + 200 = 400 km. Time for first 200 km = 200 ÷ 40 = 5 h. Time for return 200 km = 200 ÷ 60 = 3.33 h. Total time = 8.33 h. Average speed = 400 ÷ 8.33 = 48 km/h.",
      difficulty: "hard",
      duration: 60
    }
  ]
};

// Convert API question format to internal Question format
const convertAPIQuestionToInternal = (apiQuestion: APIQuestion): Question => {
  // Create options with id (a, b, c, d) and text
  const options = apiQuestion.options.map((optionText, index) => ({
    id: String.fromCharCode(97 + index), // a, b, c, d...
    text: optionText
  }));
  
  // Find the correct answer id
  const correctOptionIndex = apiQuestion.options.findIndex(
    option => option === apiQuestion.correctAnswer
  );
  const correctAnswerId = String.fromCharCode(97 + correctOptionIndex); // a, b, c, d...
  
  return {
    id: String(apiQuestion.id),
    text: apiQuestion.question,
    options,
    correctAnswerId,
    explanation: apiQuestion.explanation,
    timeLimit: apiQuestion.duration,
    difficulty: apiQuestion.difficulty
  };
};

// Function to parse the API response
export const parseAPIQuestions = (apiResponse: APIQuestionsResponse): Question[] => {
  return apiResponse.questions.map(convertAPIQuestionToInternal);
};

export const generateQuiz = async (setup: QuizSetup): Promise<Question[]> => {
  // Simulate API call
  await delay(2000);
  
  // Get questions from our mock database based on topic and difficulty
  const key = `${setup.topic}-${setup.difficulty}`;
  let apiQuestions = questionBank[key] || [];
  
  // If we don't have enough questions of the exact type, just use random questions
  if (apiQuestions.length < setup.numberOfQuestions) {
    // Combine all available questions
    const allQuestions: APIQuestion[] = [];
    Object.values(questionBank).forEach(qs => allQuestions.push(...qs));
    
    // Shuffle and pick random ones
    apiQuestions = shuffleArray(allQuestions);
  }
  
  // Convert API questions to our internal format
  const questions = apiQuestions
    .slice(0, setup.numberOfQuestions)
    .map(convertAPIQuestionToInternal);
  
  return questions;
};

export const calculateResults = async (
  questions: Question[],
  userAnswers: UserAnswer[]
): Promise<QuizResults> => {
  // Simulate API call
  await delay(1500);
  
  const totalQuestions = questions.length;
  const correct = userAnswers.filter(a => a.isCorrect).length;
  const skipped = userAnswers.filter(a => a.selectedOptionId === null).length;
  const incorrect = totalQuestions - correct - skipped;
  
  const totalTime = userAnswers.reduce((sum, answer) => sum + answer.timeTaken, 0);
  
  // Analyze strengths and weaknesses based on actual performance
  const strengthTopics = ["Time-based problems"];
  const weaknessTopics = ["Distance and Speed"];
  
  return {
    totalQuestions,
    correct,
    incorrect,
    skipped,
    timeTaken: totalTime,
    strengths: strengthTopics,
    areasOfImprovement: weaknessTopics,
    recommendations: [
      "Focus on understanding the relationship between time, speed, and distance.",
      "Practice more complex multi-step problems.",
      "Work on improving calculation speed for percentage problems."
    ],
    answers: userAnswers
  };
};

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
