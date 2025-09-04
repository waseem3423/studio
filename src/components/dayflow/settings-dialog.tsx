'use client';
import { useState } from 'react';
import { Cog } from 'lucide-react';
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

export default function SettingsDialog() {
  const { settings, updateSettings } = useDayflow();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setIsOpen(false);
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
          <DialogDescription>Configure your daily schedule.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="work-start" className="text-right">
              Work Start
            </Label>
            <Input
              id="work-start"
              type="time"
              value={localSettings.workStartTime}
              onChange={(e) => setLocalSettings({ ...localSettings, workStartTime: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="work-end" className="text-right">
              Work End
            </Label>
            <Input
              id="work-end"
              type="time"
              value={localSettings.workEndTime}
              onChange={(e) => setLocalSettings({ ...localSettings, workEndTime: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="break-start" className="text-right">
              Break Start
            </Label>
            <Input
              id="break-start"
              type="time"
              value={localSettings.breakStartTime}
              onChange={(e) => setLocalSettings({ ...localSettings, breakStartTime: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="break-end" className="text-right">
              Break End
            </Label>
            <Input
              id="break-end"
              type="time"
              value={localSettings.breakEndTime}
              onChange={(e) => setLocalSettings({ ...localSettings, breakEndTime: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
