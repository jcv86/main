// Mock auth for development - using Supabase in production
export interface User {
  id: string
  email: string
  name?: string
}

export const mockUser: User = {
  id: "demo-user-123",
  email: "estudiante@udd.cl",
  name: "Estudiante Demo UDD",
}

export function getUser(): User | null {
  // In development, return mock user
  // In production, this would integrate with Supabase
  return mockUser
}

export function isAuthenticated(): boolean {
  return true // Always authenticated in demo mode
}
