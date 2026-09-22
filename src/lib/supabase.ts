import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verification check logging to browser console
console.log('[Supabase Init Check]', {
  hasUrl: Boolean(supabaseUrl),
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 24)}...` : 'undefined / empty',
  hasAnonKey: Boolean(supabaseAnonKey),
  anonKeyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 15)}...` : 'undefined / empty'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ [Supabase] Missing environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Please set these in your .env or hosting environment variables.'
  );
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-anon-key'
    );

export default supabase;
