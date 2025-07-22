"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  es: {
    "nav.dashboard": "Panel Principal",
    "nav.personality": "Test de Personalidad",
    "nav.skills": "Evaluación de Habilidades",
    "nav.coach": "Coach Profesional",
    "nav.cv": "Constructor de CV",
    "nav.jobs": "Búsqueda de Empleo",
    "nav.careers": "Carreras UDD",
    profile: "Mi Perfil",
    settings: "Configuración",
    logout: "Cerrar Sesión",
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.personality": "Personality Test",
    "nav.skills": "Skills Assessment",
    "nav.coach": "Career Coach",
    "nav.cv": "CV Builder",
    "nav.jobs": "Job Search",
    "nav.careers": "UDD Careers",
    profile: "My Profile",
    settings: "Settings",
    logout: "Sign Out",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
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
