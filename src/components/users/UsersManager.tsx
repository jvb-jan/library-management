'use client';

import { useState } from 'react';
import { User, Role, Book } from '@/lib/types';
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
import { Edit, User as UserIcon, GraduationCap, IdCard, BookOpen, Bookmark } from 'lucide-react';
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
  books: Book[];
  currentUserRole: Role;
}

export function UsersManager({ users, books, currentUserRole }: UsersManagerProps) {
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

  // Helper to find book title by ID
  const getBookTitle = (id: string) => {
    const book = books.find(b => b.id === id);
    return book ? book.title : 'Unknown Work';
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl overflow-hidden border-white/5">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead>Identity</TableHead>
              <TableHead>Academic Info</TableHead>
              <TableHead>Active Borrowing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/40 rounded-lg shrink-0">
                      <UserIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold truncate">{u.fullName || u.username}</span>
                      <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{u.usn || 'No USN Linked'}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <GraduationCap className="w-3 h-3 text-secondary shrink-0" />
                      <span className="truncate">{u.branch || 'Undesignated Branch'}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <IdCard className="w-3 h-3 shrink-0" />
                      Age: {u.age || 'N/A'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    {u.readingList && u.readingList.length > 0 ? (
                      u.readingList.map((bookId) => (
                        <div key={bookId} className="flex items-center gap-2 group/item">
                          <div className="w-1 h-1 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors" />
                          <span className="text-[11px] font-medium text-slate-400 group-hover/item:text-slate-200 transition-colors">
                            {getBookTitle(bookId)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">No active works</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl hover:bg-white/5 transition-all"
                    onClick={() => handleEdit(u)}
                    title="Edit Borrower Profile"
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
            <DialogDescription className="text-slate-400">Update academic and personal identity fields for this borrower record.</DialogDescription>
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
