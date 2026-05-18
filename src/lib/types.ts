export type Role = 'ADMIN' | 'LIBRARIAN' | 'USER';

export type AvailabilityStatus = 'AVAILABLE' | 'BORROWED' | 'OUT_OF_STOCK';

export interface User {
  id: string;
  username: string;
  role: Role;
  password?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  price: number;
  availabilityStatus: AvailabilityStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalLibrarians: number;
  availableBooks: number;
  borrowedBooks: number;
}