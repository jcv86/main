"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  Eye,
  Download,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Languages,
  Search,
  CheckCircle,
  AlertCircle,
  Database,
  RefreshCw,
  Bug,
  Zap,
  FileText,
  Sparkles,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Enhanced CV Data Types with new fields
interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  website?: string
  summary: string
}

interface Education {
  id: string
  institution: string
  institutionType: string // NEW: University, Institute, School, etc.
  comuna: string // NEW: Geographic location
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
  gpa?: string
  achievements?: string[]
}

interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  startDate: string
  endDate: string
  current: boolean
}

interface Research {
  id: string
  title: string
  institution: string
  supervisor?: string
  startDate: string
  endDate: string
  current: boolean
  status: string // In Progress, Completed, Published
  description: string
  publications?: string[]
  keywords?: string[]
}

interface Skill {
  name: string
  level: number
  category: string
}

interface Language {
  name: string
  level: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

interface CVData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  research: Research[] // NEW SECTION
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
  lastUpdated: string
  version: string // For migration tracking
}

// Institution types for the new dropdown
const INSTITUTION_TYPES = [
  "Universidad",
  "Instituto Profesional",
  "Centro de Formación Técnica",
  "Colegio",
  "Liceo",
  "Academia",
  "Escuela Técnica",
  "Centro de Estudios",
  "Otro",
]

// Chilean communes for the new dropdown
const CHILEAN_COMMUNES = [
  "Santiago",
  "Las Condes",
  "Providencia",
  "Ñuñoa",
  "La Reina",
  "Vitacura",
  "Lo Barnechea",
  "Maipú",
  "Puente Alto",
  "La Florida",
  "San Miguel",
  "Independencia",
  "Recoleta",
  "Conchalí",
  "Quilicura",
  "Huechuraba",
  "Valparaíso",
  "Viña del Mar",
  "Concepción",
  "Temuco",
  "Valdivia",
  "Osorno",
  "Puerto Montt",
  "Antofagasta",
  "Iquique",
  "La Serena",
  "Coquimbo",
  "Rancagua",
  "Talca",
  "Chillán",
  "Los Ángeles",
  "Otro",
]

// Research status options
const RESEARCH_STATUS = ["En Progreso", "Completado", "Publicado", "Pausado", "Cancelado"]

