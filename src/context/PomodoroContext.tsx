
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

// Define our types
export type ProjectStatus = "not-started" | "in-progress" | "completed";
export type TimerMode = "pomodoro" | "short-break" | "long-break";
export type ProductivityLevel = "high" | "medium" | "low" | "distracted";

export interface Project {
  id: string;
  name: string;
  tasks: Task[];
  totalWorkTime: number; // in seconds
  status: ProjectStatus;
}

export interface Task {
  id: string;
  name: string;
  status: ProjectStatus;
  projectId: string;
  totalWorkTime: number; // in seconds
}

export interface PomodoroSession {
  id: string;
  taskId: string | null;
  projectId: string | null;
  startTime: number; // timestamp
  endTime: number | null; // timestamp
  duration: number; // in seconds
  productivityLevel: ProductivityLevel | null;
  isDistracted: boolean;
  mode: TimerMode;
}

interface PomodoroContextType {
  // Timer settings
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  timeRemaining: number;
  setTimeRemaining: (time: number) => void;
  totalTime: number; // Adding the missing totalTime property
  
  // Settings
  pomodoroTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  
  // Projects and tasks
  projects: Project[];
  addProject: (name: string) => void;
  updateProject: (projectId: string, name: string) => void;
  addTask: (projectId: string, name: string) => void;
  updateTask: (projectId: string, taskId: string, name: string) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: ProjectStatus) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  deleteProject: (projectId: string) => void;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
  
  // Session management
  currentSession: PomodoroSession | null;
  startSession: (projectId: string | null, taskId: string | null) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: (productivityLevel: ProductivityLevel, isDistracted: boolean) => void;
  
  // Session history
  sessionHistory: PomodoroSession[];
  
  // Daily summary
  getDailySummary: () => {
    totalSessions: number;
    totalWorkTime: number;
    productivityBreakdown: Record<ProductivityLevel, number>;
    projectBreakdown: { projectId: string; projectName: string; time: number }[];
  };

  // Notifications
  requestNotificationPermission: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

