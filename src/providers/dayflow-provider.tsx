'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { AppData, DayData, Settings, Task, Expense, Prayer } from '@/lib/types';

const DEFAULT_SETTINGS: Settings = {
  workStartTime: '09:30',
  workEndTime: '17:30',
  breakStartTime: '13:20',
  breakEndTime: '14:20',
};

const EMPTY_DAY_DATA: DayData = {
  work: { startTime: null, endTime: null },
  tasks: [],
  expenses: [],
  prayers: [],
};

const DATA_STORAGE_KEY = 'dayflow-data';
const SETTINGS_STORAGE_KEY = 'dayflow-settings';

export interface DayflowContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  dataForDate: DayData;
  weekData: AppData;
  monthData: AppData;
  startWork: () => void;
  endWork: () => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (expenseId: string) => void;
  logPrayer: (prayer: Omit<Prayer, 'id'>) => void;
  deletePrayer: (prayerId: string) => void;
  isClient: boolean;
}

export const DayflowContext = createContext<DayflowContextType | undefined>(undefined);

export function DayflowProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appData, setAppData] = useState<AppData>({});
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedData = localStorage.getItem(DATA_STORAGE_KEY);
      if (storedData) setAppData(JSON.parse(storedData));

      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) setSettings(JSON.parse(storedSettings));
      else setSettings(DEFAULT_SETTINGS);
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(appData));
    }
  }, [appData, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isClient]);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  const updateDateData = useCallback((date: string, newData: Partial<DayData>) => {
    setAppData(prev => ({
      ...prev,
      [date]: {
        ...EMPTY_DAY_DATA,
        ...prev[date],
        ...newData,
      },
    }));
  }, []);

  const startWork = () => updateDateData(dateKey, { work: { ...appData[dateKey]?.work, startTime: new Date().toISOString() } });
  const endWork = () => updateDateData(dateKey, { work: { ...appData[dateKey]?.work, endTime: new Date().toISOString() } });

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: Date.now().toString() };
    const currentTasks = appData[dateKey]?.tasks || [];
    updateDateData(dateKey, { tasks: [...currentTasks, newTask] });
  };
  
  const deleteTask = (taskId: string) => {
    const currentTasks = appData[dateKey]?.tasks || [];
    updateDateData(dateKey, { tasks: currentTasks.filter(t => t.id !== taskId) });
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: Date.now().toString() };
    const currentExpenses = appData[dateKey]?.expenses || [];
    updateDateData(dateKey, { expenses: [...currentExpenses, newExpense] });
  };

  const deleteExpense = (expenseId: string) => {
    const currentExpenses = appData[dateKey]?.expenses || [];
    updateDateData(dateKey, { expenses: currentExpenses.filter(e => e.id !== expenseId) });
  };
  
  const logPrayer = (prayer: Omit<Prayer, 'id'>) => {
    const newPrayer: Prayer = { ...prayer, id: Date.now().toString() };
    const currentPrayers = appData[dateKey]?.prayers.filter(p => p.name !== prayer.name) || [];
    updateDateData(dateKey, { prayers: [...currentPrayers, newPrayer] });
  };
  
  const deletePrayer = (prayerId: string) => {
    const currentPrayers = appData[dateKey]?.prayers || [];
    updateDateData(dateKey, { prayers: currentPrayers.filter(p => p.id !== prayerId) });
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getAggregatedData = (start: Date, end: Date): AppData => {
    const intervalDays = eachDayOfInterval({ start, end });
    const result: AppData = {};
    intervalDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      if (appData[dayKey]) {
        result[dayKey] = appData[dayKey];
      }
    });
    return result;
  };
  
  const weekData = getAggregatedData(startOfWeek(selectedDate, { weekStartsOn: 1 }), endOfWeek(selectedDate, { weekStartsOn: 1 }));
  const monthData = getAggregatedData(startOfMonth(selectedDate), endOfMonth(selectedDate));
  
  const value: DayflowContextType = {
    selectedDate,
    setSelectedDate,
    settings,
    updateSettings,
    dataForDate: appData[dateKey] || EMPTY_DAY_DATA,
    weekData,
    monthData,
    startWork,
    endWork,
    addTask,
    deleteTask,
    addExpense,
    deleteExpense,
    logPrayer,
    deletePrayer,
    isClient,
  };

  return <DayflowContext.Provider value={value}>{children}</DayflowContext.Provider>;
}
