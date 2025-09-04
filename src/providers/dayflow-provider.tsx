'use client';

import type { ReactNode } from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isValid, parseISO } from 'date-fns';
import type { AppData, DayData, Settings, Task, Expense, Prayer, GoalSettings } from '@/lib/types';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_GOALS: GoalSettings = {
  weeklyWorkHours: 40,
  maxDailyExpenses: 1000,
  prayerStreak: 5,
  dailyTasksCompleted: 5,
}

const DEFAULT_SETTINGS: Settings = {
  workStartTime: '09:30',
  workEndTime: '17:30',
  breakStartTime: '13:20',
  breakEndTime: '14:20',
  goals: DEFAULT_GOALS,
};

const EMPTY_DAY_DATA: DayData = {
  work: { startTime: null, endTime: null },
  tasks: [],
  expenses: [],
  prayers: [],
  summary: '',
};

const SETTINGS_STORAGE_KEY = 'dayflow-settings';

export interface DayflowContextType {
  user: User | null;
  loading: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  dataForDate: DayData;
  weekData: AppData;
  monthData: AppData;
  allData: AppData;
  startWork: () => void;
  endWork: () => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (expenseId: string) => void;
  logPrayer: (prayer: Omit<Prayer, 'id'>) => void;
  deletePrayer: (prayerId: string) => void;
  isClient: boolean;
  setSummaryForDate: (dateKey: string, summary: string) => void;
  exportAllData: () => void;
  importData: (jsonContent: string) => Promise<void>;
}

export const DayflowContext = createContext<DayflowContextType | undefined>(undefined);

export function DayflowProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appData, setAppData] = useState<AppData>({});
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const { toast } = useToast();
  
  // Effect to handle auth state and load data
  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load settings from localStorage
        const storedSettings = localStorage.getItem(`${SETTINGS_STORAGE_KEY}-${currentUser.uid}`);
        const parsedSettings = storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;
        // Ensure goals object exists and has all keys
        parsedSettings.goals = { ...DEFAULT_GOALS, ...parsedSettings.goals };
        setSettings(parsedSettings);

        // Load app data from Firestore
        try {
          const docRef = doc(db, "dayflow_data", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setAppData(docSnap.data() || {});
          } else {
            setAppData({}); // Reset data for new user
            await setDoc(docRef, { userId: currentUser.uid });
          }
        } catch (error) {
          console.error("Failed to load data:", error);
        }
      } else {
        // Reset state when user logs out
        setAppData({});
        setSettings(DEFAULT_SETTINGS);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Effect to save settings to localStorage
  useEffect(() => {
    if (isClient && user) {
      localStorage.setItem(`${SETTINGS_STORAGE_KEY}-${user.uid}`, JSON.stringify(settings));
    }
  }, [settings, isClient, user]);
  
  const dateKey = format(selectedDate, 'yyyy-MM-dd');

  const updateFirestoreDoc = useCallback(async (updateData: { [key: string]: any }) => {
    if (!user) return;
    try {
      const docRef = doc(db, "dayflow_data", user.uid);
      await updateDoc(docRef, updateData);
    } catch (error) {
      if ((error as any).code === 'not-found') {
        const docRef = doc(db, "dayflow_data", user.uid);
        await setDoc(docRef, { userId: user.uid, ...updateData });
      } else {
        console.error("Error updating Firestore:", error);
      }
    }
  }, [user]);

  const updateStateAndFirestore = (date: string, dayData: DayData) => {
    const newAppData = { ...appData, [date]: dayData };
    setAppData(newAppData);
    updateFirestoreDoc({ [date]: dayData });
  };

  const setSummaryForDate = (dateKey: string, summary: string) => {
    const targetDayData = appData[dateKey] || { ...EMPTY_DAY_DATA };
    const newDayData = { ...targetDayData, summary };
    updateStateAndFirestore(dateKey, newDayData);
  }
  
  const startWork = () => {
    const newWorkData = { ...dataForDate.work, startTime: new Date().toISOString() };
    const newDayData = { ...dataForDate, work: newWorkData };
    updateStateAndFirestore(dateKey, newDayData);
     toast({
      title: 'Work Started',
      description: 'Your work session has been logged.',
    });
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
    toast({
      title: 'Task Added',
      description: `"${newTask.name}" has been added to your list.`,
    });
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
    toast({
      title: 'Expense Logged',
      description: `${newExpense.description} for PKR ${newExpense.amount.toFixed(2)} has been recorded.`,
    });
  };

  const deleteExpense = (expenseId: string) => {
    const newExpenses = dataForDate.expenses.filter(e => e.id !== expenseId);
    const newDayData = { ...dataForDate, expenses: newExpenses };
    updateStateAndFirestore(dateKey, newDayData);
  };
  
  const logPrayer = (prayer: Omit<Prayer, 'id'>) => {
    const newPrayer: Prayer = { ...prayer, id: prayer.name }; // Use name as ID to prevent duplicates
    const otherPrayers = dataForDate.prayers.filter(p => p.name !== prayer.name);
    const newPrayers = [...otherPrayers, newPrayer].sort((a, b) => a.name.localeCompare(b.name));
    const newDayData = { ...dataForDate, prayers: newPrayers };
    updateStateAndFirestore(dateKey, newDayData);
    
    let message = `${prayer.name} prayer logged as "${prayer.method}".`;
    if (prayer.method === 'Jamaat') {
      message = `Masha'Allah! Well done for praying ${prayer.name} in Jamaat.`
    }
    toast({
      title: 'Prayer Logged',
      description: message,
    });
  };
  
  const deletePrayer = (prayerId: string) => {
    const newPrayers = dataForDate.prayers.filter(p => p.name !== prayerId);
    const newDayData = { ...dataForDate, prayers: newPrayers };
    updateStateAndFirestore(dateKey, newDayData);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ 
      ...prev, 
      ...newSettings,
      goals: { ...prev.goals, ...newSettings.goals }
    }));
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
  
  const exportAllData = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(appData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `dayflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = async (jsonContent: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    const importedData = JSON.parse(jsonContent);

    // Basic validation
    if (typeof importedData !== 'object' || importedData === null) {
      throw new Error("Invalid JSON format");
    }
    for (const key in importedData) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !isValid(parseISO(key))) {
            throw new Error(`Invalid date key found in JSON: ${key}`);
        }
    }

    const mergedData = { ...appData, ...importedData };
    setAppData(mergedData);
    
    // Using setDoc to overwrite the entire document with the merged data
    const docRef = doc(db, "dayflow_data", user.uid);
    await setDoc(docRef, mergedData);
  };


  const weekData = getAggregatedData(startOfWeek(selectedDate, { weekStartsOn: 1 }), endOfWeek(selectedDate, { weekStartsOn: 1 }));
  const monthData = getAggregatedData(startOfMonth(selectedDate), endOfMonth(selectedDate));
  
  const dataForDate = appData[dateKey] || EMPTY_DAY_DATA;
  
  const value: DayflowContextType = {
    user,
    loading,
    selectedDate,
    setSelectedDate,
    settings,
    updateSettings,
    dataForDate,
    weekData,
    monthData,
    allData: appData,
    startWork,
    endWork,
    addTask,
    deleteTask,
    addExpense,
    deleteExpense,
    logPrayer,
    deletePrayer,
    isClient,
    setSummaryForDate,
    exportAllData,
    importData,
  };

  return <DayflowContext.Provider value={value}>{children}</DayflowContext.Provider>;
}
