"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  es: {
    // Navegación
    "nav.dashboard": "Panel",
    "nav.profile": "Perfil",
    "nav.skills": "Habilidades",
    "nav.career": "Carrera",
    "nav.jobs": "Empleos",
    "nav.library": "Biblioteca",
    "nav.settings": "Configuración",
    "nav.logout": "Cerrar Sesión",
    "nav.careerCoach": "Coach Profesional",
    "nav.skillsAssessment": "Evaluación de Habilidades",
    "nav.personalityTest": "Test de Personalidad",
    "nav.jobSearch": "Búsqueda de Empleo",
    "nav.cvBuilder": "Constructor de CV",
    "nav.calendar": "Calendario",
    "nav.goals": "Metas",
    "nav.cv-builder": "Constructor CV",
    "nav.assessments": "Evaluaciones",
    "nav.career-coach": "Coach de Carrera",
    "nav.job-search": "Búsqueda de Empleos",

    // Saludos y mensajes generales
    welcome: "Bienvenido",
    welcomeBack: "¡Bienvenido de vuelta!",
    hello: "Hola",
    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",

    // Autenticación
    login: "Iniciar Sesión",
    register: "Registrarse",
    logout: "Cerrar Sesión",
    email: "Correo Electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    resetPassword: "Restablecer Contraseña",

    // Formularios
    save: "Guardar",
    cancel: "Cancelar",
    submit: "Enviar",
    edit: "Editar",
    delete: "Eliminar",
    add: "Agregar",
    update: "Actualizar",
    create: "Crear",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",

    // Estados
    loading: "Cargando...",
    saving: "Guardando...",
    success: "¡Éxito!",
    error: "Error",
    warning: "Advertencia",
    info: "Información",
    completed: "Completado",
    pending: "Pendiente",
    inProgress: "En Progreso",

    // Búsqueda por voz
    "voice.listening": "Escuchando...",
    "voice.processing": "Procesando...",
    "voice.clickToSpeak": "Haz clic para hablar",
    "voice.speakNow": "Habla ahora",
    "voice.noSpeechDetected": "No se detectó voz",
    "voice.permissionDenied": "Acceso al micrófono denegado",
    "voice.notSupported": "Tu navegador no soporta reconocimiento de voz",

    // Coach profesional
    "coach.askQuestion": "Haz una pregunta sobre tu carrera",
    "coach.typeMessage": "Escribe tu mensaje aquí...",
    "coach.newSession": "Nueva Sesión",
    "coach.previousSessions": "Sesiones Anteriores",
    "coach.voiceSearch": "Búsqueda por voz",

    // Tests y evaluaciones
    "test.start": "Comenzar Test",
    "test.continue": "Continuar",
    "test.finish": "Finalizar",
    "test.results": "Resultados",
    "test.retake": "Repetir Test",
    "test.progress": "Progreso",

    // CV Builder
    "cv.personalInfo": "Información Personal",
    "cv.experience": "Experiencia Laboral",
    "cv.education": "Educación",
    "cv.languages": "Idiomas",
    "cv.projects": "Proyectos",
    "cv.certifications": "Certificaciones",
    "cv.awards": "Premios y Reconocimientos",
    "cv.download": "Descargar CV",
    "cv.preview": "Vista Previa",
    "cv.template": "Plantilla",

    // Búsqueda de empleo
    "jobs.search": "Buscar Empleos",
    "jobs.filters": "Filtros",
    "jobs.location": "Ubicación",
    "jobs.salary": "Salario",
    "jobs.company": "Empresa",
    "jobs.apply": "Postular",
    "jobs.saved": "Guardados",
    "jobs.applied": "Postulaciones",

    // Tiempo
    today: "Hoy",
    yesterday: "Ayer",
    tomorrow: "Mañana",
    thisWeek: "Esta Semana",
    thisMonth: "Este Mes",
    thisYear: "Este Año",

    // Días de la semana
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",

    // Meses
    january: "Enero",
    february: "Febrero",
    march: "Marzo",
    april: "Abril",
    may: "Mayo",
    june: "Junio",
    july: "Julio",
    august: "Agosto",
    september: "Septiembre",
    october: "Octubre",
    november: "Noviembre",
    december: "Diciembre",
  },

  en: {
    // Mantener traducciones en inglés para usuarios internacionales
    "nav.dashboard": "Dashboard",
    "nav.profile": "Profile",
    "nav.skills": "Skills",
    "nav.career": "Career",
    "nav.jobs": "Jobs",
    "nav.library": "Library",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.careerCoach": "Career Coach",
    "nav.skillsAssessment": "Skills Assessment",
    "nav.personalityTest": "Personality Test",
    "nav.jobSearch": "Job Search",
    "nav.cvBuilder": "CV Builder",
    "nav.calendar": "Calendar",
    "nav.goals": "Goals",
    "nav.cv-builder": "CV Builder",
    "nav.assessments": "Assessments",
    "nav.career-coach": "Career Coach",
    "nav.job-search": "Job Search",

    welcome: "Welcome",
    welcomeBack: "Welcome back!",
    hello: "Hello",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",

    login: "Login",
    register: "Register",
    logout: "Logout",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot your password?",
    resetPassword: "Reset Password",

    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    update: "Update",
    create: "Create",
    search: "Search",
    filter: "Filter",
    sort: "Sort",

    loading: "Loading...",
    saving: "Saving...",
    success: "Success!",
    error: "Error",
    warning: "Warning",
    info: "Information",
    completed: "Completed",
    pending: "Pending",
    inProgress: "In Progress",

    "voice.listening": "Listening...",
    "voice.processing": "Processing...",
    "voice.clickToSpeak": "Click to speak",
    "voice.speakNow": "Speak now",
    "voice.noSpeechDetected": "No speech detected",
    "voice.permissionDenied": "Microphone access denied",
    "voice.notSupported": "Your browser doesn't support speech recognition",

    "coach.askQuestion": "Ask a question about your career",
    "coach.typeMessage": "Type your message here...",
    "coach.newSession": "New Session",
    "coach.previousSessions": "Previous Sessions",
    "coach.voiceSearch": "Voice search",

    "test.start": "Start Test",
    "test.continue": "Continue",
    "test.finish": "Finish",
    "test.results": "Results",
    "test.retake": "Retake Test",
    "test.progress": "Progress",

    "cv.personalInfo": "Personal Information",
    "cv.experience": "Work Experience",
    "cv.education": "Education",
    "cv.languages": "Languages",
    "cv.projects": "Projects",
    "cv.certifications": "Certifications",
    "cv.awards": "Awards and Recognition",
    "cv.download": "Download CV",
    "cv.preview": "Preview",
    "cv.template": "Template",

    "jobs.search": "Search Jobs",
    "jobs.filters": "Filters",
    "jobs.location": "Location",
    "jobs.salary": "Salary",
    "jobs.company": "Company",
    "jobs.apply": "Apply",
    "jobs.saved": "Saved",
    "jobs.applied": "Applied",

    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",

    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",

    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "es",
  setLanguage: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.es] || key
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
