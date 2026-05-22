'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, Save, User as UserIcon, Shield, GraduationCap, Phone } from 'lucide-react';
import { updateProfile } from '@/app/actions/profile';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  age: z.coerce.number().min(16, 'Minimum age is 16').max(100),
  branch: z.string().optional(),
  usn: z.string().optional(),
  phoneNumber: z.string().optional(),
});

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName || '',
      age: user.age || 20,
      branch: user.branch || '',
      usn: user.usn || '',
      phoneNumber: user.phoneNumber || '',
    },
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
      toast({
        title: 'Profile Updated',
        description: 'Your account metadata has been successfully synchronized.',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'System encountered an error during synchronization.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStaff = user.role === 'ADMIN' || user.role === 'LIBRARIAN';

  return (
    <Card className="glass-card border-white/5 max-w-2xl mx-auto overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-transparent relative">
         <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 rounded-2xl bg-background border-4 border-white/5 flex items-center justify-center shadow-xl">
               <UserIcon className="w-10 h-10 text-primary" />
            </div>
         </div>
      </div>
      
      <CardHeader className="pt-14 px-8 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold font-headline">{user.username}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Shield className="w-3 h-3 text-secondary" />
              <span className="uppercase tracking-widest text-[10px] font-bold text-secondary">{user.role} Account</span>
            </CardDescription>
          </div>
          <div className="text-right">
             <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Nexus ID</span>
             <p className="font-mono text-xs text-primary font-bold">{user.id}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Arjun Mehta" {...field} className="glass h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="glass h-12 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {user.role === 'USER' ? (
                <>
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
                          <GraduationCap className="w-3 h-3" /> Academic Branch
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Computer Science" {...field} className="glass h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="usn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground">USN (Student ID)</FormLabel>
                        <FormControl>
                          <Input placeholder="1MS21CS001" {...field} className="glass h-12 rounded-xl font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Contact Number
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98450 12345" {...field} className="glass h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 gap-2 font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Synchronize Account Details
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
