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

export interface Achievement {
  id: string
  user_id: string
  name: string
  description: string
  image: string
  points: number
  created_at: string
}

export interface UserStats {
  user_id: string
  points: number
  reading_streak: number
  longest_streak: number
  books_read: number
  total_reading_time: number
  achievements: Achievement[]
}

// Libros organizados por categoría
const mockBooks: Book[] = [
  // PRODUCTIVIDAD
  {
    id: "1",
    title: "Hábitos Atómicos",
    author: "James Clear",
    description:
      "Una guía práctica para formar buenos hábitos y romper los malos. Aprende cómo pequeños cambios pueden generar resultados extraordinarios.",
    category: "Productividad",
    rating: 4.8,
    reading_time: "4h 30min",
    difficulty: "Intermedio",
    publication_year: 2018,
    total_pages: 8,
    created_at: new Date().toISOString(),
    is_free: true,
  },
  {
    id: "2",
    title: "Trabajo Profundo",
    author: "Cal Newport",
    description:
      "Reglas para el éxito enfocado en un mundo distraído. Desarrolla la habilidad más valiosa del siglo XXI.",
    category: "Productividad",
    rating: 4.7,
    reading_time: "4h 45min",
    difficulty: "Intermedio",
    publication_year: 2016,
    total_pages: 6,
    created_at: new Date().toISOString(),
    is_free: true,
  },
  {
    id: "3",
    title: "La Semana Laboral de 4 Horas",
    author: "Timothy Ferriss",
    description: "Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos.",
    category: "Productividad",
    rating: 4.2,
    reading_time: "4h 20min",
    difficulty: "Intermedio",
    publication_year: 2007,
    total_pages: 5,
    created_at: new Date().toISOString(),
    is_free: true,
  },

  // LIDERAZGO
  {
    id: "4",
    title: "Vayamos Adelante",
    author: "Sheryl Sandberg",
    description: "Las mujeres, el trabajo y la voluntad de liderar. Un libro inspirador sobre liderazgo femenino.",
    category: "Liderazgo",
    rating: 4.5,
    reading_time: "3h 20min",
    difficulty: "Fácil",
    publication_year: 2013,
    total_pages: 6,
    created_at: new Date().toISOString(),
    is_free: true,
  },
  {
    id: "5",
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    description: "Lecciones poderosas de cambio personal. Los principios fundamentales para el éxito.",
    category: "Liderazgo",
    rating: 4.8,
    reading_time: "5h 45min",
    difficulty: "Intermedio",
    publication_year: 1989,
    total_pages: 7,
    created_at: new Date().toISOString(),
    is_free: true,
  },
  {
    id: "6",
    title: "Empresas que Sobresalen",
    author: "Jim Collins",
    description: "Por qué algunas empresas dan el salto... y otras no. Análisis de empresas excepcionales.",
    category: "Liderazgo",
    rating: 4.7,
    reading_time: "6h 30min",
    difficulty: "Avanzado",
    publication_year: 2001,
    total_pages: 5,
    created_at: new Date().toISOString(),
    is_free: true,
  },

  // HABILIDADES BLANDAS
  {
    id: "7",
    title: "Inteligencia Emocional 2.0",
    author: "Travis Bradberry",
    description: "Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales.",
    category: "Habilidades Blandas",
    rating: 4.4,
    reading_time: "3h 50min",
    difficulty: "Fácil",
    publication_year: 2009,
    total_pages: 6,
    created_at: new Date().toISOString(),
    is_free: true,
  },
  {
    id: "8",
    title: "Conversaciones Cruciales",
    author: "Kerry Patterson",
    description: "Herramientas para hablar cuando las apuestas son altas. Maneja conversaciones difíciles.",
    category: "Habilidades Blandas",
    rating: 4.6,
    reading_time: "4h 10min",
    difficulty: "Intermedio",
    publication_year: 2002,
    total_pages: 5,
    created_at: new Date().toISOString(),
    is_free: true,
  },

  // DESARROLLO PERSONAL
  {
    id: "9",
    title: "Mentalidad",
    author: "Carol S. Dweck",
    description: "La nueva psicología del éxito. Descubre cómo una mentalidad de crecimiento transforma tu vida.",
    category: "Desarrollo Personal",
    rating: 4.5,
    reading_time: "4h 15min",
    difficulty: "Fácil",
    publication_year: 2006,
    total_pages: 6,
    created_at: new Date().toISOString(),
    is_free: true,
  },
  {
    id: "10",
    title: "El Poder del Ahora",
    author: "Eckhart Tolle",
    description: "Una guía hacia la iluminación espiritual. Aprende a vivir en el presente.",
    category: "Desarrollo Personal",
    rating: 4.3,
    reading_time: "3h 40min",
    difficulty: "Intermedio",
    publication_year: 1997,
    total_pages: 5,
    created_at: new Date().toISOString(),
    is_free: true,
  },

  // NEGOCIOS
  {
    id: "11",
    title: "La Startup Lean",
    author: "Eric Ries",
    description: "Cómo los emprendedores usan la innovación continua para crear negocios exitosos.",
    category: "Negocios",
    rating: 4.3,
    reading_time: "4h 10min",
    difficulty: "Intermedio",
    publication_year: 2011,
    total_pages: 6,
    created_at: new Date().toISOString(),
    is_free: true,
  },
  {
    id: "12",
    title: "De Cero a Uno",
    author: "Peter Thiel",
    description: "Notas sobre startups, o cómo construir el futuro. Perspectivas únicas sobre innovación.",
    category: "Negocios",
    rating: 4.4,
    reading_time: "3h 30min",
    difficulty: "Avanzado",
    publication_year: 2014,
    total_pages: 5,
    created_at: new Date().toISOString(),
    is_free: true,
  },
]

