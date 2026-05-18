import { Book, User, DashboardStats, ActivityLog } from './types';

const INITIAL_BOOKS: Book[] = [
  { id: '1', title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón', genre: 'Mystery', description: 'A boy is taken by his father to the Cemetery of Forgotten Books in post-war Barcelona.', bookIdNumber: 'BKN-1001', availabilityStatus: 'AVAILABLE', createdAt: new Date().toISOString() },
  { id: '2', title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', description: 'A desert planet where water is more precious than spice, and a messiah is born.', bookIdNumber: 'BKN-1002', availabilityStatus: 'BORROWED', createdAt: new Date().toISOString() },
  { id: '3', title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Science Fiction', description: 'A lone astronaut must save the Earth and humanity from an extinction-level threat.', bookIdNumber: 'BKN-1003', availabilityStatus: 'AVAILABLE', createdAt: new Date().toISOString() },
  { id: '4', title: 'Foundation', author: 'Isaac Asimov', genre: 'Science Fiction', description: 'The story of a band of exiles who must preserve humanity during the fall of a galactic empire.', bookIdNumber: 'BKN-1004', availabilityStatus: 'AVAILABLE', createdAt: new Date().toISOString() },
  { id: '5', title: '1984', author: 'George Orwell', genre: 'Dystopian', description: 'A chilling prophecy about a futuristic society where individual thought is a crime.', bookIdNumber: 'BKN-1005', availabilityStatus: 'OUT_OF_STOCK', createdAt: new Date().toISOString() },
  { id: '6', title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian', description: 'A terrifying vision of a controlled and soulless society of the future.', bookIdNumber: 'BKN-1006', availabilityStatus: 'AVAILABLE', createdAt: new Date().toISOString() },
  { id: '7', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', description: 'The adventure of Bilbo Baggins as he journeys to reclaim the lost Dwarf Kingdom.', bookIdNumber: 'BKN-1007', availabilityStatus: 'BORROWED', createdAt: new Date().toISOString() },
  { id: '8', title: 'Neuromancer', author: 'William Gibson', genre: 'Cyberpunk', description: 'A washed-up computer hacker is hired by a mysterious employer to pull off the ultimate hack.', bookIdNumber: 'BKN-1008', availabilityStatus: 'AVAILABLE', createdAt: new Date().toISOString() },
  { id: '9', title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', description: 'The classic story of teenage rebellion and angst in post-WWII New York.', bookIdNumber: 'BKN-1009', availabilityStatus: 'AVAILABLE', createdAt: new Date().toISOString() },
  { id: '10', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', description: 'A powerful story of racial injustice and the loss of innocence in the American South.', bookIdNumber: 'BKN-1010', availabilityStatus: 'AVAILABLE', createdAt: new Date().toISOString() },
];

const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin', role: 'ADMIN', password: 'password', readingList: [] },
  { id: 'u2', username: 'librarian', role: 'LIBRARIAN', password: 'password', readingList: [] },
  { id: 'u3', username: 'user', role: 'USER', password: 'password', readingList: [] },
];

const INITIAL_LOGS: ActivityLog[] = [
  { id: 'l1', userId: 'u1', username: 'admin', action: 'System nexus initialized', type: 'SYSTEM', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'l2', userId: 'u2', username: 'librarian', action: 'Updated status of Dune', type: 'BOOK', timestamp: new Date(Date.now() - 1800000).toISOString() },
];

declare global {
  var __db_books: Book[] | undefined;
  var __db_users: User[] | undefined;
  var __db_logs: ActivityLog[] | undefined;
}

export const getBooks = () => {
  if (!global.__db_books) global.__db_books = [...INITIAL_BOOKS];
  return global.__db_books;
};

export const getUsers = () => {
  if (!global.__db_users) global.__db_users = [...INITIAL_USERS];
  return global.__db_users;
};

export const getLogs = () => {
  if (!global.__db_logs) global.__db_logs = [...INITIAL_LOGS];
  return global.__db_logs;
};

export const setBooks = (books: Book[]) => {
  global.__db_books = books;
};

export const setUsers = (users: User[]) => {
  global.__db_users = users;
};

export const addLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
  const logs = getLogs();
  const newLog: ActivityLog = {
    ...log,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
  };
  global.__db_logs = [newLog, ...logs].slice(0, 50);
};

export const updateUser = (id: string, data: Partial<User>) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...data };
    setUsers(users);
  }
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
