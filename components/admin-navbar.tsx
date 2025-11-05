"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, BarChart3, Home, BookOpen, Brain, MessageSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminNavbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">DTC</span>
            </div>
            <span className="hidden sm:inline">Despega Tu Carrera</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Inicio</span>
              </Button>
            </Link>
            <Link href="/test">
              <Button variant="ghost" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tests</span>
              </Button>
            </Link>
            <Link href="/biblioteca">
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Biblioteca</span>
              </Button>
            </Link>
            <Link href="/ai-coach">
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Coach IA</span>
              </Button>
            </Link>

            {/* Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/test-metrics" className="cursor-pointer">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Métricas de Coaching
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