// Contenido completo de los libros con múltiples capítulos
const mockBookContent: { [key: string]: BookContent[] } = {
  // HÁBITOS ATÓMICOS - 8 CAPÍTULOS
  "1": [
    {
      id: "content-1-1",
      book_id: "1",
      chapter_number: 1,
      title: "Los Fundamentos: Por qué los pequeños cambios marcan una gran diferencia",
      content: `
        <h1>Capítulo 1: Los Fundamentos</h1>
        <p><strong>Los hábitos son el interés compuesto de la superación personal.</strong> De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.</p>
        
        <h2>🚀 El poder de los pequeños cambios</h2>
        <p>Si puedes mejorar tan solo un <strong>1% cada día</strong> durante un año, terminarás siendo treinta y siete veces mejor al final del período.</p>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <h3 style="color: #1e40af; margin-top: 0;">📊 La matemática del 1%</h3>
          <ul>
            <li><strong>1% mejor cada día:</strong> 1.01^365 = 37.78</li>
            <li><strong>1% peor cada día:</strong> 0.99^365 = 0.03</li>
          </ul>
        </div>
        
        <blockquote style="border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; background-color: #f8fafc; border-radius: 8px;">
          "El éxito es el producto de hábitos diarios, no de transformaciones de una sola vez."
        </blockquote>
        
        <h2>🎯 El Valle de la Desilusión</h2>
        <p>Los hábitos a menudo parecen no marcar diferencia hasta que cruzas un umbral crítico y desbloqueas un nuevo nivel de rendimiento.</p>
        
        <p>Esto es una de las razones principales por las que es tan difícil construir hábitos que perduren. Las personas hacen algunos pequeños cambios, no ven resultados tangibles, y deciden parar.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-2",
      book_id: "1",
      chapter_number: 2,
      title: "Cómo Funcionan Tus Hábitos",
      content: `
        <h1>Capítulo 2: Cómo Funcionan Tus Hábitos</h1>
        <p>Un hábito es una rutina o comportamiento que se realiza regularmente y, en muchos casos, automáticamente.</p>
        
        <h2>🔄 El Bucle del Hábito</h2>
        <p>Todos los hábitos siguen el mismo patrón de cuatro pasos:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🎯 Los 4 Pasos del Hábito</h3>
          <ol>
            <li><strong>Señal:</strong> El desencadenante que inicia el comportamiento</li>
            <li><strong>Anhelo:</strong> La fuerza motivacional detrás de cada hábito</li>
            <li><strong>Respuesta:</strong> El hábito real que realizas</li>
            <li><strong>Recompensa:</strong> El beneficio que obtienes del hábito</li>
          </ol>
        </div>
        
        <h2>🔧 Las Cuatro Leyes del Cambio de Comportamiento</h2>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">✅ Cómo Crear un Buen Hábito</h3>
          <ul>
            <li><strong>1ª Ley (Señal):</strong> Hazlo obvio</li>
            <li><strong>2ª Ley (Anhelo):</strong> Hazlo atractivo</li>
            <li><strong>3ª Ley (Respuesta):</strong> Hazlo fácil</li>
            <li><strong>4ª Ley (Recompensa):</strong> Hazlo satisfactorio</li>
          </ul>
        </div>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-3",
      book_id: "1",
      chapter_number: 3,
      title: "La Primera Ley: Hazlo Obvio",
      content: `
        <h1>Capítulo 3: La Primera Ley - Hazlo Obvio</h1>
        <p>El proceso de cambio de comportamiento siempre comienza con la conciencia. Necesitas ser consciente de tus hábitos antes de poder cambiarlos.</p>
        
        <h2>👁️ El Poder de la Conciencia</h2>
        <p>Muchos de nuestros hábitos diarios se realizan de forma automática. Hasta que no hagas lo inconsciente consciente, dirigirá tu vida.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">📝 Ejercicio: El Registro de Hábitos</h3>
          <p>Haz una lista de tus hábitos diarios. Para cada hábito, clasifícalo como:</p>
          <ul>
            <li><strong>Positivo (+):</strong> Un buen hábito</li>
            <li><strong>Negativo (-):</strong> Un mal hábito</li>
            <li><strong>Neutral (=):</strong> Un hábito neutro</li>
          </ul>
        </div>
        
        <h2>🔗 Apilamiento de Hábitos</h2>
        <p>La fórmula del apilamiento de hábitos es:</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold;">
          "Después de [HÁBITO ACTUAL], yo haré [NUEVO HÁBITO]."
        </blockquote>
        
        <h2>🏠 Diseño del Entorno</h2>
        <p>El entorno es la mano invisible que da forma al comportamiento humano.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #d97706;">💡 Ejemplos de "Hazlo Obvio"</h3>
          <ul>
            <li><strong>Leer más:</strong> Coloca un libro en tu almohada cada mañana</li>
            <li><strong>Hacer ejercicio:</strong> Prepara tu ropa de gimnasio la noche anterior</li>
            <li><strong>Comer saludable:</strong> Coloca frutas en un lugar visible</li>
            <li><strong>Beber más agua:</strong> Llena una botella de agua y ponla en tu escritorio</li>
          </ul>
        </div>
      `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-4",
      book_id: "1",
      chapter_number: 4,
      title: "La Segunda Ley: Hazlo Atractivo",
      content: `
        <h1>Capítulo 4: La Segunda Ley - Hazlo Atractivo</h1>
        <p>Los hábitos son un bucle de retroalimentación impulsado por la dopamina. Cuando la dopamina aumenta, también lo hace nuestra motivación para actuar.</p>
        
        <h2>🧠 La Ciencia de la Dopamina</h2>
        <p>La dopamina no solo se libera cuando experimentas placer, sino también cuando lo <em>anticipas</em>.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🔬 Datos sobre la Dopamina</h3>
          <ul>
            <li>Los niveles de dopamina aumentan más por la <strong>anticipación</strong> que por la recompensa real</li>
            <li>La incertidumbre amplifica la dopamina</li>
            <li>Los hábitos que liberan dopamina se vuelven más atractivos con el tiempo</li>
          </ul>
        </div>
        
        <h2>🎭 Agrupación de Tentaciones</h2>
        <p>Una estrategia para hacer que los hábitos sean más atractivos es usar la "agrupación de tentaciones":</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "Después de [HÁBITO QUE NECESITO], haré [HÁBITO QUE QUIERO]."
        </blockquote>
        
        <h2>👥 El Papel del Entorno Social</h2>
        <p>Los humanos somos animales de manada. Los hábitos de las personas que nos rodean tienen una influencia profunda en nuestro propio comportamiento.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">🌟 Los Tres Grupos que Nos Influencian</h3>
          <ol>
            <li><strong>Los Cercanos:</strong> Familia y amigos cercanos</li>
            <li><strong>Los Muchos:</strong> La tribu o comunidad más amplia</li>
            <li><strong>Los Poderosos:</strong> Aquellos con estatus y prestigio</li>
          </ol>
        </div>
      `,
      page_number: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-5",
      book_id: "1",
      chapter_number: 5,
      title: "La Tercera Ley: Hazlo Fácil",
      content: `
        <h1>Capítulo 5: La Tercera Ley - Hazlo Fácil</h1>
        <p>Los hábitos más efectivos son aquellos que requieren el menor esfuerzo. La cantidad de tiempo que has estado realizando un hábito no es tan importante como el número de veces que lo has realizado.</p>
        
        <h2>⚡ La Regla de los Dos Minutos</h2>
        <p>Cuando empiezas un nuevo hábito, debe tomar menos de dos minutos hacer.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">⏱️ Ejemplos de la Regla de Dos Minutos</h3>
          <ul>
            <li><strong>"Leer antes de dormir"</strong> → "Leer una página"</li>
            <li><strong>"Hacer 30 minutos de yoga"</strong> → "Sacar mi esterilla de yoga"</li>
            <li><strong>"Estudiar para la clase"</strong> → "Abrir mis apuntes"</li>
            <li><strong>"Correr 5 kilómetros"</strong> → "Atarme los zapatos para correr"</li>
          </ul>
        </div>
        
        <h2>🏗️ Preparación del Entorno</h2>
        <p>Puedes hacer que los buenos hábitos sean más convenientes reduciendo la fricción asociada con ellos.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #d97706;">🔧 Estrategias para Reducir la Fricción</h3>
          <ul>
            <li><strong>Preparación:</strong> Prepara tu entorno para el éxito futuro</li>
            <li><strong>Proximidad:</strong> Coloca las herramientas cerca de donde las necesitas</li>
            <li><strong>Simplificación:</strong> Elimina pasos innecesarios del proceso</li>
            <li><strong>Automatización:</strong> Usa la tecnología para hacer el trabajo por ti</li>
          </ul>
        </div>
        
        <h2>🚀 Automatización y Tecnología</h2>
        <p>La mejor manera de romper un mal hábito es hacer que sea imposible hacerlo. La mejor manera de construir un buen hábito es hacer que sea inevitable hacerlo.</p>
      `,
      page_number: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-6",
      book_id: "1",
      chapter_number: 6,
      title: "La Cuarta Ley: Hazlo Satisfactorio",
      content: `
        <h1>Capítulo 6: La Cuarta Ley - Hazlo Satisfactorio</h1>
        <p>Es más probable que repitamos un comportamiento cuando la experiencia es satisfactoria. Este capítulo explora cómo hacer que los buenos hábitos sean irresistibles a largo plazo.</p>
        
        <h2>🎯 El Poder de la Recompensa Inmediata</h2>
        <p>Nuestro cerebro está cableado para priorizar las recompensas inmediatas sobre las recompensas retrasadas.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">💡 Estrategias para la Satisfacción Inmediata</h3>
          <ul>
            <li><strong>Sistema de recompensas:</strong> Date un pequeño premio después de cada buen hábito</li>
            <li><strong>Seguimiento visual:</strong> Usa un calendario o app para marcar tus progresos</li>
            <li><strong>Rituales positivos:</strong> Asocia el hábito con algo que disfrutes</li>
            <li><strong>Celebración:</strong> Reconoce tus logros, por pequeños que sean</li>
          </ul>
        </div>
        
        <h2>📈 El Seguimiento de Hábitos</h2>
        <p>Una de las formas más efectivas de hacer que un hábito sea satisfactorio es medirlo.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "Lo que se mide, se mejora."
        </blockquote>
        
        <h2>🤝 El Poder de un Socio de Responsabilidad</h2>
        <p>Tener un socio de responsabilidad puede aumentar significativamente tus posibilidades de éxito.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #d97706;">👥 Beneficios de un Socio</h3>
          <ul>
            <li><strong>Apoyo emocional:</strong> Te ayuda a superar los momentos difíciles</li>
            <li><strong>Motivación:</strong> Te anima a seguir adelante cuando te sientes desanimado</li>
            <li><strong>Retroalimentación honesta:</strong> Te da una perspectiva objetiva de tu progreso</li>
            <li><strong>Responsabilidad:</strong> Te ayuda a mantenerte comprometido con tus metas</li>
          </ul>
        </div>
      `,
      page_number: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-7",
      book_id: "1",
      chapter_number: 7,
      title: "La Regla de Oro del Cambio de Hábitos",
      content: `
        <h1>Capítulo 7: La Regla de Oro del Cambio de Hábitos</h1>
        <p>La regla de oro del cambio de hábitos es: <strong>Nunca pierdas dos veces seguidas.</strong></p>
        
        <h2>🔄 La Importancia de la Consistencia</h2>
        <p>La consistencia es clave para construir hábitos duraderos. Sin embargo, todos nos saltamos un hábito de vez en cuando. Lo importante es no dejar que un desliz se convierta en una espiral descendente.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🎯 Estrategias para Volver a Encarrilarte</h3>
          <ul>
            <li><strong>Perdónate a ti mismo:</strong> No te castigues por el desliz</li>
            <li><strong>Identifica la causa:</strong> ¿Por qué te saltaste el hábito?</li>
            <li><strong>Ajusta tu plan:</strong> Haz los cambios necesarios para evitar que vuelva a ocurrir</li>
            <li><strong>Vuelve a empezar de inmediato:</strong> No esperes hasta el lunes o el próximo mes</li>
          </ul>
        </div>
        
        <h2>🧠 El Impacto de los Deslices</h2>
        <p>Un desliz ocasional no arruinará tu progreso, pero dos deslices seguidos pueden ser desastrosos. Esto se debe a que dos deslices seguidos crean una nueva norma en tu cerebro.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "Nunca pierdas dos veces seguidas. Es la diferencia entre mantener el rumbo y descarrilar por completo."
        </blockquote>
        
        <h2>📅 La Estrategia del Calendario</h2>
        <p>Una forma efectiva de aplicar la regla de oro es usar un calendario para realizar un seguimiento de tus hábitos. Marca cada día que cumples con el hábito y haz todo lo posible para evitar romper la cadena.</p>
      `,
      page_number: 7,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-8",
      book_id: "1",
      chapter_number: 8,
      title: "Cómo Mantener la Motivación y Evitar el Aburrimiento",
      content: `
        <h1>Capítulo 8: Cómo Mantener la Motivación y Evitar el Aburrimiento</h1>
        <p>Una vez que un hábito se ha establecido, el desafío se convierte en mantener la motivación a largo plazo y evitar que se vuelva aburrido.</p>
        
        <h2>🎯 La Regla de Ricitos de Oro</h2>
        <p>Los humanos experimentan máxima motivación cuando trabajan en tareas que están justo en el borde de sus habilidades actuales. No demasiado difícil. No demasiado fácil. Justo bien.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">🌟 Características del Desafío Óptimo</h3>
          <ul>
            <li><strong>4% más difícil:</strong> El nivel perfecto de dificultad para mantener el compromiso</li>
            <li><strong>Progreso medible:</strong> Puedes ver claramente tu mejora</li>
            <li><strong>Variedad dentro de la estructura:</strong> Cambios pequeños que mantienen el interés</li>
            <li><strong>Retroalimentación inmediata:</strong> Sabes instantáneamente cómo lo estás haciendo</li>
          </ul>
        </div>
        
        <h2>🔄 La Importancia de la Reflexión y Revisión</h2>
        <p>Sin reflexión, podemos hacer excusas, crear racionalizaciones y engañarnos a nosotros mismos. Sin revisión, no aprendemos de nuestros errores.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #d97706;">📝 Sistema de Revisión Anual</h3>
          <p>Cada diciembre, realiza una revisión anual:</p>
          <ul>
            <li><strong>¿Qué salió bien este año?</strong></li>
            <li><strong>¿Qué no salió bien este año?</strong></li>
            <li><strong>¿Qué aprendí?</strong></li>
          </ul>
        </div>
        
        <h2>🚀 El Camino Hacia la Maestría</h2>
        <p>La diferencia entre los profesionales y los aficionados es su capacidad para manejar el aburrimiento de entrenar todos los días.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "Los profesionales se adhieren al horario; los aficionados dejan que la vida se interponga en el camino."
        </blockquote>
        
        <p>Los hábitos no restringen la libertad. La crean. Sin buenos hábitos financieros, siempre lucharás por la libertad financiera. Sin buenos hábitos de salud, siempre parecerás estar luchando por más energía.</p>
        
        <p>Los hábitos son el camino hacia la libertad.</p>
      `,
      page_number: 8,
      created_at: new Date().toISOString(),
    },
  ],

  // TRABAJO PROFUNDO - 6 CAPÍTULOS
  "2": [
    {
      id: "content-2-1",
      book_id: "2",
      chapter_number: 1,
      title: "Trabajo Profundo es Valioso",
      content: `
        <h1>Capítulo 1: Trabajo Profundo es Valioso</h1>
        <p><strong>Trabajo Profundo:</strong> Actividades profesionales realizadas en un estado de concentración libre de distracciones que empujan tus capacidades cognitivas a su límite.</p>
        
        <h2>🌊 La Nueva Economía del Conocimiento</h2>
        <p>Estamos en medio de una transformación económica. La capacidad de realizar trabajo profundo se está volviendo cada vez más <strong>rara</strong> al mismo tiempo que se vuelve cada vez más <strong>valiosa</strong>.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🎯 Los Tres Grupos que Prosperarán</h3>
          <ol>
            <li><strong>Aquellos que pueden trabajar bien y creativamente con tecnología inteligente</strong></li>
            <li><strong>Aquellos que son los mejores en lo que hacen</strong></li>
            <li><strong>Aquellos con acceso al capital</strong></li>
          </ol>
        </div>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "El trabajo profundo no es solo una habilidad útil, es un superpoder en nuestra economía cada vez más competitiva."
        </blockquote>
        
        <h2>🧠 Las Dos Habilidades Centrales para Prosperar</h2>
        <p>Para permanecer valioso en nuestra economía, debes dominar:</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">🎯 Habilidades Clave</h3>
          <ol>
            <li><strong>Dominar Rápidamente Cosas Difíciles:</strong> Las tecnologías cambian rápidamente</li>
            <li><strong>Producir a un Nivel Elite:</strong> Transformar talento en resultados valiosos</li>
          </ol>
        </div>
        
        <p><strong>Ambas habilidades centrales dependen de tu capacidad para realizar trabajo profundo.</strong></p>
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
        <h1>Capítulo 2: Trabajo Profundo es Raro</h1>
        <p>En una economía de la información, muchas personas confunden estar ocupado con ser productivo.</p>
        
        <h2>📧 La Tiranía del Email</h2>
        <p>El email se ha convertido en una fuente constante de distracción. El trabajador promedio revisa su email cada 6 minutos.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #dc2626;">📊 Estadísticas Alarmantes</h3>
          <ul>
            <li>El trabajador promedio revisa email cada <strong>6 minutos</strong></li>
            <li>Se necesitan <strong>23 minutos</strong> para recuperar la concentración después de una interrupción</li>
            <li>Los trabajadores pasan <strong>30%</strong> de su tiempo leyendo y respondiendo emails</li>
            <li>Las reuniones han aumentado <strong>50%</strong> en la última década</li>
          </ul>
        </div>
        
        <h2>🏢 La Cultura de la Conectividad</h2>
        <p>Muchas organizaciones han desarrollado una "cultura de la conectividad" donde estar conectado está valorado por encima de la productividad real.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "La cultura de la conectividad es seductiva. Es fácil, es divertida, y hace que te sientas como si estuvieras haciendo algo importante."
        </blockquote>
        
        <h2>🎭 El Principio del Mínimo Esfuerzo</h2>
        <p>En ausencia de indicadores claros de productividad, muchos trabajadores recurren a hacer muchas cosas de manera visible.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">⚡ Comportamientos de Mínimo Esfuerzo</h3>
          <ul>
            <li><strong>Responder emails inmediatamente</strong> es más fácil que pensar profundamente</li>
            <li><strong>Programar reuniones</strong> es más fácil que tomar decisiones difíciles</li>
            <li><strong>Usar redes sociales</strong> es más fácil que crear contenido original</li>
            <li><strong>Multitasking</strong> se siente productivo pero reduce la calidad</li>
          </ul>
        </div>
        
        <h2>🚀 La Oportunidad</h2>
        <p>La rareza del trabajo profundo representa una tremenda oportunidad. Aquellos que cultiven esta habilidad prosperarán.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-2-3",
      book_id: "2",
      chapter_number: 3,
      title: "Trabajo Profundo es Significativo",
      content: `
        <h1>Capítulo 3: Trabajo Profundo es Significativo</h1>
        <p>El trabajo profundo no es solo económicamente valioso, también es profundamente satisfactorio. Una vida vivida profundamente es una vida bien vivida.</p>
        
        <h2>🧠 La Neurología de la Concentración</h2>
        <p>Los neurocientíficos han descubierto que el estado de concentración mental que acompaña al trabajo profundo es también un estado de bienestar.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🔬 La Ciencia de la Concentración</h3>
          <ul>
            <li><strong>Dopamina:</strong> Se libera cuando nos enfocamos en tareas desafiantes</li>
            <li><strong>Noradrenalina:</strong> Mejora la atención y el estado de alerta</li>
            <li><strong>Endorfinas:</strong> Crean sensaciones de bienestar durante el trabajo intenso</li>
            <li><strong>Anandamida:</strong> Promueve el pensamiento lateral y la creatividad</li>
          </ul>
        </div>
        
        <h2>🌊 El Estado de Flujo</h2>
        <p>El psicólogo Mihaly Csikszentmihalyi describió el "flujo" como el estado mental en el que una persona está completamente inmersa en una actividad.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "Los mejores momentos de nuestras vidas no son los tiempos pasivos, receptivos, relajantes... Los mejores momentos usualmente ocurren cuando el cuerpo o la mente de una persona se estira hasta sus límites."
        </blockquote>
        
        <h2>🎯 Características del Estado de Flujo</h2>
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">🌟 Elementos del Flujo</h3>
          <ul>
            <li><strong>Concentración completa:</strong> Atención total en la tarea presente</li>
            <li><strong>Objetivos claros:</strong> Sabes exactamente qué necesitas hacer</li>
            <li><strong>Retroalimentación inmediata:</strong> Puedes ver tu progreso en tiempo real</li>
            <li><strong>Equilibrio desafío-habilidad:</strong> La tarea es desafiante pero alcanzable</li>
            <li><strong>Pérdida de autoconciencia:</strong> Te olvidas de ti mismo y tus preocupaciones</li>
          </ul>
        </div>
        
        <h2>🔨 La Ética del Artesano</h2>
        <p>El trabajo profundo se conecta con la "ética del artesano" - la idea de que hay algo intrínsecamente valioso en hacer algo bien.</p>
      `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-2-4",
      book_id: "2",
      chapter_number: 4,
      title: "Regla #1: Trabaja Profundamente",
      content: `
        <h1>Capítulo 4: Regla #1 - Trabaja Profundamente</h1>
        <p>Para cultivar una vida de trabajo profundo, necesitas más que solo la filosofía correcta; necesitas también un conjunto de prácticas diseñadas para integrar el trabajo profundo en tu vida.</p>
        
        <h2>📅 Decide Tu Filosofía de Profundidad</h2>
        <p>Hay diferentes filosofías que puedes adoptar, dependiendo de tus necesidades y circunstancias.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🎯 Filosofías de Profundidad</h3>
          <ul>
            <li><strong>La Filosofía Monástica:</strong> Eliminar todas las distracciones para maximizar el trabajo profundo</li>
            <li><strong>La Filosofía Bimodal:</strong> Dividir tu tiempo entre períodos de trabajo profundo y actividades superficiales</li>
            <li><strong>La Filosofía Rítmica:</strong> Establecer una rutina diaria o semanal para el trabajo profundo</li>
            <li><strong>La Filosofía Periodística:</strong> Aprovechar cualquier oportunidad para realizar trabajo profundo</li>
          </ul>
        </div>
        
        <h2>⏱️ Ritualiza</h2>
        <p>Los rituales te ayudan a entrar en el estado mental adecuado y a minimizar la resistencia.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "Los rituales son la clave para convertir una buena intención en una práctica real."
        </blockquote>
        
        <h2>🌟 Elementos de un Ritual de Trabajo Profundo</h2>
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">✅ Elementos Clave</h3>
          <ul>
            <li><strong>Ubicación:</strong> Elige un lugar tranquilo y libre de distracciones</li>
            <li><strong>Tiempo:</strong> Define un horario específico para el trabajo profundo</li>
            <li><strong>Duración:</strong> Decide cuánto tiempo dedicarás a cada sesión</li>
            <li><strong>Reglas:</strong> Establece reglas claras sobre lo que puedes y no puedes hacer</li>
            <li><strong>Apoyo:</strong> Asegúrate de tener los recursos necesarios</li>
          </ul>
        </div>
      `,
      page_number: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-2-5",
      book_id: "2",
      chapter_number: 5,
      title: "Regla #2: Abraza el Aburrimiento",
      content: `
        <h1>Capítulo 5: Regla #2 - Abraza el Aburrimiento</h1>
        <p>Si quieres cultivar el hábito del trabajo profundo, debes reconstruir tu capacidad de concentración. Una de las mejores maneras de hacerlo es abrazar el aburrimiento.</p>
        
        <h2>🧠 El Cerebro y la Concentración</h2>
        <p>Nuestro cerebro está diseñado para buscar la novedad y la estimulación. Sin embargo, la concentración requiere la capacidad de ignorar las distracciones.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🔬 La Ciencia del Aburrimiento</h3>
          <ul>
            <li><strong>El aburrimiento es una señal:</strong> Indica que tu cerebro necesita un desafío</li>
            <li><strong>El aburrimiento puede ser productivo:</strong> Te obliga a ser creativo</li>
            <li><strong>El aburrimiento fortalece la concentración:</strong> Te ayuda a desarrollar resistencia mental</li>
          </ul>
        </div>
        
        <h2>📱 La Distracción Digital y el Aburrimiento</h2>
        <p>La distracción digital ha debilitado nuestra capacidad de tolerar el aburrimiento. Estamos constantemente buscando estimulación en nuestros dispositivos.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "La capacidad de tolerar el aburrimiento es una habilidad crucial para el éxito en el mundo moderno."
        </blockquote>
        
        <h2>🎯 Estrategias para Abrazar el Aburrimiento</h2>
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">✅ Técnicas para Cultivar la Concentración</h3>
          <ul>
            <li><strong>Programa tiempo para el aburrimiento:</strong> Dedica tiempo a actividades sin estimulación digital</li>
            <li><strong>Medita:</strong> Practica la atención plena para fortalecer tu concentración</li>
            <li><strong>Lee libros:</strong> Sumérgete en historias y evita las distracciones digitales</li>
            <li><strong>Camina en la naturaleza:</strong> Disfruta del entorno natural sin usar tu teléfono</li>
          </ul>
        </div>
        
        <h2>🚶 El Paseo Productivo</h2>
        <p>Una forma efectiva de abrazar el aburrimiento es realizar un paseo productivo. Esto implica caminar sin un destino específico y permitir que tu mente divague.</p>
      `,
      page_number: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-2-6",
      book_id: "2",
      chapter_number: 6,
      title: "Regla #3: Abandona las Redes Sociales",
      content: `
        <h1>Capítulo 6: Regla #3 - Abandona las Redes Sociales</h1>
        <p>Las redes sociales son una de las mayores fuentes de distracción en el mundo moderno. Para cultivar una vida de trabajo profundo, es necesario abandonar las redes sociales o, al menos, limitar su uso.</p>
        
        <h2>📱 El Impacto de las Redes Sociales</h2>
        <p>Las redes sociales están diseñadas para ser adictivas. Utilizan algoritmos para mostrarte contenido que te mantendrá enganchado.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #d97706;">💡 Estrategias para Limitar el Uso de Redes Sociales</h3>
          <ul>
            <li><strong>Desactiva las notificaciones:</strong> Evita las interrupciones constantes</li>
            <li><strong>Elimina las aplicaciones:</strong> Haz que sea más difícil acceder a las redes sociales</li>
            <li><strong>Establece límites de tiempo:</strong> Usa aplicaciones para limitar el tiempo</li>
            <li><strong>Encuentra alternativas:</strong> Busca actividades que te proporcionen satisfacción real</li>
          </ul>
        </div>
        
        <h2>🎯 El Experimento de la Desintoxicación Digital</h2>
        <p>Una forma efectiva de evaluar el impacto de las redes sociales en tu vida es realizar un experimento de desintoxicación digital.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">✅ Pasos para la Desintoxicación Digital</h3>
          <ul>
            <li><strong>Define un período de tiempo:</strong> Decide cuánto tiempo durará la desintoxicación</li>
            <li><strong>Elimina las aplicaciones:</strong> Desinstala las aplicaciones de redes sociales</li>
            <li><strong>Informa a tus contactos:</strong> Hazles saber que no estarás disponible en redes sociales</li>
            <li><strong>Encuentra alternativas:</strong> Busca actividades que te proporcionen satisfacción</li>
            <li><strong>Reflexiona sobre tu experiencia:</strong> Anota tus pensamientos y sentimientos</li>
          </ul>
        </div>
        
        <h2>🌟 Beneficios de Abandonar las Redes Sociales</h2>
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">✅ Ventajas de la Desconexión</h3>
          <ul>
            <li><strong>Mayor concentración:</strong> Te permite enfocarte en tareas importantes</li>
            <li><strong>Más tiempo libre:</strong> Te libera tiempo para actividades significativas</li>
            <li><strong>Mejor salud mental:</strong> Reduce el estrés, la ansiedad y la depresión</li>
            <li><strong>Relaciones más significativas:</strong> Te permite conectar más profundamente</li>
          </ul>
        </div>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "El trabajo profundo no es compatible con una presencia constante en las redes sociales."
        </blockquote>
      `,
      page_number: 6,
      created_at: new Date().toISOString(),
    },
  ],

  // LA SEMANA LABORAL DE 4 HORAS - 5 CAPÍTULOS
  "3": [
    {
      id: "content-3-1",
      book_id: "3",
      chapter_number: 1,
      title: "Definición: Nuevas Reglas del Juego",
      content: `
        <h1>Capítulo 1: Definición - Nuevas Reglas del Juego</h1>
        <p>La mayoría de las personas trabajarán durante 40+ años, tendrán unas pocas semanas de vacaciones al año, y luego se jubilarán con una pensión reducida. Este libro te mostrará cómo escapar de esa trampa.</p>
        
        <h2>🎯 Los Nuevos Ricos (NR)</h2>
        <p>Los Nuevos Ricos son aquellos que han abandonado el plan de vida diferida y han creado estilos de vida de lujo en el presente usando las monedas de los nuevos ricos: tiempo y movilidad.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">💡 Características de los Nuevos Ricos</h3>
          <ul>
            <li><strong>Tiempo:</strong> Tener tiempo libre cuando lo desees</li>
            <li><strong>Movilidad:</strong> Poder trabajar desde cualquier lugar</li>
            <li><strong>Dinero:</strong> Suficiente dinero para hacer lo que quieres</li>
            <li><strong>Propósito:</strong> Hacer trabajo que tenga significado</li>
          </ul>
        </div>
        
        <h2>📊 El Mito de los Millones</h2>
        <p>No necesitas ser millonario para vivir como uno. La clave está en crear flujos de ingresos pasivos que te permitan tener libertad de tiempo y ubicación.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "Ser rico es tener lo que quieres. Ser poderoso es no necesitar lo que no quieres."
        </blockquote>
        
        <h2>🔄 El Proceso DEAL</h2>
        <p>Este libro está organizado alrededor del proceso DEAL:</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">🎯 El Proceso DEAL</h3>
          <ul>
            <li><strong>D - Definición:</strong> Reemplazar las suposiciones y definir objetivos</li>
            <li><strong>E - Eliminación:</strong> Olvidar la gestión del tiempo y enfocarse en lo importante</li>
            <li><strong>A - Automatización:</strong> Crear ingresos en piloto automático</li>
            <li><strong>L - Liberación:</strong> Escapar del escritorio y crear movilidad</li>
          </ul>
        </div>
        
        <h2>⚡ Reglas de los Nuevos Ricos</h2>
        <p>Los Nuevos Ricos operan bajo un conjunto diferente de reglas:</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #d97706;">🌟 Nuevas Reglas</h3>
          <ul>
            <li><strong>Retiro:</strong> Es una póliza de seguro basada en el peor escenario</li>
            <li><strong>Interés:</strong> Busca ser interesante en lugar de estar interesado</li>
            <li><strong>Dinero:</strong> El dinero solo es útil para las cosas que quieres hacer</li>
            <li><strong>Ingresos relativos:</strong> $50,000/año trabajando 10 horas es mejor que $100,000/año trabajando 80 horas</li>
          </ul>
        </div>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-2",
      book_id: "3",
      chapter_number: 2,
      title: "Eliminación: El Arte de Ignorar",
      content: `
        <h1>Capítulo 2: Eliminación - El Arte de Ignorar</h1>
        <p>Estar ocupado es una forma de pereza: pensamiento perezoso y acciones indiscriminadas. Ser selectivo es la clave de la efectividad.</p>
        
        <h2>📏 La Ley de Pareto (80/20)</h2>
        <p>El 80% de los resultados provienen del 20% de las causas y esfuerzos. Identifica y enfócate en ese 20% vital.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🎯 Aplicando el 80/20</h3>
          <ul>
            <li><strong>En clientes:</strong> ¿Qué 20% de clientes generan el 80% de ingresos?</li>
            <li><strong>En productos:</strong> ¿Qué 20% de productos generan el 80% de ganancias?</li>
            <li><strong>En actividades:</strong> ¿Qué 20% de actividades generan el 80% de felicidad?</li>
            <li><strong>En problemas:</strong> ¿Qué 20% de fuentes causan el 80% de problemas?</li>
          </ul>
        </div>
        
        <h2>⚔️ La Ley de Parkinson</h2>
        <p>El trabajo se expande para llenar el tiempo disponible para su finalización. Limita el tiempo para forzar la eficiencia.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "Lo que haces es infinitamente más importante que cómo lo haces."
        </blockquote>
        
        <h2>🚫 El Arte de Decir No</h2>
        <p>Aprender a decir no es fundamental para proteger tu tiempo y energía para las cosas que realmente importan.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #dc2626;">❌ Cosas que Debes Eliminar</h3>
          <ul>
            <li><strong>Reuniones innecesarias:</strong> La mayoría son pérdida de tiempo</li>
            <li><strong>Emails no urgentes:</strong> Revisa email solo 2 veces al día</li>
            <li><strong>Interrupciones:</strong> Crea bloques de tiempo sin distracciones</li>
            <li><strong>Perfeccionismo:</strong> Busca "suficientemente bueno" en lugar de perfecto</li>
          </ul>
        </div>
        
        <h2>📱 Dieta de Información</h2>
        <p>Consume información de manera selectiva. Evita las noticias, limita las redes sociales, y enfócate solo en información que puedas actuar.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">✅ Principios de la Dieta de Información</h3>
          <ul>
            <li><strong>Relevancia inmediata:</strong> ¿Puedo usar esta información ahora?</li>
            <li><strong>Accionabilidad:</strong> ¿Puedo hacer algo específico con esto?</li>
            <li><strong>Importancia:</strong> ¿Esto afecta algo importante en mi vida?</li>
          </ul>
        </div>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-3",
      book_id: "3",
      chapter_number: 3,
      title: "Automatización: Creando Ingresos en Piloto Automático",
      content: `
        <h1>Capítulo 3: Automatización - Creando Ingresos en Piloto Automático</h1>
        <p>El objetivo es crear un negocio que funcione sin ti. Esto requiere sistemas, procesos y la eliminación de tu presencia como cuello de botella.</p>
        
        <h2>🏭 Los Principios de la Automatización</h2>
        <p>Para crear un negocio automatizado, necesitas seguir ciertos principios fundamentales.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🎯 Elementos de un Negocio Automatizado</h3>
          <ul>
            <li><strong>Producto escalable:</strong> Algo que puedas vender sin límite de tiempo</li>
            <li><strong>Marketing automatizado:</strong> Sistemas que generen clientes sin tu intervención</li>
            <li><strong>Ventas automatizadas:</strong> Procesos que conviertan prospectos en clientes</li>
            <li><strong>Cumplimiento automatizado:</strong> Entrega del producto sin tu participación</li>
          </ul>
        </div>
        
        <h2>💰 Tipos de Productos Ideales</h2>
        <p>No todos los productos son iguales para la automatización. Algunos son mejores que otros.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">✅ Productos Ideales para Automatización</h3>
          <ul>
            <li><strong>Productos digitales:</strong> Cursos online, software, ebooks</li>
            <li><strong>Productos de información:</strong> Newsletters, membresías, consultoría</li>
            <li><strong>Productos físicos simples:</strong> Con fulfillment externalizado</li>
            <li><strong>Servicios sistematizados:</strong> Que otros puedan ejecutar</li>
          </ul>
        </div>
        
        <h2>🤖 Herramientas de Automatización</h2>
        <p>La tecnología es tu aliada para crear sistemas que funcionen sin ti.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #d97706;">🛠️ Herramientas Esenciales</h3>
          <ul>
            <li><strong>Email marketing:</strong> Secuencias automatizadas de emails</li>
            <li><strong>Procesamiento de pagos:</strong> Sistemas que manejen transacciones</li>
            <li><strong>Atención al cliente:</strong> FAQs, chatbots, y sistemas de tickets</li>
            <li><strong>Análisis:</strong> Dashboards que muestren métricas clave</li>
          </ul>
        </div>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "El objetivo no es crear un trabajo para ti mismo, sino crear un sistema que genere dinero sin tu presencia constante."
        </blockquote>
        
        <h2>📊 Métricas que Importan</h2>
        <p>Enfócate en las métricas que realmente indican el éxito de tu automatización:</p>
        
        <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #be185d;">📈 KPIs Clave</h3>
          <ul>
            <li><strong>Ingresos por hora trabajada:</strong> Tu verdadera productividad</li>
            <li><strong>Porcentaje de ingresos pasivos:</strong> Cuánto llega sin tu intervención</li>
            <li><strong>Tiempo libre por semana:</strong> Tu libertad real</li>
            <li><strong>Costo de adquisición de clientes:</strong> Eficiencia de marketing</li>
          </ul>
        </div>
      `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-4",
      book_id: "3",
      chapter_number: 4,
      title: "Liberación: Escapando del Escritorio",
      content: `
        <h1>Capítulo 4: Liberación - Escapando del Escritorio</h1>
        <p>La libertad geográfica es el objetivo final. Una vez que hayas automatizado tus ingresos, puedes trabajar desde cualquier lugar del mundo.</p>
        
        <h2>🌍 El Nomadismo Digital</h2>
        <p>Trabajar remotamente no es solo una tendencia, es una revolución en la forma en que pensamos sobre el trabajo y la vida.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🎯 Beneficios del Trabajo Remoto</h3>
          <ul>
            <li><strong>Arbitraje geográfico:</strong> Gana en moneda fuerte, gasta en moneda débil</li>
            <li><strong>Calidad de vida:</strong> Elige tu entorno ideal</li>
            <li><strong>Experiencias:</strong> Viaja mientras trabajas</li>
            <li><strong>Flexibilidad:</strong> Adapta tu horario a tu ritmo natural</li>
          </ul>
        </div>
        
        <h2>💻 Herramientas para el Trabajo Remoto</h2>
        <p>La tecnología hace posible trabajar desde cualquier lugar con conexión a internet.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">🛠️ Kit de Herramientas Remotas</h3>
          <ul>
            <li><strong>Comunicación:</strong> Slack, Zoom, WhatsApp Business</li>
            <li><strong>Gestión de proyectos:</strong> Trello, Asana, Monday</li>
            <li><strong>Almacenamiento:</strong> Google Drive, Dropbox, OneDrive</li>
            <li><strong>Finanzas:</strong> PayPal, Wise, bancos digitales</li>
          </ul>
        </div>
        
        <h2>🏖️ Mini-Jubilaciones</h2>
        <p>En lugar de esperar hasta los 65 años para jubilarte, toma mini-jubilaciones a lo largo de tu vida.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "La vida no tiene que ser tan difícil. Todo lo que necesitas es un plan realista y el coraje para seguirlo."
        </blockquote>
        
        <h2>🎯 Planificando tu Escape</h2>
        <p>La transición al trabajo remoto debe ser gradual y bien planificada.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #d97706;">📋 Plan de Escape en 5 Pasos</h3>
          <ol>
            <li><strong>Aumenta tu valor:</strong> Conviértete en indispensable</li>
            <li><strong>Demuestra resultados remotos:</strong> Trabaja desde casa ocasionalmente</li>
            <li><strong>Propón un piloto:</strong> Sugiere un período de prueba remoto</li>
            <li><strong>Incrementa gradualmente:</strong> Aumenta el tiempo remoto poco a poco</li>
            <li><strong>Negocia permanencia:</strong> Haz el arreglo permanente</li>
          </ol>
        </div>
        
        <h2>🌟 Viviendo el Sueño</h2>
        <p>Una vez que logres la libertad geográfica, el mundo se convierte en tu oficina y tu hogar.</p>
      `,
      page_number: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-5",
      book_id: "3",
      chapter_number: 5,
      title: "Llenando el Vacío: Encontrando Propósito",
      content: `
        <h1>Capítulo 5: Llenando el Vacío - Encontrando Propósito</h1>
        <p>La libertad sin propósito es vacía. Una vez que tengas tiempo y dinero, necesitas encontrar algo significativo que hacer con tu vida.</p>
        
        <h2>🎯 Más Allá del Dinero</h2>
        <p>El dinero es solo una herramienta. El verdadero objetivo es tener la libertad de perseguir lo que realmente te importa.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #0369a1;">🌟 Elementos de una Vida Significativa</h3>
          <ul>
            <li><strong>Contribución:</strong> Hacer una diferencia en el mundo</li>
            <li><strong>Crecimiento:</strong> Aprender y desarrollarte continuamente</li>
            <li><strong>Relaciones:</strong> Conectar profundamente con otros</li>
            <li><strong>Experiencias:</strong> Crear memorias que valgan la pena</li>
          </ul>
        </div>
        
        <h2>🚀 Proyectos de Pasión</h2>
        <p>Con tiempo y recursos liberados, puedes perseguir proyectos que realmente te apasionen, sin la presión de que generen dinero inmediatamente.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #15803d;">💡 Ideas para Proyectos de Pasión</h3>
          <ul>
            <li><strong>Causas sociales:</strong> Apoyar organizaciones benéficas</li>
            <li><strong>Arte y creatividad:</strong> Escribir, pintar, hacer música</li>
            <li><strong>Educación:</strong> Enseñar o mentorear a otros</li>
            <li><strong>Aventura:</strong> Explorar el mundo y nuevas experiencias</li>
          </ul>
        </div>
        
        <h2>🌱 Crecimiento Continuo</h2>
        <p>La libertad te da la oportunidad de enfocarte en el crecimiento personal sin las limitaciones de un trabajo tradicional.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding: 20px; margin: 24px 0; background-color: #faf5ff; border-radius: 8px;">
          "El objetivo no es retirarse de la vida, sino tener la libertad de elegir cómo quieres vivir."
        </blockquote>
        
        <h2>🤝 Construyendo Comunidad</h2>
        <p>Los Nuevos Ricos no son ermitaños. Construyen comunidades de personas con ideas afines que comparten valores similares.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #d97706;">🌐 Formas de Construir Comunidad</h3>
          <ul>
            <li><strong>Grupos de mastermind:</strong> Reuniones regulares con emprendedores</li>
            <li><strong>Comunidades online:</strong> Foros y grupos de redes sociales</li>
            <li><strong>Eventos y conferencias:</strong> Networking en persona</li>
            <li><strong>Mentoría:</strong> Enseñar a otros lo que has aprendido</li>
          </ul>
        </div>
        
        <h2>🎭 El Equilibrio Final</h2>
        <p>La verdadera riqueza es tener opciones. Cuando tienes tiempo, dinero y propósito, puedes crear la vida que realmente quieres vivir.</p>
      `,
      page_number: 5,
      created_at: new Date().toISOString(),
    },
  ],
}

// Mock functions to simulate database operations
export async function getBooks(): Promise<Book[]> {
  return mockBooks
}

export async function getCategories(): Promise<string[]> {
  const categories = [...new Set(mockBooks.map((book) => book.category))]
  return categories
}

export async function searchBooks(query: string): Promise<Book[]> {
  const lowercaseQuery = query.toLowerCase()
  return mockBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.description.toLowerCase().includes(lowercaseQuery),
  )
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  return mockBooks.filter((book) => book.category === category)
}

export async function getBook(id: string): Promise<Book | null> {
  return mockBooks.find((book) => book.id === id) || null
}

export async function getBookContent(bookId: string): Promise<BookContent[]> {
  return mockBookContent[bookId] || []
}

export async function getReadingProgress(userId: string, bookId: string): Promise<ReadingProgress | null> {
  // Mock reading progress - in a real app, this would come from a database
  return {
    id: `progress-${userId}-${bookId}`,
    user_id: userId,
    book_id: bookId,
    progress_percentage: Math.floor(Math.random() * 100),
    current_page: Math.floor(Math.random() * 10) + 1,
    last_read_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
}

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  currentPage: number,
  progressPercentage: number,
): Promise<ReadingProgress> {
  // Mock update - in a real app, this would update the database
  return {
    id: `progress-${userId}-${bookId}`,
    user_id: userId,
    book_id: bookId,
    progress_percentage: progressPercentage,
    current_page: currentPage,
    last_read_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }
}

export async function completeBook(userId: string, bookId: string): Promise<void> {
  // Mock completion - in a real app, this would update the database
  console.log(`Book ${bookId} completed by user ${userId}`)
}

export async function getReadingStats(userId: string): Promise<ReadingStats> {
  // Mock stats - in a real app, this would come from a database
  return {
    books_read: Math.floor(Math.random() * 20) + 1,
    total_reading_time: Math.floor(Math.random() * 1000) + 100,
    average_progress: Math.floor(Math.random() * 100),
    reading_streak: Math.floor(Math.random() * 30) + 1,
  }
}

export async function getUserStats(userId: string): Promise<UserStats> {
  // Mock user stats - in a real app, this would come from a database
  return {
    user_id: userId,
    points: Math.floor(Math.random() * 5000) + 1000,
    reading_streak: Math.floor(Math.random() * 30) + 1,
    longest_streak: Math.floor(Math.random() * 100) + 30,
    books_read: Math.floor(Math.random() * 20) + 1,
    total_reading_time: Math.floor(Math.random() * 1000) + 100,
    achievements: [],
  }
}
