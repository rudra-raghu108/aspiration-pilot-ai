import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get the URL and key directly to avoid any env loading issues
const SUPABASE_URL = "https://bmsvdiqcbgizuwdtpkkm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtc3ZkaXFjYmdpenV3ZHRwa2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NjYyNDAsImV4cCI6MjA3NTA0MjI0MH0.NgIEAGoXJDmrvpAyrselNrWSB3C4v54xw12aH6WjlNQ";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: window.localStorage
  }
});