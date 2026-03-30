'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  User,
  Link2,
  Brain,
  Shield,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/shared/Button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

const sections = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'integrations', label: 'Integrations', icon: Link2 },
  { key: 'ai', label: 'AI Memory', icon: Brain },
  { key: 'privacy', label: 'Data & Privacy', icon: Shield },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, loading, signOut, updateProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [briefingEnabled, setBriefingEnabled] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('fullName') as string;
    updateProfile({ full_name: name });
  };

  const handleSaveNotifications = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const time = formData.get('briefingTime') as string;
    updateProfile({
      briefing_enabled: briefingEnabled,
      briefing_time: (time || '08:00') + ':00',
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar menu */}
        <div className="md:w-48 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === s.key
                    ? 'bg-violet-600/20 text-violet-300'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">Profile</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    defaultValue={profile?.full_name || ''}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <form onSubmit={handleSaveNotifications} className="space-y-4">
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setBriefingEnabled(!briefingEnabled)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        briefingEnabled ? 'bg-violet-600' : 'bg-gray-700'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          briefingEnabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                    <span className="text-gray-300">Daily briefing</span>
                  </label>
                </div>
                {briefingEnabled && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Briefing time
                    </label>
                    <input
                      name="briefingTime"
                      type="time"
                      defaultValue={profile?.briefing_time?.slice(0, 5) || '08:00'}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                )}
                <Button type="submit">Save Preferences</Button>
              </form>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">Integrations</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Google Calendar
                    </p>
                    <p className="text-xs text-gray-500">Not connected</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Gmail</p>
                    <p className="text-xs text-gray-500">Not connected</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ai' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">AI Memory</h2>
              <p className="text-sm text-gray-400">
                Your AI assistant stores memories to provide better context in
                conversations.
              </p>
              <Button variant="danger" size="sm">
                Clear All Memories
              </Button>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">
                Data & Privacy
              </h2>
              <p className="text-sm text-gray-400">
                Export or delete all your data.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm">
                  Export All Data
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {/* Sign out */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          await signOut();
          router.push('/');
        }}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Delete Account"
        danger
      />
    </div>
  );
}
