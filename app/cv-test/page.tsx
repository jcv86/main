"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Globe,
  Trophy,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface TestResult {
  section: string
  success: boolean
  count: number
  error?: string
}

export default function CVTestPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [results, setResults] = useState<TestResult[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  // Sample data for testing
  const sampleData = {
    profile: {
      first_name: "María José",
      last_name: "Silva Rodríguez",
      full_name: "María José Silva Rodríguez",
      phone: "+56 9 1234 5678",
      location: "Santiago, Chile",
      bio: "Desarrolladora Full Stack Senior con más de 8 años de experiencia en el ecosistema tecnológico chileno. Especializada en React, Node.js y arquitecturas cloud. Apasionada por crear soluciones digitales que impacten positivamente a la comunidad chilena.",
      linkedin_url: "linkedin.com/in/mariajose-silva",
      github_url: "github.com/mjsilva",
      portfolio_url: "mariajosesilva.dev",
      experience_level: "Senior",
      industry: "Tecnología",
      job_title: "Senior Full Stack Developer",
    },
    education: [
      {
        degree: "Ingeniería Civil en Computación",
        institution: "Universidad de Chile",
        location: "Santiago, Chile",
        start_date: "2014-03",
        end_date: "2019-12",
        gpa: "6.2",
        institution_type: "Universidad Estatal",
        commune: "Ñuñoa",
        description:
          'Especialización en Ingeniería de Software y Sistemas Distribuidos. Tesis sobre "Optimización de Aplicaciones Web para el Mercado Chileno".',
      },
      {
        degree: "Magíster en Ciencias de la Computación",
        institution: "Pontificia Universidad Católica de Chile",
        location: "Santiago, Chile",
        start_date: "2020-03",
        end_date: "2022-12",
        gpa: "6.8",
        institution_type: "Universidad Privada",
        commune: "Providencia",
        description: "Especialización en Inteligencia Artificial y Machine Learning aplicado a fintech y e-commerce.",
      },
    ],
    experience: [
      {
        title: "Senior Full Stack Developer",
        company: "Fintual",
        location: "Santiago, Chile",
        start_date: "2022-01",
        end_date: "",
        is_current: true,
        description:
          "Lidero el desarrollo de nuevas funcionalidades para la plataforma de inversiones más popular de Chile. Trabajo con React, Node.js y AWS para crear experiencias financieras intuitivas.",
        achievements: [
          "Desarrollé el sistema de onboarding que aumentó la conversión en 40%",
          "Implementé microservicios que redujeron la latencia de la API en 60%",
          "Lideré la migración a arquitectura serverless, reduciendo costos en $50k USD anuales",
          "Mentoré a 5 desarrolladores junior del equipo",
        ],
      },
      {
        title: "Full Stack Developer",
        company: "NotCo",
        location: "Santiago, Chile",
        start_date: "2020-06",
        end_date: "2021-12",
        is_current: false,
        description:
          "Desarrollé aplicaciones web para la startup de alimentos plant-based más exitosa de Latinoamérica. Trabajé en el e-commerce y sistemas internos de la empresa.",
        achievements: [
          "Construí el e-commerce que generó $2M USD en ventas el primer año",
          "Desarrollé dashboard de analytics para el equipo de marketing",
          "Implementé sistema de inventario en tiempo real",
          "Optimicé la performance web, mejorando Core Web Vitals en 80%",
        ],
      },
      {
        title: "Frontend Developer",
        company: "Cornershop by Uber",
        location: "Santiago, Chile",
        start_date: "2019-01",
        end_date: "2020-05",
        is_current: false,
        description:
          "Desarrollé interfaces de usuario para la aplicación de delivery más usada en Chile. Trabajé con React Native y React.js en un equipo ágil.",
        achievements: [
          "Desarrollé 15+ componentes reutilizables para el design system",
          "Implementé funcionalidades que aumentaron el engagement en 25%",
          "Colaboré en la expansión a 3 nuevos países de LATAM",
          "Reduje el bundle size de la app en 30% mediante code splitting",
        ],
      },
    ],
    projects: [
      {
        name: "ChileJobs - Plataforma de Empleos",
        description:
          "Plataforma web que agrega ofertas laborales de las principales bolsas de trabajo chilenas. Incluye filtros avanzados, alertas personalizadas y análisis salarial del mercado chileno.",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Vercel", "Supabase"],
        url: "chilejobs.dev",
        start_date: "2023-01",
        end_date: "2023-06",
      },
      {
        name: "Mercado Pago Clone",
        description:
          "Implementación de un sistema de pagos similar a Mercado Pago, adaptado para el mercado chileno. Incluye integración con bancos locales y cumple normativas de la CMF.",
        technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "Docker"],
        url: "github.com/mjsilva/mercadopago-clone",
        start_date: "2022-08",
        end_date: "2022-12",
      },
      {
        name: "COVID-19 Chile Dashboard",
        description:
          "Dashboard interactivo que visualiza datos de COVID-19 en Chile por región y comuna. Utiliza datos oficiales del MINSAL y presenta estadísticas en tiempo real.",
        technologies: ["Vue.js", "D3.js", "Python", "FastAPI", "PostgreSQL"],
        url: "covid-chile-dashboard.com",
        start_date: "2020-04",
        end_date: "2020-08",
      },
    ],
    skills: [
      { name: "JavaScript", level: "Experto", category: "Técnico" },
      { name: "TypeScript", level: "Experto", category: "Técnico" },
      { name: "React", level: "Experto", category: "Técnico" },
      { name: "Next.js", level: "Avanzado", category: "Técnico" },
      { name: "Node.js", level: "Avanzado", category: "Técnico" },
      { name: "Python", level: "Intermedio", category: "Técnico" },
      { name: "PostgreSQL", level: "Avanzado", category: "Técnico" },
      { name: "MongoDB", level: "Intermedio", category: "Técnico" },
      { name: "AWS", level: "Avanzado", category: "Técnico" },
      { name: "Docker", level: "Intermedio", category: "Técnico" },
      { name: "Git", level: "Experto", category: "Técnico" },
      { name: "Liderazgo de Equipos", level: "Avanzado", category: "Liderazgo" },
      { name: "Mentoring", level: "Avanzado", category: "Liderazgo" },
      { name: "Comunicación Técnica", level: "Experto", category: "Comunicación" },
      { name: "Presentaciones", level: "Avanzado", category: "Comunicación" },
      { name: "Gestión de Proyectos", level: "Avanzado", category: "Negocio" },
      { name: "Metodologías Ágiles", level: "Experto", category: "Negocio" },
    ],
    certifications: [
      {
        name: "AWS Solutions Architect Associate",
        issuer: "Amazon Web Services",
        issue_date: "2023-03",
        expiry_date: "2026-03",
        credential_id: "AWS-SAA-2023-MJS",
        credential_url: "aws.amazon.com/verification/MJS2023",
      },
      {
        name: "React Developer Certification",
        issuer: "Meta",
        issue_date: "2022-08",
        credential_id: "META-REACT-2022-MJS",
        credential_url: "meta.com/certificates/react/MJS2022",
      },
      {
        name: "Certified Scrum Master",
        issuer: "Scrum Alliance",
        issue_date: "2021-11",
        expiry_date: "2023-11",
        credential_id: "CSM-2021-MJS",
        credential_url: "scrumalliance.org/MJS2021",
      },
      {
        name: "Google Analytics Certified",
        issuer: "Google",
        issue_date: "2023-01",
        expiry_date: "2024-01",
        credential_id: "GA-2023-MJS",
        credential_url: "analytics.google.com/MJS2023",
      },
    ],
    languages: [
      { language: "Español", proficiency: "Nativo" },
      { language: "Inglés", proficiency: "Avanzado" },
      { language: "Portugués", proficiency: "Intermedio" },
    ],
    awards: [
      {
        name: "Mejor Desarrolladora del Año",
        issuer: "TechWomen Chile",
        date: "2023-11",
        description:
          "Reconocimiento por contribuciones destacadas al ecosistema tecnológico chileno y mentoría a mujeres en tech.",
      },
      {
        name: "Innovation Award",
        issuer: "Startup Chile",
        date: "2022-09",
        description:
          "Premio por el desarrollo de soluciones tecnológicas innovadoras para el mercado financiero chileno.",
      },
      {
        name: "Open Source Contributor",
        issuer: "GitHub",
        date: "2021-12",
        description:
          "Reconocimiento por contribuciones significativas a proyectos open source utilizados por la comunidad chilena.",
      },
    ],
  }

  const createTestData = async () => {
    setIsCreating(true)
    setProgress(0)
    setResults([])

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("Usuario no autenticado")
      }

      const testResults: TestResult[] = []
      let currentProgress = 0

      // 1. Update Profile
      setCurrentStep("Actualizando perfil personal...")
      try {
        const { error: profileError } = await supabase.from("profiles").upsert({
          user_id: user.id,
          ...sampleData.profile,
          updated_at: new Date().toISOString(),
        })

        if (profileError) throw profileError
        testResults.push({ section: "Perfil Personal", success: true, count: 1 })
      } catch (error) {
        testResults.push({ section: "Perfil Personal", success: false, count: 0, error: (error as Error).message })
      }

      currentProgress += 12.5
      setProgress(currentProgress)

      // 2. Create Education
      setCurrentStep("Creando educación...")
      try {
        const educationData = sampleData.education.map((edu) => ({
          ...edu,
          user_id: user.id,
        }))

        const { error: educationError } = await supabase.from("user_education").upsert(educationData)

        if (educationError) throw educationError
        testResults.push({ section: "Educación", success: true, count: educationData.length })
      } catch (error) {
        testResults.push({ section: "Educación", success: false, count: 0, error: (error as Error).message })
      }

      currentProgress += 12.5
      setProgress(currentProgress)

      // 3. Create Experience
      setCurrentStep("Creando experiencia laboral...")
      try {
        const experienceData = sampleData.experience.map((exp) => ({
          ...exp,
          user_id: user.id,
        }))

        const { error: experienceError } = await supabase.from("user_experience").upsert(experienceData)

        if (experienceError) throw experienceError
        testResults.push({ section: "Experiencia Laboral", success: true, count: experienceData.length })
      } catch (error) {
        testResults.push({ section: "Experiencia Laboral", success: false, count: 0, error: (error as Error).message })
      }

      currentProgress += 12.5
      setProgress(currentProgress)

      // 4. Create Projects
      setCurrentStep("Creando proyectos...")
      try {
        const projectsData = sampleData.projects.map((project) => ({
          ...project,
          user_id: user.id,
        }))

        const { error: projectsError } = await supabase.from("user_projects").upsert(projectsData)

        if (projectsError) throw projectsError
        testResults.push({ section: "Proyectos", success: true, count: projectsData.length })
      } catch (error) {
        testResults.push({ section: "Proyectos", success: false, count: 0, error: (error as Error).message })
      }

      currentProgress += 12.5
      setProgress(currentProgress)

      // 5. Create Skills
      setCurrentStep("Creando habilidades...")
      try {
        const skillsData = sampleData.skills.map((skill) => ({
          ...skill,
          user_id: user.id,
        }))

        const { error: skillsError } = await supabase.from("user_skills").upsert(skillsData)

        if (skillsError) throw skillsError
        testResults.push({ section: "Habilidades", success: true, count: skillsData.length })
      } catch (error) {
        testResults.push({ section: "Habilidades", success: false, count: 0, error: (error as Error).message })
      }

      currentProgress += 12.5
      setProgress(currentProgress)

      // 6. Create Certifications
      setCurrentStep("Creando certificaciones...")
      try {
        const certificationsData = sampleData.certifications.map((cert) => ({
          ...cert,
          user_id: user.id,
        }))

        const { error: certificationsError } = await supabase.from("user_certifications").upsert(certificationsData)

        if (certificationsError) throw certificationsError
        testResults.push({ section: "Certificaciones", success: true, count: certificationsData.length })
      } catch (error) {
        testResults.push({ section: "Certificaciones", success: false, count: 0, error: (error as Error).message })
      }

      currentProgress += 12.5
      setProgress(currentProgress)

      // 7. Create Languages
      setCurrentStep("Creando idiomas...")
      try {
        const languagesData = sampleData.languages.map((lang) => ({
          ...lang,
          user_id: user.id,
        }))

        const { error: languagesError } = await supabase.from("user_languages").upsert(languagesData)

        if (languagesError) throw languagesError
        testResults.push({ section: "Idiomas", success: true, count: languagesData.length })
      } catch (error) {
        testResults.push({ section: "Idiomas", success: false, count: 0, error: (error as Error).message })
      }

      currentProgress += 12.5
      setProgress(currentProgress)

      // 8. Create Awards
      setCurrentStep("Creando premios y reconocimientos...")
      try {
        const awardsData = sampleData.awards.map((award) => ({
          ...award,
          user_id: user.id,
        }))

        const { error: awardsError } = await supabase.from("user_awards").upsert(awardsData)

        if (awardsError) throw awardsError
        testResults.push({ section: "Premios y Reconocimientos", success: true, count: awardsData.length })
      } catch (error) {
        testResults.push({
          section: "Premios y Reconocimientos",
          success: false,
          count: 0,
          error: (error as Error).message,
        })
      }

      setProgress(100)
      setCurrentStep("¡Datos de prueba creados exitosamente!")
      setResults(testResults)
    } catch (error) {
      console.error("Error creating test data:", error)
      setCurrentStep("Error al crear datos de prueba")
    } finally {
      setIsCreating(false)
    }
  }

  const clearTestData = async () => {
    setIsClearing(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("Usuario no autenticado")
      }

      // Clear all user data
      await Promise.all([
        supabase.from("user_education").delete().eq("user_id", user.id),
        supabase.from("user_experience").delete().eq("user_id", user.id),
        supabase.from("user_projects").delete().eq("user_id", user.id),
        supabase.from("user_skills").delete().eq("user_id", user.id),
        supabase.from("user_certifications").delete().eq("user_id", user.id),
        supabase.from("user_languages").delete().eq("user_id", user.id),
        supabase.from("user_awards").delete().eq("user_id", user.id),
        supabase.from("user_cvs").delete().eq("user_id", user.id),
      ])

      setResults([])
      setProgress(0)
      setCurrentStep("")
    } catch (error) {
      console.error("Error clearing test data:", error)
    } finally {
      setIsClearing(false)
    }
  }

  const goToCVBuilder = () => {
    router.push("/cv-builder")
  }

  const totalItems = Object.values(sampleData).reduce((total, section) => {
    if (Array.isArray(section)) return total + section.length
    return total + 1
  }, 0)

  const successfulItems = results.filter((r) => r.success).reduce((total, r) => total + r.count, 0)

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">🧪 Prueba del Constructor de CV</h1>
        <p className="text-muted-foreground text-lg">
          Crea datos de prueba completos para probar todas las funcionalidades del constructor de CV
        </p>
      </div>

      {/* Preview Sample Data */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Datos de Prueba
          </CardTitle>
          <CardDescription>Vista previa de los datos que se crearán para probar el CV</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="mb-4">
            {showPreview ? "Ocultar" : "Ver"} Datos de Muestra
          </Button>

          {showPreview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold">Perfil</div>
                  <div className="text-sm text-muted-foreground">1 perfil completo</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold">Educación</div>
                  <div className="text-sm text-muted-foreground">{sampleData.education.length} títulos</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold">Experiencia</div>
                  <div className="text-sm text-muted-foreground">{sampleData.experience.length} trabajos</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Code className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="font-semibold">Proyectos</div>
                  <div className="text-sm text-muted-foreground">{sampleData.projects.length} proyectos</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Award className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <div className="font-semibold">Habilidades</div>
                  <div className="text-sm text-muted-foreground">{sampleData.skills.length} skills</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Award className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <div className="font-semibold">Certificaciones</div>
                  <div className="text-sm text-muted-foreground">{sampleData.certifications.length} certificados</div>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
                  <div className="font-semibold">Idiomas</div>
                  <div className="text-sm text-muted-foreground">{sampleData.languages.length} idiomas</div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-pink-600" />
                  <div className="font-semibold">Premios</div>
                  <div className="text-sm text-muted-foreground">{sampleData.awards.length} reconocimientos</div>
                </div>
              </div>

              <Separator />

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Perfil de Prueba: María José Silva Rodríguez</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Senior Full Stack Developer con experiencia en Fintual, NotCo y Cornershop
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">AWS</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button onClick={createTestData} disabled={isCreating || isClearing} className="flex-1" size="lg">
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando Datos...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Crear Datos de Prueba
            </>
          )}
        </Button>

        <Button variant="outline" onClick={clearTestData} disabled={isCreating || isClearing}>
          {isClearing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Limpiando...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar Datos
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      {isCreating && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>{currentStep}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Resultados de la Creación
            </CardTitle>
            <CardDescription>
              {successfulItems} de {totalItems} elementos creados exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">{result.section}</div>
                      {result.error && <div className="text-sm text-red-600">{result.error}</div>}
                    </div>
                  </div>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.count} {result.count === 1 ? "elemento" : "elementos"}
                  </Badge>
                </div>
              ))}
            </div>

            {successfulItems > 0 && (
              <div className="mt-6 pt-4 border-t">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ¡Datos de prueba creados exitosamente! Ahora puedes ir al Constructor de CV para ver todos los datos
                    poblados.
                  </AlertDescription>
                </Alert>

                <Button onClick={goToCVBuilder} className="w-full mt-4" size="lg">
                  <FileText className="mr-2 h-4 w-4" />
                  Ir al Constructor de CV
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Instrucciones de Uso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <div className="font-medium">Crear Datos de Prueba</div>
                <div className="text-sm text-muted-foreground">
                  Haz clic en "Crear Datos de Prueba" para poblar la base de datos con información completa
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <div className="font-medium">Ir al Constructor de CV</div>
                <div className="text-sm text-muted-foreground">
                  Una vez creados los datos, ve al Constructor de CV para ver todas las secciones pobladas
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <div className="font-medium">Probar Funcionalidades</div>
                <div className="text-sm text-muted-foreground">
                  Edita secciones, cambia plantillas, exporta a PDF y prueba todas las características
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <div>
                <div className="font-medium">Limpiar Datos (Opcional)</div>
                <div className="text-sm text-muted-foreground">
                  Usa "Limpiar Datos" para resetear y empezar de nuevo con datos frescos
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
