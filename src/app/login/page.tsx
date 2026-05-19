'use client';

import { useState } from 'react';
import { login, register } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, Eye, EyeOff, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
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

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await register(formData);
      if (result.error) {
        toast({
          title: "Registration Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "You have been successfully registered and logged in.",
        });
        router.push('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0F172A]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md bg-[#1E293B] border-white/5 shadow-2xl rounded-3xl overflow-hidden p-2">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#0F172A]/50 p-1 rounded-2xl mb-8">
            <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-[#334155] data-[state=active]:text-white transition-all py-2.5">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-xl data-[state=active]:bg-[#334155] data-[state=active]:text-white transition-all py-2.5">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-headline font-bold text-white">Welcome back</h1>
              <p className="text-slate-400">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 px-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    name="username" 
                    placeholder="you@example.com" 
                    required 
                    className="h-14 bg-[#0F172A] border-white/5 pl-12 focus:border-primary/50 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-300">Password</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="••••••••"
                    className="h-14 bg-[#0F172A] border-white/5 pl-12 pr-12 focus:border-primary/50 text-white rounded-xl"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-headline font-bold text-white">Join BenakaLib</h1>
              <p className="text-slate-400">Create your global researcher account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6 px-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Username / Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    name="username" 
                    placeholder="Choose a username" 
                    required 
                    className="h-14 bg-[#0F172A] border-white/5 pl-12 focus:border-primary/50 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="Create a strong password"
                    className="h-14 bg-[#0F172A] border-white/5 pl-12 pr-12 focus:border-primary/50 text-white rounded-xl"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    suppressHydrationWarning
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-8 mb-4 px-4">
          <div className="bg-[#0F172A]/40 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-[#2563EB]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">System Note</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              New accounts are provisioned with <span className="text-white font-bold">USER</span> level access. Fixed administrative roles (admin/librarian) cannot be created via registration.
            </p>
          </div>
        </div>
      </Card>
      
      <div className="fixed bottom-8 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] pointer-events-none">
        BenakaLib Nexus • Protected Interface
      </div>
    </div>
  );
}
