'use client';

import { useEffect, useState } from 'react';
import { User, DashboardStats, ActivityLog } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  ClipboardList, 
  RefreshCcw, 
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LibrarianDashboardProps {
  user: User;
  stats: DashboardStats;
  logs: ActivityLog[];
}

export function LibrarianDashboard({ user, stats, logs }: LibrarianDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8 animate-in-fade">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-secondary" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Operational Workspace</span>
        </div>
        <h1 className="text-4xl font-headline font-bold text-white">
          Librarian Console, {user.username}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Quickly manage availability status and curate the central repository.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-white/5 bg-secondary/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Available Now</p>
                <h3 className="text-4xl font-bold font-headline">{stats.availableBooks}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[70%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">In Circulation</p>
                <h3 className="text-4xl font-bold font-headline">{stats.borrowedBooks}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <RefreshCcw className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[30%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Requires Restock</p>
                <h3 className="text-4xl font-bold font-headline">{stats.totalBooks - stats.availableBooks - stats.borrowedBooks}</h3>
              </div>
              <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-rose-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 w-[10%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass-card lg:col-span-2 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Inventory Status</CardTitle>
              <CardDescription>Review and update the availability of catalog items.</CardDescription>
            </div>
            <Link href="/dashboard/books">
              <Button variant="outline" className="glass gap-2">
                Manage All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.filter(l => l.type === 'BOOK').slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted/40 rounded-lg">
                      <BookOpen className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{log.action}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {mounted ? new Date(log.timestamp).toLocaleDateString() : '...'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest">Update</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 h-fit">
          <CardHeader>
            <CardTitle className="text-xl">Quick Insights</CardTitle>
            <CardDescription>Operational telemetry overview.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-200">System Latency: Low</p>
                <p className="text-[10px] text-muted-foreground">Optimal sync with central archive.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-200">Catalog Health: Excellent</p>
                <p className="text-[10px] text-muted-foreground">No metadata corruption detected.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-200">Role: Librarian</p>
                <p className="text-[10px] text-muted-foreground">Update permissions authorized.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
