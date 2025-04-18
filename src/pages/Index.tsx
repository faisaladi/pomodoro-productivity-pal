
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 min-w-[100px]">
        <ResizablePanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="min-h-screen w-full"
        >
          <ResizablePanel defaultSize={100} minSize={5}>
            <div className="w-full h-full">
              <div className="p-0 max-w-full mx-auto">
                <Header />

                <div className="mt-0">
                  {!isMobile ? (
                    <div className="flex flex-col gap-1">
                      <Timer />
                      <div className="min-w-0">
                        <ProjectsList />
                      </div>
                      <div className="min-w-0">
                        <DailySummary />
                      </div>
                    </div>
                  ) : (
                    <Tabs defaultValue="timer" className="w-full">
                      <TabsList className="w-full rounded-lg mb-2 p-1 bg-white/80 backdrop-blur-sm shadow-sm">
                        <TabsTrigger value="timer" className="flex-1 py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-tomato-500 data-[state=active]:to-tomato-600 data-[state=active]:text-white rounded-md transition-all">
                          <Play className="mr-1 h-3 w-3" /> <span className="text-xs">Timer</span>
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="flex-1 py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-md transition-all">
                          <ListTodo className="mr-1 h-3 w-3" /> <span className="text-xs">Projects</span>
                        </TabsTrigger>
                        <TabsTrigger value="summary" className="flex-1 py-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white rounded-md transition-all">
                          <Calendar className="mr-1 h-3 w-3" /> <span className="text-xs">Summary</span>
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="timer" className="mt-0">
                        <div className="mt-1">
                          <Timer />
                        </div>
                      </TabsContent>
                      <TabsContent value="projects" className="mt-0">
                        <div className="mt-1">
                          <ProjectsList />
                        </div>
                      </TabsContent>
                      <TabsContent value="summary" className="mt-0">
                        <div className="mt-1">
                          <DailySummary />
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>

                <Separator className="my-1 opacity-50" />

                <footer className="text-center text-gray-500 text-[8px] pb-0.5 super-compact">
                  <p>Pomodoro Pal</p>
                </footer>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </PomodoroProvider>
  );
};

export default Index;
