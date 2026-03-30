'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SemanticSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SemanticSearchBar({
  onSearch,
  placeholder = 'Search your memories...',
}: SemanticSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
