'use client'

import { DespeganNavbar } from '@/components/despega-navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DespeganNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
