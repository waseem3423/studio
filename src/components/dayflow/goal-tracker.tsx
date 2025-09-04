'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Clock, DollarSign, Hand, CheckSquare } from 'lucide-react';
import { useDayflow } from '@/hooks/use-dayflow';
import { Progress } from '@/components/ui/progress';
import { differenceInMinutes, parseISO, format, subDays } from 'date-fns';
import type { AppData } from '@/lib/types';

function calculateWorkHours(dayData: AppData[string], settings: any): number {
  if (!dayData || !dayData.work.startTime || !dayData.work.endTime) return 0;

  const start = parseISO(dayData.work.startTime);
  const end = parseISO(dayData.work.endTime);
  
  const [breakStartHour, breakStartMinute] = settings.breakStartTime.split(':').map(Number);
  const [breakEndHour, breakEndMinute] = settings.breakEndTime.split(':').map(Number);
  
  const breakStart = new Date(start);
  breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

  const breakEnd = new Date(start);
  breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);

  let breakDuration = 0;
  if (end > breakStart && start < breakEnd) {
    const effectiveBreakStart = start > breakStart ? start : breakStart;
    const effectiveBreakEnd = end < breakEnd ? end : breakEnd;
    breakDuration = differenceInMinutes(effectiveBreakEnd, effectiveBreakStart);
  }
  
  const totalDuration = differenceInMinutes(end, start);
  const workMinutes = totalDuration - (breakDuration > 0 ? breakDuration : 0);

  return parseFloat((workMinutes / 60).toFixed(2));
}

export default function GoalTracker() {
  const { settings, dataForDate, weekData, allData } = useDayflow();
  const { goals } = settings;

  const weeklyWorkProgress = useMemo(() => {
    const totalHours = Object.values(weekData).reduce((sum, day) => sum + calculateWorkHours(day, settings), 0);
    const percentage = goals.weeklyWorkHours > 0 ? (totalHours / goals.weeklyWorkHours) * 100 : 0;
    return { current: totalHours.toFixed(2), target: goals.weeklyWorkHours, percentage };
  }, [weekData, settings, goals.weeklyWorkHours]);

  const dailyExpenseProgress = useMemo(() => {
    const totalExpenses = dataForDate.expenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = goals.maxDailyExpenses > 0 ? (totalExpenses / goals.maxDailyExpenses) * 100 : 0;
    return { current: totalExpenses.toFixed(2), target: goals.maxDailyExpenses, percentage };
  }, [dataForDate.expenses, goals.maxDailyExpenses]);

  const prayerStreakProgress = useMemo(() => {
    let streak = 0;
    let currentDate = new Date();
    while (true) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        const dayData = allData[dateKey];
        if (dayData && dayData.prayers.length === 5) {
            streak++;
        } else if (streak > 0 || dateKey < Object.keys(allData).sort()[0]) {
            // Stop if the streak is broken or we've gone past the first day of data
            break;
        } else if (format(currentDate, 'yyyy-MM-dd') < format(subDays(new Date(), 30), 'yyyy-MM-dd')) {
            // Safety break to avoid infinite loops on empty data
            break;
        }
        currentDate = subDays(currentDate, 1);
    }
    const percentage = goals.prayerStreak > 0 ? (streak / goals.prayerStreak) * 100 : 0;
    return { current: streak, target: goals.prayerStreak, percentage };
  }, [allData, goals.prayerStreak]);

  const dailyTasksProgress = useMemo(() => {
    const tasksCompleted = dataForDate.tasks.length;
    const percentage = goals.dailyTasksCompleted > 0 ? (tasksCompleted / goals.dailyTasksCompleted) * 100 : 0;
    return { current: tasksCompleted, target: goals.dailyTasksCompleted, percentage };
  }, [dataForDate.tasks, goals.dailyTasksCompleted]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Goal Tracker
        </CardTitle>
        <CardDescription>
          Track your progress towards your goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly Work Hours */}
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <p className="font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> Weekly Work</p>
            <p className="text-muted-foreground">{weeklyWorkProgress.current} / {weeklyWorkProgress.target} hrs</p>
          </div>
          <Progress value={weeklyWorkProgress.percentage} />
        </div>

        {/* Daily Tasks */}
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <p className="font-medium flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Daily Tasks</p>
            <p className="text-muted-foreground">{dailyTasksProgress.current} / {dailyTasksProgress.target} tasks</p>
          </div>
          <Progress value={dailyTasksProgress.percentage} />
        </div>

        {/* Daily Expenses */}
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <p className="font-medium flex items-center gap-2"><DollarSign className="w-4 h-4" /> Daily Expenses</p>
            <p className={`font-semibold ${dailyExpenseProgress.percentage > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                PKR {dailyExpenseProgress.current}
            </p>
          </div>
          <Progress value={dailyExpenseProgress.percentage} className={dailyExpenseProgress.percentage > 100 ? '[&>div]:bg-destructive' : ''} />
           <p className="text-xs text-right text-muted-foreground mt-1">Limit: PKR {dailyExpenseProgress.target}</p>
        </div>

        {/* Prayer Streak */}
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <p className="font-medium flex items-center gap-2"><Hand className="w-4 h-4" /> Prayer Streak</p>
            <p className="text-muted-foreground">{prayerStreakProgress.current} / {prayerStreakProgress.target} days</p>
          </div>
          <Progress value={prayerStreakProgress.percentage} />
        </div>
      </CardContent>
    </Card>
  );
}
