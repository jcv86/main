import { DespegaNavbar } from '@/components/despega-navbar'
import { requireSuperadminPage } from '@/lib/auth/require-superadmin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireSuperadminPage('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      <DespegaNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
