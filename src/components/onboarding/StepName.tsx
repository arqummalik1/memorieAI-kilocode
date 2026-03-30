'use client';

import { useAuthStore } from '@/store/useAuthStore';

export function StepName({ onNext }: { onNext: () => void }) {
  const { profile, updateProfile } = useAuthStore();
  const name = profile?.full_name || '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    if (fullName.trim()) {
      await updateProfile({ full_name: fullName.trim() });
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to MemorAI!
        </h2>
        <p className="text-gray-400">What should we call you?</p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          type="text"
          defaultValue={name}
          placeholder="Your name"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 mb-4"
          required
          autoFocus
        />
        <button
          type="submit"
          className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
