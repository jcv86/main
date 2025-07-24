"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  FileText,
  BrainCircuit,
  Search,
  MessageSquare,
  BookOpen,
  BarChart3,
  User,
  Settings,
  Shield,
  GraduationCap,
  Building2,
} from "lucide-react"

interface NavigationItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  adminOnly?: boolean
}

const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/cv-builder",
    label: "CV Builder",
    icon: FileText,
  },
  {
    href: "/skills-assessment",
    label: "Skills Assessment",
    icon: BrainCircuit,
  },
  {
    href: "/job-search",
    label: "Job Search",
    icon: Search,
  },
  {
    href: "/career-coach",
    label: "Career Coach",
    icon: MessageSquare,
  },
  {
    href: "/library",
    label: "Library",
    icon: BookOpen,
  },
  {
    href: "/mirix",
    label: "Mirix Memory",
    icon: BarChart3,
  },
  {
    href: "/udd-careers",
    label: "UDD Careers",
    icon: GraduationCap,
  },
  {
    href: "/bachillerato",
    label: "Bachillerato",
    icon: Building2,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    href: "/admin",
    label: "Admin Panel",
    icon: Shield,
    badge: "ADMIN",
    adminOnly: true,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const { user, isAdmin } = useAuth()

  if (!user) {
    return null
  }

  const filteredItems = navigationItems.filter((item) => {
    if (item.adminOnly) {
      return isAdmin
    }
    return true
  })

  return (
    <nav className="flex flex-col space-y-1 p-4">
      <div className="mb-4">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Navigation
          {isAdmin && (
            <Badge variant="destructive" className="ml-2 text-xs">
              ADMIN
            </Badge>
          )}
        </h2>
      </div>

      {filteredItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant={item.adminOnly ? "destructive" : "secondary"} className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        )
      })}

      {isAdmin && (
        <div className="mt-6 pt-4 border-t">
          <h3 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">Administration</h3>
          <Link
            href="/admin"
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/admin"
                ? "bg-destructive text-destructive-foreground"
                : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            )}
          >
            <Shield className="h-4 w-4" />
            <span>Admin Dashboard</span>
            <Badge variant="destructive" className="ml-auto text-xs">
              ADMIN
            </Badge>
          </Link>
        </div>
      )}
    </nav>
  )
}
