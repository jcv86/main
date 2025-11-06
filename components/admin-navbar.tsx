import { Button } from "@/components/ui/button"
import { Activity, Zap, FileText, Database, Shield, GitBranch } from "lucide-react"
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
            <Link href="/admin/autopublish">
              <Button variant="ghost" size="sm" className="gap-2">
                <Zap className="h-4 w-4" />
                <span className="hidden md:inline">Autopublicación</span>
              </Button>
            </Link>
            <Link href="/admin/content-licenses">
              <Button variant="ghost" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Licencias</span>
              </Button>
            </Link>
            <Link href="/admin/data-retention">
              <Button variant="ghost" size="sm" className="gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden md:inline">Retención de Datos</span>
              </Button>
            </Link>
            <Link href="/admin/dsar">
              <Button variant="ghost" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden md:inline">DSAR</span>
              </Button>
            </Link>
            <Link href="/admin/canary-deployments">
              <Button variant="ghost" size="sm" className="gap-2">
                <GitBranch className="h-4 w-4" />
                <span className="hidden md:inline">Canary Deployments</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  )
}
