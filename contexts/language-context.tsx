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
    welcome: "Bienvenido",
    login: "Iniciar Sesión",
    register: "Registrarse",
    dashboard: "Panel Principal",
    profile: "Perfil",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    notifications: "Notificaciones",
    "personality-test": "Test de Personalidad",
    "skills-assessment": "Evaluación de Habilidades",
    "cv-builder": "Constructor de CV",
    "job-search": "Búsqueda de Empleo",
    "career-coach": "Coach de Carrera",
    "udd-careers": "Carreras UDD",
    "interview-simulator": "Simulador de Entrevistas",
  },
  en: {
    welcome: "Welcome",
    login: "Login",
    register: "Register",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    notifications: "Notifications",
    "personality-test": "Personality Test",
    "skills-assessment": "Skills Assessment",
    "cv-builder": "CV Builder",
    "job-search": "Job Search",
    "career-coach": "Career Coach",
    "udd-careers": "UDD Careers",
    "interview-simulator": "Interview Simulator",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"))
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.es] || key
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
