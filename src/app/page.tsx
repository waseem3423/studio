
'use client';

import { useEffect } from 'react';
import { useDayflow } from '@/hooks/use-dayflow';
import Dashboard from "@/components/dayflow/dashboard";
import Header from "@/components/dayflow/header";
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function Home() {
  const { user, loading } = useDayflow();
  const router = useRouter();
  const adminEmail = "waseemgaming40@gmail.com";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.email === adminEmail) {
        router.push('/admin');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.email === adminEmail) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your Dayflow...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Dashboard />
      </main>
    </div>
  );
}
