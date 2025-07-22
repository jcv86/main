export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export const mockUser: User = {
  id: "1",
  name: "Usuario Demo",
  email: "demo@ejemplo.com",
  avatar: "/placeholder.svg",
}

export function getCurrentUser(): User | null {
  return mockUser
}

export function signOut(): void {
  console.log("Cerrando sesión...")
}
