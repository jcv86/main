"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import React from "react"
import type { FC } from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Code,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  List,
  BarChart3,
  Users,
  Mic,
  MicOff,
  AlertCircle,
  Loader2,
  FileSlidersIcon as SliderIcon,
  ChevronUp,
  ChevronDown,
  GripVertical,
  CheckSquare,
  ToggleLeft,
  Sparkles,
  Target,
  TrendingUp,
  HelpCircle,
  RefreshCw,
  ChevronDownIcon,
  ChevronUpIcon,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Info,
  Shuffle,
  Database,
  Globe,
  Smartphone,
  Server,
  Palette,
  Shield,
  Settings,
  Volume2,
  Keyboard,
  CheckCircle,
  Trash2,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Technical skill categories
const SKILL_CATEGORIES = {
  frontend: { color: "bg-blue-500", icon: Globe },
  backend: { color: "bg-green-500", icon: Server },
  database: { color: "bg-purple-500", icon: Database },
  mobile: { color: "bg-orange-500", icon: Smartphone },
  design: { color: "bg-pink-500", icon: Palette },
  security: { color: "bg-red-500", icon: Shield },
}

// Question types
type QuestionType = "scale" | "open" | "multiple" | "scenario" | "ranking" | "checkbox" | "slider" | "binary" | "code"
type InputMode = "mixed" | "voice-complete"

interface Question {
  id: number
  type: QuestionType
  category: keyof typeof SKILL_CATEGORIES
  question: string
  instruction?: string
  options?: string[]
  items?: string[] // Para preguntas de ranking
  min?: number // Para slider
  max?: number // Para slider
  step?: number // Para slider
  code?: string // Para preguntas de código
  language?: string // Lenguaje de programación
  reverse?: boolean
  // Sistema de ayuda
  explanation?: string
  examples?: string[]
  alternativeFormulations?: string[]
  tips?: string[]
}

