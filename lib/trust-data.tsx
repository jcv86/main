import type { TestimonialCardProps, CaseStudyProps, TrustBadgeProps, SuccessMetricProps } from "@/components/trust/testimonials"
import { Users, Award, TrendingUp, CheckCircle2 } from "lucide-react"

export const testimonials: TestimonialCardProps[] = [
  {
    quote: "Despega Tu Carrera transformó completamente mi trayectoria. En 3 meses pasé de estar estancado a tener 5 ofertas de trabajo. Las evaluaciones psicométricas fueron tan precisas que finalmente entendí dónde estaba mi verdadero potencial.",
    author: "María Rodríguez",
    role: "Senior Product Manager",
    company: "TechCorp Chile",
    rating: 5,
  },
  {
    quote: "Lo que más me gustó fue la adaptabilidad del programa. El coaching de IA realmente me entendió y me ofreció exactamente lo que necesitaba en cada etapa. No es como otros cursos impersonales.",
    author: "Carlos Hernández",
    role: "UX Designer",
    company: "Design Studio",
    rating: 5,
  },
  {
    quote: "El programa me ayudó a definir mi propósito profesional. Después de 20 años en marketing, finalmente sé hacia dónde quiero ir. El ROI de invertir tiempo aquí fue inmenso.",
    author: "Patricia Morales",
    role: "Marketing Director",
    company: "E-commerce Solutions",
    rating: 5,
  },
  {
    quote: "Las 6 evaluaciones psicométricas me dieron una claridad que nunca había tenido. Y la comunidad de usuarios en Despega es increíble para networking.",
    author: "Roberto García",
    role: "Financial Analyst",
    company: "Investment Bank",
    rating: 5,
  },
  {
    quote: "Recomendé el programa a todo mi equipo. El 100% dice que les cambió la perspectiva de su carrera. La inversión fue mínima comparada con coaching tradicional.",
    author: "Alejandra López",
    role: "HR Manager",
    company: "Manufacturing Ltd",
    rating: 5,
  },
  {
    quote: "Lo mejor fue el programa de entrenamiento adaptativo. No tenía que hacer todas las cosas estándar—el sistema me personalizó el camino exactamente según mis necesidades.",
    author: "Diego Sánchez",
    role: "Software Engineer",
    company: "Startup Unicorn",
    rating: 5,
  },
]

export const caseStudies: CaseStudyProps[] = [
  {
    title: "Reducción de Rotación en Startup Tech",
    subtitle: "De 45% a 12% en un año",
    company: "TechVenture Inc",
    industry: "Tecnología",
    challenge: "La startup perdía el 45% de su equipo senior cada año. Los empleados se sentían sin dirección profesional clara y buscan oportunidades en grandes corporaciones.",
    solution: "Implementó Despega Tu Carrera Enterprise para 80 empleados. El programa les permitió definir sus carreras dentro de la empresa y acceder a desarrollo personalizado.",
    results: [
      { metric: "Reducción en rotación", value: "-73%" },
      { metric: "Satisfacción empleados", value: "+84%" },
      { metric: "Promociones internas", value: "+156%" },
    ],
  },
  {
    title: "Aceleración de Promociones",
    subtitle: "100+ promociones en 12 meses",
    company: "Banco Metropolitano",
    industry: "Finanzas",
    challenge: "Los gerentes no tenían herramientas para identificar talento de alto potencial entre sus equipos. Las promociones eran lentas y no basadas en competencia clara.",
    solution: "Despega Tu Carrera permitió a 500+ empleados evaluar su potencial. Los datos de competencia informaron decisiones de promoción más objetivas.",
    results: [
      { metric: "Promociones aceleradas", value: "+108%" },
      { metric: "Tiempo a promoción", value: "-40%" },
      { metric: "Retención top talent", value: "+92%" },
    ],
  },
  {
    title: "Transformación de Cultura HR",
    subtitle: "De reactividad a proactividad",
    company: "Retail Corporativo",
    industry: "Retail",
    challenge: "El equipo de HR estaba abrumado por solicitudes de capacitación desorganizadas. No había visibilidad sobre necesidades de habilidades del negocio.",
    solution: "Despega implementó un sistema centralizado de desarrollo con datos de competencia clara. HR ahora puede planificar capacitación estratégica.",
    results: [
      { metric: "Solicitudes procesadas 3x faster", value: "+300%" },
      { metric: "Alineación skills-negocio", value: "+78%" },
      { metric: "ROI capacitación", value: "+240%" },
    ],
  },
]

export const trustBadges: TrustBadgeProps[] = [
  {
    icon: <Users className="w-8 h-8 text-cyan" />,
    label: "Usuarios Activos",
    value: "2,400+",
    description: "Profesionales transformando sus carreras",
  },
  {
    icon: <Award className="w-8 h-8 text-cyan" />,
    label: "Empresas Confían en DTC",
    value: "45+",
    description: "Desde startups a Fortune 500",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-cyan" />,
    label: "Tasa de Completitud",
    value: "87%",
    description: "Usuarios que terminan el programa",
  },
  {
    icon: <CheckCircle2 className="w-8 h-8 text-cyan" />,
    label: "Satisfacción",
    value: "4.8/5",
    description: "Basado en 500+ reviews",
  },
]

export const successMetrics: SuccessMetricProps[] = [
  {
    before: "$0 clarity",
    after: "$87% clarity",
    label: "Claridad de Carrera",
    improvement: "Con datos psicométricos",
  },
  {
    before: "45% rotación",
    after: "12% rotación",
    label: "Retención de Talento",
    improvement: "-73% en rotación anual",
  },
  {
    before: "$200-300/sesión",
    after: "$20-50/mes",
    label: "Costo de Desarrollo",
    improvement: "-92% en costo por empleado",
  },
]
