
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
  Cell
} from "recharts";
import { CheckCircle, XCircle, SkipForward, Clock, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                  ) : (
                    <XCircle className="h-5 w-5 text-cyber-error" />
                  )}
                </div>
              </div>
              
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">Your answer: </span>
                <span className={answer.isCorrect ? "text-cyber-success" : "text-cyber-error"}>
                  {answer.selectedOptionId ? answer.selectedOptionId : "Skipped"}
                </span>
              </div>
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
