
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
import { BarChart2, FileText, Eye } from "lucide-react";
import LoaderAnimation from "@/components/LoaderAnimation";
import ReportDetail from "@/components/ReportDetail";

const ReportsPage: React.FC = () => {
  const { reportsList, loadReports } = useQuizStore();
  const [selectedReport, setSelectedReport] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleViewReport = (report: QuizResults) => {
    setLoading(true);
    // Simulate loading for 1 second
    setTimeout(() => {
      setSelectedReport(report);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return <LoaderAnimation message="Loading report details..." />;
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
              <ReportDetail report={selectedReport} />
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
