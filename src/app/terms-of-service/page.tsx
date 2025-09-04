
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Terms of Service for Dayflow Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            By using the Dayflow Assistant application ("Service"), you are agreeing to be bound by the following terms and conditions ("Terms of Service").
          </p>
          <h2 className="font-semibold">1. Use of Service</h2>
          <p>
            You agree to use the Service at your own risk. The Service is provided on an "as is" and "as available" basis. The primary purpose of this app is to act as a personal digital assistant.
          </p>
          <h2 className="font-semibold">2. Data</h2>
          <p>
            You are responsible for the data you enter into the application. While we use Firebase for secure data storage, we are not responsible for any loss of data. We recommend using the data export feature regularly.
          </p>
           <h2 className="font-semibold">3. Modification of Service</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
          </p>
          <p>
            <Link href="/login" className="text-primary hover:underline">
              &larr; Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
