'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useListStore } from '@/store/useListStore';
import { DraggableList } from '@/components/lists/DraggableList';

export default function ListDetailPage() {
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
    <div className="p-4 md:p-6">
      <DraggableList />
    </div>
  );
}
