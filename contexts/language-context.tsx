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
    "nav.dashboard": "Panel",
    "nav.tests": "Evaluaciones",
    "nav.coaching": "Coaching",
    "nav.jobs": "Empleos",
    "nav.profile": "Perfil",
    "nav.settings": "Configuración",
    "nav.logout": "Cerrar Sesión",
    "dashboard.title": "Panel de Control",
    "dashboard.welcome": "Bienvenido de vuelta",
    "dashboard.stats.tests": "Tests Completados",
    "dashboard.stats.coaching": "Sesiones de Coaching",
    "dashboard.stats.applications": "Aplicaciones Enviadas",
    "dashboard.stats.interviews": "Entrevistas Programadas",
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.tests": "Tests",
    "nav.coaching": "Coaching",
    "nav.jobs": "Jobs",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.stats.tests": "Tests Completed",
    "dashboard.stats.coaching": "Coaching Sessions",
    "dashboard.stats.applications": "Applications Sent",
    "dashboard.stats.interviews": "Interviews Scheduled",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
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
