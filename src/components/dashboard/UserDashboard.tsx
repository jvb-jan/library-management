'use client';

import { User, Book } from '@/lib/types';
import { BookCarousel } from '@/components/books/BookCarousel';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Library, Sparkles, TrendingUp, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface UserDashboardProps {
  user: User;
  books: Book[];
}

export function UserDashboard({ user, books }: UserDashboardProps) {
  const featuredBooks = books.slice(0, 5);
  const trendingBooks = books.slice(5, 9);
  const categories = Array.from(new Set(books.map(b => b.genre))).slice(0, 6);

  return (
    <div className="space-y-12 animate-in-fade pb-12">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Discover the collection</span>
        </div>
        <h1 className="text-5xl font-headline font-bold text-white tracking-tight">
          Welcome to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">BiblioFlow</span>, {user.username}
        </h1>
        <p className="text-muted-foreground text-xl max-w-3xl">
          Your modern digital library. Browse thousands of curated titles and build your personal collection.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <StarIcon className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Featured Selection</h2>
          </div>
        </div>
        <BookCarousel books={featuredBooks} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-2 px-2">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">Trending Now</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingBooks.map(book => (
              <Card key={book.id} className="glass-card border-white/5 group hover:bg-white/10 transition-all duration-500 overflow-hidden">
                <CardContent className="p-0 flex h-48">
                  <div className="w-1/3 bg-muted/40 flex items-center justify-center border-r border-white/5 relative overflow-hidden">
                    <Library className="w-10 h-10 text-muted-foreground opacity-20 group-hover:scale-125 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2 text-[9px] uppercase tracking-tighter">{book.genre}</Badge>
                      <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                    </div>
                    <Link href={`/dashboard/books`} className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline">
                      View Details <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-2 px-2">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500">Categories</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categories.map(cat => (
              <Link key={cat} href={`/dashboard/books`}>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group">
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white">{cat}</span>
                </div>
              </Link>
            ))}
          </div>
          
          <Card className="glass-card border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg">Reading List</CardTitle>
              <CardDescription>Items bookmarked for later.</CardDescription>
            </CardHeader>
            <CardContent>
              {user.readingList?.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No items bookmarked yet. Start exploring the catalog!</p>
              ) : (
                <p className="text-xs text-muted-foreground font-bold">{user.readingList?.length} items in your list.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );
}