// Technical skills questions with enhanced help system
const TECHNICAL_QUESTIONS: Question[] = [
  // Frontend questions
  {
    id: 1,
    type: "scale",
    category: "frontend",
    question: "Me siento cómodo/a desarrollando interfaces de usuario interactivas",
    reverse: false,
    explanation:
      "Esta pregunta evalúa tu confianza y experiencia en el desarrollo de interfaces de usuario que respondan a las acciones del usuario.",
    examples: [
      "Crear formularios con validación en tiempo real",
      "Implementar animaciones y transiciones suaves",
      "Desarrollar componentes reutilizables (botones, modales, etc.)",
      "Manejar eventos del usuario (clicks, hover, scroll)",
      "Crear interfaces responsivas que se adapten a diferentes dispositivos",
    ],
    alternativeFormulations: [
      "Tengo experiencia creando interfaces que respondan a las interacciones del usuario",
      "Me resulta natural desarrollar componentes de UI interactivos",
      "Soy capaz de crear experiencias de usuario dinámicas y atractivas",
    ],
    tips: [
      "Piensa en proyectos donde hayas creado elementos interactivos",
      "Considera tu experiencia con frameworks como React, Vue, o Angular",
      "Reflexiona sobre tu comodidad con HTML, CSS y JavaScript",
      "Evalúa tu capacidad para hacer que las interfaces sean intuitivas",
    ],
  },
  {
    id: 2,
    type: "open",
    category: "frontend",
    question: "Describe tu experiencia con frameworks de JavaScript (React, Vue, Angular, etc.)",
    explanation:
      "Esta pregunta busca entender tu nivel de experiencia práctica con los principales frameworks de desarrollo frontend.",
    examples: [
      "Proyectos específicos que hayas desarrollado",
      "Tiempo de experiencia con cada framework",
      "Características avanzadas que hayas implementado",
      "Desafíos técnicos que hayas resuelto",
      "Comparaciones entre diferentes frameworks que hayas usado",
    ],
    alternativeFormulations: [
      "¿Cuál ha sido tu experiencia trabajando con librerías de JavaScript modernas?",
      "Cuéntame sobre tu conocimiento de frameworks frontend populares",
      "Describe tu nivel de competencia con herramientas de desarrollo web modernas",
    ],
    tips: [
      "Menciona frameworks específicos que hayas usado",
      "Incluye tanto proyectos personales como profesionales",
      "Describe el nivel de complejidad de los proyectos",
      "Explica qué aspectos te resultan más fáciles o difíciles",
      "Si no tienes experiencia, menciona tu interés por aprender",
    ],
  },
  {
    id: 3,
    type: "multiple",
    category: "frontend",
    question: "¿Cuál consideras tu mayor fortaleza en desarrollo frontend?",
    options: ["Diseño y UX/UI", "Lógica de programación", "Optimización de rendimiento", "Testing y debugging"],
    explanation: "Esta pregunta identifica en qué área del desarrollo frontend te sientes más competente y confiado.",
    examples: [
      "Diseño: crear interfaces atractivas, usar herramientas de diseño, principios de UX",
      "Lógica: resolver problemas complejos, algoritmos, arquitectura de código",
      "Optimización: mejorar velocidad de carga, bundle size, performance",
      "Testing: escribir pruebas unitarias, debugging, control de calidad",
    ],
    alternativeFormulations: [
      "¿En qué aspecto del desarrollo frontend destacas más?",
      "¿Cuál es tu área de especialización en el frontend?",
      "¿Qué habilidad frontend consideras tu punto fuerte?",
    ],
    tips: [
      "Piensa en qué actividades disfrutas más",
      "Considera en qué recibes más reconocimiento",
      "Reflexiona sobre qué te resulta más natural",
      "Evalúa dónde sientes que agregas más valor",
    ],
  },
  {
    id: 4,
    type: "code",
    category: "frontend",
    question: "¿Cómo optimizarías este código JavaScript?",
    code: `function findUser(users, id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}`,
    language: "javascript",
    explanation: "Esta pregunta evalúa tu capacidad para identificar y aplicar optimizaciones en código JavaScript.",
    examples: [
      "Usar métodos de array más eficientes como find()",
      "Implementar early returns para mejorar legibilidad",
      "Considerar estructuras de datos más eficientes",
      "Agregar validaciones de entrada",
      "Usar destructuring o sintaxis moderna",
    ],
    alternativeFormulations: [
      "¿Qué mejoras aplicarías a esta función de búsqueda?",
      "¿Cómo refactorizarías este código para hacerlo más eficiente?",
      "¿Qué optimizaciones implementarías en esta función?",
    ],
    tips: [
      "Considera tanto rendimiento como legibilidad",
      "Piensa en métodos de array nativos de JavaScript",
      "Evalúa si hay formas más modernas de escribir el código",
      "Considera casos edge y validaciones",
    ],
  },
  {
    id: 5,
    type: "ranking",
    category: "frontend",
    question: "Ordena estas tecnologías frontend según tu nivel de experiencia (1 = más experiencia)",
    instruction: "Arrastra para reordenar según tu experiencia real",
    items: ["HTML/CSS básico", "JavaScript vanilla", "React o Vue", "TypeScript", "Sass/SCSS", "Webpack/Vite"],
    reverse: false,
    explanation:
      "Esta pregunta evalúa tu nivel de experiencia con diferentes tecnologías fundamentales del desarrollo frontend.",
    examples: [
      "HTML/CSS: estructura, estilos, responsive design",
      "JavaScript: DOM manipulation, eventos, ES6+",
      "React/Vue: componentes, estado, lifecycle",
      "TypeScript: tipado estático, interfaces, generics",
      "Sass/SCSS: variables, mixins, nesting",
      "Webpack/Vite: bundling, optimización, configuración",
    ],
    alternativeFormulations: [
      "Clasifica estas herramientas frontend por tu nivel de dominio",
      "Ordena estas tecnologías desde la que mejor manejas hasta la que menos",
      "Prioriza estas tecnologías según tu experiencia práctica",
    ],
    tips: [
      "Ordena según tu experiencia real, no aspiracional",
      "Considera tanto tiempo de uso como profundidad de conocimiento",
      "Piensa en qué tecnologías usas más frecuentemente",
      "Evalúa en cuáles te sientes más confiado resolviendo problemas",
    ],
  },

  // Backend questions
  {
    id: 6,
    type: "scale",
    category: "backend",
    question: "Tengo experiencia diseñando y desarrollando APIs RESTful",
    reverse: false,
    explanation: "Esta pregunta evalúa tu experiencia en el diseño y desarrollo de APIs siguiendo los principios REST.",
    examples: [
      "Definir endpoints con métodos HTTP apropiados (GET, POST, PUT, DELETE)",
      "Estructurar respuestas JSON consistentes",
      "Implementar códigos de estado HTTP correctos",
      "Manejar autenticación y autorización",
      "Documentar APIs con herramientas como Swagger",
    ],
    alternativeFormulations: [
      "Soy competente creando servicios web que sigan estándares REST",
      "Tengo conocimiento sólido en el desarrollo de APIs web",
      "Me siento cómodo/a diseñando arquitecturas de servicios REST",
    ],
    tips: [
      "Piensa en APIs que hayas desarrollado o consumido",
      "Considera tu conocimiento de métodos HTTP y códigos de estado",
      "Reflexiona sobre tu experiencia con autenticación en APIs",
      "Evalúa tu comprensión de los principios REST",
    ],
  },
  {
    id: 7,
    type: "open",
    category: "backend",
    question: "Describe tu experiencia con bases de datos y cómo manejas la persistencia de datos",
    explanation:
      "Esta pregunta busca entender tu experiencia práctica con diferentes tipos de bases de datos y estrategias de persistencia.",
    examples: [
      "Bases de datos relacionales (MySQL, PostgreSQL, SQL Server)",
      "Bases de datos NoSQL (MongoDB, Redis, Cassandra)",
      "ORMs y query builders (Sequelize, Prisma, Mongoose)",
      "Optimización de consultas y índices",
      "Migraciones y versionado de esquemas",
    ],
    alternativeFormulations: [
      "¿Cuál es tu experiencia trabajando con sistemas de almacenamiento de datos?",
      "Cuéntame sobre tu conocimiento en gestión y persistencia de datos",
      "Describe tu competencia con diferentes tecnologías de bases de datos",
    ],
    tips: [
      "Menciona tipos específicos de bases de datos que hayas usado",
      "Incluye tanto experiencia con SQL como NoSQL",
      "Describe proyectos donde hayas diseñado esquemas de datos",
      "Explica cómo manejas la integridad y consistencia de datos",
      "Si tienes poca experiencia, menciona tu interés por aprender",
    ],
  },
  {
    id: 8,
    type: "multiple",
    category: "backend",
    question: "¿Cuál es tu lenguaje de programación backend preferido?",
    options: ["JavaScript/Node.js", "Python", "Java", "C#/.NET", "PHP", "Go/Rust", "Otro"],
    explanation: "Esta pregunta identifica tu lenguaje de programación principal para desarrollo backend.",
    examples: [
      "JavaScript/Node.js: Express, Nest.js, serverless functions",
      "Python: Django, Flask, FastAPI",
      "Java: Spring Boot, Spring Framework",
      "C#/.NET: ASP.NET Core, Entity Framework",
      "PHP: Laravel, Symfony, WordPress",
      "Go/Rust: alta performance, concurrencia",
    ],
    alternativeFormulations: [
      "¿Con qué lenguaje backend te sientes más cómodo/a?",
      "¿Cuál es tu tecnología principal para desarrollo del lado del servidor?",
      "¿En qué lenguaje tienes más experiencia para backend?",
    ],
    tips: [
      "Elige el lenguaje con el que tienes más experiencia práctica",
      "Considera tanto proyectos personales como profesionales",
      "Piensa en qué lenguaje te resulta más productivo",
      "Evalúa en cuál te sientes más confiado resolviendo problemas",
    ],
  },
  {
    id: 9,
    type: "scenario",
    category: "backend",
    question: "Tu API está recibiendo muchas solicitudes y se está volviendo lenta. ¿Cuál sería tu primer enfoque?",
    options: [
      "Implementar caché",
      "Optimizar consultas de base de datos",
      "Escalar horizontalmente",
      "Revisar y optimizar el código",
    ],
    explanation:
      "Esta pregunta evalúa tu capacidad para diagnosticar y resolver problemas de rendimiento en sistemas backend.",
    examples: [
      "Caché: Redis, Memcached, caché de aplicación",
      "Optimizar consultas: índices, query optimization, N+1 problems",
      "Escalar: load balancers, múltiples instancias, microservicios",
      "Optimizar código: profiling, algoritmos más eficientes, async/await",
    ],
    alternativeFormulations: [
      "¿Cómo abordarías un problema de rendimiento en tu API?",
      "¿Cuál sería tu estrategia inicial para mejorar la velocidad de respuesta?",
      "Ante una API lenta, ¿por dónde empezarías a optimizar?",
    ],
    tips: [
      "Piensa en tu experiencia previa con problemas de rendimiento",
      "Considera qué solución suele tener mayor impacto",
      "Reflexiona sobre qué es más fácil de implementar primero",
      "Evalúa qué enfoque conoces mejor",
    ],
  },
  {
    id: 10,
    type: "checkbox",
    category: "backend",
    question: "¿Con cuáles de estas tecnologías backend tienes experiencia? (Selecciona todas las que apliquen)",
    instruction: "Marca solo las que hayas usado en proyectos reales",
    options: [
      "Docker y contenedores",
      "Servicios en la nube (AWS, Azure, GCP)",
      "Microservicios",
      "Message queues (RabbitMQ, Kafka)",
      "Testing automatizado",
      "CI/CD pipelines",
    ],
    reverse: false,
    explanation: "Esta pregunta evalúa tu experiencia con tecnologías y prácticas modernas de desarrollo backend.",
    examples: [
      "Docker: containerización, Docker Compose, Kubernetes",
      "Cloud: EC2, Lambda, Azure Functions, Google Cloud Run",
      "Microservicios: arquitectura distribuida, comunicación entre servicios",
      "Message queues: procesamiento asíncrono, event-driven architecture",
      "Testing: unit tests, integration tests, TDD",
      "CI/CD: GitHub Actions, Jenkins, automated deployment",
    ],
    alternativeFormulations: [
      "¿Qué herramientas y prácticas backend has utilizado en proyectos?",
      "Marca las tecnologías backend con las que tienes experiencia práctica",
      "¿Con cuáles de estas tecnologías modernas has trabajado?",
    ],
    tips: [
      "Selecciona solo las que hayas usado realmente",
      "No marques tecnologías que solo hayas leído sobre ellas",
      "Considera tanto experiencia profesional como proyectos personales",
      "Piensa en qué tan cómodo/a te sientes usando cada tecnología",
    ],
  },

  // Database questions
  {
    id: 11,
    type: "scale",
    category: "database",
    question: "Me siento competente escribiendo consultas SQL complejas",
    reverse: false,
    explanation: "Esta pregunta evalúa tu nivel de confianza y habilidad con consultas SQL avanzadas.",
    examples: [
      "JOINs múltiples entre varias tablas",
      "Subconsultas y CTEs (Common Table Expressions)",
      "Funciones de ventana (window functions)",
      "Consultas de agregación complejas con GROUP BY y HAVING",
      "Optimización de consultas para mejor rendimiento",
    ],
    alternativeFormulations: [
      "Tengo habilidades sólidas para crear consultas SQL avanzadas",
      "Me siento cómodo/a trabajando con SQL complejo",
      "Soy capaz de escribir consultas SQL sofisticadas",
    ],
    tips: [
      "Piensa en las consultas más complejas que hayas escrito",
      "Considera tu experiencia con JOINs y subconsultas",
      "Reflexiona sobre tu capacidad para optimizar consultas",
      "Evalúa qué tan cómodo/a te sientes con diferentes tipos de consultas",
    ],
  },
  {
    id: 12,
    type: "binary",
    category: "database",
    question: "¿Prefieres trabajar con bases de datos relacionales (SQL) o no relacionales (NoSQL)?",
    instruction: "Elige según tu experiencia y preferencia",
    options: ["Bases de datos relacionales (SQL)", "Bases de datos no relacionales (NoSQL)"],
    reverse: false,
    explanation:
      "Esta pregunta identifica tu preferencia y experiencia entre los dos paradigmas principales de bases de datos.",
    examples: [
      "SQL: MySQL, PostgreSQL, SQL Server - estructura rígida, ACID, relaciones",
      "NoSQL: MongoDB, Redis, Cassandra - flexibilidad, escalabilidad, documentos/key-value",
    ],
    alternativeFormulations: [
      "¿Con qué tipo de base de datos te sientes más cómodo/a?",
      "¿Cuál es tu preferencia entre SQL y NoSQL?",
      "¿Qué paradigma de base de datos prefieres usar?",
    ],
    tips: [
      "Considera con cuál tienes más experiencia práctica",
      "Piensa en qué tipo de proyectos has desarrollado",
      "Reflexiona sobre cuál te resulta más intuitivo",
      "Evalúa en cuál te sientes más productivo/a",
    ],
  },
  {
    id: 13,
    type: "slider",
    category: "database",
    question: "¿Qué tan cómodo/a te sientes diseñando esquemas de base de datos? (0-100)",
    instruction: "Desliza para indicar tu nivel de comodidad",
    min: 0,
    max: 100,
    step: 5,
    reverse: false,
    explanation: "Esta pregunta evalúa tu confianza en el diseño de estructuras de datos y relaciones entre tablas.",
    examples: [
      "0-25: Principiante, necesito mucha ayuda",
      "26-50: Básico, puedo hacer esquemas simples",
      "51-75: Intermedio, manejo relaciones y normalization",
      "76-100: Avanzado, diseño esquemas complejos y optimizados",
    ],
    alternativeFormulations: [
      "¿Cuál es tu nivel de competencia en diseño de bases de datos?",
      "¿Qué tan seguro/a te sientes creando estructuras de datos?",
      "En una escala de 0 a 100, ¿cuál es tu habilidad para diseñar esquemas?",
    ],
    tips: [
      "Considera tu experiencia diseñando desde cero",
      "Piensa en tu conocimiento de normalización",
      "Reflexiona sobre tu capacidad para optimizar estructuras",
      "Evalúa qué tan cómodo/a te sientes con relaciones complejas",
    ],
  },

  // Mobile questions
  {
    id: 14,
    type: "multiple",
    category: "mobile",
    question: "¿Cuál es tu enfoque preferido para desarrollo móvil?",
    options: ["Nativo (iOS/Android)", "React Native", "Flutter", "Híbrido (Cordova/Ionic)", "No tengo experiencia"],
    explanation: "Esta pregunta identifica tu experiencia y preferencia en diferentes enfoques de desarrollo móvil.",
    examples: [
      "Nativo: Swift/Objective-C para iOS, Java/Kotlin para Android",
      "React Native: JavaScript, componentes nativos, código compartido",
      "Flutter: Dart, widgets, rendimiento nativo",
      "Híbrido: HTML/CSS/JS en webview, plugins nativos",
      "Sin experiencia: interés en aprender desarrollo móvil",
    ],
    alternativeFormulations: [
      "¿Qué tecnología prefieres para crear aplicaciones móviles?",
      "¿Cuál es tu stack tecnológico favorito para mobile?",
      "¿Con qué herramientas desarrollas aplicaciones móviles?",
    ],
    tips: [
      "Elige según tu experiencia real, no aspiraciones",
      "Considera qué enfoque has usado en proyectos",
      "Piensa en qué tecnología te resulta más productiva",
      "Si no tienes experiencia, está bien seleccionar esa opción",
    ],
  },
  {
    id: 15,
    type: "open",
    category: "mobile",
    question: "Describe un desafío técnico que hayas enfrentado en desarrollo móvil y cómo lo resolviste",
    explanation: "Esta pregunta evalúa tu experiencia práctica resolviendo problemas específicos del desarrollo móvil.",
    examples: [
      "Optimización de rendimiento en dispositivos de gama baja",
      "Manejo de diferentes tamaños de pantalla y orientaciones",
      "Integración con APIs nativas del dispositivo",
      "Gestión de estado en aplicaciones complejas",
      "Problemas de compatibilidad entre versiones de OS",
    ],
    alternativeFormulations: [
      "¿Puedes describir un problema técnico móvil que hayas solucionado?",
      "Cuéntame sobre una dificultad en desarrollo móvil que hayas superado",
      "¿Qué obstáculo técnico móvil recuerdas haber resuelto?",
    ],
    tips: [
      "Describe un problema específico y concreto",
      "Explica tanto el problema como tu solución",
      "Incluye qué aprendiste de la experiencia",
      "Si no tienes experiencia móvil, puedes mencionar tu interés por aprender",
      "Menciona herramientas o recursos que usaste",
    ],
  },

  // Design questions
  {
    id: 16,
    type: "scale",
    category: "design",
    question: "Tengo buen ojo para el diseño y la experiencia de usuario",
    reverse: false,
    explanation: "Esta pregunta evalúa tu autopercepción sobre tus habilidades de diseño y comprensión de UX/UI.",
    examples: [
      "Crear interfaces visualmente atractivas y coherentes",
      "Entender principios de diseño como jerarquía visual y espaciado",
      "Considerar la usabilidad y experiencia del usuario",
      "Trabajar con sistemas de diseño y guías de estilo",
      "Colaborar efectivamente con diseñadores",
    ],
    alternativeFormulations: [
      "Me considero competente en aspectos de diseño y usabilidad",
      "Tengo habilidades sólidas para crear interfaces atractivas",
      "Soy capaz de desarrollar experiencias de usuario efectivas",
    ],
    tips: [
      "Piensa en feedback que hayas recibido sobre tus interfaces",
      "Considera si otros han elogiado tus habilidades de diseño",
      "Reflexiona sobre tu atención a detalles visuales",
      "Evalúa qué tan natural te resulta pensar en la experiencia del usuario",
    ],
  },
  {
    id: 17,
    type: "ranking",
    category: "design",
    question: "Ordena estos aspectos de diseño según tu nivel de interés/habilidad",
    instruction: "1 = mayor interés/habilidad, 5 = menor",
    items: [
      "Diseño visual y estética",
      "Experiencia de usuario (UX)",
      "Prototipado y wireframing",
      "Sistemas de diseño",
      "Accesibilidad web",
    ],
    reverse: false,
    explanation: "Esta pregunta identifica tus áreas de mayor interés y competencia dentro del diseño digital.",
    examples: [
      "Visual: colores, tipografía, composición, branding",
      "UX: research, user journeys, usability testing",
      "Prototipado: Figma, Sketch, wireframes, mockups",
      "Sistemas: design tokens, componentes reutilizables, guías de estilo",
      "Accesibilidad: WCAG, screen readers, inclusive design",
    ],
    alternativeFormulations: [
      "Prioriza estas áreas de diseño según tu competencia",
      "Ordena estos aspectos de diseño por tu nivel de dominio",
      "Clasifica estas disciplinas de diseño según tu experiencia",
    ],
    tips: [
      "Ordena según tu experiencia e interés real",
      "Considera en qué áreas has trabajado más",
      "Piensa en qué aspectos disfrutas más",
      "Evalúa dónde sientes que tienes más habilidad natural",
    ],
  },

  // Security questions
  {
    id: 18,
    type: "checkbox",
    category: "security",
    question: "¿Con cuáles de estos conceptos de seguridad tienes experiencia? (Selecciona todas las que apliquen)",
    instruction: "Marca solo las que hayas implementado o trabajado",
    options: [
      "Autenticación y autorización",
      "Encriptación de datos",
      "Validación y sanitización de inputs",
      "HTTPS y certificados SSL",
      "Prevención de ataques (XSS, CSRF, SQL injection)",
      "Auditorías de seguridad",
    ],
    reverse: false,
    explanation: "Esta pregunta evalúa tu experiencia con diferentes aspectos de la seguridad en desarrollo web.",
    examples: [
      "Auth: JWT, OAuth, session management, role-based access",
      "Encriptación: hashing passwords, data encryption, secure storage",
      "Validación: input sanitization, data validation, parameter checking",
      "HTTPS: SSL certificates, secure connections, HSTS",
      "Prevención: XSS protection, CSRF tokens, prepared statements",
      "Auditorías: security testing, vulnerability assessment, code review",
    ],
    alternativeFormulations: [
      "¿Qué prácticas de seguridad has implementado en tus proyectos?",
      "Marca los aspectos de seguridad con los que tienes experiencia",
      "¿Con cuáles de estas medidas de seguridad has trabajado?",
    ],
    tips: [
      "Selecciona solo las que hayas implementado realmente",
      "Considera tanto conocimiento teórico como práctica",
      "Piensa en medidas de seguridad que hayas aplicado en proyectos",
      "No marques conceptos que solo hayas leído sobre ellos",
    ],
  },
  {
    id: 19,
    type: "scenario",
    category: "security",
    question: "Descubres una vulnerabilidad de seguridad en tu aplicación en producción. ¿Cuál es tu primera acción?",
    options: [
      "Parchear inmediatamente y desplegar",
      "Evaluar el impacto y crear un plan",
      "Notificar al equipo y stakeholders",
      "Documentar la vulnerabilidad primero",
    ],
    explanation:
      "Esta pregunta evalúa tu comprensión de los procedimientos apropiados para manejar incidentes de seguridad.",
    examples: [
      "Parchear: fix rápido, hotfix, deployment urgente",
      "Evaluar: análisis de riesgo, impacto assessment, priorización",
      "Notificar: comunicación a equipo, escalation, incident response",
      "Documentar: registro del incidente, post-mortem, lessons learned",
    ],
    alternativeFormulations: [
      "¿Cómo manejarías un incidente de seguridad crítico?",
      "¿Cuál sería tu respuesta inmediata ante una vulnerabilidad en producción?",
      "¿Qué harías primero al descubrir un problema de seguridad grave?",
    ],
    tips: [
      "Piensa en el balance entre velocidad y precaución",
      "Considera la importancia de la comunicación",
      "Reflexiona sobre procedimientos de incident response",
      "Evalúa qué acción tendría mayor impacto positivo",
    ],
  },
  {
    id: 20,
    type: "open",
    category: "security",
    question: "¿Cómo implementas la seguridad en tus aplicaciones web desde el desarrollo?",
    explanation:
      "Esta pregunta busca entender tu enfoque proactivo hacia la seguridad durante el proceso de desarrollo.",
    examples: [
      "Secure coding practices desde el inicio",
      "Validación de inputs en frontend y backend",
      "Implementación de autenticación robusta",
      "Uso de HTTPS y headers de seguridad",
      "Testing de seguridad automatizado",
      "Code reviews enfocados en seguridad",
    ],
    alternativeFormulations: [
      "Describe tu estrategia para desarrollar aplicaciones seguras",
      "¿Qué medidas de seguridad integras en tu proceso de desarrollo?",
      "¿Cómo aseguras que tus aplicaciones sean seguras desde el código?",
    ],
    tips: [
      "Describe prácticas específicas que implementes",
      "Menciona herramientas de seguridad que uses",
      "Incluye tanto medidas preventivas como reactivas",
      "Explica cómo integras seguridad en tu workflow",
      "Si tienes poca experiencia, menciona tu interés por aprender",
    ],
  },
]

