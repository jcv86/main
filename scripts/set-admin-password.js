import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function setAdminPassword() {
  try {
    const email = 'travis@nuanu.com'
    const password = 'C4rlit0s'
    
    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10)
    console.log('[v0] Password hashed:', passwordHash)
    
    // Update user in database
    const { data, error } = await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('email', email)
      .select()
    
    if (error) {
      console.error('[v0] Error updating password:', error)
      return
    }
    
    console.log('[v0] Password updated for:', email)
    console.log('[v0] Updated user:', data)
  } catch (error) {
    console.error('[v0] Error:', error)
  }
}

setAdminPassword()
