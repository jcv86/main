"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  es: {
    "nav.dashboard": "Panel de Control",
    "nav.tests": "Evaluaciones",
    "nav.coach": "Coach",
    "nav.jobs": "Empleos",
    "nav.library": "Biblioteca",
    "nav.profile": "Perfil",
    "nav.settings": "Configuración",
    "nav.logout": "Cerrar Sesión",
    "dashboard.title": "Panel de Control",
    "dashboard.welcome": "Bienvenido de vuelta",
    "library.title": "Biblioteca",
    "library.description": "Expande tus conocimientos con libros especializados",
    welcome: "Bienvenido",
    profile: "Perfil",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    // Add more translations as needed
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
    welcome: "Welcome",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    // Add more translations as needed
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  useEffect(() => {
    // Load language from localStorage or browser preference
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.es] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
