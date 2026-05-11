import { createClient } from '@/lib/supabase/server'

export type UserRole = 'regular' | 'superadmin'

/**
 * Get user's role from the database
 * Returns 'regular' if user doesn't have a role record
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_roles_extended')
    .select('role')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.log('[v0] No role found for user, defaulting to regular')
    return 'regular'
  }
  
  return (data?.role as UserRole) || 'regular'
}

/**
 * Check if user is superadmin
 */
export async function isSuperadmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'superadmin'
}

/**
 * Set user as superadmin (admin operation)
 */
export async function setSuperadmin(userId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('user_roles_extended')
    .upsert({
      user_id: userId,
      role: 'superadmin',
      all_modules_unlocked: true,
    }, {
      onConflict: 'user_id'
    })
  
  if (error) {
    console.error('[v0] Failed to set superadmin:', error)
    throw error
  }
}

/**
 * Get user role data with all unlocked status
 */
export async function getUserRoleData(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_roles_extended')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    return {
      role: 'regular' as UserRole,
      all_modules_unlocked: false,
    }
  }
  
  return {
    role: (data?.role as UserRole) || 'regular',
    all_modules_unlocked: data?.all_modules_unlocked || false,
  }
}
