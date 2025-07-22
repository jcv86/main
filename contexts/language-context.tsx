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
    dashboard: "Panel Principal",
    profile: "Perfil",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    welcome: "Bienvenido",
    "career-coach": "Coach de Carrera",
    "cv-builder": "Constructor de CV",
    "job-search": "Búsqueda de Empleo",
    "skills-assessment": "Evaluación de Habilidades",
    "personality-test": "Test de Personalidad",
  },
  en: {
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    welcome: "Welcome",
    "career-coach": "Career Coach",
    "cv-builder": "CV Builder",
    "job-search": "Job Search",
    "skills-assessment": "Skills Assessment",
    "personality-test": "Personality Test",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["es"]] || key
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
