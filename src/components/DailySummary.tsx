
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePomodoroContext, ProductivityLevel } from "@/context/PomodoroContext";
import { formatDuration } from "@/lib/utils/timer";
import { 
  CheckCircle2, 
  Clock, 
  PieChart, 
  BarChart2
} from "lucide-react";

const DailySummary = () => {
  const { getDailySummary, sessionHistory } = usePomodoroContext();
  const summary = getDailySummary();

  const productivityColors: Record<ProductivityLevel, string> = {
    high: "bg-productivity-high",
    medium: "bg-productivity-medium",
    low: "bg-productivity-low",
    distracted: "bg-red-400",
  };

  const renderTomatoes = (count: number) => {
    const tomatoes = [];
    for (let i = 0; i < count; i++) {
      tomatoes.push(
        <span 
          key={i} 
          className="text-tomato-500 inline-block"
          role="img" 
          aria-label="tomato"
        >
          🍅
        </span>
      );
    }
    return tomatoes;
  };

  return (
    <Card className="w-full shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="mr-2 h-5 w-5" /> Daily Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessionHistory.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No sessions completed today</p>
            <p className="text-sm text-gray-400 mt-1">
              Complete a Pomodoro session to see your summary
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium flex items-center">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Completed Sessions
              </h3>
              <div className="ml-6">
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {summary.totalSessions}
                  </div>
                  <div className="ml-3">{renderTomatoes(summary.totalSessions)}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Total Work Time
              </h3>
              <div className="ml-6">
                <div className="text-2xl font-bold">
                  {formatDuration(summary.totalWorkTime)}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-medium flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                Productivity
              </h3>
              <div className="ml-6 space-y-2">
                {Object.entries(summary.productivityBreakdown).map(([level, count]) => {
                  if (count === 0) return null;
                  return (
                    <div key={level} className="flex items-center">
                      <div 
                        className={`w-3 h-3 rounded-full mr-2 ${productivityColors[level as ProductivityLevel]}`}
                      />
                      <span className="capitalize">{level}:</span>
                      <span className="ml-1 font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="font-medium">Projects Breakdown</h3>
              <div className="space-y-2 ml-6">
                {summary.projectBreakdown.map((project) => (
                  <div key={project.projectId} className="flex justify-between items-center">
                    <span className="truncate max-w-[200px]">{project.projectName}</span>
                    <span className="font-medium">{formatDuration(project.time)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailySummary;
