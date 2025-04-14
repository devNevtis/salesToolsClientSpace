// src/components/dashboard/SalesFunnel.jsx
'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import useFunnelStore from '@/store/useFunnelStore';
import { ResponsiveContainer, FunnelChart, Funnel, Tooltip } from 'recharts';

// Nueva paleta de colores UX-friendly para el funnel
const STAGE_COLORS = {
  New: '#5B9BFF', // Azul Brillante
  Qualified: '#936BFF', // Púrpura Vivo
  Discussion: '#E57BA4', // Rosa Intenso
  Negotiation: '#FFA559', // Naranja Fuerte
  Won: '#57C78E', // Verde Éxito
  Lost: '#FF6B6B', // Rojo Intenso
};

// Función para abreviar nombres de etapas
const getAbbreviatedName = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase(); // Tomamos las 3 primeras letras
  return words[0][0].toUpperCase() + words[1][0].toUpperCase(); // Tomamos la primera letra de cada palabra
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-muted-foreground">{data.value} leads</p>
      </div>
    );
  }
  return null;
};

export default function SalesFunnel() {
  const { leadStatuses, isLoading } = useFunnelStore();

  const funnelData = useMemo(
    () => [
      { name: 'New', value: leadStatuses?.new || 0, fill: STAGE_COLORS.New },
      {
        name: 'Qualified',
        value: leadStatuses?.qualified || 0,
        fill: STAGE_COLORS.Qualified,
      },
      {
        name: 'Discussion',
        value: leadStatuses?.discussion || 0,
        fill: STAGE_COLORS.Discussion,
      },
      {
        name: 'Negotiation',
        value: leadStatuses?.negotiation || 0,
        fill: STAGE_COLORS.Negotiation,
      },
      { name: 'Won', value: leadStatuses?.won || 0, fill: STAGE_COLORS.Won },
    ],
    [leadStatuses]
  );

  if (isLoading) {
    return (
      <Card className="relative bg-white">
        <div className="p-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-4 h-[250px] w-full" />
        </div>
      </Card>
    );
  }

  if (!leadStatuses || funnelData.every((item) => item.value === 0)) {
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
      <div className="p-4 flex flex-col h-[290px]">
        {/* Header con título y Lost indicator */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#224f5a]">Sales Funnel</h2>
          {leadStatuses?.lost > 0 && (
            <div className="flex items-center gap-2 px-2 py-1 bg-red-100 text-red-600 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Lost: {leadStatuses.lost}</span>
            </div>
          )}
        </div>

        {/* Embudo gráfico */}
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
              />
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de valores por etapa - Ahora en una sola línea con etiquetas abreviadas */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {funnelData.map((stage) => (
            <div
              key={stage.name}
              className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stage.fill }}
              ></span>
              <span className="text-sm font-medium">
                {getAbbreviatedName(stage.name)}:
              </span>
              <span className="text-xs font-semibold text-[#224f5a]">
                {stage.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
