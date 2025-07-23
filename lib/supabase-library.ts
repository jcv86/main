// Mock data and functions for the library system
export interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  rating: number
  reading_time: string
  difficulty: string
  publication_year: number
  cover_image?: string
  total_pages: number
  created_at: string
  is_free?: boolean
}

export interface BookContent {
  id: string
  book_id: string
  chapter_number: number
  title: string
  content: string
  page_number: number
  created_at: string
}

export interface ReadingProgress {
  id: string
  user_id: string
  book_id: string
  progress_percentage: number
  current_page: number
  last_read_at: string
  created_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  book_id: string
  page_number: number
  note?: string
  created_at: string
}

export interface ReadingStats {
  books_read: number
  total_reading_time: number
  average_progress: number
  reading_streak: number
}

// Mock data - All titles in Spanish
const mockBooks: Book[] = [
  {
    id: "1",
    title: "Hábitos Atómicos",
    author: "James Clear",
    description:
      "Una guía práctica para formar buenos hábitos y romper los malos. Aprende cómo pequeños cambios pueden generar resultados extraordinarios a través de técnicas probadas de formación de hábitos.",
    category: "Productividad",
    rating: 4.8,
    reading_time: "4h 30min",
    difficulty: "Intermedio",
    publication_year: 2018,
    total_pages: 320,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Trabajo Profundo",
    author: "Cal Newport",
    description:
      "Reglas para el éxito enfocado en un mundo distraído. Aprende a desarrollar la habilidad más valiosa del siglo XXI: la capacidad de concentrarse sin distracciones en tareas cognitivamente demandantes.",
    category: "Productividad",
    rating: 4.7,
    reading_time: "4h 45min",
    difficulty: "Intermedio",
    publication_year: 2016,
    total_pages: 296,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Vayamos Adelante",
    author: "Sheryl Sandberg",
    description:
      "Las mujeres, el trabajo y la voluntad de liderar. Un libro inspirador sobre liderazgo femenino y cómo superar los obstáculos en el mundo profesional.",
    category: "Liderazgo",
    rating: 4.5,
    reading_time: "3h 20min",
    difficulty: "Fácil",
    publication_year: 2013,
    total_pages: 240,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Inteligencia Emocional 2.0",
    author: "Travis Bradberry",
    description:
      "Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales. Descubre cómo la inteligencia emocional puede transformar tu carrera.",
    category: "Habilidades Blandas",
    rating: 4.4,
    reading_time: "3h 50min",
    difficulty: "Fácil",
    publication_year: 2009,
    total_pages: 280,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "La Startup Lean",
    author: "Eric Ries",
    description:
      "Cómo los emprendedores de hoy usan la innovación continua para crear negocios radicalmente exitosos. Metodología para construir startups sostenibles.",
    category: "Negocios",
    rating: 4.3,
    reading_time: "4h 10min",
    difficulty: "Intermedio",
    publication_year: 2011,
    total_pages: 336,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    description:
      "Lecciones poderosas de cambio personal. Los principios fundamentales para el éxito personal y profesional que han transformado millones de vidas. ¡LIBRO COMPLETO GRATIS!",
    category: "Desarrollo Personal",
    rating: 4.8,
    reading_time: "5h 45min",
    difficulty: "Intermedio",
    publication_year: 1989,
    total_pages: 432,
    created_at: new Date().toISOString(),
    is_free: true,
  },
  {
    id: "7",
    title: "Mentalidad",
    author: "Carol S. Dweck",
    description:
      "La nueva psicología del éxito. Descubre cómo una mentalidad de crecimiento puede transformar tu vida personal y profesional.",
    category: "Desarrollo Personal",
    rating: 4.5,
    reading_time: "4h 15min",
    difficulty: "Fácil",
    publication_year: 2006,
    total_pages: 276,
    created_at: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Empresas que Sobresalen",
    author: "Jim Collins",
    description:
      "Por qué algunas empresas dan el salto... y otras no. Análisis profundo de las características que distinguen a las empresas excepcionales.",
    category: "Liderazgo",
    rating: 4.7,
    reading_time: "6h 30min",
    difficulty: "Avanzado",
    publication_year: 2001,
    total_pages: 400,
    created_at: new Date().toISOString(),
  },
  {
    id: "9",
    title: "El Poder del Ahora",
    author: "Eckhart Tolle",
    description:
      "Una guía hacia la iluminación espiritual. Aprende a vivir en el presente y libérate del dolor emocional del pasado y la ansiedad del futuro.",
    category: "Desarrollo Personal",
    rating: 4.3,
    reading_time: "3h 40min",
    difficulty: "Intermedio",
    publication_year: 1997,
    total_pages: 236,
    created_at: new Date().toISOString(),
  },
  {
    id: "10",
    title: "La Semana Laboral de 4 Horas",
    author: "Timothy Ferriss",
    description:
      "Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos. Estrategias para automatizar tu vida y trabajar menos.",
    category: "Productividad",
    rating: 4.2,
    reading_time: "4h 20min",
    difficulty: "Intermedio",
    publication_year: 2007,
    total_pages: 308,
    created_at: new Date().toISOString(),
  },
  {
    id: "11",
    title: "Conversaciones Cruciales",
    author: "Kerry Patterson",
    description:
      "Herramientas para hablar cuando las apuestas son altas. Aprende a manejar conversaciones difíciles con confianza y obtener resultados positivos.",
    category: "Habilidades Blandas",
    rating: 4.6,
    reading_time: "4h 10min",
    difficulty: "Intermedio",
    publication_year: 2002,
    total_pages: 288,
    created_at: new Date().toISOString(),
  },
  {
    id: "12",
    title: "De Cero a Uno",
    author: "Peter Thiel",
    description:
      "Notas sobre startups, o cómo construir el futuro. Perspectivas únicas sobre innovación y creación de valor en el mundo empresarial.",
    category: "Negocios",
    rating: 4.4,
    reading_time: "3h 30min",
    difficulty: "Avanzado",
    publication_year: 2014,
    total_pages: 224,
    created_at: new Date().toISOString(),
  },
]

