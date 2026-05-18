'use client';

import { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  User as UserIcon,
  ChevronDown,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/app/actions/auth';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="h-16 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="relative w-full max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Global system search..." 
          className="bg-muted/40 border-white/5 pl-10 h-10 rounded-xl focus:border-primary/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 mr-4">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Live
          </Badge>
        </div>

        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5">
          <Bell className="w-5 h-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl px-2 gap-3 hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-xs font-bold leading-none">{user.username}</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-1 uppercase tracking-widest">{user.role}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass w-56">
            <DropdownMenuLabel className="font-headline font-bold text-xs uppercase tracking-widest p-4">Nexus Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="gap-2 p-3">
              <UserIcon className="w-4 h-4" /> Profile Details
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 p-3">
              <Settings className="w-4 h-4" /> System Settings
            </DropdownMenuItem>
            {user.role === 'ADMIN' && (
              <DropdownMenuItem className="gap-2 p-3 text-secondary">
                <Shield className="w-4 h-4" /> Admin Controls
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={() => logout()} className="gap-2 p-3 text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4" /> Disconnect Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
