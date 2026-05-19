'use client'

import { CameraPermissionModal } from '@/components/a3/camera-permission-modal'

export default function A3Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
