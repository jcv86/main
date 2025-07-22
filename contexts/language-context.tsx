"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  es: {
    dashboard: "Dashboard",
    profile: "Perfil",
    "personality-test": "Test de Personalidad",
    "skills-assessment": "Evaluación de Habilidades",
    "cv-builder": "Constructor de CV",
    "job-search": "Búsqueda de Empleo",
    "career-coach": "Coach de Carrera",
    "interview-simulator": "Simulador de Entrevistas",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    notifications: "Notificaciones",
    "no-notifications": "No hay notificaciones",
  },
  en: {
    dashboard: "Dashboard",
    profile: "Profile",
    "personality-test": "Personality Test",
    "skills-assessment": "Skills Assessment",
    "cv-builder": "CV Builder",
    "job-search": "Job Search",
    "career-coach": "Career Coach",
    "interview-simulator": "Interview Simulator",
    settings: "Settings",
    logout: "Logout",
    notifications: "Notifications",
    "no-notifications": "No notifications",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"))
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["es"]] || key
  }

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
