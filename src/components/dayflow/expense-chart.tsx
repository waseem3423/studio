'use client';
import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import type { AppData } from '@/lib/types';

interface ExpenseChartProps {
  data: AppData;
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const chartData = useMemo(() => {
    if (Object.keys(data).length === 0) return [];
    
    const firstDate = new Date(Object.keys(data)[0]);
    const monthStart = startOfMonth(firstDate);
    const monthEnd = endOfMonth(firstDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return daysInMonth.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayData = data[dateKey];
      const total = dayData ? dayData.expenses.reduce((sum, e) => sum + e.amount, 0) : 0;
      return {
        date: format(day, 'MMM d'),
        total,
      };
    });
  }, [data]);

  const chartConfig = {
    total: {
      label: 'Total',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="w-full h-40">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value, index) => {
            // Show tick for every 5 days to prevent clutter
            if (index % 5 === 0) {
              return value;
            }
            return '';
          }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `PKR ${value}`}
        />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
