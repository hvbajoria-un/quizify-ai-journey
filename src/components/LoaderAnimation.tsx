
import { Brain, Cpu, Zap, Activity } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoaderAnimationProps {
  message?: string;
  steps?: { message: string; duration: number }[];
}

const LoaderAnimation = ({ 
  message = "Generating your quiz...", 
  steps 
}: LoaderAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    if (!steps || steps.length === 0) {
      setCurrentMessage(message);
      return;
    }

    // Initialize with the first step message
    setCurrentMessage(steps[0].message);
    
    // Set up timers for each step
    let stepIndex = 0;
    const timers: NodeJS.Timeout[] = [];
    
    let cumulativeTime = 0;
    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index);
        setCurrentMessage(step.message);
      }, cumulativeTime);
      
      cumulativeTime += step.duration;
      timers.push(timer);
    });
    
    // Clean up timers on unmount
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [steps, message]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-cyber-darker z-50 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{
                rotate: 360,
                transition: { duration: 4, repeat: Infinity, ease: "linear" }
              }}
              className="w-32 h-32 border-4 border-cyber-accent/30 rounded-full"
            />
            
            <motion.div
              animate={{
                rotate: -360,
                transition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              className="absolute inset-3 border-4 border-dashed border-cyber-purple/40 rounded-full"
            />
            
            <Brain 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyber-accent w-12 h-12 animate-pulse-glow" 
            />
            
            <motion.div 
              animate={{
                scale: [1, 1.1, 1],
                transition: { duration: 2, repeat: Infinity }
              }}
              className="absolute -top-2 -right-2"
            >
              <Cpu className="w-8 h-8 text-cyber-purple" />
            </motion.div>
            
            <motion.div 
              animate={{
                scale: [1, 1.1, 1],
                transition: { duration: 2, repeat: Infinity, delay: 0.5 }
              }}
              className="absolute -bottom-2 -left-2"
            >
              <Zap className="w-8 h-8 text-cyber-accent" />
            </motion.div>
            
            <motion.div 
              animate={{
                scale: [1, 1.1, 1],
                transition: { duration: 2, repeat: Infinity, delay: 1 }
              }}
              className="absolute -bottom-2 -right-2"
            >
              <Activity className="w-8 h-8 text-cyber-purple" />
            </motion.div>
          </div>
          
          <motion.h2
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xl md:text-2xl font-medium text-cyber-accent mb-2"
          >
            {currentMessage}
          </motion.h2>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: "100%",
              transition: { duration: 3, repeat: Infinity }
            }}
            className="h-1 bg-gradient-to-r from-cyber-accent to-cyber-purple rounded-full max-w-md"
          />
          
          {steps && (
            <div className="mt-6 flex justify-center space-x-2">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: currentStep === i ? 1.5 : 1,
                    opacity: currentStep === i ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-2 h-2 rounded-full ${
                    currentStep === i ? "bg-cyber-accent" : "bg-cyber-accent/30"
                  }`}
                />
              ))}
            </div>
          )}
          
          <div className="mt-8 grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.9, 1, 0.9],
                  transition: { 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut" 
                  }
                }}
                className="w-3 h-3 rounded-full bg-cyber-accent"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoaderAnimation;
