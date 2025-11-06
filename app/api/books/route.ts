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
          content: `Organízate con Eficacia (Getting Things Done) es un sistema revolucionario de gestión del tiempo y la productividad que ha transformado la vida de millones de personas en todo el mundo.

**El Problema Fundamental:**
Nuestra mente no está diseñada para recordar tareas y compromisos. Cuando intentamos mantener todo en nuestra cabeza, experimentamos estrés constante y perdemos claridad mental.

**Los Cinco Pasos del Método GTD:**

**1. Capturar**
- Recopila todo lo que llame tu atención en bandejas de entrada confiables
- Usa herramientas como libretas, aplicaciones o grabadoras de voz
- El objetivo es sacar todo de tu mente y ponerlo en un sistema externo

**2. Aclarar**
- Procesa cada elemento de tus bandejas de entrada
- Pregúntate: "¿Es accionable?"
- Si no es accionable: elimínalo, archívalo o ponlo en "algún día/tal vez"
- Si es accionable: define la siguiente acción específica

**3. Organizar**
- Coloca los elementos accionables en las listas apropiadas
- Usa contextos como @llamadas, @ordenador, @recados
- Mantén un calendario solo para citas y compromisos con fecha específica

**4. Reflexionar**
- Revisa semanalmente todo tu sistema
- Actualiza listas, proyectos y compromisos
- Mantén tu sistema actualizado y confiable

**5. Comprometerse**
- Usa tu sistema para tomar decisiones sobre qué hacer
- Confía en tu sistema para elegir la siguiente acción
- Actúa con confianza sabiendo que no se te olvida nada

**Conceptos Clave:**

**La Regla de los 2 Minutos:**
Si una tarea toma menos de 2 minutos, hazla inmediatamente en lugar de organizarla.

**Proyectos vs. Acciones:**
- Un proyecto es cualquier resultado que requiere más de una acción
- Cada proyecto debe tener definida su siguiente acción específica

**Contextos:**
Organiza las acciones por el contexto donde puedes realizarlas (@casa, @oficina, @teléfono).

**Niveles de Perspectiva:**
- Pista de aterrizaje: Acciones actuales
- 10,000 pies: Proyectos actuales  
- 20,000 pies: Áreas de responsabilidad
- 30,000 pies: Objetivos de 1-2 años
- 40,000 pies: Visión de 3-5 años
- 50,000 pies: Propósito y principios de vida

**Beneficios del Sistema:**
- Mente clara y libre de estrés
- Mayor productividad y eficiencia
- Mejor toma de decisiones
- Sensación de control y confianza
- Más tiempo para lo que realmente importa

**Implementación Práctica:**
1. Dedica tiempo inicial para configurar tu sistema
2. Haz una recopilación completa de todos tus compromisos
3. Procesa todo hasta llegar a bandeja de entrada cero
4. Establece el hábito de la revisión semanal
5. Mantén la disciplina de capturar todo inmediatamente

GTD no es solo un sistema de productividad, es una forma de vida que te permite estar presente y enfocado en lo que realmente importa.`,
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
          content: `La Inteligencia Emocional es la capacidad de reconocer, entender y manejar nuestras propias emociones, así como reconocer, entender e influir en las emociones de otros.

**Los Cinco Componentes de la Inteligencia Emocional:**

**1. Autoconciencia Emocional**
- Reconocer y entender tus propias emociones
- Ser consciente de cómo tus emociones afectan tus pensamientos y comportamiento
- Conocer tus fortalezas y limitaciones emocionales
- Tener confianza en ti mismo basada en el autoconocimiento

**2. Autorregulación**
- Manejar efectivamente las emociones disruptivas e impulsos
- Mantener estándares de honestidad e integridad
- Asumir responsabilidad por tu desempeño personal
- Ser flexible en el manejo del cambio

**3. Motivación**
- Estar impulsado a lograr por el simple placer del logro
- Tener un fuerte impulso para mejorar el desempeño
- Mostrar compromiso con los objetivos del grupo u organización
- Estar listo para actuar en oportunidades y ser optimista incluso frente al fracaso

**4. Empatía**
- Entender las emociones de otros y mostrar interés activo en sus preocupaciones
- Anticipar, reconocer y satisfacer las necesidades de los clientes
- Ayudar a desarrollar las habilidades de otros
- Leer las corrientes políticas y redes sociales de una organización

**5. Habilidades Sociales**
- Ser efectivo en liderar el cambio
- Ser persuasivo y usar habilidades de comunicación efectivas
- Ser experto en construir y liderar equipos
- Manejar disputas y negociar resoluciones

**El Cerebro Emocional vs. El Cerebro Racional:**

**Sistema Límbico (Cerebro Emocional):**
- Procesa emociones rápidamente
- Responde instintivamente
- Almacena memorias emocionales
- Puede "secuestrar" la respuesta racional

**Neocórtex (Cerebro Racional):**
- Procesa información lógicamente
- Planifica y analiza
- Controla impulsos
- Permite el pensamiento abstracto

**Aplicaciones Prácticas:**

**En el Liderazgo:**
- Los líderes emocionalmente inteligentes crean climas de trabajo positivos
- Inspiran y motivan a sus equipos
- Manejan conflictos de manera constructiva
- Toman mejores decisiones considerando factores emocionales

**En las Relaciones:**
- Mejora la comunicación y comprensión mutua
- Reduce conflictos y malentendidos
- Fortalece vínculos personales y profesionales
- Facilita la colaboración y trabajo en equipo

**En el Desempeño:**
- Mejora la capacidad de manejar estrés y presión
- Aumenta la resiliencia ante adversidades
- Facilita la adaptación al cambio
- Mejora la toma de decisiones bajo presión

**Desarrollo de la Inteligencia Emocional:**

**Técnicas de Autoconciencia:**
- Práctica de mindfulness y meditación
- Llevar un diario emocional
- Solicitar feedback de otros
- Reflexión regular sobre reacciones emocionales

**Estrategias de Autorregulación:**
- Técnicas de respiración y relajación
- Pausa antes de reaccionar
- Reencuadre cognitivo de situaciones
- Establecimiento de límites personales

**Mejora de Habilidades Sociales:**
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
          content: `Los 7 Hábitos de la Gente Altamente Efectiva presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.

