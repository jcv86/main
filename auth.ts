// Mock auth for development - replace with your actual auth implementation
export async function auth() {
  // Mock authenticated user for development
  return {
    user: {
      id: "demo-user",
      email: "demo@example.com",
      name: "Demo User",
    },
  }
}
