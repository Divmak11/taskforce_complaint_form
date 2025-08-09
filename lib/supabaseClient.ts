import { createClient } from '@supabase/supabase-js';

// Use public anon key only. Never expose service role keys on the client.
// Values come from .env.local
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);