**Paradigmas y Principios:**
Los paradigmas son mapas mentales que determinan cómo vemos el mundo. Los principios son leyes naturales universales que gobiernan la efectividad humana.

**Los 7 Hábitos:**

**VICTORIA PRIVADA (Independencia)**

**Hábito 1: Ser Proactivo**
- Toma responsabilidad de tu vida y decisiones
- Enfócate en tu Círculo de Influencia, no en tu Círculo de Preocupación
- Usa lenguaje proactivo: "Yo puedo", "Yo elegiré", "Yo prefiero"
- Responde basándote en valores, no en condiciones o sentimientos

**Hábito 2: Comenzar con el Fin en Mente**
- Define claramente tu misión y visión personal
- Crea una declaración de misión personal basada en principios
- Visualiza tu funeral: ¿qué te gustaría que dijeran de ti?
- Todos los logros se crean mentalmente antes que físicamente

**Hábito 3: Poner Primero lo Primero**
- Gestiona tu tiempo basándote en principios, no en prioridades
- Enfócate en actividades del Cuadrante II (importante pero no urgente)
- Aprende a decir "no" a lo bueno para decir "sí" a lo mejor
- Organiza y ejecuta alrededor de prioridades

**VICTORIA PÚBLICA (Interdependencia)**

**Hábito 4: Pensar Ganar-Ganar**
- Busca beneficio mutuo en todas las interacciones humanas
- Desarrolla una mentalidad de abundancia, no de escasez
- Considera las alternativas: Ganar-Ganar o No Hay Trato
- Construye relaciones basadas en confianza y respeto mutuo

**Hábito 5: Buscar Primero Entender, Luego Ser Entendido**
- Practica la escucha empática antes de buscar ser escuchado
- Escucha con la intención de entender, no de responder
- Reformula lo que la otra persona dice para confirmar comprensión
- Presenta tus ideas de manera que otros puedan entenderlas

**Hábito 6: Sinergizar**
- Combina las fortalezas de las personas para lograr objetivos que ninguna podría alcanzar sola
- Valora las diferencias mentales, emocionales y psicológicas
- Busca la tercera alternativa que es mejor que cualquier solución individual
- Crea un ambiente donde es seguro hablar sobre diferencias

**RENOVACIÓN CONTINUA**

**Hábito 7: Afilar la Sierra**
- Renueva regularmente las cuatro dimensiones de tu naturaleza:
  - **Física**: ejercicio, nutrición, manejo del estrés
  - **Espiritual**: clarificación de valores, compromiso, estudio y meditación
  - **Mental**: lectura, visualización, planificación, escritura
  - **Social/Emocional**: servicio, empatía, sinergia, seguridad intrínseca

**Conceptos Clave:**

**Cuenta Bancaria Emocional:**
- Cada interacción hace un depósito o retiro en las relaciones
- Depósitos: cumplir promesas, pequeñas cortesías, clarificar expectativas
- Retiros: romper promesas, pequeñas descortesías, traicionar confianzas

**Círculo de Influencia vs. Círculo de Preocupación:**
- Enfócate en lo que puedes controlar (Círculo de Influencia)
- No desperdicies energía en lo que no puedes controlar (Círculo de Preocupación)

