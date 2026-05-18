import { getSession } from '@/app/actions/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
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
    <div className="flex bg-[#070708] min-h-screen text-slate-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar user={user} />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