// Default times
const DEFAULT_POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const DEFAULT_SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const DEFAULT_LONG_BREAK_TIME = 15 * 60; // 15 minutes in seconds

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: 'pomodoro_projects',
  SESSION_HISTORY: 'pomodoro_session_history',
  SETTINGS: 'pomodoro_settings'
};

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from local storage
  const loadProjects = (): Project[] => {
    const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (storedProjects) {
      const parsedProjects = JSON.parse(storedProjects);
      // Ensure all projects have a status property (for backwards compatibility)
      return parsedProjects.map((project: any) => ({
        ...project,
        status: project.status || 'not-started'
      }));
    }
    return [];
  };

  const loadSessionHistory = (): PomodoroSession[] => {
    const storedHistory = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  };

  const loadSettings = () => {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    return {
      pomodoroTime: DEFAULT_POMODORO_TIME,
      shortBreakTime: DEFAULT_SHORT_BREAK_TIME,
      longBreakTime: DEFAULT_LONG_BREAK_TIME
    };
  };

  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_POMODORO_TIME);
  
  // Settings
  const settings = loadSettings();
  const [pomodoroTime] = useState(settings.pomodoroTime);
  const [shortBreakTime] = useState(settings.shortBreakTime);
  const [longBreakTime] = useState(settings.longBreakTime);
  
  // Calculate total time based on timer mode
  const getTotalTime = () => {
    switch (timerMode) {
      case "pomodoro":
        return pomodoroTime;
      case "short-break":
        return shortBreakTime;
      case "long-break":
        return longBreakTime;
      default:
        return pomodoroTime;
    }
  };
  
  const totalTime = getTotalTime();
  
  // Projects and tasks
  const [projects, setProjects] = useState<Project[]>(loadProjects());
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
  // Session management
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<PomodoroSession[]>(loadSessionHistory());

  // Save data to local storage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      pomodoroTime,
      shortBreakTime,
      longBreakTime
    }));
  }, [pomodoroTime, shortBreakTime, longBreakTime]);
  
  // Effect to update timer when mode changes
  useEffect(() => {
    const newTotalTime = getTotalTime();
    setTimeRemaining(newTotalTime);
  }, [timerMode, pomodoroTime, shortBreakTime, longBreakTime]);
  
  // Timer countdown effect
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (isRunning && timeRemaining > 0) {
      intervalId = window.setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      if (currentSession && timerMode === "pomodoro") {
        // Notify user that the session is over
        notifySessionEnd();
        setIsRunning(false);
      }
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, timeRemaining, timerMode, currentSession]);
  
  // Request notification permission
  const requestNotificationPermission = () => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          toast.success("Notifications enabled!");
        }
      });
    }
  };
  
  // Show notification when session ends
  const notifySessionEnd = () => {
    if (Notification.permission === "granted") {
      new Notification("Pomodoro Timer Finished", {
        body: "Time for a break!",
        icon: "/favicon.ico",
      });
    }
    
    toast("Pomodoro session complete!", {
      description: "Time for a break!",
      duration: 5000,
    });
  };
  
  // Project and task management
  const addProject = (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      tasks: [],
      totalWorkTime: 0,
      status: "not-started",
    };
    
    setProjects((prevProjects) => [...prevProjects, newProject]);
    return newProject;
  };

  const updateProject = (projectId: string, name: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            name,
          };
        }
        return project;
      })
    );
  };

  const updateProjectStatus = (projectId: string, status: ProjectStatus) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          // If project is completed, mark all tasks as completed
          const updatedTasks = status === "completed" ? 
            project.tasks.map(task => ({...task, status: "completed"})) : 
            project.tasks;
          
          return {
            ...project,
            status,
            tasks: updatedTasks,
          };
        }
        return project;
      })
    );
    
    // Update current project reference if it's the one being updated
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev, 
        status,
        tasks: status === "completed" ? 
          prev.tasks.map(task => ({...task, status: "completed"})) : 
          prev.tasks
      } : null);
    }
  };

  const deleteProject = (projectId: string) => {
    // If the project being deleted is the current project, clear it
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject(null);
      setCurrentTask(null);
    }
    
    setProjects((prevProjects) => 
      prevProjects.filter((project) => project.id !== projectId)
    );
  };
  
  const addTask = (projectId: string, name: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name,
      status: "not-started",
      projectId,
      totalWorkTime: 0,
    };
    
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: [...project.tasks, newTask],
          };
        }
        return project;
      })
    );
    
    // Update the current project if it's the one being modified
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          tasks: [...prev.tasks, newTask]
        };
      });
    }
    
    return newTask;
  };

  const updateTask = (projectId: string, taskId: string, name: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  name,
                };
              }
              return task;
            }),
          };
        }
        return project;
      })
    );
    
    // Update current task if it's the one being modified
    if (currentTask && currentTask.id === taskId) {
      setCurrentTask(prev => prev ? {...prev, name} : null);
    }
  };
  
  const updateTaskStatus = (projectId: string, taskId: string, status: ProjectStatus) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  status,
                };
              }
              return task;
            }),
          };
        }
        return project;
      })
    );
    
    // Update current task if it's the one being modified
    if (currentTask && currentTask.id === taskId) {
      setCurrentTask(prev => prev ? {...prev, status} : null);
    }
  };
  
  const deleteTask = (projectId: string, taskId: string) => {
    // If the task being deleted is the current task, clear it
    if (currentTask && currentTask.id === taskId) {
      setCurrentTask(null);
    }
    
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.filter((task) => task.id !== taskId),
          };
        }
        return project;
      })
    );
  };
  
  // Session management
  const startSession = (projectId: string | null, taskId: string | null) => {
    const session: PomodoroSession = {
      id: Date.now().toString(),
      projectId,
      taskId,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      productivityLevel: null,
      isDistracted: false,
      mode: timerMode,
    };
    
    setCurrentSession(session);
    setIsRunning(true);
    
    // Request notification permission if needed
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };
  
  const pauseSession = () => {
    setIsRunning(false);
  };
  
  const resumeSession = () => {
    setIsRunning(true);
  };
  
  const endSession = (productivityLevel: ProductivityLevel, isDistracted: boolean) => {
    if (!currentSession) return;
    
    const endTime = Date.now();
    const duration = Math.floor((endTime - currentSession.startTime) / 1000);
    
    const completedSession: PomodoroSession = {
      ...currentSession,
      endTime,
      duration,
      productivityLevel,
      isDistracted,
    };
    
    setSessionHistory((prev) => [...prev, completedSession]);
    
    // Update project and task work time
    if (completedSession.projectId) {
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === completedSession.projectId) {
            // Update project total work time
            const updatedProject = {
              ...project,
              totalWorkTime: project.totalWorkTime + duration,
            };
            
            // Update task if it exists
            if (completedSession.taskId) {
              updatedProject.tasks = project.tasks.map((task) => {
                if (task.id === completedSession.taskId) {
                  return {
                    ...task,
                    totalWorkTime: task.totalWorkTime + duration,
                    status: "in-progress",
                  };
                }
                return task;
              });
            }
            
            return updatedProject;
          }
          return project;
        })
      );
    }
    
    setCurrentSession(null);
    setIsRunning(false);
    setTimerMode("pomodoro");
    setTimeRemaining(pomodoroTime);
  };
  
  // Daily summary
  const getDailySummary = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = sessionHistory.filter(
      (session) => new Date(session.startTime).getTime() >= today.getTime()
    );
    
    const totalSessions = todaySessions.length;
    const totalWorkTime = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    
    // Productivity breakdown
    const productivityBreakdown = todaySessions.reduce<Record<ProductivityLevel, number>>(
      (acc, session) => {
        if (session.productivityLevel) {
          acc[session.productivityLevel] = (acc[session.productivityLevel] || 0) + 1;
        }
        return acc;
      },
      { high: 0, medium: 0, low: 0, distracted: 0 }
    );
    
    // Project breakdown
    const projectTimeMap = new Map<string, number>();
    
    todaySessions.forEach((session) => {
      if (session.projectId) {
        const currentTime = projectTimeMap.get(session.projectId) || 0;
        projectTimeMap.set(session.projectId, currentTime + session.duration);
      }
    });
    
    const projectBreakdown = Array.from(projectTimeMap.entries()).map(([projectId, time]) => {
      const project = projects.find((p) => p.id === projectId);
      return {
        projectId,
        projectName: project ? project.name : "Unknown Project",
        time,
      };
    });
    
    return {
      totalSessions,
      totalWorkTime,
      productivityBreakdown,
      projectBreakdown,
    };
  };
  
  const value = {
    timerMode,
    setTimerMode,
    isRunning,
    setIsRunning,
    timeRemaining,
    setTimeRemaining,
    totalTime, // Adding the totalTime value to the context
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    projects,
    addProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    currentProject,
    setCurrentProject,
    currentTask,
    setCurrentTask,
    currentSession,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    sessionHistory,
    getDailySummary,
    requestNotificationPermission,
  };
  
  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
};

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  
  if (context === undefined) {
    throw new Error("usePomodoroContext must be used within a PomodoroProvider");
  }
  
  return context;
};
