
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/context/PomodoroContext";

const Header = () => {
  const { requestNotificationPermission } = usePomodoroContext();

  return (
    <header className="flex items-center justify-between py-4 mb-6 relative">
      <div className="flex items-center">
        <div className="relative mr-3">
          <span className="text-4xl" role="img" aria-label="tomato">
            🍅
          </span>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-tomato-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-tomato-600 to-tomato-400 bg-clip-text text-transparent">
          Pomodoro Pal
        </h1>
      </div>

      <div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={requestNotificationPermission}
          className="relative rounded-full border-2 hover:bg-gray-50 hover:border-tomato-400 transition-colors"
        >
          <Bell className="h-5 w-5" />
          {Notification.permission !== "granted" && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
