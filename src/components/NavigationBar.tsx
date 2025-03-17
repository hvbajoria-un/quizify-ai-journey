
import React from "react";
import { useNavigate } from "react-router-dom";
import { Brain, BarChart2, Home, Settings, PanelLeft } from "lucide-react";
import { useQuizStore } from "@/store/quizStore";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { resetQuiz } = useQuizStore();
  
  const handleNavigate = (path: string) => {
    if (path === "/") {
      resetQuiz();
    }
    navigate(path);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-cyber-darker/70 border-b border-cyber-accent/30 py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-cyber-accent animate-pulse" />
          <h1 className="text-xl font-bold tracking-tight glow-text">CyberQuiz</h1>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2" 
                onClick={() => handleNavigate("/")}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2" 
                onClick={() => handleNavigate("/setup")}
              >
                <Settings className="h-4 w-4" />
                <span>New Quiz</span>
              </Button>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2" 
                onClick={() => handleNavigate("/reports")}
              >
                <BarChart2 className="h-4 w-4" />
                <span>Reports</span>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default NavigationBar;
