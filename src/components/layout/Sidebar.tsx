'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Users, 
  Activity, 
  BarChart3, 
  LogOut,
  Database,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions/auth';
import { User } from '@/lib/types';

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const getNavItems = () => {
    const base = [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'Inventory', icon: BookOpen, href: '/dashboard/books' },
    ];

    if (user.role === 'ADMIN') {
      return [
        ...base,
        { label: 'Add Book', icon: PlusCircle, href: '/dashboard/books?action=add' },
        { label: 'Manage Users', icon: Users, href: '/dashboard/users' },
        { label: 'Activity Logs', icon: Activity, href: '/dashboard/activity' },
      ];
    }

    if (user.role === 'LIBRARIAN') {
      return [
        ...base,
        { label: 'Updates', icon: BarChart3, href: '/dashboard/activity' },
      ];
    }

    return [
      ...base,
      { label: 'My Reading List', icon: Bookmark, href: '/dashboard/books' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="w-72 h-screen border-r border-white/5 bg-[#0A0A0B] flex flex-col p-8 sticky top-0 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] -z-10" />
      
      <div className="flex items-center gap-3 mb-12">
        <div className="p-2.5 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-xl shadow-primary/20">
          <Database className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline text-2xl font-bold tracking-tighter text-white">BiblioFlow</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 leading-none">Enterprise Nexus</span>
        </div>
      </div>

      <nav className="flex-1 space-y-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 px-4 mb-4">Core Modules</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-white/5 text-primary" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(186,117,255,0.8)]" />}
                  <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="pt-6 border-t border-white/5 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl h-12 transition-all"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-bold text-sm">Logout</span>
        </Button>
      </div>
    </div>
  );
}
