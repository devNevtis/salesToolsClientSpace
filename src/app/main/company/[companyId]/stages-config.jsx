// src/app/main/company/[companyId]/stages-config.jsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import useCompanyStages from '@/store/useCompanyStages';
import axios from '@/lib/axios';
import { env } from '@/config/env';
import {
  MdOutlineBallot,
  MdDragIndicator,
  MdAdd,
  MdDelete,
} from 'react-icons/md';
import { Loader2 } from 'lucide-react';
import { FaTrashCan } from 'react-icons/fa6';

// Nota sobre limitación actual de añadir stages (se mantiene)
// TODO(Backend Integration): New stage creation needs backend support

export default function StagesConfig({ companyId }) {
  const { stages, setStages, fetchStages } = useCompanyStages();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadStages = async () => {
      setIsLoading(true);
      try {
        if (fetchStages) {
          await fetchStages(companyId);
        } else {
          console.warn(
            'fetchStages function not found in useCompanyStages store.'
          );
        }
      } catch (error) {
        console.error('Error loading initial stages:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load funnel stages.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (companyId) {
      loadStages();
    } else {
      setIsLoading(false);
      setStages([]);
    }
  }, [companyId, fetchStages, setStages, toast]);

  const handleNameChange = (stageId, newName) => {
    const updatedStages = stages.map((stage) => {
      if (stage._id === stageId) {
        return { ...stage, name: newName };
      }
      return stage;
    });
    setStages(updatedStages);
  };

  const handleToggleStage = (stageId) => {
    const updatedStages = stages.map((stage) => {
      if (stage._id === stageId) {
        return { ...stage, show: !stage.show };
      }
      return stage;
    });
    setStages(updatedStages);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(stages[index]);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = stages[index];
    if (!draggedItem || draggedItem._id === draggedOverItem._id) {
      return;
    }

    const items = [...stages];
    const draggedItemIndex = items.findIndex(
      (item) => item._id === draggedItem._id
    );
    const draggedOverItemIndex = index;

    const [reorderedItem] = items.splice(draggedItemIndex, 1);
    items.splice(draggedOverItemIndex, 0, reorderedItem);

    const updatedStagesOrder = items.map((stage, idx) => ({
      ...stage,
      order: idx + 1,
    }));

    setStages(updatedStagesOrder);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const addNewStage = () => {
    toast({
      variant: 'warning',
      title: 'Feature coming soon',
      description: 'New stage creation requires backend updates.',
    });
  };

  const deleteStage = (stageId) => {
    const updatedStages = stages
      .filter((stage) => stage._id !== stageId)
      .map((stage, idx) => ({
        ...stage,
        order: idx + 1,
      }));
    setStages(updatedStages);
    toast({
      title: 'Stage removed',
      description: 'Remember to save changes.',
      variant: 'info',
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const hasEmptyName = stages.some(
        (stage) => !stage.name || stage.name.trim() === ''
      );
      if (hasEmptyName) {
        toast({
          variant: 'destructive',
          title: 'Invalid Name',
          description: 'Stage names cannot be empty.',
        });
        setIsSaving(false);
        return;
      }

      await axios.put(`${env.endpoints.company.getById(companyId)}`, {
        'configuration.stages': stages,
      });

      toast({
        title: 'Stages updated successfully',
        description: 'Your funnel configuration has been saved.',
      });
    } catch (error) {
      console.error('Error saving stages:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving stages',
        description: error.response?.data?.message || 'Failed to save changes.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-0">
      {' '}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2">
          <MdOutlineBallot className="text-2xl text-gray-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Sales Funnel Stages
            </h2>
            <span className="text-sm text-gray-500">
              Configure your sales process
            </span>
          </div>
        </div>
        <Button
          onClick={addNewStage}
          variant="outline"
          className="w-full sm:w-auto flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
          disabled={true}
        >
          <MdAdd size={20} />
          <span>Add Stage</span>
          <span className="text-xs ml-2">(Coming soon)</span>
        </Button>
      </div>
      <Card className="shadow-md border">
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : stages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No stages configured yet.
            </div>
          ) : (
            <div className="space-y-3">
              {stages.map((stage, index) => (
                <div
                  key={stage._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`stage-item-draggable flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 px-3 py-3 sm:px-4 sm:py-2 bg-white rounded-lg border transition-opacity duration-150 ease-in-out ${
                    draggedItem && draggedItem._id === stage._id
                      ? 'opacity-30'
                      : 'opacity-100'
                  } // Opacidad al arrastrar
                   hover:border-gray-400 hover:shadow-sm cursor-move`}
                >
                  <div className="flex items-center gap-2 text-gray-400 shrink-0">
                    <MdDragIndicator size={20} />
                    <span className="text-xs font-bold w-6 text-center">
                      #{stage.order}
                    </span>{' '}
                  </div>

                  <div className="flex-1 min-w-0">
                    {' '}
                    <Input
                      value={stage.name}
                      onChange={(e) =>
                        handleNameChange(stage._id, e.target.value)
                      }
                      className="font-medium text-sm sm:text-base"
                      placeholder="Stage Name"
                    />
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 shrink-0 pl-6 sm:pl-0">
                    {' '}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-gray-500">
                        {stage.show ? 'Visible' : 'Hidden'}
                      </span>
                      <Switch
                        checked={stage.show}
                        onCheckedChange={() => handleToggleStage(stage._id)}
                        id={`switch-${stage._id}`}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteStage(stage._id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                      title="Delete Stage"
                    >
                      {' '}
                      <FaTrashCan size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end mt-6">
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {' '}
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            'Save Stage Configuration'
          )}
        </Button>
      </div>
    </div>
  );
}
