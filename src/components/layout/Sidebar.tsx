'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Library, 
  ShieldCheck, 
  Moon, 
  Sun,
  Database
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

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Inventory', icon: BookOpen, href: '/dashboard/books' },
  ];

  if (user.role === 'ADMIN') {
    navItems.push({ label: 'Users', icon: ShieldCheck, href: '/dashboard/users' });
  }

  return (
    <div className="w-64 h-screen sidebar-glass flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/30">
          <Database className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="font-headline text-2xl font-bold tracking-tighter">BiblioFlow</span>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}>
                <item.icon className={cn("w-5 h-5", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 px-4 py-4 mb-4 bg-muted/40 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">{user.username}</span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{user.role}</span>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}