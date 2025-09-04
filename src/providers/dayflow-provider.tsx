'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { AppData, DayData, Settings, Task, Expense, Prayer } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';

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

const USER_ID_KEY = 'dayflow-user-id';
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
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appData, setAppData] = useState<AppData>({});
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  
  // Effect to set up user ID and load data from Firestore
  useEffect(() => {
    setIsClient(true);
    let currentUserId = localStorage.getItem(USER_ID_KEY);
    if (!currentUserId) {
      currentUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem(USER_ID_KEY, currentUserId);
    }
    setUserId(currentUserId);

    const loadData = async (uid: string) => {
      try {
        // Load settings from localStorage
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) setSettings(JSON.parse(storedSettings));
        else setSettings(DEFAULT_SETTINGS);
        
        // Load app data from Firestore
        const docRef = doc(db, "dayflow_data", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAppData(docSnap.data() || {});
        } else {
          // If no document exists, create one
          await setDoc(docRef, { userId: uid });
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    
    if (currentUserId) {
        loadData(currentUserId);
    }
  }, []);

  // Effect to save settings to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isClient]);

  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  const updateFirestoreDoc = useCallback(async (updateData: { [key: string]: any }) => {
    if (!userId) return;
    try {
      const docRef = doc(db, "dayflow_data", userId);
      await updateDoc(docRef, updateData);
    } catch (error) {
      // If document doesn't exist, create it.
      if ((error as any).code === 'not-found') {
        const docRef = doc(db, "dayflow_data", userId);
        await setDoc(docRef, { userId, ...updateData });
      } else {
        console.error("Error updating Firestore:", error);
      }
    }
  }, [userId]);

  const updateStateAndFirestore = (date: string, dayData: DayData) => {
    // Update local state
    const newAppData = { ...appData, [date]: dayData };
    setAppData(newAppData);
    // Update Firestore
    updateFirestoreDoc({ [date]: dayData });
  };
  
  const startWork = () => {
    const newWorkData = { ...dataForDate.work, startTime: new Date().toISOString() };
    const newDayData = { ...dataForDate, work: newWorkData };
    updateStateAndFirestore(dateKey, newDayData);
  };
  
  const endWork = () => {
    const newWorkData = { ...dataForDate.work, endTime: new Date().toISOString() };
    const newDayData = { ...dataForDate, work: newWorkData };
    updateStateAndFirestore(dateKey, newDayData);
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: Date.now().toString() };
    const newTasks = [...dataForDate.tasks, newTask];
    const newDayData = { ...dataForDate, tasks: newTasks };
    updateStateAndFirestore(dateKey, newDayData);
  };
  
  const deleteTask = (taskId: string) => {
    const newTasks = dataForDate.tasks.filter(t => t.id !== taskId);
    const newDayData = { ...dataForDate, tasks: newTasks };
    updateStateAndFirestore(dateKey, newDayData);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: Date.now().toString() };
    const newExpenses = [...dataForDate.expenses, newExpense];
    const newDayData = { ...dataForDate, expenses: newExpenses };
    updateStateAndFirestore(dateKey, newDayData);
  };

  const deleteExpense = (expenseId: string) => {
    const newExpenses = dataForDate.expenses.filter(e => e.id !== expenseId);
    const newDayData = { ...dataForDate, expenses: newExpenses };
    updateStateAndFirestore(dateKey, newDayData);
  };
  
  const logPrayer = (prayer: Omit<Prayer, 'id'>) => {
    const newPrayer: Prayer = { ...prayer, id: prayer.name }; // Use name as ID to prevent duplicates
    const otherPrayers = dataForDate.prayers.filter(p => p.name !== prayer.name);
    const newPrayers = [...otherPrayers, newPrayer];
    const newDayData = { ...dataForDate, prayers: newPrayers };
    updateStateAndFirestore(dateKey, newDayData);
  };
  
  const deletePrayer = (prayerId: string) => {
     // In logPrayer, we use name as ID, so here we filter by name
    const newPrayers = dataForDate.prayers.filter(p => p.name !== prayerId);
    const newDayData = { ...dataForDate, prayers: newPrayers };
    updateStateAndFirestore(dateKey, newDayData);
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
  
  const dataForDate = appData[dateKey] || EMPTY_DAY_DATA;
  
  const value: DayflowContextType = {
    selectedDate,
    setSelectedDate,
    settings,
    updateSettings,
    dataForDate,
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
