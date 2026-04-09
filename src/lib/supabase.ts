import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database
export interface User {
  id: string
  email: string
  created_at: string
}

export interface Purchase {
  id: string
  user_id: string
  license_code: string
  amount_sol: number
  transaction_signature: string
  purchased_at: string
}
