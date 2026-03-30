'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Image, File } from 'lucide-react';
import { useMemoryStore } from '@/store/useMemoryStore';

interface FileUploaderProps {
  userId: string;
}

export function FileUploader({ userId }: FileUploaderProps) {
  const { uploadFile } = useMemoryStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setUploading(true);

      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        await uploadFile(userId, file);
      }
      setUploading(false);
    },
    [userId, uploadFile]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);
    for (const file of files) {
      await uploadFile(userId, file);
    }
    setUploading(false);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        isDragging
          ? 'border-violet-500 bg-violet-500/10'
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      <input
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.docx,.csv"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Uploading...</p>
        </div>
      ) : (
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3" />
          <p className="text-sm text-gray-300 mb-1">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Images, PDFs, documents up to 10MB
          </p>
        </label>
      )}
    </div>
  );
}
