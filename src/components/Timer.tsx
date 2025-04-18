
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import { 
  Play, Pause, Clock, TimerReset, 
  Coffee, TimerOff, Check, X 
} from "lucide-react";
import { 
  usePomodoroContext, 
  TimerMode, 
  ProductivityLevel 
} from "@/context/PomodoroContext";
import { formatTime } from "@/lib/utils/timer";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Timer = () => {
  const {
    timerMode,
    setTimerMode,
    isRunning,
    timeRemaining,
    totalTime,
    currentProject,
    currentTask,
    currentSession,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
  } = usePomodoroContext();

  const progressPercentage = Math.min(100, Math.max(0, (timeRemaining / totalTime) * 100));

  const modeColors = {
    pomodoro: "bg-tomato-500 from-tomato-400 to-tomato-600",
    "short-break": "bg-blue-500 from-blue-400 to-blue-600",
    "long-break": "bg-indigo-600 from-indigo-500 to-indigo-700",
  };

  const modeButtonColors = {
    pomodoro: "bg-tomato-500 hover:bg-tomato-600 text-white",
    "short-break": "bg-blue-500 hover:bg-blue-600 text-white",
    "long-break": "bg-indigo-600 hover:bg-indigo-700 text-white",
  };

  const modeNames = {
    pomodoro: "Pomodoro",
    "short-break": "Short Break",
    "long-break": "Long Break",
  };

  const handleStartPause = () => {
    if (!isRunning && !currentSession) {
      if (!currentProject) {
        toast.error("Please select a project first");
        return;
      }
      
      startSession(currentProject.id, currentTask?.id || null);
    } else if (isRunning) {
      pauseSession();
    } else {
      resumeSession();
    }
  };

  const handleModeChange = (mode: TimerMode) => {
    if (currentSession) {
      endSession("medium", false);
    }
    
    setTimerMode(mode);
  };

  const handleEndSession = (productivityLevel: ProductivityLevel, isDistracted: boolean) => {
    if (currentSession) {
      endSession(productivityLevel, isDistracted);
      toast.success("Session completed!", {
        description: `You marked this session as ${productivityLevel} productivity.`,
      });
    }
  };

  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Card className="w-full min-w-[80px] shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden mx-auto">
      <CardContent className="p-2 sm:p-6">
        <div className="relative mb-3 sm:mb-8">
          <div 
            className={cn(
              "rounded-2xl w-full max-w-[16rem] aspect-square flex flex-col items-center justify-center mx-auto mb-2 text-white transition-all shadow-lg overflow-hidden bg-gradient-to-br",
              modeColors[timerMode]
            )}
          >
            <div 
              className="absolute inset-0 bg-white opacity-30 transition-all duration-500 ease-linear rounded-2xl"
              style={{ 
                height: `${100 - progressPercentage}%`,
                top: 0 
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 rounded-full"></div>
            </div>
            
            {isRunning && (
              <>
                <div className="absolute bottom-4 left-8 w-4 h-4 rounded-full bg-white/20 animate-ping-slow hidden sm:block"></div>
                <div className="absolute bottom-12 right-12 w-2 h-2 rounded-full bg-white/20 animate-ping-slow hidden sm:block" style={{animationDelay: "0.5s"}}></div>
                <div className="absolute bottom-20 left-16 w-3 h-3 rounded-full bg-white/20 animate-ping-slow hidden sm:block" style={{animationDelay: "1.2s"}}></div>
              </>
            )}
            
            <div className="relative z-10">
              <div className="text-xs font-medium mb-1">{modeNames[timerMode]}</div>
              <div className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tighter">{formatTime(timeRemaining)}</div>
              {currentProject && (
                <div className="text-xs mt-1 max-w-[80%] truncate">
                  {currentProject.name}
                  {currentTask && `: ${currentTask.name}`}
                </div>
              )}
            </div>
          </div>

          <Progress 
            value={progressPercentage} 
            className={cn("h-2 w-full mx-auto rounded-full", {
              "bg-gray-200": true,
              "[&>div]:bg-tomato-500": timerMode === "pomodoro",
              "[&>div]:bg-blue-500": timerMode === "short-break",
              "[&>div]:bg-indigo-600": timerMode === "long-break",
            })}
          />
        </div>

        <div className="flex justify-center space-x-1 sm:space-x-3 mb-3 sm:mb-8">
          <Button
            variant="default"
            size="icon"
            onClick={handleStartPause}
            className={cn("h-8 w-8 sm:h-14 sm:w-14 rounded-full shadow-md transition-transform hover:scale-105", {
              "bg-tomato-500 hover:bg-tomato-600": !isRunning && timerMode === "pomodoro",
              "bg-blue-500 hover:bg-blue-600": !isRunning && timerMode === "short-break",
              "bg-indigo-600 hover:bg-indigo-700": !isRunning && timerMode === "long-break",
              "bg-amber-500 hover:bg-amber-600": isRunning,
            })}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </Button>

          {currentSession && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-14 sm:w-14 rounded-full border-2 shadow-md hover:bg-gray-100"
              onClick={() => handleEndSession("medium", false)}
            >
              <TimerOff size={20} />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-3 mb-2 sm:mb-6 text-[10px] sm:text-sm">
          <Button
            variant={timerMode === "pomodoro" ? "default" : "outline"}
            className={cn(
              timerMode === "pomodoro" ? modeButtonColors.pomodoro : "hover:bg-gray-100", 
              "font-medium rounded-full p-1 sm:p-2 h-auto"
            )}
            onClick={() => handleModeChange("pomodoro")}
          >
            <Clock size={12} className="sm:mr-2" /> <span className="hidden sm:inline">Pomodoro</span>
          </Button>
          <Button
            variant={timerMode === "short-break" ? "default" : "outline"}
            className={cn(
              timerMode === "short-break" ? modeButtonColors["short-break"] : "hover:bg-gray-100",
              "font-medium rounded-full p-1 sm:p-2 h-auto"
            )}
            onClick={() => handleModeChange("short-break")}
          >
            <Coffee size={12} className="sm:mr-2" /> <span className="hidden sm:inline">Short</span>
          </Button>
          <Button
            variant={timerMode === "long-break" ? "default" : "outline"}
            className={cn(
              timerMode === "long-break" ? modeButtonColors["long-break"] : "hover:bg-gray-100",
              "font-medium rounded-full p-1 sm:p-2 h-auto"
            )}
            onClick={() => handleModeChange("long-break")}
          >
            <TimerReset size={12} className="sm:mr-2" /> <span className="hidden sm:inline">Long</span>
          </Button>
        </div>

        {currentSession && timerMode === "pomodoro" && (
          <div className="border-t border-gray-200 pt-2 sm:pt-4 mt-2">
            <h3 className="font-medium text-[10px] sm:text-sm mb-1 sm:mb-3">Rate your productivity:</h3>
            <div className="flex justify-between gap-1 sm:gap-2 mb-2 sm:mb-3">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-2 border-productivity-high text-productivity-high hover:bg-productivity-high hover:text-white transition-colors p-1 h-auto text-[10px] sm:text-xs"
                onClick={() => handleEndSession("high", false)}
              >
                <Check size={12} className="sm:mr-1" /> <span className="hidden sm:inline">High</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-2 border-productivity-medium text-productivity-medium hover:bg-productivity-medium hover:text-white transition-colors p-1 h-auto text-[10px] sm:text-xs"
                onClick={() => handleEndSession("medium", false)}
              >
                <Check size={12} className="sm:mr-1" /> <span className="hidden sm:inline">Medium</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-2 border-productivity-low text-productivity-low hover:bg-productivity-low hover:text-white transition-colors p-1 h-auto text-[10px] sm:text-xs"
                onClick={() => handleEndSession("low", false)}
              >
                <Check size={12} className="sm:mr-1" /> <span className="hidden sm:inline">Low</span>
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full rounded-full border-2 border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors p-1 h-auto text-[10px] sm:text-xs"
              onClick={() => handleEndSession("distracted", true)}
            >
              <X size={12} className="sm:mr-1" /> <span className="hidden sm:inline">Distracted</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Timer;
