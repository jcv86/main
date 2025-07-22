export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export const mockUser: User = {
  id: "1",
  email: "demo@example.com",
  name: "Usuario Demo",
  avatar: "/placeholder-user.jpg",
}

export function getCurrentUser(): User | null {
  return mockUser
}

export function signOut(): void {
  // Mock sign out
  console.log("Usuario desconectado")
}