// Mock book content with rich, detailed content for all books
const mockBookContent: { [key: string]: BookContent[] } = {
  "1": [
    {
      id: "content-1-1",
      book_id: "1",
      chapter_number: 1,
      title: "Los Fundamentos: Por qué los pequeños cambios marcan una gran diferencia",
      content: `
        <h2>Capítulo 1: Los Fundamentos</h2>
        <p><strong>Los hábitos son el interés compuesto de la superación personal.</strong> De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.</p>
        
        <p>Parecen marcar poca diferencia en un día cualquiera y, sin embargo, el impacto que generan a lo largo de los meses y años puede ser enorme. Solo cuando miramos hacia atrás —dos, cinco o quizás diez años después— el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente evidente.</p>
        
        <h3>🚀 El poder de los pequeños cambios</h3>
        <p>Si puedes mejorar tan solo un <strong>1% cada día</strong> durante un año, terminarás siendo treinta y siete veces mejor al final del período. Por el contrario, si empeoras un 1% cada día durante un año, descenderás casi hasta cero.</p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <h4 style="color: #1e40af; margin-top: 0;">📊 La matemática del 1%</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>1% mejor cada día:</strong> 1.01^365 = 37.78</li>
            <li><strong>1% peor cada día:</strong> 0.99^365 = 0.03</li>
          </ul>
        </div>
        
        <p>Los pequeños cambios a menudo parecen no marcar diferencia hasta que cruzas un umbral crítico. Los resultados más poderosos de cualquier proceso de cambio compuesto se retrasan. <em>Necesitas ser paciente.</em></p>
        
        <blockquote style="border-left: 4px solid #3b82f6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #f8fafc; padding: 20px; border-radius: 8px;">
          "El éxito es el producto de hábitos diarios, no de transformaciones de una sola vez."
        </blockquote>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-2",
      book_id: "1",
      chapter_number: 2,
      title: "Cómo tus hábitos moldean tu identidad (y viceversa)",
      content: `
        <h2>Capítulo 2: Cómo tus hábitos moldean tu identidad</h2>
        <p>Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar que son como las <strong>capas de una cebolla</strong>.</p>
        
        <h3>🧅 Los tres niveles del cambio</h3>
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <ol style="margin-bottom: 0;">
            <li><strong>🎯 Cambiar tus resultados:</strong> Este nivel se refiere a cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato.</li>
            <li><strong>⚙️ Cambiar tu proceso:</strong> Este nivel se refiere a cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, organizar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación.</li>
            <li><strong>🧠 Cambiar tu identidad:</strong> Este nivel se refiere a cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y sobre otros.</li>
          </ol>
        </div>
        
        <p><strong>Cada acción que realizas es un voto por el tipo de persona que deseas convertirte.</strong> Ninguna instancia individual transformará tus creencias, pero a medida que los votos se acumulan, también lo hace la evidencia de tu nueva identidad.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Cada hábito no solo obtiene resultados, sino que también te enseña algo mucho más importante: a confiar en ti mismo."
        </blockquote>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
  "2": [
    {
      id: "content-2-1",
      book_id: "2",
      chapter_number: 1,
      title: "Trabajo Profundo es Valioso",
      content: `
        <h2>Capítulo 1: Trabajo Profundo es Valioso</h2>
        <p><strong>Trabajo Profundo:</strong> Actividades profesionales realizadas en un estado de concentración libre de distracciones que empujan tus capacidades cognitivas a su límite. Estos esfuerzos crean nuevo valor, mejoran tu habilidad y son difíciles de replicar.</p>
        
        <h3>🌊 La Nueva Economía del Conocimiento</h3>
        <p>Estamos en medio de una transformación económica. La capacidad de realizar trabajo profundo se está volviendo cada vez más <strong>rara</strong> al mismo tiempo que se vuelve cada vez más <strong>valiosa</strong> en nuestra economía.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">⚠️ La Paradoja del Trabajo Profundo</h4>
          <p style="margin-bottom: 0;">Mientras que el trabajo profundo se vuelve más valioso, nuestra capacidad para hacerlo se está deteriorando. Las distracciones constantes de emails, redes sociales y reuniones están fragmentando nuestra atención.</p>
        </div>
        
        <h3>🏆 Los Tres Grupos que Prosperarán</h3>
        <p>En la nueva economía, tres grupos tendrán una ventaja particular:</p>
        
        <ol>
          <li><strong>Los Trabajadores de Alta Habilidad:</strong> Aquellos que pueden trabajar bien, y creativamente, con tecnologías inteligentes.</li>
          <li><strong>Las Superestrellas:</strong> Aquellos que son los mejores en lo que hacen.</li>
          <li><strong>Los Propietarios:</strong> Aquellos con acceso al capital.</li>
        </ol>
        
        <p>Para unirte a los primeros dos grupos (los únicos accesibles para la mayoría), necesitas dominar dos habilidades fundamentales:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🎯 Las Dos Habilidades Fundamentales</h4>
          <ol style="margin-bottom: 0;">
            <li><strong>La capacidad de dominar rápidamente cosas difíciles.</strong></li>
            <li><strong>La capacidad de producir a un nivel de élite, en términos de calidad y velocidad.</strong></li>
          </ol>
        </div>
        
        <p>Ambas habilidades dependen de tu capacidad para realizar trabajo profundo. Si no puedes aprender, no puedes prosperar. Si no puedes producir, no importa cuán hábil o talentoso seas.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "El trabajo profundo no es solo una habilidad útil, es un superpoder en nuestra economía cada vez más competitiva."
        </blockquote>
        
        <h3>📱 El Enemigo: Trabajo Superficial</h3>
        <p><strong>Trabajo Superficial:</strong> Tareas de estilo logístico, a menudo realizadas mientras se está distraído. Estos esfuerzos tienden a no crear mucho valor nuevo en el mundo y son fáciles de replicar.</p>
        
        <p>El trabajo superficial es inevitable, pero debe ser minimizado. El problema surge cuando el trabajo superficial domina tu horario y empuja el trabajo profundo hacia los márgenes.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-2-2",
      book_id: "2",
      chapter_number: 2,
      title: "Trabajo Profundo es Raro",
      content: `
        <h2>Capítulo 2: Trabajo Profundo es Raro</h2>
        <p>A pesar de la creciente evidencia de que el trabajo profundo es valioso, muchas organizaciones están adoptando prácticas que lo hacen más difícil. Esta tendencia hacia lo superficial, en otras palabras, no es accidental: está siendo impulsada por fuerzas reales.</p>
        
        <h3>🏢 Las Fuerzas que Conspiran Contra el Trabajo Profundo</h3>
        
        <h4>📧 1. La Métrica de la Productividad Proxy</h4>
        <p>En ausencia de indicadores claros de lo que significa ser productivo y valioso en su trabajo, muchos trabajadores del conocimiento recurren a un <strong>proxy industrial</strong>: hacer muchas cosas de manera visible.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">❌ Señales de Productividad Proxy</h4>
          <ul style="margin-bottom: 0;">
            <li>Responder emails rápidamente</li>
            <li>Estar presente en muchas reuniones</li>
            <li>Mantener una presencia activa en redes sociales corporativas</li>
            <li>Trabajar largas horas visiblemente</li>
          </ul>
        </div>
        
        <h4>🌐 2. El Principio de Menor Resistencia</h4>
        <p>En un entorno empresarial, sin retroalimentación clara sobre el impacto de varios comportamientos en el resultado final, tendemos hacia comportamientos que son más fáciles en el momento.</p>
        
        <p>Es más fácil enviar un email rápido que concentrarse en un problema difícil durante una hora. Es más fácil programar una reunión que pensar profundamente sobre un tema complejo.</p>
        
        <h4>📱 3. El Tecnologismo</h4>
        <p>Nuestra cultura ha desarrollado una creencia de que si una herramienta de red ofrece <em>cualquier</em> beneficio posible, o si no usarla te haría parecer anticuado, entonces debes adoptarla.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "La cultura de la conectividad constante es en realidad disfuncional, pero hemos llegado a aceptarla como necesaria para el éxito."
        </blockquote>
        
        <h3>🎭 El Mito de la Multitarea</h3>
        <p>La investigación neurocientífica ha demostrado que el cerebro humano no puede realizar múltiples tareas cognitivamente demandantes al mismo tiempo. Lo que llamamos "multitarea" es en realidad <strong>cambio de tareas</strong>.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🧠 La Ciencia del Cambio de Atención</h4>
          <p style="margin-bottom: 0;">Cuando cambias de la Tarea A a la Tarea B, tu atención no sigue inmediatamente. Un residuo de tu atención permanece atascado pensando en la tarea original. Este residuo se vuelve especialmente espeso si tu trabajo en la Tarea A estaba inacabado.</p>
        </div>
        
        <p>Este <strong>"residuo de atención"</strong> puede reducir significativamente tu rendimiento cognitivo. Para producir a tu máximo nivel, necesitas trabajar durante períodos extendidos con total concentración en una sola tarea libre de distracciones.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
  "3": [
    {
      id: "content-3-1",
      book_id: "3",
      chapter_number: 1,
      title: "La Mesa de Liderazgo",
      content: `
        <h2>Capítulo 1: La Mesa de Liderazgo</h2>
        <p>Una de las metáforas más poderosas que uso para describir el liderazgo es la imagen de una <strong>"mesa de liderazgo"</strong>. Esta mesa representa los espacios donde se toman las decisiones importantes, donde se establecen las políticas y donde se determina el futuro de las organizaciones.</p>
        
        <h3>🪑 ¿Quién está en la Mesa?</h3>
        <p>Tradicionalmente, las mesas de liderazgo han estado dominadas por hombres. Las mujeres, cuando están presentes, a menudo se encuentran en los márgenes, luchando por hacer oír sus voces y por que sus ideas sean tomadas en serio.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">📊 Las Estadísticas Reveladoras</h4>
          <ul style="margin-bottom: 0;">
            <li>Las mujeres representan solo el <strong>20%</strong> de los puestos de liderazgo senior</li>
            <li>En las empresas Fortune 500, solo el <strong>6%</strong> de los CEOs son mujeres</li>
            <li>Las mujeres ganan <strong>77 centavos</strong> por cada dólar que ganan los hombres</li>
            <li>Solo el <strong>18%</strong> de los miembros del Congreso son mujeres</li>
          </ul>
        </div>
        
        <h3>💪 Vayamos Adelante</h3>
        <p>El título de este libro, "Vayamos Adelante", es tanto una invitación como un desafío. Es una invitación para que las mujeres se inclinen hacia sus ambiciones, persigan sus metas con determinación y no se conformen con menos de lo que merecen.</p>
        
        <p>Pero también es un desafío para que reconozcamos y abordemos las barreras sistémicas que impiden que las mujeres alcancen su pleno potencial en el lugar de trabajo.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Una mujer con voz es, por definición, una mujer fuerte. Pero la búsqueda de encontrar esa voz puede ser notablemente difícil."
        </blockquote>
        
        <h3>🎯 Los Tres Pilares del Liderazgo Femenino</h3>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">1. 🗣️ Encontrar Tu Voz</h4>
          <p>Muchas mujeres luchan por hablar en reuniones, expresar sus ideas con confianza y defender sus puntos de vista. Encontrar tu voz significa desarrollar la confianza para comunicarte de manera efectiva y asertiva.</p>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">2. 🤝 Construir Alianzas</h4>
          <p>El liderazgo no es un deporte individual. Las mujeres exitosas entienden la importancia de construir redes sólidas, encontrar mentores y patrocinadores, y crear alianzas estratégicas.</p>
        </div>
        
        <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #be185d; margin-top: 0;">3. 🎭 Superar el Síndrome del Impostor</h4>
          <p>Muchas mujeres exitosas luchan con sentimientos de inadecuación, preguntándose si realmente merecen estar donde están. Superar estos sentimientos es crucial para el liderazgo efectivo.</p>
        </div>
        
        <h3>🌟 El Poder de los Modelos a Seguir</h3>
        <p>Una de las razones por las que escribí este libro es porque creo firmemente en el poder de los modelos a seguir. Cuando las mujeres jóvenes ven a otras mujeres en posiciones de liderazgo, se expande su sentido de lo que es posible.</p>
        
        <p>No se puede ser lo que no se puede ver. Por eso es tan importante que más mujeres ocupen posiciones de liderazgo visible y que compartan sus historias, tanto los éxitos como las luchas.</p>
        
        <h3>🚀 El Camino Hacia Adelante</h3>
        <p>El progreso hacia la igualdad de género en el liderazgo no será automático. Requerirá esfuerzo consciente, tanto de las mujeres que aspiran a liderar como de las organizaciones que deben crear entornos más inclusivos.</p>
        
        <p>Cada mujer que se inclina hacia adelante, que toma riesgos calculados y que persigue oportunidades de liderazgo, está allanando el camino para las que vienen detrás.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-2",
      book_id: "3",
      chapter_number: 2,
      title: "Siéntate a la Mesa",
      content: `
        <h2>Capítulo 2: Siéntate a la Mesa</h2>
        <p>Hace varios años, estaba dando una charla a un grupo de ejecutivos cuando noté algo que me llamó la atención. Las mujeres en la audiencia estaban sentadas en las sillas alrededor del perímetro de la sala, mientras que los hombres ocupaban las sillas en la mesa de conferencias en el centro.</p>
        
        <p>Esta imagen se ha quedado conmigo porque es una metáfora perfecta de lo que sucede en muchos lugares de trabajo: <strong>las mujeres literalmente no se sientan a la mesa</strong>.</p>
        
        <h3>🪑 La Metáfora de la Mesa</h3>
        <p>Sentarse a la mesa es tanto literal como figurativo. Significa:</p>
        
        <ul>
          <li><strong>Físicamente</strong> tomar un asiento en la mesa de conferencias, no en las sillas del perímetro</li>
          <li><strong>Profesionalmente</strong> buscar oportunidades de liderazgo y responsabilidad</li>
          <li><strong>Personalmente</strong> creer que mereces estar ahí</li>
        </ul>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">🚫 Las Barreras Internas</h4>
          <p>A menudo, las barreras más grandes que enfrentan las mujeres no son externas, sino internas:</p>
          <ul style="margin-bottom: 0;">
            <li><strong>Síndrome del Impostor:</strong> "No pertenezco aquí"</li>
            <li><strong>Perfeccionismo:</strong> "No estoy lista hasta que sea perfecta"</li>
            <li><strong>Minimización:</strong> "No quiero parecer demasiado ambiciosa"</li>
            <li><strong>Comparación:</strong> "Todos los demás son más inteligentes que yo"</li>
          </ul>
        </div>
        
        <h3>💡 La Diferencia de Confianza</h3>
        <p>Los estudios muestran que los hombres tienden a sobrestimar sus habilidades y rendimiento, mientras que las mujeres tienden a subestimarlas. Esta diferencia de confianza tiene consecuencias reales:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">📈 Datos sobre la Confianza</h4>
          <ul style="margin-bottom: 0;">
            <li>Los hombres solicitan un trabajo cuando cumplen el <strong>60%</strong> de los requisitos</li>
            <li>Las mujeres solicitan solo cuando cumplen el <strong>100%</strong> de los requisitos</li>
            <li>Los hombres atribuyen el éxito a sus habilidades innatas</li>
            <li>Las mujeres atribuyen el éxito a la suerte o ayuda externa</li>
          </ul>
        </div>
        
        <h3>🎯 Estrategias para Sentarse a la Mesa</h3>
        
        <h4>1. 🗣️ Habla en las Reuniones</h4>
        <p>Las investigaciones muestran que cuando las mujeres hablan tanto como los hombres en las reuniones, son percibidas como hablando más. Esto no debería disuadirte de participar, sino hacerte consciente del sesgo.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">💬 Técnicas para Hablar Efectivamente</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Prepárate:</strong> Ten 2-3 puntos clave listos antes de la reunión</li>
            <li><strong>Habla temprano:</strong> Contribuye en los primeros 10 minutos</li>
            <li><strong>Usa declaraciones, no preguntas:</strong> "Creo que..." en lugar de "¿No creen que...?"</li>
            <li><strong>Repite puntos importantes:</strong> "Como mencioné antes..."</li>
          </ul>
        </div>
        
        <h4>2. 🎯 Busca Oportunidades de Estiramiento</h4>
        <p>No esperes a que te ofrezcan oportunidades. Busca activamente proyectos que te desafíen y te permitan crecer, incluso si no te sientes 100% preparada.</p>
        
        <h4>3. 🤝 Encuentra Patrocinadores</h4>
        <p>Un mentor te da consejos. Un patrocinador aboga por ti cuando no estás en la sala. Los patrocinadores son cruciales para el avance profesional.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Nadie llega al éxito solo. Incluso los llaneros solitarios tenían al Tonto."
        </blockquote>
        
        <h3>🌟 Cambia Tu Mentalidad</h3>
        <p>En lugar de preguntarte "¿Merezco estar aquí?", pregúntate "¿Qué puedo contribuir?" Este cambio de mentalidad te ayuda a enfocarte en el valor que aportas en lugar de en tus inseguridades.</p>
        
        <p>Recuerda: si estás en la sala, es porque alguien creyó que perteneces ahí. Ahora es tu trabajo creerlo también.</p>
        
        <h3>🚀 El Efecto Dominó</h3>
        <p>Cuando una mujer se sienta a la mesa con confianza, no solo se beneficia ella misma. Crea un efecto dominó que:</p>
        
        <ul>
          <li>Inspira a otras mujeres a hacer lo mismo</li>
          <li>Cambia las percepciones sobre el liderazgo femenino</li>
          <li>Mejora la toma de decisiones del grupo (los equipos diversos toman mejores decisiones)</li>
          <li>Crea un entorno más inclusivo para todos</li>
        </ul>
        
        <p>Tu presencia en la mesa no es solo sobre ti. Es sobre todas las mujeres que vendrán después de ti.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-3",
      book_id: "3",
      chapter_number: 3,
      title: "El Éxito y la Simpatía",
      content: `
        <h2>Capítulo 3: El Éxito y la Simpatía</h2>
        <p>Existe un dilema fundamental que enfrentan las mujeres en el lugar de trabajo, uno que rara vez afecta a los hombres de la misma manera: <strong>el dilema entre el éxito y la simpatía</strong>.</p>
        
        <p>Para los hombres, el éxito y la simpatía están positivamente correlacionados. Cuanto más exitoso es un hombre, más le gusta a la gente. Para las mujeres, es lo contrario. El éxito y la simpatía están negativamente correlacionados.</p>
        
        <h3>📊 La Investigación de Heidi/Howard</h3>
        <p>Un estudio fascinante ilustra este punto. Los investigadores dieron a los estudiantes de MBA un caso de estudio sobre un empresario exitoso. La mitad de los estudiantes leyó sobre "Heidi Roizen" y la otra mitad sobre "Howard Roizen" - exactamente la misma historia, solo cambió el nombre.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">🔍 Los Resultados Reveladores</h4>
          <ul style="margin-bottom: 0;">
            <li>Ambos grupos calificaron a Heidi y Howard como <strong>igualmente competentes</strong></li>
            <li>Pero Howard fue visto como más <strong>simpático</strong> y como alguien con quien querrían trabajar</li>
            <li>Heidi fue vista como <strong>egoísta</strong> y "no es el tipo de persona con la que querrías trabajar"</li>
            <li>La misma historia, diferentes percepciones basadas solo en el género</li>
          </ul>
        </div>
        
        <h3>⚖️ El Doble Vínculo</h3>
        <p>Las mujeres enfrentan lo que los psicólogos llaman un "doble vínculo":</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">🎭 El Dilema Imposible</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Si eres asertiva:</strong> Eres vista como "mandona" o "agresiva"</li>
            <li><strong>Si no eres asertiva:</strong> Eres vista como "débil" o "no material de liderazgo"</li>
            <li><strong>Si tienes éxito:</strong> Eres menos simpática</li>
            <li><strong>Si eres simpática:</strong> Eres vista como menos competente</li>
          </ul>
        </div>
        
        <h3>🎯 Estrategias para Navegar el Dilema</h3>
        
        <h4>1. 🤝 Combina Competencia con Calidez</h4>
        <p>Las investigaciones muestran que las mujeres pueden mitigar las reacciones negativas combinando señales de competencia con señales de calidez y preocupación por otros.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">💡 Técnicas Prácticas</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Sonríe genuinamente</strong> cuando sea apropiado</li>
            <li><strong>Usa "nosotros"</strong> en lugar de "yo" cuando sea posible</li>
            <li><strong>Reconoce las contribuciones</strong> de otros</li>
            <li><strong>Muestra preocupación</strong> por el bienestar del equipo</li>
            <li><strong>Explica tu razonamiento</strong> detrás de decisiones difíciles</li>
          </ul>
        </div>
        
        <h4>2. 🎪 Usa el "Poder Suave"</h4>
        <p>El poder suave es la capacidad de influir a través de la persuasión y el atractivo en lugar de la coerción. Las mujeres a menudo son más efectivas usando estrategias de poder suave.</p>
        
        <h4>3. 🛡️ Desarrolla una Piel Gruesa</h4>
        <p>Desafortunadamente, parte de navegar este dilema requiere desarrollar resistencia a las críticas injustas. No todas las reacciones negativas son válidas o merecen tu atención.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "No puedes complacer a todos, así que no trates de hacerlo. En su lugar, enfócate en ser auténtica y efectiva."
        </blockquote>
        
        <h3>🌍 El Costo Social del Liderazgo Femenino</h3>
        <p>Es importante reconocer que existe un costo social real para las mujeres que buscan posiciones de liderazgo. Este costo no es justo, pero es real, y las mujeres deben estar preparadas para enfrentarlo.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">💪 Construyendo Resistencia</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Encuentra tu tribu:</strong> Rodéate de personas que te apoyen</li>
            <li><strong>Celebra tus éxitos:</strong> No minimices tus logros</li>
            <li><strong>Aprende de las críticas constructivas:</strong> Pero ignora las destructivas</li>
            <li><strong>Mantén tu perspectiva:</strong> Recuerda por qué estás haciendo esto</li>
          </ul>
        </div>
        
        <h3>🔄 Cambiando las Reglas del Juego</h3>
        <p>Aunque las mujeres individuales pueden usar estrategias para navegar el dilema éxito-simpatía, la solución real requiere un cambio sistémico. Necesitamos:</p>
        
        <ul>
          <li><strong>Conciencia:</strong> Reconocer que estos sesgos existen</li>
          <li><strong>Educación:</strong> Entrenar a gerentes sobre sesgos inconscientes</li>
          <li><strong>Políticas:</strong> Implementar procesos de evaluación más objetivos</li>
          <li><strong>Cultura:</strong> Crear entornos donde se valore la diversidad de estilos de liderazgo</li>
        </ul>
        
        <h3>🌟 El Futuro del Liderazgo</h3>
        <p>Imagina un mundo donde las mujeres puedan ser exitosas sin sacrificar la simpatía, donde la competencia y la calidez no sean vistas como mutuamente excluyentes, donde el liderazgo auténtico sea valorado independientemente del género.</p>
        
        <p>Ese mundo es posible, pero requerirá que tanto hombres como mujeres trabajen juntos para desafiar los estereotipos y crear nuevas normas. Cada mujer que navega exitosamente este dilema está ayudando a construir ese futuro.</p>
      `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
  ],
  "4": [
    {
      id: "content-4-1",
      book_id: "4",
      chapter_number: 1,
      title: "¿Qué es la Inteligencia Emocional?",
      content: `
        <h2>Capítulo 1: ¿Qué es la Inteligencia Emocional?</h2>
        <p>La <strong>Inteligencia Emocional (IE)</strong> es tu capacidad para reconocer y comprender las emociones en ti mismo y en otros, y tu habilidad para usar esta conciencia para manejar tu comportamiento y relaciones.</p>
        
        <p>A diferencia del IQ, que es fijo, la IE es una habilidad flexible que puedes aprender y mejorar con práctica. De hecho, la IE es responsable del <strong>58% del rendimiento laboral</strong> en todos los tipos de trabajos.</p>
        
        <h3>🧠 Los Cuatro Dominios de la IE</h3>
        <p>La inteligencia emocional se compone de cuatro habilidades fundamentales que se agrupan en dos competencias principales:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔍 Competencia Personal</h4>
          <p><strong>1. Autoconciencia:</strong> Tu capacidad para reconocer y comprender tus propias emociones.</p>
          <p><strong>2. Autorregulación:</strong> Tu capacidad para manejar tus emociones de manera efectiva.</p>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🤝 Competencia Social</h4>
          <p><strong>3. Conciencia Social:</strong> Tu capacidad para reconocer y comprender las emociones de otros.</p>
          <p><strong>4. Gestión de Relaciones:</strong> Tu capacidad para manejar las interacciones con otros de manera efectiva.</p>
        </div>
        
        <h3>📊 ¿Por qué Importa la IE?</h3>
        <p>Las investigaciones han demostrado que la inteligencia emocional es un predictor más fuerte del éxito que el IQ. Aquí están los datos:</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">🎯 Estadísticas Impactantes</h4>
          <ul style="margin-bottom: 0;">
            <li>Solo <strong>36%</strong> de las personas pueden identificar sus emociones con precisión</li>
            <li>Las personas con alta IE ganan un promedio de <strong>$1,300 más</strong> por año</li>
            <li>El <strong>90%</strong> de los mejores ejecutivos tienen alta inteligencia emocional</li>
            <li>La IE es responsable del <strong>58%</strong> del rendimiento laboral</li>
          </ul>
        </div>
        
        <h3>🎭 El Secuestro Emocional</h3>
        <p>Cuando experimentas una emoción intensa, tu cerebro emocional (la amígdala) puede "secuestrar" tu cerebro racional (la corteza prefrontal). Esto resulta en reacciones impulsivas que a menudo lamentamos después.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Entre el estímulo y la respuesta hay un espacio. En ese espacio está nuestro poder de elegir nuestra respuesta. En nuestra respuesta yace nuestro crecimiento y nuestra libertad." - Viktor Frankl
        </blockquote>
        
        <h3>🔄 El Proceso de la IE</h3>
        <p>La inteligencia emocional sigue un proceso de cuatro pasos:</p>
        
        <ol>
          <li><strong>🎯 Reconocer:</strong> ¿Qué estoy sintiendo?</li>
          <li><strong>🤔 Comprender:</strong> ¿Por qué estoy sintiendo esto?</li>
          <li><strong>📝 Etiquetar:</strong> ¿Cómo puedo nombrar esta emoción específicamente?</li>
          <li><strong>⚡ Gestionar:</strong> ¿Cómo puedo responder de manera efectiva?</li>
        </ol>
        
        <h3>🌡️ El Termómetro Emocional</h3>
        <p>Imagina tus emociones como un termómetro. Cuando la "temperatura" emocional sube demasiado, tu capacidad de pensar claramente disminuye. La clave es:</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🌡️ Zonas de Temperatura Emocional</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Zona Verde (1-3):</strong> Calma, enfocado, pensamiento claro</li>
            <li><strong>Zona Amarilla (4-6):</strong> Alerta, energizado, pero aún controlado</li>
            <li><strong>Zona Roja (7-10):</strong> Intenso, reactivo, pensamiento nublado</li>
          </ul>
        </div>
        
        <p>El objetivo no es evitar todas las emociones intensas, sino aprender a reconocerlas temprano y gestionarlas efectivamente.</p>
        
        <h3>🧪 La Neurociencia de las Emociones</h3>
        <p>Las emociones son reacciones químicas en tu cerebro. Cuando experimentas una emoción, tu cerebro libera químicos que duran aproximadamente <strong>6 segundos</strong> en tu torrente sanguíneo.</p>
        
        <p>Esto significa que la sensación física inicial de cualquier emoción dura solo 6 segundos. Si continúas sintiéndola después de eso, es porque estás eligiendo (consciente o inconscientemente) recrear esa reacción química.</p>
        
        <h3>🎯 Desarrollando tu IE</h3>
        <p>La buena noticia es que la inteligencia emocional se puede desarrollar. A diferencia del IQ, que permanece relativamente estable a lo largo de la vida, tu IE puede mejorar continuamente con práctica y esfuerzo consciente.</p>
        
        <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #be185d; margin-top: 0;">💪 Ejercicios Diarios para la IE</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Check-in emocional:</strong> Pregúntate "¿Qué estoy sintiendo?" 3 veces al día</li>
            <li><strong>Pausa antes de reaccionar:</strong> Cuenta hasta 6 antes de responder</li>
            <li><strong>Observa a otros:</strong> Practica leer las emociones de las personas</li>
            <li><strong>Reflexiona:</strong> Al final del día, revisa tus reacciones emocionales</li>
          </ul>
        </div>
        
        <p>En los próximos capítulos, exploraremos cada uno de los cuatro dominios de la inteligencia emocional en detalle y aprenderás estrategias específicas para desarrollar cada habilidad.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-4-2",
      book_id: "4",
      chapter_number: 2,
      title: "Autoconciencia: El Fundamento de la IE",
      content: `
        <h2>Capítulo 2: Autoconciencia - El Fundamento de la IE</h2>
        <p>La <strong>autoconciencia</strong> es la piedra angular de la inteligencia emocional. Es tu capacidad para reconocer y comprender tus propias emociones en el momento en que las experimentas.</p>
        
        <p>Sin autoconciencia, es imposible desarrollar las otras habilidades de la IE. No puedes manejar lo que no reconoces, y no puedes entender a otros si no te entiendes a ti mismo.</p>
        
        <h3>🎯 Los Dos Componentes de la Autoconciencia</h3>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">1. 🔍 Conciencia Emocional</h4>
          <p>La capacidad de reconocer tus emociones y sus efectos. Esto incluye:</p>
          <ul style="margin-bottom: 0;">
            <li>Identificar emociones específicas (no solo "me siento mal")</li>
            <li>Reconocer los desencadenantes de tus emociones</li>
            <li>Entender cómo tus emociones afectan tu comportamiento</li>
            <li>Notar las sensaciones físicas asociadas con las emociones</li>
          </ul>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">2. 🎭 Autoevaluación Precisa</h4>
          <p>Una evaluación realista de tus fortalezas y limitaciones. Esto incluye:</p>
          <ul style="margin-bottom: 0;">
            <li>Conocer tus fortalezas y cómo aprovecharlas</li>
            <li>Reconocer tus áreas de mejora sin negación</li>
            <li>Entender tu impacto en otros</li>
            <li>Buscar retroalimentación activamente</li>
          </ul>
        </div>
        
        <h3>🚫 Los Enemigos de la Autoconciencia</h3>
        <p>Varios factores pueden obstaculizar tu autoconciencia:</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">⚠️ Obstáculos Comunes</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Negación:</strong> "No estoy enojado" (cuando claramente lo estás)</li>
            <li><strong>Racionalización:</strong> Justificar comportamientos en lugar de examinarlos</li>
            <li><strong>Proyección:</strong> Culpar a otros por tus reacciones emocionales</li>
            <li><strong>Evitación:</strong> Mantenerse ocupado para no enfrentar emociones difíciles</li>
            <li><strong>Multitarea:</strong> Estar tan distraído que no notas tus emociones</li>
          </ul>
        </div>
        
        <h3>📝 El Vocabulario Emocional</h3>
        <p>La mayoría de las personas tienen un vocabulario emocional limitado. Tendemos a usar palabras generales como "bien", "mal", "estresado" o "feliz". Desarrollar un vocabulario emocional más rico te ayuda a identificar emociones con mayor precisión.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">🎨 Expandiendo tu Paleta Emocional</h4>
          <p><strong>En lugar de "enojado", podrías estar:</strong></p>
          <ul>
            <li>Frustrado, irritado, molesto, furioso, indignado, resentido</li>
          </ul>
          <p><strong>En lugar de "triste", podrías estar:</strong></p>
          <ul>
            <li>Melancólico, desanimado, abatido, afligido, nostálgico, desilusionado</li>
          </ul>
          <p><strong>En lugar de "feliz", podrías estar:</strong></p>
          <ul style="margin-bottom: 0;">
            <li>Eufórico, contento, satisfecho, jubiloso, esperanzado, orgulloso</li>
          </ul>
        </div>
        
        <h3>🧘 Técnicas para Desarrollar Autoconciencia</h3>
        
        <h4>1. 🕐 El Check-in de los 3 Momentos</h4>
        <p>Establece tres momentos específicos cada día para preguntarte: "¿Qué estoy sintiendo ahora mismo?" Sé específico y usa tu vocabulario emocional expandido.</p>
        
        <h4>2. 📱 La Técnica del Semáforo</h4>
        <p>Cuando sientas una emoción intensa:</p>
        <ul>
          <li><strong>🔴 Rojo - PARA:</strong> Detente y reconoce que estás experimentando una emoción</li>
          <li><strong>🟡 Amarillo - PIENSA:</strong> ¿Qué estoy sintiendo exactamente? ¿Por qué?</li>
          <li><strong>🟢 Verde - PROCEDE:</strong> ¿Cómo quiero responder?</li>
        </ul>
        
        <h4>3. 📔 El Diario Emocional</h4>
        <p>Al final de cada día, escribe sobre:</p>
        <ul>
          <li>Las emociones más fuertes que experimentaste</li>
          <li>Qué las desencadenó</li>
          <li>Cómo respondiste</li>
          <li>Qué harías diferente</li>
        </ul>
        
        <h4>4. 🎯 La Técnica del Observador</h4>
        <p>Imagina que hay una parte de ti que puede observar tus emociones desde afuera. Esta "mente observadora" puede notar: "Interesante, estoy sintiendo ansiedad ahora" sin juzgar o tratar de cambiar la emoción inmediatamente.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "La autoconciencia no es solo conocerte a ti mismo, es aceptarte a ti mismo. No puedes cambiar lo que no puedes aceptar."
        </blockquote>
        
        <h3>🔍 Señales Físicas de las Emociones</h3>
        <p>Tu cuerpo es un excelente indicador de tus estados emocionales. Aprender a leer estas señales te ayuda a reconocer emociones antes de que se intensifiquen:</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🏃 Señales Físicas Comunes</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Estrés/Ansiedad:</strong> Tensión en hombros, respiración superficial, estómago apretado</li>
            <li><strong>Enojo:</strong> Mandíbula tensa, puños cerrados, calor en el pecho</li>
            <li><strong>Tristeza:</strong> Pesadez en el pecho, ganas de llorar, fatiga</li>
            <li><strong>Alegría:</strong> Ligereza, sonrisa natural, energía elevada</li>
            <li><strong>Miedo:</strong> Corazón acelerado, sudoración, músculos tensos</li>
          </ul>
        </div>
        
        <h3>🎪 Los Patrones Emocionales</h3>
        <p>Con el tiempo, comenzarás a notar patrones en tus respuestas emocionales. Tal vez siempre te sientes ansioso los lunes por la mañana, o te irritas cuando tienes hambre. Reconocer estos patrones te da poder para anticipar y prepararte.</p>
        
        <h3>🌟 El Poder de la Autocompasión</h3>
        <p>La autoconciencia no debe convertirse en autocrítica. Cuando notes emociones o comportamientos que no te gustan, trátalos con curiosidad y compasión, no con juicio. Pregúntate: "¿Qué puedo aprender de esto?" en lugar de "¿Por qué siempre hago esto?"</p>
        
        <p>Recuerda: la autoconciencia es un viaje, no un destino. Cada momento de reconocimiento emocional es un paso hacia una mayor inteligencia emocional y, en última instancia, hacia una vida más plena y exitosa.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
  "5": [
    {
      id: "content-5-1",
      book_id: "5",
      chapter_number: 1,
      title: "La Visión",
      content: `
        <h2>Capítulo 1: La Visión</h2>
        <p>En el corazón de cada startup exitosa hay una <strong>visión</strong> - una imagen clara de cómo el mundo podría ser diferente y mejor. Pero tener una visión no es suficiente. La metodología Lean Startup se trata de convertir esa visión en realidad de la manera más eficiente posible.</p>
        
        <h3>🚀 ¿Qué es una Startup?</h3>
        <p>Una startup es una <strong>institución humana</strong> diseñada para crear un nuevo producto o servicio bajo condiciones de <strong>extrema incertidumbre</strong>.</p>
        
        <p>Esta definición es intencionalmente amplia. No importa el tamaño de la empresa, la industria o el sector. Lo que importa es que estás tratando de crear algo nuevo en un ambiente donde no sabes si funcionará.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🎯 Características de una Startup</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Incertidumbre extrema:</strong> No sabes si tu producto funcionará</li>
            <li><strong>Innovación:</strong> Estás creando algo nuevo</li>
            <li><strong>Escalabilidad:</strong> El potencial de crecimiento rápido</li>
            <li><strong>Búsqueda:</strong> Estás buscando un modelo de negocio repetible y escalable</li>
          </ul>
        </div>
        
        <h3>🏗️ El Problema del Enfoque Tradicional</h3>
        <p>El enfoque tradicional de desarrollo de productos sigue este patrón:</p>
        
        <ol>
          <li><strong>Planificar:</strong> Escribir un plan de negocios detallado</li>
          <li><strong>Construir:</strong> Desarrollar el producto completo</li>
          <li><strong>Lanzar:</strong> Introducir el producto al mercado</li>
          <li><strong>Esperar:</strong> Ver si los clientes lo compran</li>
        </ol>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">❌ Por qué Este Enfoque Falla</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Desperdicio de tiempo:</strong> Meses o años construyendo algo que nadie quiere</li>
            <li><strong>Desperdicio de dinero:</strong> Inversión masiva antes de validar la demanda</li>
            <li><strong>Desperdicio de energía:</strong> Equipos trabajando en características innecesarias</li>
            <li><strong>Oportunidad perdida:</strong> Competidores pueden llegar al mercado primero</li>
          </ul>
        </div>
        
        <h3>🔄 El Enfoque Lean Startup</h3>
        <p>La metodología Lean Startup invierte este proceso. En lugar de hacer suposiciones sobre lo que quieren los clientes, <strong>probamos nuestras hipótesis</strong> lo más rápido y barato posible.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">✅ El Ciclo Construir-Medir-Aprender</h4>
          <ol style="margin-bottom: 0;">
            <li><strong>🏗️ Construir:</strong> Crear un Producto Mínimo Viable (MVP)</li>
            <li><strong>📊 Medir:</strong> Recopilar datos sobre cómo responden los clientes</li>
            <li><strong>🧠 Aprender:</strong> Usar los datos para validar o refutar hipótesis</li>
            <li><strong>🔄 Repetir:</strong> Iterar basándose en lo aprendido</li>
          </ol>
        </div>
        
        <h3>🧪 Experimentación Científica</h3>
        <p>Las startups son esencialmente <strong>experimentos</strong>. Cada startup comienza con una serie de hipótesis no probadas sobre:</p>
        
        <ul>
          <li><strong>El problema:</strong> ¿Existe realmente este problema?</li>
          <li><strong>La solución:</strong> ¿Nuestra solución resuelve el problema?</li>
          <li><strong>El mercado:</strong> ¿Hay suficientes personas con este problema?</li>
          <li><strong>El modelo de negocio:</strong> ¿Podemos hacer dinero resolviendo este problema?</li>
        </ul>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "El único propósito de una startup es aprender cómo construir un negocio sostenible. Este aprendizaje puede ser validado científicamente ejecutando experimentos frecuentes."
        </blockquote>
        
        <h3>📈 Métricas que Importan</h3>
        <p>No todas las métricas son iguales. Las startups deben enfocarse en <strong>métricas accionables</strong> que realmente indican progreso hacia un negocio sostenible.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">⚠️ Métricas de Vanidad vs. Métricas Accionables</h4>
          <p><strong>Métricas de Vanidad:</strong> Se ven bien pero no ayudan a tomar decisiones</p>
          <ul>
            <li>Número total de usuarios registrados</li>
            <li>Páginas vistas</li>
            <li>Descargas de la app</li>
          </ul>
          <p><strong>Métricas Accionables:</strong> Te ayudan a tomar decisiones informadas</p>
          <ul style="margin-bottom: 0;">
            <li>Tasa de retención de usuarios activos</li>
            <li>Valor de vida del cliente (CLV)</li>
            <li>Costo de adquisición de cliente (CAC)</li>
          </ul>
        </div>
        
        <h3>🎯 El Objetivo: Encontrar el Product-Market Fit</h3>
        <p>El objetivo final de toda startup es encontrar el <strong>Product-Market Fit</strong> - ese momento mágico cuando has construido algo que la gente realmente quiere y está dispuesta a pagar por ello.</p>
        
        <p>Marc Andreessen lo describe así: "Product-Market Fit significa estar en un buen mercado con un producto que puede satisfacer ese mercado."</p>
        
        <h3>🌟 La Mentalidad Lean</h3>
        <p>Adoptar la metodología Lean Startup requiere un cambio fundamental de mentalidad:</p>
        
        <ul>
          <li><strong>De certeza a hipótesis:</strong> Admitir que no sabes si tu idea funcionará</li>
          <li><strong>De perfección a iteración:</strong> Lanzar rápido y mejorar continuamente</li>
          <li><strong>De características a aprendizaje:</strong> Priorizar el aprendizaje sobre la construcción</li>
          <li><strong>De opiniones a datos:</strong> Basar decisiones en evidencia, no en intuición</li>
        </ul>
        
        <p>En los próximos capítulos, exploraremos cada componente de la metodología Lean Startup en detalle, desde la creación de tu primer MVP hasta la medición del progreso y el aprendizaje validado.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-5-2",
      book_id: "5",
      chapter_number: 2,
      title: "Definir",
      content: `
        <h2>Capítulo 2: Definir</h2>
        <p>Antes de poder aplicar la metodología Lean Startup, necesitas <strong>definir</strong> claramente qué estás tratando de lograr. Esto significa articular tu visión, identificar tus hipótesis fundamentales y establecer las bases para la experimentación.</p>
        
        <h3>🎯 Articulando Tu Visión</h3>
        <p>Tu visión es tu <strong>estrella del norte</strong> - la imagen a largo plazo de lo que quieres lograr. Una buena visión debe ser:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🌟 Características de una Visión Efectiva</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Inspiradora:</strong> Motiva a tu equipo y stakeholders</li>
            <li><strong>Clara:</strong> Fácil de entender y comunicar</li>
            <li><strong>Específica:</strong> Define claramente el cambio que quieres crear</li>
            <li><strong>Medible:</strong> Puedes saber cuándo la has logrado</li>
            <li><strong>Alcanzable:</strong> Ambiciosa pero realista</li>
          </ul>
        </div>
        
        <h3>🧪 Identificando Tus Hipótesis Fundamentales</h3>
        <p>Toda startup se basa en un conjunto de <strong>hipótesis no probadas</strong>. Estas hipótesis caen en dos categorías principales:</p>
        
        <h4>1. 💡 Hipótesis de Valor</h4>
        <p>¿Tu producto o servicio realmente entrega valor a los clientes? ¿Resuelve un problema real que tienen?</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">💎 Ejemplos de Hipótesis de Valor</h4>
          <ul style="margin-bottom: 0;">
            <li>"Los pequeños comerciantes necesitan una forma más fácil de aceptar pagos con tarjeta"</li>
            <li>"Los estudiantes universitarios quieren una forma más conveniente de compartir transporte"</li>
            <li>"Los profesionales ocupados pagarían por comidas saludables entregadas a domicilio"</li>
          </ul>
        </div>
        
        <h4>2. 📈 Hipótesis de Crecimiento</h4>
        <p>¿Cómo se enterarán los nuevos clientes de tu producto? ¿Qué los motivará a usarlo y recomendarlo?</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">🚀 Motores de Crecimiento</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Motor Viral:</strong> Los usuarios invitan a otros usuarios</li>
            <li><strong>Motor Pegajoso:</strong> Los usuarios regresan frecuentemente</li>
            <li><strong>Motor Pagado:</strong> Puedes pagar por adquirir clientes rentablemente</li>
          </ul>
        </div>
        
        <h3>📋 El Lienzo del Modelo de Negocio</h3>
        <p>Una herramienta útil para definir tu startup es el <strong>Lienzo del Modelo de Negocio</strong>. Este lienzo te ayuda a visualizar los componentes clave de tu negocio en una sola página:</p>
        
        <ol>
          <li><strong>Segmentos de Clientes:</strong> ¿Para quién creas valor?</li>
          <li><strong>Propuesta de Valor:</strong> ¿Qué problema resuelves?</li>
          <li><strong>Canales:</strong> ¿Cómo llegas a tus clientes?</li>
          <li><strong>Relaciones con Clientes:</strong> ¿Qué tipo de relación estableces?</li>
          <li><strong>Fuentes de Ingresos:</strong> ¿Cómo generas dinero?</li>
          <li><strong>Recursos Clave:</strong> ¿Qué necesitas para operar?</li>
          <li><strong>Actividades Clave:</strong> ¿Qué debes hacer bien?</li>
          <li><strong>Socios Clave:</strong> ¿Con quién necesitas asociarte?</li>
          <li><strong>Estructura de Costos:</strong> ¿Cuáles son tus costos principales?</li>
        </ol>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Un modelo de negocio describe la lógica de cómo una organización crea, entrega y captura valor."
        </blockquote>
        
        <h3>🎪 El Arte del Pivote</h3>
        <p>Una de las decisiones más importantes que enfrentará tu startup es cuándo <strong>pivotar</strong> - cambiar de dirección basándose en lo que has aprendido.</p>
        
        <p>Un pivote no es un fracaso; es una <strong>corrección de curso estructurada</strong> diseñada para probar una nueva hipótesis fundamental sobre el producto, estrategia y motor de crecimiento.</p>
        
        <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #be185d; margin-top: 0;">🔄 Tipos Comunes de Pivotes</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Pivote de Zoom-in:</strong> Una característica se convierte en el producto completo</li>
            <li><strong>Pivote de Zoom-out:</strong> El producto se convierte en una característica de algo más grande</li>
            <li><strong>Pivote de Segmento de Cliente:</strong> Cambiar a un segmento de cliente diferente</li>
            <li><strong>Pivote de Plataforma:</strong> Cambiar de aplicación a plataforma o viceversa</li>
            <li><strong>Pivote de Modelo de Negocio:</strong> Cambiar cómo monetizas</li>
          </ul>
        </div>
        
        <h3>📊 Estableciendo Métricas de Éxito</h3>
        <p>Para saber si estás progresando hacia tu visión, necesitas definir <strong>métricas claras de éxito</strong>. Estas métricas deben estar directamente relacionadas con tus hipótesis fundamentales.</p>
        
        <h4>🎯 Métricas AARRR (Pirate Metrics)</h4>
        <ul>
          <li><strong>Adquisición:</strong> ¿Cómo encuentran los usuarios tu producto?</li>
          <li><strong>Activación:</strong> ¿Los usuarios tienen una buena primera experiencia?</li>
          <li><strong>Retención:</strong> ¿Los usuarios regresan?</li>
          <li><strong>Referencia:</strong> ¿Los usuarios refieren a otros?</li>
          <li><strong>Ingresos:</strong> ¿Los usuarios pagan?</li>
        </ul>
        
        <h3>🏁 Definiendo Criterios de Éxito y Fracaso</h3>
        <p>Antes de comenzar cualquier experimento, debes definir claramente:</p>
        
        <ul>
          <li><strong>¿Qué constituye éxito?</strong> Números específicos, no "mejora"</li>
          <li><strong>¿Qué constituye fracaso?</strong> El punto donde pivotarás</li>
          <li><strong>¿Cuánto tiempo darás al experimento?</strong> Fechas límite claras</li>
          <li><strong>¿Qué recursos invertirás?</strong> Límites de tiempo y dinero</li>
        </ul>
        
        <p>Definir claramente estos elementos desde el principio te ayuda a evitar el sesgo de confirmación y tomar decisiones objetivas basadas en datos, no en esperanzas.</p>
        
        <p>En el próximo capítulo, exploraremos cómo convertir estas definiciones en experimentos concretos a través de la construcción de Productos Mínimos Viables (MVPs).</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
  "6": [
    {
      id: "content-6-1",
      book_id: "6",
      chapter_number: 1,
      title: "Hábito 1: Ser Proactivo",
      content: `
        <h2>Hábito 1: Ser Proactivo</h2>
        <p>El primer hábito de las personas altamente efectivas es <strong>ser proactivo</strong>. Esto significa tomar la iniciativa y la responsabilidad de hacer que las cosas sucedan.</p>
        
        <h3>🎯 ¿Qué Significa Ser Proactivo?</h3>
        <p>Ser proactivo significa más que simplemente tomar la iniciativa. Significa que, como seres humanos, somos responsables de nuestras propias vidas. Nuestro comportamiento es una función de nuestras decisiones, no de nuestras condiciones.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔍 Características de las Personas Proactivas</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Toman la iniciativa:</strong> No esperan a que otros actúen primero</li>
            <li><strong>Asumen responsabilidad:</strong> Se hacen cargo de sus acciones y resultados</li>
            <li><strong>Se enfocan en lo que pueden controlar:</strong> Invierten energía donde pueden influir</li>
            <li><strong>Eligen sus respuestas:</strong> No reaccionan automáticamente a los estímulos</li>
          </ul>
        </div>
        
        <h3>⭕ Círculo de Preocupación vs. Círculo de Influencia</h3>
        <p>Todos tenemos una amplia gama de preocupaciones: nuestra salud, nuestros hijos, problemas en el trabajo, la deuda nacional, la guerra nuclear. Podemos separar estas preocupaciones en dos áreas:</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">🔴 Círculo de Preocupación</h4>
          <p>Incluye todas las cosas que nos preocupan pero sobre las cuales tenemos poco o ningún control:</p>
          <ul style="margin-bottom: 0;">
            <li>El clima</li>
            <li>La economía nacional</li>
            <li>Las acciones de otras personas</li>
            <li>El pasado</li>
          </ul>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🟢 Círculo de Influencia</h4>
          <p>Incluye las cosas que nos preocupan y sobre las cuales podemos hacer algo:</p>
          <ul style="margin-bottom: 0;">
            <li>Nuestras actitudes</li>
            <li>Nuestras habilidades</li>
            <li>Nuestras relaciones</li>
            <li>Nuestras decisiones</li>
          </ul>
        </div>
        
        <p>Las personas proactivas enfocan sus esfuerzos en el Círculo de Influencia. Trabajan en las cosas que pueden hacer algo al respecto. La naturaleza de su energía es positiva, ampliadora y magnificadora, causando que su Círculo de Influencia aumente.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "No es lo que nos sucede, sino nuestra respuesta a lo que nos sucede lo que nos lastima."
        </blockquote>
        
        <h3>🗣️ El Lenguaje Proactivo vs. Reactivo</h3>
        <p>El lenguaje que usamos es un indicador muy real de hasta qué punto nos vemos como personas proactivas:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #475569; margin-top: 0;">🔄 Lenguaje Reactivo vs. Proactivo</h4>
          <p><strong>Reactivo:</strong> "No hay nada que pueda hacer"</p>
          <p><strong>Proactivo:</strong> "Veamos las alternativas"</p>
          <br>
          <p><strong>Reactivo:</strong> "Así soy yo"</p>
          <p><strong>Proactivo:</strong> "Puedo elegir un enfoque diferente"</p>
          <br>
          <p><strong>Reactivo:</strong> "Me vuelve loco"</p>
          <p><strong>Proactivo:</strong> "Controlo mis propios sentimientos"</p>
          <br>
          <p><strong>Reactivo:</strong> "No pueden aceptar eso"</p>
          <p style="margin-bottom: 0;"><strong>Proactivo:</strong> "Puedo crear una presentación efectiva"</p>
        </div>
        
        <h3>💪 Expandiendo el Círculo de Influencia</h3>
        <p>Cuando nos enfocamos en nuestro Círculo de Influencia, lo expandimos. Pero cuando nos enfocamos en nuestro Círculo de Preocupación, lo que está fuera de nuestro control, nuestro Círculo de Influencia se reduce.</p>
        
        <h4>🎯 Estrategias para Ser Más Proactivo:</h4>
        <ol>
          <li><strong>Haz compromisos y cúmplelos:</strong> Esto construye integridad personal</li>
          <li><strong>Establece metas pequeñas y alcánzalas:</strong> Construye confianza gradualmente</li>
          <li><strong>Sé una luz, no un juez:</strong> Modela el comportamiento que quieres ver</li>
          <li><strong>Sé parte de la solución, no del problema:</strong> Contribuye positivamente</li>
        </ol>
        
        <h3>🌟 El Poder de la Elección</h3>
        <p>Entre el estímulo y la respuesta, el hombre tiene la libertad de elegir. En esa elección yace nuestro crecimiento y nuestra felicidad.</p>
        
        <p>Las personas proactivas reconocen que tienen la responsabilidad de hacer que las cosas sucedan. No culpan a las circunstancias, condiciones o condicionamiento por su comportamiento. Su comportamiento es un producto de su propia elección consciente.</p>
        
        <h3>🎪 Ejemplo Práctico</h3>
        <p><strong>Situación:</strong> Tu jefe te critica constantemente en público.</p>
        
        <p><strong>Respuesta Reactiva:</strong> "Mi jefe me está arruinando la vida. No hay nada que pueda hacer. Es un idiota."</p>
        
        <p><strong>Respuesta Proactiva:</strong> "Puedo elegir cómo responder a esta situación. Voy a programar una reunión privada con mi jefe para discutir cómo podemos trabajar mejor juntos. También voy a enfocarme en mejorar mi desempeño en las áreas que ha mencionado."</p>
        
        <p>Ser proactivo no significa ser agresivo, molesto o insensible. Significa ser responsable de hacer que las cosas sucedan.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-6-2",
      book_id: "6",
      chapter_number: 2,
      title: "Hábito 2: Comenzar con el Fin en Mente",
      content: `
        <h2>Hábito 2: Comenzar con el Fin en Mente</h2>
        <p>El segundo hábito se basa en el principio de que <strong>todas las cosas se crean dos veces</strong>. Hay una creación mental (primera) y una creación física (segunda).</p>
        
        <h3>🎯 La Doble Creación</h3>
        <p>Piensa en la construcción de una casa. Primero creas la casa en tu mente, trabajas con ideas y conceptos. Luego dibujas los planos y desarrollas las especificaciones. Todo esto es la primera creación.</p>
        
        <p>Luego construyes la casa. Excavas, pones los cimientos, levantas las paredes, techás, etc. Esta es la segunda creación, la creación física.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🏗️ Las Dos Creaciones</h4>
          <ol style="margin-bottom: 0;">
            <li><strong>Primera Creación (Mental):</strong> Visión, planificación, diseño</li>
            <li><strong>Segunda Creación (Física):</strong> Implementación, construcción, ejecución</li>
          </ol>
        </div>
        
        <h3>🎭 Liderazgo vs. Administración</h3>
        <p>El Hábito 2 se basa en los principios del liderazgo personal, que significa que el liderazgo es la primera creación. La administración es la segunda creación.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">🎯 Liderazgo vs. Administración</h4>
          <p><strong>Liderazgo:</strong> "¿Estamos haciendo las cosas correctas?"</p>
          <ul>
            <li>Se enfoca en la efectividad</li>
            <li>Establece la dirección</li>
            <li>Crea la visión</li>
          </ul>
          <p><strong>Administración:</strong> "¿Estamos haciendo las cosas correctamente?"</p>
          <ul style="margin-bottom: 0;">
            <li>Se enfoca en la eficiencia</li>
            <li>Ejecuta la dirección</li>
            <li>Implementa la visión</li>
          </ul>
        </div>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "La administración es eficiencia en subir la escalera del éxito; el liderazgo determina si la escalera está apoyada en la pared correcta."
        </blockquote>
        
        <h3>📜 Desarrollando una Declaración de Misión Personal</h3>
        <p>Una declaración de misión personal se basa en principios correctos. Se convierte en la constitución básica, la expresión sólida de tu visión y valores.</p>
        
        <h4>🌟 Características de una Buena Declaración de Misión:</h4>
        <ul>
          <li><strong>Representa tus valores más profundos</strong></li>
          <li><strong>Da dirección a tu vida</strong></li>
          <li><strong>Te da criterios para tomar decisiones</strong></li>
          <li><strong>Te da un sentido de propósito</strong></li>
        </ul>
        
        <h3>🎪 Roles y Metas</h3>
        <p>Una forma efectiva de preparar una declaración de misión personal es comenzar identificando los diversos roles en tu vida y las metas que quieres lograr en cada rol.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🎭 Ejemplos de Roles</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Personal:</strong> Individuo, crecimiento personal</li>
            <li><strong>Familiar:</strong> Esposo/a, padre/madre, hijo/a</li>
            <li><strong>Profesional:</strong> Gerente, colega, mentor</li>
            <li><strong>Comunitario:</strong> Ciudadano, voluntario, vecino</li>
          </ul>
        </div>
        
        <h3>🧭 El Centro de Tu Vida</h3>
        <p>Todos tenemos un centro, un núcleo fundamental, un foco desde el cual vemos la vida. Sea lo que sea que esté en el centro de nuestra vida será la fuente de nuestra seguridad, guía, sabiduría y poder.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">⚠️ Centros Alternativos Comunes</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Centrado en el Cónyuge:</strong> Tu sentido de valor viene de tu pareja</li>
            <li><strong>Centrado en la Familia:</strong> Tu identidad está completamente en tu familia</li>
            <li><strong>Centrado en el Dinero:</strong> Las decisiones se basan en la ganancia financiera</li>
            <li><strong>Centrado en el Trabajo:</strong> Tu identidad viene de tu carrera</li>
            <li><strong>Centrado en las Posesiones:</strong> Tu valor se basa en lo que tienes</li>
            <li><strong>Centrado en el Placer:</strong> Buscas constantemente la diversión</li>
            <li><strong>Centrado en el Enemigo:</strong> Tu vida gira en torno a oponerte a alguien</li>
          </ul>
        </div>
        
        <h3>🌟 El Centro Basado en Principios</h3>
        <p>El centro más efectivo y estable es estar centrado en principios correctos. Los principios no cambian. Son verdades profundas, fundamentales, clásicas, denominadores comunes.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">✨ Beneficios de Estar Centrado en Principios</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Seguridad:</strong> Tu valor no depende de la opinión de otros</li>
            <li><strong>Guía:</strong> Tienes una brújula interna confiable</li>
            <li><strong>Sabiduría:</strong> Ves las cosas como realmente son</li>
            <li><strong>Poder:</strong> Tienes la fuerza para actuar</li>
          </ul>
        </div>
        
        <h3>🎯 Visualización y Afirmación</h3>
        <p>Dos herramientas poderosas para la primera creación son la visualización y la afirmación.</p>
        
        <h4>👁️ Visualización:</h4>
        <p>Consiste en ver mentalmente, con gran detalle, lo que no puedes ver actualmente con tus ojos. Es programar tu subconsciente con tus metas.</p>
        
        <h4>💬 Afirmación:</h4>
        <p>Es la repetición de declaraciones positivas sobre ti mismo y tus metas. Pero para ser efectivas, las afirmaciones deben ser:</p>
        <ul>
          <li><strong>Personales</strong></li>
          <li><strong>Positivas</strong></li>
          <li><strong>En tiempo presente</strong></li>
          <li><strong>Visuales</strong></li>
          <li><strong>Emocionales</strong></li>
        </ul>
        
        <p>Comenzar con el fin en mente significa comenzar con una clara comprensión de tu destino. Significa saber a dónde vas para que puedas entender mejor dónde estás ahora y para que los pasos que des siempre estén en la dirección correcta.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
  "7": [
    {
      id: "content-7-1",
      book_id: "7",
      chapter_number: 1,
      title: "Las Dos Mentalidades",
      content: `
        <h2>Capítulo 1: Las Dos Mentalidades</h2>
        <p>Durante décadas, mis investigaciones han mostrado que la visión que adoptas de ti mismo afecta profundamente la forma en que vives tu vida. Puede determinar si te conviertes en la persona que quieres ser y si logras las cosas que valoras.</p>
        
        <h3>🧠 Mentalidad Fija vs. Mentalidad de Crecimiento</h3>
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">❌ Mentalidad Fija</h4>
          <p>Cree que las cualidades básicas como la inteligencia o el talento son rasgos fijos. Piensa que el talento solo crea el éxito, sin esfuerzo.</p>
          <ul style="margin-bottom: 0;">
            <li>Evita desafíos</li>
            <li>Se rinde fácilmente</li>
            <li>Ve el esfuerzo como signo de baja habilidad</li>
            <li>Ignora críticas útiles</li>
            <li>Se siente amenazado por el éxito de otros</li>
          </ul>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">✅ Mentalidad de Crecimiento</h4>
          <p>Cree que las habilidades más básicas se pueden desarrollar a través de dedicación y trabajo duro. El cerebro y el talento son solo el punto de partida.</p>
          <ul style="margin-bottom: 0;">
            <li>Abraza desafíos</li>
            <li>Persiste ante obstáculos</li>
            <li>Ve el esfuerzo como camino al dominio</li>
            <li>Aprende de las críticas</li>
            <li>Se inspira en el éxito de otros</li>
          </ul>
        </div>
        
        <h3>🌱 El Poder del "Aún"</h3>
        <p>Una de las formas más simples de cambiar de mentalidad fija a mentalidad de crecimiento es agregar la palabra "aún" a tus pensamientos:</p>
        
        <ul>
          <li>"No soy bueno en matemáticas" → "No soy bueno en matemáticas <strong>aún</strong>"</li>
          <li>"No puedo hacer esto" → "No puedo hacer esto <strong>aún</strong>"</li>
          <li>"Esto es muy difícil" → "Esto es muy difícil <strong>aún</strong>"</li>
        </ul>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "En una mentalidad de crecimiento, los desafíos son emocionantes en lugar de amenazantes."
        </blockquote>
        
        <h3>🧪 La Ciencia Detrás de las Mentalidades</h3>
        <p>Las investigaciones en neurociencia han demostrado que el cerebro es mucho más maleable de lo que se pensaba anteriormente. Esta plasticidad cerebral significa que podemos literalmente cambiar nuestros cerebros a través de la experiencia y el aprendizaje.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔬 Hallazgos Científicos Clave</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Neuroplasticidad:</strong> El cerebro puede formar nuevas conexiones a cualquier edad</li>
            <li><strong>Mielina:</strong> La práctica fortalece las conexiones neuronales</li>
            <li><strong>Neurogénesis:</strong> Podemos generar nuevas neuronas</li>
            <li><strong>Epigenética:</strong> El ambiente puede activar o desactivar genes</li>
          </ul>
        </div>
        
        <h3>🎯 Impacto en el Rendimiento</h3>
        <p>Los estudios han mostrado que las personas con mentalidad de crecimiento:</p>
        
        <ul>
          <li><strong>Aprenden más efectivamente</strong> porque ven los errores como oportunidades</li>
          <li><strong>Persisten más tiempo</strong> ante las dificultades</li>
          <li><strong>Alcanzan niveles más altos</strong> de logro</li>
          <li><strong>Son más resilientes</strong> ante los fracasos</li>
          <li><strong>Disfrutan más el proceso</strong> de aprendizaje</li>
        </ul>
        
        <h3>🏫 Mentalidades en la Educación</h3>
        <p>En el ámbito educativo, las mentalidades tienen un impacto profundo:</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">📚 Efectos en el Aprendizaje</h4>
          <p><strong>Estudiantes con Mentalidad Fija:</strong></p>
          <ul>
            <li>Evitan desafíos para proteger su imagen de "inteligentes"</li>
            <li>Se desaniman fácilmente con las calificaciones bajas</li>
            <li>Pueden hacer trampa para mantener su imagen</li>
          </ul>
          <p><strong>Estudiantes con Mentalidad de Crecimiento:</strong></p>
          <ul style="margin-bottom: 0;">
            <li>Buscan desafíos para aprender más</li>
            <li>Ven las calificaciones bajas como información útil</li>
            <li>Se enfocan en el proceso de aprendizaje</li>
          </ul>
        </div>
        
        <h3>💼 Mentalidades en el Trabajo</h3>
        <p>En el entorno laboral, las mentalidades afectan:</p>
        
        <ul>
          <li><strong>La innovación:</strong> Las personas con mentalidad de crecimiento son más creativas</li>
          <li><strong>El liderazgo:</strong> Los líderes con mentalidad de crecimiento desarrollan mejor a su equipo</li>
          <li><strong>La colaboración:</strong> Están más dispuestos a compartir conocimiento</li>
          <li><strong>La adaptabilidad:</strong> Se ajustan mejor a los cambios</li>
        </ul>
        
        <h3>❤️ Mentalidades en las Relaciones</h3>
        <p>Las mentalidades también impactan nuestras relaciones personales:</p>
        
        <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #be185d; margin-top: 0;">💕 En las Relaciones Románticas</h4>
          <p><strong>Mentalidad Fija:</strong> "Si tenemos que trabajar en nuestra relación, no estamos hechos el uno para el otro"</p>
          <p style="margin-bottom: 0;"><strong>Mentalidad de Crecimiento:</strong> "Una buena relación requiere esfuerzo y crecimiento mutuo"</p>
        </div>
        
        <h3>🔄 Cambiando Tu Mentalidad</h3>
        <p>La buena noticia es que puedes desarrollar una mentalidad de crecimiento. Aquí están los primeros pasos:</p>
        
        <ol>
          <li><strong>Reconoce tu mentalidad fija:</strong> Identifica cuándo piensas de manera fija</li>
          <li><strong>Acepta que tienes una elección:</strong> Puedes elegir cómo interpretar los desafíos</li>
          <li><strong>Habla contigo mismo con una voz de crecimiento:</strong> Cambia tu diálogo interno</li>
          <li><strong>Actúa:</strong> Toma acciones basadas en la mentalidad de crecimiento</li>
        </ol>
        
        <p>Recuerda: desarrollar una mentalidad de crecimiento es en sí mismo un proceso de crecimiento. Requiere tiempo, esfuerzo y paciencia contigo mismo.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-7-2",
      book_id: "7",
      chapter_number: 2,
      title: "Dentro de las Mentalidades",
      content: `
        <h2>Capítulo 2: Dentro de las Mentalidades</h2>
        <p>Para entender realmente cómo las mentalidades funcionan, necesitamos explorar lo que sucede dentro de la mente cuando enfrentamos desafíos, obstáculos y críticas.</p>
        
        <h3>🎭 ¿Es el Éxito sobre Aprender o Lucir Inteligente?</h3>
        <p>Las personas con diferentes mentalidades tienen objetivos completamente diferentes. Cuando tienen mentalidad fija, su objetivo principal es lucir inteligentes todo el tiempo y a toda costa. Cuando tienen mentalidad de crecimiento, su objetivo principal es aprender todo el tiempo.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🎯 Objetivos Diferentes</h4>
          <p><strong>Mentalidad Fija:</strong> "Quiero lucir inteligente"</p>
          <ul>
            <li>Evita riesgos que puedan revelar deficiencias</li>
            <li>Se enfoca en validar su inteligencia actual</li>
            <li>Ve los errores como fracasos personales</li>
          </ul>
          <p><strong>Mentalidad de Crecimiento:</strong> "Quiero aprender algo nuevo"</p>
          <ul style="margin-bottom: 0;">
            <li>Busca desafíos que promuevan el crecimiento</li>
            <li>Se enfoca en desarrollar nuevas habilidades</li>
            <li>Ve los errores como oportunidades de aprendizaje</li>
          </ul>
        </div>
        
        <h3>🧠 El Cerebro en Acción</h3>
        <p>Los estudios de neuroimagen han mostrado diferencias fascinantes en cómo los cerebros de personas con diferentes mentalidades procesan los errores:</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">🔬 Actividad Cerebral y Errores</h4>
          <p><strong>Mentalidad Fija:</strong></p>
          <ul>
            <li>Menor actividad cerebral cuando cometen errores</li>
            <li>Se enfocan en el aspecto emocional del error</li>
            <li>Procesan menos la información correctiva</li>
          </ul>
          <p><strong>Mentalidad de Crecimiento:</strong></p>
          <ul style="margin-bottom: 0;">
            <li>Mayor actividad cerebral cuando cometen errores</li>
            <li>Se enfocan en procesar y corregir el error</li>
            <li>Muestran más atención a la información de aprendizaje</li>
          </ul>
        </div>
        
        <h3>🎪 El Experimento de los Rompecabezas</h3>
        <p>Un estudio revelador involucró a niños de cuarto grado trabajando en rompecabezas. Primero, todos trabajaron en rompecabezas bastante fáciles y lo hicieron bien. Luego se les dijo:</p>
        
        <p><strong>Grupo 1 (Elogio por Inteligencia):</strong> "¡Wow, obtuviste 8 correctas! ¡Eres muy inteligente!"</p>
        <p><strong>Grupo 2 (Elogio por Proceso):</strong> "¡Wow, obtuviste 8 correctas! ¡Debes haber trabajado muy duro!"</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">📊 Resultados Sorprendentes</h4>
          <p><strong>Cuando se les ofreció elegir el siguiente rompecabezas:</strong></p>
          <ul>
            <li><strong>Grupo "Inteligente":</strong> 67% eligió el rompecabezas fácil</li>
            <li><strong>Grupo "Esfuerzo":</strong> 92% eligió el rompecabezas desafiante</li>
          </ul>
          <p style="margin-bottom: 0;"><strong>Cuando enfrentaron rompecabezas difíciles:</strong> El grupo "inteligente" se desanimó rápidamente, mientras que el grupo "esfuerzo" persistió y disfrutó el desafío.</p>
        </div>
        
        <h3>💬 El Poder de las Palabras</h3>
        <p>Las palabras que usamos, tanto con nosotros mismos como con otros, pueden promover una mentalidad fija o de crecimiento:</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">❌ Lenguaje de Mentalidad Fija</h4>
          <ul style="margin-bottom: 0;">
            <li>"Eres muy talentoso"</li>
            <li>"Eres un genio"</li>
            <li>"Tienes un don natural"</li>
            <li>"Eres muy inteligente"</li>
            <li>"Esto es fácil para ti"</li>
          </ul>
        </div>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">✅ Lenguaje de Mentalidad de Crecimiento</h4>
          <ul style="margin-bottom: 0;">
            <li>"Me gusta cómo persististe"</li>
            <li>"Tu esfuerzo realmente se nota"</li>
            <li>"Puedo ver que has estado practicando"</li>
            <li>"Tu estrategia funcionó bien"</li>
            <li>"Has mejorado mucho"</li>
          </ul>
        </div>
        
        <h3>🎯 Enfrentando los Reveses</h3>
        <p>Todos enfrentamos fracasos y reveses. La diferencia está en cómo los interpretamos:</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "En una mentalidad de crecimiento, los desafíos son emocionantes en lugar de amenazantes. En lugar de pensar 'Oh, voy a revelar mis debilidades', piensas 'Wow, aquí hay una oportunidad de crecer'."
        </blockquote>
        
        <h3>🔄 El Proceso de Cambio</h3>
        <p>Cambiar de una mentalidad fija a una de crecimiento no sucede de la noche a la mañana. Es un proceso que involucra:</p>
        
        <ol>
          <li><strong>Conciencia:</strong> Reconocer cuándo tu mentalidad fija se activa</li>
          <li><strong>Comprensión:</strong> Entender que tienes una elección</li>
          <li><strong>Denominación:</strong> Darle un nombre a tu mentalidad fija</li>
          <li><strong>Educación:</strong> Enseñarle a tu mentalidad fija sobre el crecimiento</li>
        </ol>
        
        <h3>🌟 La Mentalidad Mixta</h3>
        <p>Es importante entender que nadie tiene una mentalidad de crecimiento pura. Todos tenemos una mezcla de mentalidades fijas y de crecimiento, y esta mezcla evoluciona continuamente con la experiencia.</p>
        
        <p>La clave es desarrollar conciencia sobre cuándo tu mentalidad fija se activa y aprender a trabajar con ella de manera constructiva.</p>
        
        <h3>🎪 Ejemplo Práctico</h3>
        <p><strong>Situación:</strong> Recibes críticas negativas en el trabajo.</p>
        
        <p><strong>Respuesta de Mentalidad Fija:</strong> "Mi jefe piensa que soy incompetente. Esto demuestra que no soy bueno en mi trabajo. Mejor evito tomar riesgos en el futuro."</p>
        
        <p><strong>Respuesta de Mentalidad de Crecimiento:</strong> "Esta retroalimentación es valiosa. Me muestra áreas específicas donde puedo mejorar. Voy a hacer un plan para desarrollar estas habilidades."</p>
        
        <p>El cambio de mentalidad no sucede de la noche a la mañana, pero con práctica consciente, puedes entrenar tu cerebro para ver las posibilidades en lugar de las limitaciones.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
  "11": [
    {
      id: "content-11-1",
      book_id: "11",
      chapter_number: 1,
      title: "¿Qué es una Conversación Crucial?",
      content: `
      <h2>Capítulo 1: ¿Qué es una Conversación Crucial?</h2>
      <p>Una <strong>conversación crucial</strong> es una discusión entre dos o más personas donde:</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🎯 Las Tres Características</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>Las apuestas son altas:</strong> Los resultados importan mucho</li>
          <li><strong>Las opiniones difieren:</strong> Las personas no están de acuerdo</li>
          <li><strong>Las emociones son intensas:</strong> Los sentimientos están a flor de piel</li>
        </ol>
      </div>
      
      <p>Estas conversaciones pueden determinar la calidad de tu vida. Desde discusiones sobre el rendimiento laboral hasta conversaciones familiares difíciles, la forma en que manejas estos momentos cruciales marca la diferencia.</p>
      
      <h3>🚨 Señales de una Conversación Crucial</h3>
      <p>Reconoce cuándo estás en una conversación crucial observando estas señales:</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Señales Físicas</h4>
        <ul style="margin-bottom: 0;">
          <li>Tu estómago se tensa</li>
          <li>Tus ojos se secan</li>
          <li>Tu corazón se acelera</li>
          <li>Tu respiración se vuelve superficial</li>
        </ul>
      </div>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">🧠 Señales Emocionales</h4>
        <ul style="margin-bottom: 0;">
          <li>Te sientes amenazado o vulnerable</li>
          <li>Experimentas enojo o frustración</li>
          <li>Sientes miedo o ansiedad</li>
          <li>Te vuelves defensivo</li>
        </ul>
      </div>
      
      <h3>💡 El Poder de las Conversaciones Cruciales</h3>
      <p>Las personas que manejan bien las conversaciones cruciales:</p>
      
      <ul>
        <li><strong>Tienen mejores relaciones:</strong> Resuelven problemas antes de que se agraven</li>
        <li><strong>Avanzan más en sus carreras:</strong> Pueden discutir temas difíciles constructivamente</li>
        <li><strong>Viven más saludablemente:</strong> Reducen el estrés de conflictos no resueltos</li>
        <li><strong>Son más influyentes:</strong> Pueden persuadir sin coerción</li>
      </ul>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "La calidad de tu vida surge de la calidad de tus relaciones, y la calidad de tus relaciones surge de la calidad de tus conversaciones."
      </blockquote>
      
      <h3>🎭 Los Tres Patrones Destructivos</h3>
      <p>Cuando las conversaciones se vuelven cruciales, la mayoría de las personas caen en uno de estos patrones:</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">1. 🤐 Silencio</h4>
        <p>Retener información relevante de la conversación. Incluye:</p>
        <ul style="margin-bottom: 0;">
          <li><strong>Enmascarar:</strong> Subestimar o restar importancia a tus puntos de vista</li>
          <li><strong>Evitar:</strong> Alejarse completamente de temas sensibles</li>
          <li><strong>Retirarse:</strong> Salir de la conversación por completo</li>
        </ul>
      </div>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #be185d; margin-top: 0;">2. 💥 Violencia</h4>
        <p>Forzar tus puntos de vista sobre otros. Incluye:</p>
        <ul style="margin-bottom: 0;">
          <li><strong>Controlar:</strong> Coaccionar a otros para que adopten tu punto de vista</li>
          <li><strong>Etiquetar:</strong> Poner etiquetas negativas a las personas o ideas</li>
          <li><strong>Atacar:</strong> Hablar de manera que hiera o humille</li>
        </ul>
      </div>
      
      <h3>🎯 El Objetivo: Diálogo</h3>
      <p>El <strong>diálogo</strong> es el libre flujo de significado entre dos o más personas. En el diálogo:</p>
      
      <ul>
        <li>Las personas se sienten seguras para expresar sus puntos de vista</li>
        <li>Se comparte información honesta y relevante</li>
        <li>Se exploran diferentes perspectivas</li>
        <li>Se toman mejores decisiones</li>
      </ul>
      
      <p>El diálogo no significa que todos estén de acuerdo. Significa que todos contribuyen al <strong>pool de significado compartido</strong> - toda la información, ideas, sentimientos y experiencias relevantes que las personas aportan a la conversación.</p>
      
      <h3>🌟 La Habilidad Maestra</h3>
      <p>La habilidad maestra de las conversaciones cruciales es <strong>aprender a crear seguridad</strong>. Cuando las personas se sienten seguras, pueden hablar de casi cualquier cosa. Cuando no se sienten seguras, incluso temas aparentemente inocuos se vuelven difíciles de discutir.</p>
      
      <p>En los próximos capítulos, aprenderás las herramientas específicas para crear esta seguridad y mantener conversaciones productivas incluso cuando las apuestas son altas.</p>
    `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-11-2",
      book_id: "11",
      chapter_number: 2,
      title: "Dominar Mis Historias",
      content: `
      <h2>Capítulo 2: Dominar Mis Historias</h2>
      <p>Antes de poder manejar conversaciones cruciales con otros, debes aprender a manejar las conversaciones cruciales contigo mismo. Específicamente, debes dominar las <strong>historias</strong> que te cuentas sobre lo que está sucediendo.</p>
      
      <h3>🧠 El Camino hacia la Acción</h3>
      <p>Nuestras acciones siguen un patrón predecible:</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🛤️ El Camino hacia la Acción</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>👀 Vemos y Escuchamos:</strong> Observamos hechos y comportamientos</li>
          <li><strong>📖 Contamos una Historia:</strong> Interpretamos lo que vemos</li>
          <li><strong>😊 Sentimos:</strong> Nuestras emociones siguen a nuestras historias</li>
          <li><strong>⚡ Actuamos:</strong> Nuestros sentimientos impulsan nuestras acciones</li>
        </ol>
      </div>
      
      <p>El problema es que a menudo confundimos nuestras historias con los hechos. Saltamos de ver algo directamente a sentirnos mal, sin darnos cuenta de que hemos inventado una historia en el medio.</p>
      
      <h3>📚 Los Tres Tipos de Historias Inteligentes</h3>
      <p>Cuando nos sentimos amenazados, tendemos a contar uno de estos tres tipos de historias:</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">1. 😇 Historias de Víctima</h4>
        <p>"No es mi culpa." Estas historias nos hacen parecer inocentes y sin poder:</p>
        <ul style="margin-bottom: 0;">
          <li>"No hay nada que pueda hacer"</li>
          <li>"Es completamente culpa de ellos"</li>
          <li>"Soy una víctima de las circunstancias"</li>
        </ul>
      </div>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">2. 👹 Historias de Villano</h4>
        <p>"Todo es tu culpa." Estas historias exageran la maldad o estupidez de otros:</p>
        <ul style="margin-bottom: 0;">
          <li>"Eres un idiota"</li>
          <li>"Lo hiciste a propósito para lastimarme"</li>
          <li>"Siempre actúas de manera egoísta"</li>
        </ul>
      </div>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">3. 🤷 Historias de Impotencia</h4>
        <p>"No hay nada más que pueda hacer." Estas historias nos convencen de que no tenemos opciones saludables:</p>
        <ul style="margin-bottom: 0;">
          <li>"Tengo que gritarle o nunca me escuchará"</li>
          <li>"Si no lo hago yo, nadie lo hará"</li>
          <li>"No tengo otra opción"</li>
        </ul>
      </div>
      
      <h3>🔍 Separar Hechos de Historias</h3>
      <p>Para dominar tus historias, primero debes aprender a separar los hechos de las interpretaciones:</p>
      
      <div style="background-color: #f8fafc; border: 1px solid #64748b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #475569; margin-top: 0;">📊 Hechos vs. Historias</h4>
        <p><strong>Hecho:</strong> "María llegó 15 minutos tarde a la reunión"</p>
        <p><strong>Historia:</strong> "María no respeta mi tiempo y piensa que su trabajo es más importante que el mío"</p>
        <br>
        <p><strong>Hecho:</strong> "Mi jefe no respondió a mi email en 3 días"</p>
        <p style="margin-bottom: 0;"><strong>Historia:</strong> "Mi jefe está evitándome porque está insatisfecho con mi trabajo"</p>
      </div>
      
      <h3>🎯 Técnicas para Dominar Tus Historias</h3>
      
      <h4>1. 🛑 Retrocede</h4>
      <p>Cuando sientas emociones fuertes, pregúntate: "¿Qué historia me estoy contando que me hace sentir así?"</p>
      
      <h4>2. 🔍 Analiza Tus Historias</h4>
      <p>Pregúntate:</p>
      <ul>
        <li>¿Me estoy convirtiendo en víctima?</li>
        <li>¿Estoy convirtiendo a otros en villanos?</li>
        <li>¿Me estoy convenciendo de que no tengo opciones?</li>
      </ul>
      
      <h4>3. 📖 Cuenta la Historia Más Respetuosa</h4>
      <p>Pregúntate: "¿Por qué una persona razonable, racional y decente haría lo que esta persona está haciendo?"</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Las historias que nos contamos sobre los demás a menudo dicen más sobre nosotros que sobre ellos."
      </blockquote>
      
      <h3>🌟 El Poder de la Historia Completa</h3>
      <p>Una historia completa reconoce tu papel en el problema:</p>
      
      <ul>
        <li><strong>¿Estoy fingiendo no notar mi papel en el problema?</strong></li>
        <li><strong>¿Por qué mi comportamiento es perfectamente razonable?</strong></li>
        <li><strong>¿Qué he hecho (o dejado de hacer) para crear este problema?</strong></li>
        <li><strong>¿Cómo contribuyo al problema que estoy experimentando?</strong></li>
      </ul>
      
      <h3>🎪 Ejemplo Práctico</h3>
      <p><strong>Situación:</strong> Tu compañero de trabajo constantemente interrumpe en las reuniones.</p>
      
      <p><strong>Historia de Villano:</strong> "Es un egocéntrico que no respeta a nadie más."</p>
      
      <p><strong>Historia Más Respetuosa:</strong> "Tal vez está muy entusiasmado con el proyecto, o quizás viene de una cultura donde interrumpir es normal, o posiblemente no se da cuenta de que lo está haciendo."</p>
      
      <p><strong>Historia Completa:</strong> "Tal vez está entusiasmado, y yo he contribuido al problema al no abordar esto directamente con él. En lugar de hablar con él, he estado quejándome con otros, lo que no ayuda a nadie."</p>
      
      <p>Cuando dominas tus historias, puedes abordar conversaciones cruciales desde un lugar de curiosidad y respeto en lugar de juicio y defensividad.</p>
    `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-11-3",
      book_id: "11",
      chapter_number: 3,
      title: "Crear Seguridad",
      content: `
      <h2>Capítulo 3: Crear Seguridad</h2>
      <p>La seguridad es la condición del diálogo. Cuando las personas se sienten seguras, pueden hablar de casi cualquier cosa. Cuando no se sienten seguras, incluso los temas más simples se vuelven imposibles de discutir.</p>
      
      <h3>🛡️ ¿Qué es la Seguridad?</h3>
      <p>La seguridad en las conversaciones significa que las personas sienten que:</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #15803d; margin-top: 0;">✅ Elementos de la Seguridad</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Respeto Mutuo:</strong> Creen que te importan como persona</li>
          <li><strong>Propósito Mutuo:</strong> Creen que trabajas hacia un objetivo común</li>
          <li><strong>No hay represalias:</strong> Pueden expresar sus puntos de vista sin temor</li>
          <li><strong>Escucha genuina:</strong> Sus perspectivas serán consideradas</li>
        </ul>
      </div>
      
      <h3>🚨 Señales de Falta de Seguridad</h3>
      <p>Aprende a reconocer cuándo la seguridad está en riesgo:</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">⚠️ Señales de Silencio</h4>
        <ul>
          <li><strong>Enmascarar:</strong> "Tal vez esto no sea importante, pero..."</li>
          <li><strong>Evitar:</strong> Cambiar de tema o hacer bromas</li>
          <li><strong>Retirarse:</strong> Salir física o mentalmente de la conversación</li>
        </ul>
      </div>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Señales de Violencia</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Controlar:</strong> Interrumpir, hablar en exceso, hacer preguntas dirigidas</li>
          <li><strong>Etiquetar:</strong> "Eso es ridículo" o "Obviamente no entiendes"</li>
          <li><strong>Atacar:</strong> Sarcasmo, insultos o amenazas</li>
        </ul>
      </div>
      
      <h3>🔧 Herramientas para Crear Seguridad</h3>
      
      <h4>1. 🤝 Disculparse Cuando Sea Apropiado</h4>
      <p>Cuando has hecho algo que ha dañado el respeto, discúlpate:</p>
      
      <ul>
        <li><strong>Sé específico:</strong> "Siento haber interrumpido"</li>
        <li><strong>Sé sincero:</strong> Realmente lamenta lo que hiciste</li>
        <li><strong>No hagas excusas:</strong> Acepta la responsabilidad</li>
      </ul>
      
      <h4>2. 🎯 Contrastar para Arreglar Malentendidos</h4>
      <p>Cuando otros malinterpretan tu propósito o intención:</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🔄 Fórmula de Contraste</h4>
        <p><strong>Lo que NO quiero:</strong> "No quiero que pienses que no valoro tu trabajo..."</p>
        <p style="margin-bottom: 0;"><strong>Lo que SÍ quiero:</strong> "Lo que sí quiero es encontrar una manera de mejorar nuestros procesos juntos."</p>
      </div>
      
      <h4>3. 🎪 Crear Propósito Mutuo</h4>
      <p>Cuando parece que tienes propósitos opuestos:</p>
      
      <ul>
        <li><strong>Comprométete a buscar propósito mutuo:</strong> "Parece que queremos cosas diferentes. ¿Podemos hablar sobre lo que realmente queremos aquí?"</li>
        <li><strong>Reconoce el propósito detrás de la estrategia:</strong> "Creo que ambos queremos que el proyecto sea exitoso"</li>
        <li><strong>Inventa propósito mutuo:</strong> "¿Podríamos encontrar una solución que satisfaga ambas necesidades?"</li>
        <li><strong>Haz una lluvia de ideas de nuevas estrategias:</strong> "¿Qué opciones no hemos considerado?"</li>
      </ul>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "La seguridad no es la ausencia de tensión; es la presencia de respeto mutuo y propósito compartido."
      </blockquote>
      
      <h3>🎭 Ejemplo Práctico: Conversación con el Jefe</h3>
      <p><strong>Situación:</strong> Necesitas hablar con tu jefe sobre una carga de trabajo excesiva.</p>
      
      <p><strong>Crear Propósito Mutuo:</strong></p>
      <p>"Me gustaría hablar contigo sobre mi carga de trabajo actual. Sé que ambos queremos que yo sea exitoso en mi rol y que el equipo cumpla con nuestros objetivos. ¿Podríamos encontrar un momento para discutir cómo puedo manejar mejor mis responsabilidades?"</p>
      
      <p><strong>Contrastar:</strong></p>
      <p>"No quiero que pienses que no estoy comprometido con mi trabajo o que no puedo manejar desafíos. Lo que sí quiero es asegurarme de que puedo entregar trabajo de calidad en todos mis proyectos."</p>
      
      <h3>🌡️ Monitorear la Seguridad</h3>
      <p>Durante las conversaciones cruciales, constantemente monitorea:</p>
      
      <ul>
        <li><strong>El contenido:</strong> ¿De qué estamos hablando?</li>
        <li><strong>Las condiciones:</strong> ¿Cómo nos estamos tratando mutuamente?</li>
      </ul>
      
      <p>Cuando notes que la seguridad está en riesgo, detente y restáurala antes de continuar con el contenido.</p>
      
      <h3>🎯 Práctica Diaria</h3>
      <p>Para desarrollar tus habilidades de crear seguridad:</p>
      
      <ol>
        <li><strong>Observa:</strong> Nota cuándo las personas se vuelven silenciosas o violentas</li>
        <li><strong>Pregúntate:</strong> "¿Qué puedo hacer para que esta persona se sienta más segura?"</li>
        <li><strong>Experimenta:</strong> Prueba diferentes enfoques para crear seguridad</li>
        <li><strong>Reflexiona:</strong> ¿Qué funcionó? ¿Qué no funcionó?</li>
        </ol>
      
      <p>Recuerda: crear seguridad no significa evitar temas difíciles. Significa crear las condiciones donde los temas difíciles se pueden discutir productivamente.</p>
    `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
  ],
}

// Mock reading progress
const mockReadingProgress: ReadingProgress[] = [
  {
    id: "progress-1",
    user_id: "demo-user-id",
    book_id: "1",
    progress_percentage: 45,
    current_page: 144,
    last_read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "progress-2",
    user_id: "demo-user-id",
    book_id: "2",
    progress_percentage: 23,
    current_page: 68,
    last_read_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "progress-7",
    user_id: "demo-user-id",
    book_id: "7",
    progress_percentage: 78,
    current_page: 215,
    last_read_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
]

// Mock bookmarks
const mockBookmarks: Bookmark[] = [
  {
    id: "bookmark-1",
    user_id: "demo-user-id",
    book_id: "1",
    page_number: 1,
    note: "Importante: Los hábitos son el interés compuesto de la superación personal",
    created_at: new Date().toISOString(),
  },
  {
    id: "bookmark-2",
    user_id: "demo-user-id",
    book_id: "1",
    page_number: 3,
    note: "El ciclo: Señal → Anhelo → Respuesta → Recompensa",
    created_at: new Date().toISOString(),
  },
  {
    id: "bookmark-3",
    user_id: "demo-user-id",
    book_id: "3",
    page_number: 1,
    note: "La mesa de liderazgo - metáfora poderosa",
    created_at: new Date().toISOString(),
  },
]

// API Functions
export async function getBooks(): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBooks
}

export async function getBookById(id: string): Promise<Book | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockBooks.find((book) => book.id === id) || null
}

export async function getAllBooks(): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBooks
}

export async function getBookContent(bookId: string): Promise<BookContent[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockBookContent[bookId] || []
}

export async function getBookChapter(bookId: string, chapterNumber: number): Promise<BookContent | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const content = mockBookContent[bookId] || []
  return content.find((chapter) => chapter.chapter_number === chapterNumber) || null
}

export async function getReadingProgress(userId: string, bookId: string): Promise<ReadingProgress | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockReadingProgress.find((progress) => progress.user_id === userId && progress.book_id === bookId) || null
}

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  progressPercentage: number,
  currentPage: number,
): Promise<ReadingProgress> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const existingProgress = mockReadingProgress.find(
    (progress) => progress.user_id === userId && progress.book_id === bookId,
  )

  if (existingProgress) {
    existingProgress.progress_percentage = progressPercentage
    existingProgress.current_page = currentPage
    existingProgress.last_read_at = new Date().toISOString()
    return existingProgress
  } else {
    const newProgress: ReadingProgress = {
      id: `progress-${Date.now()}`,
      user_id: userId,
      book_id: bookId,
      progress_percentage: progressPercentage,
      current_page: currentPage,
      last_read_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    mockReadingProgress.push(newProgress)
    return newProgress
  }
}

export async function getUserBookmarks(userId: string, bookId: string): Promise<Bookmark[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockBookmarks.filter((bookmark) => bookmark.user_id === userId && bookmark.book_id === bookId)
}

export async function addBookmark(
  userId: string,
  bookId: string,
  pageNumber: number,
  note?: string,
): Promise<Bookmark> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newBookmark: Bookmark = {
    id: `bookmark-${Date.now()}`,
    user_id: userId,
    book_id: bookId,
    page_number: pageNumber,
    note: note,
    created_at: new Date().toISOString(),
  }

  mockBookmarks.push(newBookmark)
  return newBookmark
}

export async function removeBookmark(bookmarkId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockBookmarks.findIndex((bookmark) => bookmark.id === bookmarkId)
  if (index > -1) {
    mockBookmarks.splice(index, 1)
  }
}

export async function getUserReadingStats(userId: string): Promise<ReadingStats> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const userProgress = mockReadingProgress.filter((progress) => progress.user_id === userId)
  const completedBooks = userProgress.filter((progress) => progress.progress_percentage >= 100).length
  const averageProgress =
    userProgress.length > 0
      ? userProgress.reduce((sum, progress) => sum + progress.progress_percentage, 0) / userProgress.length
      : 0

  return {
    books_read: completedBooks,
    total_reading_time: completedBooks * 240, // Assume 4 hours per book
    average_progress: Math.round(averageProgress),
    reading_streak: 7, // Mock streak
  }
}

// Alias for backward compatibility
export const getReadingStats = getUserReadingStats

export async function searchBooks(query: string): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const lowercaseQuery = query.toLowerCase()
  return mockBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.description.toLowerCase().includes(lowercaseQuery) ||
      book.category.toLowerCase().includes(lowercaseQuery),
  )
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockBooks.filter((book) => book.category === category)
}

export async function getRecommendedBooks(userId: string): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Mock recommendation logic - return highly rated books
  return mockBooks
    .filter((book) => book.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
}
