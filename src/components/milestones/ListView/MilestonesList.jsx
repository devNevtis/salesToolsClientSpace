// src/components/milestones/ListView/MilestonesList.jsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CustomProgress } from "@/components/ui/custom-progress";
import { format } from 'date-fns';
import AddMilestoneDialog from '../dialogs/AddMilestoneDialog';
import { 
  Plus,
  ChevronDown,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import useMilestonesStore from '@/store/useMilestonesStore';
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'planned': { color: 'bg-slate-100 text-slate-700', icon: Clock },
    'in-progress': { color: 'bg-blue-100 text-blue-700', icon: Clock },
    'completed': { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    'delayed': { color: 'bg-red-100 text-red-700', icon: AlertCircle },
  };

  const config = statusConfig[status] || statusConfig.planned;
  const Icon = config.icon;

  return (
    <div className={cn("px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium", config.color)}>
      <Icon className="h-3 w-3" />
      <span className="capitalize">{status}</span>
    </div>
  );
};

export default function MilestonesList() {
  const { milestones, selectedLeadId } = useMilestonesStore();
  const [expandedMilestones, setExpandedMilestones] = useState(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
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
              {/* Milestone Header */}
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
                    <StatusBadge status={milestone.status} />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{milestone.progress}%</span>
                      <div className="w-32">
                         <CustomProgress value={milestone.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone Tasks */}
              {expandedMilestones.has(milestone.id) && (
                <div className="border-t px-4 py-3 bg-muted/50">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Tasks</h4>
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
                          <StatusBadge status={task.status} />
                        </div>
                        {/* Subtasks */}
                        {task.subtasks?.length > 0 && (
                          <div className="mt-2 pl-4 border-l space-y-2">
                            {task.subtasks.map((subtask) => (
                              <div 
                                key={subtask.id} 
                                className="flex items-center gap-2"
                              >
                                <div className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  subtask.completed ? "bg-green-500" : "bg-slate-300"
                                )} />
                                <span className="text-sm">{subtask.title}</span>
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
    </div>
  );
}