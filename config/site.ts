export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
    linkedin: string
  }
}

export const siteConfig: SiteConfig = {
  name: "DTC Career Platform",
  description:
    "Plataforma integral de desarrollo profesional con evaluaciones de personalidad, habilidades técnicas, construcción de CV y coaching de carrera impulsado por IA.",
  url: "https://dtc-career.vercel.app",
  ogImage: "https://dtc-career.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/dtccareer",
    github: "https://github.com/dtc-career/platform",
    linkedin: "https://linkedin.com/company/dtc-career",
  },
}
