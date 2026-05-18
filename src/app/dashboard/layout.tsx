import { getSession } from '@/app/actions/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}