// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Try multiple ways to get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.SUPABASE_URL || 
                    process.env.VITE_SUPABASE_URL || 
                    process.env.SUPABASE_URL

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                        import.meta.env.SUPABASE_ANON_KEY || 
                        process.env.VITE_SUPABASE_ANON_KEY || 
                        process.env.SUPABASE_ANON_KEY

// Check if environment variables are available
if (!supabaseUrl) {
  console.error('Missing Supabase URL environment variable')
  console.error('Available env vars:', Object.keys(import.meta.env))
  console.error('Full import.meta.env:', import.meta.env)
  throw new Error('Supabase URL is required. Please set VITE_SUPABASE_URL in your environment variables.')
}

if (!supabaseAnonKey) {
  console.error('Missing Supabase anon key environment variable')
  console.error('Available env vars:', Object.keys(import.meta.env))
  console.error('Full import.meta.env:', import.meta.env)
  throw new Error('Supabase anon key is required. Please set VITE_SUPABASE_ANON_KEY in your environment variables.')
}

console.log('Supabase URL found:', supabaseUrl ? 'Yes' : 'No')
console.log('Supabase Key found:', supabaseAnonKey ? 'Yes' : 'No')

// Create the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)