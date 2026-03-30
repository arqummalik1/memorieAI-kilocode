'use client';

import { useCallback } from 'react';
import { subscribeToPush, requestNotificationPermission } from '@/lib/webPush';
import { supabase } from '@/lib/supabaseClient';

export function useNotifications() {
  const subscribe = useCallback(async (userId: string) => {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') return null;

    const subscription = await subscribeToPush();
    if (!subscription) return null;

    await supabase
      .from('profiles')
      .update({ push_subscription: subscription.toJSON() })
      .eq('user_id', userId);

    return subscription;
  }, []);

  return { subscribe };
}
