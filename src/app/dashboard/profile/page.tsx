import { getSession } from '@/app/actions/auth';
import { getUsers } from '@/lib/store';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile/ProfileForm';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const allUsers = getUsers();
  const user = allUsers.find(u => u.id === session.id);

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-headline font-bold text-white">Nexus Identity</h1>
        <p className="text-muted-foreground">Manage your secure credentials and personal telemetry.</p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
