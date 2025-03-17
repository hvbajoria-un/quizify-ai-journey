
import { Question, QuizResults, QuizSetup, UserAnswer } from "../types";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Sample questions by topic and difficulty
const questionBank: Record<string, Question[]> = {
  "Percentage-Beginner": [
    {
      id: "q1",
      text: "What is 10% of 50?",
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "10" },
        { id: "c", text: "15" },
        { id: "d", text: "20" }
      ],
      correctAnswerId: "a",
      explanation: "10% means 10/100 = 0.1, and 0.1 × 50 = 5"
    },
    {
      id: "q2",
      text: "If 30% of a number is 15, what is the number?",
      options: [
        { id: "a", text: "45" },
        { id: "b", text: "50" },
        { id: "c", text: "30" },
        { id: "d", text: "60" }
      ],
      correctAnswerId: "b",
      explanation: "Let the number be x. Then 30% of x = 15, or 0.3x = 15. Therefore, x = 15/0.3 = 50."
    },
    {
      id: "q3",
      text: "A shirt costs $50 and is on sale for 20% off. What is the sale price?",
      options: [
        { id: "a", text: "$30" },
        { id: "b", text: "$35" },
        { id: "c", text: "$40" },
        { id: "d", text: "$45" }
      ],
      correctAnswerId: "c",
      explanation: "The discount is 20% of $50, which is 0.2 × $50 = $10. So the sale price is $50 - $10 = $40."
    }
  ],
  "Time-Intermediate": [
    {
      id: "q1",
      text: "If it takes 6 hours to complete a task, how many tasks can be completed in 36 hours?",
      options: [
        { id: "a", text: "4" },
        { id: "b", text: "5" },
        { id: "c", text: "6" },
        { id: "d", text: "7" }
      ],
      correctAnswerId: "c",
      explanation: "36 hours ÷ 6 hours per task = 6 tasks"
    },
    {
      id: "q2",
      text: "A train travels at a speed of 60 km/h for 3 hours and then at 80 km/h for 2 hours. What is the average speed?",
      options: [
        { id: "a", text: "68 km/h" },
        { id: "b", text: "70 km/h" },
        { id: "c", text: "72 km/h" },
        { id: "d", text: "75 km/h" }
      ],
      correctAnswerId: "a",
      explanation: "Total distance = (60 × 3) + (80 × 2) = 180 + 160 = 340 km. Total time = 3 + 2 = 5 hours. Average speed = 340 ÷ 5 = 68 km/h."
    },
    {
      id: "q3",
      text: "If A can do a piece of work in 20 days and B can do it in 15 days, how long will they take to complete it working together?",
      options: [
        { id: "a", text: "6 days" },
        { id: "b", text: "8.57 days" },
        { id: "c", text: "9 days" },
        { id: "d", text: "10 days" }
      ],
      correctAnswerId: "b",
      explanation: "A's rate = 1/20 work per day. B's rate = 1/15 work per day. Combined rate = 1/20 + 1/15 = (3+4)/60 = 7/60 work per day. Time taken = 1 ÷ (7/60) = 60/7 = 8.57 days."
    }
  ],
  "Distance-Expert": [
    {
      id: "q1",
      text: "A car travels 200 km at a speed of 40 km/h and returns at a speed of 60 km/h. What is the average speed for the entire journey?",
      options: [
        { id: "a", text: "45 km/h" },
        { id: "b", text: "48 km/h" },
        { id: "c", text: "50 km/h" },
        { id: "d", text: "52 km/h" }
      ],
      correctAnswerId: "b",
      explanation: "Total distance = 200 + 200 = 400 km. Time for first 200 km = 200 ÷ 40 = 5 h. Time for return 200 km = 200 ÷ 60 = 3.33 h. Total time = 8.33 h. Average speed = 400 ÷ 8.33 = 48 km/h."
    }
  ]
};

export const generateQuiz = async (setup: QuizSetup): Promise<Question[]> => {
  // Simulate API call
  await delay(2000);
  
  // Get questions from our mock database based on topic and difficulty
  const key = `${setup.topic}-${setup.difficulty}`;
  let questions = questionBank[key] || [];
  
  // If we don't have enough questions of the exact type, just use random questions
  if (questions.length < setup.numberOfQuestions) {
    // Combine all available questions
    const allQuestions: Question[] = [];
    Object.values(questionBank).forEach(qs => allQuestions.push(...qs));
    
    // Shuffle and pick random ones
    questions = shuffleArray(allQuestions);
  }
  
  // Return requested number of questions
  return questions.slice(0, setup.numberOfQuestions);
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
  
  // Analyze strengths and weaknesses
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
