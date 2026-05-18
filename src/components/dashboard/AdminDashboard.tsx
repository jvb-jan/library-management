'use client';

import { User, DashboardStats, ActivityLog } from '@/lib/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { 
  BookCopy, 
  Users, 
  UserRound, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  History
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InventoryChartWrapper } from '@/components/dashboard/InventoryChartWrapper';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
  user: User;
  stats: DashboardStats;
  logs: ActivityLog[];
}

export function AdminDashboard({ user, stats, logs }: AdminDashboardProps) {
  const chartData = [
    { name: 'Available', value: stats.availableBooks, fill: 'hsl(var(--primary))' },
    { name: 'Borrowed', value: stats.borrowedBooks, fill: 'hsl(var(--secondary))' },
    { name: 'Out Stock', value: stats.totalBooks - stats.availableBooks - stats.borrowedBooks, fill: 'hsl(var(--muted-foreground))' },
  ];

  return (
    <div className="space-y-10 animate-in-fade">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">System Pulse</span>
        </div>
        <h1 className="text-5xl font-headline font-bold tracking-tight">
          Nexus Command, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{user?.username}</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Integrate, manage, and monitor your enterprise library repository with real-time analytics.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Total Books" value={stats.totalBooks} icon={BookCopy} trend="+4.2%" colorClass="text-primary" />
        <StatCard label="Active Users" value={stats.totalUsers} icon={Users} colorClass="text-secondary" />
        <StatCard label="Librarians" value={stats.totalLibrarians} icon={UserRound} colorClass="text-purple-400" />
        <StatCard label="Available" value={stats.availableBooks} icon={CheckCircle2} colorClass="text-emerald-400" />
        <StatCard label="Borrowed" value={stats.borrowedBooks} icon={Clock} colorClass="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="glass-card lg:col-span-8 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                Inventory Nexus
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>Visual distribution of book availability across all clusters.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">Live Data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <InventoryChartWrapper data={chartData} />
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-4 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              Activity Telemetry
              <History className="w-4 h-4 text-secondary" />
            </CardTitle>
            <CardDescription>Recent actions recorded within the system nexus.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {logs.slice(0, 8).map((log) => (
              <div key={log.id} className="flex gap-4 group">
                <div className="mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    log.type === 'BOOK' ? "bg-primary" : log.type === 'USER' ? "bg-secondary" : "bg-emerald-500"
                  )} />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-200">{log.action}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">User: {log.username}</span>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="h-40 flex items-center justify-center text-muted-foreground text-sm italic">
                No telemetry recorded in this cycle.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
