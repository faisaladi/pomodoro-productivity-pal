
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    currentProject,
    currentTask,
    currentSession,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
  } = usePomodoroContext();

  // Define colors based on timer mode
  const modeColors = {
    pomodoro: "bg-tomato-500",
    "short-break": "bg-blue-500",
    "long-break": "bg-indigo-600",
  };

  const modeNames = {
    pomodoro: "Pomodoro",
    "short-break": "Short Break",
    "long-break": "Long Break",
  };

  // Handle start/pause button click
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

  // Handle mode change
  const handleModeChange = (mode: TimerMode) => {
    if (currentSession) {
      // If there's an active session, end it first
      endSession("medium", false); // Default productivity level
    }
    
    setTimerMode(mode);
  };

  // Handle session end with productivity feedback
  const handleEndSession = (productivityLevel: ProductivityLevel, isDistracted: boolean) => {
    if (currentSession) {
      endSession(productivityLevel, isDistracted);
      toast.success("Session completed!", {
        description: `You marked this session as ${productivityLevel} productivity.`,
      });
    }
  };

  // Request notification permission when the component mounts
  useEffect(() => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Card className="w-full max-w-md shadow-lg border-2 mx-auto">
      <CardContent className="p-6">
        {/* Timer display */}
        <div 
          className={cn(
            "rounded-full w-64 h-64 flex flex-col items-center justify-center mx-auto mb-6 text-white transition-colors",
            modeColors[timerMode]
          )}
        >
          <div className="text-sm font-medium mb-2">{modeNames[timerMode]}</div>
          <div className="text-5xl font-bold">{formatTime(timeRemaining)}</div>
          {currentProject && (
            <div className="text-sm mt-2 max-w-[80%] truncate">
              {currentProject.name}
              {currentTask && `: ${currentTask.name}`}
            </div>
          )}
        </div>

        {/* Timer controls */}
        <div className="flex justify-center space-x-2 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={handleStartPause}
            className={cn("h-12 w-12", {
              "bg-tomato-500 hover:bg-tomato-600 text-white": !isRunning,
              "bg-amber-500 hover:bg-amber-600 text-white": isRunning,
            })}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </Button>

          {currentSession && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 bg-gray-200 hover:bg-gray-300"
              onClick={() => handleEndSession("medium", false)}
            >
              <TimerOff size={24} />
            </Button>
          )}
        </div>

        {/* Timer mode selection */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Button
            variant={timerMode === "pomodoro" ? "default" : "outline"}
            className={timerMode === "pomodoro" ? "bg-tomato-500 hover:bg-tomato-600" : ""}
            onClick={() => handleModeChange("pomodoro")}
          >
            <Clock size={16} className="mr-2" /> Pomodoro
          </Button>
          <Button
            variant={timerMode === "short-break" ? "default" : "outline"}
            className={timerMode === "short-break" ? "bg-blue-500 hover:bg-blue-600" : ""}
            onClick={() => handleModeChange("short-break")}
          >
            <Coffee size={16} className="mr-2" /> Short
          </Button>
          <Button
            variant={timerMode === "long-break" ? "default" : "outline"}
            className={timerMode === "long-break" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
            onClick={() => handleModeChange("long-break")}
          >
            <TimerReset size={16} className="mr-2" /> Long
          </Button>
        </div>

        {/* Productivity feedback - only show when in a pomodoro session */}
        {currentSession && timerMode === "pomodoro" && (
          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-2">Rate your productivity:</h3>
            <div className="flex justify-between mb-2">
              <Button
                variant="outline"
                className="flex-1 border-productivity-high text-productivity-high hover:bg-productivity-high hover:text-white"
                onClick={() => handleEndSession("high", false)}
              >
                <Check size={16} className="mr-1" /> High
              </Button>
              <Button
                variant="outline"
                className="flex-1 mx-2 border-productivity-medium text-productivity-medium hover:bg-productivity-medium hover:text-white"
                onClick={() => handleEndSession("medium", false)}
              >
                <Check size={16} className="mr-1" /> Medium
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-productivity-low text-productivity-low hover:bg-productivity-low hover:text-white"
                onClick={() => handleEndSession("low", false)}
              >
                <Check size={16} className="mr-1" /> Low
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => handleEndSession("distracted", true)}
            >
              <X size={16} className="mr-1" /> Distracted
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Timer;
