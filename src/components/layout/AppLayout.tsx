'use client';

import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuthStore();
  const { sidebarCollapsed } = useSettingsStore();

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        } pb-20 md:pb-0`}
      >
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
