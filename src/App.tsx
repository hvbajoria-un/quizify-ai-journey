
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./components/LandingPage";
import QuizSetupForm from "./components/QuizSetupForm";
import QuizPanel from "./components/QuizPanel";
import ResultsPage from "./components/ResultsPage";
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/NavigationBar";
import ReportsPage from "./pages/ReportsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationBar />
        <div className="pt-16"> {/* Add padding to account for fixed navbar */}
          <AnimatePresence>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/setup" element={<QuizSetupForm />} />
              <Route path="/quiz" element={<QuizPanel />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
