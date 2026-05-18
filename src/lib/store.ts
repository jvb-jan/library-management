import { Book, User, DashboardStats } from './types';

// Mock initial data
const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    genre: 'Mystery',
    description: 'A boy is taken by his father to the Cemetery of Forgotten Books...',
    price: 24.99,
    availabilityStatus: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    description: 'A desert planet where water is more precious than spice...',
    price: 19.99,
    availabilityStatus: 'BORROWED',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    description: 'A lone astronaut must save the Earth and humanity...',
    price: 29.99,
    availabilityStatus: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin', role: 'ADMIN', password: 'password' },
  { id: 'u2', username: 'librarian', role: 'LIBRARIAN', password: 'password' },
  { id: 'u3', username: 'user', role: 'USER', password: 'password' },
];

// In a real environment, this would be a database.
// Since we are in a serverless/scaffold environment, we use a global singleton for demo.
declare global {
  var __db_books: Book[] | undefined;
  var __db_users: User[] | undefined;
}

export const getBooks = () => {
  if (!global.__db_books) global.__db_books = [...INITIAL_BOOKS];
  return global.__db_books;
};

export const getUsers = () => {
  if (!global.__db_users) global.__db_users = [...INITIAL_USERS];
  return global.__db_users;
};

export const setBooks = (books: Book[]) => {
  global.__db_books = books;
};

export const getStats = (): DashboardStats => {
  const books = getBooks();
  const users = getUsers();
  return {
    totalBooks: books.length,
    totalUsers: users.length,
    totalLibrarians: users.filter(u => u.role === 'LIBRARIAN').length,
    availableBooks: books.filter(b => b.availabilityStatus === 'AVAILABLE').length,
    borrowedBooks: books.filter(b => b.availabilityStatus === 'BORROWED').length,
  };
};