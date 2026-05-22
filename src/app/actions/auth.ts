'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUsers, setUsers, addLog } from '@/lib/store';
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

  // Log successful login
  addLog({
    userId: user.id,
    username: user.username,
    action: `Authenticated session initiated`,
    type: 'USER'
  });

  return { success: true, role: user.role };
}

export async function register(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  const users = getUsers();
  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    return { error: 'Username already exists' };
  }

  const newUser: User = {
    id: Math.random().toString(36).substring(7),
    username,
    password,
    role: 'USER', // Registration only for USER role
    readingList: [],
  };

  setUsers([...users, newUser]);

  // Log registration
  addLog({
    userId: newUser.id,
    username: newUser.username,
    action: `New researcher account provisioned`,
    type: 'USER'
  });

  // Automatically log in after registration
  const token = encodeToken(newUser);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { success: true, role: newUser.role };
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
