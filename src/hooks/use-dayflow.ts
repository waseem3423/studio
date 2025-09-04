'use client';
import { useContext } from 'react';
import { DayflowContext, DayflowContextType } from '@/providers/dayflow-provider';

export const useDayflow = (): DayflowContextType => {
  const context = useContext(DayflowContext);
  if (context === undefined) {
    throw new Error('useDayflow must be used within a DayflowProvider');
  }
  return context;
};
