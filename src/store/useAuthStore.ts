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
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        set({ session, user: session.user });
        await get().refreshProfile();
      }
    } catch (err) {
      console.error('[Auth] Failed to get session:', err);
    } finally {
      set({ loading: false });
    }

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
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: data.user.id,
          full_name: fullName,
        });
        if (profileError) {
          console.error('[Auth] Profile creation failed:', profileError.message);
        }
      }
      return { error: null };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to connect to authentication service. Please check your internet connection.';
      return { error: message };
    }
  },

  signIn: async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to connect to authentication service. Please check your internet connection.';
      return { error: message };
    }
  },

  signInWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.modify',
          redirectTo: typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : undefined,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Google sign in failed. Please check your connection and try again.';
      return { error: message };
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[Auth] Sign out failed:', err);
    } finally {
      set({ user: null, session: null, profile: null });
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('user_id', user.id);
      if (error) return { error: error.message };
      await get().refreshProfile();
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      return { error: message };
    }
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error) {
        console.error('[Auth] Failed to refresh profile:', error.message);
        return;
      }
      if (data) set({ profile: data });
    } catch (err) {
      console.error('[Auth] Failed to refresh profile:', err);
    }
  },
}));
