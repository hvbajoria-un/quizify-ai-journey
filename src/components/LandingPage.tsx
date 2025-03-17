
import { useNavigate } from "react-router-dom";
import { Brain, Zap, Star, ActivitySquare } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Brain className="h-12 w-12 text-cyber-accent mr-3 animate-pulse-glow" />
          <h1 className="text-4xl md:text-6xl font-bold glow-text">Quizify.AI</h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl mb-8 text-white/80">
          Next-generation aptitude testing powered by AI
        </h2>
        
        <div className="flex justify-center mb-10">
          <button 
            onClick={() => navigate("/setup")}
            className="cyber-button text-lg py-3 px-8 flex items-center"
          >
            Get Started
            <Zap className="ml-2 h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="cyber-panel flex flex-col items-center">
            <Brain className="h-10 w-10 text-cyber-accent mb-3" />
            <h3 className="text-xl font-bold mb-2">Adaptive Learning</h3>
            <p className="text-white/70">
              Our AI technology adapts to your skill level and learning style
            </p>
          </div>
          
          <div className="cyber-panel flex flex-col items-center">
            <Star className="h-10 w-10 text-cyber-accent mb-3" />
            <h3 className="text-xl font-bold mb-2">Personalized Results</h3>
            <p className="text-white/70">
              Get detailed insights on your strengths and areas for improvement
            </p>
          </div>
          
          <div className="cyber-panel flex flex-col items-center">
            <ActivitySquare className="h-10 w-10 text-cyber-accent mb-3" />
            <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
            <p className="text-white/70">
              Track your progress with advanced visualization tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
