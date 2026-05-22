import { getSession } from '@/app/actions/auth';
import { getUsers, getBooks } from '@/lib/store';
import { redirect } from 'next/navigation';
import { UsersManager } from '@/components/users/UsersManager';

export default async function UsersPage() {
  const session = await getSession();
  // Restrict standalone registry management to ADMIN only
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Filter to show only researchers/students (USER role) who have been indexed with a USN
  // This effectively shows only those "uploaded" or formalized as borrowers by the Librarian
  const users = getUsers().filter(u => u.role === 'USER' && !!u.usn);
  const books = getBooks();

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-headline font-bold text-white">Borrower Registry</h1>
        <p className="text-muted-foreground">Detailed identity tracking for active researchers and students indexed in the nexus.</p>
      </div>

      <UsersManager users={users} books={books} currentUserRole={session.role} />
    </div>
  );
}
