
'use client';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Flame } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Account Created',
        description: "You've been successfully signed up and logged in.",
      });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Sign Up Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Logged In',
        description: 'Welcome back!',
      });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Login Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForms = (isLogin: boolean) => (
    <form onSubmit={isLogin ? handleLogin : handleSignUp}>
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
        <CardDescription>
          {isLogin ? 'Enter your credentials to access your dashboard.' : 'Create an account to start tracking your day.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${isLogin ? 'login' : 'signup'}-email`}>Email</Label>
          <Input
            id={`${isLogin ? 'login' : 'signup'}-email`}
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${isLogin ? 'login' : 'signup'}-password`}>Password</Label>
          <Input 
            id={`${isLogin ? 'login' : 'signup'}-password`}
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" disabled={loading}>
          {loading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? 'Login' : 'Sign Up')}
        </Button>
      </CardFooter>
    </form>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
       <div className="absolute top-8 flex items-center gap-2">
        <Flame className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Dayflow Assistant</h1>
      </div>
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            {renderForms(true)}
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            {renderForms(false)}
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        By continuing, you agree to our{' '}
        <Link href="/terms-of-service" className="underline hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy-policy" className="underline hover:text-primary">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
