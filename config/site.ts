export const siteConfig = {
  name: "Career Development Platform",
  description: "Comprehensive career development platform for Chilean professionals",
  url: "https://career-platform.vercel.app",
  ogImage: "https://career-platform.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/careerplatform",
    github: "https://github.com/careerplatform",
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
      title: "Career Coach",
      href: "/career-coach",
    },
    {
      title: "Job Search",
      href: "/job-search",
    },
    {
      title: "Library",
      href: "/library",
    },
  ],
}

export type SiteConfig = typeof siteConfig
