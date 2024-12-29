// src/components/dashboard/OpportunityFunnel.jsx
"use client"

import { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { AlertCircle, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useFunnelStore from '@/store/useFunnelStore';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
} from 'recharts';

// Paleta de colores consistente con la UI
const STAGE_COLORS = [
  "#224f5a", // Primary dark
  "#29abe2", // Secondary blue
  "#66c7c3", // Highlight teal
  "#f25c07", // Action orange
  "#92c5de", // Light blue
  "#2c7fb8", // Medium blue
  "#48a999", // Medium teal
  "#f4a261", // Light orange
  "#e76f51", // Dark orange
];

const CustomLabel = ({ x, y, width, height, value, name, fill }) => {
  const rectWidth = Math.min(120, width * 0.8);
  const rectHeight = 45;
  const fontSize = 12;
  
  return (
    <g>
      <rect
        x={x + width / 2 - rectWidth / 2}
        y={y + height / 2 - rectHeight / 2}
        width={rectWidth}
        height={rectHeight}
        rx={4}
        ry={4}
        fill="white"
        opacity={0.95}
        className="drop-shadow-sm"
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - fontSize / 2}
        textAnchor="middle"
        fill={fill}
        className="text-sm font-medium"
      >
        {name}
      </text>
      <text
        x={x + width / 2}
        y={y + height / 2 + fontSize}
        textAnchor="middle"
        fill={fill}
        className="text-sm font-bold"
      >
        {typeof value === 'number' ? 
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(value) : value}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-medium">{data.name}</span>
          <span className="text-xs text-muted-foreground">Stage</span>
        </div>
        <p className="text-sm font-semibold text-green-600">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function OpportunityFunnel() {
  const { opportunityStages, stages, isLoading } = useFunnelStore();

  const funnelData = useMemo(() => {
    if (!stages || !opportunityStages) return [];

    // Ordenar stages por su orden y filtrar activos
    const activeStages = [...stages]
      .filter(stage => stage.show)
      .sort((a, b) => a.order - b.order);

    return activeStages.map((stage, index) => ({
      name: stage.name,
      value: opportunityStages[stage.name] || 0,
      fill: STAGE_COLORS[index % STAGE_COLORS.length],
      order: stage.order
    }));
  }, [stages, opportunityStages]);

  const totalValue = useMemo(() => 
    funnelData.reduce((sum, item) => sum + item.value, 0)
  , [funnelData]);

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return (
      <Card className="relative bg-white">
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-[250px] w-full" />
        </div>
      </Card>
    );
  }

  // Si no hay datos o el funnel está vacío
  if (!funnelData.length || funnelData.every(item => item.value === 0)) {
    return (
      <Card className="relative bg-white">
        <div className="p-4 h-[300px] flex flex-col items-center justify-center text-muted-foreground">
          <AlertCircle className="h-10 w-10 mb-2 text-muted-foreground/50" />
          <p>No opportunity data to display</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative bg-white">
      <div className="p-4 flex flex-col h-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#224f5a]">Opportunity Sales</h2>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-full">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(totalValue)}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel
                data={funnelData}
                dataKey="value"
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-in-out"
              >
                <LabelList
                  position="center"
                  content={<CustomLabel />}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}