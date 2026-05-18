'use server';

import { getSession } from './auth';
import { getUsers, updateUser } from '@/lib/store';
import { revalidatePath } from 'next/cache';

export async function toggleReadingList(bookId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const users = getUsers();
  const user = users.find(u => u.id === session.id);
  if (!user) throw new Error('User not found');

  const currentList = user.readingList || [];
  const isInList = currentList.includes(bookId);
  
  const newList = isInList 
    ? currentList.filter(id => id !== bookId)
    : [...currentList, bookId];

  updateUser(user.id, { readingList: newList });
  revalidatePath('/dashboard/books');
  return { success: true, isInList: !isInList };
}
