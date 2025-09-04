
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDayflow } from '@/hooks/use-dayflow';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Flame, LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AppUser {
    uid: string;
    name: string;
    email: string;
    createdAt: any;
}

export default function AdminPage() {
  const { user, loading } = useDayflow();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const adminEmail = "waseemgaming40@gmail.com";

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== adminEmail) {
        router.push('/login');
      } else {
        fetchUsers();
      }
    }
  }, [user, loading, router]);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => doc.data() as AppUser);
      setUsers(usersList);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: 'Could not load the list of users.',
        variant: 'destructive',
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
    })
    router.push('/login');
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
       <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">Dayflow Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground hidden sm:block">{user.email}</p>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-5 w-5" />
            </Button>
        </div>
       </header>
       <main className="flex-grow p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Registered Users
                    </CardTitle>
                    <CardDescription>
                        A list of all users who have signed up for Dayflow Assistant.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {dataLoading ? (
                        <p>Loading user data...</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Registration Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((appUser) => (
                                    <TableRow key={appUser.uid}>
                                        <TableCell className="font-medium">{appUser.name}</TableCell>
                                        <TableCell>{appUser.email}</TableCell>
                                        <TableCell>{appUser.createdAt.toDate().toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
       </main>
    </div>
  );
}
