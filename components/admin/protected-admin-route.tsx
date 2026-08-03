'use client'

import { type ReactNode } from 'react'
import { AdminUnavailable } from '@/components/admin/admin-unavailable'

interface ProtectedAdminRouteProps {
  children: ReactNode
}

export function ProtectedAdminRoute({ children: _children }: ProtectedAdminRouteProps) {
  return <AdminUnavailable />
}
