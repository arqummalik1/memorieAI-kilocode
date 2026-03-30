'use client';

import { FileText, Image as ImageIcon, File, Trash2, Download } from 'lucide-react';
import { type FileItem, useMemoryStore } from '@/store/useMemoryStore';
import { supabase } from '@/lib/supabaseClient';

interface FileCardProps {
  file: FileItem;
}

function formatSize(bytes: number | null): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

function getFileIcon(mimeType: string | null) {
  if (mimeType?.startsWith('image/')) return <ImageIcon className="w-6 h-6 text-blue-400" />;
  if (mimeType === 'application/pdf') return <FileText className="w-6 h-6 text-red-400" />;
  return <File className="w-6 h-6 text-gray-400" />;
}

export function FileCard({ file }: FileCardProps) {
  const { deleteFile } = useMemoryStore();

  const handleDownload = () => {
    const { data } = supabase.storage
      .from('files')
      .getPublicUrl(file.storage_path);
    window.open(data.publicUrl, '_blank');
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center flex-shrink-0">
          {getFileIcon(file.mime_type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">
            {file.filename}
          </h3>
          {file.ai_summary && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {file.ai_summary}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs text-gray-500">
              {formatSize(file.size_bytes)}
            </span>
            <span className="text-xs text-gray-600">•</span>
            <span className="text-xs text-gray-500">
              {new Date(file.created_at).toLocaleDateString()}
            </span>
          </div>
          {file.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {file.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteFile(file.id, file.storage_path)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
