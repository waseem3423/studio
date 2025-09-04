export interface Task {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
}

export type PrayerType = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export type PrayerMethod = 'Jamaat' | 'Alone';

export interface Prayer {
  id: string;
  name: PrayerType;
  time: string;
  method: PrayerMethod;
  notes: string;
}

export interface WorkData {
  startTime: string | null;
  endTime: string | null;
}

export interface DayData {
  work: WorkData;
  tasks: Task[];
  expenses: Expense[];
  prayers: Prayer[];
  summary?: string;
}

export interface GoalSettings {
  weeklyWorkHours: number;
  maxDailyExpenses: number;
  prayerStreak: number;
}

export interface Settings {
  workStartTime: string;
  workEndTime: string;
  breakStartTime: string;
  breakEndTime: string;
  goals: GoalSettings;
}

export interface AppData {
  [date: string]: DayData;
}