**Matriz de Gestión del Tiempo:**
- Cuadrante I: Urgente e Importante (Crisis)
- Cuadrante II: No Urgente pero Importante (Prevención, planificación)
- Cuadrante III: Urgente pero No Importante (Interrupciones)
- Cuadrante IV: No Urgente y No Importante (Pérdidas de tiempo)

**Aplicación Práctica:**

**En el Liderazgo:**
- Lidera con el ejemplo y principios
- Desarrolla a otros a través de delegación efectiva
- Crea visión compartida y compromiso

**En las Relaciones:**
- Construye confianza a través de la integridad
- Busca entender antes de ser entendido
- Encuentra soluciones ganar-ganar

**En el Crecimiento Personal:**
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
          content: `Este libro clásico enseña técnicas fundamentales para manejar personas, hacer que te aprecien, ganar a la gente a tu manera de pensar y ser un líder.

**PARTE I: TÉCNICAS FUNDAMENTALES PARA TRATAR CON LA GENTE**

**Principio 1: No Critiques, No Condenes, No Te Quejes**
- La crítica es inútil porque pone a la persona a la defensiva
- La crítica hiere el orgullo, lastima el sentido de importancia
- En lugar de criticar, trata de entender por qué hacen lo que hacen

**Principio 2: Demuestra Aprecio Honesto y Sincero**
- El deseo más profundo del ser humano es sentirse importante
- Aprecia genuinamente las buenas cualidades de otros
- Sé específico en tus elogios y hazlos inmediatamente

**Principio 3: Despierta en la Otra Persona un Deseo Vehemente**
- Habla de lo que la otra persona quiere
- Muestra cómo pueden obtener lo que desean
- Conecta tus ideas con sus motivaciones

**PARTE II: SEIS MANERAS DE AGRADAR A LA GENTE**

**Principio 1: Interésate Genuinamente en Otras Personas**
- Muestra interés real en los demás y sus vidas
- Haz preguntas sobre sus intereses y experiencias
- Recuerda detalles importantes sobre las personas

**Principio 2: Sonríe**
- Una sonrisa genuina comunica: "Me alegra verte"
- Las sonrisas son contagiosas y crean ambiente positivo
- Sonríe incluso cuando hablas por teléfono

**Principio 3: Recuerda que el Nombre de una Persona es el Sonido más Dulce**
- Usa el nombre de la persona frecuentemente en la conversación
- Haz el esfuerzo de aprender y recordar nombres correctamente
- El nombre es parte de la identidad de la persona

**Principio 4: Sé un Buen Oyente. Anima a Otros a Hablar de Sí Mismos**
- Escucha más de lo que hablas
- Haz preguntas que inviten a la persona a compartir
- Muestra interés genuino en lo que dicen

**Principio 5: Habla en Términos de los Intereses de la Otra Persona**
- Descubre qué le interesa a la persona
- Conecta tus conversaciones con sus pasiones
- Investiga sobre sus hobbies y actividades

**Principio 6: Haz que la Otra Persona se Sienta Importante - y Hazlo Sinceramente**
- Reconoce los logros y contribuciones de otros
- Pide su opinión y consejo
- Trata a todos con respeto y dignidad

**PARTE III: LOGRA QUE LA GENTE PIENSE COMO TÚ**

**Principio 1: La Única Forma de Ganar una Discusión es Evitándola**
- Las discusiones rara vez cambian opiniones
- Busca puntos de acuerdo en lugar de diferencias
- Respeta las opiniones de otros

**Principio 2: Demuestra Respeto por las Opiniones Ajenas. Jamás Digas "Estás Equivocado"**
- Evita contradecir directamente a las personas
- Usa frases como "Puede que esté equivocado, pero..."
- Permite que otros mantengan su dignidad

**Principio 3: Si Estás Equivocado, Admítelo Rápida y Enfáticamente**
- Admite tus errores antes que otros te los señalen
- La autocrítica desarma la crítica de otros
- Muestra humildad y disposición a aprender

**Principio 4: Comienza de Manera Amigable**
- Inicia conversaciones difíciles con calidez
- Encuentra terreno común antes de abordar diferencias
- El tono amigable predispone a la cooperación

**Principio 5: Consigue que la Otra Persona Diga "Sí, Sí" Inmediatamente**
- Comienza con preguntas que generen acuerdo
- Construye momentum de acuerdo antes de presentar tu punto
- Evita que la persona se comprometa con el "no"

**Principio 6: Permite que la Otra Persona Hable Mucho**
- Deja que otros expresen completamente sus ideas
- Las personas se convencen más por sus propias palabras
- Escucha para entender, no para rebatir

**PARTE IV: SÉ UN LÍDER**

**Principio 1: Comienza con Elogio y Aprecio Honesto**
- Reconoce primero las fortalezas antes de señalar áreas de mejora
- Crea un ambiente positivo para la retroalimentación
- Las personas son más receptivas después del reconocimiento

**Principio 2: Llama la Atención sobre los Errores de Otros Indirectamente**
- Usa "y" en lugar de "pero" después de un elogio
- Sugiere mejoras sin atacar directamente
- Permite que las personas mantengan su autoestima

**Principio 3: Habla de tus Propios Errores antes de Criticar los de la Otra Persona**
- Comparte tus propias experiencias de error y aprendizaje
- Esto hace que la crítica sea menos amenazante
- Muestra que todos cometemos errores

**Aplicaciones Modernas:**
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
          content: `Los cambios que parecen pequeños e insignificantes al principio se convertirán en resultados extraordinarios si estás dispuesto a mantenerlos durante años. Este es el poder de los hábitos atómicos: pequeños cambios que generan resultados extraordinarios.

