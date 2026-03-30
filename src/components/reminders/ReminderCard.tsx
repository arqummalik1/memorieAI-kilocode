'use client';

import { useState } from 'react';
import { Clock, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { type Reminder, useReminderStore } from '@/store/useReminderStore';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
}

function formatReminderTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const reminderDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffDays = Math.floor(
    (reminderDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const time = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (diffDays === 0) return `Today at ${time}`;
  if (diffDays === 1) return `Tomorrow at ${time}`;
  if (diffDays === -1) return `Yesterday at ${time}`;
  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${time}`;
}

export function ReminderCard({ reminder, onEdit }: ReminderCardProps) {
  const { deleteReminder, snoozeReminder, updateReminder } = useReminderStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const recurrenceColors: Record<string, 'violet' | 'blue' | 'green' | 'yellow'> = {
    daily: 'violet',
    weekly: 'blue',
    monthly: 'green',
    custom: 'yellow',
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">
            {reminder.title}
          </h3>
          {reminder.body && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {reminder.body}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">
                {formatReminderTime(reminder.remind_at)}
              </span>
            </div>
            {reminder.recurrence !== 'none' && (
              <Badge color={recurrenceColors[reminder.recurrence] || 'gray'}>
                {reminder.recurrence}
              </Badge>
            )}
            {reminder.source !== 'manual' && (
              <Badge color="gray">from {reminder.source}</Badge>
            )}
          </div>
        </div>

        <div className="relative flex-shrink-0 ml-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
              <button
                onClick={() => {
                  onEdit(reminder);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => {
                  snoozeReminder(reminder.id, 60);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                💤 Snooze 1h
              </button>
              <button
                onClick={() => {
                  updateReminder(reminder.id, { status: 'sent' });
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                ✓ Mark Done
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteReminder(reminder.id)}
        title="Delete Reminder"
        message={`Are you sure you want to delete "${reminder.title}"?`}
        confirmText="Delete"
        danger
      />
    </div>
  );
}
