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
    "dashboard.title": "Panel Principal",
    "dashboard.welcome": "Bienvenido de vuelta",
    "profile.title": "Mi Perfil",
    "settings.title": "Configuración",
  },
  en: {
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back",
    "profile.title": "My Profile",
    "settings.title": "Settings",
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
