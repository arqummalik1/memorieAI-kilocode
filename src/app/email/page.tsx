'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { EmailList } from '@/components/email/EmailList';

export default function EmailPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Email</h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered email management
        </p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl min-h-[400px]">
        <EmailList />
      </div>
    </div>
  );
}
