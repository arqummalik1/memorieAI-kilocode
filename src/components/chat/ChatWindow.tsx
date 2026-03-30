'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatStore, type ChatMessage } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ChatMessageBubble } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { ActionCard } from './ActionCard';
import { EmptyState } from '@/components/shared/EmptyState';

const SYSTEM_PROMPT_TEMPLATE = `You are MemorAI, a personal memory and productivity assistant.
Your job is to understand what the user wants and return a JSON response.

User's timezone: {{timezone}}
Current date/time: {{current_datetime}}

User's relevant memory context:
{{retrieved_memories}}

Recent conversation:
{{last_10_messages}}

Analyze the user's message and return ONLY valid JSON in this format:
{
  "intent": "set_reminder | create_list | add_to_list | remove_from_list | complete_list_item | get_reminders | get_lists | create_calendar_event | get_calendar | query_memory | save_note | upload_handled | draft_email | get_briefing | friend_reminder | delete_reminder | snooze_reminder | general_chat",
  "entities": {
    "title": "...",
    "datetime": "ISO 8601 string or null",
    "recurrence": "none | daily | weekly | monthly",
    "list_name": "...",
    "item_text": "...",
    "friend_email": "...",
    "duration_minutes": 60,
    "snooze_minutes": 30
  },
  "reply": "Natural language confirmation or response to show the user",
  "action_card": {
    "type": "reminder | list_item | calendar_event | note | null",
    "data": {}
  }
}`;

interface ParsedResponse {
  intent: string;
  entities: Record<string, unknown>;
  reply: string;
  action_card: {
    type: 'reminder' | 'list_item' | 'calendar_event' | 'note' | null;
    data: Record<string, unknown>;
  } | null;
}

export function ChatWindow() {
  const { user, profile } = useAuthStore();
  const { messages, loading, fetchMessages, addMessage, subscribeToMessages } =
    useChatStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionCards, setActionCards] = useState<
    Map<string, { type: string; data: Record<string, unknown> }>
  >(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchMessages(user.id);
      const unsub = subscribeToMessages(user.id);
      return unsub;
    }
  }, [user, fetchMessages, subscribeToMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string, attachments?: File[]) => {
    if (!user) return;

    const userMsg = await addMessage({
      user_id: user.id,
      role: 'user',
      content: text,
      attachments: [],
      intent: null,
    });

    setIsProcessing(true);

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const now = new Date().toLocaleString('en-US', {
        timeZone: profile?.timezone || 'UTC',
      });

      const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace(
        '{{timezone}}',
        profile?.timezone || 'UTC'
      )
        .replace('{{current_datetime}}', now)
        .replace('{{retrieved_memories}}', 'No relevant memories yet.')
        .replace('{{last_10_messages}}', JSON.stringify(history));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userMessage: text,
          history,
          userId: user.id,
        }),
      });

      const result = await response.json();
      const parsed: ParsedResponse = result.parsed;

      const aiMsg = await addMessage({
        user_id: user.id,
        role: 'assistant',
        content: parsed.reply,
        attachments: [],
        intent: parsed.intent,
      });

      if (aiMsg && parsed.action_card?.type) {
        setActionCards(
          (prev) =>
            new Map(
              prev.set(aiMsg.id, {
                type: parsed.action_card!.type!,
                data: parsed.action_card!.data,
              })
            )
        );
      }
    } catch (err) {
      console.error('Chat error:', err);
      await addMessage({
        user_id: user.id,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        attachments: [],
        intent: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            icon="💬"
            title="Start a conversation"
            description="Try saying 'Remind me to call mom tomorrow at 6pm' or 'Create a grocery list'"
          />
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div key={msg.id}>
                <ChatMessageBubble message={msg} />
                {actionCards.has(msg.id) && (
                  <ActionCard
                    type={
                      actionCards.get(msg.id)!.type as
                        | 'reminder'
                        | 'list_item'
                        | 'calendar_event'
                        | 'note'
                    }
                    data={actionCards.get(msg.id)!.data}
                  />
                )}
              </div>
            ))}
            {isProcessing && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} disabled={isProcessing} />
    </div>
  );
}
