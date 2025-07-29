export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type NavLink = {
  title: string
  href: string
  disabled?: boolean
}

import type { Icons } from "@/components/icons"

export const siteConfig: SiteConfig = {
  name: "Career Development Platform",
  description: "Comprehensive career development platform for Chilean professionals",
  url: "https://career-platform.vercel.app",
  ogImage: "https://career-platform.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/careerplatform",
    github: "https://github.com/career-platform",
  },
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Assessments",
      href: "/assessments",
    },
    {
      title: "CV Builder",
      href: "/cv-builder",
    },
    {
      title: "Job Search",
      href: "/job-search",
    },
    {
      title: "Career Coach",
      href: "/career-coach",
    },
    {
      title: "Library",
      href: "/library",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
        },
        {
          title: "Profile Setup",
          href: "/profile",
        },
      ],
    },
    {
      title: "Assessments",
      items: [
        {
          title: "All Assessments",
          href: "/assessments",
        },
        {
          title: "Personality Test",
          href: "/personality-test",
        },
        {
          title: "Skills Assessment",
          href: "/skills-assessment",
        },
        {
          title: "DISC Test",
          href: "/disc-test",
        },
        {
          title: "Big Five Test",
          href: "/big-five-test",
        },
      ],
    },
    {
      title: "Career Tools",
      items: [
        {
          title: "CV Builder",
          href: "/cv-builder",
        },
        {
          title: "Job Search",
          href: "/job-search",
        },
        {
          title: "Career Coach",
          href: "/career-coach",
        },
        {
          title: "Interview Simulator",
          href: "/interview-simulator",
        },
      ],
    },
    {
      title: "Learning",
      items: [
        {
          title: "Library",
          href: "/library",
        },
        {
          title: "UDD Careers",
          href: "/udd-careers",
        },
        {
          title: "Bachillerato",
          href: "/bachillerato",
        },
      ],
    },
  ],
}
