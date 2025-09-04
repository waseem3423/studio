'use server';

import { summarizeDailyData, type SummarizeDailyDataInput } from "@/ai/flows/summarize-daily-data-with-deeeseek-api";
import type { DayData, Settings } from "@/lib/types";
import { differenceInMinutes, parseISO } from "date-fns";

function calculateWorkHours(workData: DayData['work'], settings: Settings): number {
  if (!workData.startTime || !workData.endTime) return 0;

  const start = parseISO(workData.startTime);
  const end = parseISO(workData.endTime);
  
  const [breakStartHour, breakStartMinute] = settings.breakStartTime.split(':').map(Number);
  const [breakEndHour, breakEndMinute] = settings.breakEndTime.split(':').map(Number);
  
  const breakStart = new Date(start);
  breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

  const breakEnd = new Date(start);
  breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);

  const totalMinutes = differenceInMinutes(end, start);
  const breakMinutes = differenceInMinutes(breakEnd, breakStart);

  // Simple deduction, assuming break is always within work hours for this calculation
  const workMinutes = totalMinutes > breakMinutes ? totalMinutes - breakMinutes : totalMinutes;

  return parseFloat((workMinutes / 60).toFixed(2));
}

export async function getDailySummary(dayData: DayData, settings: Settings): Promise<{ feedback: string } | { error: string }> {
  try {
    const workHours = calculateWorkHours(dayData.work, settings);
    const taskList = dayData.tasks.map(t => t.name).join(', ') || 'No tasks completed.';
    const expenses = dayData.expenses.reduce((sum, e) => sum + e.amount, 0);
    const prayers = dayData.prayers.map(p => `${p.name} (${p.method})`).join(', ') || 'No prayers logged.';

    const input: SummarizeDailyDataInput = {
      workHours,
      taskList,
      expenses,
      prayers,
    };
    
    const result = await summarizeDailyData(input);

    return { feedback: result.feedbackMessage };
  } catch (error) {
    console.error('Error getting daily summary:', error);
    return { error: 'Failed to generate summary. Please try again.' };
  }
}
