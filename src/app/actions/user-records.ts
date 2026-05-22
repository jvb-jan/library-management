'use server';

import { getSession } from './auth';
import { updateUser as updateStore, addLog } from '@/lib/store';
import { revalidatePath } from 'next/cache';

/**
 * Updates a borrower's record. This is accessible to both Admins and Librarians.
 * Renamed internal import to 'updateStore' to avoid naming collision with the exported action.
 */
export async function updateUser(id: string, data: any) {
  const session = await getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'LIBRARIAN')) {
    throw new Error('Unauthorized');
  }

  updateStore(id, data);
  
  addLog({
    userId: session.id,
    username: session.username,
    action: `Updated borrower profile for USN: ${data.usn || 'N/A'}`,
    type: 'USER'
  });

  revalidatePath('/dashboard/users');
  return { success: true };
}
