import { getSession } from '@/app/actions/auth';
import { getBooks, getUsers } from '@/lib/store';
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
import { BookOpen, User as UserIcon, ClipboardCheck, GraduationCap } from 'lucide-react';

export default async function NeededBooksPage() {
  const session = await getSession();
  if (!session || session.role !== 'LIBRARIAN') {
    redirect('/dashboard');
  }

  const books = getBooks();
  const users = getUsers().filter(u => u.role === 'USER');

  // Map books to the users who need them
  const neededBooks = books.map(book => {
    const requestingUsers = users.filter(u => u.readingList?.includes(book.id));
    return {
      ...book,
      requestingUsers
    };
  }).filter(b => b.requestingUsers.length > 0)
    .sort((a, b) => b.requestingUsers.length - a.requestingUsers.length);

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-headline font-bold text-white flex items-center gap-3">
          <ClipboardCheck className="w-10 h-10 text-amber-500" />
          Books Needed
        </h1>
        <p className="text-muted-foreground">Detailed breakdown of user reading lists and acquisition demands.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border-white/5">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead className="w-[300px]">Book Identity</TableHead>
              <TableHead>Interest Level</TableHead>
              <TableHead>Requesting Researchers</TableHead>
              <TableHead>Availability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {neededBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                  No pending user requests in the nexus.
                </TableCell>
              </TableRow>
            ) : (
              neededBooks.map((book) => (
                <TableRow key={book.id} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted/40 rounded-lg shrink-0">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate">{book.title}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{book.author}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className="text-2xl font-bold font-headline">{book.requestingUsers.length}</span>
                       <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Requests</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {book.requestingUsers.map(u => (
                        <div key={u.id} className="flex items-center gap-2 group/user">
                           <UserIcon className="w-3 h-3 text-secondary shrink-0" />
                           <div className="flex flex-col">
                              <span className="text-xs font-medium text-slate-200">{u.fullName || u.username}</span>
                              <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase">
                                 <GraduationCap className="w-2.5 h-2.5" /> {u.branch || 'General'} • {u.usn}
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      book.availabilityStatus === 'AVAILABLE' 
                        ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" 
                        : "bg-amber-500/20 text-amber-500 border-amber-500/30"
                    }>
                      {book.availabilityStatus}
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
