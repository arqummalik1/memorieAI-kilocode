'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessageCircle,
  Clock,
  ListTodo,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/reminders', label: 'Remind', icon: Clock },
  { href: '/lists', label: 'Lists', icon: ListTodo },
];

export function MobileNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-violet-400' : 'text-gray-500'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-1.5 text-gray-500"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 rounded-t-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Menu</h3>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { href: '/calendar', label: 'Calendar' },
                { href: '/memory', label: 'Vault' },
                { href: '/email', label: 'Email' },
                { href: '/settings', label: 'Settings' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
