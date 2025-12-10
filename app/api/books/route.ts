import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET() {
  try {
    console.log("Fetching books from database...")

    const { data: books, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("read_count", { ascending: false })

    if (error) {
      console.error("Error fetching books from database:", error)

      // Si hay error de base de datos, usar datos de respaldo más completos
      const fallbackBooks = [
        {
          id: 1,
          title: "Organízate con Eficacia",
          author: "David Allen",
          category: "Productividad",
          content: `Organízate con Eficacia (Getting Things Done) es un sistema revolucionario de gestión del tiempo y la productividad que ha transformado la vida de millones de personas.

**El Problema Fundamental:**
Nuestra mente no está diseñada para recordar tareas. Cuando intentamos mantener todo en nuestra cabeza, experimentamos estrés constante.

**Los Cinco Pasos del Método GTD:**

**1. Capturar** - Recopila todo lo que llame tu atención
**2. Aclarar** - Procesa cada elemento: ¿Es accionable?
**3. Organizar** - Coloca elementos en listas apropiadas
**4. Reflexionar** - Revisa semanalmente todo tu sistema
**5. Comprometerse** - Usa tu sistema para decidir qué hacer

**Regla de los 2 Minutos:** Si toma menos de 2 minutos, hazlo inmediatamente.

**Beneficios:** Mente clara, mayor productividad, mejor toma de decisiones, más tiempo para lo importante.`,
          tags: ["productividad", "organización", "gestión del tiempo"],
          slug: "organizate-con-eficacia",
          read_count: 2847,
        },
        {
          id: 2,
          title: "Comunicación Efectiva",
          author: "Harvard Business Review",
          category: "Habilidades Blandas",
          content: `Técnicas para mejorar la comunicación profesional y construir relaciones laborales más sólidas. Cubre comunicación verbal y no verbal, escucha activa, resolución de conflictos y habilidades de presentación.

**Principios de Comunicación Clara:**
- Sé específico y concreto en tus mensajes
- Adapta tu comunicación a la audiencia
- Escucha activamente antes de responder
- Usa ejemplos y analogías para clarificar ideas

**Escucha Activa:**
- Mantén contacto visual apropiado
- Parafrasea para confirmar comprensión
- Haz preguntas abiertas
- Evita interrumpir

**Comunicación No Verbal:**
- El 55% de la comunicación es lenguaje corporal
- El 38% es tono de voz
- Solo el 7% son las palabras

**Resolución de Conflictos:**
- Enfócate en el problema, no en la persona
- Busca soluciones ganar-ganar
- Mantén la calma y profesionalismo
- Practica la empatía`,
          tags: ["comunicación", "habilidades-blandas", "relaciones"],
          slug: "comunicacion-efectiva",
          read_count: 1523,
        },
        {
          id: 3,
          title: "Liderazgo con Propósito",
          author: "Simon Sinek",
          category: "Liderazgo",
          content: `Descubre cómo los grandes líderes inspiran acción comenzando con el "por qué". Este libro transforma tu enfoque de liderazgo desde el comando y control hacia la inspiración y el propósito.

**El Círculo Dorado:**
- **Por Qué** - Tu propósito, causa o creencia
- **Cómo** - Tus valores y principios guía
- **Qué** - Los productos o servicios que ofreces

**La Gente No Compra Lo Que Haces, Compra Por Qué Lo Haces**
Los líderes inspiradores empiezan con el propósito, no con las características o beneficios.

**Construir Confianza:**
- La confianza comienza con autenticidad
- Sé consistente entre lo que dices y haces
- Admite errores y vulnerabilidad
- Cumple siempre tus promesas

**Liderar con el Ejemplo:**
- Tus acciones hablan más que tus palabras
- Establece estándares altos para ti mismo
- Muestra el camino, no solo señálalo
- Celebra los éxitos del equipo

**Desarrollar a Otros:**
- Delega con confianza
- Proporciona feedback constructivo
- Crea oportunidades de crecimiento
- Reconoce y potencia fortalezas`,
          tags: ["liderazgo", "propósito", "inspiración", "equipos"],
          slug: "liderazgo-con-proposito",
          read_count: 2156,
        },
        {
          id: 4,
          title: "Inteligencia Emocional en el Trabajo",
          author: "Daniel Goleman",
          category: "Inteligencia Emocional",
          content: `La inteligencia emocional es el factor más importante para el éxito profesional. Aprende a reconocer, entender y manejar las emociones propias y ajenas en el contexto laboral.

**Los 5 Componentes de la IE:**

**1. Autoconciencia:**
- Reconoce tus emociones en el momento
- Entiende cómo afectan tu desempeño
- Conoce tus fortalezas y limitaciones

**2. Autorregulación:**
- Maneja impulsos y emociones disruptivas
- Mantén la compostura bajo presión
- Piensa antes de actuar

**3. Motivación:**
- Impulsado por logros internos
- Optimista ante adversidades
- Comprometido con objetivos

**4. Empatía:**
- Entiende perspectivas ajenas
- Lee señales emocionales no verbales
- Anticipa necesidades de otros

**5. Habilidades Sociales:**
- Construye y lidera equipos
- Maneja conflictos efectivamente
- Inspira y persuade

**Aplicación Práctica:**
- En reuniones: lee el ambiente emocional
- En conflictos: mantén la calma y busca entender
- En feedback: sé específico y empático
- En liderazgo: inspira y motiva auténticamente`,
          tags: ["inteligencia-emocional", "trabajo", "relaciones-laborales"],
          slug: "inteligencia-emocional-trabajo",
          read_count: 3421,
        },
        {
          id: 5,
          title: "Mindfulness para Profesionales",
          author: "Jon Kabat-Zinn",
          category: "Bienestar",
          content: `La práctica de mindfulness reduce el estrés, mejora el enfoque y aumenta la efectividad profesional. Aprende técnicas respaldadas por ciencia para integrar la atención plena en tu día a día.

**¿Qué es Mindfulness?**
Atención plena al momento presente, sin juicio. Es entrenar tu mente para estar donde estás, completamente presente.

**Beneficios Comprobados:**
- Reduce estrés y ansiedad en 40%
- Mejora concentración y memoria
- Aumenta creatividad y toma de decisiones
- Mejora relaciones interpersonales
- Fortalece el sistema inmunológico

**Prácticas Básicas:**

**Meditación de Respiración (5 minutos):**
1. Siéntate cómodamente
2. Cierra los ojos
3. Enfoca atención en la respiración
4. Cuando la mente divague, regresa suavemente

**Escaneo Corporal (10 minutos):**
1. Acuéstate o siéntate cómodamente
2. Atiende cada parte del cuerpo sistemáticamente
3. Nota sensaciones sin juzgar
4. Respira hacia áreas de tensión

**Mindfulness en Acción:**
- Come conscientemente una comida al día
- Camina con atención plena 5 minutos
- Escucha activamente sin planear respuesta
- Toma pausas conscientes entre tareas

**Integración Laboral:**
- Comienza reuniones con 1 minuto de silencio
- Responde emails con atención completa
- Toma micro-pausas de 30 segundos cada hora
- Practica la mono-tarea en lugar de multi-tarea`,
          tags: ["mindfulness", "bienestar", "estrés", "productividad"],
          slug: "mindfulness-profesionales",
          read_count: 1876,
        },
        {
          id: 6,
          title: "Networking Estratégico",
          author: "Keith Ferrazzi",
          category: "Desarrollo Profesional",
          content: `El networking auténtico no es sobre coleccionar contactos, sino sobre cultivar relaciones significativas que generen valor mutuo. Aprende a construir una red profesional poderosa.

**Principios del Networking Auténtico:**

**1. Da Antes de Pedir:**
- Ofrece ayuda sin esperar nada a cambio
- Comparte conocimiento y contactos generosamente
- Conéctate desde el servicio, no desde la necesidad

**2. Sé Auténtico:**
- Muestra tu verdadera personalidad
- No finjas interés que no sientes
- Comparte vulnerabilidades apropiadamente

**3. Haz Seguimiento:**
- Contacta dentro de las 24 horas después de conocer a alguien
- Envía artículos o recursos relevantes
- Recuerda detalles personales

**4. Cultiva Relaciones a Largo Plazo:**
- No solo contactes cuando necesites algo
- Celebra los éxitos de tu red
- Mantén contacto regular

**Estrategias Prácticas:**

**En Eventos:**
- Establece objetivo claro antes de ir
- Prepara tu presentación de 30 segundos
- Haz preguntas abiertas e interesantes
- Conecta personas que se beneficiarían de conocerse

**Online (LinkedIn):**
- Personaliza cada solicitud de conexión
- Comenta y comparte contenido valioso
- Participa en grupos de tu industria
- Escribe artículos compartiendo tu experticia

**Mantenimiento de Red:**
- Crea sistema para seguimiento regular
- Usa calendario para recordar contactos
- Organiza almuerzos o cafés informativos
- Envía notas de agradecimiento

**Networking Estratégico:**
- Identifica personas clave en tu industria
- Busca mentores y ofrece ser mentor
- Construye relaciones con diversos perfiles
- Participa en asociaciones profesionales`,
          tags: ["networking", "relaciones-profesionales", "carrera"],
          slug: "networking-estrategico",
          read_count: 1234,
        },
      ]

      console.log("Using fallback data with", fallbackBooks.length, "books")
      return NextResponse.json(fallbackBooks)
    }

    console.log("Successfully fetched", books?.length || 0, "books from database")
    return NextResponse.json(books || [])
  } catch (error) {
    console.error("API Error:", error)

    // Datos de respaldo más completos en caso de error
    const comprehensiveFallbackBooks = [
      {
        id: 1,
        title: "Organízate con Eficacia",
        author: "David Allen",
        category: "Productividad",
        content: "Sistema GTD completo para gestión de tareas y productividad personal...",
        tags: ["productividad", "organización", "gestión del tiempo"],
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
        content: "Desarrollo de habilidades emocionales para el éxito personal y profesional...",
        tags: ["inteligencia emocional", "psicología", "liderazgo"],
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
        content: "Principios fundamentales para la efectividad personal y profesional...",
        tags: ["desarrollo personal", "liderazgo", "efectividad"],
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
        content: "Técnicas fundamentales para mejorar las relaciones interpersonales...",
        tags: ["comunicación", "relaciones interpersonales", "influencia"],
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
        content: "Pequeños cambios que generan resultados extraordinarios...",
        tags: ["hábitos", "cambio de comportamiento", "automejora"],
        slug: "habitos-atomicos",
        read_count: 6789,
        created_at: "2024-01-08T00:00:00Z",
        updated_at: "2024-01-25T00:00:00Z",
      },
    ]

    console.log("Using comprehensive fallback data with", comprehensiveFallbackBooks.length, "books")
    return NextResponse.json(comprehensiveFallbackBooks)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, category, content, author, tags, slug } = body

    const { data, error } = await supabase
      .from("knowledge_base")
      .insert([
        {
          title,
          category,
          content,
          author,
          tags,
          slug,
          read_count: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating book:", error)
      return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
