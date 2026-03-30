'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Paperclip, X } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface ChatInputProps {
  onSend: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Tell me something to remember...',
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
  } = useVoiceInput();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    if ((!text.trim() && attachments.length === 0) || disabled) return;
    onSend(text.trim(), attachments);
    setText('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMicClick = async () => {
    if (isRecording) {
      const transcribedText = await stopRecording();
      if (transcribedText) {
        setText((prev) => prev + transcribedText);
      }
    } else {
      await startRecording();
    }
  };

  return (
    <div className="border-t border-gray-800 bg-gray-900 p-4">
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {attachments.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-1 bg-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-300"
            >
              <span className="truncate max-w-[120px]">{file.name}</span>
              <button
                onClick={() => removeAttachment(i)}
                className="text-gray-500 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-violet-400 transition-colors flex-shrink-0"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.docx,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            disabled={disabled || isRecording}
          />
        </div>

        <button
          onClick={handleMicClick}
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
            isRecording
              ? 'bg-red-600 text-white animate-pulse'
              : 'text-gray-400 hover:text-violet-400'
          }`}
          title={isRecording ? 'Stop recording' : 'Voice input'}
          disabled={isTranscribing}
        >
          {isRecording ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={handleSubmit}
          disabled={
            disabled || (!text.trim() && attachments.length === 0) || isRecording
          }
          className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      {isRecording && (
        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Recording... tap mic to stop
        </div>
      )}
      {isTranscribing && (
        <div className="flex items-center gap-2 mt-2 text-violet-400 text-sm">
          <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
          Transcribing...
        </div>
      )}
    </div>
  );
}
