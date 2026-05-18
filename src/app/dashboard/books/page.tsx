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
import { Plus, Library } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  createBook, 
  updateBook, 
  deleteBook 
} from '@/app/actions/books';
import { getBooks } from '@/lib/store';
import { Book, Role } from '@/lib/types';
import { getSession } from '@/app/actions/auth';
import { hasPermission } from '@/lib/auth';

export default function BooksPage() {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [userRole, setUserRole] = useState<Role>('USER');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Use useEffect to fetch client-side for dynamic reactivity in this demo environment
  useEffect(() => {
    async function loadData() {
      const session = await getSession();
      if (session) setUserRole(session.role);
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

  return (
    <div className="space-y-8 animate-in-fade">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-headline font-bold">Inventory Nexus</h1>
          <p className="text-muted-foreground">Manage and track your global book distribution catalog.</p>
        </div>
        {hasPermission(userRole, 'CREATE') && (
          <Button onClick={handleAdd} className="rounded-xl px-6 h-12 shadow-lg shadow-primary/20 gap-2">
            <Plus className="w-5 h-5" />
            Add New Book
          </Button>
        )}
      </div>

      <BookList 
        books={books} 
        userRole={userRole}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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