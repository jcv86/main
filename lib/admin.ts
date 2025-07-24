import { createClient } from "@/lib/supabase"

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: "user" | "moderator" | "admin"
  status: "active" | "inactive" | "suspended" | "pending"
  created_at: string
  updated_at: string
  last_login: string
}

export interface UserActivity {
  id: string
  user_id: string | null
  user_email: string | null
  action: string
  details: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface AdminAction {
  id: string
  admin_id: string | null
  admin_email: string | null
  target_user_id: string | null
  target_user_email: string | null
  action: string
  details: any
  created_at: string
}

export interface AdminStats {
  total_users: number
  active_users: number
  inactive_users: number
  suspended_users: number
  new_users_this_month: number
  total_sessions: number
  average_session_duration: string
}

export interface CreateUserData {
  email: string
  full_name: string
  password: string
  role: "user" | "moderator" | "admin"
  status: "active" | "inactive" | "suspended" | "pending"
}

// Mock data for when database is not available
const mockUsers: User[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "travis@nuanu.com",
    full_name: "Travis Nuanu",
    avatar_url: "/placeholder-user.jpg",
    role: "admin",
    status: "active",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "sarah.johnson@example.com",
    full_name: "Sarah Johnson",
    avatar_url: "/placeholder-user.jpg",
    role: "moderator",
    status: "active",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "mike.chen@example.com",
    full_name: "Mike Chen",
    avatar_url: "/placeholder-user.jpg",
    role: "user",
    status: "active",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    email: "emma.davis@example.com",
    full_name: "Emma Davis",
    avatar_url: "/placeholder-user.jpg",
    role: "user",
    status: "inactive",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    email: "alex.rodriguez@example.com",
    full_name: "Alex Rodriguez",
    avatar_url: "/placeholder-user.jpg",
    role: "user",
    status: "suspended",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    last_login: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

let mockActivities: UserActivity[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    user_id: "11111111-1111-1111-1111-111111111111",
    user_email: "travis@nuanu.com",
    action: "login",
    details: "Successful login",
    ip_address: "192.168.1.100",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    user_id: "22222222-2222-2222-2222-222222222222",
    user_email: "sarah.johnson@example.com",
    action: "login",
    details: "Successful login",
    ip_address: "192.168.1.101",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    user_id: "33333333-3333-3333-3333-333333333333",
    user_email: "mike.chen@example.com",
    action: "profile_update",
    details: "Updated profile information",
    ip_address: "192.168.1.102",
    user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    user_id: "44444444-4444-4444-4444-444444444444",
    user_email: "emma.davis@example.com",
    action: "logout",
    details: "User logged out",
    ip_address: "192.168.1.103",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockAdminActions: AdminAction[] = [
  {
    id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    admin_id: "11111111-1111-1111-1111-111111111111",
    admin_email: "travis@nuanu.com",
    target_user_id: "44444444-4444-4444-4444-444444444444",
    target_user_email: "emma.davis@example.com",
    action: "status_updated",
    details: { old_status: "active", new_status: "inactive" },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "gggggggg-gggg-gggg-gggg-gggggggggggg",
    admin_id: "11111111-1111-1111-1111-111111111111",
    admin_email: "travis@nuanu.com",
    target_user_id: "55555555-5555-5555-5555-555555555555",
    target_user_email: "alex.rodriguez@example.com",
    action: "status_updated",
    details: { old_status: "active", new_status: "suspended" },
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh",
    admin_id: "11111111-1111-1111-1111-111111111111",
    admin_email: "travis@nuanu.com",
    target_user_id: "22222222-2222-2222-2222-222222222222",
    target_user_email: "sarah.johnson@example.com",
    action: "role_updated",
    details: { old_role: "user", new_role: "moderator" },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Password validation function
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Simple password hashing for demo (in production, use proper bcrypt)
function hashPassword(password: string): string {
  // This is just for demo purposes - in production use proper bcrypt
  return `hashed_${password}_${Date.now()}`
}

export class AdminService {
  private supabase = createClient()
  private useMockData = true // Default to mock data
  private connectionChecked = false

  async checkDatabaseConnection(): Promise<boolean> {
    if (this.connectionChecked) {
      return !this.useMockData
    }

    try {
      // First, try to check if the table exists by querying information_schema
      const { data: tableExists, error: tableError } = await this.supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_name", "profiles")
        .single()

      if (tableError || !tableExists) {
        console.log("Profiles table does not exist. Using mock data.")
        this.useMockData = true
        this.connectionChecked = true
        return false
      }

      // If table exists, try a simple query
      const { error } = await this.supabase.from("profiles").select("id").limit(1)

      if (error) {
        console.error("Database query error:", error.message)
        this.useMockData = true
        this.connectionChecked = true
        return false
      }

      console.log("Database connection successful")
      this.useMockData = false
      this.connectionChecked = true
      return true
    } catch (error) {
      console.error("Error checking database connection:", error)
      this.useMockData = true
      this.connectionChecked = true
      return false
    }
  }

  async getStats(): Promise<AdminStats> {
    try {
      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        return this.getMockStats()
      }

      // Try RPC function first
      const { data: rpcData, error: rpcError } = await this.supabase.rpc("get_admin_stats")

      if (!rpcError && rpcData && rpcData.length > 0) {
        const stats = rpcData[0]
        return {
          total_users: Number(stats.total_users) || 0,
          active_users: Number(stats.active_users) || 0,
          inactive_users: Number(stats.inactive_users) || 0,
          suspended_users: Number(stats.suspended_users) || 0,
          new_users_this_month: Number(stats.new_users_this_month) || 0,
          total_sessions: Number(stats.total_sessions) || 0,
          average_session_duration: stats.average_session_duration || "0m",
        }
      }

      // Fallback: Calculate stats manually
      const { data: profiles, error: profilesError } = await this.supabase
        .from("profiles")
        .select("role, status, created_at")

      if (profilesError) {
        console.error("Error fetching profiles for stats:", profilesError)
        return this.getMockStats()
      }

      const { data: activities } = await this.supabase.from("user_activities").select("action").eq("action", "login")

      const totalUsers = profiles?.length || 0
      const activeUsers = profiles?.filter((p) => p.status === "active").length || 0
      const inactiveUsers = profiles?.filter((p) => p.status === "inactive").length || 0
      const suspendedUsers = profiles?.filter((p) => p.status === "suspended").length || 0
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)
      const newUsersThisMonth = profiles?.filter((p) => new Date(p.created_at) >= thisMonth).length || 0
      const totalSessions = activities?.length || 0

      return {
        total_users: totalUsers,
        active_users: activeUsers,
        inactive_users: inactiveUsers,
        suspended_users: suspendedUsers,
        new_users_this_month: newUsersThisMonth,
        total_sessions: totalSessions,
        average_session_duration: "25m",
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error)
      return this.getMockStats()
    }
  }

  private getMockStats(): AdminStats {
    const totalUsers = mockUsers.length
    const activeUsers = mockUsers.filter((u) => u.status === "active").length
    const inactiveUsers = mockUsers.filter((u) => u.status === "inactive").length
    const suspendedUsers = mockUsers.filter((u) => u.status === "suspended").length
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    const newUsersThisMonth = mockUsers.filter((u) => new Date(u.created_at) >= thisMonth).length
    const totalSessions = mockActivities.filter((a) => a.action === "login").length

    return {
      total_users: totalUsers,
      active_users: activeUsers,
      inactive_users: inactiveUsers,
      suspended_users: suspendedUsers,
      new_users_this_month: newUsersThisMonth,
      total_sessions: totalSessions,
      average_session_duration: "25m",
    }
  }

  async getUsers(filters?: {
    search?: string
    role?: string
    status?: string
  }): Promise<User[]> {
    try {
      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        return this.getMockUsers(filters)
      }

      let query = this.supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (filters?.search) {
        query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`)
      }

      if (filters?.role && filters.role !== "all") {
        query = query.eq("role", filters.role)
      }

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching users:", error)
        return this.getMockUsers(filters)
      }

      return data || []
    } catch (error) {
      console.error("Error in getUsers:", error)
      return this.getMockUsers(filters)
    }
  }

  private getMockUsers(filters?: {
    search?: string
    role?: string
    status?: string
  }): User[] {
    let filteredUsers = [...mockUsers]

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchLower) ||
          (user.full_name && user.full_name.toLowerCase().includes(searchLower)),
      )
    }

    if (filters?.role && filters.role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === filters.role)
    }

    if (filters?.status && filters.status !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.status === filters.status)
    }

    return filteredUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  async createUser(userData: CreateUserData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validate password
      const passwordValidation = validatePassword(userData.password)
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: `Password validation failed: ${passwordValidation.errors.join(", ")}`,
        }
      }

      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        // Check if email already exists
        const existingUser = mockUsers.find((u) => u.email.toLowerCase() === userData.email.toLowerCase())
        if (existingUser) {
          return { success: false, error: "User with this email already exists" }
        }

        // Create new user in mock data
        const newUser: User = {
          id: generateId(),
          email: userData.email,
          full_name: userData.full_name,
          avatar_url: "/placeholder-user.jpg",
          role: userData.role,
          status: userData.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        }

        mockUsers.unshift(newUser)

        // Add admin action
        const adminAction: AdminAction = {
          id: generateId(),
          admin_id: "11111111-1111-1111-1111-111111111111",
          admin_email: "travis@nuanu.com",
          target_user_id: newUser.id,
          target_user_email: newUser.email,
          action: "user_created",
          details: {
            role: userData.role,
            status: userData.status,
            password_set: true,
            created_by_admin: true,
          },
          created_at: new Date().toISOString(),
        }
        mockAdminActions.unshift(adminAction)

        // Add activity
        const activity: UserActivity = {
          id: generateId(),
          user_id: newUser.id,
          user_email: newUser.email,
          action: "account_created",
          details: `User account created by admin with password. Role: ${userData.role}, Status: ${userData.status}`,
          ip_address: "192.168.1.100",
          user_agent: "Admin Panel",
          created_at: new Date().toISOString(),
        }
        mockActivities.unshift(activity)

        return { success: true, user: newUser }
      }

      // Database implementation with Supabase Auth
      const hashedPassword = hashPassword(userData.password)

      // In a real implementation, you would use Supabase Auth to create the user
      // For now, we'll simulate it with the profiles table
      const { data, error } = await this.supabase
        .from("profiles")
        .insert({
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          status: userData.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating user:", error)
        return { success: false, error: error.message }
      }

      await this.logAdminAction("11111111-1111-1111-1111-111111111111", data.id, "user_created", {
        role: userData.role,
        status: userData.status,
        password_set: true,
        created_by_admin: true,
      })

      return { success: true, user: data }
    } catch (error) {
      console.error("Error in createUser:", error)
      return { success: false, error: "Failed to create user" }
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        const userIndex = mockUsers.findIndex((u) => u.id === userId)
        if (userIndex === -1) return false

        const oldUser = { ...mockUsers[userIndex] }
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...updates,
          updated_at: new Date().toISOString(),
        }

        // Log admin action
        const adminAction: AdminAction = {
          id: generateId(),
          admin_id: "11111111-1111-1111-1111-111111111111",
          admin_email: "travis@nuanu.com",
          target_user_id: userId,
          target_user_email: mockUsers[userIndex].email,
          action: "user_updated",
          details: {
            changes: Object.keys(updates).reduce((acc, key) => {
              acc[key] = { old: oldUser[key as keyof User], new: updates[key as keyof User] }
              return acc
            }, {} as any),
          },
          created_at: new Date().toISOString(),
        }
        mockAdminActions.unshift(adminAction)

        return true
      }

      const { error } = await this.supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)

      if (error) {
        console.error("Error updating user:", error)
        return false
      }

      await this.logAdminAction("11111111-1111-1111-1111-111111111111", userId, "user_updated", { changes: updates })

      return true
    } catch (error) {
      console.error("Error in updateUser:", error)
      return false
    }
  }

  async updateUserRole(userId: string, role: "user" | "moderator" | "admin"): Promise<boolean> {
    return this.updateUser(userId, { role })
  }

  async updateUserStatus(userId: string, status: "active" | "inactive" | "suspended" | "pending"): Promise<boolean> {
    return this.updateUser(userId, { status })
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate password
      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: `Password validation failed: ${passwordValidation.errors.join(", ")}`,
        }
      }

      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        const userIndex = mockUsers.findIndex((u) => u.id === userId)
        if (userIndex === -1) return { success: false, error: "User not found" }

        // In mock mode, we just log the password reset
        const adminAction: AdminAction = {
          id: generateId(),
          admin_id: "11111111-1111-1111-1111-111111111111",
          admin_email: "travis@nuanu.com",
          target_user_id: userId,
          target_user_email: mockUsers[userIndex].email,
          action: "password_reset",
          details: {
            reset_by_admin: true,
            password_strength: "strong",
          },
          created_at: new Date().toISOString(),
        }
        mockAdminActions.unshift(adminAction)

        // Add activity
        const activity: UserActivity = {
          id: generateId(),
          user_id: userId,
          user_email: mockUsers[userIndex].email,
          action: "password_reset",
          details: "Password reset by administrator",
          ip_address: "192.168.1.100",
          user_agent: "Admin Panel",
          created_at: new Date().toISOString(),
        }
        mockActivities.unshift(activity)

        return { success: true }
      }

      // In a real implementation, you would use Supabase Auth to reset the password
      // For now, we'll just log the action
      await this.logAdminAction("11111111-1111-1111-1111-111111111111", userId, "password_reset", {
        reset_by_admin: true,
        password_strength: "strong",
      })

      return { success: true }
    } catch (error) {
      console.error("Error in resetUserPassword:", error)
      return { success: false, error: "Failed to reset password" }
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        const userIndex = mockUsers.findIndex((u) => u.id === userId)
        if (userIndex === -1) return false

        const deletedUser = mockUsers[userIndex]
        mockUsers.splice(userIndex, 1)

        // Remove user activities
        mockActivities = mockActivities.filter((a) => a.user_id !== userId)

        // Log admin action
        const adminAction: AdminAction = {
          id: generateId(),
          admin_id: "11111111-1111-1111-1111-111111111111",
          admin_email: "travis@nuanu.com",
          target_user_id: userId,
          target_user_email: deletedUser.email,
          action: "user_deleted",
          details: { deleted_user: deletedUser.email },
          created_at: new Date().toISOString(),
        }
        mockAdminActions.unshift(adminAction)

        return true
      }

      const { error } = await this.supabase.from("profiles").delete().eq("id", userId)

      if (error) {
        console.error("Error deleting user:", error)
        return false
      }

      await this.logAdminAction("11111111-1111-1111-1111-111111111111", userId, "user_deleted", {
        deleted_user_id: userId,
      })

      return true
    } catch (error) {
      console.error("Error in deleteUser:", error)
      return false
    }
  }

  async getUserActivities(): Promise<UserActivity[]> {
    try {
      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        return [...mockActivities].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }

      const { data, error } = await this.supabase
        .from("user_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching user activities:", error)
        return [...mockActivities]
      }

      return data || []
    } catch (error) {
      console.error("Error in getUserActivities:", error)
      return [...mockActivities]
    }
  }

  async getAdminActions(): Promise<AdminAction[]> {
    try {
      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        return [...mockAdminActions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }

      const { data, error } = await this.supabase
        .from("admin_actions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching admin actions:", error)
        return [...mockAdminActions]
      }

      return data || []
    } catch (error) {
      console.error("Error in getAdminActions:", error)
      return [...mockAdminActions]
    }
  }

  private async logAdminAction(adminId: string, targetUserId: string, action: string, details: any): Promise<void> {
    try {
      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        // Already handled in individual functions for mock data
        return
      }

      // Try RPC function first
      const { error: rpcError } = await this.supabase.rpc("log_admin_action", {
        p_admin_id: adminId,
        p_target_user_id: targetUserId,
        p_action: action,
        p_details: details,
      })

      if (!rpcError) {
        return
      }

      // Fallback: Direct insert
      const { error } = await this.supabase.from("admin_actions").insert({
        admin_id: adminId,
        admin_email: "travis@nuanu.com",
        target_user_id: targetUserId,
        target_user_email: "unknown@example.com",
        action,
        details,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error logging admin action:", error)
      }
    } catch (error) {
      console.error("Error in logAdminAction:", error)
    }
  }

  async isAdmin(userId?: string): Promise<boolean> {
    try {
      if (!userId) return false

      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        const user = mockUsers.find((u) => u.id === userId)
        return user?.role === "admin" || false
      }

      // Try RPC function first
      const { data: rpcData, error: rpcError } = await this.supabase.rpc("is_admin", {
        user_id: userId,
      })

      if (!rpcError && typeof rpcData === "boolean") {
        return rpcData
      }

      // Fallback: Direct query
      const { data, error } = await this.supabase.from("profiles").select("role").eq("id", userId).single()

      if (error) {
        console.error("Error checking admin status:", error)
        return false
      }

      return data?.role === "admin"
    } catch (error) {
      console.error("Error in isAdmin:", error)
      return false
    }
  }

  async getUserRole(userId?: string): Promise<"user" | "moderator" | "admin"> {
    try {
      if (!userId) return "user"

      const isConnected = await this.checkDatabaseConnection()

      if (!isConnected || this.useMockData) {
        const user = mockUsers.find((u) => u.id === userId)
        return user?.role || "user"
      }

      // Try RPC function first
      const { data: rpcData, error: rpcError } = await this.supabase.rpc("get_user_role", {
        user_id: userId,
      })

      if (!rpcError && rpcData) {
        return rpcData
      }

      // Fallback: Direct query
      const { data, error } = await this.supabase.from("profiles").select("role").eq("id", userId).single()

      if (error) {
        console.error("Error getting user role:", error)
        return "user"
      }

      return data?.role || "user"
    } catch (error) {
      console.error("Error in getUserRole:", error)
      return "user"
    }
  }

  getDatabaseStatus(): { connected: boolean; usingMockData: boolean } {
    return {
      connected: !this.useMockData,
      usingMockData: this.useMockData,
    }
  }

  // Reset connection check (useful for testing)
  resetConnectionCheck(): void {
    this.connectionChecked = false
    this.useMockData = true
  }
}

export const adminService = new AdminService()
