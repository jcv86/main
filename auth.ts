export interface User {
  id: string
  email: string
  name: string
}

export const mockUser: User = {
  id: "demo-user",
  email: "demo@ejemplo.com",
  name: "Usuario Demo",
}

export function getCurrentUser(): User | null {
  return mockUser
}

export function signOut(): void {
  // Mock sign out
  console.log("Usuario desconectado")
}
