// src/components/milestones/ListView/MilestonesList.jsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CustomProgress } from "@/components/ui/custom-progress";
import { format } from 'date-fns';
import AddMilestoneDialog from '../dialogs/AddMilestoneDialog';
import { Plus, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import useMilestonesStore from '@/store/useMilestonesStore';
import AddTaskDialog from '../dialogs/AddTaskDialog';
import EditTaskDialog from '../dialogs/EditTaskDialog';
import { Input } from '@/components/ui/input';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'planned': { color: 'bg-slate-100 text-slate-700', icon: Calendar },
    'in-progress': { color: 'bg-blue-100 text-blue-700', icon: Calendar },
    'completed': { color: 'bg-green-100 text-green-700', icon: Calendar },
  };

  const config = statusConfig[status] || statusConfig.planned;
  const Icon = config.icon;

  return (
    <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3" />
      <span className="capitalize">{status}</span>
    </div>
  );
};

export default function MilestonesList() {
  const { milestones, selectedLeadId, updateSubtask, deleteTask } = useMilestonesStore();
  const [expandedMilestones, setExpandedMilestones] = useState(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredMilestones = selectedLeadId 
    ? milestones.filter(m => m.leadId === selectedLeadId)
    : [];

  const toggleMilestone = (id) => {
    const newExpanded = new Set(expandedMilestones);
    if (expandedMilestones.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMilestones(newExpanded);
  };

  const handleAddTask = (milestone) => {
    setSelectedMilestone(milestone);
    setIsAddTaskOpen(true);
  };

  const handleEditTask = (task, milestone) => {
    setSelectedTask(task);
    setSelectedMilestone(milestone);
    setIsEditTaskOpen(true);
  };

  const handleDeleteTask = (milestoneId, taskId) => {
    deleteTask(milestoneId, taskId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Milestones</h2>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="gap-2 bg-[#0f172a] hover:bg-[#0f172a]/90"
        >
          <Plus className="h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      <div className="space-y-4">
        {filteredMilestones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No milestones found for this lead/customer
          </div>
        ) : (
          filteredMilestones.map((milestone) => (
            <div 
              key={milestone.id}
              className="border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => toggleMilestone(milestone.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {expandedMilestones.has(milestone.id) ? (
                      <ChevronDown className="h-5 w-5 mt-1 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 mt-1 text-muted-foreground" />
                    )}
                    <div>
                      <h3 className="font-medium">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(milestone.startDate), 'MMM d, yyyy')} - {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-medium">{milestone.progress}%</span>
                    <CustomProgress value={milestone.progress} className="h-2 w-32" />
                  </div>
                </div>
              </div>

              {expandedMilestones.has(milestone.id) && (
                <div className="border-t px-4 py-3 bg-muted/50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium">Tasks</h4>
                    <Button 
                      onClick={() => handleAddTask(milestone)}
                      size="sm" 
                      className="h-8 text-xs"
                    >
                      Add Task
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {milestone.tasks.map((task) => (
                      <div 
                        key={task.id}
                        className="bg-white p-3 rounded-lg border"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-sm">{task.title}</div>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            {task.assignedTo && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                Assigned to: {task.assignedTo.name}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 items-center">
                            <StatusBadge status={task.status} />
                            <Button size="sm" onClick={() => handleEditTask(task, milestone)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteTask(milestone.id, task.id)}>Delete</Button>
                          </div>
                        </div>
                        {task.subtasks?.length > 0 && (
                          <div className="mt-2 pl-4 border-l space-y-2">
                            {task.subtasks.map((subtask) => (
                              <div key={subtask.id} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={subtask.completed}
                                  onChange={() =>
                                    updateSubtask(
                                      milestone.id,
                                      task.id,
                                      subtask.id,
                                      { completed: !subtask.completed }
                                    )
                                  }
                                  className="h-4 w-4 rounded border-slate-200"
                                />
                                <Input
                                  value={subtask.title}
                                  onChange={(e) =>
                                    updateSubtask(
                                      milestone.id,
                                      task.id,
                                      subtask.id,
                                      { title: e.target.value }
                                    )
                                  }
                                  placeholder="Subtask title"
                                  className="h-9 border-slate-200 focus-visible:ring-0 focus-visible:border-slate-300"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <AddMilestoneDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
      <AddTaskDialog 
        open={isAddTaskOpen}
        onOpenChange={(open) => {
          setIsAddTaskOpen(open);
          if (!open) setSelectedMilestone(null);
        }}
        milestone={selectedMilestone}
      />
      <EditTaskDialog
        open={isEditTaskOpen}
        onOpenChange={(open) => {
          setIsEditTaskOpen(open);
          if (!open) setSelectedTask(null);
        }}
        task={selectedTask}
        milestoneId={selectedMilestone?.id}
      />
    </div>
  );
};
