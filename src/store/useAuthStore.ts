'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
  briefing_time: string;
  briefing_enabled: boolean;
  onboarding_completed: boolean;
  push_subscription: unknown;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      set({ session, user: session.user });
      await get().refreshProfile();
    }
    set({ loading: false });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user || null });
      if (session?.user) {
        await get().refreshProfile();
      } else {
        set({ profile: null });
      }
    });
  },

  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        full_name: fullName,
      });
    }
    return { error: null };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  },

  signInWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.modify',
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
      },
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;
    await supabase.from('profiles').update(updates).eq('user_id', user.id);
    await get().refreshProfile();
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (data) set({ profile: data });
  },
}));
