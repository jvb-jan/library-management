import { getSession } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Shield, Bell, Monitor } from 'lucide-react';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-headline font-bold">Nexus Configuration</h1>
        <p className="text-muted-foreground">Manage your account preferences and system parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Monitor className="w-5 h-5 text-primary" />
              Interface Preferences
            </CardTitle>
            <CardDescription>Customize your dashboard experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Glassmorphism Effects</Label>
                <p className="text-xs text-muted-foreground">Toggle translucent background filters.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Animations</Label>
                <p className="text-xs text-muted-foreground">Toggle system-wide motion effects.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="w-5 h-5 text-secondary" />
              Security Protocol
            </CardTitle>
            <CardDescription>Manage your access and authentication.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Account Role</Label>
              <Input value={session.role} disabled className="glass font-mono uppercase tracking-widest text-xs" />
            </div>
            <div className="space-y-2">
              <Label>Session ID</Label>
              <Input value={session.id} disabled className="glass font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="w-5 h-5 text-amber-500" />
              Notifications
            </CardTitle>
            <CardDescription>Stay updated on catalog changes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Inventory Updates</Label>
                <p className="text-xs text-muted-foreground">Receive alerts when new books are indexed.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Alerts</Label>
                <p className="text-xs text-muted-foreground">Critical security and maintenance notifications.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" className="glass">Reset Defaults</Button>
        <Button className="px-8 shadow-lg shadow-primary/20">Apply Changes</Button>
      </div>
    </div>
  );
}
