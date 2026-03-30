'use client';

import { type ChatMessage } from '@/store/useChatStore';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-violet-600 text-white rounded-2xl rounded-br-md'
            : 'bg-gray-800 text-gray-100 rounded-2xl rounded-bl-md border border-gray-700'
        } px-4 py-3`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-violet-600/30 flex items-center justify-center">
              <span className="text-xs">🧠</span>
            </div>
            <span className="text-xs font-medium text-violet-400">MemorAI</span>
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <span
          className={`text-xs mt-1 block ${
            isUser ? 'text-violet-200' : 'text-gray-500'
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  );
}