// Datos de ejemplo de DTC para llenar el CV
const dtcExampleData = {
  personalInfo: {
    fullName: "Juan Pérez González",
    email: "juan.perez@dtc.cl",
    phone: "+56 9 8765 4321",
    location: "Santiago, Chile",
    linkedin: "linkedin.com/in/juanperezgonzalez",
    github: "github.com/juanperezdev",
    website: "juanperez.dev",
    summary:
      "Desarrollador Full Stack con 5 años de experiencia en tecnologías web modernas. Especializado en React, Node.js y arquitecturas cloud. Apasionado por crear soluciones innovadoras y escalables para el mercado chileno.",
  },
  education: [
    {
      id: "edu_dtc_1",
      institution: "Universidad de Chile",
      institutionType: "Universidad",
      comuna: "Santiago",
      degree: "Ingeniería Civil en Computación",
      field: "Ciencias de la Computación",
      startDate: "2015-03-01",
      endDate: "2020-12-15",
      current: false,
      achievements: ["Mejor proyecto de título", "Ayudante de cátedra en Algoritmos y Estructuras de Datos"],
    },
    {
      id: "edu_dtc_2",
      institution: "Digital Transformation Center",
      institutionType: "Centro de Formación Técnica",
      comuna: "Las Condes",
      degree: "Bootcamp Desarrollo Full Stack",
      field: "Desarrollo Web",
      startDate: "2021-01-10",
      endDate: "2021-06-30",
      current: false,
      achievements: ["Proyecto destacado: Plataforma de gestión educativa"],
    },
  ],
  experience: [
    {
      id: "exp_dtc_1",
      company: "Digital Transformation Center",
      position: "Desarrollador Full Stack Senior",
      location: "Santiago, Chile",
      startDate: "2021-07-01",
      endDate: "",
      current: true,
      description:
        "Desarrollo de aplicaciones web y móviles para clientes del sector financiero y retail. Implementación de arquitecturas serverless y microservicios.",
      achievements: [
        "Lideré el desarrollo de una plataforma de e-learning que aumentó la retención de usuarios en un 40%",
        "Implementé una arquitectura de microservicios que redujo los costos de infraestructura en un 30%",
        "Mentoría a desarrolladores junior en tecnologías modernas de frontend y backend",
      ],
    },
    {
      id: "exp_dtc_2",
      company: "Falabella Tech",
      position: "Desarrollador Frontend",
      location: "Santiago, Chile",
      startDate: "2019-03-15",
      endDate: "2021-06-30",
      current: false,
      description:
        "Desarrollo de interfaces de usuario para la plataforma de e-commerce de Falabella utilizando React y Redux.",
      achievements: [
        "Rediseño de la experiencia de checkout que aumentó la tasa de conversión en un 15%",
        "Implementación de pruebas automatizadas que redujeron los bugs en producción en un 25%",
      ],
    },
  ],
  research: [
    {
      id: "research_dtc_1",
      title: "Aplicación de Inteligencia Artificial en la Optimización de Procesos de Negocio",
      institution: "Digital Transformation Center",
      supervisor: "Dr. Carlos Rodríguez",
      startDate: "2022-01-15",
      endDate: "",
      current: true,
      status: "En Progreso",
      description:
        "Investigación sobre la implementación de algoritmos de machine learning para la automatización y optimización de procesos empresariales en PyMEs chilenas.",
      publications: ["Paper: IA como herramienta de transformación digital en PyMEs latinoamericanas"],
      keywords: [
        "inteligencia artificial",
        "machine learning",
        "optimización de procesos",
        "transformación digital",
        "PyMEs",
      ],
    },
  ],
  projects: [
    {
      id: "proj_dtc_1",
      name: "DTC Learning Platform",
      description:
        "Plataforma de aprendizaje en línea con funcionalidades de seguimiento de progreso, evaluaciones automatizadas y contenido interactivo.",
      technologies: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
      url: "https://learning.dtc.cl",
      github: "github.com/dtc/learning-platform",
      startDate: "2021-08-01",
      endDate: "",
      current: true,
    },
    {
      id: "proj_dtc_2",
      name: "Sistema de Gestión de Talento",
      description:
        "Aplicación para la gestión integral del ciclo de vida del talento, desde reclutamiento hasta desarrollo profesional.",
      technologies: ["Vue.js", "Express", "PostgreSQL", "Azure"],
      url: "https://talent.dtc.cl",
      github: "github.com/dtc/talent-management",
      startDate: "2022-03-01",
      endDate: "2022-12-15",
      current: false,
    },
  ],
  skills: [
    { name: "JavaScript/TypeScript", level: 5, category: "Technical" },
    { name: "React", level: 5, category: "Technical" },
    { name: "Node.js", level: 4, category: "Technical" },
    { name: "AWS", level: 4, category: "Technical" },
    { name: "Docker/Kubernetes", level: 3, category: "Technical" },
    { name: "MongoDB/PostgreSQL", level: 4, category: "Technical" },
    { name: "Gestión de Proyectos", level: 4, category: "Soft" },
    { name: "Trabajo en Equipo", level: 5, category: "Soft" },
    { name: "Resolución de Problemas", level: 5, category: "Soft" },
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado" },
    { name: "Portugués", level: "Intermedio" },
  ],
  certifications: [
    {
      id: "cert_dtc_1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022-05-20",
      expiryDate: "2025-05-20",
      credentialId: "AWS-123456",
      url: "https://aws.amazon.com/verification",
    },
    {
      id: "cert_dtc_2",
      name: "Certified Scrum Master",
      issuer: "Scrum Alliance",
      date: "2021-11-10",
      expiryDate: "2023-11-10",
      credentialId: "CSM-789012",
      url: "https://www.scrumalliance.org/verify",
    },
    {
      id: "cert_dtc_3",
      name: "Professional Certificate in Digital Transformation",
      issuer: "Digital Transformation Center",
      date: "2022-01-30",
      credentialId: "DTC-345678",
      url: "https://dtc.cl/certificates",
    },
  ],
  lastUpdated: new Date().toISOString(),
  version: "2.0",
}

