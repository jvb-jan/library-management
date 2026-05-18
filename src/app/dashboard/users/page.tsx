import { getSession } from '@/app/actions/auth';
import { getUsers } from '@/lib/store';
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
import { ShieldCheck, User as UserIcon } from 'lucide-react';

export default async function UsersPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = getUsers();

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-headline font-bold">Access Control Shield</h1>
        <p className="text-muted-foreground">Manage organizational roles and nexus permissions.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead>Account Identity</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>System Identifier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="border-b border-white/5 group hover:bg-white/5">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/40 rounded-lg">
                      <UserIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold">{u.username}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "font-bold text-[10px] uppercase tracking-wider",
                    u.role === 'ADMIN' ? "bg-primary/20 text-primary border-primary/30" : 
                    u.role === 'LIBRARIAN' ? "bg-secondary/20 text-secondary border-secondary/30" : 
                    "bg-muted/50 text-muted-foreground"
                  )}>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {u.id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';