'use server';

import { getBooks, setBooks, getUsers, setUsers, addLog } from '@/lib/store';
import { Book, User } from '@/lib/types';
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
  
  // If status is BORROWED, ensure we update the user registry
  if (newBook.availabilityStatus === 'BORROWED' && newBook.borrowerUsn) {
    await syncBorrowerRecord(newBook);
  }

  addLog({
    userId: user.id,
    username: user.username,
    action: `Added new book: ${newBook.title}`,
    type: 'BOOK'
  });
  
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/books');
  revalidatePath('/dashboard/users');
  return newBook;
}

export async function updateBook(id: string, data: Partial<Book>) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, 'UPDATE')) {
    throw new Error('Unauthorized');
  }

  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Book not found');

  const oldBook = books[index];
  const updatedBook = { ...oldBook, ...data };
  
  // Logic for BORROWED synchronization
  if (updatedBook.availabilityStatus === 'BORROWED' && updatedBook.borrowerUsn) {
    await syncBorrowerRecord(updatedBook);
  }

  // If status was BORROWED and changed to AVAILABLE, remove book from borrower's list
  if (oldBook.availabilityStatus === 'BORROWED' && updatedBook.availabilityStatus !== 'BORROWED') {
    const users = getUsers();
    const borrowerIndex = users.findIndex(u => u.usn === oldBook.borrowerUsn);
    if (borrowerIndex !== -1) {
      users[borrowerIndex].readingList = users[borrowerIndex].readingList?.filter(bid => bid !== id);
      setUsers([...users]);
    }
    // Clear borrower info on the book if explicitly moving to available/out_of_stock
    if (updatedBook.availabilityStatus === 'AVAILABLE' || updatedBook.availabilityStatus === 'OUT_OF_STOCK') {
      updatedBook.borrowerName = undefined;
      updatedBook.borrowerAge = undefined;
      updatedBook.borrowerBranch = undefined;
      updatedBook.borrowerUsn = undefined;
    }
  }

  books[index] = updatedBook;
  setBooks([...books]);
  
  addLog({
    userId: session.id,
    username: session.username,
    action: `Updated book: ${updatedBook.title} (${updatedBook.availabilityStatus})`,
    type: 'BOOK'
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/books');
  revalidatePath('/dashboard/users');
  return updatedBook;
}

/**
 * Synchronizes borrower metadata with the central User Registry.
 */
async function syncBorrowerRecord(book: Book) {
  if (!book.borrowerUsn) return;

  const users = getUsers();
  const existingUserIndex = users.findIndex(u => u.usn === book.borrowerUsn);
  
  if (existingUserIndex !== -1) {
    const borrower = users[existingUserIndex];
    const readingList = borrower.readingList || [];
    if (!readingList.includes(book.id)) {
      readingList.push(book.id);
    }
    users[existingUserIndex] = {
      ...borrower,
      fullName: book.borrowerName || borrower.fullName,
      age: book.borrowerAge || borrower.age,
      branch: book.borrowerBranch || borrower.branch,
      readingList
    };
  } else {
    // Create new student entry if USN not found
    const newBorrower: User = {
      id: Math.random().toString(36).substring(7),
      username: book.borrowerUsn.toLowerCase(),
      role: 'USER',
      fullName: book.borrowerName,
      age: book.borrowerAge,
      branch: book.borrowerBranch,
      usn: book.borrowerUsn,
      readingList: [book.id]
    };
    users.push(newBorrower);
  }
  setUsers([...users]);
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
