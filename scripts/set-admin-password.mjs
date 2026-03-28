import bcrypt from 'bcrypt'
import { createClient } from '@supabase/supabase-js'

const email = 'travis@nuanu.com'
const password = 'C4rlit0s'

// Hash the password
const passwordHash = await bcrypt.hash(password, 10)
console.log('[v0] Password hash:', passwordHash)

// Update in Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const { data, error } = await supabase
  .from('users')
  .update({ password_hash: passwordHash })
  .eq('email', email)
  .select()

if (error) {
  console.error('[v0] Error updating user:', error)
  process.exit(1)
}

console.log('[v0] Admin password set successfully for:', email)
console.log('[v0] Updated user:', data)
