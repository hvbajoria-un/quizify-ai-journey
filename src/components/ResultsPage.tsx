
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "@/store/quizStore";
import { motion } from "framer-motion";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BrainCircuit, 
  Clock, 
  Award, 
  BarChart2, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  SkipForward,
  Rocket,
  TrendingUp,
  Eye
} from "lucide-react";
import LoaderAnimation from "./LoaderAnimation";

const ResultsPage = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    userAnswers, 
    results, 
    isLoading,
    resetQuiz
  } = useQuizStore();
  
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  
  // Navigate to home if no results are available
  useEffect(() => {
    if (!results && !isLoading) {
      navigate("/");
    }
  }, [results, isLoading, navigate]);
  
  const toggleExplanation = (questionId: string) => {
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  const handleStartNewQuiz = () => {
    resetQuiz();
    navigate("/setup");
  };
  
  if (isLoading) {
    return <LoaderAnimation message="Analyzing your results..." />;
  }
  
  if (!results) {
    return null; // Will redirect to home
  }
  
  // Prepare data for pie chart
  const pieData = [
    { name: "Correct", value: results.correct, color: "#10B981" },
    { name: "Incorrect", value: results.incorrect, color: "#EF4444" },
    { name: "Skipped", value: results.skipped, color: "#6B7280" }
  ];
  
  // Prepare data for time per question chart
  const timeData = userAnswers.map((answer, index) => ({
    question: `Q${index + 1}`,
    time: answer.timeTaken,
    status: answer.isCorrect 
      ? "Correct" 
      : answer.selectedOptionId === null 
        ? "Skipped"
        : "Incorrect"
  }));
  
  // Calculate average time per question
  const avgTime = (results.timeTaken / questions.length).toFixed(1);
  
  // Calculate accuracy percentage
  const accuracy = ((results.correct / questions.length) * 100).toFixed(0);
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="cyber-panel mb-8"
        >
          <div className="flex items-center mb-6">
            <Award className="h-10 w-10 text-cyber-accent mr-4" />
            <h1 className="text-3xl font-bold">Quiz Results</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="cyber-panel flex items-center">
              <CheckCircle2 className="h-8 w-8 text-cyber-success mr-3" />
              <div>
                <div className="text-sm text-white/70">Correct Answers</div>
                <div className="text-2xl font-bold">{results.correct} / {questions.length}</div>
              </div>
            </div>
            
            <div className="cyber-panel flex items-center">
              <Clock className="h-8 w-8 text-cyber-accent mr-3" />
              <div>
                <div className="text-sm text-white/70">Average Time Per Question</div>
                <div className="text-2xl font-bold">{avgTime}s</div>
              </div>
            </div>
            
            <div className="cyber-panel flex items-center">
              <TrendingUp className="h-8 w-8 text-cyber-purple mr-3" />
              <div>
                <div className="text-sm text-white/70">Accuracy</div>
                <div className="text-2xl font-bold">{accuracy}%</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 text-cyber-accent mr-2" />
                Performance Summary
              </h2>
              
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="h-5 w-5 text-cyber-accent mr-2" />
                Time per Question
              </h2>
              
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="question" />
                    <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar 
                      dataKey="time" 
                      fill="#8B5CF6"
                      name="Time (seconds)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="cyber-panel mb-8"
        >
          <div className="flex items-center mb-6">
            <BrainCircuit className="h-8 w-8 text-cyber-accent mr-3" />
            <h2 className="text-2xl font-bold">Analysis & Recommendations</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3 text-cyber-accent">Strengths</h3>
              <ul className="space-y-2 pl-6 mb-6">
                {results.strengths.map((strength, i) => (
                  <li key={i} className="list-disc text-white/80">{strength}</li>
                ))}
              </ul>
              
              <h3 className="text-lg font-bold mb-3 text-cyber-purple">Areas for Improvement</h3>
              <ul className="space-y-2 pl-6">
                {results.areasOfImprovement.map((area, i) => (
                  <li key={i} className="list-disc text-white/80">{area}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <Rocket className="h-5 w-5 text-cyber-accent mr-2" />
                Recommended Next Steps
              </h3>
              
              <ul className="space-y-4">
                {results.recommendations.map((rec, i) => (
                  <li key={i} className="flex">
                    <ChevronRight className="h-5 w-5 text-cyber-accent shrink-0 mt-0.5 mr-2" />
                    <span className="text-white/80">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Tabs defaultValue="questions">
            <TabsList className="mb-6">
              <TabsTrigger value="questions">Question Analysis</TabsTrigger>
              <TabsTrigger value="performance">Performance Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions" className="cyber-panel">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Eye className="h-6 w-6 text-cyber-accent mr-2" />
                Question-by-Question Review
              </h2>
              
              <div className="space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  
                  return (
                    <div key={question.id} className="cyber-border p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium">Question {index + 1}</h3>
                        
                        {userAnswer.isCorrect ? (
                          <div className="flex items-center text-cyber-success">
                            <CheckCircle2 className="h-5 w-5 mr-1" />
                            <span>Correct</span>
                          </div>
                        ) : userAnswer.selectedOptionId === null ? (
                          <div className="flex items-center text-gray-400">
                            <SkipForward className="h-5 w-5 mr-1" />
                            <span>Skipped</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-cyber-error">
                            <XCircle className="h-5 w-5 mr-1" />
                            <span>Incorrect</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="mb-4">{question.text}</p>
                      
                      <div className="space-y-2 mb-4">
                        {question.options.map(option => (
                          <div 
                            key={option.id}
                            className={`p-2 rounded border ${
                              option.id === question.correctAnswerId
                                ? "border-cyber-success bg-cyber-success/10"
                                : option.id === userAnswer.selectedOptionId && !userAnswer.isCorrect
                                ? "border-cyber-error bg-cyber-error/10"
                                : "border-white/20"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="h-6 w-6 rounded-full border border-white/30 flex items-center justify-center mr-3">
                                {option.id.toUpperCase()}
                              </div>
                              <span>{option.text}</span>
                              
                              {option.id === question.correctAnswerId && (
                                <CheckCircle2 className="ml-auto h-5 w-5 text-cyber-success" />
                              )}
                              
                              {option.id === userAnswer.selectedOptionId && !userAnswer.isCorrect && (
                                <XCircle className="ml-auto h-5 w-5 text-cyber-error" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => toggleExplanation(question.id)}
                        variant="outline"
                        size="sm"
                      >
                        {showExplanation[question.id] ? "Hide Explanation" : "Show Explanation"}
                      </Button>
                      
                      {showExplanation[question.id] && (
                        <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded">
                          <h4 className="font-medium mb-2 text-cyber-accent">Explanation:</h4>
                          <p className="text-white/80">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="cyber-panel">
              <h2 className="text-xl font-bold mb-6">Detailed Performance Analytics</h2>
              
              <div className="h-[300px] mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="question" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="time" 
                      stroke="#00EEFF" 
                      name="Time Taken (seconds)"
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="cyber-border p-4">
                  <h3 className="text-lg font-bold mb-3">Time Breakdown</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Total Time:</span>
                      <span className="font-medium">{results.timeTaken} seconds</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Average Time per Question:</span>
                      <span className="font-medium">{avgTime} seconds</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Fastest Question:</span>
                      <span className="font-medium">
                        {Math.min(...userAnswers.map(a => a.timeTaken))} seconds
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Slowest Question:</span>
                      <span className="font-medium">
                        {Math.max(...userAnswers.map(a => a.timeTaken))} seconds
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="cyber-border p-4">
                  <h3 className="text-lg font-bold mb-3">Accuracy Stats</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Overall Accuracy:</span>
                      <span className="font-medium">{accuracy}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Correct Answers:</span>
                      <span className="font-medium">{results.correct} / {questions.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Incorrect Answers:</span>
                      <span className="font-medium">{results.incorrect} / {questions.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Skipped Questions:</span>
                      <span className="font-medium">{results.skipped} / {questions.length}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleStartNewQuiz}
            className="cyber-button text-lg py-3 px-8"
          >
            Start a New Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
