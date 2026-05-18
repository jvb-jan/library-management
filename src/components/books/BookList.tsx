'use client';

import { useState, useMemo } from 'react';
import { 
  Book, 
  Role, 
  AvailabilityStatus 
} from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Filter, 
  ArrowUpDown,
  BookMarked,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { hasPermission } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface BookListProps {
  books: Book[];
  userRole: Role;
  readingList: string[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onToggleToRead?: (id: string) => void;
}

export function BookList({ 
  books, 
  userRole, 
  readingList,
  onEdit, 
  onDelete,
  onToggleToRead
}: BookListProps) {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('ALL');

  const genres = useMemo(() => {
    const s = new Set(books.map(b => b.genre));
    return ['ALL', ...Array.from(s)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchesSearch = 
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.genre.toLowerCase().includes(search.toLowerCase()) ||
        b.bookIdNumber.toLowerCase().includes(search.toLowerCase());
      
      const matchesGenre = genreFilter === 'ALL' || b.genre === genreFilter;

      return matchesSearch && matchesGenre;
    });
  }, [books, search, genreFilter]);

  const getStatusBadge = (status: AvailabilityStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Available</Badge>;
      case 'BORROWED':
        return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Borrowed</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge className="bg-rose-500/20 text-rose-500 border-rose-500/30">Out of Stock</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in-fade">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title, author, genre or ID..." 
            className="pl-10 glass"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {genres.map(g => (
            <Button
              key={g}
              variant={genreFilter === g ? "default" : "outline"}
              size="sm"
              onClick={() => setGenreFilter(g)}
              className="rounded-full text-xs h-8 glass whitespace-nowrap"
            >
              {g}
            </Button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border-white/5">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead className={cn(userRole === 'USER' ? "w-[250px]" : "w-[300px]")}>Identity</TableHead>
              {userRole !== 'USER' && <TableHead>Genre</TableHead>}
              <TableHead>Book ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={userRole === 'USER' ? 4 : 5} className="h-32 text-center text-muted-foreground">
                  No books found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => {
                const isInReadingList = readingList.includes(book.id);
                return (
                  <TableRow key={book.id} className="border-b border-white/5 group hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-muted/40 rounded-md flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-300">
                          <BookMarked className="w-5 h-5 opacity-40" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-semibold text-sm line-clamp-1">{book.title}</span>
                          <span className="text-xs text-muted-foreground truncate">{book.author}</span>
                        </div>
                      </div>
                    </TableCell>
                    {userRole !== 'USER' && (
                      <TableCell>
                        <Badge variant="outline" className="font-normal text-[10px] uppercase tracking-wider">{book.genre}</Badge>
                      </TableCell>
                    )}
                    <TableCell className="font-mono text-xs font-semibold">
                      {book.bookIdNumber}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(book.availabilityStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {userRole === 'USER' && onToggleToRead && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "rounded-full h-8 w-8",
                              isInReadingList ? "text-secondary bg-secondary/10" : "text-muted-foreground hover:text-secondary hover:bg-secondary/10"
                            )}
                            onClick={() => onToggleToRead(book.id)}
                            title={isInReadingList ? "Remove from List" : "Add to Reading List"}
                          >
                            {isInReadingList ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                          </Button>
                        )}
                        {(hasPermission(userRole, 'UPDATE') || hasPermission(userRole, 'DELETE')) ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-white/10">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass">
                              {hasPermission(userRole, 'UPDATE') && (
                                <DropdownMenuItem onClick={() => onEdit(book)} className="gap-2 text-xs">
                                  <Edit className="w-3.5 h-3.5" /> Edit
                                </DropdownMenuItem>
                              )}
                              {hasPermission(userRole, 'DELETE') && (
                                <DropdownMenuItem 
                                  onClick={() => onDelete(book.id)}
                                  className="text-destructive gap-2 text-xs"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="gap-2 text-xs">
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                           <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-white/10">
                              <MoreVertical className="w-4 h-4" />
                           </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
