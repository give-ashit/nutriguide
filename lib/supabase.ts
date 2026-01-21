import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Helper to get current user ID from localStorage
export const getCurrentUserId = (): string | null => {
  return localStorage.getItem('nutriguide_user_id');
};

export const setCurrentUserId = (userId: string): void => {
  localStorage.setItem('nutriguide_user_id', userId);
};

export const clearCurrentUserId = (): void => {
  localStorage.removeItem('nutriguide_user_id');
};
