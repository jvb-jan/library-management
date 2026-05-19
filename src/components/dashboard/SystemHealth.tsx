'use client';

import { useEffect, useState } from 'react';
import { Database, Activity, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function SystemHealth() {
  const [uptime, setUptime] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<string | null>(null);

  useEffect(() => {
    // Only set these on the client to avoid hydration mismatch
    setUptime('99.9%');
    setLastCheck(new Date().toLocaleDateString());
  }, []);

  return (
    <Card className="glass-card flex flex-col justify-center items-center p-10 text-center gap-6">
       <div className="p-6 bg-primary/10 rounded-full border border-primary/20 relative group">
          <Database className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-500" />
          <Activity className="w-5 h-5 text-emerald-500 absolute bottom-4 right-4 animate-pulse bg-background rounded-full p-1 border shadow-sm" />
       </div>
       
       <div className="space-y-1">
         <h3 className="font-headline text-2xl font-bold">System Health</h3>
         <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Shield Protocol Active</span>
         </div>
         <p className="text-sm text-muted-foreground max-w-[200px] mx-auto pt-2">
           All nexus modules operating within normal parameters.
         </p>
       </div>

       <div className="w-full space-y-4 mt-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
               <span>Stability</span>
               <span className="text-emerald-500">94%</span>
            </div>
            <div className="h-1.5 w-full bg-emerald-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[94%] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
               <span>Network Uptime</span>
               <span className="text-primary">{uptime || '--%'}</span>
            </div>
            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[99.9%] shadow-[0_0_8px_rgba(186,117,255,0.5)]" />
            </div>
          </div>
       </div>

       {lastCheck && (
         <div className="pt-2 text-[9px] text-muted-foreground/50 font-mono uppercase">
           Last check: {lastCheck}
         </div>
       )}
    </Card>
  );
}
