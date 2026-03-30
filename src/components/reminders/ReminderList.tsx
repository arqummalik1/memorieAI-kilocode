'use client';

import { useState } from 'react';
import { type Reminder } from '@/store/useReminderStore';
import { ReminderCard } from './ReminderCard';

interface ReminderListProps {
  reminders: Reminder[];
  onEdit: (reminder: Reminder) => void;
}

export function ReminderList({ reminders, onEdit }: ReminderListProps) {
  const [filter, setFilter] = useState<string>('all');

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'recurring', label: 'Recurring' },
    { key: 'completed', label: 'Completed' },
  ];

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const filtered = reminders.filter((r) => {
    const remindAt = new Date(r.remind_at);
    switch (filter) {
      case 'today':
        return remindAt >= todayStart && remindAt < todayEnd;
      case 'upcoming':
        return remindAt > now && r.status === 'pending';
      case 'recurring':
        return r.recurrence !== 'none';
      case 'completed':
        return r.status === 'sent';
      default:
        return r.status !== 'dismissed';
    }
  });

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              filter === f.key
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">⏰</p>
          <p>No reminders found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
