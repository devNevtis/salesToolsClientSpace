//src/components/dashboard/LeadSourceChart.jsx
import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Mail,
  MessageSquare,
  PhoneCall,
  Facebook,
  MapPin,
  Zap,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = [
  '#224f5a', // Primary dark
  '#29abe2', // Secondary blue
  '#66c7c3', // Highlight teal
  '#f25c07', // Action orange
  '#92c5de', // Light blue
];

const CHANNEL_ICONS = {
  Email: <Mail className="inline h-5 w-5" />,
  SMS: <MessageSquare className="inline h-5 w-5" />,
  Call: <PhoneCall className="inline h-5 w-5" />,
  FB: <Facebook className="inline h-5 w-5" />,
  GMB: <MapPin className="inline h-5 w-5" />,
  WhatsApp: <Zap className="inline h-5 w-5" />,
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium flex items-center">
          {CHANNEL_ICONS[data.name]} <span className="ml-2">{data.name}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {data.value} contacts ({data.percentage}%)
        </p>
        <p className="text-sm font-medium text-green-600">
          {data.conversionRate}% conversion
        </p>
      </div>
    );
  }
  return null;
};

export default function LeadSourceChart({ contacts }) {
  const contactArray = useMemo(() => {
    if (!contacts || Object.keys(contacts).length === 0) return [];
    return Object.values(contacts).flat();
  }, [contacts]);

  const chartData = useMemo(() => {
    if (contactArray.length === 0) return [];

    const sourceGroups = contactArray.reduce((acc, contact) => {
      const activeChannels = Object.entries(contact.dndSettings || {})
        .filter(([_, config]) => config.status === 'true')
        .map(([channel]) => channel);

      if (activeChannels.length === 0) {
        const source = 'Direct';
        if (!acc[source]) {
          acc[source] = { total: 0, converted: 0 };
        }
        acc[source].total += 1;
        if (contact.opportunities?.length > 0) {
          acc[source].converted += 1;
        }
      } else {
        activeChannels.forEach((channel) => {
          if (!acc[channel]) {
            acc[channel] = { total: 0, converted: 0 };
          }
          acc[channel].total += 1;
          if (contact.opportunities?.length > 0) {
            acc[channel].converted += 1;
          }
        });
      }

      return acc;
    }, {});

    return Object.entries(sourceGroups)
      .map(([source, data]) => ({
        name: source,
        value: data.total,
        percentage: ((data.total / contactArray.length) * 100).toFixed(1),
        conversionRate: ((data.converted / data.total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);
  }, [contactArray]);

  if (!contacts) {
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

  if (contactArray.length === 0) {
    return (
      <Card className="relative bg-white">
        <div className="p-4 h-[280px] flex flex-col items-center justify-center text-muted-foreground">
          <p>No contact data to display</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative bg-white">
      <div className="p-2 flex flex-col h-[290px]">
        <h2 className="text-xl font-bold text-[#224f5a] mb-4">
          Contact Sources
        </h2>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconSize={18}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value) => (
                  <span className="flex items-center space-x-2">
                    {CHANNEL_ICONS[value]} <span>{value}</span>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
