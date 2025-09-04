'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useDayflow } from '@/hooks/use-dayflow';
import { getDailySummary } from '@/app/actions';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function DailySummary() {
  const { dataForDate, settings } = useDayflow();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary('');
    setProgress(0);

    const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 10 : 90));
    }, 200);

    const result = await getDailySummary(dataForDate, settings);
    
    clearInterval(interval);
    setProgress(100);

    if ('feedback' in result) {
      setSummary(result.feedback);
      toast({
        title: "AI Feedback Received",
        description: "Your personalized daily summary is ready."
      })
    } else {
       toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      })
    }
    
    setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          AI Daily Summary
        </CardTitle>
        <CardDescription>Get personalized feedback on your day's activities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? 'Generating...' : 'Get Personalized Feedback'}
        </Button>
        {isLoading && <Progress value={progress} className="w-full" />}
        {summary && !isLoading && (
            <Alert>
                <AlertTitle>Daily Feedback</AlertTitle>
                <AlertDescription>{summary}</AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
