'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Switch } from '@/components/ui/switch';

export default function CallNotesBarChart({ filteredNotes }) {
  const [viewType, setViewType] = useState('user');
  const [timeRange, setTimeRange] = useState('lastMonth');

  const isDateInRange = (createdAt, range) => {
    const now = new Date();
    const createdDate = new Date(createdAt);

    switch (range) {
      case 'today':
        return createdDate.toDateString() === now.toDateString();
      case 'lastWeek':
        return createdDate >= new Date(now.setDate(now.getDate() - 7));
      case 'lastMonth':
        return createdDate >= new Date(now.setMonth(now.getMonth() - 1));
      case 'last6Months':
        return createdDate >= new Date(now.setMonth(now.getMonth() - 6));
      default:
        return true;
    }
  };

  const filteredByTime = useMemo(() => {
    return filteredNotes.filter((note) =>
      isDateInRange(note.createdAt, timeRange)
    );
  }, [filteredNotes, timeRange]);

  const userData = useMemo(() => {
    const userCounts = filteredByTime.reduce((acc, note) => {
      const userName = note.user?.name || 'Unknown';
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(userCounts).map(([user, count]) => ({
      name: user,
      callNotes: count,
    }));
  }, [filteredByTime]);

  const dateData = useMemo(() => {
    const dateCounts = filteredByTime.reduce((acc, note) => {
      const date = new Date(note.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(dateCounts).map(([date, count]) => ({
      name: date,
      callNotes: count,
    }));
  }, [filteredByTime]);

  return (
    <Card className="p-4 h-[300px] flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#224f5a]">
          Call Notes Analytics
        </h2>
        <Switch
          checked={viewType === 'date'}
          onCheckedChange={(checked) => setViewType(checked ? 'date' : 'user')}
        />
      </div>

      {viewType === 'date' && (
        <Select onValueChange={setTimeRange} defaultValue="lastMonth">
          <SelectTrigger className="w-64 mt-2">
            <SelectValue placeholder="Select Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="lastWeek">Last Week</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="last6Months">Last 6 Months</SelectItem>
          </SelectContent>
        </Select>
      )}

      <div className="w-full flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={viewType === 'user' ? userData : dateData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="callNotes" fill="#29abe2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
