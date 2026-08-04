/**
 * Administrative platform management is intentionally unavailable until DTC has
 * an installed server-owned role model, audit log and permission schema.
 *
 * Keeping these functions as typed stubs preserves imports while preventing
 * accidental reads or writes against tables that do not exist in DTCFINAL.
 */

export interface AdminUser {
  userId: string
  email: string
  status: 'active' | 'paused' | 'completed'
  joinDate: Date
  completionRate: number
  lastActivityDate: Date | null
  modulesCompleted: number
  averageScore: number
}

export interface PlatformMetrics {
  totalUsers: number
  activeUsers: number
  averageCompletion: number
  averageScore: number
  totalModulesCompleted: number
  avgModulesPerUser: number
  daysToCompletion: number
  userRetention: number
}

export interface ContentMetrics {
  totalModules: number
  avgModuleCompletion: number
  avgModuleScore: number
  topModule: { id: string; completions: number }
  bottomModule: { id: string; completions: number }
  documentCount: number
}

const ADMIN_UNAVAILABLE_ERROR =
  'Administrative role, audit and permission models are not configured.'

export async function getAllUsersForAdmin(): Promise<{
  success: false
  users?: AdminUser[]
  total?: number
  error: string
}> {
  return { success: false, error: ADMIN_UNAVAILABLE_ERROR }
}

export async function getPlatformMetrics(): Promise<{
  success: false
  metrics?: PlatformMetrics
  error: string
}> {
  return { success: false, error: ADMIN_UNAVAILABLE_ERROR }
}

export async function getContentMetrics(): Promise<{
  success: false
  metrics?: ContentMetrics
  error: string
}> {
  return { success: false, error: ADMIN_UNAVAILABLE_ERROR }
}

export async function updateUserStatus(): Promise<{
  success: false
  error: string
}> {
  return { success: false, error: ADMIN_UNAVAILABLE_ERROR }
}

export async function exportUserData(): Promise<{
  success: false
  data?: Record<string, unknown>
  error: string
}> {
  return { success: false, error: ADMIN_UNAVAILABLE_ERROR }
}

export default {
  getAllUsersForAdmin,
  getPlatformMetrics,
  getContentMetrics,
  updateUserStatus,
  exportUserData,
}
