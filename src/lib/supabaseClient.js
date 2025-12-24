// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// 1. Get environment variables using Vite's standard (import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 2. Validate that the variables exist
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Missing Supabase environment variables.')
  console.error('Make sure your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  throw new Error('Supabase environment variables are missing. Check console for details.')
}

// 3. Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)