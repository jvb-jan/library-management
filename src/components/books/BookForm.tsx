'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Book, AvailabilityStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateBookDescriptionSummary } from '@/ai/flows/generate-book-description-summary-flow';
import { useToast } from '@/hooks/use-toast';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre is required'),
  description: z.string().min(10, 'Description should be longer'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  availabilityStatus: z.enum(['AVAILABLE', 'BORROWED', 'OUT_OF_STOCK']),
});

interface BookFormProps {
  initialData?: Book;
  onSubmit: (data: z.infer<typeof bookSchema>) => Promise<void>;
  isLoading: boolean;
}

export function BookForm({ initialData, onSubmit, isLoading }: BookFormProps) {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      author: initialData.author,
      genre: initialData.genre,
      description: initialData.description,
      price: initialData.price,
      availabilityStatus: initialData.availabilityStatus,
    } : {
      title: '',
      author: '',
      genre: '',
      description: '',
      price: 0,
      availabilityStatus: 'AVAILABLE',
    },
  });

  const handleAiCurate = async () => {
    const title = form.getValues('title');
    const author = form.getValues('author');
    const genre = form.getValues('genre');

    if (!title || !author || !genre) {
      toast({
        title: "Incomplete details",
        description: "Please fill in title, author, and genre first.",
        variant: "destructive",
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await generateBookDescriptionSummary({ title, author, genre });
      form.setValue('description', result.description);
      toast({
        title: "AI Curated!",
        description: "Engaging description generated successfully.",
      });
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Failed to generate AI content.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} className="glass" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author" {...field} className="glass" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Science Fiction" {...field} className="glass" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} className="glass" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-end">
                <FormLabel>Description</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-2 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                  onClick={handleAiCurate}
                  disabled={isAiLoading}
                >
                  {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI Curator
                </Button>
              </div>
              <FormControl>
                <Textarea 
                  placeholder="Professional book summary..." 
                  className="min-h-[120px] glass" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availabilityStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="glass">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="glass">
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="BORROWED">Borrowed</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-lg shadow-lg shadow-primary/20" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Book' : 'Add Book'}
        </Button>
      </form>
    </Form>
  );
}