import Dashboard from "@/components/dayflow/dashboard";
import Header from "@/components/dayflow/header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Dashboard />
      </main>
    </div>
  );
}
