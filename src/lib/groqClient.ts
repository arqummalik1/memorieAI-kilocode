const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-large-v3');

  const response = await fetch(
    'https://api.groq.com/openai/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
      body: formData,
    }
  );

  const data = await response.json();
  return data.text || '';
}
