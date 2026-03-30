'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments: unknown[];
  intent: string | null;
  created_at: string;
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  fetchMessages: (userId: string) => Promise<void>;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'created_at'>) => Promise<ChatMessage | null>;
  subscribeToMessages: (userId: string) => () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,

  fetchMessages: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(50);
    set({ messages: data || [], loading: false });
  },

  addMessage: async (msg) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(msg)
      .select()
      .single();
    if (error) {
      console.error('Error adding message:', error);
      return null;
    }
    return data;
  },

  subscribeToMessages: (userId) => {
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          const { messages } = get();
          if (!messages.find((m) => m.id === newMsg.id)) {
            set({ messages: [...messages, newMsg] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
