'use client';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
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
import { Separator } from '@/components/ui/separator';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.75 8.36,4.73 12.19,4.73C14.04,4.73 15.3,5.5 15.9,6.08L17.9,4.1C16.21,2.56 14.21,2 12.19,2C6.92,2 2.73,6.58 2.73,12C2.73,17.42 6.92,22 12.19,22C17.6,22 21.7,18.2 21.7,12.34C21.7,11.73 21.55,11.33 21.35,11.1Z"
    />
  </svg>
);

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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Logged In',
        description: 'Welcome!',
      });
      router.push('/');
    } catch (error: any) {
       toast({
        title: 'Google Sign-In Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  const renderForms = (isLogin: boolean) => (
    <>
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

      <div className="relative my-2 px-6">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-xs text-muted-foreground">OR</span>
      </div>
      
      <div className="px-6 pb-6">
         <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            <GoogleIcon /> Continue with Google
          </Button>
      </div>
    </>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
       <div className="absolute top-8 flex items-center gap-2">
        <Flame className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">Dayflow Assistant</h1>
      </div>
      <Tabs defaultValue="login" className="w-[400px]">
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
    </div>
  );
}