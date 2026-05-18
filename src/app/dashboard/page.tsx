import { getStats } from '@/lib/store';
import { getSession } from '@/app/actions/auth';
import { StatCard } from '@/components/dashboard/StatCard';
import { InventoryChart } from '@/components/dashboard/InventoryChart';
import { 
  BookCopy, 
  Users, 
  UserRound, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function DashboardPage() {
  const stats = getStats();
  const user = await getSession();

  const chartData = [
    { name: 'Available', value: stats.availableBooks, fill: 'hsl(var(--primary))' },
    { name: 'Borrowed', value: stats.borrowedBooks, fill: 'hsl(var(--secondary))' },
    { name: 'Out Stock', value: stats.totalBooks - stats.availableBooks - stats.borrowedBooks, fill: 'hsl(var(--muted-foreground))' },
  ];

  return (
    <div className="space-y-10 animate-in-fade">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-headline font-bold">Welcome, {user?.username}</h1>
        <p className="text-muted-foreground">Here's a snapshot of the BiblioFlow inventory nexus today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard 
          label="Total Books" 
          value={stats.totalBooks} 
          icon={BookCopy} 
          trend="+12% from last month"
          colorClass="text-primary"
        />
        <StatCard 
          label="Active Users" 
          value={stats.totalUsers} 
          icon={Users} 
          colorClass="text-secondary"
        />
        <StatCard 
          label="Librarians" 
          value={stats.totalLibrarians} 
          icon={UserRound} 
          colorClass="text-blue-400"
        />
        <StatCard 
          label="Available" 
          value={stats.availableBooks} 
          icon={CheckCircle2} 
          colorClass="text-emerald-400"
        />
        <StatCard 
          label="Borrowed" 
          value={stats.borrowedBooks} 
          icon={Clock} 
          colorClass="text-amber-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Inventory Distribution
              <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Live breakdown of current book statuses in the vault.</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="glass-card flex flex-col justify-center items-center p-10 text-center gap-6">
           <div className="p-6 bg-primary/10 rounded-full border border-primary/20">
              <Database className="w-12 h-12 text-primary" />
           </div>
           <div>
             <h3 className="font-headline text-2xl font-bold">System Health</h3>
             <p className="text-sm text-muted-foreground mt-2">All nexus modules operating within normal parameters. JWT shield active.</p>
           </div>
           <div className="flex gap-2 w-full mt-4">
              <div className="h-1 flex-1 bg-emerald-500/30 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[94%]" />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">94% Stability</span>
           </div>
        </Card>
      </div>
    </div>
  );
}
