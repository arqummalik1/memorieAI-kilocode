'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useMemoryStore } from '@/store/useMemoryStore';
import { SemanticSearchBar } from '@/components/memory/SemanticSearchBar';
import { FileUploader } from '@/components/memory/FileUploader';
import { FileCard } from '@/components/memory/FileCard';
import { EmptyState } from '@/components/shared/EmptyState';

export default function MemoryPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const { files, fetchFiles } = useMemoryStore();
  const [filter, setFilter] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<string[] | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=login');
      return;
    }
    if (user) fetchFiles(user.id);
  }, [user, loading, router, fetchFiles]);

  const handleSearch = (query: string) => {
    // Filter files by filename or AI summary matching the query
    const q = query.toLowerCase();
    const matched = files
      .filter(
        (f) =>
          f.filename.toLowerCase().includes(q) ||
          f.ai_summary?.toLowerCase().includes(q) ||
          f.tags.some((t) => t.toLowerCase().includes(q))
      )
      .map((f) => f.id);
    setSearchResults(matched);
  };

  const filteredFiles = files.filter((f) => {
    if (searchResults && !searchResults.includes(f.id)) return false;
    if (filter === 'images') return f.mime_type?.startsWith('image/');
    if (filter === 'pdfs') return f.mime_type === 'application/pdf';
    if (filter === 'documents')
      return (
        f.mime_type?.includes('document') || f.mime_type?.includes('text')
      );
    return true;
  });

  if (loading || !user) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Memory Vault</h1>
        <p className="text-sm text-gray-500 mt-1">
          {files.length} file{files.length !== 1 ? 's' : ''} stored
        </p>
      </div>

      <div className="mb-6">
        <SemanticSearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-6">
        <FileUploader userId={user.id} />
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'images', label: 'Images' },
          { key: 'pdfs', label: 'PDFs' },
          { key: 'documents', label: 'Documents' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key);
              setSearchResults(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              filter === f.key
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredFiles.length === 0 ? (
        <EmptyState
          icon="🗄️"
          title="No files yet"
          description="Upload files, images, or documents to build your memory vault"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFiles.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}
