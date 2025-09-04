import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { DayflowProvider } from '@/providers/dayflow-provider';
import NextTopLoader from 'nextjs-toploader';


export const metadata: Metadata = {
  title: 'Dayflow Assistant',
  description: 'Your Digital Office Assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
        <DayflowProvider>
          {children}
          <Toaster />
        </DayflowProvider>
      </body>
    </html>
  );
}