**Las Cuatro Leyes del Cambio de Comportamiento:**

**1ª Ley: Hazlo Obvio**
- Usa intenciones de implementación: "Haré [COMPORTAMIENTO] a las [TIEMPO] en [LUGAR]"
- Usa el apilamiento de hábitos: "Después de [HÁBITO ACTUAL], haré [NUEVO HÁBITO]"
- Diseña tu ambiente para hacer obvios los buenos hábitos
- Usa señales visuales para activar los comportamientos deseados

**2ª Ley: Hazlo Atractivo**
- Usa el agrupamiento de tentaciones: combina acciones que quieres hacer con acciones que necesitas hacer
- Únete a una cultura donde tu comportamiento deseado sea normal
- Crea un ritual de motivación antes de hábitos difíciles
- Resalta los beneficios de evitar malos hábitos

**3ª Ley: Hazlo Fácil**
- Reduce la fricción para buenos hábitos y aumenta la fricción para malos hábitos
- Usa la Regla de los Dos Minutos: escala los hábitos hasta que tomen menos de dos minutos
- Prepara tu ambiente para hacer más fáciles las acciones futuras
- Usa la tecnología para automatizar buenos hábitos

**4ª Ley: Hazlo Satisfactorio**
- Usa refuerzo: date recompensas inmediatas por buenos hábitos
- Haz que "no hacer nada" sea disfrutable para hábitos que quieres evitar
- Usa un rastreador de hábitos para visualizar tu progreso
- Nunca falles dos veces: regresa rápidamente después de errores

**Conceptos Clave:**

**Sistemas vs. Objetivos:**
- Los objetivos son sobre los resultados que quieres lograr
- Los sistemas son sobre los procesos que llevan a esos resultados
- Enfócate en sistemas, no en objetivos, para cambios duraderos

**Hábitos Basados en Identidad:**
- Cada acción es un voto por el tipo de persona que deseas ser
- Enfócate en quién quieres ser, no en lo que quieres lograr
- Pregúntate: "¿Qué haría una persona saludable?" o "¿Qué haría una persona organizada?"

**La Meseta del Potencial Latente:**
- Los hábitos a menudo parecen no hacer diferencia hasta que cruzas un umbral crítico
- Los momentos de avance son a menudo el resultado de muchas acciones previas
- Sé paciente con el proceso: los resultados se acumularán con el tiempo

**Aplicaciones Prácticas:**

**Para Construir Buenos Hábitos:**
1. Comienza con hábitos tan pequeños que parezcan triviales
2. Apila nuevos hábitos sobre rutinas existentes
3. Diseña tu ambiente para el éxito
4. Rastrea tu progreso visualmente
5. Celebra pequeñas victorias inmediatamente

**Para Romper Malos Hábitos:**
1. Hazlos invisibles (elimina señales)
2. Hazlos poco atractivos (enfócate en las desventajas)
3. Hazlos difíciles (aumenta la fricción)
4. Hazlos insatisfactorios (crea responsabilidad)

**Tácticas Avanzadas:**
- Usa el apilamiento de hábitos para construir rutinas
- Crea intenciones de implementación para escenarios específicos
- Aplica la Regla de Goldilocks: trabaja en desafíos de dificultad manejable
- Usa el diseño del ambiente para apoyar comportamientos deseados

**El Proceso de Cuatro Pasos:**
1. **Señal**: El disparador que inicia el comportamiento
2. **Anhelo**: La fuerza motivacional detrás de cada hábito
3. **Respuesta**: El hábito real que realizas
4. **Recompensa**: El beneficio que obtienes del hábito

**Estrategias de Implementación:**

**Diseño del Ambiente:**
- Haz obvias las señales para buenos hábitos
- Reduce la fricción para comportamientos deseados
- Usa el contexto para tu ventaja

**Seguimiento del Progreso:**
- Usa un rastreador de hábitos simple
- Enfócate en la consistencia, no en la perfección
- Nunca rompas la cadena dos veces seguidas

**Responsabilidad:**
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
