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
    // Librarians can manage the catalog but not delete users or sensitive data
    return ['READ', 'UPDATE', 'CREATE'].includes(action);
  }
  if (userRole === 'USER') {
    // Standard users can only browse the catalog
    return ['READ'].includes(action);
  }
  return false;
}
