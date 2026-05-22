'use client';

import { useState } from 'react';
import { BookList } from '@/components/books/BookList';
import { BookForm } from '@/components/books/BookForm';
import { BookDetailsDialog } from '@/components/books/BookDetailsDialog';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, BookOpenCheck, Bookmark, Library, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  createBook, 
  updateBook, 
  deleteBook 
} from '@/app/actions/books';
import { toggleReadingList } from '@/app/actions/user';
import { Book, User } from '@/lib/types';
import { hasPermission } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface BookManagerProps {
  initialBooks: Book[];
  user: User;
  initialAction?: string;
}

export function BookManager({ initialBooks, user, initialAction }: BookManagerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(initialAction === 'add');
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    setEditingBook(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this nexus entry?')) {
      try {
        await deleteBook(id);
        toast({ title: 'Record Purged', description: 'The entry has been removed from the central archive.' });
        router.refresh();
      } catch (e) {
        toast({ title: 'Purge Failed', description: 'Unauthorized or system error encountered.', variant: 'destructive' });
      }
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, data);
        toast({ title: 'Record Synchronized', description: 'Book data has been updated in the index.' });
      } else {
        await createBook(data);
        toast({ title: 'Index Entry Created', description: 'New book added to the repository.' });
      }
      setIsFormOpen(false);
      router.refresh();
    } catch (e) {
      toast({ title: 'Operation Failed', description: 'Unauthorized or validation error.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleToRead = async (bookId: string) => {
    try {
      const result = await toggleReadingList(bookId);
      toast({ 
        title: result.isInList ? 'Nexus Linked' : 'Link Severed',
        description: result.isInList ? 'Added to your reading list.' : 'Removed from your reading list.'
      });
      router.refresh();
    } catch (e) {
      toast({ title: 'Link Failed', description: 'Could not update your personal list.', variant: 'destructive' });
    }
  };

  const readingListBooks = initialBooks.filter(b => user?.readingList?.includes(b.id));

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-headline font-bold text-white">Catalog Archive</h1>
          <p className="text-muted-foreground">Manage the central repository and curate your personal collection.</p>
        </div>
        {user && hasPermission(user.role, 'CREATE') && (
          <Button onClick={handleAdd} className="rounded-xl px-6 h-12 shadow-lg shadow-primary/20 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <Plus className="w-5 h-5" />
            Add New Book
          </Button>
        )}
      </div>

      <div className={user?.role === 'USER' ? "grid grid-cols-1 lg:grid-cols-12 gap-8" : "space-y-6"}>
        <div className={user?.role === 'USER' ? "lg:col-span-8 space-y-4" : "space-y-4"}>
          <div className="flex items-center gap-2 mb-2 px-2">
            <Library className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Nexus Catalog</h2>
          </div>
          <BookList 
            books={initialBooks} 
            userRole={user?.role || 'USER'}
            readingList={user?.readingList || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={setViewingBook}
            onToggleToRead={handleToggleToRead}
          />
        </div>

        {user?.role === 'USER' && (
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-2 px-2">
              <Bookmark className="w-4 h-4 text-secondary" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-secondary">My Reading List</h2>
            </div>
            <div className="glass-card rounded-2xl p-6 min-h-[400px]">
              {readingListBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                  <div className="p-4 bg-muted/40 rounded-full">
                    <BookOpenCheck className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Your list is empty</p>
                    <p className="text-xs text-muted-foreground">Bookmark entries to track them here.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {readingListBooks.map(book => (
                    <div key={book.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer" onClick={() => setViewingBook(book)}>
                      <div className="w-10 h-14 bg-muted/40 rounded-md flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                        <Bookmark className="w-4 h-4 opacity-40 group-hover:text-secondary transition-colors" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate text-slate-100">{book.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-8 w-8 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleToRead(book.id);
                        }}
                      >
                        <Plus className="w-4 h-4 rotate-45" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[650px] text-slate-100 p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-headline text-white">
              {editingBook ? 'Refine Entry' : 'New Archive Entry'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingBook ? 'Update the metadata for this catalog object.' : 'Initialize a new entry in the BenakaLib central repository.'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6">
            <div className="pb-4">
              <BookForm 
                initialData={editingBook} 
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <BookDetailsDialog 
        book={viewingBook} 
        isOpen={viewingBook !== null} 
        onClose={() => setViewingBook(null)} 
      />
    </div>
  );
}