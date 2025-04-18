
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
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <PomodoroProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <ResizablePanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="min-h-screen"
        >
          <ResizablePanel defaultSize={100} minSize={20}>
            <ResizablePanelGroup
              direction="vertical"
              className="min-h-screen"
            >
              <ResizablePanel defaultSize={100} minSize={20}>
                <div className="container px-2 py-2 sm:px-6 max-w-6xl mx-auto">
                  <Header />

                  <div className="mt-3">
                    {!isMobile ? (
                      <div className="grid grid-cols-1 lg:grid-cols-[minmax(100px,1fr)_minmax(100px,400px)] gap-3">
                        <div className="flex flex-col gap-4">
                          <Timer />
                          <div className="min-w-[100px]">
                            <ProjectsList />
                          </div>
                        </div>

                        <div className="min-w-[100px]">
                          <DailySummary />
                        </div>
                      </div>
                    ) : (
                      <Tabs defaultValue="timer" className="w-full">
                        <TabsList className="w-full rounded-lg mb-4 p-1 bg-white/80 backdrop-blur-sm shadow-sm">
                          <TabsTrigger value="timer" className="flex-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-tomato-500 data-[state=active]:to-tomato-600 data-[state=active]:text-white rounded-md transition-all">
                            <Play className="mr-2 h-4 w-4" /> Timer
                          </TabsTrigger>
                          <TabsTrigger value="projects" className="flex-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md transition-all">
                            <ListTodo className="mr-2 h-4 w-4" /> Projects
                          </TabsTrigger>
                          <TabsTrigger value="summary" className="flex-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white rounded-md transition-all">
                            <Calendar className="mr-2 h-4 w-4" /> Summary
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="timer" className="mt-0">
                          <div className="mt-2">
                            <Timer />
                          </div>
                        </TabsContent>
                        <TabsContent value="projects" className="mt-0">
                          <div className="mt-2">
                            <ProjectsList />
                          </div>
                        </TabsContent>
                        <TabsContent value="summary" className="mt-0">
                          <div className="mt-2">
                            <DailySummary />
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </div>

                  <Separator className="my-4 opacity-50" />

                  <footer className="text-center text-gray-500 text-xs pb-2">
                    <p>Pomodoro Productivity Pal &copy; {new Date().getFullYear()}</p>
                  </footer>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </PomodoroProvider>
  );
};

export default Index;
