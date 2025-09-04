'use client';

import { useDayflow } from '@/hooks/use-dayflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import WorkTracker from './work-tracker';
import TaskManager from './task-manager';
import ExpenseTracker from './expense-tracker';
import PrayerTracker from './prayer-tracker';
import DailySummary from './daily-summary';
import GoalTracker from './goal-tracker';

export default function Dashboard() {
  const { selectedDate, setSelectedDate, isClient } = useDayflow();

  if (!isClient) {
    return (
       <div className="flex items-center justify-center h-full">
         <div className="text-xl font-semibold">Loading Dayflow Assistant...</div>
       </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card>
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md"
            />
          </CardContent>
        </Card>
        <DailySummary />
        <GoalTracker />
      </div>
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <WorkTracker />
        <PrayerTracker />
        <TaskManager />
        <ExpenseTracker />
      </div>
    </div>
  );
}
