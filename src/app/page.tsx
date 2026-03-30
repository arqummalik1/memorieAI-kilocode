'use client';

import Link from 'next/link';
import { Brain, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/shared/Button';

const features = [
  {
    icon: '⏰',
    title: 'Unlimited Reminders',
    desc: 'Set reminders by chatting naturally. Never forget anything again.',
  },
  {
    icon: '📝',
    title: 'Smart Lists',
    desc: 'Create, manage, and share lists. Drag to reorder, check to complete.',
  },
  {
    icon: '📅',
    title: 'Multi-Calendar Sync',
    desc: 'Connect Google Calendar. See events and create new ones from chat.',
  },
  {
    icon: '🗄️',
    title: 'Memory Trunk',
    desc: 'Upload files, photos, and notes. AI-powered semantic search finds anything.',
  },
  {
    icon: '🤝',
    title: 'Friend Reminders',
    desc: 'Remind others via email. Perfect for follow-ups and coordination.',
  },
  {
    icon: '🧠',
    title: 'Long-Term Memory',
    desc: 'AI remembers everything you share. Vector search recalls relevant context.',
  },
  {
    icon: '☀️',
    title: 'Daily Briefing',
    desc: 'Get a morning summary of your day: events, reminders, and tasks.',
  },
  {
    icon: '📸',
    title: 'Image Intelligence',
    desc: 'Upload photos of whiteboards, menus, receipts. AI extracts actionable items.',
  },
  {
    icon: '📊',
    title: 'Control Dashboard',
    desc: 'See everything at a glance: reminders, lists, events, and vault status.',
  },
  {
    icon: '📧',
    title: 'Email Integration',
    desc: 'AI classifies your inbox. Draft replies with a single prompt.',
  },
  {
    icon: '🎤',
    title: 'Voice Input',
    desc: 'Speak your reminders and notes. Whisper-powered transcription.',
  },
  {
    icon: '🔔',
    title: 'Push Notifications',
    desc: 'Get reminded even when the browser is closed. PWA notifications.',
  },
];

const painPoints = [
  "You say \"I'll do it later\" and it's gone forever",
  'A list in every app, none complete',
  'You forget simple errands you never wrote down',
  'Photos buried in camera roll, never seen again',
  'Infinite scrolling to find something you already had',
  'Important stuff spread across chats, emails, notes',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">MemorAI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth?mode=login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button size="sm">Try for Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Personal Memory Assistant
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            The memory layer{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
              above all your apps
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Set reminders, manage lists, sync calendars, and capture ideas — all
            through one AI chat interface.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth?mode=signup">
              <Button size="lg">
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Chat preview mockup */}
          <div className="mt-16 max-w-2xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-violet-600 rounded-2xl rounded-br-md px-4 py-2 max-w-xs">
                  <p className="text-sm">
                    Remind me to call mom tomorrow at 6pm
                  </p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
                  <p className="text-sm text-gray-300">
                    Done! I&apos;ve set a reminder for tomorrow at 6:00 PM —
                    &quot;Call mom&quot;. I&apos;ll make sure you don&apos;t
                    forget. 😊
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Sound familiar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {painPoints.map((point, i) => (
              <div
                key={i}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-red-500/30 transition-colors"
              >
                <p className="text-gray-300">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything in one place
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            MemorAI combines reminders, lists, calendar, files, email, and
            memory into a single AI-powered chat interface.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-violet-500/30 transition-colors"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Type or speak naturally',
                desc: 'Just chat like you would with a friend. No commands to memorize.',
              },
              {
                step: '2',
                title: 'AI understands your intent',
                desc: 'Our AI parses your message and figures out what you need.',
              },
              {
                step: '3',
                title: 'Done — everything is organized',
                desc: 'Reminders set, lists created, calendar updated. All from one chat.',
              },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '$0',
                features: [
                  '50 reminders/month',
                  '5 smart lists',
                  '100MB vault',
                  'Basic AI chat',
                  'Voice input',
                  'Push notifications',
                ],
                cta: 'Start Free',
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '$0',
                period: 'Free forever',
                features: [
                  'Unlimited reminders',
                  'Unlimited lists',
                  '1GB vault',
                  'Full AI chat + memory',
                  'Calendar sync',
                  'Gmail integration',
                  'Daily briefings',
                  'Image intelligence',
                ],
                cta: 'Start Free',
                highlighted: true,
              },
              {
                name: 'Team',
                price: '$0',
                period: 'Coming soon',
                features: [
                  'Everything in Pro',
                  'Shared lists',
                  'Team reminders',
                  'Admin dashboard',
                  'Priority support',
                ],
                cta: 'Join Waitlist',
                highlighted: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl p-6 border ${
                  plan.highlighted
                    ? 'bg-violet-600/10 border-violet-500/50'
                    : 'bg-gray-800/50 border-gray-700'
                }`}
              >
                <h3 className="text-lg font-semibold text-white mb-1">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-white mb-1">
                  {plan.price}
                </div>
                {plan.period && (
                  <p className="text-sm text-gray-500 mb-4">{plan.period}</p>
                )}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth?mode=signup">
                  <Button
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-sm text-gray-400">
              MemorAI &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
