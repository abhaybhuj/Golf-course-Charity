import { createClient } from '@supabase/supabase-js';

// Sanitize URL helper: strips trailing slash, dashboard paths, extra whitespace, or wrapping quotes
export const sanitizeSupabaseUrl = (rawUrl: string): string => {
  if (!rawUrl) return '';
  let url = rawUrl.trim().replace(/^["']|["']$/g, ''); // remove accidental quotes
  // If user pasted a dashboard URL like https://supabase.com/dashboard/project/hsujhwellraoznlmrqvc
  const matchDashboard = url.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i);
  if (matchDashboard && matchDashboard[1]) {
    return `https://${matchDashboard[1]}.supabase.co`;
  }
  // If user included /rest/v1 or any subpath
  url = url.replace(/\/rest\/v1\/?.*$/i, '');
  url = url.replace(/\/v1\/?.*$/i, '');
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  return url;
};

export const sanitizeAnonKey = (rawKey: string): string => {
  if (!rawKey) return '';
  return rawKey.trim().replace(/^["']|["']$/g, '');
};

// Try environment variables first, then check localStorage config fallback
const envUrl = sanitizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '');
const envKey = sanitizeAnonKey(import.meta.env.VITE_SUPABASE_ANON_KEY || '');

const storedUrl = typeof window !== 'undefined' ? sanitizeSupabaseUrl(localStorage.getItem('supabase_custom_url') || '') : '';
const storedKey = typeof window !== 'undefined' ? sanitizeAnonKey(localStorage.getItem('supabase_custom_key') || '') : '';

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

export const createLiveSupabaseClient = (rawUrl: string, rawKey: string) => {
  const url = sanitizeSupabaseUrl(rawUrl);
  const key = sanitizeAnonKey(rawKey);
  if (!url || !key) return null;
  return createClient(url, key);
};
