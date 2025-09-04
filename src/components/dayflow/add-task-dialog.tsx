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
import { Textarea } from '../ui/textarea';

const initialState = { name: '', startTime: '', endTime: '', notes: '' };

export default function AddTaskDialog() {
  const { addTask } = useDayflow();
  const [task, setTask] = useState(initialState);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (task.name && task.startTime && task.endTime) {
      addTask(task);
      setTask(initialState);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>Enter the details for your new task.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task Name</Label>
            <Input id="name" value={task.name} onChange={(e) => setTask({ ...task, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className='space-y-2'>
              <Label htmlFor="start-time">Start Time</Label>
              <Input id="start-time" type="time" value={task.startTime} onChange={(e) => setTask({ ...task, startTime: e.target.value })}/>
            </div>
             <div className='space-y-2'>
              <Label htmlFor="end-time">End Time</Label>
              <Input id="end-time" type="time" value={task.endTime} onChange={(e) => setTask({ ...task, endTime: e.target.value })}/>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={task.notes} onChange={(e) => setTask({ ...task, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
