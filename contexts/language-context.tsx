"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  es: {
    dashboard: "Panel Principal",
    profile: "Mi Perfil",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    welcome: "Bienvenido",
    progress: "Progreso",
    recommendations: "Recomendaciones",
  },
  en: {
    dashboard: "Dashboard",
    profile: "My Profile",
    settings: "Settings",
    logout: "Sign Out",
    welcome: "Welcome",
    progress: "Progress",
    recommendations: "Recommendations",
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
