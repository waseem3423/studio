'use client';

import { Flame, LogOut, BarChartBig } from "lucide-react";
import SettingsDialog from "./settings-dialog";
import { useDayflow } from "@/hooks/use-dayflow";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./theme-toggle";
import PeriodSummaryDialog from "./period-summary-dialog";

export default function Header() {
  const { user } = useDayflow();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut(auth);
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
    })
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-2">
        <Flame className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold font-headline">Dayflow Assistant</h1>
      </div>
      <div className="flex items-center gap-2">
        {user && <p className="text-sm text-muted-foreground hidden sm:block">{user.email}</p>}
        <PeriodSummaryDialog />
        <ThemeToggle />
        <SettingsDialog />
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
