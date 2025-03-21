import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "@/store/quizStore";
import { motion } from "framer-motion";
import { 
  Timer, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  FastForward,
  Flag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoaderAnimation from "./LoaderAnimation";

const QuizPanel = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    userAnswers,
    isLoading,
    nextQuestion,
    previousQuestion,
    answerQuestion,
    skipQuestion,
    finishQuiz
  } = useQuizStore();
  
  const [timer, setTimer] = useState(30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const processingSteps = [
    { message: "Calculating your score...", duration: 1000 },
    { message: "Analyzing your strengths...", duration: 1000 },
    { message: "Identifying areas for improvement...", duration: 1000 },
    { message: "Generating personalized recommendations...", duration: 1000 },
    { message: "Preparing your results...", duration: 1000 }
  ];
  
  useEffect(() => {
    if (questions.length === 0 && !isLoading) {
      navigate("/setup");
    }
  }, [questions, isLoading, navigate]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const currentAnswer = userAnswers[currentQuestionIndex];
      
      if (currentAnswer && currentAnswer.questionId === currentQuestion.id) {
        const timeLimit = currentQuestion.timeLimit || 30;
        const timeSpent = currentAnswer.timeTaken;
        const remainingTime = Math.max(1, timeLimit - timeSpent);
        setTimer(remainingTime);
      } else {
        setTimer(currentQuestion.timeLimit || 30);
      }
      
      if (!currentAnswer || currentAnswer.questionId !== currentQuestion.id) {
        questionStartTimeRef.current = Date.now();
      }
    }
  }, [currentQuestionIndex, questions, userAnswers]);

  useEffect(() => {
    if (timer > 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      skipQuestion();
    }
  }, [timer, skipQuestion]);
  
  useEffect(() => {
    if (userAnswers[currentQuestionIndex]) {
      const currentAnswer = userAnswers[currentQuestionIndex];
      setSelectedOption(currentAnswer?.selectedOptionId || null);
    } else {
      setSelectedOption(null);
    }
  }, [currentQuestionIndex, userAnswers]);
  
  if (isLoading) {
    return <LoaderAnimation message="Processing your quiz..." steps={processingSteps} />;
  }
  
  if (questions.length === 0) {
    return null; // Will redirect to setup
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (optionId: string) => {
    const timeTaken = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
    
    setSelectedOption(optionId);
    answerQuestion(optionId, timeTaken);
  };
  
  const handleNextQuestion = () => {
    nextQuestion();
  };
  
  const handlePreviousQuestion = () => {
    previousQuestion();
  };
  
  const handleSkipQuestion = () => {
    const timeTaken = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
    
    skipQuestion(timeTaken);
    setSelectedOption(null);
  };
  
  const handleFinishQuiz = async () => {
    await finishQuiz();
    navigate("/results");
  };
  
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl cyber-panel relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-cyber-accent to-cyber-purple"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center mb-6 mt-2">
          <div className="text-sm md:text-base text-white/70">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          <div className="flex items-center py-1 px-3 rounded-full border border-white/20 bg-white/5">
            <Timer className="h-4 w-4 text-cyber-accent mr-2" />
            <span className={`${timer <= 10 ? "text-cyber-error" : "text-white/80"}`}>
              {timer}s
            </span>
          </div>
        </div>
        
        <motion.h2 
          key={`question-${currentQuestionIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl md:text-2xl font-medium mb-8"
        >
          {currentQuestion.text}
        </motion.h2>
        
        <motion.div 
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {currentQuestion.options.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOptionSelect(option.id)}
              className={`quiz-option ${selectedOption === option.id ? "selected" : ""}`}
            >
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full border border-white/30 flex items-center justify-center mr-3">
                  {option.id.toUpperCase()}
                </div>
                <div>{option.text}</div>
                {selectedOption === option.id && (
                  <CheckCircle className="ml-auto h-5 w-5 text-cyber-accent" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="flex justify-between">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-3">
            {!isLastQuestion && (
              <Button
                onClick={handleSkipQuestion}
                variant="outline"
                className="flex items-center"
              >
                <FastForward className="mr-2 h-4 w-4" />
                Skip
              </Button>
            )}
            
            {isLastQuestion ? (
              <Button
                onClick={handleFinishQuiz}
                className="cyber-button flex items-center"
              >
                <Flag className="mr-2 h-4 w-4" />
                Finish Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="cyber-button flex items-center"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPanel;
