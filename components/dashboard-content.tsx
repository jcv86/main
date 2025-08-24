"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Brain,
  FileText,
  MessageSquare,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Users,
  Lightbulb,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  LogOut,
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Bienvenido a DespegaTuCarrera! 🚀</h1>
            <p className="text-xl text-gray-600">Tu plataforma integral de desarrollo profesional</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview">Inicio</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="cv">CV</TabsTrigger>
            <TabsTrigger value="interviews">Entrevistas</TabsTrigger>
            <TabsTrigger value="coach">Coach IA</TabsTrigger>
            <TabsTrigger value="docs">Documentos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tu Progreso
                </CardTitle>
                <CardDescription>Completa tu perfil para obtener mejores recomendaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Perfil Completo</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">3/5</div>
                      <div className="text-sm text-gray-600">Tests Completados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">1</div>
                      <div className="text-sm text-gray-600">CV Creado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">5</div>
                      <div className="text-sm text-gray-600">Simulaciones</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("tests")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Tests Psicométricos
                  </CardTitle>
                  <CardDescription>Descubre tu personalidad y fortalezas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">3/5 Completados</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("cv")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Generador de CV
                  </CardTitle>
                  <CardDescription>Crea un CV profesional optimizado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Listo para usar</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveTab("interviews")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Simulador de Entrevistas
                  </CardTitle>
                  <CardDescription>Practica y mejora tus habilidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">5 Simulaciones</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("coach")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-orange-600" />
                    Coach IA
                  </CardTitle>
                  <CardDescription>Conversaciones personalizadas de carrera</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Disponible 24/7</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("docs")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    Base de Conocimiento
                  </CardTitle>
                  <CardDescription>Guías y recursos de carrera</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">8 Módulos</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-600" />
                    Próximas Actividades
                  </CardTitle>
                  <CardDescription>Mantén el momentum</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>Completar test RIASEC</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>Actualizar CV</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Completaste el test DISC</span>
                    <Badge variant="outline" className="ml-auto">
                      +15 XP
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Generaste tu primer CV</span>
                    <Badge variant="outline" className="ml-auto">
                      +20 XP
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">¡Desbloqueaste la insignia "Explorador"!</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tests Psicométricos Disponibles</CardTitle>
                <CardDescription>
                  Completa estos tests para obtener insights sobre tu personalidad y preferencias profesionales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Test DISC */}
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Test DISC</h3>
                      <Badge variant="secondary">Completado</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Evalúa tu estilo de comportamiento y comunicación en 4 dimensiones: Dominancia, Influencia,
                      Estabilidad y Conformidad
                    </p>
                    <div className="flex gap-2 mb-3">
                      <Button variant="outline" size="sm">
                        Ver Resultados
                      </Button>
                      <Button variant="ghost" size="sm">
                        Repetir Test
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">Completado: 15 Nov 2024 • Duración: 12 min</div>
                  </div>

                  {/* Big Five */}
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Big Five (OCEAN)</h3>
                      <Badge variant="secondary">Completado</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Mide los cinco grandes rasgos de personalidad: Apertura, Responsabilidad, Extraversión, Amabilidad
                      y Neuroticismo
                    </p>
                    <div className="flex gap-2 mb-3">
                      <Button variant="outline" size="sm">
                        Ver Resultados
                      </Button>
                      <Button variant="ghost" size="sm">
                        Repetir Test
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">Completado: 12 Nov 2024 • Duración: 18 min</div>
                  </div>

                  {/* MBTI */}
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">MBTI (Myers-Briggs)</h3>
                      <Badge variant="secondary">Completado</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Identifica tu tipo de personalidad Myers-Briggs basado en 4 dicotomías: E/I, S/N, T/F, J/P
                    </p>
                    <div className="flex gap-2 mb-3">
                      <Button variant="outline" size="sm">
                        Ver Resultados
                      </Button>
                      <Button variant="ghost" size="sm">
                        Repetir Test
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Completado: 10 Nov 2024 • Duración: 25 min • Resultado: ENFP
                    </div>
                  </div>

                  {/* RIASEC */}
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">RIASEC (Holland)</h3>
                      <Badge className="bg-blue-600">Pendiente</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Descubre tus intereses profesionales: Realista, Investigativo, Artístico, Social, Emprendedor,
                      Convencional
                    </p>
                    <div className="flex gap-2 mb-3">
                      <Button size="sm">Comenzar Test</Button>
                      <Button variant="ghost" size="sm">
                        Vista Previa
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">Duración estimada: 20 min • 60 preguntas</div>
                  </div>

                  {/* Habilidades Blandas */}
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Habilidades Blandas</h3>
                      <Badge className="bg-blue-600">Pendiente</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Evalúa tus competencias interpersonales: comunicación, liderazgo, trabajo en equipo, resolución de
                      problemas
                    </p>
                    <div className="flex gap-2 mb-3">
                      <Button size="sm">Comenzar Test</Button>
                      <Button variant="ghost" size="sm">
                        Vista Previa
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">Duración estimada: 15 min • 45 preguntas</div>
                  </div>

                  {/* Inteligencias Múltiples */}
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Inteligencias Múltiples</h3>
                      <Badge className="bg-blue-600">Pendiente</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Identifica tus tipos de inteligencia según Gardner: lingüística, lógica, espacial, musical,
                      corporal, interpersonal, intrapersonal, naturalista
                    </p>
                    <div className="flex gap-2 mb-3">
                      <Button size="sm">Comenzar Test</Button>
                      <Button variant="ghost" size="sm">
                        Vista Previa
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">Duración estimada: 22 min • 72 preguntas</div>
                  </div>
                </div>

                {/* Test Progress Summary */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen de Progreso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Tests Completados</span>
                          <span className="font-semibold">3 de 6 (50%)</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">3</div>
                          <div className="text-sm text-gray-600">Completados</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">3</div>
                          <div className="text-sm text-gray-600">Pendientes</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">55</div>
                          <div className="text-sm text-gray-600">Min. Invertidos</div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-800">¡Buen progreso!</span>
                        </div>
                        <p className="text-sm text-green-700 mb-3">
                          Has completado el 50% de los tests. Completa RIASEC para obtener recomendaciones de carrera
                          personalizadas.
                        </p>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Continuar con RIASEC
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resultados Recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Brain className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold">Test DISC</div>
                            <div className="text-sm text-gray-600">Perfil: Influencer (I/D)</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">15 Nov</div>
                          <Button variant="outline" size="sm">
                            Ver Detalle
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Target className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold">Big Five</div>
                            <div className="text-sm text-gray-600">Alta Apertura y Extraversión</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">12 Nov</div>
                          <Button variant="outline" size="sm">
                            Ver Detalle
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-semibold">MBTI</div>
                            <div className="text-sm text-gray-600">ENFP - El Inspirador</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">10 Nov</div>
                          <Button variant="outline" size="sm">
                            Ver Detalle
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recomendaciones Personalizadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-800">Basado en tus resultados DISC</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Como perfil Influencer, destacas en roles que requieren comunicación y persuasión. Considera
                          carreras en ventas, marketing o relaciones públicas.
                        </p>
                      </div>

                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-800">Basado en tu MBTI (ENFP)</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Los ENFP prosperan en ambientes creativos y colaborativos. Explora roles en consultoría,
                          recursos humanos o emprendimiento.
                        </p>
                      </div>

                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">Próximo paso recomendado</span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Completa el test RIASEC para obtener recomendaciones específicas de industrias y roles que se
                          alineen con tus intereses.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CV Tab */}
          <TabsContent value="cv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generador de CV Inteligente</CardTitle>
                <CardDescription>Crea un CV profesional optimizado para tu industria objetivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">CV Generado</span>
                    </div>
                    <p className="text-sm text-green-700">Tu CV está listo y optimizado para roles en tecnología</p>
                  </div>

                  <div className="flex gap-3">
                    <Button>Ver CV</Button>
                    <Button variant="outline">Descargar PDF</Button>
                    <Button variant="outline">Editar</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Análisis de CV</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completitud</span>
                          <span className="font-semibold">95%</span>
                        </div>
                        <Progress value={95} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Optimización ATS</span>
                          <span className="font-semibold">88%</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Sugerencias</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Agregar más palabras clave técnicas</li>
                        <li>• Cuantificar logros en experiencia</li>
                        <li>• Incluir certificaciones recientes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interviews Tab */}
          <TabsContent value="interviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Simulador de Entrevistas</CardTitle>
                <CardDescription>Practica entrevistas con IA y recibe feedback personalizado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Entrevista General</h3>
                      <p className="text-sm text-gray-600 mb-3">Preguntas comunes para cualquier industria</p>
                      <Button size="sm">Iniciar Simulación</Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Entrevista Técnica</h3>
                      <p className="text-sm text-gray-600 mb-3">Enfocada en habilidades técnicas específicas</p>
                      <Button size="sm">Iniciar Simulación</Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Entrevista Conductual</h3>
                      <p className="text-sm text-gray-600 mb-3">Situaciones y comportamientos profesionales</p>
                      <Button size="sm">Iniciar Simulación</Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Entrevista por Competencias</h3>
                      <p className="text-sm text-gray-600 mb-3">Basada en competencias específicas del rol</p>
                      <Button size="sm">Iniciar Simulación</Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Historial de Simulaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-semibold">Entrevista General</div>
                            <div className="text-sm text-gray-600">Hace 2 días</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">8.5/10</div>
                            <Button variant="outline" size="sm">
                              Ver Feedback
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-semibold">Entrevista Técnica</div>
                            <div className="text-sm text-gray-600">Hace 1 semana</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-yellow-600">7.2/10</div>
                            <Button variant="outline" size="sm">
                              Ver Feedback
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coach Tab */}
          <TabsContent value="coach" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coach IA - Dani</CardTitle>
                <CardDescription>Tu mentor personal de carrera disponible 24/7</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">Consejo del Día</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      "Recuerda que cada 'no' te acerca más al 'sí' que estás buscando. Mantén la constancia y sigue
                      mejorando tus habilidades."
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Conversaciones Recientes</h3>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <strong>Tú:</strong> ¿Cómo puedo mejorar mi CV para roles de data analyst?
                      </div>
                      <div className="p-2 bg-blue-50 rounded text-sm">
                        <strong>Dani:</strong> Te sugiero enfocarte en proyectos que muestren tu capacidad analítica...
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Iniciar Nueva Conversación</Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Temas Populares</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Preparación para entrevistas</li>
                        <li>• Negociación salarial</li>
                        <li>• Cambio de carrera</li>
                        <li>• Desarrollo de habilidades</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Tu Progreso</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Conversaciones</span>
                          <span>12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Consejos aplicados</span>
                          <span>8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Satisfacción</span>
                          <span>⭐⭐⭐⭐⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Docs Tab */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Base de Conocimiento</CardTitle>
                <CardDescription>Accede a guías completas y recursos de desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold">Especificación Técnica DTC 1.5</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Arquitectura completa, funcionalidades y especificaciones técnicas de la plataforma
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Leer Documento
                      </Button>
                      <Badge variant="secondary">Técnico</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold">Guía de Inicio DTC</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Primeros pasos, configuración inicial y maximización de tu experiencia en DTC
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Leer Documento
                      </Button>
                      <Badge variant="secondary">Guía</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <h3 className="font-semibold">Guía de Carreras Chile</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Información detallada del mercado laboral chileno, salarios y oportunidades
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Leer Documento
                      </Button>
                      <Badge variant="secondary">Mercado</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-orange-600" />
                      <h3 className="font-semibold">Módulos Psicométricos</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Tests DISC, Big Five, MBTI, RIASEC y evaluaciones completas de personalidad
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Leer Documento
                      </Button>
                      <Badge variant="secondary">Psicometría</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-red-600" />
                      <h3 className="font-semibold">CV Generator & Entrevistas</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Herramientas inteligentes para generación de CV y simulación de entrevistas con IA
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Leer Documento
                      </Button>
                      <Badge variant="secondary">Herramientas</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      <h3 className="font-semibold">Biblioteca de Habilidades & Coach IA</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Catálogo completo de habilidades, coaching con IA y filosofías de mentores
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Leer Documento
                      </Button>
                      <Badge variant="secondary">IA & Skills</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-indigo-600" />
                      <h3 className="font-semibold">Progreso, Gamificación & Integraciones</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Sistema completo de progreso, logros, XP e integraciones con plataformas externas
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Leer Documento
                      </Button>
                      <Badge variant="secondary">Gamificación</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold">Recursos Adicionales</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Información complementaria, casos de uso y recursos de desarrollo profesional
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Leer Documento
                      </Button>
                      <Badge variant="secondary">Recursos</Badge>
                    </div>
                  </div>
                </div>

                {/* Search and Filter Section */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4">Buscar en la Documentación</h3>
                  <div className="flex gap-2 mb-4">
                    <Input placeholder="Buscar documentos..." className="flex-1" />
                    <Button variant="outline">Buscar</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                      Todos
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                      Técnico
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                      Guías
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                      Psicometría
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                      Herramientas
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                      IA & Skills
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                      Gamificación
                    </Badge>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-gray-600">Documentos</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">150+</div>
                    <div className="text-sm text-gray-600">Páginas</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">25+</div>
                    <div className="text-sm text-gray-600">Módulos</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">100%</div>
                    <div className="text-sm text-gray-600">Actualizado</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">¿Necesitas ayuda navegando?</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Si no encuentras lo que buscas, nuestro Coach IA puede ayudarte a encontrar la información
                    específica que necesitas
                  </p>
                  <Button size="sm" onClick={() => setActiveTab("coach")}>
                    Preguntar al Coach IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
