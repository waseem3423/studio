'use client';
import { useRef, useState, useEffect } from 'react';
import { Cog, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDayflow } from '@/hooks/use-dayflow';
import { Separator } from '../ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Settings } from '@/lib/types';

export default function SettingsDialog() {
  const { settings, updateSettings, exportAllData, importData } = useDayflow();
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    setIsOpen(false);
    toast({ title: 'Settings Saved', description: 'Your new settings have been applied.' });
  };
  
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        await importData(content);
        toast({ title: 'Import Successful', description: 'Your data has been imported.' });
        setIsOpen(false);
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'The file is not a valid Dayflow backup.',
          variant: 'destructive',
        });
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleExport = () => {
    exportAllData();
    toast({ title: 'Export Started', description: 'Your data backup is downloading.' });
    setIsOpen(false);
  }

  const handleGoalChange = (goalName: keyof Settings['goals'], value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setLocalSettings(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          [goalName]: numValue,
        },
      }));
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Cog className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your daily schedule, set goals, and manage data.</DialogDescription>
        </DialogHeader>
        
        <div className="py-2 space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Daily Schedule</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="work-start">Work Start</Label>
              <Input
                id="work-start"
                type="time"
                value={localSettings.workStartTime}
                onChange={(e) => setLocalSettings({ ...localSettings, workStartTime: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="work-end">Work End</Label>
              <Input
                id="work-end"
                type="time"
                value={localSettings.workEndTime}
                onChange={(e) => setLocalSettings({ ...localSettings, workEndTime: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="break-start">Break Start</Label>
              <Input
                id="break-start"
                type="time"
                value={localSettings.breakStartTime}
                onChange={(e) => setLocalSettings({ ...localSettings, breakStartTime: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="break-end">Break End</Label>
              <Input
                id="break-end"
                type="time"
                value={localSettings.breakEndTime}
                onChange={(e) => setLocalSettings({ ...localSettings, breakEndTime: e.target.value })}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="py-2 space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">My Goals</h4>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="work-hours-goal">Weekly Work Hours Goal</Label>
              <Input
                id="work-hours-goal"
                type="number"
                value={localSettings.goals.weeklyWorkHours}
                onChange={(e) => handleGoalChange('weeklyWorkHours', e.target.value)}
                placeholder="e.g., 40"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expense-goal">Max Daily Expense (PKR)</Label>
              <Input
                id="expense-goal"
                type="number"
                value={localSettings.goals.maxDailyExpenses}
                onChange={(e) => handleGoalChange('maxDailyExpenses', e.target.value)}
                placeholder="e.g., 1000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prayer-streak-goal">Consecutive 5-Prayer Days Goal</Label>
              <Input
                id="prayer-streak-goal"
                type="number"
                value={localSettings.goals.prayerStreak}
                onChange={(e) => handleGoalChange('prayerStreak', e.target.value)}
                placeholder="e.g., 7"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="py-2 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Data Management</h4>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Import Data
                </Button>
                <Input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleFileImport}
                />
                <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" /> Export Data
                </Button>
            </div>
        </div>


        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
