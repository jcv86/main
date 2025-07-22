```tsx file="components/navigation.tsx"
[v0-no-op-code-block-prefix]import { LayoutDashboard, Settings, User, GraduationCap } from 'lucide-react'

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your account",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    description: "Your profile information",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account settings",
  },
  {
    name: "Carreras UDD",
    href: "/udd-careers",
    icon: GraduationCap,
    description: "Explora carreras de la Universidad del Desarrollo"
  },
]

export default navigationItems
