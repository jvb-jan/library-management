'use client';

import { Book } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User, Tag, Hash, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface BookDetailsDialogProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetailsDialog({ book, isOpen, onClose }: BookDetailsDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!book || !mounted) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Available</Badge>;
      case 'BORROWED':
        return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Borrowed</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge className="bg-rose-500/20 text-rose-500 border-rose-500/30">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass border-white/10 sm:max-w-[600px] text-slate-100 p-0 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-24 h-24 text-primary opacity-20" />
          </div>
          <div className="absolute bottom-6 left-8">
            {getStatusBadge(book.availabilityStatus)}
          </div>
        </div>

        <div className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline font-bold text-white mb-2">
              {book.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              by <span className="text-slate-200 font-semibold">{book.author}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Tag className="w-3 h-3" /> Genre
              </span>
              <p className="font-semibold text-slate-200">{book.genre}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Hash className="w-3 h-3" /> Accession ID
              </span>
              <p className="font-mono text-xs font-bold text-primary">{book.bookIdNumber}</p>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">About this work</span>
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl leading-relaxed text-slate-300 text-sm">
              {book.description}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              <Calendar className="w-3 h-3" />
              Indexed on: {new Date(book.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
