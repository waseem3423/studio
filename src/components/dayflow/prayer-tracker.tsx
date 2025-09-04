'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand, CheckCircle2, XCircle } from 'lucide-react';
import { useDayflow } from '@/hooks/use-dayflow';
import type { PrayerType } from '@/lib/types';
import LogPrayerDialog from './log-prayer-dialog';
import { Button } from '../ui/button';
import { getPrayerStatus } from '@/lib/utils';
import * as React from 'react';

const PRAYERS: PrayerType[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function PrayerTracker() {
  const { dataForDate, selectedDate } = useDayflow();
  const { prayers } = dataForDate;
 
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="w-5 h-5" />
          Prayer Tracker
        </CardTitle>
        <CardDescription>Log your daily prayers. Past prayers are locked.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {PRAYERS.map((prayerName) => {
          const loggedPrayer = prayers.find((p) => p.name === prayerName);
          const { isLocked, status } = getPrayerStatus(prayerName, loggedPrayer, selectedDate);
          
          return (
            <div key={prayerName} className="flex items-center justify-between p-2 rounded-md border">
              <div className="flex items-center gap-2">
                {status === 'prayed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {status === 'missed' && <XCircle className="w-5 h-5 text-red-500" />}
                {status === 'pending' && <div className="w-5 h-5" />}
                
                <div>
                  <p className="font-semibold">{prayerName}</p>
                  {loggedPrayer && <p className="text-xs text-muted-foreground">{loggedPrayer.method} at {loggedPrayer.time}</p>}
                  {status === 'missed' && !loggedPrayer && <p className="text-xs text-red-500">Time passed</p>}
                </div>
              </div>
              
              {!isLocked ? (
                <LogPrayerDialog prayerName={prayerName} loggedPrayer={loggedPrayer} isDisabled={isLocked} />
              ) : (
                <Button variant="outline" size="sm" disabled>
                  {loggedPrayer ? 'Logged' : 'Missed'}
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
