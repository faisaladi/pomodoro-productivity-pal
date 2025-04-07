
import React from "react";
import Header from "@/components/Header";
import Timer from "@/components/Timer";
import ProjectsList from "@/components/ProjectsList";
import DailySummary from "@/components/DailySummary";
import { PomodoroProvider } from "@/context/PomodoroContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Play, Calendar, ListTodo } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <PomodoroProvider>
      <div className="container px-4 py-4 sm:px-6 max-w-6xl">
        <Header />

        {!isMobile ? (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6">
            <div>
              <Timer />
              <div className="mt-8">
                <ProjectsList />
              </div>
            </div>

            <div>
              <DailySummary />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="timer">
            <TabsList className="w-full">
              <TabsTrigger value="timer" className="flex-1">
                <Play className="mr-2 h-4 w-4" /> Timer
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex-1">
                <ListTodo className="mr-2 h-4 w-4" /> Projects
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex-1">
                <Calendar className="mr-2 h-4 w-4" /> Summary
              </TabsTrigger>
            </TabsList>
            <TabsContent value="timer">
              <div className="mt-4">
                <Timer />
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <div className="mt-4">
                <ProjectsList />
              </div>
            </TabsContent>
            <TabsContent value="summary">
              <div className="mt-4">
                <DailySummary />
              </div>
            </TabsContent>
          </Tabs>
        )}

        <Separator className="mt-8 mb-6" />

        <footer className="text-center text-gray-500 text-sm">
          <p>Pomodoro Productivity Pal &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </PomodoroProvider>
  );
};

export default Index;
