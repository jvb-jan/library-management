import { Role, User } from './types';

export const AUTH_COOKIE_NAME = 'biblioflow_auth_token';

// Simple base64-based "JWT" for demo purposes in this environment
export function encodeToken(user: User): string {
  const payload = JSON.stringify({ id: user.id, username: user.username, role: user.role });
  return btoa(payload);
}

export function decodeToken(token: string): User | null {
  try {
    const payload = atob(token);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function hasPermission(userRole: Role, action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'): boolean {
  if (userRole === 'ADMIN') return true;
  if (userRole === 'LIBRARIAN') {
    return ['READ', 'UPDATE', 'CREATE'].includes(action); // Librarians can also create now
  }
  if (userRole === 'USER') {
    return ['READ', 'CREATE'].includes(action); // Standard users can READ and CREATE entries
  }
  return false;
}
