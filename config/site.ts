export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
  mainNav: {
    title: string
    href: string
  }[]
}

export const siteConfig: SiteConfig = {
  name: "DTC Career Platform",
  description:
    "Plataforma integral de desarrollo profesional con evaluaciones de personalidad, construcción de CV y búsqueda de empleo.",
  url: "https://dtc-career.vercel.app",
  ogImage: "https://dtc-career.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/dtccareer",
    github: "https://github.com/dtc-career/platform",
  },
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Evaluaciones",
      href: "/assessments",
    },
    {
      title: "CV Builder",
      href: "/cv-builder",
    },
    {
      title: "Búsqueda de Empleo",
      href: "/job-search",
    },
    {
      title: "Coach de Carrera",
      href: "/career-coach",
    },
    {
      title: "Biblioteca",
      href: "/library",
    },
  ],
}
