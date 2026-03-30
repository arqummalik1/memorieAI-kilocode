'use client';

import { useState } from 'react';
import { type Reminder, useReminderStore } from '@/store/useReminderStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';

interface ReminderFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingReminder?: Reminder | null;
}

export function ReminderForm({
  isOpen,
  onClose,
  editingReminder,
}: ReminderFormProps) {
  const { user } = useAuthStore();
  const { createReminder, updateReminder } = useReminderStore();
  const [title, setTitle] = useState(editingReminder?.title || '');
  const [body, setBody] = useState(editingReminder?.body || '');
  const [date, setDate] = useState(
    editingReminder
      ? new Date(editingReminder.remind_at).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [time, setTime] = useState(
    editingReminder
      ? new Date(editingReminder.remind_at).toISOString().slice(11, 16)
      : '09:00'
  );
  const [recurrence, setRecurrence] = useState(
    editingReminder?.recurrence || 'none'
  );
  const [friendEmail, setFriendEmail] = useState(
    editingReminder?.friend_email || ''
  );
  const [showFriendToggle, setShowFriendToggle] = useState(
    !!editingReminder?.friend_email
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setSaving(true);

    const remindAt = new Date(`${date}T${time}`).toISOString();

    if (editingReminder) {
      await updateReminder(editingReminder.id, {
        title: title.trim(),
        body: body.trim() || null,
        remind_at: remindAt,
        recurrence,
        friend_email: showFriendToggle ? friendEmail : null,
      });
    } else {
      await createReminder({
        user_id: user.id,
        title: title.trim(),
        body: body.trim() || null,
        remind_at: remindAt,
        recurrence,
        recurrence_rule: null,
        status: 'pending',
        snooze_until: null,
        friend_email: showFriendToggle ? friendEmail : null,
        source: 'manual',
      });
    }

    setSaving(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setTitle('');
    setBody('');
    setRecurrence('none');
    setFriendEmail('');
    setShowFriendToggle(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title={editingReminder ? 'Edit Reminder' : 'New Reminder'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to remember?"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Optional details..."
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Recurrence
          </label>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showFriendToggle}
              onChange={(e) => setShowFriendToggle(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-violet-500 focus:ring-violet-500"
            />
            Remind a friend?
          </label>
          {showFriendToggle && (
            <input
              type="email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 mt-2"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? 'Saving...' : editingReminder ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
