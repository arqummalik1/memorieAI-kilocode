import Link from 'next/link';
import { Brain, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-xl bg-violet-600/20 flex items-center justify-center mx-auto mb-6">
          <Brain className="w-8 h-8 text-violet-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-gray-400 mb-6">
          This page doesn&apos;t exist in your memory.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
