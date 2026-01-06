import { createClient } from '@supabase/supabase-js';

// NOTE: These should be in a .env file.
// For now, if variables are missing, the client will fail gracefully or we can mock it.
// User will need to add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
