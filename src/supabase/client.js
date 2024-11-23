import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl,
    key: supabaseKey ? '[HIDDEN]' : undefined
  })
}

export const supabase = createClient(supabaseUrl, supabaseKey)
