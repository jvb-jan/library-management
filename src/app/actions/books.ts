'use server';

import { getBooks, setBooks, addLog } from '@/lib/store';
import { Book, AvailabilityStatus } from '@/lib/types';
import { getSession } from './auth';
import { hasPermission } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createBook(data: Omit<Book, 'id' | 'createdAt'>) {
  const user = await getSession();
  if (!user || !hasPermission(user.role, 'CREATE')) {
    throw new Error('Unauthorized');
  }

  const books = getBooks();
  const newBook: Book = {
    ...data,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
  };

  setBooks([newBook, ...books]);
  addLog({
    userId: user.id,
    username: user.username,
    action: `Added new book: ${newBook.title}`,
    type: 'BOOK'
  });
  
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/books');
  return newBook;
}

export async function updateBook(id: string, data: Partial<Book>) {
  const user = await getSession();
  if (!user || !hasPermission(user.role, 'UPDATE')) {
    throw new Error('Unauthorized');
  }

  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Book not found');

  const oldTitle = books[index].title;
  const updatedBook = { ...books[index], ...data };
  books[index] = updatedBook;
  setBooks([...books]);
  
  addLog({
    userId: user.id,
    username: user.username,
    action: `Updated book record: ${oldTitle}`,
    type: 'BOOK'
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/books');
  return updatedBook;
}

export async function deleteBook(id: string) {
  const user = await getSession();
  if (!user || !hasPermission(user.role, 'DELETE')) {
    throw new Error('Unauthorized');
  }

  const books = getBooks();
  const bookToDelete = books.find(b => b.id === id);
  const filtered = books.filter(b => b.id !== id);
  setBooks(filtered);

  if (bookToDelete) {
    addLog({
      userId: user.id,
      username: user.username,
      action: `Deleted book: ${bookToDelete.title}`,
      type: 'BOOK'
    });
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/books');
}
