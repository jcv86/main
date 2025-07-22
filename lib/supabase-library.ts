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

// Mock data
const mockBooks: Book[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Atomic Habits",
    author: "James Clear",
    description:
      "Un método fácil y comprobado para crear buenos hábitos y eliminar los malos. Este libro te enseñará cómo pequeños cambios pueden generar resultados extraordinarios.",
    category: "Productividad",
    rating: 4.8,
    reading_time: "4h 30min",
    difficulty: "Intermedio",
    publication_year: 2018,
    total_pages: 320,
    created_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Deep Work",
    author: "Cal Newport",
    description:
      "Reglas para el éxito enfocado en un mundo distraído. Aprende a desarrollar la habilidad más valiosa del siglo XXI: la capacidad de concentrarse sin distracciones.",
    category: "Productividad",
    rating: 4.7,
    reading_time: "4h 45min",
    difficulty: "Intermedio",
    publication_year: 2016,
    total_pages: 296,
    created_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Lean In",
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
    id: "550e8400-e29b-41d4-a716-446655440004",
    title: "Emotional Intelligence 2.0",
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
    id: "550e8400-e29b-41d4-a716-446655440005",
    title: "The Lean Startup",
    author: "Eric Ries",
    description:
      "Cómo los emprendedores de hoy utilizan la innovación continua para crear negocios radicalmente exitosos. Metodología esencial para startups.",
    category: "Negocios",
    rating: 4.6,
    reading_time: "5h 10min",
    difficulty: "Intermedio",
    publication_year: 2011,
    total_pages: 336,
    created_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    title: "Mindset",
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
    id: "550e8400-e29b-41d4-a716-446655440007",
    title: "Good to Great",
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
    id: "550e8400-e29b-41d4-a716-446655440008",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    description:
      "Lecciones poderosas de cambio personal. Los principios fundamentales para el éxito personal y profesional que han transformado millones de vidas.",
    category: "Desarrollo Personal",
    rating: 4.8,
    reading_time: "5h 45min",
    difficulty: "Intermedio",
    publication_year: 1989,
    total_pages: 432,
    created_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    title: "The Power of Now",
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
    id: "550e8400-e29b-41d4-a716-446655440010",
    title: "The 4-Hour Workweek",
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
    id: "550e8400-e29b-41d4-a716-446655440011",
    title: "Crucial Conversations",
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
    id: "550e8400-e29b-41d4-a716-446655440012",
    title: "Zero to One",
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

// Mock book content
const mockBookContent: { [key: string]: BookContent[] } = {
  "550e8400-e29b-41d4-a716-446655440001": [
    {
      id: "content-1-1",
      book_id: "550e8400-e29b-41d4-a716-446655440001",
      chapter_number: 1,
      title: "Los Fundamentos: Por qué los pequeños cambios marcan una gran diferencia",
      content: `
        <h2>Capítulo 1: Los Fundamentos</h2>
        <p>Los hábitos son el interés compuesto de la superación personal. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican a medida que los repites.</p>
        
        <p>Parecen marcar poca diferencia en un día cualquiera y, sin embargo, el impacto que generan a lo largo de los meses y años puede ser enorme. Solo cuando miramos hacia atrás —dos, cinco o quizás diez años después— el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente evidente.</p>
        
        <h3>El poder de los pequeños cambios</h3>
        <p>Si puedes mejorar tan solo un 1% cada día durante un año, terminarás siendo treinta y siete veces mejor al final del período. Por el contrario, si empeoras un 1% cada día durante un año, descenderás casi hasta cero.</p>
        
        <p>Los pequeños cambios a menudo parecen no marcar diferencia hasta que cruzas un umbral crítico. Los resultados más poderosos de cualquier proceso de cambio compuesto se retrasan. Necesitas ser paciente.</p>
        
        <h3>¿Qué es realmente el progreso?</h3>
        <p>Imagina que tienes un cubo de hielo sentado sobre la mesa frente a ti. La habitación está fría y puedes ver tu aliento. Es de 25 grados Fahrenheit. Nada sucede. 26 grados. 27. 28. El hielo sigue sólido. 29. 30. 31. Aún nada ha sucedido.</p>
        
        <p>Entonces, a los 32 grados, el hielo comienza a derretirse. Un cambio de un grado, aparentemente no diferente de los cambios de temperatura que lo precedieron, desató una transformación enorme.</p>
        
        <p>Los momentos decisivos son frecuentemente el resultado de muchas acciones previas, que construyen el potencial requerido para desatar un cambio mayor.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-2",
      book_id: "550e8400-e29b-41d4-a716-446655440001",
      chapter_number: 2,
      title: "Cómo tus hábitos moldean tu identidad (y viceversa)",
      content: `
        <h2>Capítulo 2: Cómo tus hábitos moldean tu identidad</h2>
        <p>Hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar que son como las capas de una cebolla.</p>
        
        <h3>Los tres niveles del cambio</h3>
        <ul>
          <li><strong>El primer nivel es cambiar tus resultados.</strong> Este nivel se refiere a cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato.</li>
          <li><strong>El segundo nivel es cambiar tu proceso.</strong> Este nivel se refiere a cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, organizar tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación.</li>
          <li><strong>El tercer y más profundo nivel es cambiar tu identidad.</strong> Este nivel se refiere a cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y sobre otros.</li>
        </ul>
        
        <p>La mayoría de las personas comienzan con los resultados que quieren lograr. Esto puede funcionar por un tiempo, pero la razón por la que la mayoría de las personas no logra mantener la motivación para cambiar durante mucho tiempo es que nunca cambian las creencias que subyacen a su comportamiento.</p>
        
        <h3>El verdadero cambio de comportamiento es cambio de identidad</h3>
        <p>Tienes una nueva meta y un nuevo plan, pero no has cambiado quién eres. Cuando tu comportamiento y tu identidad están completamente alineados, ya no estás persiguiendo el cambio de comportamiento. Simplemente estás actuando como el tipo de persona que ya eres.</p>
        
        <p>La meta no es leer un libro, la meta es convertirse en lector. La meta no es correr un maratón, la meta es convertirse en corredor. La meta no es aprender un instrumento, la meta es convertirse en músico.</p>
        
        <h3>El proceso de dos pasos para cambiar tu identidad</h3>
        <ol>
          <li><strong>Decide el tipo de persona que quieres ser.</strong></li>
          <li><strong>Demuéstratelo a ti mismo con pequeñas victorias.</strong></li>
        </ol>
        
        <p>Cada acción que realizas es un voto por el tipo de persona que deseas convertirte. Ninguna instancia individual transformará tus creencias, pero a medida que los votos se acumulan, también lo hace la evidencia de tu nueva identidad.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-3",
      book_id: "550e8400-e29b-41d4-a716-446655440001",
      chapter_number: 3,
      title: "Cómo construir mejores hábitos en 4 simples pasos",
      content: `
        <h2>Capítulo 3: Cómo construir mejores hábitos en 4 simples pasos</h2>
        <p>En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que cambiaría la forma en que pensamos sobre la formación de hábitos.</p>
        
        <h3>El bucle del hábito</h3>
        <p>Un hábito es un comportamiento que se ha repetido lo suficiente como para volverse automático. El proceso de construcción de un hábito se puede dividir en cuatro pasos simples: señal, anhelo, respuesta y recompensa.</p>
        
        <ol>
          <li><strong>Señal:</strong> La señal desencadena tu cerebro para iniciar un comportamiento. Es un poco de información que predice una recompensa.</li>
          <li><strong>Anhelo:</strong> Los anhelos son la fuerza motivacional detrás de cada hábito. Sin algún nivel de motivación o deseo, no tenemos razón para actuar.</li>
          <li><strong>Respuesta:</strong> La respuesta es el hábito real que realizas, que puede tomar la forma de un pensamiento o una acción.</li>
          <li><strong>Recompensa:</strong> Las recompensas son el objetivo final de cada hábito. La señal se trata de notar la recompensa. El anhelo se trata de querer la recompensa. La respuesta se trata de obtener la recompensa.</li>
        </ol>
        
        <h3>Las cuatro leyes del cambio de comportamiento</h3>
        <p>Podemos transformar estas cuatro etapas en un conjunto práctico de reglas que podemos usar para diseñar buenos hábitos y eliminar los malos.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>Cómo crear un buen hábito:</h4>
          <ul>
            <li><strong>1ª Ley (Señal):</strong> Hazlo obvio</li>
            <li><strong>2ª Ley (Anhelo):</strong> Hazlo atractivo</li>
            <li><strong>3ª Ley (Respuesta):</strong> Hazlo fácil</li>
            <li><strong>4ª Ley (Recompensa):</strong> Hazlo satisfactorio</li>
          </ul>
        </div>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>Cómo romper un mal hábito:</h4>
          <ul>
            <li><strong>Inversión de la 1ª Ley (Señal):</strong> Hazlo invisible</li>
            <li><strong>Inversión de la 2ª Ley (Anhelo):</strong> Hazlo poco atractivo</li>
            <li><strong>Inversión de la 3ª Ley (Respuesta):</strong> Hazlo difícil</li>
            <li><strong>Inversión de la 4ª Ley (Recompensa):</strong> Hazlo insatisfactorio</li>
          </ul>
        </div>
        
        <p>Siempre que quieras cambiar tu comportamiento, puedes simplemente preguntarte: ¿Cómo puedo hacerlo obvio? ¿Cómo puedo hacerlo atractivo? ¿Cómo puedo hacerlo fácil? ¿Cómo puedo hacerlo satisfactorio?</p>
      `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
  ],
  "550e8400-e29b-41d4-a716-446655440003": [
    {
      id: "content-3-1",
      book_id: "550e8400-e29b-41d4-a716-446655440003",
      chapter_number: 1,
      title: "La revolución del liderazgo",
      content: `
        <h2>Capítulo 1: La revolución del liderazgo</h2>
        <p>Hace más de dos años, me senté con mi equipo de Facebook para discutir las mujeres en el liderazgo. Los datos eran desalentadores. En los Estados Unidos, las mujeres han obtenido el 57 por ciento de los títulos universitarios y el 60 por ciento de los títulos de maestría durante la última década.</p>
        
        <p>Sin embargo, las mujeres representan solo el 14 por ciento de los puestos ejecutivos, el 17 por ciento de los miembros de la junta directiva y el 18 por ciento de los miembros del Congreso. Esta disparidad entre el logro y el liderazgo persiste en todos los sectores.</p>
        
        <h3>El problema interno</h3>
        <p>Pero también hay un problema interno que es igualmente importante pero más difícil de abordar. Las mujeres se están frenando a sí mismas, sin darse cuenta, al carecer de confianza en sí mismas, al no levantar la mano y al retroceder cuando deberían inclinarse hacia adelante.</p>
        
        <p>Las mujeres sistemáticamente subestiman sus propias habilidades. Múltiples estudios en múltiples industrias muestran que las mujeres a menudo juzgan su propio desempeño como peor de lo que realmente es, mientras que los hombres juzgan su propio desempeño como mejor.</p>
        
        <h3>Inclinarse hacia adelante</h3>
        <p>"Inclinarse hacia adelante" significa ser ambiciosa en cualquier búsqueda. Significa perseguir activamente el liderazgo y tomar riesgos. Significa soñar en grande y apuntar alto. También significa prepararse para el éxito.</p>
        
        <p>Las mujeres necesitan cambiar de "¿Qué haría si no tuviera miedo?" a "¿Qué haría si supiera que no puedo fallar?" Esta mentalidad puede transformar no solo cómo vemos nuestras capacidades, sino cómo actuamos sobre ellas.</p>
        
        <h3>El mito de hacerlo todo</h3>
        <p>Una de las razones por las que hay tan pocas mujeres en los niveles superiores de las organizaciones es que muchas mujeres deciden salirse de la fuerza laboral o reducir sus horas para cuidar a los niños.</p>
        
        <p>Pero la decisión de trabajar menos o no trabajar en absoluto se basa en gran medida en la suposición de que el cuidado de los niños es responsabilidad de la mujer. Hasta que más hombres estén completamente comprometidos como socios en el hogar, las mujeres seguirán llevando la carga principal del cuidado de los niños.</p>
        
        <p>La conversación sobre la igualdad en el lugar de trabajo no puede separarse de la conversación sobre la igualdad en el hogar.</p>
      `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-2",
      book_id: "550e8400-e29b-41d4-a716-446655440003",
      chapter_number: 2,
      title: "Siéntate a la mesa",
      content: `
        <h2>Capítulo 2: Siéntate a la mesa</h2>
        <p>Hace varios años, fui invitada a una reunión en el Tesoro. Llegué temprano y me senté en una de las sillas que rodeaban la mesa principal. Otras mujeres que llegaron después que yo se sentaron en las sillas contra la pared.</p>
        
        <p>Cuando comenzó la reunión, el secretario del Tesoro se dirigió a los que estaban sentados en la mesa. Las mujeres contra la pared nunca hablaron. Después, les pregunté por qué no se habían sentado en la mesa. No tenían una buena respuesta.</p>
        
        <h3>La confianza interna</h3>
        <p>Para las mujeres, sentirse segura de sí misma —y ser percibida como segura de sí misma— puede ser un acto de equilibrio delicado. Una mujer que es segura de sí misma puede ser etiquetada como arrogante o agresiva, mientras que un hombre con las mismas cualidades es visto como un líder fuerte.</p>
        
        <p>Esta percepción diferencial significa que las mujeres necesitan encontrar formas de proyectar liderazgo mientras mantienen la simpatía. Es un desafío que los hombres rara vez enfrentan.</p>
        
        <h3>El síndrome del impostor</h3>
        <p>Muchas mujeres, incluso aquellas en posiciones de liderazgo, experimentan el síndrome del impostor: la sensación de que no merecen su éxito y que eventualmente serán "descubiertas" como fraudes.</p>
        
        <p>Los estudios muestran que las mujeres atribuyen su éxito a factores externos como la suerte, mientras que los hombres atribuyen su éxito a sus habilidades internas. Esta diferencia en la atribución puede afectar la confianza y la disposición a asumir nuevos desafíos.</p>
        
        <h3>Tomar riesgos y buscar desafíos</h3>
        <p>Las mujeres necesitan cambiar de "No estoy segura de poder hacer esto" a "Estoy bastante segura de que puedo aprender a hacer esto". El crecimiento y el aprendizaje requieren tomar riesgos y salir de nuestra zona de confort.</p>
        
        <p>Cuando las mujeres no se postulan para trabajos o promociones, no solo se limitan a sí mismas, sino que también privan a las organizaciones de diversos talentos y perspectivas.</p>
        
        <h3>Hablar con autoridad</h3>
        <p>Las mujeres a menudo hablan de manera tentativa, usando frases como "Creo que..." o "Podría estar equivocada, pero..." Estas calificaciones pueden socavar la autoridad y hacer que las ideas parezcan menos convincentes.</p>
        
        <p>Aprender a hablar con confianza y autoridad es una habilidad crucial para el liderazgo. Esto no significa ser arrogante, sino presentar ideas de manera clara y directa.</p>
      `,
      page_number: 2,
      created_at: new Date().toISOString(),
    },
  ],
}

// Mock reading stats
const mockReadingStats: ReadingStats = {
  books_read: 3,
  total_reading_time: 12,
  average_progress: 65,
  reading_streak: 7,
}

// Mock bookmarks
const mockBookmarks: Bookmark[] = [
  {
    id: "bookmark-1",
    user_id: "demo-user-id",
    book_id: "550e8400-e29b-41d4-a716-446655440001",
    page_number: 2,
    note: "Importante: Los hábitos son el interés compuesto de la superación personal",
    created_at: new Date().toISOString(),
  },
]

// API Functions
export const getAllBooks = async (): Promise<Book[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBooks
}

export const getRecommendedBooks = async (userId: string): Promise<Book[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  // Return first 7 books as recommended
  return mockBooks.slice(0, 7)
}

export const getBookById = async (bookId: string): Promise<Book | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockBooks.find((book) => book.id === bookId) || null
}

export const getBookContent = async (bookId: string): Promise<BookContent[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockBookContent[bookId] || []
}

export const getUserReadingStats = async (userId: string): Promise<ReadingStats> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockReadingStats
}

export const getUserBookmarks = async (userId: string, bookId: string): Promise<Bookmark[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockBookmarks.filter((bookmark) => bookmark.user_id === userId && bookmark.book_id === bookId)
}

export const updateReadingProgress = async (
  userId: string,
  bookId: string,
  progressPercentage: number,
  currentPage: number,
): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  console.log(
    `Updated reading progress for user ${userId}, book ${bookId}: ${progressPercentage}% (page ${currentPage})`,
  )
}

export const addBookmark = async (
  userId: string,
  bookId: string,
  pageNumber: number,
  note?: string,
): Promise<Bookmark> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newBookmark: Bookmark = {
    id: `bookmark-${Date.now()}`,
    user_id: userId,
    book_id: bookId,
    page_number: pageNumber,
    note,
    created_at: new Date().toISOString(),
  }

  mockBookmarks.push(newBookmark)
  return newBookmark
}

export const removeBookmark = async (bookmarkId: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  const index = mockBookmarks.findIndex((bookmark) => bookmark.id === bookmarkId)
  if (index > -1) {
    mockBookmarks.splice(index, 1)
  }
}
