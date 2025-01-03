// src/components/dashboard/SalesFunnel.jsx
"use client"

import { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useFunnelStore from '@/store/useFunnelStore';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
} from 'recharts';

const CustomLabel = ({ x, y, width, height, value, name, fill }) => {
  const rectWidth = Math.min(80, width * 0.8);
  const rectHeight = 40;
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
        {value}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {data.value} leads
        </p>
      </div>
    );
  }
  return null;
};

export default function SalesFunnel() {
  const { leadStatuses, isLoading } = useFunnelStore();

  const funnelData = useMemo(() => [
    { name: "NEW", value: leadStatuses?.new || 0, fill: "#224f5a" },
    { name: "QUALIFIED", value: leadStatuses?.qualified || 0, fill: "#29abe2" },
    { name: "DISCUSSION", value: leadStatuses?.discussion || 0, fill: "#66c7c3" },
    { name: "NEGOTIATION", value: leadStatuses?.negotiation || 0, fill: "#e5e5e5" },
    { name: "WON", value: leadStatuses?.won || 0, fill: "#f25c07" },
  ], [leadStatuses]);

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return (
      <Card className="relative bg-white">
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-[250px] w-full" />
        </div>
      </Card>
    );
  }

  // Si no hay datos o todos los valores son 0
  if (!leadStatuses || Object.values(funnelData).every(item => item.value === 0)) {
    return (
      <Card className="relative bg-white">
        <div className="p-4 h-[280px] flex flex-col items-center justify-center text-muted-foreground">
          <AlertCircle className="h-10 w-10 mb-2 text-muted-foreground/50" />
          <p>No leads data to display</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative bg-white">
      <div className="p-2 flex flex-col h-[280px]">
        {/* Header with Lost indicator */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#224f5a]">Sales Funnel</h2>
          {leadStatuses?.lost > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-600 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Lost: {leadStatuses.lost}</span>
            </div>
          )}
        </div>
        
        {/* Funnel Chart */}
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