// Enhanced Speech Recognition Hook
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        setIsSupported(true)
      } else {
        setIsSupported(false)
        setError("Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.")
      }
    }

    return () => {
      clearAllTimers()
    }
  }, [])

  const clearAllTimers = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
      initTimeoutRef.current = null
    }
  }

  const startSilenceTimer = () => {
    clearAllTimers()

    console.log("Iniciando timer de silencio de 3 segundos...")
    silenceTimerRef.current = setTimeout(() => {
      console.log("3 segundos de silencio completados, deteniendo reconocimiento")
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }
    }, 3000) // 3 segundos de silencio
  }

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      console.log("Reseteando timer de silencio...")
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }

  const startListening = useCallback(() => {
    if (!isSupported || isListening || isInitializing) return

    try {
      setIsInitializing(true)
      setError(null)
      console.log("Iniciando reconocimiento de voz...")

      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      // Enhanced configuration for Spanish
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "es-ES" // Primary Spanish
      recognition.maxAlternatives = 3 // More alternatives for better accuracy

      let hasReceivedFinalResult = false
      let lastSpeechTime = Date.now()

      // Handle start
      recognition.onstart = () => {
        console.log("Reconocimiento de voz iniciado exitosamente")
        setIsListening(true)
        setIsInitializing(false)
        setError(null)
        hasReceivedFinalResult = false
        lastSpeechTime = Date.now()

        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current)
          initTimeoutRef.current = null
        }
      }

      // Handle speech start (user started speaking)
      recognition.onspeechstart = () => {
        console.log("Detectado inicio de habla del usuario")
        resetSilenceTimer()
        setError(null)
        lastSpeechTime = Date.now()
      }

      // Handle speech end (user stopped speaking)
      recognition.onspeechend = () => {
        console.log("Detectado fin de habla del usuario, iniciando timer de silencio")
        lastSpeechTime = Date.now()
        startSilenceTimer()
      }

      // Handle sound start (any sound detected)
      recognition.onsoundstart = () => {
        console.log("Detectado sonido")
        resetSilenceTimer()
        lastSpeechTime = Date.now()
      }

      // Handle sound end (no sound detected)
      recognition.onsoundend = () => {
        console.log("Fin de sonido detectado")
        // Solo iniciar timer si ha pasado tiempo suficiente desde la última actividad
        const timeSinceLastSpeech = Date.now() - lastSpeechTime
        if (timeSinceLastSpeech > 500) {
          // 500ms of buffer
          startSilenceTimer()
        }
      }

      // Handle results with enhanced processing
      recognition.onresult = (event: any) => {
        console.log("Resultado de reconocimiento recibido:", event)
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript

          if (result.isFinal) {
            finalTranscript += transcript
            hasReceivedFinalResult = true
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          console.log("Transcripción final recibida:", finalTranscript)
          setTranscript((prev) => {
            const newTranscript = prev + finalTranscript + " "
            console.log("Transcripción total actualizada:", newTranscript)
            return newTranscript
          })
          setInterimTranscript("")
          resetSilenceTimer()
          setError(null) // Clear any previous errors
          lastSpeechTime = Date.now()
        } else {
          console.log("Transcripción temporal:", interimTranscript)
          setInterimTranscript(interimTranscript)
          lastSpeechTime = Date.now()
        }
      }

      // Enhanced error handling
      recognition.onerror = (event: any) => {
        console.error("Error en reconocimiento de voz:", event.error, event)

        // No mostrar errores si ya tenemos resultados válidos
        if (hasReceivedFinalResult && (event.error === "no-speech" || event.error === "aborted")) {
          console.log("Error menor ignorado, ya tenemos resultados")
          return
        }

        setIsListening(false)
        setIsInitializing(false)

        switch (event.error) {
          case "no-speech":
            if (!hasReceivedFinalResult) {
              setError("No se detectó voz. Intenta hablar más cerca del micrófono.")
            }
            break
          case "audio-capture":
            setError("No se pudo acceder al micrófono. Verifica los permisos.")
            break
          case "not-allowed":
            setError("Permiso de micrófono denegado. Habilita el micrófono en tu navegador.")
            break
          case "network":
            setError("Error de conexión. Verifica tu conexión a internet.")
            break
          case "language-not-supported":
            setError("Idioma español no soportado en este navegador.")
            break
          case "aborted":
            // Error normal cuando se detiene manualmente
            console.log("Reconocimiento detenido manualmente")
            break
          default:
            setError(`Error de reconocimiento: ${event.error}`)
        }
      }

      // Handle end
      recognition.onend = () => {
        console.log("Reconocimiento de voz terminado")
        setIsListening(false)
        setInterimTranscript("")
        setIsInitializing(false)
        clearAllTimers()
      }

      recognitionRef.current = recognition
      recognition.start()

      // Timeout de inicialización más generoso
      initTimeoutRef.current = setTimeout(() => {
        if (isInitializing) {
          console.log("Timeout de inicialización alcanzado")
          recognition.stop()
          setError("No se pudo inicializar el reconocimiento de voz. Intenta nuevamente.")
          setIsInitializing(false)
        }
      }, 10000) // 10 segundos para inicializar
    } catch (error) {
      console.error("Error al iniciar reconocimiento de voz:", error)
      setError("Error al inicializar el reconocimiento de voz. Intenta nuevamente.")
      setIsInitializing(false)
    }
  }, [isListening, isInitializing, isSupported])

  const stopListening = useCallback(() => {
    console.log("Deteniendo reconocimiento de voz manualmente...")
    if (recognitionRef.current && (isListening || isInitializing)) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    clearAllTimers()
    setIsListening(false)
    setIsInitializing(false)
    setInterimTranscript("")
  }, [isListening, isInitializing])

  const clearTranscript = useCallback(() => {
    console.log("Limpiando transcripción...")
    setTranscript("")
    setInterimTranscript("")
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    isInitializing,
    startListening,
    stopListening,
    clearTranscript,
  }
}

