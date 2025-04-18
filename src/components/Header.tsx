
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/context/PomodoroContext";

const Header = () => {
  const { requestNotificationPermission } = usePomodoroContext();

  return (
    <header className="flex items-center justify-between py-1 sm:py-2 mb-1 sm:mb-2 px-1 relative">
      <div className="flex items-center">
        <div className="relative mr-1 sm:mr-2">
          <span className="text-lg sm:text-2xl" role="img" aria-label="tomato">
            🍅
          </span>
          <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-tomato-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-tomato-600 to-tomato-400 bg-clip-text text-transparent">
          Pomodoro Pal
        </h1>
      </div>

      <div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={requestNotificationPermission}
          className="relative rounded-full border hover:bg-gray-50 hover:border-tomato-400 transition-colors h-6 w-6 sm:h-8 sm:w-8"
        >
          <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
          {Notification.permission !== "granted" && (
            <span className="absolute top-0 right-0 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
