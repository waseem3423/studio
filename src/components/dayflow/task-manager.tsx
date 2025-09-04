'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckSquare, Trash2 } from 'lucide-react';
import { useDayflow } from '@/hooks/use-dayflow';
import AddTaskDialog from './add-task-dialog';
import { ScrollArea } from '../ui/scroll-area';

export default function TaskManager() {
  const { dataForDate, deleteTask } = useDayflow();
  const { tasks } = dataForDate;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Task Management
        </CardTitle>
        <CardDescription>Add and track your daily tasks.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {tasks.length > 0 ? (
          <ScrollArea className="h-48">
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-2 rounded-md border group">
                  <div>
                    <p className="font-semibold">{task.name}</p>
                    <p className="text-xs text-muted-foreground">{task.startTime} - {task.endTime}</p>
                    {task.notes && <p className="text-sm text-muted-foreground mt-1">{task.notes}</p>}
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-10">
            No tasks added for today.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <AddTaskDialog />
      </CardFooter>
    </Card>
  );
}
