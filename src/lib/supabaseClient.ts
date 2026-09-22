import { createClient } from '@supabase/supabase-js';

// Try environment variables first, then check localStorage config fallback
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_key') || '' : '';

export const getSupabaseConfig = () => {
  const url = (envUrl && envUrl !== 'https://your-project.supabase.co') 
    ? envUrl 
    : (storedUrl || 'https://hsujhwellraoznlmrqvc.supabase.co');
  
  const key = (envKey && envKey !== 'your-anon-key-here') 
    ? envKey 
    : storedKey;

  const isConfigured = Boolean(url && key);
  return { url, key, isConfigured };
};

const initialConfig = getSupabaseConfig();

export const isSupabaseConfigured = initialConfig.isConfigured;

export const supabase = isSupabaseConfigured
  ? createClient(initialConfig.url, initialConfig.key)
  : null;

export const createLiveSupabaseClient = (url: string, key: string) => {
  if (!url || !key) return null;
  return createClient(url, key);
};
