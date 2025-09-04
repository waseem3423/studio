'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles } from 'lucide-react';
import { useDayflow } from '@/hooks/use-dayflow';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function DailySummary() {
  const { dataForDate } = useDayflow();
  const { summary, work } = dataForDate;
  
  const showSummary = summary && summary !== 'Generating your daily feedback...';
  const isGenerating = summary === 'Generating your daily feedback...';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          AI Daily Summary
        </CardTitle>
        <CardDescription>
          {showSummary ? "Here is your personalized feedback." : isGenerating ? "Generating feedback now..." : "Finish your work day to get feedback."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 min-h-[100px] flex items-center justify-center">
        {showSummary ? (
            <Alert>
                <AlertTitle className="flex items-center gap-2"><Bot className="w-4 h-4" /> Daily Feedback</AlertTitle>
                <AlertDescription>{summary}</AlertDescription>
            </Alert>
        ) : isGenerating ? (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Bot className="w-5 h-5 animate-spin" />
                <span>Analyzing your day...</span>
            </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">Your daily summary will appear here once you end your work.</p>
        )}
      </CardContent>
    </Card>
  );
}
