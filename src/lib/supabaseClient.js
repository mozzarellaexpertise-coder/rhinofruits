import { createClient } from '@supabase/supabase-js';
// 👈 Use the $env/static/public module for client-safe variables
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(
  PUBLIC_SUPABASE_URL, // This now gets correctly passed in
  PUBLIC_SUPABASE_ANON_KEY // This too!
);