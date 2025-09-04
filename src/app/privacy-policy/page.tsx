
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Privacy Policy for Dayflow Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This Privacy Policy describes how your personal information is collected, used, and
            shared when you use Dayflow Assistant.
          </p>
          <h2 className="font-semibold">Information We Collect</h2>
          <p>
            When you use the app, we collect the following information that you provide: your email address for authentication, and the daily data you log, including work hours, tasks, expenses, and prayers. This information is stored securely in Firebase Firestore under your unique user ID.
          </p>
          <h2 className="font-semibold">How We Use Your Information</h2>
          <p>
            We use the information we collect to provide and improve the app's features, including generating personalized AI summaries and tracking your goals. We do not share your personal data with third parties.
          </p>
          <h2 className="font-semibold">Data Security</h2>
          <p>
            Your data is stored in your personal Firestore document, secured by Firebase Authentication rules. Only you can access your data.
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
