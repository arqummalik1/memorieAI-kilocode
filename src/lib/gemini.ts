const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export async function callGeminiChat(
  systemPrompt: string,
  userMessage: string,
  history: { role: string; content: string }[] = []
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
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '{"intent":"general_chat","reply":"Sorry, I could not process that.","action_card":null}';
}

export async function callGeminiVision(
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const res = await fetch(
    `${GEMINI_BASE}/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
              { text: prompt },
            ],
          },
        ],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
}

export async function generateEmbedding(text: string): Promise<number[]> {
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