export default function CVBuilderPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("personal")
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [debugMode, setDebugMode] = useState(process.env.NODE_ENV === "development")
  const [persistenceStatus, setPersistenceStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // Initialize CV data with enhanced structure
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      summary: "",
    },
    education: [],
    experience: [],
    projects: [],
    research: [], // NEW
    skills: [],
    languages: [],
    certifications: [],
    lastUpdated: new Date().toISOString(),
    version: "2.0", // Updated version for migration
  })

  // Auto-save functionality with enhanced logging
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  // Función para cargar datos de ejemplo de DTC
  const loadDTCExampleData = () => {
    if (
      confirm(
        "¿Estás seguro de que quieres cargar los datos de ejemplo de DTC? Esto reemplazará todos los datos actuales.",
      )
    ) {
      setCvData(dtcExampleData)
      setPersistenceStatus("saved")
      setLastSaved(new Date())
      console.log("✅ Datos de ejemplo de DTC cargados correctamente")

      // Mostrar mensaje de éxito por 2 segundos
      setTimeout(() => setPersistenceStatus("idle"), 2000)
    }
  }

  const saveToStorage = async (data: CVData) => {
    try {
      setPersistenceStatus("saving")
      console.log("💾 Saving CV data to localStorage:", {
        timestamp: new Date().toISOString(),
        dataSize: JSON.stringify(data).length,
        sections: {
          education: data.education.length,
          experience: data.experience.length,
          projects: data.projects.length,
          research: data.research.length,
          skills: data.skills.length,
          languages: data.languages.length,
          certifications: data.certifications.length,
        },
      })

      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString(),
      }

      localStorage.setItem("cvData", JSON.stringify(dataToSave))
      setLastSaved(new Date())
      setPersistenceStatus("saved")

      console.log("✅ CV data saved successfully")

      // Reset status after 2 seconds
      setTimeout(() => setPersistenceStatus("idle"), 2000)
    } catch (error) {
      console.error("❌ Error saving CV data:", error)
      setPersistenceStatus("error")
      setTimeout(() => setPersistenceStatus("idle"), 3000)
    }
  }

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem("cvData")
      if (saved) {
        const parsedData = JSON.parse(saved)
        console.log("📂 Loading CV data from localStorage:", {
          timestamp: new Date().toISOString(),
          savedVersion: parsedData.version || "1.0",
          currentVersion: "2.0",
          needsMigration: !parsedData.version || parsedData.version < "2.0",
        })

        // Migration logic for older versions
        const migratedData = migrateData(parsedData)
        setCvData(migratedData)

        console.log("✅ CV data loaded and migrated successfully")
        return migratedData
      }
    } catch (error) {
      console.error("❌ Error loading CV data:", error)
    }
    return null
  }

  // Data migration function
  const migrateData = (data: any): CVData => {
    console.log("🔄 Migrating CV data...")

    // Ensure all new fields exist
    const migrated: CVData = {
      personalInfo: data.personalInfo || {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
        summary: "",
      },
      education: (data.education || []).map((edu: any) => ({
        ...edu,
        institutionType: edu.institutionType || "Universidad", // NEW FIELD
        comuna: edu.comuna || "Santiago", // NEW FIELD
        id: edu.id || `edu_${Date.now()}_${Math.random()}`,
      })),
      experience: data.experience || [],
      projects: data.projects || [],
      research: data.research || [], // NEW SECTION
      skills: data.skills || [],
      languages: data.languages || [],
      certifications: data.certifications || [],
      lastUpdated: new Date().toISOString(),
      version: "2.0",
    }

    console.log("✅ Migration completed:", {
      addedFields: ["institutionType", "comuna", "research"],
      educationMigrated: migrated.education.length,
      researchAdded: migrated.research.length,
    })

    return migrated
  }

  // Auto-save with debouncing
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveToStorage(cvData)
    }, 1000) // Save after 1 second of inactivity

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [cvData])

  // Load data on component mount
  useEffect(() => {
    loadFromStorage()
  }, [])

  // Helper functions for managing sections
  const addEducation = () => {
    const newEducation: Education = {
      id: `edu_${Date.now()}`,
      institution: "",
      institutionType: "Universidad", // NEW
      comuna: "Santiago", // NEW
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      achievements: [],
    }

    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }))

    console.log("➕ Added new education entry:", newEducation.id)
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
    console.log("🗑️ Removed education entry:", id)
  }

  // Research section functions (NEW)
  const addResearch = () => {
    const newResearch: Research = {
      id: `research_${Date.now()}`,
      title: "",
      institution: "",
      supervisor: "",
      startDate: "",
      endDate: "",
      current: false,
      status: "En Progreso",
      description: "",
      publications: [],
      keywords: [],
    }

    setCvData((prev) => ({
      ...prev,
      research: [...prev.research, newResearch],
    }))

    console.log("➕ Added new research entry:", newResearch.id)
  }

  const updateResearch = (id: string, field: keyof Research, value: any) => {
    setCvData((prev) => ({
      ...prev,
      research: prev.research.map((res) => (res.id === id ? { ...res, [field]: value } : res)),
    }))
  }

  const removeResearch = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      research: prev.research.filter((res) => res.id !== id),
    }))
    console.log("🗑️ Removed research entry:", id)
  }

  // Experience functions
  const addExperience = () => {
    const newExperience: Experience = {
      id: `exp_${Date.now()}`,
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    }

    setCvData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const removeExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  // Project functions
  const addProject = () => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: "",
      description: "",
      technologies: [],
      url: "",
      github: "",
      startDate: "",
      endDate: "",
      current: false,
    }

    setCvData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }))
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)),
    }))
  }

  const removeProject = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }))
  }

  // Skill functions
  const addSkill = () => {
    const newSkill: Skill = {
      name: "",
      level: 3,
      category: "Technical",
    }

    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }))
  }

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill)),
    }))
  }

  const removeSkill = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  // Language functions
  const addLanguage = () => {
    const newLanguage: Language = {
      name: "",
      level: "Básico",
    }

    setCvData((prev) => ({
      ...prev,
      languages: [...prev.languages, newLanguage],
    }))
  }

  const updateLanguage = (index: number, field: keyof Language, value: any) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang)),
    }))
  }

  const removeLanguage = (index: number) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }))
  }

  // Certification functions
  const addCertification = () => {
    const newCertification: Certification = {
      id: `cert_${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      expiryDate: "",
      credentialId: "",
      url: "",
    }

    setCvData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCertification],
    }))
  }

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setCvData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)),
    }))
  }

  const removeCertification = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }))
  }

  // Debug functions
  const testPersistence = async () => {
    console.log("🧪 Testing persistence...")
    const testData = { ...cvData, testField: `Test_${Date.now()}` }
    await saveToStorage(testData as CVData)

    setTimeout(() => {
      const loaded = loadFromStorage()
      console.log("🔍 Persistence test result:", {
        saved: !!testData,
        loaded: !!loaded,
        match: JSON.stringify(testData) === JSON.stringify(loaded),
      })
    }, 100)
  }

  const clearAllData = () => {
    if (confirm("⚠️ ¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.")) {
      localStorage.removeItem("cvData")
      setCvData({
        personalInfo: {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          website: "",
          summary: "",
        },
        education: [],
        experience: [],
        projects: [],
        research: [],
        skills: [],
        languages: [],
        certifications: [],
        lastUpdated: new Date().toISOString(),
        version: "2.0",
      })
      console.log("🗑️ All data cleared")
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(cvData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cv-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    console.log("📤 Data exported")
  }

  // Enhanced Preview Component
  const CVPreview = () => (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{cvData.personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {cvData.personalInfo.email && <span>📧 {cvData.personalInfo.email}</span>}
          {cvData.personalInfo.phone && <span>📱 {cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.location && <span>📍 {cvData.personalInfo.location}</span>}
          {cvData.personalInfo.linkedin && <span>💼 LinkedIn</span>}
          {cvData.personalInfo.github && <span>💻 GitHub</span>}
        </div>
        {cvData.personalInfo.summary && (
          <p className="mt-4 text-gray-700 leading-relaxed">{cvData.personalInfo.summary}</p>
        )}
      </div>

      {/* Education */}
      {cvData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
            Educación
          </h2>
          {cvData.education.map((edu) => (
            <div key={edu.id} className="mb-4 p-4 border-l-4 border-blue-200 bg-blue-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      🆕 {edu.institutionType}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      🆕 📍 {edu.comuna}
                    </Badge>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {edu.startDate} - {edu.current ? "Presente" : edu.endDate}
                </span>
              </div>
              {edu.field && <p className="text-sm text-gray-600 mb-1">Campo: {edu.field}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Research Section (NEW) */}
      {cvData.research.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-purple-600" />
            <Badge className="bg-green-500 text-white ml-2">🆕 NUEVO</Badge>
            Investigación
          </h2>
          {cvData.research.map((research) => (
            <div key={research.id} className="mb-4 p-4 border-l-4 border-purple-200 bg-purple-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{research.title}</h3>
                  <p className="text-gray-700">{research.institution}</p>
                  {research.supervisor && <p className="text-sm text-gray-600">Supervisor: {research.supervisor}</p>}
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {research.startDate} - {research.current ? "Presente" : research.endDate}
                  </span>
                  <Badge variant="outline" className="block mt-1">
                    {research.status}
                  </Badge>
                </div>
              </div>
              {research.description && <p className="text-sm text-gray-700 mb-2">{research.description}</p>}
              {research.keywords && research.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {research.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-green-600" />
            Experiencia Laboral
          </h2>
          {cvData.experience.map((exp) => (
            <div key={exp.id} className="mb-4 p-4 border-l-4 border-green-200 bg-green-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700">{exp.company}</p>
                  {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                </div>
                <span className="text-sm text-gray-500">
                  {exp.startDate} - {exp.current ? "Presente" : exp.endDate}
                </span>
              </div>
              {exp.description && <p className="text-sm text-gray-700 mb-2">{exp.description}</p>}
              {exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {cvData.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2 text-orange-600" />
            Proyectos
          </h2>
          {cvData.projects.map((project) => (
            <div key={project.id} className="mb-4 p-4 border-l-4 border-orange-200 bg-orange-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-700">{project.description}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {project.startDate} - {project.current ? "Presente" : project.endDate}
                </span>
              </div>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            Habilidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cvData.skills.map((skill, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{skill.name}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full mr-1 ${i < skill.level ? "bg-yellow-500" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cvData.languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Languages className="w-5 h-5 mr-2 text-red-600" />
            Idiomas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cvData.languages.map((lang, idx) => (
              <div key={idx} className="p-3 bg-red-50 rounded-lg text-center">
                <p className="font-medium text-gray-900">{lang.name}</p>
                <p className="text-sm text-gray-600">{lang.level}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {cvData.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-indigo-600" />
            Certificaciones
          </h2>
          {cvData.certifications.map((cert) => (
            <div key={cert.id} className="mb-3 p-3 border-l-4 border-indigo-200 bg-indigo-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-gray-700">{cert.issuer}</p>
                  {cert.credentialId && <p className="text-xs text-gray-600">ID: {cert.credentialId}</p>}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{cert.date}</p>
                  {cert.expiryDate && <p>Expira: {cert.expiryDate}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer with new features highlight */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>CV generado con Constructor de CV v2.0</p>
        <div className="flex justify-center gap-2 mt-2">
          <Badge className="bg-green-500 text-white">🆕 Tipos de Institución</Badge>
          <Badge className="bg-green-500 text-white">🆕 Ubicación Geográfica</Badge>
          <Badge className="bg-green-500 text-white">🆕 Sección de Investigación</Badge>
        </div>
        <p className="mt-2">Última actualización: {new Date(cvData.lastUpdated).toLocaleString("es-CL")}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with enhanced status */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Constructor de CV</h1>
              <p className="text-gray-600 mt-1">Crea tu currículum profesional paso a paso</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">v2.0</Badge>
                <Badge className="bg-green-500 text-white">🆕 Nuevas Funcionalidades</Badge>
                {lastSaved && (
                  <Badge variant="secondary" className="text-xs">
                    Guardado: {lastSaved.toLocaleTimeString()}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {/* Nuevo botón para cargar datos de DTC */}
              <Button
                onClick={loadDTCExampleData}
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Cargar Datos DTC
              </Button>
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Vista Previa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Vista Previa del CV</DialogTitle>
                    <DialogDescription>Así se verá tu currículum final</DialogDescription>
                  </DialogHeader>
                  <CVPreview />
                </DialogContent>
              </Dialog>
              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Persistence Status */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2">
              {persistenceStatus === "saving" && (
                <div className="flex items-center gap-2 text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Guardando...</span>
                </div>
              )}
              {persistenceStatus === "saved" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Guardado automáticamente</span>
                </div>
              )}
              {persistenceStatus === "error" && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Error al guardar</span>
                </div>
              )}
            </div>
          </div>

          {/* Debug Panel (Development Only) */}
          {debugMode && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <Bug className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Modo Debug Activo</strong> - Datos: {JSON.stringify(cvData).length} chars | Secciones: Ed:
                    {cvData.education.length}, Exp:{cvData.experience.length}, Proj:
                    {cvData.projects.length}, Inv:{cvData.research.length}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={testPersistence}>
                      <Database className="w-3 h-3 mr-1" />
                      Test
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearAllData}>
                      <Trash2 className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Nuevo banner para destacar la función de carga de datos DTC */}
        <Alert className="mb-6 border-purple-200 bg-purple-50">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium text-purple-800">¡Nuevo!</span> Ahora puedes cargar automáticamente datos de
              ejemplo de DTC para tu CV.
            </div>
            <Button size="sm" onClick={loadDTCExampleData} className="bg-purple-600 text-white hover:bg-purple-700">
              <FileText className="w-3 h-3 mr-1" />
              Cargar Datos DTC
            </Button>
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="personal" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              Educación
            </TabsTrigger>
            <TabsTrigger value="research" className="flex items-center gap-1">
              <Search className="w-4 h-4" />
              Investigación
              <Badge className="bg-green-500 text-white text-xs ml-1">NUEVO</Badge>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              Experiencia
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-1">
              <Code className="w-4 h-4" />
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Habilidades
            </TabsTrigger>
            <TabsTrigger value="languages" className="flex items-center gap-1">
              <Languages className="w-4 h-4" />
              Idiomas
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              Certificaciones
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>Completa tu información básica y datos de contacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nombre Completo *</Label>
                    <Input
                      id="fullName"
                      value={cvData.personalInfo.fullName}
                      onChange={(e) =>
                        setCvData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                        }))
                      }
                      placeholder="Juan Pérez González"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={cvData.personalInfo.email}
                      onChange={(e) =>
                        setCvData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value },
                        }))
                      }
                      placeholder="juan.perez@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={cvData.personalInfo.phone}
                      onChange={(e) =>
                        setCvData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value },
                        }))
                      }
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Ubicación *</Label>
                    <Input
                      id="location"
                      value={cvData.personalInfo.location}
                      onChange={(e) =>
                        setCvData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value },
                        }))
                      }
                      placeholder="Santiago, Chile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn (opcional)</Label>
                    <Input
                      id="linkedin"
                      value={cvData.personalInfo.linkedin}
                      onChange={(e) =>
                        setCvData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, linkedin: e.target.value },
                        }))
                      }
                      placeholder="linkedin.com/in/juan-perez"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub (opcional)</Label>
                    <Input
                      id="github"
                      value={cvData.personalInfo.github}
                      onChange={(e) =>
                        setCvData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, github: e.target.value },
                        }))
                      }
                      placeholder="github.com/juanperez"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Sitio Web (opcional)</Label>
                  <Input
                    id="website"
                    value={cvData.personalInfo.website}
                    onChange={(e) =>
                      setCvData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, website: e.target.value },
                      }))
                    }
                    placeholder="www.juanperez.com"
                  />
                </div>
                <div>
                  <Label htmlFor="summary">Resumen Profesional</Label>
                  <Textarea
                    id="summary"
                    value={cvData.personalInfo.summary}
                    onChange={(e) =>
                      setCvData((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, summary: e.target.value },
                      }))
                    }
                    placeholder="Breve descripción de tu perfil profesional, experiencia y objetivos..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab - Enhanced with new fields */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Educación
                      <Badge className="bg-green-500 text-white">🆕 Mejorado</Badge>
                    </CardTitle>
                    <CardDescription>
                      Agrega tu formación académica con nuevos campos de tipo de institución y ubicación
                    </CardDescription>
                  </div>
                  <Button onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Educación
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {cvData.education.map((edu) => (
                  <div key={edu.id} className="p-4 border rounded-lg space-y-4 bg-blue-50 border-blue-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Entrada de Educación</h3>
                      <Button variant="destructive" size="sm" onClick={() => removeEducation(edu.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Institución *</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                          placeholder="Universidad de Chile"
                        />
                      </div>

                      {/* NEW FIELD: Institution Type */}
                      <div>
                        <Label className="flex items-center gap-2">
                          Tipo de Institución *<Badge className="bg-green-500 text-white text-xs">NUEVO</Badge>
                        </Label>
                        <Select
                          value={edu.institutionType}
                          onValueChange={(value) => updateEducation(edu.id, "institutionType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {INSTITUTION_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* NEW FIELD: Comuna */}
                      <div>
                        <Label className="flex items-center gap-2">
                          Comuna *<Badge className="bg-green-500 text-white text-xs">NUEVO</Badge>
                        </Label>
                        <Select value={edu.comuna} onValueChange={(value) => updateEducation(edu.id, "comuna", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la comuna" />
                          </SelectTrigger>
                          <SelectContent>
                            {CHILEAN_COMMUNES.map((comuna) => (
                              <SelectItem key={comuna} value={comuna}>
                                {comuna}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Título/Grado *</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                          placeholder="Ingeniería en Informática"
                        />
                      </div>

                      <div>
                        <Label>Campo de Estudio</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                          placeholder="Ciencias de la Computación"
                        />
                      </div>

                      <div>
                        <Label>Fecha de Inicio</Label>
                        <Input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Fecha de Fin</Label>
                        <Input
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          disabled={edu.current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`current-${edu.id}`}
                        checked={edu.current}
                        onChange={(e) => updateEducation(edu.id, "current", e.target.checked)}
                      />
                      <Label htmlFor={`current-${edu.id}`}>Actualmente estudiando aquí</Label>
                    </div>
                  </div>
                ))}

                {cvData.education.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No has agregado ninguna educación aún.</p>
                    <p className="text-sm">Haz clic en "Agregar Educación" para comenzar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Research Tab - NEW SECTION */}
          <TabsContent value="research">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Investigación
                      <Badge className="bg-green-500 text-white">🆕 NUEVA SECCIÓN</Badge>
                    </CardTitle>
                    <CardDescription>
                      Agrega tus proyectos de investigación, tesis, publicaciones y trabajos académicos
                    </CardDescription>
                  </div>
                  <Button onClick={addResearch}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Investigación
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {cvData.research.map((research) => (
                  <div key={research.id} className="p-4 border rounded-lg space-y-4 bg-purple-50 border-purple-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Proyecto de Investigación</h3>
                      <Button variant="destructive" size="sm" onClick={() => removeResearch(research.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Título del Proyecto *</Label>
                        <Input
                          value={research.title}
                          onChange={(e) => updateResearch(research.id, "title", e.target.value)}
                          placeholder="Análisis de Algoritmos de Machine Learning para..."
                        />
                      </div>

                      <div>
                        <Label>Institución *</Label>
                        <Input
                          value={research.institution}
                          onChange={(e) => updateResearch(research.id, "institution", e.target.value)}
                          placeholder="Universidad de Chile"
                        />
                      </div>

                      <div>
                        <Label>Supervisor/Director</Label>
                        <Input
                          value={research.supervisor || ""}
                          onChange={(e) => updateResearch(research.id, "supervisor", e.target.value)}
                          placeholder="Dr. María González"
                        />
                      </div>

                      <div>
                        <Label>Estado del Proyecto</Label>
                        <Select
                          value={research.status}
                          onValueChange={(value) => updateResearch(research.id, "status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {RESEARCH_STATUS.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Fecha de Inicio</Label>
                        <Input
                          type="date"
                          value={research.startDate}
                          onChange={(e) => updateResearch(research.id, "startDate", e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Fecha de Fin</Label>
                        <Input
                          type="date"
                          value={research.endDate}
                          onChange={(e) => updateResearch(research.id, "endDate", e.target.value)}
                          disabled={research.current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`research-current-${research.id}`}
                        checked={research.current}
                        onChange={(e) => updateResearch(research.id, "current", e.target.checked)}
                      />
                      <Label htmlFor={`research-current-${research.id}`}>Proyecto en curso</Label>
                    </div>

                    <div>
                      <Label>Descripción del ProyectoDescripción del Proyecto</Label>
                      <Textarea
                        value={research.description}
                        onChange={(e) => updateResearch(research.id, "description", e.target.value)}
                        placeholder="Describe los objetivos, metodología y resultados de tu investigación..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Palabras Clave (separadas por comas)</Label>
                      <Input
                        value={research.keywords?.join(", ") || ""}
                        onChange={(e) =>
                          updateResearch(
                            research.id,
                            "keywords",
                            e.target.value.split(",").map((k) => k.trim()),
                          )
                        }
                        placeholder="machine learning, análisis de datos, inteligencia artificial"
                      />
                    </div>

                    <div>
                      <Label>Publicaciones Relacionadas (separadas por comas)</Label>
                      <Textarea
                        value={research.publications?.join(", ") || ""}
                        onChange={(e) =>
                          updateResearch(
                            research.id,
                            "publications",
                            e.target.value.split(",").map((p) => p.trim()),
                          )
                        }
                        placeholder="Título de paper 1, Título de paper 2..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                {cvData.research.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No has agregado ningún proyecto de investigación aún.</p>
                    <p className="text-sm">
                      Esta nueva sección te permite destacar tu trabajo académico y de investigación.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Experiencia Laboral
                    </CardTitle>
                    <CardDescription>Agrega tu experiencia profesional y logros</CardDescription>
                  </div>
                  <Button onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Experiencia
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {cvData.experience.map((exp) => (
                  <div key={exp.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Experiencia Laboral</h3>
                      <Button variant="destructive" size="sm" onClick={() => removeExperience(exp.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Empresa *</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          placeholder="Google Chile"
                        />
                      </div>
                      <div>
                        <Label>Cargo *</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                          placeholder="Desarrollador Full Stack"
                        />
                      </div>
                      <div>
                        <Label>Ubicación</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                          placeholder="Santiago, Chile"
                        />
                      </div>
                      <div>
                        <Label>Fecha de Inicio</Label>
                        <Input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Fecha de Fin</Label>
                        <Input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          disabled={exp.current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`exp-current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                      />
                      <Label htmlFor={`exp-current-${exp.id}`}>Trabajo actual</Label>
                    </div>

                    <div>
                      <Label>Descripción del Trabajo</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                        placeholder="Describe tus responsabilidades principales..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Logros (uno por línea)</Label>
                      <Textarea
                        value={exp.achievements.join("\n")}
                        onChange={(e) =>
                          updateExperience(
                            exp.id,
                            "achievements",
                            e.target.value.split("\n").filter((a) => a.trim()),
                          )
                        }
                        placeholder="Aumenté la eficiencia del sistema en un 30%&#10;Lideré un equipo de 5 desarrolladores&#10;Implementé nuevas funcionalidades que mejoraron la UX"
                        rows={4}
                      />
                    </div>
                  </div>
                ))}

                {cvData.experience.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No has agregado ninguna experiencia laboral aún.</p>
                    <p className="text-sm">Haz clic en "Agregar Experiencia" para comenzar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Proyectos
                    </CardTitle>
                    <CardDescription>Muestra tus proyectos personales y profesionales</CardDescription>
                  </div>
                  <Button onClick={addProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Proyecto
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {cvData.projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Proyecto</h3>
                      <Button variant="destructive" size="sm" onClick={() => removeProject(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre del Proyecto *</Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, "name", e.target.value)}
                          placeholder="E-commerce App"
                        />
                      </div>
                      <div>
                        <Label>URL del Proyecto</Label>
                        <Input
                          value={project.url || ""}
                          onChange={(e) => updateProject(project.id, "url", e.target.value)}
                          placeholder="https://mi-proyecto.com"
                        />
                      </div>
                      <div>
                        <Label>GitHub</Label>
                        <Input
                          value={project.github || ""}
                          onChange={(e) => updateProject(project.id, "github", e.target.value)}
                          placeholder="https://github.com/usuario/proyecto"
                        />
                      </div>
                      <div>
                        <Label>Fecha de Inicio</Label>
                        <Input
                          type="date"
                          value={project.startDate}
                          onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Fecha de Fin</Label>
                        <Input
                          type="date"
                          value={project.endDate}
                          onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                          disabled={project.current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`project-current-${project.id}`}
                        checked={project.current}
                        onChange={(e) => updateProject(project.id, "current", e.target.checked)}
                      />
                      <Label htmlFor={`project-current-${project.id}`}>Proyecto en curso</Label>
                    </div>

                    <div>
                      <Label>Descripción</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        placeholder="Describe el proyecto, sus objetivos y características principales..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Tecnologías (separadas por comas)</Label>
                      <Input
                        value={project.technologies.join(", ")}
                        onChange={(e) =>
                          updateProject(
                            project.id,
                            "technologies",
                            e.target.value.split(",").map((tech) => tech.trim()),
                          )
                        }
                        placeholder="React, Node.js, MongoDB, AWS"
                      />
                    </div>
                  </div>
                ))}

                {cvData.projects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No has agregado ningún proyecto aún.</p>
                    <p className="text-sm">Haz clic en "Agregar Proyecto" para comenzar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Habilidades
                    </CardTitle>
                    <CardDescription>Agrega tus habilidades técnicas y profesionales</CardDescription>
                  </div>
                  <Button onClick={addSkill}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Habilidad
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(index, "name", e.target.value)}
                        placeholder="JavaScript"
                      />
                    </div>
                    <div className="w-32">
                      <Select value={skill.category} onValueChange={(value) => updateSkill(index, "category", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technical">Técnica</SelectItem>
                          <SelectItem value="Soft">Blanda</SelectItem>
                          <SelectItem value="Language">Idioma</SelectItem>
                          <SelectItem value="Tool">Herramienta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Nivel:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => updateSkill(index, "level", level)}
                            className={`w-6 h-6 rounded-full mr-1 ${
                              level <= skill.level ? "bg-yellow-500" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeSkill(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {cvData.skills.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No has agregado ninguna habilidad aún.</p>
                    <p className="text-sm">Haz clic en "Agregar Habilidad" para comenzar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Idiomas
                    </CardTitle>
                    <CardDescription>Agrega los idiomas que dominas</CardDescription>
                  </div>
                  <Button onClick={addLanguage}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Idioma
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvData.languages.map((language, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <Input
                        value={language.name}
                        onChange={(e) => updateLanguage(index, "name", e.target.value)}
                        placeholder="Inglés"
                      />
                    </div>
                    <div className="w-40">
                      <Select value={language.level} onValueChange={(value) => updateLanguage(index, "level", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                          <SelectItem value="Nativo">Nativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeLanguage(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {cvData.languages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Languages className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No has agregado ningún idioma aún.</p>
                    <p className="text-sm">Haz clic en "Agregar Idioma" para comenzar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Certificaciones
                    </CardTitle>
                    <CardDescription>Agrega tus certificaciones y cursos completados</CardDescription>
                  </div>
                  <Button onClick={addCertification}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Certificación
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {cvData.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Certificación</h3>
                      <Button variant="destructive" size="sm" onClick={() => removeCertification(cert.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre de la Certificación *</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                          placeholder="AWS Certified Solutions Architect"
                        />
                      </div>
                      <div>
                        <Label>Emisor *</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div>
                        <Label>Fecha de Emisión</Label>
                        <Input
                          type="date"
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Fecha de Expiración</Label>
                        <Input
                          type="date"
                          value={cert.expiryDate || ""}
                          onChange={(e) => updateCertification(cert.id, "expiryDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>ID de Credencial</Label>
                        <Input
                          value={cert.credentialId || ""}
                          onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                          placeholder="ABC123456"
                        />
                      </div>
                      <div>
                        <Label>URL de Verificación</Label>
                        <Input
                          value={cert.url || ""}
                          onChange={(e) => updateCertification(cert.id, "url", e.target.value)}
                          placeholder="https://verify.example.com/cert/123"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {cvData.certifications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No has agregado ninguna certificación aún.</p>
                    <p className="text-sm">Haz clic en "Agregar Certificación" para comenzar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
