import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Use public anon key only. Never expose service role keys on the client.
// Values come from environment variables.

// Lazily create the client so it doesn't execute at import time during SSR/prerender
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  if (!_client) {
    _client = createClient(url, anon);
  }
  return _client;
}
