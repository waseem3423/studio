'use client';
import type { Prayer, PrayerMethod, PrayerType } from '@/lib/types';
import { useState, useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useToast } from '@/hooks/use-toast';

interface LogPrayerDialogProps {
  prayerName: PrayerType;
  loggedPrayer: Prayer | undefined;
  isDisabled?: boolean;
}

export default function LogPrayerDialog({ prayerName, loggedPrayer, isDisabled = false }: LogPrayerDialogProps) {
  const { logPrayer } = useDayflow();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [prayerData, setPrayerData] = useState({
    time: '',
    method: 'Alone' as PrayerMethod,
    notes: '',
  });

  useEffect(() => {
    if (loggedPrayer) {
      setPrayerData({
        time: loggedPrayer.time,
        method: loggedPrayer.method,
        notes: loggedPrayer.notes,
      });
    } else {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0,5);
        setPrayerData({ time: currentTime, method: 'Alone', notes: '' });
    }
  }, [loggedPrayer, isOpen]);

  const handleSave = () => {
    if (prayerData.time) {
      logPrayer({ name: prayerName, ...prayerData });
      setIsOpen(false);
      if (prayerData.method === 'Jamaat') {
        toast({
            title: "Masha'Allah!",
            description: `Well done for praying ${prayerName} in Jamaat.`
        })
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={loggedPrayer ? 'secondary' : 'outline'} size="sm" disabled={isDisabled}>
          {loggedPrayer ? 'Edit' : 'Log'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log {prayerName} Prayer</DialogTitle>
          <DialogDescription>Enter the details for your prayer.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={prayerData.time} onChange={(e) => setPrayerData({ ...prayerData, time: e.target.value })}/>
          </div>
          <div className="space-y-2">
            <Label>Method</Label>
            <RadioGroup
              value={prayerData.method}
              onValueChange={(value: PrayerMethod) => setPrayerData({ ...prayerData, method: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Jamaat" id="jamaat" />
                <Label htmlFor="jamaat">Jamaat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Alone" id="alone" />
                <Label htmlFor="alone">Alone</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={prayerData.notes} onChange={(e) => setPrayerData({ ...prayerData, notes: e.target.value })}/>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
