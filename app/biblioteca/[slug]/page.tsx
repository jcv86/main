"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  Clock,
  User,
  Star,
  Bookmark,
  Share2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  Eye,
  Heart,
  Download,
  ArrowLeft,
} from "lucide-react"

interface Book {
  id: number
  title: string
  author: string
  category: string
  content: string
  tags: string[]
  slug: string
  read_count: number
  created_at: string
  updated_at: string
}

// Fallback books data
const fallbackBooks: Book[] = [
  {
    id: 1,
    title: "Organízate con Eficacia",
    author: "David Allen",
    category: "Productividad",
    content: `# Organízate con Eficacia (Getting Things Done)

Organízate con Eficacia (Getting Things Done) es un sistema revolucionario de gestión del tiempo y la productividad que ha transformado la vida de millones de personas en todo el mundo.

## El Problema Fundamental

Nuestra mente no está diseñada para recordar tareas y compromisos. Cuando intentamos mantener todo en nuestra cabeza, experimentamos estrés constante y perdemos claridad mental.

## Los Cinco Pasos del Método GTD

### 1. Capturar
- Recopila todo lo que llame tu atención en bandejas de entrada confiables
- Usa herramientas como libretas, aplicaciones o grabadoras de voz
- El objetivo es sacar todo de tu mente y ponerlo en un sistema externo

### 2. Aclarar
- Procesa cada elemento de tus bandejas de entrada
- Pregúntate: "¿Es accionable?"
- Si no es accionable: elimínalo, archívalo o ponlo en "algún día/tal vez"
- Si es accionable: define la siguiente acción específica

### 3. Organizar
- Coloca los elementos accionables en las listas apropiadas
- Usa contextos como @llamadas, @ordenador, @recados
- Mantén un calendario solo para citas y compromisos con fecha específica

### 4. Reflexionar
- Revisa semanalmente todo tu sistema
- Actualiza listas, proyectos y compromisos
- Mantén tu sistema actualizado y confiable

### 5. Comprometerse
- Usa tu sistema para tomar decisiones sobre qué hacer
- Confía en tu sistema para elegir la siguiente acción
- Actúa con confianza sabiendo que no se te olvida nada

## Conceptos Clave

### La Regla de los 2 Minutos
Si una tarea toma menos de 2 minutos, hazla inmediatamente en lugar de organizarla.

### Proyectos vs. Acciones
- Un proyecto es cualquier resultado que requiere más de una acción
- Cada proyecto debe tener definida su siguiente acción específica

### Contextos
Organiza las acciones por el contexto donde puedes realizarlas (@casa, @oficina, @teléfono).

### Niveles de Perspectiva
- Pista de aterrizaje: Acciones actuales
- 10,000 pies: Proyectos actuales  
- 20,000 pies: Áreas de responsabilidad
- 30,000 pies: Objetivos de 1-2 años
- 40,000 pies: Visión de 3-5 años
- 50,000 pies: Propósito y principios de vida

## Beneficios del Sistema
- Mente clara y libre de estrés
- Mayor productividad y eficiencia
- Mejor toma de decisiones
- Sensación de control y confianza
- Más tiempo para lo que realmente importa

## Implementación Práctica

### Paso 1: Configuración Inicial
1. Dedica tiempo inicial para configurar tu sistema
2. Haz una recopilación completa de todos tus compromisos
3. Procesa todo hasta llegar a bandeja de entrada cero
4. Establece el hábito de la revisión semanal
5. Mantén la disciplina de capturar todo inmediatamente

### Paso 2: Herramientas Recomendadas
- **Captura**: Libreta, aplicación móvil, grabadora de voz
- **Procesamiento**: Bandejas de entrada físicas y digitales
- **Organización**: Listas de contextos, calendario, archivo de referencia
- **Revisión**: Agenda semanal, recordatorios diarios

### Paso 3: Mantenimiento del Sistema
- Revisa tu sistema diariamente
- Haz una revisión semanal completa
- Ajusta el sistema según tus necesidades
- Mantén la disciplina de capturar inmediatamente

## Casos de Uso Específicos

### Para Profesionales
- Gestión de proyectos múltiples
- Seguimiento de compromisos con clientes
- Organización de reuniones y presentaciones
- Manejo de correos electrónicos eficiente

### Para Estudiantes
- Organización de tareas y exámenes
- Gestión de proyectos de investigación
- Seguimiento de lecturas y recursos
- Planificación de horarios de estudio

### Para Emprendedores
- Seguimiento de oportunidades de negocio
- Gestión de múltiples proyectos
- Organización de contactos y networking
- Planificación estratégica a largo plazo

## Errores Comunes y Cómo Evitarlos

### Error 1: Sistema Demasiado Complejo
**Problema**: Crear un sistema tan elaborado que sea difícil de mantener.
**Solución**: Comienza simple y añade complejidad gradualmente.

### Error 2: No Hacer Revisiones Regulares
**Problema**: El sistema se vuelve obsoleto sin revisiones.
**Solución**: Programa revisiones semanales no negociables.

### Error 3: No Capturar Todo
**Problema**: Mantener algunas cosas en la mente.
**Solución**: Desarrolla el hábito de capturar inmediatamente.

### Error 4: Procrastinar el Procesamiento
**Problema**: Acumular elementos sin procesar.
**Solución**: Procesa las bandejas de entrada regularmente.

## Integración con Tecnología Moderna

### Aplicaciones Recomendadas
- **Todoist**: Para listas de tareas y proyectos
- **Evernote**: Para archivo de referencia
- **Google Calendar**: Para citas y compromisos
- **Slack/Teams**: Para comunicación organizacional

### Sincronización Multi-Dispositivo
- Usa servicios en la nube para sincronizar
- Mantén una copia de respaldo de tu sistema
- Asegúrate de poder acceder desde cualquier lugar

## Medición del Éxito

### Indicadores de un Sistema Efectivo
- Mente clara y libre de preocupaciones
- Capacidad de enfocarse en la tarea actual
- Confianza en que no se olvida nada importante
- Reducción del estrés relacionado con la organización
- Mayor productividad y satisfacción personal

### Métricas a Seguir
- Tiempo dedicado a procesamiento diario
- Número de elementos en bandejas de entrada
- Frecuencia de revisiones semanales
- Porcentaje de compromisos cumplidos a tiempo

GTD no es solo un sistema de productividad, es una forma de vida que te permite estar presente y enfocado en lo que realmente importa. La clave está en la implementación consistente y la adaptación del sistema a tus necesidades específicas.`,
    tags: ["productividad", "organización", "gestión del tiempo", "gtd", "eficiencia"],
    slug: "organizate-con-eficacia",
    read_count: 2847,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
  {
    id: 2,
    title: "Inteligencia Emocional",
    author: "Daniel Goleman",
    category: "Psicología",
    content: `# Inteligencia Emocional

La Inteligencia Emocional es la capacidad de reconocer, entender y manejar nuestras propias emociones, así como reconocer, entender e influir en las emociones de otros.

## Los Cinco Componentes de la Inteligencia Emocional

### 1. Autoconciencia Emocional
- Reconocer y entender tus propias emociones
- Ser consciente de cómo tus emociones afectan tus pensamientos y comportamiento
- Conocer tus fortalezas y limitaciones emocionales
- Tener confianza en ti mismo basada en el autoconocimiento

### 2. Autorregulación
- Manejar efectivamente las emociones disruptivas e impulsos
- Mantener estándares de honestidad e integridad
- Asumir responsabilidad por tu desempeño personal
- Ser flexible en el manejo del cambio

### 3. Motivación
- Estar impulsado a lograr por el simple placer del logro
- Tener un fuerte impulso para mejorar el desempeño
- Mostrar compromiso con los objetivos del grupo u organización
- Estar listo para actuar en oportunidades y ser optimista incluso frente al fracaso

### 4. Empatía
- Entender las emociones de otros y mostrar interés activo en sus preocupaciones
- Anticipar, reconocer y satisfacer las necesidades de los clientes
- Ayudar a desarrollar las habilidades de otros
- Leer las corrientes políticas y redes sociales de una organización

### 5. Habilidades Sociales
- Ser efectivo en liderar el cambio
- Ser persuasivo y usar habilidades de comunicación efectivas
- Ser experto en construir y liderar equipos
- Manejar disputas y negociar resoluciones

## El Cerebro Emocional vs. El Cerebro Racional

### Sistema Límbico (Cerebro Emocional)
- Procesa emociones rápidamente
- Responde instintivamente
- Almacena memorias emocionales
- Puede "secuestrar" la respuesta racional

### Neocórtex (Cerebro Racional)
- Procesa información lógicamente
- Planifica y analiza
- Controla impulsos
- Permite el pensamiento abstracto

## Aplicaciones Prácticas

### En el Liderazgo
- Los líderes emocionalmente inteligentes crean climas de trabajo positivos
- Inspiran y motivan a sus equipos
- Manejan conflictos de manera constructiva
- Toman mejores decisiones considerando factores emocionales

### En las Relaciones
- Mejora la comunicación y comprensión mutua
- Reduce conflictos y malentendidos
- Fortalece vínculos personales y profesionales
- Facilita la colaboración y trabajo en equipo

### En el Desempeño
- Mejora la capacidad de manejar estrés y presión
- Aumenta la resiliencia ante adversidades
- Facilita la adaptación al cambio
- Mejora la toma de decisiones bajo presión

## Desarrollo de la Inteligencia Emocional

### Técnicas de Autoconciencia
- Práctica de mindfulness y meditación
- Llevar un diario emocional
- Solicitar feedback de otros
- Reflexión regular sobre reacciones emocionales

### Estrategias de Autorregulación
- Técnicas de respiración y relajación
- Pausa antes de reaccionar
- Reencuadre cognitivo de situaciones
- Establecimiento de límites personales

### Mejora de Habilidades Sociales
- Práctica de escucha activa
- Desarrollo de empatía a través de perspectiva
- Comunicación asertiva y clara
- Construcción de redes de relaciones

La inteligencia emocional es más predictiva del éxito en la vida que el CI tradicional, y afortunadamente, puede desarrollarse a cualquier edad con práctica y dedicación.`,
    tags: ["inteligencia emocional", "psicología", "liderazgo", "relaciones", "autoconciencia"],
    slug: "inteligencia-emocional",
    read_count: 3156,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-18T00:00:00Z",
  },
  {
    id: 3,
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    category: "Desarrollo Personal",
    content: `# Los 7 Hábitos de la Gente Altamente Efectiva

Los 7 Hábitos de la Gente Altamente Efectiva presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.

## Paradigmas y Principios
Los paradigmas son mapas mentales que determinan cómo vemos el mundo. Los principios son leyes naturales universales que gobiernan la efectividad humana.

## Los 7 Hábitos

### VICTORIA PRIVADA (Independencia)

#### Hábito 1: Ser Proactivo
- Toma responsabilidad de tu vida y decisiones
- Enfócate en tu Círculo de Influencia, no en tu Círculo de Preocupación
- Usa lenguaje proactivo: "Yo puedo", "Yo elegiré", "Yo prefiero"
- Responde basándote en valores, no en condiciones o sentimientos

#### Hábito 2: Comenzar con el Fin en Mente
- Define claramente tu misión y visión personal
- Crea una declaración de misión personal basada en principios
- Visualiza tu funeral: ¿qué te gustaría que dijeran de ti?
- Todos los logros se crean mentalmente antes que físicamente

#### Hábito 3: Poner Primero lo Primero
- Gestiona tu tiempo basándote en principios, no en prioridades
- Enfócate en actividades del Cuadrante II (importante pero no urgente)
- Aprende a decir "no" a lo bueno para decir "sí" a lo mejor
- Organiza y ejecuta alrededor de prioridades

### VICTORIA PÚBLICA (Interdependencia)

#### Hábito 4: Pensar Ganar-Ganar
- Busca beneficio mutuo en todas las interacciones humanas
- Desarrolla una mentalidad de abundancia, no de escasez
- Considera las alternativas: Ganar-Ganar o No Hay Trato
- Construye relaciones basadas en confianza y respeto mutuo

#### Hábito 5: Buscar Primero Entender, Luego Ser Entendido
- Practica la escucha empática antes de buscar ser escuchado
- Escucha con la intención de entender, no de responder
- Reformula lo que la otra persona dice para confirmar comprensión
- Presenta tus ideas de manera que otros puedan entenderlas

#### Hábito 6: Sinergizar
- Combina las fortalezas de las personas para lograr objetivos que ninguna podría alcanzar sola
- Valora las diferencias mentales, emocionales y psicológicas
- Busca la tercera alternativa que es mejor que cualquier solución individual
- Crea un ambiente donde es seguro hablar sobre diferencias

### RENOVACIÓN CONTINUA

#### Hábito 7: Afilar la Sierra
- Renueva regularmente las cuatro dimensiones de tu naturaleza:
  - **Física**: ejercicio, nutrición, manejo del estrés
  - **Espiritual**: clarificación de valores, compromiso, estudio y meditación
  - **Mental**: lectura, visualización, planificación, escritura
  - **Social/Emocional**: servicio, empatía, sinergia, seguridad intrínseca

## Conceptos Clave

### Cuenta Bancaria Emocional
- Cada interacción hace un depósito o retiro en las relaciones
- Depósitos: cumplir promesas, pequeñas cortesías, clarificar expectativas
- Retiros: romper promesas, pequeñas descortesías, traicionar confianzas

### Círculo de Influencia vs. Círculo de Preocupación
- Enfócate en lo que puedes controlar (Círculo de Influencia)
- No desperdicies energía en lo que no puedes controlar (Círculo de Preocupación)

### Matriz de Gestión del Tiempo
- Cuadrante I: Urgente e Importante (Crisis)
- Cuadrante II: No Urgente pero Importante (Prevención, planificación)
- Cuadrante III: Urgente pero No Importante (Interrupciones)
- Cuadrante IV: No Urgente y No Importante (Pérdidas de tiempo)

## Aplicación Práctica

### En el Liderazgo
- Lidera con el ejemplo y principios
- Desarrolla a otros a través de delegación efectiva
- Crea visión compartida y compromiso

### En las Relaciones
- Construye confianza a través de la integridad
- Busca entender antes de ser entendido
- Encuentra soluciones ganar-ganar

### En el Crecimiento Personal
- Desarrolla proactividad y responsabilidad personal
- Mantén equilibrio en todas las áreas de la vida
- Comprométete con el aprendizaje continuo

Los 7 hábitos no son técnicas de personalidad superficiales, sino principios fundamentales de efectividad humana que, cuando se practican consistentemente, se convierten en la base del carácter.`,
    tags: ["desarrollo personal", "liderazgo", "efectividad", "hábitos", "principios"],
    slug: "7-habitos-gente-altamente-efectiva",
    read_count: 4521,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: 4,
    title: "Cómo Ganar Amigos e Influir sobre las Personas",
    author: "Dale Carnegie",
    category: "Comunicación",
    content: `# Cómo Ganar Amigos e Influir sobre las Personas

Este libro clásico enseña técnicas fundamentales para manejar personas, hacer que te aprecien, ganar a la gente a tu manera de pensar y ser un líder.

## PARTE I: TÉCNICAS FUNDAMENTALES PARA TRATAR CON LA GENTE

### Principio 1: No Critiques, No Condenes, No Te Quejes
- La crítica es inútil porque pone a la persona a la defensiva
- La crítica hiere el orgullo, lastima el sentido de importancia
- En lugar de criticar, trata de entender por qué hacen lo que hacen

### Principio 2: Demuestra Aprecio Honesto y Sincero
- El deseo más profundo del ser humano es sentirse importante
- Aprecia genuinamente las buenas cualidades de otros
- Sé específico en tus elogios y hazlos inmediatamente

### Principio 3: Despierta en la Otra Persona un Deseo Vehemente
- Habla de lo que la otra persona quiere
- Muestra cómo pueden obtener lo que desean
- Conecta tus ideas con sus motivaciones

## PARTE II: SEIS MANERAS DE AGRADAR A LA GENTE

### Principio 1: Interésate Genuinamente en Otras Personas
- Muestra interés real en los demás y sus vidas
- Haz preguntas sobre sus intereses y experiencias
- Recuerda detalles importantes sobre las personas

### Principio 2: Sonríe
- Una sonrisa genuina comunica: "Me alegra verte"
- Las sonrisas son contagiosas y crean ambiente positivo
- Sonríe incluso cuando hablas por teléfono

### Principio 3: Recuerda que el Nombre de una Persona es el Sonido más Dulce
- Usa el nombre de la persona frecuentemente en la conversación
- Haz el esfuerzo de aprender y recordar nombres correctamente
- El nombre es parte de la identidad de la persona

### Principio 4: Sé un Buen Oyente. Anima a Otros a Hablar de Sí Mismos
- Escucha más de lo que hablas
- Haz preguntas que inviten a la persona a compartir
- Muestra interés genuino en lo que dicen

### Principio 5: Habla en Términos de los Intereses de la Otra Persona
- Descubre qué le interesa a la persona
- Conecta tus conversaciones con sus pasiones
- Investiga sobre sus hobbies y actividades

### Principio 6: Haz que la Otra Persona se Sienta Importante - y Hazlo Sinceramente
- Reconoce los logros y contribuciones de otros
- Pide su opinión y consejo
- Trata a todos con respeto y dignidad

## PARTE III: LOGRA QUE LA GENTE PIENSE COMO TÚ

### Principio 1: La Única Forma de Ganar una Discusión es Evitándola
- Las discusiones rara vez cambian opiniones
- Busca puntos de acuerdo en lugar de diferencias
- Respeta las opiniones de otros

### Principio 2: Demuestra Respeto por las Opiniones Ajenas. Jamás Digas "Estás Equivocado"
- Evita contradecir directamente a las personas
- Usa frases como "Puede que esté equivocado, pero..."
- Permite que otros mantengan su dignidad

### Principio 3: Si Estás Equivocado, Admítelo Rápida y Enfáticamente
- Admite tus errores antes que otros te los señalen
- La autocrítica desarma la crítica de otros
- Muestra humildad y disposición a aprender

### Principio 4: Comienza de Manera Amigable
- Inicia conversaciones difíciles con calidez
- Encuentra terreno común antes de abordar diferencias
- El tono amigable predispone a la cooperación

### Principio 5: Consigue que la Otra Persona Diga "Sí, Sí" Inmediatamente
- Comienza con preguntas que generen acuerdo
- Construye momentum de acuerdo antes de presentar tu punto
- Evita que la persona se comprometa con el "no"

### Principio 6: Permite que la Otra Persona Hable Mucho
- Deja que otros expresen completamente sus ideas
- Las personas se convencen más por sus propias palabras
- Escucha para entender, no para rebatir

## PARTE IV: SÉ UN LÍDER

### Principio 1: Comienza con Elogio y Aprecio Honesto
- Reconoce primero las fortalezas antes de señalar áreas de mejora
- Crea un ambiente positivo para la retroalimentación
- Las personas son más receptivas después del reconocimiento

### Principio 2: Llama la Atención sobre los Errores de Otros Indirectamente
- Usa "y" en lugar de "pero" después de un elogio
- Sugiere mejoras sin atacar directamente
- Permite que las personas mantengan su autoestima

### Principio 3: Habla de tus Propios Errores antes de Criticar los de la Otra Persona
- Comparte tus propias experiencias de error y aprendizaje
- Esto hace que la crítica sea menos amenazante
- Muestra que todos cometemos errores

## Aplicaciones Modernas
- Networking profesional efectivo
- Liderazgo de equipos
- Ventas y negociación
- Relaciones familiares y de pareja
- Servicio al cliente
- Resolución de conflictos

Los principios de Carnegie siguen siendo relevantes porque se basan en necesidades humanas fundamentales que no cambian con el tiempo: el deseo de sentirse importante, comprendido y apreciado.`,
    tags: ["comunicación", "relaciones interpersonales", "liderazgo", "influencia", "habilidades sociales"],
    slug: "como-ganar-amigos-influir-personas",
    read_count: 5234,
    created_at: "2024-01-12T00:00:00Z",
    updated_at: "2024-01-22T00:00:00Z",
  },
  {
    id: 5,
    title: "Hábitos Atómicos",
    author: "James Clear",
    category: "Desarrollo Personal",
    content: `# Hábitos Atómicos

Los cambios que parecen pequeños e insignificantes al principio se convertirán en resultados extraordinarios si estás dispuesto a mantenerlos durante años. Este es el poder de los hábitos atómicos.

## Las Cuatro Leyes del Cambio de Comportamiento

### 1ª Ley: Hazlo Obvio
- Usa intenciones de implementación: "Haré [COMPORTAMIENTO] a las [TIEMPO] en [LUGAR]"
- Usa el apilamiento de hábitos: "Después de [HÁBITO ACTUAL], haré [NUEVO HÁBITO]"
- Diseña tu ambiente para hacer obvios los buenos hábitos
- Usa señales visuales para activar los comportamientos deseados

### 2ª Ley: Hazlo Atractivo
- Usa el agrupamiento de tentaciones: combina acciones que quieres hacer con acciones que necesitas hacer
- Únete a una cultura donde tu comportamiento deseado sea normal
- Crea un ritual de motivación antes de hábitos difíciles
- Resalta los beneficios de evitar malos hábitos

### 3ª Ley: Hazlo Fácil
- Reduce la fricción para buenos hábitos y aumenta la fricción para malos hábitos
- Usa la Regla de los Dos Minutos: escala los hábitos hasta que tomen menos de dos minutos
- Prepara tu ambiente para hacer más fáciles las acciones futuras
- Usa la tecnología para automatizar buenos hábitos

### 4ª Ley: Hazlo Satisfactorio
- Usa refuerzo: date recompensas inmediatas por buenos hábitos
- Haz que "no hacer nada" sea disfrutable para hábitos que quieres evitar
- Usa un rastreador de hábitos para visualizar tu progreso
- Nunca falles dos veces: regresa rápidamente después de errores

## Conceptos Clave

### Sistemas vs. Objetivos
- Los objetivos son sobre los resultados que quieres lograr
- Los sistemas son sobre los procesos que llevan a esos resultados
- Enfócate en sistemas, no en objetivos, para cambios duraderos

### Hábitos Basados en Identidad
- Cada acción es un voto por el tipo de persona que deseas ser
- Enfócate en quién quieres ser, no en lo que quieres lograr
- Pregúntate: "¿Qué haría una persona saludable?" o "¿Qué haría una persona organizada?"

### La Meseta del Potencial Latente
- Los hábitos a menudo parecen no hacer diferencia hasta que cruzas un umbral crítico
- Los momentos de avance son a menudo el resultado de muchas acciones previas
- Sé paciente con el proceso: los resultados se acumularán con el tiempo

## Aplicaciones Prácticas

### Para Construir Buenos Hábitos
1. Comienza con hábitos tan pequeños que parezcan triviales
2. Apila nuevos hábitos sobre rutinas existentes
3. Diseña tu ambiente para el éxito
4. Rastrea tu progreso visualmente
5. Celebra pequeñas victorias inmediatamente

### Para Romper Malos Hábitos
1. Hazlos invisibles (elimina señales)
2. Hazlos poco atractivos (enfócate en las desventajas)
3. Hazlos difíciles (aumenta la fricción)
4. Hazlos insatisfactorios (crea responsabilidad)

## Tácticas Avanzadas
- Usa el apilamiento de hábitos para construir rutinas
- Crea intenciones de implementación para escenarios específicos
- Aplica la Regla de Goldilocks: trabaja en desafíos de dificultad manejable
- Usa el diseño del ambiente para apoyar comportamientos deseados

## El Proceso de Cuatro Pasos
1. **Señal**: El disparador que inicia el comportamiento
2. **Anhelo**: La fuerza motivacional detrás de cada hábito
3. **Respuesta**: El hábito real que realizas
4. **Recompensa**: El beneficio que obtienes del hábito

## Estrategias de Implementación

### Diseño del Ambiente
- Haz obvias las señales para buenos hábitos
- Reduce la fricción para comportamientos deseados
- Usa el contexto para tu ventaja

### Seguimiento del Progreso
- Usa un rastreador de hábitos simple
- Enfócate en la consistencia, no en la perfección
- Nunca rompas la cadena dos veces seguidas

### Responsabilidad
- Encuentra un compañero de responsabilidad
- Haz públicos tus compromisos
- Crea consecuencias por no cumplir

El secreto para obtener resultados que duren es nunca dejar de hacer mejoras. Es notable lo que puedes construir si simplemente no paras.`,
    tags: ["hábitos", "cambio de comportamiento", "automejora", "sistemas", "identidad"],
    slug: "habitos-atomicos",
    read_count: 6789,
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z",
  },
]

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [notes, setNotes] = useState("")
  const [fontSize, setFontSize] = useState(16)
  const [readingTime, setReadingTime] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  // Cargar libro
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        setError(null)
        const slug = params.slug as string

        console.log("Fetching book with slug:", slug)

        // Intentar cargar desde API
        const response = await fetch(`/api/books/${slug}`)

        if (response.ok) {
          const data = await response.json()
          console.log("Book loaded from API:", data)
          setBook(data)
        } else {
          console.log("API failed, using fallback data")
          // Usar datos de respaldo
          const foundBook = fallbackBooks.find(
            (b) =>
              b.slug === slug ||
              b.id.toString() === slug ||
              b.slug.includes(slug) ||
              b.title.toLowerCase().replace(/\s+/g, "-").includes(slug),
          )

          if (foundBook) {
            console.log("Found fallback book:", foundBook.title)
            setBook(foundBook)
          } else {
            console.log("No book found for slug:", slug)
            setError("Libro no encontrado")
          }
        }
      } catch (error) {
        console.error("Error loading book:", error)
        setError("Error al cargar el libro")

        // Intentar con datos de respaldo como último recurso
        const slug = params.slug as string
        const foundBook = fallbackBooks.find(
          (b) =>
            b.slug === slug ||
            b.id.toString() === slug ||
            b.slug.includes(slug) ||
            b.title.toLowerCase().replace(/\s+/g, "-").includes(slug),
        )

        if (foundBook) {
          console.log("Using fallback book after error:", foundBook.title)
          setBook(foundBook)
          setError(null)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [params.slug])

  // Simular páginas dividiendo el contenido
  const wordsPerPage = 300
  const words = book?.content.split(" ") || []
  const totalPages = Math.ceil(words.length / wordsPerPage)

  const getCurrentPageContent = () => {
    const startIndex = (currentPage - 1) * wordsPerPage
    const endIndex = startIndex + wordsPerPage
    return words.slice(startIndex, endIndex).join(" ")
  }

  // Calcular progreso de lectura
  useEffect(() => {
    if (totalPages > 0) {
      const progress = (currentPage / totalPages) * 100
      setReadingProgress(progress)
    }
  }, [currentPage, totalPages])

  // Simular tiempo de lectura
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const getDifficultyColor = (category: string) => {
    switch (category) {
      case "Productividad":
        return "bg-green-100 text-green-800"
      case "Psicología":
        return "bg-blue-100 text-blue-800"
      case "Desarrollo Personal":
        return "bg-purple-100 text-purple-800"
      case "Comunicación":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const estimateReadingTime = (content: string) => {
    if (!content) return 0
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando libro...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <p className="text-gray-600 mb-4">No se pudo encontrar el libro solicitado.</p>
          <Button onClick={() => router.push("/biblioteca")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la biblioteca
          </Button>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Libro no encontrado</h1>
          <Button onClick={() => router.push("/biblioteca")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la biblioteca
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.push("/biblioteca")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la biblioteca
      </Button>

      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{book.title}</h1>
                <Badge className={getDifficultyColor(book.category)}>{book.category}</Badge>
              </div>

              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {book.author}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {estimateReadingTime(book.content)} min lectura
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Tiempo: {formatTime(readingTime)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {book.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-blue-600" : ""}
              >
                <Bookmark className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-600" : ""}
              >
                <Heart className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso de lectura</span>
              <span>{Math.round(readingProgress)}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              {/* Settings Panel */}
              {showSettings && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Configuración de Lectura</h3>
                  <div className="flex items-center gap-4">
                    <label className="text-sm">Tamaño de fuente:</label>
                    <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
                      A-
                    </Button>
                    <span className="text-sm">{fontSize}px</span>
                    <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
                      A+
                    </Button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose max-w-none leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                <div className="whitespace-pre-wrap">{getCurrentPageContent()}</div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button variant="outline" onClick={prevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>

                <Button variant="outline" onClick={nextPage} disabled={currentPage === totalPages}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reading Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Progreso</span>
                <span className="text-sm font-medium">{Math.round(readingProgress)}%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tiempo leyendo</span>
                <span className="text-sm font-medium">{formatTime(readingTime)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Páginas restantes</span>
                <span className="text-sm font-medium">{totalPages - currentPage}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tiempo estimado</span>
                <span className="text-sm font-medium">
                  {Math.round(estimateReadingTime(book.content) * (1 - readingProgress / 100))} min
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Mis Notas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Escribe tus notas y reflexiones aquí..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <Button className="w-full mt-3" size="sm">
                Guardar Nota
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Star className="h-4 w-4 mr-2" />
                Calificar Libro
              </Button>

              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir Progreso
              </Button>

              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BookOpen className="h-4 w-4 mr-2" />
                Libros Relacionados
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
