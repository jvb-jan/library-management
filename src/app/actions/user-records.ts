'use server';

import { getSession } from './auth';
import { updateUser as updateStoreUser, addLog } from '@/lib/store';
import { revalidatePath } from 'next/cache';

export async function updateUserRecord(id: string, data: any) {
  const session = await getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'LIBRARIAN')) {
    throw new Error('Unauthorized');
  }

  updateStoreUser(id, data);
  
  addLog({
    userId: session.id,
    username: session.username,
    action: `Updated borrower profile for USN: ${data.usn}`,
    type: 'USER'
  });

  revalidatePath('/dashboard/users');
  return { success: true };
}

// Alias for consistency with component calls
export const updateUser = updateUserRecord;
