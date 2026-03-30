'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useReminderStore, type Reminder } from '@/store/useReminderStore';
import { ReminderList } from '@/components/reminders/ReminderList';
import { ReminderForm } from '@/components/reminders/ReminderForm';
import { Button } from '@/components/shared/Button';

export default function RemindersPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const { reminders, fetchReminders } = useReminderStore();
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=login');
      return;
    }
    if (user) fetchReminders(user.id);
  }, [user, loading, router, fetchReminders]);

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReminder(null);
  };

  if (loading || !user) return null;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reminders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {reminders.filter((r) => r.status === 'pending').length} pending
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" />
          New Reminder
        </Button>
      </div>

      <ReminderList reminders={reminders} onEdit={handleEdit} />

      <ReminderForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editingReminder={editingReminder}
      />
    </div>
  );
}
