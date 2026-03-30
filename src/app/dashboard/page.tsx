'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  ListTodo,
  Calendar,
  Archive,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useReminderStore } from '@/store/useReminderStore';
import { useListStore } from '@/store/useListStore';
import { useMemoryStore } from '@/store/useMemoryStore';
import { Button } from '@/components/shared/Button';
import { Skeleton } from '@/components/shared/Skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuthStore();
  const { reminders, fetchReminders } = useReminderStore();
  const { lists, fetchLists } = useListStore();
  const { files, fetchFiles } = useMemoryStore();
  const [quickChat, setQuickChat] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?mode=login');
      return;
    }
    if (user) {
      if (profile && !profile.onboarding_completed) {
        router.push('/onboarding');
        return;
      }
      fetchReminders(user.id);
      fetchLists(user.id);
      fetchFiles(user.id);
    }
  }, [user, profile, authLoading, router, fetchReminders, fetchLists, fetchFiles]);

  const handleQuickChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickChat.trim()) {
      router.push(`/chat?message=${encodeURIComponent(quickChat.trim())}`);
    }
  };

  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const pendingReminders = reminders.filter((r) => r.status === 'pending');
  const todayReminders = pendingReminders.filter((r) => {
    const d = new Date(r.remind_at);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          {profile?.full_name
            ? `Welcome back, ${profile.full_name.split(' ')[0]}`
            : 'Dashboard'}
        </h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Quick Chat */}
      <form onSubmit={handleQuickChat} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={quickChat}
            onChange={(e) => setQuickChat(e.target.value)}
            placeholder="Tell me something to remember..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-violet-400"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link href="/reminders">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {todayReminders.length}
                </p>
                <p className="text-xs text-gray-500">Today&apos;s Reminders</p>
              </div>
            </div>
            {todayReminders.slice(0, 2).map((r) => (
              <p key={r.id} className="text-xs text-gray-400 truncate">
                {r.title}
              </p>
            ))}
            {todayReminders.length === 0 && (
              <p className="text-xs text-gray-600">No reminders today</p>
            )}
          </div>
        </Link>

        <Link href="/lists">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{lists.length}</p>
                <p className="text-xs text-gray-500">Active Lists</p>
              </div>
            </div>
            {lists.slice(0, 2).map((l) => (
              <p key={l.id} className="text-xs text-gray-400 truncate">
                {l.icon} {l.name}
              </p>
            ))}
            {lists.length === 0 && (
              <p className="text-xs text-gray-600">No lists yet</p>
            )}
          </div>
        </Link>

        <Link href="/calendar">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">--</p>
                <p className="text-xs text-gray-500">Upcoming Events</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">Connect calendar to see</p>
          </div>
        </Link>

        <Link href="/memory">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Archive className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{files.length}</p>
                <p className="text-xs text-gray-500">Memory Vault</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              {files.length > 0
                ? `${files.length} files stored`
                : 'No files yet'}
            </p>
          </div>
        </Link>
      </div>

      {/* Upcoming Reminders Widget */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Upcoming Reminders
          </h2>
          <Link
            href="/reminders"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            View All
          </Link>
        </div>
        {pendingReminders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No reminders yet</p>
            <p className="text-sm text-gray-600">
              Try saying &quot;Remind me to call mom tomorrow at 6pm&quot; in
              chat
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingReminders.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm text-white">{r.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(r.remind_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {getRelativeTime(new Date(r.remind_at))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Lists Widget */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Active Lists</h2>
          <Link
            href="/lists"
            className="text-sm text-violet-400 hover:text-violet-300"
          >
            View All
          </Link>
        </div>
        {lists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No lists yet</p>
            <Link href="/lists">
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Create List
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lists.slice(0, 4).map((list) => (
              <Link key={list.id} href={`/lists/${list.id}`}>
                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <span className="text-xl">{list.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {list.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {list.items?.length || 0} items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 0) return 'overdue';
  if (minutes < 60) return `in ${minutes}m`;
  if (hours < 24) return `in ${hours}h`;
  return `in ${days}d`;
}
