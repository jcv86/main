// Mock auth configuration for development
export interface User {
  id: string
  email: string
  name: string
}

export interface Session {
  user: User
}

// Mock session for development
export const mockSession: Session = {
  user: {
    id: "demo-user",
    email: "demo@example.com",
    name: "Demo User",
  },
}

export async function getSession(): Promise<Session | null> {
  // In development, return mock session
  return mockSession
}
