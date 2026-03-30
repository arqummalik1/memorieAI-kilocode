'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface ListItem {
  id: string;
  list_id: string;
  text: string;
  done: boolean;
  position: number;
  created_at: string;
}

export interface SmartList {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  items?: ListItem[];
}

interface ListState {
  lists: SmartList[];
  loading: boolean;
  fetchLists: (userId: string) => Promise<void>;
  createList: (list: Omit<SmartList, 'id' | 'created_at'>) => Promise<SmartList | null>;
  deleteList: (id: string) => Promise<void>;
  addItem: (listId: string, text: string) => Promise<ListItem | null>;
  updateItem: (itemId: string, updates: Partial<ListItem>) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  reorderItems: (listId: string, items: ListItem[]) => Promise<void>;
  getListWithItems: (listId: string) => Promise<SmartList | null>;
}

export const useListStore = create<ListState>((set, get) => ({
  lists: [],
  loading: false,

  fetchLists: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('lists')
      .select('*, list_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    set({ lists: (data as SmartList[]) || [], loading: false });
  },

  createList: async (list) => {
    const { data, error } = await supabase
      .from('lists')
      .insert(list)
      .select()
      .single();
    if (error) {
      console.error('Error creating list:', error);
      return null;
    }
    const { lists } = get();
    set({ lists: [{ ...data, items: [] }, ...lists] });
    return data;
  },

  deleteList: async (id) => {
    await supabase.from('lists').delete().eq('id', id);
    const { lists } = get();
    set({ lists: lists.filter((l) => l.id !== id) });
  },

  addItem: async (listId, text) => {
    const { lists } = get();
    const list = lists.find((l) => l.id === listId);
    const position = list?.items?.length || 0;
    const { data, error } = await supabase
      .from('list_items')
      .insert({ list_id: listId, text, position })
      .select()
      .single();
    if (error) {
      console.error('Error adding item:', error);
      return null;
    }
    set({
      lists: lists.map((l) =>
        l.id === listId ? { ...l, items: [...(l.items || []), data] } : l
      ),
    });
    return data;
  },

  updateItem: async (itemId, updates) => {
    await supabase.from('list_items').update(updates).eq('id', itemId);
    const { lists } = get();
    set({
      lists: lists.map((l) => ({
        ...l,
        items: l.items?.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
      })),
    });
  },

  deleteItem: async (itemId) => {
    await supabase.from('list_items').delete().eq('id', itemId);
    const { lists } = get();
    set({
      lists: lists.map((l) => ({
        ...l,
        items: l.items?.filter((i) => i.id !== itemId),
      })),
    });
  },

  reorderItems: async (listId, items) => {
    await Promise.all(
      items.map((item, i) =>
        supabase.from('list_items').update({ position: i }).eq('id', item.id)
      )
    );
    const { lists } = get();
    set({
      lists: lists.map((l) => (l.id === listId ? { ...l, items } : l)),
    });
  },

  getListWithItems: async (listId) => {
    const { data } = await supabase
      .from('lists')
      .select('*, list_items(*)')
      .eq('id', listId)
      .single();
    return (data as SmartList) || null;
  },
}));
