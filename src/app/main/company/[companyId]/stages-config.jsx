// src/app/main/company/[companyId]/stages-config.jsx
"use client";
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useCompanyStages from '@/store/useCompanyStages';
import axios from '@/lib/axios';
import { env } from '@/config/env';
import { MdOutlineBallot, MdDragIndicator, MdAdd, MdDelete, MdOutlineDelete } from "react-icons/md";
import { Loader2 } from "lucide-react";
import { FaTrashCan } from 'react-icons/fa6';

// TODO(Backend Integration): New stage creation needs backend support
// - Current limitation: Backend requires MongoDB ObjectId for new stages
// - Required: Backend endpoint for stage creation or support for stages without _id
// - Temporary solution: Disabled new stage creation functionality

export default function StagesConfig({ companyId }) {
  const { stages, setStages } = useCompanyStages();
  const [isSaving, setIsSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const { toast } = useToast();

  const handleNameChange = (stageId, newName) => {
    const updatedStages = stages.map(stage => {
      if (stage._id === stageId) {
        return { ...stage, name: newName };
      }
      return stage;
    });
    setStages(updatedStages);
  };

  const handleToggleStage = (stageId) => {
    const updatedStages = stages.map(stage => {
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
    // Hacer el fantasma de arrastre más sutil
    const dragGhost = e.target.cloneNode(true);
    dragGhost.style.opacity = '0.5';
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, 20, 20);
    setTimeout(() => {
      document.body.removeChild(dragGhost);
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (!draggedItem || draggedItem._id === stages[index]._id) return;

    const newStages = [...stages];
    const draggedIndex = stages.findIndex(stage => stage._id === draggedItem._id);
    
    // Remover el elemento arrastrado
    newStages.splice(draggedIndex, 1);
    // Insertar en la nueva posición
    newStages.splice(index, 0, draggedItem);
    
    // Actualizar el orden
    const updatedStages = newStages.map((stage, idx) => ({
      ...stage,
      order: idx + 1
    }));
    
    setStages(updatedStages);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const addNewStage = () => {
    toast({
      variant: "warning",
      title: "Feature coming soon",
      description: "New stage creation is temporarily disabled pending backend support.",
    });
  };

  const deleteStage = (stageId) => {
    const updatedStages = stages
      .filter(stage => stage._id !== stageId)
      .map((stage, idx) => ({
        ...stage,
        order: idx + 1
      }));
    setStages(updatedStages);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.get(`${env.endpoints.company.getById(companyId)}`);
      const currentConfiguration = response.data.configuration;
  
      // Solo guardar stages con IDs válidos de MongoDB
      const validStages = stages.filter(stage => !stage._id.startsWith('temp-'));
  
      await axios.put(`${env.endpoints.company.getById(companyId)}`, {
        configuration: {
          ...currentConfiguration,
          stages: validStages
        }
      });
      
      toast({
        title: "Stages updated successfully",
        description: "Your funnel stages configuration has been saved.",
      });
    } catch (error) {
      console.error('Error saving stages:', error);
      toast({
        variant: "destructive",
        title: "Error saving stages",
        description: "There was a problem saving your changes. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MdOutlineBallot className="text-2xl text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-700">Sales Funnel Stages</h2>
          <span className="text-sm text-gray-500 ml-2">Configure your sales process</span>
        </div>
        <Button
            onClick={addNewStage}
            variant="outline"
            className="flex items-center gap-2 opacity-50 cursor-not-allowed"
            disabled={true}
            >
            <MdAdd size={20} />
            <span>Add Stage</span>
            <span className="text-xs ml-2">(Coming soon)</span>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardContent className="pt-4">
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div 
                key={stage._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-4 px-4 py-2 bg-white rounded-lg border 
                  ${draggedItem && draggedItem._id === stage._id ? 'opacity-50' : ''}
                  hover:border-gray-400 transition-colors cursor-move`}
              >
                <MdDragIndicator className="text-gray-400" size={20} />
                
                <div className="flex-1">
                  <Input
                    value={stage.name}
                    onChange={(e) => handleNameChange(stage._id, e.target.value)}
                    className="font-medium"
                  />
                  <p className="text-xs font-semibold text-gray-500 mt-1">Order: {stage.order}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {stage.show ? 'Visible' : 'Hidden'}
                    </span>
                    <Switch
                      checked={stage.show}
                      onCheckedChange={() => handleToggleStage(stage._id)}
                      className="data-[state=checked]:bg-red-500"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteStage(stage._id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <FaTrashCan size={20} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving changes
            </>
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </div>
  );
}