// src/components/milestones/ListView/MilestoneItem.jsx
'use client';

import { useEffect } from "react";
import { ChevronDown, ChevronRight, Calendar, Plus, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskItem from "./TaskItem";
import { useState } from "react";
import { format } from 'date-fns';
import EditMilestoneDialog from "../dialogs/EditMilestoneDialog";
import DeleteMilestoneDialog from "../dialogs/DeleteMilestoneDialog";
import useCompanyTheme from '@/store/useCompanyTheme';

export default function MilestoneItem({ milestone, onAddTask, onEditTask, onToggleExpand }) {
  const { theme } = useCompanyTheme();
  const [expanded, setExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
    onToggleExpand(milestone.id);
  };

  useEffect(() => {
    if (theme.base1) {
      document.documentElement.style.setProperty('--theme-base1', theme.base1);
    }
    if (theme.base2) {
      document.documentElement.style.setProperty('--theme-base2', theme.base2);
    }
    if (theme.highlighting) {
      document.documentElement.style.setProperty('--theme-highlighting', theme.highlighting);
    }
    if (theme.callToAction) {
      document.documentElement.style.setProperty('--theme-callToAction', theme.callToAction);
    }
  }, [theme]);

  // Formatear fechas
  const formattedStartDate = format(new Date(milestone.startDate), 'MMM d, yyyy');
  const formattedDueDate = format(new Date(milestone.dueDate), 'MMM d, yyyy');

  //console.log(milestone);

  return (
    <div className="border rounded-lg hover:border-primary/50 transition-colors">
      <div 
        className="p-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            {expanded ? (
              <ChevronDown className="h-5 w-5 mt-1 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 mt-1 text-muted-foreground" />
            )}
            <div>
              <h3 className="font-medium">{milestone.title}</h3>
              <p className="text-sm text-muted-foreground">{milestone.description}</p>
              <div className="flex flex-row justify-between">
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formattedStartDate} - {formattedDueDate}
                  </span>
                </div>

              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-col items-end gap-2">
              <div className="relative w-32 h-2 bg-gray-200 rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-[var(--theme-base2)]"
                  style={{ width: `${milestone.progress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{milestone.progress}%</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit3 className="w-4 h-4 text-[var(--theme-base1)]" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4 text-[var(--theme-callToAction)]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t px-4 py-3 bg-muted/50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium">Tasks</h4>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => onAddTask(milestone)} 
              className="text-primary hover:text-primary/90"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-3">
            {milestone.tasks.map((task) => (
                <TaskItem 
                    key={task._id} 
                    task={task} 
                    milestoneId={milestone._id} // Pasar milestoneId
                    onEditTask={(task) => onEditTask(task, milestone._id)} // Pasar el milestoneId
                />
            ))}
          </div>
        </div>
      )}
      <EditMilestoneDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        milestone={milestone}
      />
      <DeleteMilestoneDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        milestone={milestone}
      />
    </div>
  );
}

