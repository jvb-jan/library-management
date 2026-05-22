'use client';

import { useEffect, useState } from 'react';
import { User, DashboardStats, ActivityLog, Book } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  ClipboardList, 
  RefreshCcw, 
  CheckCircle,
  ArrowRight,
  ClipboardCheck,
  Bookmark
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LibrarianDashboardProps {
  user: User;
  stats: DashboardStats;
  logs: ActivityLog[];
  books: Book[];
  users: User[];
}

export function LibrarianDashboard({ user, stats, books, users }: LibrarianDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Aggregate "Books Needed" - count occurrences in users' reading lists
  const neededBooksData = books.map(book => {
    const interestedUsers = users.filter(u => u.role === 'USER' && u.readingList?.includes(book.id));
    return {
      ...book,
      interestCount: interestedUsers.length
    };
  }).filter(b => b.interestCount > 0)
    .sort((a, b) => b.interestCount - a.interestCount);

  return (
    <div className="space-y-8 animate-in-fade">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-secondary" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">Operational Workspace</span>
        </div>
        <h1 className="text-4xl font-headline font-bold text-white">
          Librarian Console, {user.username}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Quickly manage availability status and curate the central repository.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-white/5 bg-secondary/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Available Now</p>
                <h3 className="text-4xl font-bold font-headline">{stats.availableBooks}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[70%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">In Circulation</p>
                <h3 className="text-4xl font-bold font-headline">{stats.borrowedBooks}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <RefreshCcw className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[30%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Books Requested</p>
                <h3 className="text-4xl font-bold font-headline">{neededBooksData.length}</h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                <Bookmark className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-amber-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[50%]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="glass-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-500" />
                Books Needed
              </CardTitle>
              <CardDescription>Items bookmarked by users in their reading lists.</CardDescription>
            </div>
            <Link href="/dashboard/needed">
              <Button variant="outline" size="sm" className="glass gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {neededBooksData.slice(0, 6).map(book => (
                <div key={book.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted/40 rounded-lg shrink-0">
                      <BookOpen className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{book.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Requested by {book.interestCount} {book.interestCount === 1 ? 'user' : 'users'}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[10px] shrink-0">High Demand</Badge>
                </div>
              ))}
              {neededBooksData.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground italic text-sm">
                  No active user requests found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
