"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, Target, Award, Zap, Brain, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transforma tu Carrera con
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Inteligencia Artificial
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Descubre tu potencial profesional con evaluaciones psicométricas avanzadas, coaching personalizado con IA
              y una biblioteca de desarrollo profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
                onClick={() => (window.location.href = "/auth")}
              >
                Comenzar Gratis
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 bg-transparent"
                onClick={() => (window.location.href = "/demo")}
              >
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que Necesitas para Crecer Profesionalmente
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma integral que combina ciencia, tecnología y experiencia para acelerar tu desarrollo
              profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Evaluaciones Psicométricas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Tests científicamente validados: DISC, Big Five, MBTI, RIASEC, Inteligencia Emocional y Habilidades
                  Blandas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Coach IA Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Coaching 24/7 con inteligencia artificial que se adapta a tu perfil y objetivos profesionales
                  específicos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Biblioteca Digital</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Más de 70 libros de desarrollo profesional con contenido curado y recomendaciones personalizadas.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Historias de Éxito</h2>
            <p className="text-xl text-gray-600">
              Profesionales que han transformado sus carreras con nuestra plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Image
                  src="/testimonial-ana-garcia.jpg"
                  alt="Ana García"
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <CardTitle className="text-lg">Ana García</CardTitle>
                <CardDescription>Gerente de Marketing, Tech Startup</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "Las evaluaciones me ayudaron a entender mis fortalezas en liderazgo. En 6 meses logré una promoción
                  que llevaba años buscando."
                </p>
                <div className="flex justify-center mt-4">
                  <Badge variant="secondary">Promoción +40% salario</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Image
                  src="/testimonial-carlos-mendoza.jpg"
                  alt="Carlos Mendoza"
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <CardTitle className="text-lg">Carlos Mendoza</CardTitle>
                <CardDescription>Desarrollador Senior, Fintech</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "El coach IA me guió para hacer la transición a Product Manager. Ahora lidero un equipo de 12 personas
                  en una empresa internacional."
                </p>
                <div className="flex justify-center mt-4">
                  <Badge variant="secondary">Cambio de carrera exitoso</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Image
                  src="/testimonial-maria-rodriguez.jpg"
                  alt="María Rodríguez"
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <CardTitle className="text-lg">María Rodríguez</CardTitle>
                <CardDescription>Consultora Independiente</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">
                  "La biblioteca digital me dio las herramientas para lanzar mi consultora. Hoy facturo 3x más que en mi
                  trabajo anterior."
                </p>
                <div className="flex justify-center mt-4">
                  <Badge variant="secondary">Emprendimiento exitoso</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Sobre Nosotros</h2>
              <p className="text-xl text-gray-600">
                Somos expertos en desarrollo profesional con base en Santiago de Chile
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Nuestra Misión</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Democratizar el acceso al desarrollo profesional de calidad mundial, combinando la sabiduría de la
                  psicología organizacional con el poder de la inteligencia artificial.
                </p>
                <p className="text-gray-600 mb-6 text-lg">
                  Desde Santiago de Chile, servimos a profesionales de toda Latinoamérica que buscan acelerar su
                  crecimiento profesional con herramientas científicamente validadas.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">10,000+</div>
                    <div className="text-gray-600">Profesionales Evaluados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">95%</div>
                    <div className="text-gray-600">Satisfacción del Cliente</div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-6 w-6 text-yellow-500 mr-2" />
                      Certificaciones Internacionales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Nuestros tests están validados por organizaciones internacionales de psicología organizacional.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
                      Resultados Comprobados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      85% de nuestros usuarios reporta mejoras significativas en su carrera dentro de los primeros 6
                      meses.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
              <p className="text-xl text-gray-600">Resolvemos las dudas más comunes sobre nuestra plataforma</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>¿Qué incluye la evaluación completa?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Incluye 6 tests psicométricos (DISC, Big Five, MBTI, RIASEC, Inteligencia Emocional y Habilidades
                    Blandas), análisis detallado con IA, plan de desarrollo personalizado y acceso completo a la
                    biblioteca digital.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>¿Cómo funciona el Coach IA?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Nuestro Coach IA analiza tus resultados psicométricos, objetivos profesionales y contexto laboral
                    para brindarte consejos personalizados 24/7. Utiliza modelos de lenguaje avanzados entrenados
                    específicamente en desarrollo profesional.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>¿Los tests son científicamente válidos?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Sí, todos nuestros tests están basados en modelos psicológicos reconocidos internacionalmente y han
                    sido validados en poblaciones latinoamericanas. Cumplimos con estándares internacionales de
                    evaluación psicométrica.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>¿Qué tipo de libros incluye la biblioteca?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Más de 70 libros cuidadosamente seleccionados sobre liderazgo, comunicación, productividad,
                    inteligencia emocional, negociación, estrategia empresarial y desarrollo personal. Todos con
                    resúmenes y ejercicios prácticos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>¿Ofrecen soporte técnico?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Sí, ofrecemos soporte técnico por email y chat en vivo de lunes a viernes de 9:00 a 18:00 (hora de
                    Chile). También tenemos una base de conocimientos completa y tutoriales en video.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture & Careers Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Únete a Nuestro Equipo en Santiago</h2>
            <p className="text-xl mb-8 text-blue-100">
              Estamos construyendo el futuro del desarrollo profesional. Buscamos talento excepcional para unirse a
              nuestra misión.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300 mb-2">25+</div>
                <div className="text-blue-100">Miembros del Equipo</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300 mb-2">95%</div>
                <div className="text-blue-100">Retención de Talento</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300 mb-2">4.8/5</div>
                <div className="text-blue-100">Satisfacción Laboral</div>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4"
              onClick={() => (window.location.href = "/careers")}
            >
              Ver Oportunidades de Trabajo
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">¿Listo para Transformar tu Carrera?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Únete a miles de profesionales que ya están acelerando su crecimiento con nuestra plataforma de desarrollo
              profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                onClick={() => (window.location.href = "/auth")}
              >
                Comenzar Evaluación Gratuita
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-transparent"
                onClick={() => (window.location.href = "/biblioteca")}
              >
                Explorar Biblioteca
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
