
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePomodoroContext } from "@/context/PomodoroContext";

const Header = () => {
  const { requestNotificationPermission } = usePomodoroContext();

  return (
    <header className="flex items-center justify-between py-4 mb-6">
      <div className="flex items-center">
        <span className="text-3xl mr-2" role="img" aria-label="tomato">
          🍅
        </span>
        <h1 className="text-2xl font-bold">Pomodoro Pal</h1>
      </div>

      <div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={requestNotificationPermission}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {Notification.permission !== "granted" && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
