'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function StepTimezone({ onNext }: { onNext: () => void }) {
  const { profile, updateProfile } = useAuthStore();
  const [timezone, setTimezone] = useState(
    profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    try {
      setTimezones(Intl.supportedValuesOf('timeZone'));
    } catch {
      setTimezones(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata']);
    }
  }, []);

  const handleContinue = async () => {
    await updateProfile({ timezone });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Where are you based?
        </h2>
        <p className="text-gray-400">
          We use this for reminders and daily briefings.
        </p>
      </div>
      <select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500"
      >
        {timezones.map((tz) => (
          <option key={tz} value={tz}>
            {tz.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
      <button
        onClick={handleContinue}
        className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
