import { getSession } from '@/app/actions/auth';
import { getBooks, getUsers } from '@/lib/store';
import { BookManager } from '@/components/books/BookManager';
import { redirect } from 'next/navigation';

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const { action } = await searchParams;
  const books = getBooks();
  const allUsers = getUsers();
  const currentUser = allUsers.find(u => u.id === session.id) || session;

  return (
    <BookManager 
      initialBooks={books} 
      user={currentUser} 
      initialAction={action} 
    />
  );
}