interface RankingComponentProps {
  items: string[]
  value: string[]
  onChange: (newOrder: string[]) => void
  category: keyof typeof SKILL_CATEGORIES
}

const RankingComponent: FC<RankingComponentProps> = ({ items, value, onChange, category }) => {
  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...value]
    const [movedItem] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, movedItem)
    onChange(newOrder)
  }

  const categoryConfig = SKILL_CATEGORIES[category]
  const CategoryIcon = categoryConfig.icon

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <CategoryIcon className="w-4 h-4" />
        <span>Arrastra los elementos o usa las flechas para reordenar según tu experiencia</span>
      </div>

      {value.map((item, index) => (
        <div
          key={item}
          className={`flex items-center gap-4 p-4 bg-gradient-to-r from-${category === "frontend" ? "blue" : category === "backend" ? "green" : category === "database" ? "purple" : category === "mobile" ? "orange" : category === "design" ? "pink" : "red"}-50 to-gray-50 rounded-lg border border-${category === "frontend" ? "blue" : category === "backend" ? "green" : category === "database" ? "purple" : category === "mobile" ? "orange" : category === "design" ? "pink" : "red"}-200 hover:shadow-md transition-all`}
        >
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-white/50"
              onClick={() => index > 0 && moveItem(index, index - 1)}
              disabled={index === 0}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-white/50"
              onClick={() => index < value.length - 1 && moveItem(index, index + 1)}
              disabled={index === value.length - 1}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          <div
            className={`w-10 h-10 ${categoryConfig.color} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}
          >
            {index + 1}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900">{item}</p>
            <p className="text-sm text-gray-600">
              {index === 0 && "🥇 Mayor experiencia"}
              {index === 1 && "🥈 Segunda mayor experiencia"}
              {index === 2 && "🥉 Tercera mayor experiencia"}
              {index > 2 && `#${index + 1} en tu ranking`}
            </p>
          </div>

          <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      ))}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <Target className="w-4 h-4" />
          <span className="font-medium">Consejo:</span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Ordena según tu experiencia real y nivel de comodidad con cada tecnología.
        </p>
      </div>
    </div>
  )
}

