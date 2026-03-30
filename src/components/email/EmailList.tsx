'use client';

import { useState } from 'react';
import { Mail, Clock } from 'lucide-react';

interface EmailListProps {
  onSelect?: (id: string) => void;
}

export function EmailList({ onSelect }: EmailListProps) {
  return (
    <div className="text-center py-12 text-gray-500">
      <Mail className="w-12 h-12 mx-auto mb-3 text-gray-600" />
      <p className="text-lg font-medium text-gray-400 mb-2">
        Connect Gmail to see emails
      </p>
      <p className="text-sm text-gray-500 mb-4">
        AI will classify and summarize your emails
      </p>
      <button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
        Connect Gmail
      </button>
    </div>
  );
}
