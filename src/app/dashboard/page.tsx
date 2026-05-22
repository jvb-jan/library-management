import { getStats, getLogs, getBooks, getUsers } from '@/lib/store';
import { getSession } from '@/app/actions/auth';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { LibrarianDashboard } from '@/components/dashboard/LibrarianDashboard';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }

  const stats = getStats();
  const logs = getLogs();
  const books = getBooks();
  const users = getUsers();

  if (user.role === 'ADMIN') {
    return <AdminDashboard user={user} stats={stats} />;
  }

  if (user.role === 'LIBRARIAN') {
    return <LibrarianDashboard user={user} stats={stats} logs={logs} books={books} users={users} />;
  }

  return <UserDashboard user={user} books={books} />;
}
