import { getSession } from '@/app/actions/auth';
import { getUsers, getBooks } from '@/lib/store';
import { redirect } from 'next/navigation';
import { UsersManager } from '@/components/users/UsersManager';

export default async function UsersPage() {
  const session = await getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'LIBRARIAN')) {
    redirect('/dashboard');
  }

  const users = getUsers();
  const books = getBooks();

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-headline font-bold text-white">Borrower Registry</h1>
        <p className="text-muted-foreground">Manage identities, academic branches, and monitor active borrowing status.</p>
      </div>

      <UsersManager users={users} books={books} currentUserRole={session.role} />
    </div>
  );
}
