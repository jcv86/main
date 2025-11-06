import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import Link from "next/link"

export function AdminNavbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Link href="/admin/system-health">
              <Button variant="ghost" size="sm" className="gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden md:inline">Salud del Sistema</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  )
}
