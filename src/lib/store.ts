import { Book, User, DashboardStats } from './types';

// Mock initial data with 10 books
const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    genre: 'Mystery',
    description: 'A boy is taken by his father to the Cemetery of Forgotten Books in post-war Barcelona.',
    price: 24.99,
    availabilityStatus: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    description: 'A desert planet where water is more precious than spice, and a messiah is born.',
    price: 19.99,
    availabilityStatus: 'BORROWED',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    description: 'A lone astronaut must save the Earth and humanity from an extinction-level threat.',
    price: 29.99,
    availabilityStatus: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Foundation',
    author: 'Isaac Asimov',
    genre: 'Science Fiction',
    description: 'The story of a band of exiles who must preserve humanity during the fall of a galactic empire.',
    price: 15.50,
    availabilityStatus: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    description: 'A chilling prophecy about a futuristic society where individual thought is a crime.',
    price: 12.99,
    availabilityStatus: 'OUT_OF_STOCK',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    description: 'A terrifying vision of a controlled and soulless society of the future.',
    price: 14.25,
    availabilityStatus: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'The adventure of Bilbo Baggins as he journeys to reclaim the lost Dwarf Kingdom.',
    price: 21.00,
    availabilityStatus: 'BORROWED',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Neuromancer',
    author: 'William Gibson',
    genre: 'Cyberpunk',
    description: 'A washed-up computer hacker is hired by a mysterious employer to pull off the ultimate hack.',
    price: 18.99,
    availabilityStatus: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    description: 'The classic story of teenage rebellion and angst in post-WWII New York.',
    price: 11.50,
    availabilityStatus: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    description: 'A powerful story of racial injustice and the loss of innocence in the American South.',
    price: 16.99,
    availabilityStatus: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin', role: 'ADMIN', password: 'password' },
  { id: 'u2', username: 'librarian', role: 'LIBRARIAN', password: 'password' },
  { id: 'u3', username: 'user', role: 'USER', password: 'password' },
];

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

export const setUsers = (users: User[]) => {
  global.__db_users = users;
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
