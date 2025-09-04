'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDayflow } from '@/hooks/use-dayflow';

const initialState = { amount: '', description: '' };

export default function AddExpenseDialog() {
  const { addExpense } = useDayflow();
  const [expense, setExpense] = useState(initialState);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    const amount = parseFloat(expense.amount);
    if (expense.description && !isNaN(amount) && amount > 0) {
      addExpense({ description: expense.description, amount });
      setExpense(initialState);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>Enter the amount and description of the expense.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={expense.amount}
              onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={expense.description}
              onChange={(e) => setExpense({ ...expense, description: e.target.value })}
              placeholder="e.g., Lunch"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Add Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
