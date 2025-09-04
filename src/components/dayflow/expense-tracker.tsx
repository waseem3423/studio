'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DollarSign, Trash2 } from 'lucide-react';
import { useDayflow } from '@/hooks/use-dayflow';
import AddExpenseDialog from './add-expense-dialog';
import { ScrollArea } from '../ui/scroll-area';
import { useMemo } from 'react';
import ExpenseChart from './expense-chart';

export default function ExpenseTracker() {
  const { dataForDate, weekData, monthData, deleteExpense } = useDayflow();
  const { expenses } = dataForDate;

  const totals = useMemo(() => {
    const daily = expenses.reduce((sum, e) => sum + e.amount, 0);
    const weekly = Object.values(weekData).flatMap(d => d.expenses).reduce((sum, e) => sum + e.amount, 0);
    const monthly = Object.values(monthData).flatMap(d => d.expenses).reduce((sum, e) => sum + e.amount, 0);
    return { daily, weekly, monthly };
  }, [expenses, weekData, monthData]);
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Expense Tracker
        </CardTitle>
        <CardDescription>Monitor your daily, weekly, and monthly spending.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
            <div>
                <p className="font-bold text-lg">PKR {totals.daily.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <div>
                <p className="font-bold text-lg">PKR {totals.weekly.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
            </div>
            <div>
                <p className="font-bold text-lg">PKR {totals.monthly.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
            </div>
        </div>
        
        <ExpenseChart data={monthData} />

        {expenses.length > 0 ? (
          <ScrollArea className="h-32">
            <ul className="space-y-2">
              {expenses.map((expense) => (
                <li key={expense.id} className="flex items-center justify-between p-2 rounded-md border group">
                  <p>{expense.description}</p>
                  <div className='flex items-center gap-2'>
                    <p className="font-semibold">PKR {expense.amount.toFixed(2)}</p>
                    <button onClick={() => deleteExpense(expense.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-8">
            No expenses logged for today.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <AddExpenseDialog />
      </CardFooter>
    </Card>
  );
}
