"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  es: {
    "nav.home": "Inicio",
    "nav.skills": "Evaluación de Habilidades",
    "nav.coach": "Coach de Carrera",
    "nav.cv": "Constructor de CV",
    "nav.jobs": "Búsqueda de Empleo",
    "nav.disc": "Test DISC",
    "nav.careers": "Carreras UDD",
    "nav.interview": "Simulador de Entrevistas",
    "auth.login": "Iniciar Sesión",
    "auth.register": "Registrarse",
    "auth.logout": "Cerrar Sesión",
    "profile.title": "Perfil",
    "settings.title": "Configuración",
  },
  en: {
    "nav.home": "Home",
    "nav.skills": "Skills Assessment",
    "nav.coach": "Career Coach",
    "nav.cv": "CV Builder",
    "nav.jobs": "Job Search",
    "nav.disc": "DISC Test",
    "nav.careers": "UDD Careers",
    "nav.interview": "Interview Simulator",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
    "profile.title": "Profile",
    "settings.title": "Settings",
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
