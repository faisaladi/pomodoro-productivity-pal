
import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Plus, Clock } from "lucide-react";
import { usePomodoroContext, Project, Task } from "@/context/PomodoroContext";
import { formatDuration } from "@/lib/utils/timer";

const ProjectsList = () => {
  const { 
    projects, 
    addProject, 
    addTask, 
    currentProject,
    setCurrentProject,
    currentTask,
    setCurrentTask,
    startSession,
    timerMode,
    isRunning
  } = usePomodoroContext();

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName("");
      setIsAddProjectOpen(false);
    }
  };

  const handleAddTask = () => {
    if (newTaskName.trim() && selectedProjectId) {
      addTask(selectedProjectId, newTaskName.trim());
      setNewTaskName("");
      setIsAddTaskOpen(false);
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentTask(null);
  };

  const handleSelectTask = (project: Project, task: Task) => {
    setCurrentProject(project);
    setCurrentTask(task);
  };

  const handleStartTimer = (project: Project, task: Task | null = null) => {
    setCurrentProject(project);
    if (task) {
      setCurrentTask(task);
    } else {
      setCurrentTask(null);
    }
    
    if (timerMode !== "pomodoro") {
      return; // Don't start sessions for break modes
    }
    
    if (!isRunning) {
      startSession(project.id, task?.id || null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => setIsAddProjectOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No projects yet</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => setIsAddProjectOpen(true)}
          >
            Add your first project
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Project</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <React.Fragment key={project.id}>
                  {/* Project row */}
                  <TableRow 
                    className={currentProject?.id === project.id && !currentTask ? 
                      "bg-muted/50" : "hover:bg-muted/30"}
                    onClick={() => handleSelectProject(project)}
                  >
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProjectId(project.id);
                          setIsAddTaskOpen(true);
                        }}
                      >
                        <Plus size={16} className="mr-1" /> Add Task
                      </Button>
                    </TableCell>
                    <TableCell>
                      {project.tasks.some(t => t.status === "in-progress") ? "In Progress" : "Not Started"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="flex items-center justify-end">
                        <Clock size={14} className="mr-1" />
                        {formatDuration(project.totalWorkTime)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTimer(project);
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Task rows */}
                  {project.tasks.map((task) => (
                    <TableRow 
                      key={task.id}
                      className={(currentTask && currentTask.id === task.id) ? 
                        "bg-muted/50" : "hover:bg-muted/30 pl-4"}
                      onClick={() => handleSelectTask(project, task)}
                    >
                      <TableCell className="pl-8">└</TableCell>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>
                        {task.status === "not-started" ? "Not Started" : 
                         task.status === "in-progress" ? "In Progress" : "Completed"}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end">
                          <Clock size={14} className="mr-1" />
                          {formatDuration(task.totalWorkTime)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartTimer(project, task);
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Project Dialog */}
      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>Create a new project to track your work</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input 
                id="projectName" 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)} 
                placeholder="Enter project name"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProjectOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProject}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>Create a new task for your project</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="taskName">Task Name</Label>
              <Input 
                id="taskName" 
                value={newTaskName} 
                onChange={(e) => setNewTaskName(e.target.value)} 
                placeholder="Enter task name"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsList;
