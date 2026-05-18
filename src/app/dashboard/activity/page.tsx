import { getSession } from '@/app/actions/auth';
import { getLogs } from '@/lib/store';
import { redirect } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, User as UserIcon, Book } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function ActivityPage() {
  const session = await getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'LIBRARIAN')) {
    redirect('/dashboard');
  }

  const logs = getLogs();

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-headline font-bold">Activity Telemetry</h1>
        <p className="text-muted-foreground">Comprehensive system audit and event logs.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border-white/5">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action Event</TableHead>
              <TableHead>Module</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                  No system events recorded.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="border-b border-white/5 group hover:bg-white/5">
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {log.username[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-sm">{log.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-slate-200">
                    {log.action}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-bold text-[9px] uppercase tracking-wider",
                      log.type === 'BOOK' ? "bg-primary/20 text-primary border-primary/30" : 
                      log.type === 'USER' ? "bg-secondary/20 text-secondary border-secondary/30" : 
                      "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                    )}>
                      {log.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
