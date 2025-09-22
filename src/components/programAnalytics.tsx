'use client';

import { useState, useEffect } from 'react';
import type { Program, Download, DownloadsResponse } from '@/app/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProgramAnalyticsProps {
  program?: Program;
}

export default function ProgramAnalytics({ program }: ProgramAnalyticsProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interval, setInterval] = useState('Daily');
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Always local
  const [data, setData] = useState<Download[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default dates (last 7 days) in user's local timezone
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);

    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    setEndDate(end.toISOString().slice(0, -1));
    setStartDate(start.toISOString().slice(0, -1));
  }, []);
  const fetchData = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);

    try {
      if (!program) {
        throw new Error('Program not selected');
      }
      const params = new URLSearchParams({
        startDate,
        endDate,
        interval,
        timezone,
        programId: program.Id,
      });

      const response = await fetch(`/api/programAnalytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const result: DownloadsResponse = await response.json();
      setData(result.Items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, interval, timezone, program?.Id]);

  const totalDownloads = data.reduce((sum, item) => sum + item.Downloads, 0);

  const chartData = data.map((item) => ({
    ...item,
    period: new Date(item.From).toLocaleDateString(),
  }));

  return (
    <div className="w-full mb-8">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Program Analytics</h2>

      {/* Control Bar */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-card rounded-lg border">
        <div className="flex gap-2 items-center">
          <Label htmlFor="start-date">Start Date:</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate.split('T')[0]}
            onChange={(e) => {
              setStartDate(e.target.value + 'T00:00:00.000');
            }}
            className="w-auto"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Label htmlFor="end-date">End Date:</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate.split('T')[0]}
            onChange={(e) => {
              setEndDate(e.target.value + 'T23:59:59.999');
            }}
            className="w-auto"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Label>Interval:</Label>
          <Select value={interval} onValueChange={setInterval}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hourly">Hourly</SelectItem>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Summary */}
      <div className="mb-4">
        <p className="text-lg text-foreground">
          Total clip downloads during period:{' '}
          <span className="font-semibold">
            {totalDownloads.toLocaleString()}
          </span>
        </p>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-lg border p-4">
        {loading && (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}

        {error && (
          <div className="h-64 flex items-center justify-center">
            <p className="text-destructive">Error: {error}</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Downloads"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
