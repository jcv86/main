"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  es: {
    "nav.dashboard": "Dashboard",
    "nav.tests": "Evaluaciones",
    "nav.coach": "Coach",
    "nav.jobs": "Empleos",
    "nav.library": "Biblioteca",
    "nav.profile": "Perfil",
    "nav.settings": "Configuración",
    "nav.logout": "Cerrar Sesión",
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Bienvenido de vuelta",
    "library.title": "Biblioteca",
    "library.description": "Expande tus conocimientos con libros especializados",
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.tests": "Assessments",
    "nav.coach": "Coach",
    "nav.jobs": "Jobs",
    "nav.library": "Library",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back",
    "library.title": "Library",
    "library.description": "Expand your knowledge with specialized books",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.es] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
