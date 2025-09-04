'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, StopCircle, Bot } from 'lucide-react';
import { useDayflow } from '@/hooks/use-dayflow';
import { format, parseISO, differenceInMinutes, getDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getDailySummary } from '@/app/actions';

export default function WorkTracker() {
  const { dataForDate, settings, startWork, endWork, selectedDate, setSummary } = useDayflow();
  const { work } = dataForDate;
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const isWeekend = useMemo(() => {
    const day = getDay(selectedDate);
    return day === 0 || day === 6; // Sunday or Saturday
  }, [selectedDate]);

  const totalHours = useMemo(() => {
    if (!work.startTime || !work.endTime) return 0;
    
    const start = parseISO(work.startTime);
    const end = parseISO(work.endTime);
    
    const [breakStartHour, breakStartMinute] = settings.breakStartTime.split(':').map(Number);
    const [breakEndHour, breakEndMinute] = settings.breakEndTime.split(':').map(Number);
    
    const breakStart = new Date(start);
    breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);

    const breakEnd = new Date(start);
    breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);

    let breakDuration = 0;
    if (end > breakStart && start < breakEnd) {
      const effectiveBreakStart = start > breakStart ? start : breakStart;
      const effectiveBreakEnd = end < breakEnd ? end : breakEnd;
      breakDuration = differenceInMinutes(effectiveBreakEnd, effectiveBreakStart);
    }
    
    const totalDuration = differenceInMinutes(end, start);
    const workMinutes = totalDuration - (breakDuration > 0 ? breakDuration : 0);

    return parseFloat((workMinutes / 60).toFixed(2));
  }, [work.startTime, work.endTime, settings]);
  
  const handleEndWork = async () => {
    endWork();
    const targetHours = 8;
    const workedHours = totalHours; // Calculate before triggering toasts and summary

    if (workedHours >= targetHours) {
        toast({
            title: "Great Job!",
            description: `You worked ${workedHours} hours today.`,
        });
    } else {
        toast({
            title: "Work Complete",
            description: `You worked ${workedHours} hours. Target was ${targetHours} hours.`,
            variant: "destructive"
        });
    }

    // Automatically generate summary
    setIsGenerating(true);
    setSummary('Generating your daily feedback...');
    const result = await getDailySummary(dataForDate, settings);
    setIsGenerating(false);

    if ('feedback' in result) {
      setSummary(result.feedback);
      toast({
        title: "AI Feedback Received",
        description: "Your personalized daily summary is ready."
      })
    } else {
       setSummary('');
       toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Work Tracker
        </CardTitle>
        <CardDescription>Log your daily work hours.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isWeekend ? (
          <div className="text-center font-semibold text-muted-foreground p-8 rounded-md bg-muted">
            It's the weekend! Enjoy your day off.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={startWork} disabled={!!work.startTime}>
                <Play className="mr-2 h-4 w-4" /> Start Work
              </Button>
              <Button 
                onClick={handleEndWork} 
                disabled={!work.startTime || !!work.endTime || isGenerating} 
                variant="destructive"
              >
                {isGenerating ? <Bot className="mr-2 h-4 w-4 animate-spin" /> : <StopCircle className="mr-2 h-4 w-4" />}
                {isGenerating ? 'Generating...' : 'End Work'}
              </Button>
            </div>
            <div className="flex justify-between items-center p-3 rounded-md border">
              <span className="text-sm font-medium">Start Time:</span>
              <span className="text-sm">{work.startTime ? format(parseISO(work.startTime), 'p') : 'Not started'}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-md border">
              <span className="text-sm font-medium">End Time:</span>
              <span className="text-sm">{work.endTime ? format(parseISO(work.endTime), 'p') : 'In progress'}</span>
            </div>
          </>
        )}
      </CardContent>
      {!isWeekend && work.endTime && (
        <CardFooter>
          <div className="w-full text-center">
            <p className="font-bold text-lg">{totalHours} hours</p>
            <p className="text-sm text-muted-foreground">Total work duration today</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
