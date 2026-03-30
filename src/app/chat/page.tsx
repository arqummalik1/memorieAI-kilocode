'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function ChatPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return <ChatWindow />;
}
