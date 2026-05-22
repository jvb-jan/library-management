'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Book } from '@/lib/types';
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
import { Sparkles, Loader2, User } from 'lucide-react';
import { generateBookDescriptionSummary } from '@/ai/flows/generate-book-description-summary-flow';
import { useToast } from '@/hooks/use-toast';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre is required'),
  description: z.string().min(10, 'Description should be longer'),
  bookIdNumber: z.string().min(1, 'Book ID Number is required'),
  availabilityStatus: z.enum(['AVAILABLE', 'BORROWED', 'OUT_OF_STOCK']),
  borrowerName: z.string().optional(),
  borrowerAge: z.coerce.number().optional(),
  borrowerBranch: z.string().optional(),
  borrowerUsn: z.string().optional(),
}).refine((data) => {
  if (data.availabilityStatus === 'BORROWED') {
    return !!data.borrowerName && !!data.borrowerUsn && !!data.borrowerBranch && !!data.borrowerAge;
  }
  return true;
}, {
  message: "All borrower details are required for borrowed status",
  path: ["borrowerName"]
});

interface BookFormProps {
  initialData?: Book;
  onSubmit: (data: z.infer<typeof bookSchema>) => Promise<void>;
  isLoading: boolean;
  formId: string;
}

export function BookForm({ initialData, onSubmit, isLoading, formId }: BookFormProps) {
  const { toast } = useToast();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      author: initialData.author,
      genre: initialData.genre,
      description: initialData.description,
      bookIdNumber: initialData.bookIdNumber,
      availabilityStatus: initialData.availabilityStatus,
      borrowerName: initialData.borrowerName || '',
      borrowerAge: initialData.borrowerAge || 20,
      borrowerBranch: initialData.borrowerBranch || '',
      borrowerUsn: initialData.borrowerUsn || '',
    } : {
      title: '',
      author: '',
      genre: '',
      description: '',
      bookIdNumber: '',
      availabilityStatus: 'AVAILABLE',
      borrowerName: '',
      borrowerAge: 20,
      borrowerBranch: '',
      borrowerUsn: '',
    },
  });

  const status = form.watch('availabilityStatus');

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
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Book Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} className="glass h-10" />
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
                <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author" {...field} className="glass h-10" />
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
                <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Genre</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Science Fiction" {...field} className="glass h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bookIdNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Book ID Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. BKN-1020" {...field} className="glass h-10" />
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
              <div className="flex justify-between items-end mb-1">
                <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Description</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-6 gap-2 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 rounded-full text-[9px]"
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
                  className="min-h-[80px] glass resize-none" 
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
              <FormLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Availability Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="glass h-10">
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

        {status === 'BORROWED' && (
          <div className="space-y-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl animate-in-fade">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Borrower Metadata</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="borrowerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] uppercase font-bold text-muted-foreground">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Student name" {...field} className="glass h-9 text-xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="borrowerUsn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] uppercase font-bold text-muted-foreground">Student USN</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1MS21CS001" {...field} className="glass h-9 text-xs font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="borrowerAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] uppercase font-bold text-muted-foreground">Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="glass h-9 text-xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="borrowerBranch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] uppercase font-bold text-muted-foreground">Branch</FormLabel>
                    <FormControl>
                      <Input placeholder="Academic branch" {...field} className="glass h-9 text-xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
