'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Hand, Download, CheckCircle2, XCircle } from 'lucide-react';
import { useDayflow } from '@/hooks/use-dayflow';
import type { PrayerType } from '@/lib/types';
import LogPrayerDialog from './log-prayer-dialog';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { exportToCsv } from '@/lib/csv';

const PRAYERS: PrayerType[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayerTracker() {
  const { dataForDate, monthData, selectedDate } = useDayflow();
  const { prayers } = dataForDate;
  const { toast } = useToast();

  const handleExport = () => {
    const allPrayers = Object.entries(monthData).flatMap(([date, dayData]) => 
      dayData.prayers.map(prayer => ({
        date,
        prayer: prayer.name,
        time: prayer.time,
        method: prayer.method,
        notes: prayer.notes,
      }))
    );
     if(allPrayers.length > 0) {
      exportToCsv(`prayers-${format(selectedDate, 'yyyy-MM')}.csv`, allPrayers);
      toast({ title: 'Success', description: 'Prayer data exported.' });
    } else {
      toast({ title: 'No Data', description: 'There is no prayer data for this month to export.', variant: 'destructive' });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="w-5 h-5" />
          Prayer Tracker
        </CardTitle>
        <CardDescription>Log your daily prayers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {PRAYERS.map((prayerName) => {
          const loggedPrayer = prayers.find((p) => p.name === prayerName);
          return (
            <div key={prayerName} className="flex items-center justify-between p-2 rounded-md border">
              <div className="flex items-center gap-2">
                {loggedPrayer ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="font-semibold">{prayerName}</p>
                  {loggedPrayer && <p className="text-xs text-muted-foreground">{loggedPrayer.method} at {loggedPrayer.time}</p>}
                </div>
              </div>
              <LogPrayerDialog prayerName={prayerName} loggedPrayer={loggedPrayer} />
            </div>
          );
        })}
      </CardContent>
       <CardFooter className="flex justify-center">
        <Button variant="outline" onClick={handleExport} className="w-full">
          <Download className="mr-2 h-4 w-4"/> Export Month's Prayers
        </Button>
      </CardFooter>
    </Card>
  );
}
