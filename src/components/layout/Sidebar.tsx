'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessageCircle,
  Clock,
  ListTodo,
  Calendar,
  Archive,
  Mail,
  Settings,
  LogOut,
  Brain,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle },
  { href: '/reminders', label: 'Reminders', icon: Clock },
  { href: '/lists', label: 'Lists', icon: ListTodo },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/memory', label: 'Memory Vault', icon: Archive },
  { href: '/email', label: 'Email', icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } hidden md:flex flex-col`}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-lg font-bold text-white">MemorAI</span>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-violet-600/20 text-violet-300'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 py-2">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors ${
            pathname === '/settings'
              ? 'bg-violet-600/20 text-violet-300'
              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-sm font-medium">Settings</span>
          )}
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors w-[calc(100%-16px)]"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-sm font-medium">Log Out</span>
          )}
        </button>
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
