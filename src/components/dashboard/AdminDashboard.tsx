'use client';

import { useEffect, useState } from 'react';
import { User, DashboardStats } from '@/lib/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { 
  BookCopy, 
  Users, 
  UserRound, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { InventoryChartWrapper } from '@/components/dashboard/InventoryChartWrapper';
import { Badge } from '@/components/ui/badge';

interface AdminDashboardProps {
  user: User;
  stats: DashboardStats;
}

export function AdminDashboard({ user, stats }: AdminDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = [
    { name: 'Available', value: stats.availableBooks, fill: 'hsl(var(--primary))' },
    { name: 'Borrowed', value: stats.borrowedBooks, fill: 'hsl(var(--secondary))' },
    { name: 'Out Stock', value: stats.totalBooks - stats.availableBooks - stats.borrowedBooks, fill: 'hsl(var(--muted-foreground))' },
  ];

  if (!mounted) return null;

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

      <div className="grid grid-cols-1 gap-8">
        <Card className="glass-card border-white/5">
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
      </div>
    </div>
  );
}