export default function TechnicalSkillsTestPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isCompleting, setIsCompleting] = useState(false)
  const [rankingItems, setRankingItems] = useState<{ [key: number]: string[] }>({})
  const [inputMode, setInputMode] = useState<InputMode>("mixed")
  const [showModeSelection, setShowModeSelection] = useState(true)

  // Help system states
  const [showHelpDialog, setShowHelpDialog] = useState(false)
  const [showContextualHelp, setShowContextualHelp] = useState(false)
  const [currentFormulation, setCurrentFormulation] = useState<{ [key: number]: number }>({})
  const [hasUsedHelp, setHasUsedHelp] = useState<{ [key: number]: boolean }>({})
  const [hasReformulated, setHasReformulated] = useState<{ [key: number]: boolean }>({})

  // Speech recognition
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error: speechError,
    isInitializing,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition()

  const question = TECHNICAL_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / TECHNICAL_QUESTIONS.length) * 100
  const isAnswered = answers[question?.id] !== undefined

  // Initialize ranking items when question changes
  useEffect(() => {
    if (question?.type === "ranking" && question.items && !rankingItems[question.id]) {
      setRankingItems((prev) => ({
        ...prev,
        [question.id]: [...question.items!],
      }))
    }
  }, [question, rankingItems])

  // Update text answer when transcript changes
  useEffect(() => {
    if (transcript && (question?.type === "open" || question?.type === "code")) {
      handleAnswerChange(transcript.trim())
    }
  }, [transcript, question?.type])

  // Auto-start voice recognition for voice-complete mode
  useEffect(() => {
    if (
      inputMode === "voice-complete" &&
      (question?.type === "open" || question?.type === "code") &&
      isSupported &&
      !isListening &&
      !isInitializing
    ) {
      // Auto-start voice recognition after a short delay
      const timer = setTimeout(() => {
        startListening()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentQuestion, inputMode, isSupported, isListening, isInitializing, startListening, question?.type])

  // Get current question text (original or reformulated)
  const getCurrentQuestionText = () => {
    const formIndex = currentFormulation[question?.id] || 0
    if (formIndex > 0 && question?.alternativeFormulations && question.alternativeFormulations[formIndex - 1]) {
      return question.alternativeFormulations[formIndex - 1]
    }
    return question?.question || ""
  }

  // Handle question reformulation
  const handleReformulate = () => {
    const maxFormulations = (question?.alternativeFormulations?.length || 0) + 1
    const currentIndex = currentFormulation[question?.id] || 0
    const nextIndex = (currentIndex + 1) % maxFormulations

    setCurrentFormulation((prev) => ({
      ...prev,
      [question.id]: nextIndex,
    }))

    setHasReformulated((prev) => ({
      ...prev,
      [question.id]: true,
    }))
  }

  // Handle help usage
  const handleHelpUsed = () => {
    setHasUsedHelp((prev) => ({
      ...prev,
      [question.id]: true,
    }))
  }

  // Get question type icon
  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case "scale":
        return BarChart3
      case "open":
        return MessageSquare
      case "multiple":
        return List
      case "scenario":
        return Users
      case "ranking":
        return TrendingUp
      case "checkbox":
        return CheckSquare
      case "slider":
        return SliderIcon
      case "binary":
        return ToggleLeft
      case "code":
        return Code
      default:
        return Code
    }
  }

  // Get question type label
  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case "scale":
        return "Escala de Competencia"
      case "open":
        return "Respuesta Abierta"
      case "multiple":
        return "Selección Múltiple"
      case "scenario":
        return "Escenario Técnico"
      case "ranking":
        return "Ordenar por Experiencia"
      case "checkbox":
        return "Selección Múltiple"
      case "slider":
        return "Deslizador"
      case "binary":
        return "Elección Binaria"
      case "code":
        return "Análisis de Código"
      default:
        return ""
    }
  }

  // Handle answer change
  const handleAnswerChange = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }))
  }

  // Handle speech input for open questions
  const handleSpeechInput = () => {
    if (isListening || isInitializing) {
      stopListening()
    } else {
      startListening()
    }
  }

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < TECHNICAL_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      // Clear speech recognition when moving to next question
      if (isListening) {
        stopListening()
      }
      clearTranscript()
    } else {
      handleComplete()
    }
  }

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      // Clear speech recognition when moving to previous question
      if (isListening) {
        stopListening()
      }
      clearTranscript()
    }
  }

  // Complete assessment
  const handleComplete = async () => {
    setIsCompleting(true)

    // Stop any ongoing speech recognition
    if (isListening) {
      stopListening()
    }

    // Calculate technical skill scores
    const scores = calculateTechnicalScores(answers)

    // Save results to localStorage (in a real app, save to database)
    localStorage.setItem(
      "technicalSkillsResults",
      JSON.stringify({
        scores,
        answers,
        completedAt: new Date().toISOString(),
        type: "technical-skills",
        inputMode,
        helpUsage: {
          questionsWithHelp: Object.keys(hasUsedHelp).length,
          questionsReformulated: Object.keys(hasReformulated).length,
          totalQuestions: TECHNICAL_QUESTIONS.length,
        },
      }),
    )

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    router.push("/technical-skills-results")
  }

  const handleStartTest = (mode: InputMode) => {
    setInputMode(mode)
    setShowModeSelection(false)
  }

  // Calculate technical skill scores
  const calculateTechnicalScores = (answers: Record<number, any>) => {
    const categoryScores: Record<string, number[]> = {
      frontend: [],
      backend: [],
      database: [],
      mobile: [],
      design: [],
      security: [],
    }

    TECHNICAL_QUESTIONS.forEach((q) => {
      const answer = answers[q.id]
      if (answer === undefined) return

      let score = 0

      switch (q.type) {
        case "scale":
          score = typeof answer === "number" ? answer : 3
          if (q.reverse) score = 6 - score
          break

        case "ranking":
          // Para ranking, calculamos el score basado en las posiciones
          const items = answer as string[]
          const originalItems = q.items || []

          // Calculamos un score basado en qué tan "positivo" es el ranking
          let rankingScore = 0
          items.forEach((item, position) => {
            const originalIndex = originalItems.indexOf(item)
            // Items más "positivos" en posiciones altas dan más puntos
            const positionScore = (items.length - position) / items.length
            rankingScore += positionScore
          })
          score = (rankingScore / items.length) * 5 + 1 // Normalizar a escala 1-6
          break

        case "checkbox":
          // Para checkbox, contamos cuántas opciones se seleccionaron
          const selectedOptions = answer as string[]
          const totalOptions = q.options?.length || 1
          score = (selectedOptions.length / totalOptions) * 5 + 1
          break

        case "slider":
          // Para slider, normalizamos el valor a escala 1-6
          const sliderValue = answer as number
          const min = q.min || 0
          const max = q.max || 100
          score = ((sliderValue - min) / (max - min)) * 5 + 1
          break

        case "binary":
          // Para binary, asignamos 1 o 6 según la opción
          const binaryAnswer = answer as string
          const isPositiveAnswer = q.options && binaryAnswer === q.options[1]
          score = isPositiveAnswer ? 6 : 1
          break

        case "multiple":
        case "scenario":
          // Para multiple choice, asignamos scores basados en la posición
          const selectedIndex = q.options?.indexOf(answer as string) || 0
          const optionCount = q.options?.length || 1
          score = ((selectedIndex + 1) / optionCount) * 5 + 1
          break

        case "open":
        case "code":
          // Para respuestas abiertas y código, asignamos un score basado en la longitud y contenido
          const textAnswer = answer as string
          if (textAnswer && textAnswer.length > 50) {
            score = 4.5 // Score alto por respuesta detallada
          } else if (textAnswer && textAnswer.length > 20) {
            score = 3.5 // Score medio por respuesta básica
          } else {
            score = 2.5 // Score bajo por respuesta muy corta
          }
          break
      }

      categoryScores[q.category].push(score)
    })

    // Calculate average scores for each category
    const finalScores: Record<string, number> = {}
    Object.entries(categoryScores).forEach(([category, scores]) => {
      if (scores.length > 0) {
        finalScores[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length
      } else {
        finalScores[category] = 3 // Default neutral score
      }
    })

    return finalScores
  }

  // Mode Selection Screen
  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test de Habilidades Técnicas</h1>
            <p className="text-xl text-gray-600 mb-8">
              Elige cómo prefieres responder las preguntas abiertas y de código
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Mixed Mode */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  Modo Mixto
                </CardTitle>
                <CardDescription>Puedes elegir entre voz y escritura para cada pregunta técnica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Flexibilidad total para cada pregunta
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Ideal para explicaciones técnicas complejas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Combina voz para ideas y escritura para código
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Control completo sobre el método de entrada
                  </div>
                </div>
                <Button onClick={() => handleStartTest("mixed")} className="w-full" variant="outline">
                  <Keyboard className="w-4 h-4 mr-2" />
                  Elegir Modo Mixto
                </Button>
              </CardContent>
            </Card>

            {/* Voice Complete Mode */}
            <Card
              className={`cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300 ${!isSupported ? "opacity-50" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-green-600" />
                  </div>
                  Hablado Completo
                </CardTitle>
                <CardDescription>
                  Todas las preguntas técnicas abiertas se responden automáticamente por voz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Reconocimiento de voz automático
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Perfecto para explicar conceptos técnicos
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Evaluación más natural y conversacional
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Detección automática de silencio (3 seg)
                  </div>
                </div>
                <Button onClick={() => handleStartTest("voice-complete")} className="w-full" disabled={!isSupported}>
                  <Mic className="w-4 h-4 mr-2" />
                  Elegir Hablado Completo
                </Button>
                {!isSupported && (
                  <p className="text-xs text-amber-600 text-center">
                    Reconocimiento de voz no disponible en este navegador
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information about speech recognition */}
          {isSupported && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-green-600" />
                  Información sobre Reconocimiento de Voz Técnico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold mb-2">Características:</h4>
                    <ul className="space-y-1">
                      <li>• Optimizado para terminología técnica</li>
                      <li>• Detección automática de silencio</li>
                      <li>• Transcripción en tiempo real</li>
                      <li>• Se detiene tras 3 segundos sin habla</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ideal para:</h4>
                    <ul className="space-y-1">
                      <li>• Explicar arquitecturas de software</li>
                      <li>• Describir experiencias con tecnologías</li>
                      <li>• Analizar código y optimizaciones</li>
                      <li>• Compartir desafíos técnicos resueltos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Puedes cambiar el modo más tarde si es necesario</p>
            <Button variant="ghost" onClick={() => router.back()}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render question based on type
  const renderQuestion = () => {
    const categoryConfig = SKILL_CATEGORIES[question.category]
    const TypeIcon = getQuestionTypeIcon(question.type)

    switch (question.type) {
      case "scale":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium mb-6">{getCurrentQuestionText()}</p>
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(Number.parseInt(value))}
                className="flex justify-center space-x-4"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center space-y-2">
                    <RadioGroupItem value={value.toString()} id={`scale-${value}`} />
                    <Label htmlFor={`scale-${value}`} className="text-sm">
                      {value === 1 && "Principiante"}
                      {value === 2 && "Básico"}
                      {value === 3 && "Intermedio"}
                      {value === 4 && "Avanzado"}
                      {value === 5 && "Experto"}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )

      case "open":
      case "code":
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium">{getCurrentQuestionText()}</p>

            {question.code && (
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{question.language || "javascript"}</span>
                  <Code className="w-4 h-4 text-gray-400" />
                </div>
                <pre className="text-sm">
                  <code>{question.code}</code>
                </pre>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder={
                    inputMode === "voice-complete"
                      ? "El reconocimiento de voz se iniciará automáticamente..."
                      : question.type === "code"
                        ? "Explica tu análisis y optimizaciones aquí..."
                        : "Describe tu experiencia técnica aquí..."
                  }
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="min-h-[120px] pr-12"
                  disabled={inputMode === "voice-complete" && isListening}
                />
                {isSupported && (
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {inputMode === "mixed" && (
                      <Button
                        type="button"
                        variant={isListening ? "destructive" : "outline"}
                        size="sm"
                        onClick={handleSpeechInput}
                        disabled={isInitializing}
                        className="w-10 h-10 p-0"
                      >
                        {isInitializing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isListening ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Speech recognition feedback */}
              {isSupported && (
                <div className="space-y-2">
                  {inputMode === "voice-complete" && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        {isListening ? "Escuchando..." : "Modo hablado completo activo"}
                      </div>
                      {isListening && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={stopListening}
                          className="flex items-center gap-2"
                        >
                          <MicOff className="w-4 h-4" />
                          Detener
                        </Button>
                      )}
                    </div>
                  )}

                  {inputMode === "mixed" && isListening && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Escuchando... Habla ahora</span>
                      {transcript && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearTranscript}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Limpiar
                        </Button>
                      )}
                    </div>
                  )}

                  {interimTranscript && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Procesando:</span> {interimTranscript}
                      </p>
                    </div>
                  )}

                  {speechError && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{speechError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Speech Recognition Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">💡 Consejos para respuestas técnicas por voz:</div>
                      <ul className="text-xs space-y-1 text-blue-700">
                        <li>• Usa terminología técnica específica</li>
                        <li>• Explica paso a paso tu razonamiento</li>
                        <li>• Menciona tecnologías y herramientas concretas</li>
                        <li>
                          •{" "}
                          {inputMode === "voice-complete"
                            ? "El reconocimiento se inicia automáticamente"
                            : "Puedes combinar voz y escritura"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "multiple":
      case "scenario":
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium">{getCurrentQuestionText()}</p>
            <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswerChange} className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "ranking":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-medium mb-2">{getCurrentQuestionText()}</p>
              {question.instruction && <p className="text-sm text-muted-foreground">{question.instruction}</p>}
            </div>
            <RankingComponent
              items={question.items || []}
              value={rankingItems[question.id] || question.items || []}
              onChange={(newOrder) => {
                setRankingItems((prev) => ({
                  ...prev,
                  [question.id]: newOrder,
                }))
                handleAnswerChange(newOrder)
              }}
              category={question.category}
            />
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-medium mb-2">{getCurrentQuestionText()}</p>
              {question.instruction && <p className="text-sm text-muted-foreground">{question.instruction}</p>}
            </div>
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={`checkbox-${index}`}
                    checked={((answers[question.id] as string[]) || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentAnswers = (answers[question.id] as string[]) || []
                      if (checked) {
                        handleAnswerChange([...currentAnswers, option])
                      } else {
                        handleAnswerChange(currentAnswers.filter((item) => item !== option))
                      }
                    }}
                  />
                  <Label htmlFor={`checkbox-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      case "slider":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-medium mb-2">{getCurrentQuestionText()}</p>
              {question.instruction && <p className="text-sm text-muted-foreground">{question.instruction}</p>}
            </div>
            <div className="space-y-4">
              <Slider
                value={[answers[question.id] || question.min || 0]}
                onValueChange={(value) => handleAnswerChange(value[0])}
                min={question.min || 0}
                max={question.max || 100}
                step={question.step || 1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{question.min || 0}</span>
                <span className="font-medium text-lg text-primary">{answers[question.id] || question.min || 0}</span>
                <span>{question.max || 100}</span>
              </div>
            </div>
          </div>
        )

      case "binary":
        return (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-medium mb-2">{getCurrentQuestionText()}</p>
              {question.instruction && <p className="text-sm text-muted-foreground">{question.instruction}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[question.id] === option ? "default" : "outline"}
                  className="h-auto p-6 text-left justify-start"
                  onClick={() => handleAnswerChange(option)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        answers[question.id] === option ? "bg-primary border-primary" : "border-muted-foreground"
                      }`}
                    >
                      {answers[question.id] === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Tipo de pregunta no soportado</div>
    }
  }

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
                <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <Code className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Analizando tus habilidades técnicas...</h3>
              <p className="text-muted-foreground">Procesando tus respuestas y generando tu perfil de competencias</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 ${SKILL_CATEGORIES[question.category].color} text-white rounded-full flex items-center justify-center shadow-lg`}
              >
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Test de Habilidades Técnicas</h1>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">Evaluación de Competencias Técnicas</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {inputMode === "voice-complete" ? (
                      <>
                        <Volume2 className="w-3 h-3 mr-1" />
                        Hablado Completo
                      </>
                    ) : (
                      <>
                        <Settings className="w-3 h-3 mr-1" />
                        Modo Mixto
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {currentQuestion + 1} de {TECHNICAL_QUESTIONS.length}
            </Badge>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progreso del test</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Card */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${SKILL_CATEGORIES[question.category].color} text-white rounded-full flex items-center justify-center`}
                    >
                      {React.createElement(getQuestionTypeIcon(question.type), { className: "w-5 h-5" })}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
                      </CardTitle>
                      <CardDescription>{getQuestionTypeLabel(question.type)}</CardDescription>
                    </div>
                  </div>

                  {/* Help and Reformulation Badges */}
                  <div className="flex gap-2">
                    {hasUsedHelp[question.id] && (
                      <Badge variant="secondary" className="text-xs">
                        <Lightbulb className="w-3 h-3 mr-1" />
                        Ayuda usada
                      </Badge>
                    )}
                    {hasReformulated[question.id] && (
                      <Badge variant="outline" className="text-xs">
                        <Shuffle className="w-3 h-3 mr-1" />
                        Reformulada
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {renderQuestion()}

                {/* Help Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleHelpUsed}
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <HelpCircle className="w-4 h-4" />
                        ¿No entiendes la pregunta?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          Ayuda para esta pregunta
                        </DialogTitle>
                        <DialogDescription>
                          Información detallada para ayudarte a entender y responder esta pregunta técnica
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Explanation */}
                        {question.explanation && (
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2">
                              <BookOpen className="w-4 h-4" />
                              ¿Qué evalúa esta pregunta?
                            </h4>
                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                          </div>
                        )}

                        {/* Examples */}
                        {question.examples && question.examples.length > 0 && (
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2">
                              <Lightbulb className="w-4 h-4" />
                              Ejemplos técnicos
                            </h4>
                            <ul className="space-y-1">
                              {question.examples.map((example, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tips */}
                        {question.tips && question.tips.length > 0 && (
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4" />
                              Consejos para responder
                            </h4>
                            <ul className="space-y-1">
                              {question.tips.map((tip, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-green-500 mt-1">✓</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {question.alternativeFormulations && question.alternativeFormulations.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReformulate}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reformular pregunta
                    </Button>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>

                  <Button onClick={handleNext} disabled={!isAnswered} className="flex items-center gap-2">
                    {currentQuestion === TECHNICAL_QUESTIONS.length - 1 ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Completar Test
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contextual Help Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="pb-3">
                <Collapsible open={showContextualHelp} onOpenChange={setShowContextualHelp}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Ayuda Contextual
                      </CardTitle>
                      {showContextualHelp ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {/* Question Type Help */}
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-sm text-blue-900 mb-1">
                          Tipo: {getQuestionTypeLabel(question.type)}
                        </h4>
                        <p className="text-xs text-blue-700">
                          {question.type === "scale" && "Evalúa tu nivel de competencia del 1 al 5"}
                          {question.type === "open" && "Describe tu experiencia técnica con detalles"}
                          {question.type === "multiple" && "Selecciona la opción que mejor represente tu experiencia"}
                          {question.type === "scenario" && "Elige cómo abordarías este desafío técnico"}
                          {question.type === "ranking" && "Ordena las tecnologías según tu nivel de experiencia"}
                          {question.type === "checkbox" && "Puedes seleccionar múltiples tecnologías"}
                          {question.type === "slider" && "Desliza para indicar tu nivel de competencia"}
                          {question.type === "binary" && "Elige entre las dos opciones técnicas"}
                          {question.type === "code" && "Analiza el código y propón mejoras"}
                        </p>
                      </div>

                      {/* Speech Recognition Help */}
                      {(question.type === "open" || question.type === "code") && isSupported && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-sm text-green-900 mb-1 flex items-center gap-1">
                            <Mic className="w-3 h-3" />
                            Reconocimiento de Voz
                          </h4>
                          <p className="text-xs text-green-700">
                            {inputMode === "voice-complete"
                              ? "El reconocimiento se inicia automáticamente. Explica tu respuesta técnica claramente."
                              : "Haz clic en el micrófono y explica tu respuesta técnica. El sistema se detendrá automáticamente después de 3 segundos de silencio."}
                          </p>
                        </div>
                      )}

                      {/* Ranking Help */}
                      {question.type === "ranking" && (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h4 className="font-medium text-sm text-purple-900 mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Cómo Ordenar
                          </h4>
                          <p className="text-xs text-purple-700">
                            Usa las flechas ↑↓ o arrastra los elementos. El #1 es tu mayor experiencia.
                          </p>
                        </div>
                      )}

                      {/* Code Analysis Help */}
                      {question.type === "code" && (
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <h4 className="font-medium text-sm text-orange-900 mb-1 flex items-center gap-1">
                            <Code className="w-3 h-3" />
                            Análisis de Código
                          </h4>
                          <p className="text-xs text-orange-700">
                            Revisa el código, identifica problemas y sugiere mejoras en rendimiento, legibilidad o
                            mejores prácticas.
                          </p>
                        </div>
                      )}

                      {/* General Tips */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-sm text-gray-900 mb-1">💡 Consejo Técnico</h4>
                        <p className="text-xs text-gray-700">
                          Responde basándote en tu experiencia real con tecnologías. Es mejor ser honesto sobre tu nivel
                          actual que exagerar.
                        </p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
