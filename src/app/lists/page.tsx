'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useListStore } from '@/store/useListStore';
import { ListManager } from '@/components/lists/ListManager';

export default function ListsPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const { fetchLists } = useListStore();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=login');
      return;
    }
    if (user) fetchLists(user.id);
  }, [user, loading, router, fetchLists]);

  if (loading || !user) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <ListManager />
    </div>
  );
}
