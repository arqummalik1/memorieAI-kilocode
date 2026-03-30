import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function callGeminiChat(
  systemPrompt: string,
  userMessage: string,
  history: { role: string; content: string }[]
): Promise<string> {
  const contents = [
    ...history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const res = await fetch(
    `${GEMINI_BASE}/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      }),
    }
  );
  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    '{"intent":"general_chat","reply":"Sorry, I could not process that.","action_card":null}'
  );
}

async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(
    `${GEMINI_BASE}/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
    }
  );
  const data = await res.json();
  return data.embedding?.values || [];
}

interface ParsedResponse {
  intent: string;
  entities: Record<string, unknown>;
  reply: string;
  action_card: {
    type: string | null;
    data: Record<string, unknown>;
  } | null;
}

async function executeAction(
  parsed: ParsedResponse,
  userId: string,
  supabaseClient: any
) {
  const { intent, entities } = parsed;

  switch (intent) {
    case 'set_reminder': {
      await supabaseClient.from('reminders').insert({
        user_id: userId,
        title: entities.title as string,
        body: null,
        remind_at: (entities.datetime as string) || new Date().toISOString(),
        recurrence: (entities.recurrence as string) || 'none',
        status: 'pending',
        source: 'chat',
      });
      // Save to memories
      const embedding = await generateEmbedding(
        `Reminder: ${entities.title} at ${entities.datetime}`
      );
      await supabaseClient.from('memories').insert({
        user_id: userId,
        content: `Reminder: ${entities.title} at ${entities.datetime}`,
        type: 'reminder',
        embedding,
        source: 'chat',
      });
      break;
    }

    case 'create_list': {
      await supabaseClient.from('lists').insert({
        user_id: userId,
        name: entities.list_name as string,
      });
      break;
    }

    case 'add_to_list': {
      // Find or create list
      const { data: existingList } = await supabaseClient
        .from('lists')
        .select('id')
        .eq('user_id', userId)
        .ilike('name', entities.list_name as string)
        .single();

      let listId = existingList?.id;
      if (!listId) {
        const { data: newList } = await supabaseClient
          .from('lists')
          .insert({ user_id: userId, name: entities.list_name as string })
          .select()
          .single();
        listId = newList?.id;
      }

      if (listId) {
        await supabaseClient.from('list_items').insert({
          list_id: listId,
          text: entities.item_text as string,
        });
      }
      break;
    }

    case 'complete_list_item': {
      const { data: list } = await supabaseClient
        .from('lists')
        .select('id')
        .eq('user_id', userId)
        .ilike('name', entities.list_name as string)
        .single();

      if (list) {
        await supabaseClient
          .from('list_items')
          .update({ done: true })
          .eq('list_id', list.id)
          .ilike('text', entities.item_text as string);
      }
      break;
    }

    case 'delete_reminder': {
      await supabaseClient
        .from('reminders')
        .update({ status: 'dismissed' })
        .eq('user_id', userId)
        .ilike('title', entities.title as string);
      break;
    }

    case 'snooze_reminder': {
      const minutes = (entities.snooze_minutes as number) || 30;
      const snoozeUntil = new Date(
        Date.now() + minutes * 60 * 1000
      ).toISOString();
      await supabaseClient
        .from('reminders')
        .update({ status: 'snoozed', snooze_until: snoozeUntil })
        .eq('user_id', userId)
        .ilike('title', entities.title as string);
      break;
    }

    case 'save_note': {
      const embedding = await generateEmbedding(
        (entities.title as string) || (entities.content as string) || ''
      );
      await supabaseClient.from('memories').insert({
        user_id: userId,
        content: (entities.title as string) || (entities.content as string) || '',
        type: 'note',
        embedding,
        source: 'chat',
      });
      break;
    }

    case 'friend_reminder': {
      await supabaseClient.from('friend_reminders').insert({
        sender_id: userId,
        recipient_email: entities.friend_email as string,
        message: entities.title as string,
        send_at: (entities.datetime as string) || new Date().toISOString(),
      });
      break;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { systemPrompt, userMessage, history, userId } = body;

    if (!systemPrompt || !userMessage || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call Gemini
    const rawResponse = await callGeminiChat(
      systemPrompt,
      userMessage,
      history || []
    );

    // Parse JSON from response
    let parsed: ParsedResponse;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
    } catch {
      parsed = {
        intent: 'general_chat',
        entities: {},
        reply: rawResponse,
        action_card: null,
      };
    }

    // Execute action if Supabase is configured
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      await executeAction(parsed, userId, supabaseClient as any);
    }

    return NextResponse.json({ parsed });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        parsed: {
          intent: 'general_chat',
          entities: {},
          reply: 'Sorry, something went wrong processing your request.',
          action_card: null,
        },
      },
      { status: 500 }
    );
  }
}
