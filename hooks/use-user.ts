"use client"

import { useSession } from "@/components/session-wrapper"

/**
 * Hook to get the current user from session
 * This is a wrapper around useSession that provides just the user object
 */
export function useUser() {
  const { user, isLoading } = useSession()

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  }
}
