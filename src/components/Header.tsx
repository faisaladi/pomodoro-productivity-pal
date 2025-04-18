
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/context/PomodoroContext";

const Header = () => {
  const { requestNotificationPermission } = usePomodoroContext();

  return (
    <header className="flex items-center justify-between py-0.5 mb-0.5 px-0.5 relative">
      <div className="flex items-center">
        <div className="relative mr-0.5">
          <span className="text-sm" role="img" aria-label="tomato">
            🍅
          </span>
          <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-tomato-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <h1 className="text-sm font-bold bg-gradient-to-r from-tomato-600 to-tomato-400 bg-clip-text text-transparent">
          Pal
        </h1>
      </div>

      <div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={requestNotificationPermission}
          className="relative rounded-full border hover:bg-gray-50 hover:border-tomato-400 transition-colors h-4 w-4"
        >
          <Bell className="h-2 w-2" />
          {Notification.permission !== "granted" && (
            <span className="absolute top-0 right-0 w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
