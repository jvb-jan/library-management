'use client';

import { useState, useEffect } from 'react';
import { BookList } from '@/components/books/BookList';
import { BookForm } from '@/components/books/BookForm';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, BookOpenCheck, Bookmark, Library } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  createBook, 
  updateBook, 
  deleteBook 
} from '@/app/actions/books';
import { toggleReadingList } from '@/app/actions/user';
import { getBooks, getUsers } from '@/lib/store';
import { Book, Role, User } from '@/lib/types';
import { getSession } from '@/app/actions/auth';
import { hasPermission } from '@/lib/auth';

export default function BooksPage() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const session = await getSession();
      if (session) {
        // Fetch full user data to get reading list
        const users = getUsers();
        const fullUser = users.find(u => u.id === session.id);
        if (fullUser) setUser(fullUser);
      }
      setBooks(getBooks());
    }
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingBook(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        setBooks(getBooks());
        toast({ title: 'Book deleted successfully' });
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to delete book', variant: 'destructive' });
      }
    }
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingBook) {
        await updateBook(editingBook.id, data);
        toast({ title: 'Book updated successfully' });
      } else {
        await createBook(data);
        toast({ title: 'Book created successfully' });
      }
      setBooks(getBooks());
      setIsDialogOpen(false);
    } catch (e) {
      toast({ title: 'Error', description: 'Action failed', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleToRead = async (bookId: string) => {
    try {
      const result = await toggleReadingList(bookId);
      const users = getUsers();
      const updatedUser = users.find(u => u.id === user?.id);
      if (updatedUser) setUser({...updatedUser});
      
      toast({ 
        title: result.isInList ? 'Added to Reading List' : 'Removed from Reading List',
        description: 'Your personal inventory has been updated.'
      });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to update reading list', variant: 'destructive' });
    }
  };

  const readingListBooks = books.filter(b => user?.readingList?.includes(b.id));

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-headline font-bold">Catalog Archive</h1>
          <p className="text-muted-foreground">Browse the central repository and manage your personal reading list.</p>
        </div>
        {hasPermission(user?.role || 'USER', 'CREATE') && (
          <Button onClick={handleAdd} className="rounded-xl px-6 h-12 shadow-lg shadow-primary/20 gap-2">
            <Plus className="w-5 h-5" />
            Add New Book
          </Button>
        )}
      </div>

      <div className={user?.role === 'USER' ? "grid grid-cols-1 lg:grid-cols-12 gap-8" : "space-y-6"}>
        <div className={user?.role === 'USER' ? "lg:col-span-8 space-y-4" : "space-y-4"}>
          <div className="flex items-center gap-2 mb-2 px-2">
            <Library className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Global Catalog</h2>
          </div>
          <BookList 
            books={books} 
            userRole={user?.role || 'USER'}
            readingList={user?.readingList || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
                    <p className="text-xs text-muted-foreground">Bookmark books from the catalog to track them here.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {readingListBooks.map(book => (
                    <div key={book.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="w-10 h-14 bg-muted/40 rounded-md flex items-center justify-center text-muted-foreground shrink-0">
                        <Bookmark className="w-4 h-4 opacity-40 group-hover:text-secondary transition-colors" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate">{book.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full h-8 w-8 hover:text-destructive"
                        onClick={() => handleToggleToRead(book.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">
              {editingBook ? 'Refine Book Data' : 'New Catalog Entry'}
            </DialogTitle>
            <DialogDescription>
              {editingBook ? 'Modify the properties of this existing nexus entry.' : 'Initialize a new entry in the BiblioFlow central repository.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <BookForm 
              initialData={editingBook} 
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
