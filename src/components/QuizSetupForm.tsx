
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuizDifficulty, QuizSetup, QuizTopic } from "@/types";
import { useQuizStore } from "@/store/quizStore";
import { BrainCircuit, ArrowRight } from "lucide-react";

const QuizSetupForm = () => {
  const navigate = useNavigate();
  const { setQuizSetup, startQuiz } = useQuizStore();
  
  const [topic, setTopic] = useState<QuizTopic>("Percentage");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("Beginner");
  const [instructions, setInstructions] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const difficultyOptions: QuizDifficulty[] = [
    "Novice", "Beginner", "Intermediate", "Expert", "Master"
  ];
  
  const topics: QuizTopic[] = [
    "Percentage", "Time", "Distance", "Speed", "Probability", "Ratio and Proportion", "Averages"
  ];
  
  const handleDifficultyChange = (value: number[]) => {
    setDifficulty(difficultyOptions[value[0]]);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const setup: QuizSetup = {
      topic,
      difficulty,
      instructions: instructions.trim() || undefined,
      numberOfQuestions
    };
    
    setQuizSetup(setup);
    await startQuiz();
    navigate("/quiz");
  };
  
  const getDifficultyIndex = () => {
    return difficultyOptions.indexOf(difficulty);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full cyber-panel">
        <div className="mb-6 flex items-center">
          <BrainCircuit className="h-8 w-8 text-cyber-accent mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold">Configure Your Quiz</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Quiz Topic</Label>
            <Select
              value={topic}
              onValueChange={(value) => setTopic(value as QuizTopic)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <Label>Difficulty Level: {difficulty}</Label>
            <Slider
              defaultValue={[getDifficultyIndex()]}
              max={difficultyOptions.length - 1}
              step={1}
              onValueChange={handleDifficultyChange}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              {difficultyOptions.map((option) => (
                <span key={option} className={
                  option === difficulty ? "text-primary font-medium" : ""
                }>
                  {option}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions">Number of Questions</Label>
            <Input
              id="numberOfQuestions"
              type="number"
              min={1}
              max={20}
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(parseInt(e.target.value) || 5)}
              className="cyber-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Custom Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Any specific areas or types of questions you want to focus on..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="cyber-border min-h-[80px]"
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="cyber-button w-full justify-center py-6"
            >
              {isSubmitting ? "Generating Questions..." : "Generate Questions"}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizSetupForm;
