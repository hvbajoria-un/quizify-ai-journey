
import React from "react";
import { QuizResults } from "@/types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { 
  CheckCircle, 
  XCircle, 
  SkipForward, 
  Clock, 
  Lightbulb, 
  Target, 
  BarChart2, 
  AlertTriangle,
  Bookmark,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface ReportDetailProps {
  report: QuizResults;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report }) => {
  const pieData = [
    { name: "Correct", value: report.correct, color: "#00EEFF" },
    { name: "Incorrect", value: report.incorrect, color: "#FF4976" },
    { name: "Skipped", value: report.skipped, color: "#9B87F5" }
  ];

  const COLORS = ["#00EEFF", "#FF4976", "#9B87F5"];
  
  // Prepare time per question data
  const timePerQuestionData = report.answers.map((answer, index) => ({
    question: `Q${index + 1}`,
    timeTaken: answer.timeTaken,
    status: answer.isCorrect ? "correct" : (answer.selectedOptionId ? "incorrect" : "skipped"),
  }));
  
  // Calculate overall performance metrics
  const accuracy = report.totalQuestions > 0 
    ? Math.round((report.correct / report.totalQuestions) * 100) 
    : 0;
  
  const avgTimePerQuestion = report.totalQuestions > 0 
    ? Math.round(report.timeTaken / report.totalQuestions) 
    : 0;
  
  return (
    <div className="space-y-8">
      <div className="cyber-panel">
        <h2 className="text-xl font-bold mb-4 glow-text">Performance Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="cyber-border p-4 flex flex-col items-center">
            <CheckCircle className="h-8 w-8 text-cyber-accent mb-2" />
            <span className="text-sm text-muted-foreground">Correct</span>
            <span className="text-2xl font-bold">{report.correct}</span>
          </div>
          
          <div className="cyber-border p-4 flex flex-col items-center">
            <XCircle className="h-8 w-8 text-cyber-error mb-2" />
            <span className="text-sm text-muted-foreground">Incorrect</span>
            <span className="text-2xl font-bold">{report.incorrect}</span>
          </div>
          
          <div className="cyber-border p-4 flex flex-col items-center">
            <SkipForward className="h-8 w-8 text-cyber-purple mb-2" />
            <span className="text-sm text-muted-foreground">Skipped</span>
            <span className="text-2xl font-bold">{report.skipped}</span>
          </div>
          
          <div className="cyber-border p-4 flex flex-col items-center">
            <Clock className="h-8 w-8 text-cyber-accent mb-2" />
            <span className="text-sm text-muted-foreground">Time Taken</span>
            <span className="text-2xl font-bold">
              {Math.floor(report.timeTaken / 60)}m {report.timeTaken % 60}s
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Target className="h-5 w-5 text-cyber-accent" />
              <span>Performance Analysis</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-cyber-accent" />
              <span>Insights</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-medium text-cyber-accent mb-1">Strengths</h4>
                <ul className="list-disc list-inside text-sm">
                  {report.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-cyber-accent mb-1">Areas of Improvement</h4>
                <ul className="list-disc list-inside text-sm">
                  {report.areasOfImprovement.map((area, index) => (
                    <li key={index}>{area}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-cyber-accent mb-1">Recommendations</h4>
                <ul className="list-disc list-inside text-sm">
                  {report.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Performance Metrics panel */}
      <div className="cyber-panel">
        <h2 className="text-xl font-bold mb-6 glow-text">Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="cyber-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-cyber-accent" />
              <h3 className="text-lg font-medium">Accuracy</h3>
            </div>
            <div className="text-3xl font-bold text-center my-4">{accuracy}%</div>
            <p className="text-sm text-muted-foreground text-center">
              {accuracy > 75 ? "Excellent performance!" : 
               accuracy > 50 ? "Good job, keep practicing!" : 
               "More practice needed."}
            </p>
          </div>
          
          <div className="cyber-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-cyber-accent" />
              <h3 className="text-lg font-medium">Avg Time</h3>
            </div>
            <div className="text-3xl font-bold text-center my-4">{avgTimePerQuestion}s</div>
            <p className="text-sm text-muted-foreground text-center">
              {avgTimePerQuestion < 15 ? "Very fast responses!" : 
               avgTimePerQuestion < 25 ? "Good pace, well done." : 
               "Try to improve your speed."}
            </p>
          </div>
          
          <div className="cyber-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-cyber-accent" />
              <h3 className="text-lg font-medium">Overall Grade</h3>
            </div>
            <div className="text-3xl font-bold text-center my-4">
              {accuracy >= 90 ? "A+" :
               accuracy >= 80 ? "A" :
               accuracy >= 70 ? "B" :
               accuracy >= 60 ? "C" :
               accuracy >= 50 ? "D" : "F"}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {accuracy >= 70 ? "Great work!" : 
               accuracy >= 50 ? "Keep improving!" : 
               "More practice needed."}
            </p>
          </div>
        </div>
      </div>
      
      {/* Time per Question chart */}
      <div className="cyber-panel">
        <h2 className="text-xl font-bold mb-6 glow-text">Time per Question</h2>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timePerQuestionData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value, name) => [`${value} seconds`, 'Time Taken']}
                labelFormatter={(label) => `Question ${label.substring(1)}`}
              />
              <Bar 
                dataKey="timeTaken" 
                name="Time Taken"
                barSize={40}
              >
                {timePerQuestionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.status === 'correct' ? '#00EEFF' : (entry.status === 'skipped' ? '#9B87F5' : '#FF4976')}
                  />
                ))}
              </Bar>
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center mt-4 gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#00EEFF] mr-2"></div>
            <span className="text-sm">Correct</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#FF4976] mr-2"></div>
            <span className="text-sm">Incorrect</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#9B87F5] mr-2"></div>
            <span className="text-sm">Skipped</span>
          </div>
        </div>
      </div>
      
      <div className="cyber-panel">
        <h2 className="text-xl font-bold mb-6 glow-text">Question Analysis</h2>
        
        <div className="space-y-6">
          {report.answers.map((answer, index) => (
            <div key={index} className="cyber-border p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-medium">
                  Question {index + 1}
                </h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {answer.timeTaken}s
                  </span>
                  {answer.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-cyber-success" />
                  ) : answer.selectedOptionId ? (
                    <XCircle className="h-5 w-5 text-cyber-error" />
                  ) : (
                    <SkipForward className="h-5 w-5 text-cyber-purple" />
                  )}
                </div>
              </div>
              
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">Your answer: </span>
                <span className={answer.isCorrect ? "text-cyber-success" : "text-cyber-error"}>
                  {answer.selectedOptionId ? answer.selectedOptionId : "Skipped"}
                </span>
              </div>
              
              {answer.timeTaken > 0 && (
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      answer.isCorrect 
                        ? "bg-cyber-success" 
                        : answer.selectedOptionId 
                          ? "bg-cyber-error" 
                          : "bg-cyber-purple"
                    }`}
                    style={{ 
                      width: `${Math.min(100, (answer.timeTaken / 30) * 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          className="cyber-button"
          onClick={() => window.location.href = "/setup"}
        >
          Take Another Quiz
        </Button>
      </div>
    </div>
  );
};

export default ReportDetail;
