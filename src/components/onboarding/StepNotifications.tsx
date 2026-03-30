'use client';

import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotifications } from '@/hooks/useNotifications';

export function StepNotifications({ onNext }: { onNext: () => void }) {
  const { user } = useAuthStore();
  const { subscribe } = useNotifications();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  const handleEnable = async () => {
    if (!user) return;
    await subscribe(user.id);
    setPermission(Notification.permission);
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Stay in the loop
        </h2>
        <p className="text-gray-400">
          Enable notifications so we can remind you even when the app is closed.
        </p>
      </div>

      <div className="flex flex-col items-center py-6">
        <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-violet-400" />
        </div>
        <p className="text-sm text-gray-400 text-center max-w-sm">
          MemorAI will send you push notifications for reminders and daily
          briefings.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleEnable}
          className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
        >
          Allow Notifications
        </button>
        <button
          onClick={handleSkip}
          className="w-full py-3 bg-transparent text-gray-400 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
