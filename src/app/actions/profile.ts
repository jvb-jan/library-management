'use server';

import { getSession } from './auth';
import { updateUser as updateStore, addLog } from '@/lib/store';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: any) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  updateStore(session.id, data);
  
  addLog({
    userId: session.id,
    username: session.username,
    action: `Updated personal profile settings`,
    type: 'USER'
  });

  revalidatePath('/dashboard/profile');
  return { success: true };
}
