'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function StepBriefing({ onNext }: { onNext: () => void }) {
  const { profile, updateProfile } = useAuthStore();
  const [enabled, setEnabled] = useState(profile?.briefing_enabled ?? true);
  const [time, setTime] = useState(profile?.briefing_time || '08:00:00');

  const handleContinue = async () => {
    await updateProfile({
      briefing_enabled: enabled,
      briefing_time: time,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Daily Briefing
        </h2>
        <p className="text-gray-400">
          Get a morning summary of your day.
        </p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setEnabled(!enabled)}
          className={`w-12 h-6 rounded-full relative transition-colors ${
            enabled ? 'bg-violet-600' : 'bg-gray-700'
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </div>
        <span className="text-gray-300">Enable daily briefing</span>
      </label>

      {enabled && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Briefing time
          </label>
          <input
            type="time"
            value={time.slice(0, 5)}
            onChange={(e) => setTime(e.target.value + ':00')}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500"
          />
        </div>
      )}

      <button
        onClick={handleContinue}
        className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
