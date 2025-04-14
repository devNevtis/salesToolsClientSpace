//src/components/dashboard/OpportunityFunnel.jsx
'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import useFunnelStore from '@/store/useFunnelStore';
import { ResponsiveContainer, FunnelChart, Funnel, Tooltip } from 'recharts';

// Paleta de colores UX-friendly basada en el funnel de oportunidades
/* const STAGE_COLORS = {
  Prospecting: '#0d6efd', // Azul
  Qualification: '#6610f2', // Púrpura
  'Need Analysis': '#d63384', // Rosa
  Demo: '#fd7e14', // Naranja
  'Proposal Sent': '#ffc107', // Amarillo
  Negotiation: '#198754', // Verde
  Won: '#198754', // Verde Éxito
  Lost: '#dc3545', // Rojo
}; */

// Paleta de colores en tonos pastel para el funnel de oportunidades
/* const STAGE_COLORS = {
  Prospecting: '#A5C8FF', // Azul Pastel
  Qualification: '#C6A5FF', // Púrpura Pastel
  'Need Analysis': '#F5A6C6', // Rosa Pastel
  Demo: '#FFBF86', // Naranja Pastel
  'Proposal Sent': '#FFE29A', // Amarillo Pastel
  Negotiation: '#A3D9A5', // Verde Pastel
  Won: '#86D9A3', // Verde Éxito Pastel
  Lost: '#FFADAD', // Rojo Pastel
}; */

// Paleta de colores en tonos intermedios (equilibrio entre intensidad y suavidad)
const STAGE_COLORS = {
  Prospecting: '#5B9BFF', // Azul Medio
  Qualification: '#936BFF', // Púrpura Medio
  'Need Analysis': '#E57BA4', // Rosa Medio
  Demo: '#FFA559', // Naranja Medio
  'Proposal Sent': '#FFD678', // Amarillo Medio
  Negotiation: '#6FCF97', // Verde Medio
  Won: '#57C78E', // Verde Éxito Medio
  Lost: '#FF6B6B', // Rojo Medio
};

// Función para abreviar los nombres de las etapas
const getAbbreviatedName = (name) => {
  if (!name) return '';
  const words = name.split(' ');
  if (words.length === 1) return words[0][0]; // Tomamos las 3 primeras letras
  return words[0][0].toUpperCase() + '.' + words[1][0].toUpperCase(); // Tomamos la primera letra de cada palabra
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
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

    return [...stages]
      .filter((stage) => stage.show)
      .sort((a, b) => a.order - b.order)
      .map((stage) => ({
        name: stage.name,
        shortName: getAbbreviatedName(stage.name),
        value: opportunityStages[stage.name] || 0,
        fill: STAGE_COLORS[stage.name] || '#6c757d', // Gris si es una etapa personalizada
      }));
  }, [stages, opportunityStages]);

  const totalValue = useMemo(
    () => funnelData.reduce((sum, item) => sum + item.value, 0),
    [funnelData]
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

  if (!funnelData.length || funnelData.every((item) => item.value === 0)) {
    return (
      <Card className="relative bg-white">
        <div className="p-4 h-[280px] flex flex-col items-center justify-center text-muted-foreground">
          <AlertCircle className="h-10 w-10 mb-2 text-muted-foreground/50" />
          <p>No opportunity data to display</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative bg-white">
      <div className="p-4 flex flex-col h-[290px]">
        {/* Header con total de oportunidades */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#224f5a]">
            Opportunity Sales
          </h2>
          <div className="flex items-center gap-2 px-2 py-1 bg-green-50 text-green-600 rounded-full">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(totalValue)}
            </span>
          </div>
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

        {/* Lista de valores por etapa */}
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
              <span className="text-sm font-medium">{stage.shortName}:</span>
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
