'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  remind_at: string;
  recurrence: string;
  recurrence_rule: string | null;
  status: string;
  snooze_until: string | null;
  friend_email: string | null;
  source: string;
  created_at: string;
}

interface ReminderState {
  reminders: Reminder[];
  loading: boolean;
  fetchReminders: (userId: string) => Promise<void>;
  createReminder: (reminder: Omit<Reminder, 'id' | 'created_at'>) => Promise<Reminder | null>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  snoozeReminder: (id: string, minutes: number) => Promise<void>;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  loading: false,

  fetchReminders: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'dismissed')
      .order('remind_at', { ascending: true });
    set({ reminders: data || [], loading: false });
  },

  createReminder: async (reminder) => {
    const { data, error } = await supabase
      .from('reminders')
      .insert(reminder)
      .select()
      .single();
    if (error) {
      console.error('Error creating reminder:', error);
      return null;
    }
    const { reminders } = get();
    set({ reminders: [...reminders, data] });
    return data;
  },

  updateReminder: async (id, updates) => {
    await supabase.from('reminders').update(updates).eq('id', id);
    const { reminders } = get();
    set({
      reminders: reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    });
  },

  deleteReminder: async (id) => {
    await supabase.from('reminders').update({ status: 'dismissed' }).eq('id', id);
    const { reminders } = get();
    set({ reminders: reminders.filter((r) => r.id !== id) });
  },

  snoozeReminder: async (id, minutes) => {
    const snoozeUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    await supabase
      .from('reminders')
      .update({ status: 'snoozed', snooze_until: snoozeUntil })
      .eq('id', id);
    const { reminders } = get();
    set({
      reminders: reminders.map((r) =>
        r.id === id ? { ...r, status: 'snoozed', snooze_until: snoozeUntil } : r
      ),
    });
  },
}));
