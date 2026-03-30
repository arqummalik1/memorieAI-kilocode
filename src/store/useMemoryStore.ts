'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface Memory {
  id: string;
  user_id: string;
  content: string;
  type: string;
  embedding: number[] | null;
  source: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface FileItem {
  id: string;
  user_id: string;
  filename: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  tags: string[];
  ai_summary: string | null;
  embedding: number[] | null;
  created_at: string;
}

interface MemoryState {
  memories: Memory[];
  files: FileItem[];
  loading: boolean;
  fetchMemories: (userId: string) => Promise<void>;
  saveMemory: (memory: Omit<Memory, 'id' | 'created_at'>) => Promise<void>;
  fetchFiles: (userId: string) => Promise<void>;
  uploadFile: (userId: string, file: File) => Promise<FileItem | null>;
  deleteFile: (id: string, storagePath: string) => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memories: [],
  files: [],
  loading: false,

  fetchMemories: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);
    set({ memories: data || [], loading: false });
  },

  saveMemory: async (memory) => {
    await supabase.from('memories').insert(memory);
  },

  fetchFiles: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    set({ files: data || [], loading: false });
  },

  uploadFile: async (userId, file) => {
    const ext = file.name.split('.').pop() || 'bin';
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(path, file);
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const fileRecord = {
      user_id: userId,
      filename: file.name,
      storage_path: path,
      mime_type: file.type,
      size_bytes: file.size,
      tags: [] as string[],
      ai_summary: null as string | null,
    };

    const { data, error } = await supabase
      .from('files')
      .insert(fileRecord)
      .select()
      .single();

    if (error) {
      console.error('Error saving file record:', error);
      return null;
    }

    const { files } = get();
    set({ files: [data, ...files] });
    return data;
  },

  deleteFile: async (id, storagePath) => {
    await supabase.storage.from('files').remove([storagePath]);
    await supabase.from('files').delete().eq('id', id);
    const { files } = get();
    set({ files: files.filter((f) => f.id !== id) });
  },
}));
