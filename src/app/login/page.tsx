'use client';

import { useState } from 'react';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Database, Loader2, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await login(formData);
      if (result.error) {
        toast({
          title: "Authentication Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: `Logged in as ${result.role}`,
        });
        router.push('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md glass-card border-white/10 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardHeader className="space-y-2 text-center pb-2">
          <div className="mx-auto p-4 bg-primary rounded-2xl w-fit shadow-xl shadow-primary/30 mb-4">
            <Database className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-4xl font-headline font-bold tracking-tighter">BiblioFlow</CardTitle>
          <CardDescription className="text-muted-foreground/80 font-medium">
            Intelligent Inventory Nexus for Modern Libraries
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Sample Credentials</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Use <code className="text-primary font-bold">admin</code>, <code className="text-primary font-bold">librarian</code>, or <code className="text-primary font-bold">user</code> with password <code className="text-primary font-bold">password</code>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Username</label>
              <Input 
                name="username" 
                placeholder="admin, librarian, or user" 
                required 
                className="h-12 glass border-white/5 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
              <Input 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••"
                className="h-12 glass border-white/5 focus:border-primary/50 transition-colors"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 group" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-2 justify-center text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">
              <ShieldCheck className="w-3 h-3" />
              Secure JWT Protected Access
            </div>
          </CardFooter>
        </form>
      </Card>
      
      <div className="fixed bottom-8 text-center text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em] pointer-events-none">
        BiblioFlow v1.0 • Enterprise Edition
      </div>
    </div>
  );
}
