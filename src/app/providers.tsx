'use client';

import { useEffect, type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { AppLayout } from '@/components/layout/AppLayout';

function AuthProvider({ children }: { children: ReactNode }) {
  const { initialize, loading } = useAuthStore();

  useEffect(() => {
    initialize();

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(() => {});
      });
    }
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppLayout>
        {children}
      </AppLayout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
          },
        }}
      />
    </AuthProvider>
  );
}
