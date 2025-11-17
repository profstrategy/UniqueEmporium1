import { createClient } from "@supabase/supabase-js";

// Ensure these environment variables are set in your .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are not set for server-side client.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);