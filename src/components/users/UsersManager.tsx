'use client';

import { useState } from 'react';
import { User, Role } from '@/lib/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, User as UserIcon, GraduationCap, IdCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { UserForm } from './UserForm';
import { updateUser as updateUserAction } from '@/app/actions/user-records';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface UsersManagerProps {
  users: User[];
  currentUserRole: Role;
}

export function UsersManager({ users, currentUserRole }: UsersManagerProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (!editingUser) return;
    setIsLoading(true);
    try {
      await updateUserAction(editingUser.id, data);
      toast({ title: 'Profile Synchronized', description: 'Borrower details updated in the registry.' });
      setIsFormOpen(false);
      router.refresh();
    } catch (e) {
      toast({ title: 'Update Failed', description: 'System error encountered.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead>Identity</TableHead>
              <TableHead>Academic Info</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                    <div className="flex flex-col">
                      <span className="font-semibold">{u.fullName || u.username}</span>
                      <span className="text-[10px] text-muted-foreground font-mono uppercase">{u.usn || 'No USN Linked'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <GraduationCap className="w-3 h-3 text-secondary" />
                      {u.branch || 'Undesignated Branch'}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <IdCard className="w-3 h-3" />
                      Age: {u.age || 'N/A'}
                    </div>
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
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl hover:bg-white/5"
                    onClick={() => handleEdit(u)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[500px] text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-white">Manage Borrower Details</DialogTitle>
            <DialogDescription className="text-slate-400">Update academic and personal identity fields for this user record.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <UserForm 
              initialData={editingUser || undefined} 
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
