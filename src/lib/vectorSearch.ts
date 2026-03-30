import { supabase } from './supabaseClient';
import { generateEmbedding } from './gemini';

export interface MemoryResult {
  id: string;
  content: string;
  type: string;
  similarity: number;
}

export async function searchMemories(
  query: string,
  userId: string,
  limit = 5
): Promise<MemoryResult[]> {
  const embedding = await generateEmbedding(query);
  if (!embedding.length) return [];

  const { data, error } = await supabase.rpc('match_memories', {
    query_embedding: embedding,
    match_user_id: userId,
    match_count: limit,
  });

  if (error) {
    console.error('Vector search error:', error);
    return [];
  }

  return data || [];
}
