'use client';

import * as React from 'react';
import { Book } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Library, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookCarouselProps {
  books: Book[];
}

export function BookCarousel({ books }: BookCarouselProps) {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {books.map((book) => (
          <CarouselItem key={book.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="glass-card border-white/5 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="h-64 bg-muted/40 flex items-center justify-center relative overflow-hidden">
                    <Library className="w-16 h-16 text-muted-foreground opacity-20 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                       <Badge className="bg-primary/80 hover:bg-primary border-none text-[10px] uppercase tracking-widest mb-2">Featured</Badge>
                       <h3 className="text-xl font-bold text-white line-clamp-1">{book.title}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                       <span className="text-xs font-bold uppercase tracking-widest text-secondary">{book.genre}</span>
                       <Button size="sm" variant="ghost" className="h-8 gap-2 glass rounded-full px-4 text-xs">
                         <Info className="w-3 h-3" /> Details
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:flex justify-end gap-2 mt-4 pr-4">
        <CarouselPrevious className="static translate-y-0 h-10 w-10 border-white/5 bg-white/5 hover:bg-white/10" />
        <CarouselNext className="static translate-y-0 h-10 w-10 border-white/5 bg-white/5 hover:bg-white/10" />
      </div>
    </Carousel>
  );
}
