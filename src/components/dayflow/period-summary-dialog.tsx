'use client';
import { useState } from 'react';
import { BarChartBig, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDayflow } from '@/hooks/use-dayflow';
import { getPeriodSummary } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type SummaryState = {
  week: string | null;
  month: string | null;
};

export default function PeriodSummaryDialog() {
  const { weekData, monthData } = useDayflow();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<'week' | 'month' | null>(null);
  const [summaries, setSummaries] = useState<SummaryState>({ week: null, month: null });

  const handleTabChange = async (tab: 'week' | 'month') => {
    if (summaries[tab] || loading) return;

    setLoading(tab);
    const data = tab === 'week' ? weekData : monthData;
    const result = await getPeriodSummary(data, tab);

    if ('summary' in result) {
      setSummaries(prev => ({ ...prev, [tab]: result.summary }));
    } else {
      setSummaries(prev => ({ ...prev, [tab]: result.error }));
    }
    setLoading(null);
  };

  const renderContent = (period: 'week' | 'month') => {
    const summary = summaries[period];
    const isLoading = loading === period;

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
          <Bot className="w-8 h-8 animate-spin" />
          <p className="mt-2">Aapke {period} ka tajzia kiya ja raha hai...</p>
        </div>
      );
    }

    if (summary) {
      // Split summary into points for better formatting
      const summaryPoints = summary.split('\n').filter(line => line.trim() !== '');
      return (
        <Alert>
          <AlertTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent" /> {period === 'week' ? 'Haftay' : 'Maheenay'} ka Khulasa</AlertTitle>
          <AlertDescription>
            <ul className="space-y-2 list-disc list-inside mt-2">
                {summaryPoints.map((point, index) => <li key={index}>{point.replace(/^\d+\.\s*/, '')}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      );
    }
    
    return <div className="text-center text-muted-foreground py-10">Is tab par click karke summary hasil karein.</div>;
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <BarChartBig className="h-5 w-5" />
          <span className="sr-only">Reports</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Reports</DialogTitle>
          <DialogDescription>
            Apne pichle hafte aur mahine ki performance ka AI-powered tajzia (analysis) dekhein.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="week" className="w-full" onValueChange={(value) => handleTabChange(value as 'week' | 'month')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="mt-4">
            {renderContent('week')}
          </TabsContent>
          <TabsContent value="month" className="mt-4">
            {renderContent('month')}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
