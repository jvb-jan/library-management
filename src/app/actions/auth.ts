'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUsers } from '@/lib/store';
import { AUTH_COOKIE_NAME, encodeToken, decodeToken } from '@/lib/auth';
import { User } from '@/lib/types';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  const token = encodeToken(user);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { success: true, role: user.role };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect('/login');
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeToken(token);
}