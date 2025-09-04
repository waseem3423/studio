import { Flame } from "lucide-react";
import SettingsDialog from "./settings-dialog";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <div className="flex items-center gap-2">
        <Flame className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold font-headline">Dayflow Assistant</h1>
      </div>
      <SettingsDialog />
    </header>
  );
}
