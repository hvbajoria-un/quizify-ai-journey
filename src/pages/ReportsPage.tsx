
import React, { useEffect, useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import { QuizResults } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BarChart2, FileText, Eye, ArrowRightCircle } from "lucide-react";
import LoaderAnimation from "@/components/LoaderAnimation";
import ReportDetail from "@/components/ReportDetail";

const ReportsPage: React.FC = () => {
  const { reportsList, loadReports } = useQuizStore();
  const [selectedReport, setSelectedReport] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleViewReport = (report: QuizResults) => {
    setLoading(true);
    setShowFullReport(false);
    
    // Simulate loading steps for report viewing
    const viewingSteps = [
      { message: "Loading report data...", duration: 600 },
      { message: "Rendering charts...", duration: 400 },
      { message: "Preparing analytics...", duration: 500 },
      { message: "Finalizing report...", duration: 500 }
    ];
    
    // Show loading animation for 2 seconds
    setTimeout(() => {
      setSelectedReport(report);
      setLoading(false);
    }, 2000);
  };
  
  const handleShowFullReport = () => {
    setShowFullReport(true);
  };

  if (loading) {
    return <LoaderAnimation 
      message="Loading report details..." 
      steps={[
        { message: "Loading report data...", duration: 600 },
        { message: "Rendering charts...", duration: 400 },
        { message: "Preparing analytics...", duration: 500 },
        { message: "Finalizing report...", duration: 500 }
      ]} 
    />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <BarChart2 className="h-6 w-6 text-cyber-accent" />
              <h2 className="text-lg font-semibold text-sidebar-foreground">Reports</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {reportsList.length === 0 ? (
              <div className="p-4 text-sidebar-foreground/70">
                No reports available. Complete a quiz to generate reports.
              </div>
            ) : (
              <SidebarMenu>
                {reportsList.map((report, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      onClick={() => handleViewReport(report)}
                      tooltip="View report details"
                      className={selectedReport === report ? "bg-cyber-accent/20" : ""}
                    >
                      <FileText className="h-4 w-4" />
                      <span>
                        {report.strengths[0] || "Quiz"} Result 
                        {report.timeTaken ? ` (${Math.floor(report.timeTaken / 60)}m)` : ""}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset className="bg-cyber-darker p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-2xl font-bold glow-text">Quiz Reports</h1>
              <div className="w-7"></div> {/* Spacer for alignment */}
            </div>
            
            {selectedReport ? (
              <div>
                {!showFullReport ? (
                  <div className="cyber-panel p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-4 glow-text">Performance Summary</h2>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="cyber-border p-4 flex flex-col items-center">
                          <span className="text-sm text-muted-foreground">Correct</span>
                          <span className="text-2xl font-bold text-cyber-accent">{selectedReport.correct}</span>
                        </div>
                        <div className="cyber-border p-4 flex flex-col items-center">
                          <span className="text-sm text-muted-foreground">Incorrect</span>
                          <span className="text-2xl font-bold text-cyber-error">{selectedReport.incorrect}</span>
                        </div>
                        <div className="cyber-border p-4 flex flex-col items-center">
                          <span className="text-sm text-muted-foreground">Skipped</span>
                          <span className="text-2xl font-bold text-cyber-purple">{selectedReport.skipped}</span>
                        </div>
                        <div className="cyber-border p-4 flex flex-col items-center">
                          <span className="text-sm text-muted-foreground">Time Taken</span>
                          <span className="text-2xl font-bold">
                            {Math.floor(selectedReport.timeTaken / 60)}m {selectedReport.timeTaken % 60}s
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-8">
                      <Button 
                        className="cyber-button flex items-center"
                        onClick={handleShowFullReport}
                      >
                        <span>View Full Report</span>
                        <ArrowRightCircle className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ReportDetail report={selectedReport} />
                )}
              </div>
            ) : (
              <div className="cyber-panel flex flex-col items-center justify-center py-20">
                <BarChart2 className="h-16 w-16 text-cyber-accent mb-4" />
                <h2 className="text-xl font-semibold mb-2">Select a Report</h2>
                <p className="text-muted-foreground mb-6">
                  Choose a report from the sidebar to view detailed analytics.
                </p>
                {reportsList.length === 0 && (
                  <Button 
                    className="cyber-button mt-4"
                    onClick={() => window.location.href = "/setup"}
                  >
                    Start a New Quiz
                  </Button>
                )}
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ReportsPage;
