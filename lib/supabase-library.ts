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

// Mock data - All titles in Spanish
const mockBooks: Book[] = [
  {
    id: "1",
    title: "Hábitos Atómicos",
    author: "James Clear",
    description:
      "Una guía práctica para formar buenos hábitos y romper los malos. Aprende cómo pequeños cambios pueden generar resultados extraordinarios a través de técnicas probadas de formación de hábitos. ¡LIBRO COMPLETO GRATIS!",
    category: "Productividad",
    rating: 4.8,
    reading_time: "4h 30min",
    difficulty: "Intermedio",
    publication_year: 2018,
    total_pages: 320,
    created_at: new Date().toISOString(),
    is_free: true,
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
    is_free: true,
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
    is_free: true,
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
    is_free: true,
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
    is_free: true,
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
      "La nueva psicología del éxito. Descubre cómo una mentalidad de crecimiento puede transformar tu vida personal y profesional. ¡LIBRO COMPLETO GRATIS!",
    category: "Desarrollo Personal",
    rating: 4.5,
    reading_time: "4h 15min",
    difficulty: "Fácil",
    publication_year: 2006,
    total_pages: 276,
    created_at: new Date().toISOString(),
    is_free: true,
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
    is_free: true,
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
    is_free: true,
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
    is_free: true,
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
    is_free: true,
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
    is_free: true,
  },
]

// Mock book content with complete books
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
        
        <h3>🎯 El Valle de la Desilusión</h3>
        <p>Imagina que estás volando de Los Ángeles a Nueva York. Si el piloto ajustara el rumbo solo 3.5 grados al sur, comenzarías en Los Ángeles y terminarías en Washington, D.C., en lugar de Nueva York. Tal cambio apenas sería perceptible al despegue —el morro del avión se movería solo unos pocos metros— pero cuando se amplifica a lo largo de todo Estados Unidos, terminas a cientos de kilómetros de tu destino.</p>
        
        <p>De manera similar, un ligero cambio en tus hábitos diarios puede guiar tu vida hacia un destino completamente diferente. Hacer una elección que es 1% mejor o 1% peor parece insignificante en el momento, pero a lo largo de los años estas elecciones determinan la diferencia entre quien eres y quien podrías ser.</p>
        
        <h3>🏔️ La Meseta del Potencial Latente</h3>
        <p>Los hábitos a menudo parecen no marcar diferencia hasta que cruzas un umbral crítico y desbloqueas un nuevo nivel de rendimiento. En los primeros y segundos años, la diferencia entre hacer un progreso del 1% y hacer un progreso del 1% puede parecer pequeña, pero puede ser mucho más significativa a medida que el tiempo avanza.</p>
        
        <p>Esto es una de las razones principales por las que es tan difícil construir hábitos que perduren. Las personas hacen algunos pequeños cambios, no ven resultados tangibles, y deciden parar. Piensas: "He estado corriendo todos los días durante un mes, ¿por qué no puedo ver ningún cambio en mi cuerpo?"</p>
        
        <p>El trabajo no fue desperdiciado; simplemente está siendo almacenado. No se cancela, se acumula.</p>
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
        
        <h3>🔄 El Proceso de Dos Pasos para Cambiar tu Identidad</h3>
        <p>Tu identidad emerge de tus hábitos. No naces con creencias preestablecidas. Cada creencia, incluyendo aquellas sobre ti mismo, se aprende y se condiciona a través de la experiencia.</p>
        
        <p>Más precisamente, tus hábitos son cómo encarnas tu identidad. Cuando haces tu cama cada mañana, encarnas la identidad de una persona organizada. Cuando escribes cada día, encarnas la identidad de una persona creativa. Cuando entrenas cada día, encarnas la identidad de una persona atlética.</p>
        
        <p>Cuanto más repites un comportamiento, más refuerzas la identidad asociada con ese comportamiento. De hecho, la palabra identidad originalmente se derivaba de las palabras latinas essentitas, que significa ser, e identidem, que significa repetidamente. Tu identidad es literalmente tus "repetidos seres".</p>
        
        <h3>🎭 El Verdadero Cambio es el Cambio de Identidad</h3>
        <p>El objetivo no es leer un libro, el objetivo es convertirse en un lector. El objetivo no es correr un maratón, el objetivo es convertirse en un corredor. El objetivo no es aprender un instrumento, el objetivo es convertirse en un músico.</p>
        
        <p>Tus comportamientos usualmente reflejan tu identidad. Lo que haces es una indicación del tipo de persona que crees que eres —ya sea consciente o inconscientemente.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">💡 Ejemplos de Cambio de Identidad</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>En lugar de:</strong> "Quiero perder peso" → <strong>Di:</strong> "Quiero ser una persona saludable"</li>
            <li><strong>En lugar de:</strong> "Quiero leer más" → <strong>Di:</strong> "Quiero ser un lector"</li>
            <li><strong>En lugar de:</strong> "Quiero ahorrar dinero" → <strong>Di:</strong> "Quiero ser una persona financieramente responsable"</li>
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
      title: "Cómo construir mejores hábitos en 4 sencillos pasos",
      content: `
        <h2>Capítulo 3: Cómo construir mejores hábitos en 4 sencillos pasos</h2>
        <p>El proceso de construir un hábito se puede dividir en cuatro sencillos pasos: <strong>señal, anhelo, respuesta y recompensa</strong>. Dividir un hábito en estas partes fundamentales puede ser la clave para resolver los malos hábitos y construir los buenos.</p>
        
        <h3>🚦 Los cuatro pasos</h3>
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <ol style="margin-bottom: 0;">
            <li><strong>Señal:</strong> Es el disparador que inicia el comportamiento.</li>
            <li><strong>Anhelo:</strong> Es la motivación detrás de cada hábito.</li>
            <li><strong>Respuesta:</strong> Es el hábito real que realizas.</li>
            <li><strong>Recompensa:</strong> Es el objetivo final de cada hábito.</li>
          </ol>
        </div>
        
        <p>Este ciclo de cuatro pasos no es algo que solo se pueda aplicar a los malos hábitos. Es un ciclo que se puede aplicar a cualquier hábito, bueno o malo.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "El objetivo de cualquier hábito es resolver los problemas de la vida con la menor cantidad de energía y esfuerzo posible."
        </blockquote>
        
        <h3>🧠 La Ciencia de Cómo Funcionan los Hábitos</h3>
        <p>Este proceso de cuatro pasos no es algo que yo inventé. Es la columna vertebral de cada hábito, y tu cerebro ejecuta estos pasos en el mismo orden cada vez.</p>
        
        <p>Primero, está la señal. La señal desencadena tu cerebro para iniciar un comportamiento. Es un poco de información que predice una recompensa. Nuestros ancestros prehistóricos prestaban atención a señales que indicaban la ubicación de recompensas primarias como comida, agua y sexo.</p>
        
        <p>Segundo, está el anhelo. Los antojos son la fuerza motivacional detrás de cada hábito. Sin algún nivel de motivación o deseo —sin anhelar un cambio— no tenemos razón para actuar. Lo que anhelas no es el hábito en sí, sino el cambio de estado que entrega.</p>
        
        <p>Tercero, está la respuesta. La respuesta es el hábito real que realizas, que puede tomar la forma de un pensamiento o una acción. Si una respuesta particular requiere más esfuerzo físico o mental del que estás dispuesto a gastar, no lo harás.</p>
        
        <p>Finalmente, la respuesta entrega una recompensa. Las recompensas son el objetivo final de cada hábito. La señal es sobre notar la recompensa. El anhelo es sobre querer la recompensa. La respuesta es sobre obtener la recompensa.</p>
        
        <h3>🔄 Las Cuatro Leyes del Cambio de Comportamiento</h3>
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">📋 Cómo Crear un Buen Hábito</h4>
          <ol style="margin-bottom: 0;">
            <li><strong>La 1ª Ley (Señal):</strong> Hazlo obvio</li>
            <li><strong>La 2ª Ley (Anhelo):</strong> Hazlo atractivo</li>
            <li><strong>La 3ª Ley (Respuesta):</strong> Hazlo fácil</li>
            <li><strong>La 4ª Ley (Recompensa):</strong> Hazlo satisfactorio</li>
          </ol>
        </div>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">🚫 Cómo Romper un Mal Hábito</h4>
          <ol style="margin-bottom: 0;">
            <li><strong>Inversión de la 1ª Ley (Señal):</strong> Hazlo invisible</li>
            <li><strong>Inversión de la 2ª Ley (Anhelo):</strong> Hazlo poco atractivo</li>
            <li><strong>Inversión de la 3ª Ley (Respuesta):</strong> Hazlo difícil</li>
            <li><strong>Inversión de la 4ª Ley (Recompensa):</strong> Hazlo insatisfactorio</li>
          </ol>
        </div>
      `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-4",
      book_id: "1",
      chapter_number: 4,
      title: "El Hombre que No Se Veía a Sí Mismo",
      content: `
        <h2>Capítulo 4: El Hombre que No Se Veía a Sí Mismo</h2>
        <p>En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que cambiaría la forma en que pensamos sobre el comportamiento humano. Thorndike estaba interesado en estudiar el comportamiento animal, así que construyó un laberinto llamado "caja de rompecabezas".</p>
        
        <h3>🐱 El Experimento de la Caja de Rompecabezas</h3>
        <p>Colocó un gato hambriento dentro de la caja. El gato podía ver y oler la comida, pero no podía alcanzarla. Para escapar de la caja y obtener la comida, el gato necesitaba presionar una palanca, tirar de una cuerda, y realizar una serie de otras acciones en la secuencia correcta.</p>
        
        <p>Al principio, el gato se movía frenéticamente, arañando y mordiendo en un intento desesperado de escapar. Después de unos minutos de lucha, el gato presionó accidentalmente la palanca, tiró de la cuerda, y se abrió la puerta. El gato había escapado y reclamado su recompensa.</p>
        
        <p>Thorndike siguió realizando el mismo experimento una y otra vez con el mismo gato. Notó algo interesante. Con cada repetición, el gato escapaba más rápido. En lugar de moverse frenéticamente, el gato desarrolló un patrón más refinado de comportamientos. Después de veinte a treinta intentos, el gato podía escapar en tan solo seis segundos.</p>
        
        <h3>🧠 La Ley del Efecto</h3>
        <p>Durante el curso de sus experimentos, Thorndike describió la <strong>Ley del Efecto</strong>, que establece que "las respuestas que producen un efecto satisfactorio en una situación particular se vuelven más probables de ocurrir nuevamente en esa situación, y las respuestas que producen un efecto incómodo se vuelven menos probables de ocurrir nuevamente en esa situación."</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Los comportamientos seguidos de consecuencias satisfactorias tienden a repetirse y aquellos que producen consecuencias desagradables son menos probables de ocurrir nuevamente."
        </blockquote>
        
        <h3>🎯 Señales que Pasamos por Alto</h3>
        <p>Con suficiente práctica, puedes elegir las señales que predicen ciertos resultados sin pensar conscientemente en ello. Tu mente está continuamente analizando tu entorno interno y externo en busca de pistas sobre qué hacer a continuación.</p>
        
        <p>Eres consciente de las señales obvias como el timbre del teléfono o el semáforo que cambia de color. Pero la gran mayoría de las señales que influyen en tu comportamiento diario están por debajo del umbral de la percepción consciente.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">🔍 Ejemplos de Señales Inconscientes</h4>
          <ul style="margin-bottom: 0;">
            <li>El aroma del café que te hace querer una taza</li>
            <li>El sonido de las notificaciones que te hace revisar tu teléfono</li>
            <li>La vista de tu sofá que te hace querer ver televisión</li>
            <li>El estrés del trabajo que te hace querer comer comida chatarra</li>
          </ul>
        </div>
        
        <h3>📝 El Registro de Hábitos</h3>
        <p>Antes de que podamos construir efectivamente nuevos hábitos, necesitamos tener control sobre los actuales. Esto puede ser más desafiante de lo que parece porque una vez que un hábito está firmemente arraigado en tu vida, es principalmente inconsciente y automático.</p>
        
        <p>Para hacerte más consciente de tus hábitos, puedes usar una técnica llamada <strong>Señalar y Llamar</strong>. Esta técnica fue desarrollada originalmente por el sistema ferroviario japonés, donde los empleados deben señalar elementos importantes y declararlos en voz alta para reducir errores.</p>
        
        <p>El proceso es simple: antes de realizar un hábito, di en voz alta lo que estás a punto de hacer y cuál será el resultado.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">💬 Ejemplos de Señalar y Llamar</h4>
          <ul style="margin-bottom: 0;">
            <li>"Estoy a punto de comer esta galleta, pero no la necesito. Comer esto me hará ganar peso y dañar mi salud."</li>
            <li>"Estoy a punto de revisar Facebook, pero no hay nada importante allí. Esto es una pérdida de tiempo."</li>
            <li>"Estoy a punto de acostarme sin lavarme los dientes. Esto es malo para mi salud dental."</li>
          </ul>
        </div>
      `,
      page_number: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-5",
      book_id: "1",
      chapter_number: 5,
      title: "La Mejor Manera de Comenzar un Nuevo Hábito",
      content: `
        <h2>Capítulo 5: La Mejor Manera de Comenzar un Nuevo Hábito</h2>
        <p>En 2001, los investigadores en Gran Bretaña comenzaron a trabajar con 248 personas para construir mejores hábitos de ejercicio durante el transcurso de dos semanas. Los sujetos fueron divididos en tres grupos.</p>
        
        <h3>🔬 El Experimento de Motivación vs. Intención</h3>
        <p>El primer grupo fue el grupo de control. Se les pidió simplemente que siguieran la frecuencia con la que hacían ejercicio.</p>
        
        <p>El segundo grupo fue el grupo de "motivación". Estos sujetos recibieron el mismo seguimiento que el primer grupo, pero también recibieron material de motivación. Leyeron sobre los beneficios del ejercicio para reducir el riesgo de enfermedad coronaria y mejorar la salud del corazón.</p>
        
        <p>Finalmente, había un tercer grupo. Estos sujetos recibieron el mismo material de motivación que el segundo grupo, pero también se les pidió que formularan un plan específico sobre cuándo y dónde harían ejercicio durante la próxima semana.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">📊 Los Resultados Sorprendentes</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Grupo 1 (Control):</strong> 38% hizo ejercicio al menos una vez por semana</li>
            <li><strong>Grupo 2 (Motivación):</strong> 35% hizo ejercicio al menos una vez por semana</li>
            <li><strong>Grupo 3 (Intención de Implementación):</strong> 91% hizo ejercicio al menos una vez por semana</li>
          </ul>
        </div>
        
        <h3>📋 La Fórmula de Intención de Implementación</h3>
        <p>La frase que los sujetos del tercer grupo recibieron fue: "Durante la próxima semana, participaré en al menos 20 minutos de ejercicio vigoroso en [DÍA] a las [HORA] en [LUGAR]."</p>
        
        <p>Los investigadores llamaron a esto una <strong>intención de implementación</strong>, que es un plan que haces de antemano sobre cuándo y dónde actuarás. Es decir, cómo tienes la intención de implementar un hábito particular.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Haré [COMPORTAMIENTO] a las [HORA] en [LUGAR]."
        </blockquote>
        
        <h3>🎯 El Apilamiento de Hábitos</h3>
        <p>Una de las mejores maneras de construir un nuevo hábito es identificar un hábito actual que ya realizas cada día y luego apilar tu nuevo comportamiento encima. Esto se llama <strong>apilamiento de hábitos</strong>.</p>
        
        <p>La fórmula del apilamiento de hábitos es: "Después de [HÁBITO ACTUAL], haré [NUEVO HÁBITO]."</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🔗 Ejemplos de Apilamiento de Hábitos</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Meditación:</strong> "Después de verter mi taza de café cada mañana, meditaré durante un minuto."</li>
            <li><strong>Ejercicio:</strong> "Después de quitarme los zapatos de trabajo, inmediatamente me cambiaré a mi ropa de ejercicio."</li>
            <li><strong>Gratitud:</strong> "Después de sentarme a cenar, diré una cosa por la que estoy agradecido que pasó hoy."</li>
            <li><strong>Lectura:</strong> "Después de ponerme el pijama, leeré al menos una página de un libro."</li>
          </ul>
        </div>
        
        <h3>🏗️ Construyendo Cadenas de Hábitos</h3>
        <p>Tu rutina matutina es un ejemplo de una cadena de hábitos. Incluso si no te das cuenta, probablemente ya tienes muchas cadenas de hábitos en tu vida actual.</p>
        
        <p>Puedes usar la estrategia de apilamiento de hábitos para desarrollar cadenas más grandes tomando un hábito que quieres hacer y conectándolo con una cadena de hábitos que ya realizas.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">🌅 Ejemplo de Cadena de Hábitos Matutinos</h4>
          <ol style="margin-bottom: 0;">
            <li>Después de que suene mi alarma, pondré mis pies en el suelo.</li>
            <li>Después de poner mis pies en el suelo, iré al baño.</li>
            <li>Después de ir al baño, me pesaré.</li>
            <li>Después de pesarme, tomaré una ducha.</li>
            <li>Después de tomar una ducha, me lavaré los dientes.</li>
            <li>Después de lavarme los dientes, vestiré mi ropa de trabajo.</li>
            <li>Después de vestir mi ropa de trabajo, haré una taza de café.</li>
          </ol>
        </div>
      `,
      page_number: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-6",
      book_id: "1",
      chapter_number: 6,
      title: "La Motivación Está Sobrevalorada; El Ambiente Importa Más",
      content: `
        <h2>Capítulo 6: La Motivación Está Sobrevalorada; El Ambiente Importa Más</h2>
        <p>Anne Thorndike, médica del Hospital General de Massachusetts, tenía una gran idea. Creía que podía mejorar los hábitos alimenticios de miles de empleados del hospital y visitantes sin cambiar su fuerza de voluntad o motivación de ninguna manera. De hecho, planeaba hacerlo sin que se dieran cuenta.</p>
        
        <h3>🏥 El Experimento de la Cafetería</h3>
        <p>Thorndike y sus colegas diseñaron un estudio de seis meses para alterar las "arquitecturas de elección" de la cafetería del hospital. Comenzaron con las bebidas en la cafetería principal.</p>
        
        <p>Originalmente, los refrigeradores ubicados junto a las cajas registradoras en la cafetería estaban llenos de solo refrescos. Los investigadores agregaron agua embotellada como una opción en cada uno de estos refrigeradores. Además, colocaron cestas de agua embotellada junto a las estaciones de comida en toda la habitación.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">📈 Los Resultados Impresionantes</h4>
          <p>Durante los próximos tres meses, el número de ventas de refrescos cayó un 11.4 por ciento. Mientras tanto, las ventas de agua embotellada aumentaron un 25.8 por ciento.</p>
          <p><strong>Simplemente cambiando la forma en que se organizaron las bebidas, los investigadores aumentaron significativamente el comportamiento saludable.</strong></p>
        </div>
        
        <h3>🏠 Diseñando tu Ambiente para el Éxito</h3>
        <p>Cada hábito es iniciado por una señal, y somos más propensos a notar señales que se destacan. Desafortunadamente, los ambientes de hoy en día hacen que sea fácil no hacer lo que es mejor para nosotros.</p>
        
        <p>Si quieres hacer que un hábito sea una gran parte de tu vida, haz que la señal sea una gran parte de tu ambiente. Las señales más poderosas son aquellas que satisfacen múltiples sentidos. Mezcla contextos visuales, auditivos y táctiles.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🎯 Ejemplos de Diseño de Ambiente</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Para leer más:</strong> Coloca un libro en tu almohada cada mañana</li>
            <li><strong>Para hacer ejercicio:</strong> Deja tu ropa de ejercicio visible</li>
            <li><strong>Para comer fruta:</strong> Coloca fruta fresca en un lugar prominente</li>
            <li><strong>Para tocar guitarra:</strong> Coloca tu guitarra en el medio de la sala</li>
          </ul>
        </div>
        
        <h3>🚫 Haciendo los Malos Hábitos Invisibles</h3>
        <p>Esta práctica es una inversión de la 1ª Ley del Cambio de Comportamiento. En lugar de hacer obvio, puedes hacer invisible. Estoy señalando esto porque, cada vez que el ambiente cambia, el comportamiento cambia con él.</p>
        
        <p>Una de las formas más prácticas de eliminar un mal hábito es reducir la exposición a la señal que lo causa.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "El autocontrol es una estrategia a corto plazo, no a largo plazo. Puedes resistir la tentación una o dos veces, pero es poco probable que puedas dominar tu fuerza de voluntad durante semanas o meses."
        </blockquote>
        
        <h3>🏡 El Contexto es la Señal</h3>
        <p>Los hábitos pueden ser más fáciles de cambiar en un nuevo ambiente. Va en contra de nuestros instintos. Cuando no puedes manejar ir a un nuevo lugar, puedes rediseñar tu espacio actual.</p>
        
        <p>Crea un espacio separado para el trabajo, el estudio, el ejercicio, el entretenimiento y la cocina. El mantra que quiero que recuerdes es "un espacio, un uso".</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin-top: 0;">⚠️ Evita Mezclar Contextos</h4>
          <ul style="margin-bottom: 0;">
            <li>No uses tu cama para trabajar (solo para dormir)</li>
            <li>No uses tu escritorio para entretenimiento (solo para trabajo)</li>
            <li>No uses tu teléfono en el dormitorio (solo para comunicación)</li>
          </ul>
        </div>
        
        <p>Cuando puedes, evita mezclar el contexto de un hábito con otro. Cuando comienzas a mezclar contextos, comenzarás a mezclar hábitos, y los más fáciles usualmente ganarán.</p>
      `,
      page_number: 6,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-7",
      book_id: "1",
      chapter_number: 7,
      title: "El Secreto del Autocontrol",
      content: `
        <h2>Capítulo 7: El Secreto del Autocontrol</h2>
        <p>En la década de 1970, Walter Mischel realizó una serie de experimentos psicológicos que se conocieron como los estudios de Stanford Marshmallow. En estos estudios, Mischel y su equipo probaron cientos de niños, la mayoría de entre cuatro y cinco años, y revelaron lo que ahora creemos que es uno de los rasgos más importantes para el éxito en la salud, el trabajo y la vida.</p>
        
        <h3>🍭 El Experimento del Malvavisco</h3>
        <p>Los experimentos comenzaron de manera simple. Un niño fue llevado a una habitación donde había una mesa con una silla, un malvavisco, una campana y nada más. El investigador le dijo al niño que podía comer el malvavisco ahora, o si esperaba hasta que el investigador regresara, entonces el niño recibiría un segundo malvavisco y podría comer ambos.</p>
        
        <p>El investigador salió de la habitación durante diez a quince minutos. Como puedes imaginar, algunos niños comieron el malvavisco de inmediato. Otros se retorcieron, patearon, se cubrieron los ojos, jugaron con el malvavisco como si fuera un pequeño animal de peluche, lo olieron, incluso lo lamieron, pero lograron esperar hasta que el investigador regresó.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">📊 Los Resultados a Largo Plazo</h4>
          <p>Los investigadores siguieron a cada niño durante más de cuarenta años, y una y otra vez, el grupo que esperó pacientemente por el segundo malvavisco tuvo éxito en cualquier medida que los científicos cuidaron de medir:</p>
          <ul style="margin-bottom: 0;">
            <li>Obtuvieron mejores puntajes SAT</li>
            <li>Tuvieron menores niveles de abuso de sustancias</li>
            <li>Tuvieron menor probabilidad de obesidad</li>
            <li>Respondieron mejor al estrés</li>
            <li>Tuvieron mejores habilidades sociales según sus padres</li>
            <li>Tuvieron menores tasas de divorcio</li>
          </ul>
        </div>
        
        <h3>🧠 La Verdad Sobre el Autocontrol</h3>
        <p>Los resultados fueron claros: los niños que fueron mejores en retrasar la gratificación tuvieron mejores calificaciones, mejor salud, menores tasas de adicción y menos probabilidades de estar con sobrepeso treinta años después. Parecía que el autocontrol era el ingrediente principal para el éxito.</p>
        
        <p>Sin embargo, hay un detalle importante que a menudo se pasa por alto. En un seguimiento de 2012, el investigador Celeste Kidd replicó el experimento del malvavisco con un nuevo giro. Antes de ofrecer el malvavisco, los investigadores dividieron a los niños en dos grupos.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Las personas con el mejor autocontrol son típicamente aquellas que necesitan usarlo menos."
        </blockquote>
        
        <h3>🏠 Diseñar para el Éxito, No para la Fuerza de Voluntad</h3>
        <p>Es más fácil practicar la moderación que la abstinencia. Sin embargo, cuando trabajas en el ambiente correcto, la abstinencia puede ser más fácil que la moderación.</p>
        
        <p>Si estás continuamente sintiendo que no tienes suficiente fuerza de voluntad, entonces el problema no es contigo. El problema es con tu ambiente. Haz que las señales de tus buenos hábitos sean obvias y las señales de tus malos hábitos sean invisibles.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🎯 Estrategias Prácticas</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Para evitar comer comida chatarra:</strong> No la compres y mantenla fuera de la casa</li>
            <li><strong>Para reducir el tiempo en redes sociales:</strong> Desconéctate de las cuentas en tu teléfono</li>
            <li><strong>Para ver menos televisión:</strong> Desenchufa el televisor después de cada uso</li>
            <li><strong>Para reducir las compras impulsivas:</strong> Deja tu tarjeta de crédito en casa</li>
          </ul>
        </div>
        
        <h3>🔄 La Inversión de la Primera Ley</h3>
        <p>La inversión de la 1ª Ley del Cambio de Comportamiento es <strong>hacerlo invisible</strong>. Una vez que un hábito se forma, es poco probable que se olvide. Las personas con alto autocontrol tienden a pasar menos tiempo en situaciones tentadoras.</p>
        
        <p>Es más fácil evitar la tentación que resistirla. El autocontrol es una estrategia a corto plazo, no a largo plazo. En lugar de convocar una nueva dosis de fuerza de voluntad cada vez que quieras hacer lo correcto, tu energía sería mejor gastada optimizando tu ambiente.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">💡 Principio Clave</h4>
          <p style="margin-bottom: 0;"><strong>Crea un ambiente donde hacer lo correcto sea tan fácil como sea posible.</strong> Diseña tu mundo para que las acciones que importan sean las acciones que son más fáciles de hacer.</p>
        </div>
      `,
      page_number: 7,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-8",
      book_id: "1",
      chapter_number: 8,
      title: "Cómo Hacer que un Hábito Sea Irresistible",
      content: `
        <h2>Capítulo 8: Cómo Hacer que un Hábito Sea Irresistible</h2>
        <p>En 1954, los neurocientíficos James Olds y Peter Milner estaban realizando experimentos en el cerebro de ratas cuando descubrieron accidentalmente lo que algunos han llamado el botón de placer del cerebro. Al colocar electrodos en diferentes áreas del cerebro de una rata, los investigadores encontraron que cuando estimulaban el área llamada núcleo accumbens, la rata repetiría cualquier comportamiento que precediera a la estimulación.</p>
        
        <h3>🧠 El Sistema de Recompensa del Cerebro</h3>
        <p>Cuando los investigadores permitieron que las ratas presionaran una palanca para entregar una descarga al núcleo accumbens, encontraron que las ratas presionarían la palanca de nuevo y de nuevo. De hecho, presionarían la palanca hasta 2,500 veces por hora. Las ratas presionarían compulsivamente por horas, hasta que colapsaran de agotamiento. Cuando se les daba la opción entre comida y la palanca, elegirían la palanca. Cuando se les daba la opción entre agua y la palanca, elegirían la palanca. Incluso cuando las ratas hembras tenían cachorros recién nacidos esperando ser alimentados, elegirían la palanca sobre cuidar a sus crías.</p>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">⚡ El Poder de la Dopamina</h4>
          <p>Los científicos finalmente descubrieron que el núcleo accumbens, el llamado botón de placer, no era un centro de placer en absoluto, sino el centro de deseo del cerebro. Si destruyes el núcleo accumbens, un animal perderá todo deseo de vivir. Se negará a comer. Se negará a tener sexo. Morirá de hambre y sed aunque la comida y el agua estén al alcance.</p>
        </div>
        
        <h3>🎯 La Diferencia Entre Querer y Gustar</h3>
        <p>Los neurocientíficos han descubierto que el deseo y el gusto están gobernados por diferentes partes del cerebro. El deseo es gobernado por la dopamina. El gustar es gobernado por los opioides.</p>
        
        <p>La dopamina no es solo liberada cuando experimentas placer, sino también cuando lo anticipas. Es la anticipación de una recompensa —no el cumplimiento de ella— lo que nos hace tomar acción.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Es la anticipación de una recompensa —no el cumplimiento de ella— lo que nos hace tomar acción."
        </blockquote>
        
        <h3>🔗 La Estrategia de Agrupamiento de Tentaciones</h3>
        <p>Ronan Byrnes, un estudiante de ingeniería eléctrica en Dublín, Irlanda, disfrutaba viendo Netflix, pero sabía que también debería hacer más ejercicio. Combinó ambos creando un sistema donde su bicicleta estacionaria alimentaba su computadora portátil y televisor. Si dejaba de pedalear, la pantalla se apagaba. Solo podía ver el próximo episodio si seguía pedaleando.</p>
        
        <p>Byrnes creó lo que los psicólogos llaman una <strong>pila de tentaciones</strong>: él agrupó una acción que quería hacer (ver Netflix) con una acción que necesitaba hacer (hacer ejercicio).</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🎪 Fórmula de Agrupamiento de Tentaciones</h4>
          <p><strong>"Después de [HÁBITO QUE NECESITO], haré [HÁBITO QUE QUIERO]."</strong></p>
          <p>Ejemplos:</p>
          <ul style="margin-bottom: 0;">
            <li>Después de sacar mi teléfono, haré diez respiraciones profundas (necesito relajarme)</li>
            <li>Después de recibir mi café matutino, escribiré mi lista de tareas pendientes (necesito planificar mi día)</li>
            <li>Después de comer el almuerzo, llamaré a tres clientes potenciales (necesito hacer más ventas)</li>
          </ul>
        </div>
        
        <h3>🏗️ Combinando Apilamiento de Hábitos y Agrupamiento de Tentaciones</h3>
        <p>Puedes incluso combinar el agrupamiento de tentaciones con el apilamiento de hábitos, la estrategia que discutimos en el Capítulo 5, para crear un conjunto de reglas que guíen tu comportamiento futuro.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🔄 Fórmula Combinada</h4>
          <ol style="margin-bottom: 0;">
            <li><strong>Después de [HÁBITO ACTUAL], haré [HÁBITO QUE NECESITO].</strong></li>
            <li><strong>Después de [HÁBITO QUE NECESITO], haré [HÁBITO QUE QUIERO].</strong></li>
          </ol>
        </div>
        
        <p>Por ejemplo:</p>
        <ol>
          <li>Después de verter mi taza de café cada mañana, meditaré durante sesenta segundos (necesito).</li>
          <li>Después de meditar durante sesenta segundos, revisaré mi lista de tareas pendientes para el día (quiero).</li>
        </ol>
        
        <h3>🎮 Haciendo los Hábitos Difíciles Más Atractivos</h3>
        <p>Los hábitos son un bucle de retroalimentación impulsado por la dopamina. Cuando la dopamina aumenta, también lo hace nuestra motivación para actuar. Es por eso que la segunda ley del cambio de comportamiento es hacerlo atractivo.</p>
        
        <p>Necesitas hacer que tus hábitos sean atractivos porque es la expectativa de una experiencia gratificante lo que nos motiva a actuar en primer lugar. Esta es la razón por la cual el agrupamiento de tentaciones funciona. Vincula una acción que quieres hacer con una acción que necesitas hacer.</p>
      `,
      page_number: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-9",
      book_id: "1",
      chapter_number: 9,
      title: "El Papel de la Familia y los Amigos en la Formación de Hábitos",
      content: `
        <h2>Capítulo 9: El Papel de la Familia y los Amigos en la Formación de Hábitos</h2>
        <p>En 1965, un psicólogo húngaro llamado László Polgár escribió una serie de cartas a una profesora ucraniana llamada Klara. En las cartas, describió su creencia de que los niños podían alcanzar el genio en cualquier campo con el entrenamiento adecuado. "Un genio no nace, sino que se educa y entrena", escribió.</p>
        
        <h3>♟️ El Experimento de las Hermanas Polgár</h3>
        <p>Klara estuvo de acuerdo con esta filosofía, y cuando se casaron, los Polgárs decidieron que sus hijos serían su prueba de concepto. Decidieron especializarse en ajedrez, un dominio que sería fácil de medir y rastrear el progreso.</p>
        
        <p>Los Polgárs criaron a tres hijas: Susan, Sofia y Judit. Las tres se convirtieron en algunas de las mejores jugadoras de ajedrez del mundo. Susan se convirtió en Gran Maestra y fue la primera mujer en ganar el Campeonato Mundial de Ajedrez de Estados Unidos. Sofia ganó el campeonato de Roma cuando tenía catorce años. Judit se convirtió en la jugadora más joven en convertirse en Gran Maestra a los quince años, rompiendo el récord previamente establecido por Bobby Fischer.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🏆 El Poder del Ambiente Social</h4>
          <p>¿Cómo lograron los Polgárs criar tres de las mejores juga doras de ajedrez del mundo? La respuesta más simple es que alteraron el ambiente social de sus hijas.</p>
          <p><strong>En la casa Polgár, el ajedrez era normal. En tu casa, probablemente no lo es.</strong></p>
        </div>
        
        <h3>👥 Los Tres Grupos que Moldean Nuestro Comportamiento</h3>
        <p>Los humanos son animales de manada. Queremos encajar, vincularnos con otros y ganar el respeto y la aprobación de nuestros pares. Tales inclinaciones son esenciales para nuestra supervivencia. Durante la mayor parte de nuestra historia evolutiva, nuestros ancestros vivieron en tribus. Convertirse en separado del grupo —o peor, ser expulsado— era una sentencia de muerte.</p>
        
        <p>Imitamos los hábitos de tres grupos en particular:</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">👨‍👩‍👧‍👦 1. Los Cercanos</h4>
          <p>Uno de los hallazgos más efectivos en toda la psicología es el efecto de proximidad, que establece que tendemos a imitar los hábitos de aquellos que están cerca de nosotros.</p>
          <ul style="margin-bottom: 0;">
            <li>Si tu cónyuge tiene sobrepeso, tus posibilidades de tener sobrepeso aumentan un 37%</li>
            <li>Si un amigo cercano tiene sobrepeso, tus posibilidades aumentan un 57%</li>
            <li>Si tu hermano o hermana tiene sobrepeso, tus posibilidades aumentan un 40%</li>
          </ul>
        </div>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">👑 2. Los Muchos</h4>
          <p>Siempre que no estamos seguros de cómo actuar, miramos al grupo para guiar nuestro comportamiento. Constantemente escaneamos nuestro ambiente y nos preguntamos: "¿Qué está haciendo todo el mundo?"</p>
          <p><strong>Ejemplo:</strong> Los estudios muestran que si estás tratando de construir mejores hábitos alimenticios pero vives en una comunidad donde la comida chatarra es la norma, tendrás una batalla cuesta arriba.</p>
        </div>
        
        <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #be185d; margin-top: 0;">⭐ 3. Los Poderosos</h4>
          <p>Los humanos en todas partes persiguen el poder, el prestigio y el estatus. Queremos ser reconocidos, respetados y admirados. Imitamos a las personas que admiramos.</p>
          <p><strong>Muchos de nuestros hábitos diarios son imitaciones de personas que admiramos.</strong></p>
        </div>
        
        <h3>🏠 Únete a una Cultura donde tu Comportamiento Deseado es Normal</h3>
        <p>Si quieres leer más, únete a un club de lectura. Si quieres hacer más ejercicio, únete a un gimnasio donde el ejercicio es la norma. Si quieres comer más saludable, únete a una comunidad de personas que valoran la alimentación saludable.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Nada sostiene la motivación mejor que pertenecer a la tribu. Transforma una búsqueda personal en una búsqueda compartida."
        </blockquote>
        
        <h3>🎭 Imitando a los Poderosos</h3>
        <p>Los humanos en todas partes persiguen el poder, el prestigio y el estatus. Queremos ser reconocidos, respetados y admirados. Esta tendencia puede parecer vana, pero en general, es una estrategia inteligente. Los humanos valoran el poder, el prestigio y el estatus porque estos factores son típicamente indicadores de recursos y capacidades que mejoran nuestras posibilidades de supervivencia y reproducción exitosa.</p>
        
        <p>Una vez que encajamos, comenzamos a buscar formas de destacar. Esta es una de las razones por las que las personas toman hábitos como fumar o beber en exceso. Están buscando una manera de separarse de la multitud, de ser diferentes.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🎯 Estrategia Práctica</h4>
          <p><strong>Únete a una cultura donde:</strong></p>
          <ol style="margin-bottom: 0;">
            <li>Tu comportamiento deseado es el comportamiento normal</li>
            <li>Ya tienes algo en común con el grupo</li>
          </ol>
          <p>El comportamiento normal de la tribu a menudo anula el comportamiento deseado del individuo.</p>
        </div>
      `,
      page_number: 9,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-1-10",
      book_id: "1",
      chapter_number: 10,
      title: "Cómo Encontrar y Arreglar las Causas Raíz de tus Malos Hábitos",
      content: `
        <h2>Capítulo 10: Cómo Encontrar y Arreglar las Causas Raíz de tus Malos Hábitos</h2>
        <p>Tu cerebro no evolucionó con un fuerte deseo de leer libros o escribir código o grabar podcasts. En un momento dado, no había libros, computadoras o podcasts. Durante cientos de miles de años, los cerebros humanos evolucionaron para desear cosas como comida, agua, refugio, encontrar una pareja, conectarse y vincularse con otros, y ganar respeto y admiración.</p>
        
        <h3>🧬 Los Deseos Subyacentes Fundamentales</h3>
        <p>Sí, los humanos tienen muchos deseos únicos: expresar creatividad, crear arte, cocinar una comida, etc. Pero debajo de estos deseos específicos hay motivos más profundos y fundamentales.</p>
        
        <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0369a1; margin-top: 0;">🎯 Los Motivos Fundamentales Detrás del Comportamiento Humano</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Conservar energía</strong></li>
            <li><strong>Obtener comida y agua</strong></li>
            <li><strong>Encontrar amor y reproducirse</strong></li>
            <li><strong>Conectarse y vincularse con otros</strong></li>
            <li><strong>Ganar aceptación social y aprobación</strong></li>
            <li><strong>Reducir la incertidumbre</strong></li>
            <li><strong>Lograr estatus y prestigio</strong></li>
          </ul>
        </div>
        
        <p>Un anhelo es solo una manifestación específica de un motivo subyacente más profundo. Tu cerebro no anhela fumar un cigarrillo o revisar Instagram. En el nivel más básico, simplemente quieres reducir la incertidumbre y aliviar la ansiedad, ganar aceptación social y aprobación, o lograr estatus.</p>
        
        <h3>🔍 Identificando los Motivos Detrás de tus Hábitos</h3>
        <p>Mira cualquier producto que llene con éxito un deseo persistente y verás que no crea una nueva motivación, sino que aprovecha los motivos y deseos subyacentes de la naturaleza humana.</p>
        
        <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
          "Los hábitos son soluciones modernas a deseos antiguos."
        </blockquote>
        
        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #d97706; margin-top: 0;">📱 Ejemplos de Hábitos Modernos y sus Motivos Antiguos</h4>
          <ul style="margin-bottom: 0;">
            <li><strong>Encontrar amor y reproducirse</strong> → Tinder</li>
            <li><strong>Conectarse y vincularse con otros</strong> → Facebook</li>
            <li><strong>Ganar aceptación social y aprobación</strong> → Instagram</li>
            <li><strong>Reducir la incertidumbre</strong> → Google</li>
            <li><strong>Lograr estatus y prestigio</strong> → Videojuegos</li>
          </ul>
        </div>
        
        <h3>🎭 Reprogramando tu Cerebro para Disfrutar Hábitos Difíciles</h3>
        <p>Puedes hacer que los hábitos difíciles sean más atractivos si puedes aprender a asociarlos con una experiencia positiva. A veces, solo necesitas un ligero cambio de mentalidad.</p>
        
        <p>Por ejemplo, no "tienes que" levantarte temprano para hacer ejercicio. "Llegas a" construir resistencia y ser más fuerte. No "tienes que" hacer otra llamada de ventas. "Llegas a" ayudar a otra persona resolver sus problemas.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #15803d; margin-top: 0;">🔄 Reencuadre de Hábitos</h4>
          <p><strong>En lugar de:</strong> "Tengo que correr esta mañana"</p>
          <p><strong>Di:</strong> "Es hora de construir resistencia y ser rápido"</p>
          
          <p><strong>En lugar de:</strong> "Tengo que cocinar la cena"</p>
          <p><strong>Di:</strong> "Es hora de ser el chef de mi familia"</p>
          
          <p><strong>En lugar de:</strong> "Tengo que hacer esta presentación"</p>
          <p><strong>Di:</strong> "Es hora de compartir mi trabajo con el mundo"</p>
        </div>
        
        <h3>🧘 Creando un Ritual de Motivación</h3>
        <p>Puedes incluso crear un simple ritual que realizas antes de un hábito difícil para ayudarte a entrar en un estado mental enfocado. Por ejemplo:</p>
        
        <p>Un atleta podría tener un ritual pre-juego donde siempre pone su equipo en el mismo orden o escucha la misma canción. Estos comportamientos están vinculados mentalmente con el rendimiento exitoso a lo largo del tiempo.</p>
        
        <p>Eventualmente, kicking into that routine triggers a state of peak performance. You can adapt this strategy for nearly any purpose.</p>
        
        <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #be185d; margin-top: 0;">🎵 Ejemplo de Ritual de Motivación</h4>
          <p><strong>Para estudiar:</strong></p>
          <ol style="margin-bottom: 0;">
            <li>Pon tu música de estudio favorita</li>
            <li>Organiza tu escritorio</li>
            <li>Abre tu libro en la página correcta</li>
            <li>Toma tres respiraciones profundas</li>
            <li>Comienza</li>
          </ol>
        </div>
        
        <p>El ritual se vuelve la primera parte del hábito, y crea un estado mental que te prepara para realizar el trabajo que sigue. Al desarrollar un ritual, haces que el hábito sea más probable que ocurra.</p>
      `,
      page_number: 10,
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
      
      <p><strong>Trabajo Superficial:</strong> Tareas de estilo logístico, a menudo realizadas mientras se está distraído. Estos esfuerzos tienden a no crear mucho valor nuevo en el mundo y son fáciles de replicar.</p>
      
      <h3>🌊 La Nueva Economía del Conocimiento</h3>
      <p>Estamos en medio de una transformación económica. La capacidad de realizar trabajo profundo se está volviendo cada vez más <strong>rara</strong> al mismo tiempo que se vuelve cada vez más <strong>valiosa</strong> en nuestra economía.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🎯 Los Tres Grupos que Prosperarán</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>Aquellos que pueden trabajar bien y creativamente con tecnología inteligente</strong></li>
          <li><strong>Aquellos que son los mejores en lo que hacen</strong></li>
          <li><strong>Aquellos con acceso al capital</strong></li>
        </ol>
      </div>
      
      <p>Para unirte a los primeros dos grupos (los únicos accesibles para la mayoría), necesitas dominar el arte de aprender rápidamente cosas complicadas. Esta tarea requiere trabajo profundo.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ La Paradoja del Trabajo Profundo</h4>
        <p style="margin-bottom: 0;">Mientras que el trabajo profundo se vuelve más valioso, nuestra capacidad para hacerlo se está deteriorando. Las distracciones constantes de emails, redes sociales y reuniones están fragmentando nuestra atención.</p>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "El trabajo profundo no es solo una habilidad útil, es un superpoder en nuestra economía cada vez más competitiva."
      </blockquote>
      
      <h3>🧠 Las Dos Habilidades Centrales para Prosperar</h3>
      <p>Para permanecer valioso en nuestra economía, debes dominar las siguientes dos habilidades centrales:</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🎯 Habilidad #1: Dominar Rápidamente Cosas Difíciles</h4>
        <p>Las tecnologías cambian rápidamente, por lo que debes ser capaz de dominar nuevas cosas rápidamente, una y otra vez.</p>
      </div>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🎯 Habilidad #2: Producir a un Nivel Elite</h4>
        <p>Si no puedes aprender, no puedes prosperar. Pero si puedes aprender, eso es solo el primer paso. También debes transformar ese talento en resultados que la gente valore.</p>
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
      <h2>Capítulo 2: Trabajo Profundo es Raro</h2>
      <p>A pesar de la creciente evidencia de que el trabajo profundo es valioso, muchas organizaciones están adoptando prácticas que lo hacen más difícil.</p>
      
      <h3>🏢 Las Fuerzas que Conspiran Contra el Trabajo Profundo</h3>
      <p>En ausencia de indicadores claros de lo que significa ser productivo y valioso en su trabajo, muchos trabajadores del conocimiento recurren a un <strong>proxy industrial</strong>: hacer muchas cosas de manera visible.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">📧 El Problema del Email</h4>
        <p>El trabajador promedio del conocimiento revisa el email cada 6 minutos. Esta fragmentación constante de la atención hace que el trabajo profundo sea casi imposible.</p>
      </div>
      
      <h3>🔄 El Principio de Menor Resistencia</h3>
      <p>En un entorno empresarial, sin retroalimentación clara sobre el impacto de varios comportamientos en el resultado final, tendemos hacia comportamientos que son más fáciles en el momento.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "La cultura de la conectividad constante es en realidad disfuncional, pero hemos llegado a aceptarla como necesaria para el éxito."
      </blockquote>
      
      <h3>🎭 El Busyness como Proxy para la Productividad</h3>
      <p>En ausencia de indicadores claros de lo que significa ser productivo y valioso, muchos trabajadores del conocimiento recurren a un proxy industrial: hacer muchas cosas de manera visible.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Señales de Falsa Productividad</h4>
        <ul style="margin-bottom: 0;">
          <li>Responder emails rápidamente</li>
          <li>Asistir a muchas reuniones</li>
          <li>Estar siempre "disponible"</li>
          <li>Multitarea constante</li>
          <li>Trabajar largas horas visiblemente</li>
        </ul>
      </div>
      
      <p>Estas actividades, aunque pueden parecer productivas, a menudo impiden el tipo de trabajo concentrado que realmente mueve la aguja en términos de valor creado.</p>
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
      <h2>Capítulo 3: Trabajo Profundo es Significativo</h2>
      <p>El trabajo profundo no es solo económicamente valioso, sino que también puede ser una fuente de gran satisfacción personal. Una vida vivida profundamente será una vida vivida bien.</p>
      
      <h3>🧠 La Perspectiva Neurológica</h3>
      <p>Los neurocientíficos han identificado un mecanismo neurológico para esta conexión entre concentración y felicidad. Para entender este mecanismo, necesitamos introducir el concepto de atención.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🎯 El Poder de la Atención</h4>
        <p>Tu mundo es el resultado de lo que prestas atención. Si te enfocas en lo negativo en tu trabajo, experimentarás tu trabajo como negativo, pero si te enfocas en lo positivo, experimentarás tu trabajo como positivo.</p>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Quien eres, lo que piensas, sientes y haces, lo que amas, es la suma de lo que enfocas."
      </blockquote>
      
      <h3>🏛️ La Perspectiva Psicológica</h3>
      <p>El psicólogo Mihaly Csikszentmihalyi ha pasado décadas estudiando el fenómeno que llama "flow": un estado en el que una persona está completamente inmersa en una actividad.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🌊 Las Características del Flow</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Concentración total</strong> en la tarea en cuestión</li>
          <li><strong>Objetivos claros</strong> y retroalimentación inmediata</li>
          <li><strong>Equilibrio</strong> entre desafío y habilidad</li>
          <li><strong>Pérdida de autoconciencia</strong></li>
          <li><strong>Transformación del tiempo</strong></li>
        </ul>
      </div>
      
      <p>El trabajo profundo es una actividad bien adecuada para generar un estado de flow, y el flow genera felicidad.</p>
      
      <h3>🏗️ La Perspectiva Filosófica</h3>
      <p>Hay algo especialmente valioso sobre el trabajo manual y la artesanía. El filósofo Matthew Crawford argumenta que hay una satisfacción especial en el trabajo que produce resultados tangibles.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">🔨 La Ética del Artesano</h4>
        <p>Los artesanos de generaciones pasadas no eran distraídos por las preocupaciones de marketing o la construcción de marca personal. Se enfocaban en la calidad de lo que construían.</p>
        <p style="margin-bottom: 0;"><strong>Esta mentalidad proporciona la base para una vida laboral satisfactoria.</strong></p>
      </div>
      
      <p>El trabajo profundo, como la artesanía de calidad, es una actividad que puede generar un sentido real de satisfacción y significado.</p>
      
      <h3>🎯 Construyendo una Vida Profunda</h3>
      <p>Una vida profunda es una vida buena, cualquiera que sea tu profesión. El trabajo profundo puede generar tanto satisfacción personal como valor profesional.</p>
    `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-2-4",
      book_id: "2",
      chapter_number: 4,
      title: "La Filosofía del Trabajo Profundo",
      content: `
      <h2>Capítulo 4: La Filosofía del Trabajo Profundo</h2>
      <p>Para hacer del trabajo profundo una prioridad, necesitas decidir sobre tu filosofía para integrar el trabajo profundo en tu vida profesional.</p>
      
      <h3>🏛️ Las Cuatro Filosofías del Trabajo Profundo</h3>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🏔️ 1. La Filosofía Monástica</h4>
        <p>Esta filosofía intenta maximizar los esfuerzos de trabajo profundo eliminando o minimizando radicalmente las obligaciones superficiales.</p>
        <p><strong>Ejemplo:</strong> Donald Knuth, el famoso científico de la computación, no usa email y se enfoca exclusivamente en la investigación.</p>
      </div>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🔄 2. La Filosofía Bimodal</h4>
        <p>Esta filosofía divide tu tiempo, dedicando algunos períodos claramente definidos al trabajo profundo y dejando el resto abierto a todo lo demás.</p>
        <p><strong>Ejemplo:</strong> Carl Jung construyó una torre de piedra en el bosque donde se retiraba por semanas para pensar y escribir.</p>
      </div>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⏰ 3. La Filosofía Rítmica</h4>
        <p>Esta filosofía argumenta que la forma más fácil de comenzar consistentemente sesiones de trabajo profundo es transformarlas en un hábito simple y regular.</p>
        <p><strong>Ejemplo:</strong> Escribir de 5:30 a 7:30 AM todos los días antes del trabajo.</p>
      </div>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">🎯 4. La Filosofía Periodística</h4>
        <p>Esta filosofía intenta cambiar al modo de trabajo profundo en cualquier momento que puedas.</p>
        <p><strong>Advertencia:</strong> Esta filosofía no es para principiantes del trabajo profundo.</p>
      </div>
      
      <h3>🏗️ Ritualizando el Trabajo Profundo</h3>
      <p>Para hacer del trabajo profundo un éxito, necesitas construir rituales de la misma manera seria que los escritores más respetados.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Los grandes mentes creativas piensan como artistas pero trabajan como contadores."
      </blockquote>
      
      <h3>📋 Elementos de un Ritual de Trabajo Profundo</h3>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🎯 Preguntas Clave para tu Ritual</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>¿Dónde trabajarás y por cuánto tiempo?</strong></li>
          <li><strong>¿Cómo trabajarás una vez que comiences?</strong></li>
          <li><strong>¿Cómo apoyarás tu trabajo?</strong></li>
        </ul>
      </div>
      
      <h3>🏰 Los Grandes Gestos</h3>
      <p>Al hacer un gran gesto financiero o de esfuerzo dedicado a una tarea de trabajo profundo, aumentas la importancia percibida de la tarea.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">🏨 Ejemplos de Grandes Gestos</h4>
        <ul style="margin-bottom: 0;">
          <li>J.K. Rowling se registró en un hotel de lujo para terminar Harry Potter</li>
          <li>Bill Gates toma "Think Weeks" dos veces al año en una cabaña aislada</li>
          <li>Shockley Semiconductor construyó un laboratorio especial para trabajo profundo</li>
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
      title: "Las Cuatro Disciplinas de la Ejecución",
      content: `
      <h2>Capítulo 5: Las Cuatro Disciplinas de la Ejecución</h2>
      <p>Los autores de "Las 4 Disciplinas de la Ejecución" estudiaron el problema de implementar estrategias de alto nivel y descubrieron cuatro "disciplinas" que ayudan a las organizaciones a tener éxito con este objetivo.</p>
      
      <h3>🎯 Disciplina #1: Enfócate en lo Tremendamente Importante</h3>
      <p>"Cuanto más trates de hacer, menos lograrás realmente." Esta idea sugiere que la ejecución debe dirigirse hacia un pequeño número de "objetivos tremendamente importantes".</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🎯 Aplicación al Trabajo Profundo</h4>
        <p>Para un individuo enfocado en el trabajo profundo, la implicación es que debes identificar un pequeño número de objetivos ambiciosos que perseguir con tu trabajo profundo.</p>
        <p style="margin-bottom: 0;"><strong>Ejemplo:</strong> "Escribiré un libro de alta calidad" en lugar de "Haré muchas cosas relacionadas con la escritura".</p>
      </div>
      
      <h3>📊 Disciplina #2: Actúa sobre las Medidas Principales</h3>
      <p>Hay dos tipos de métricas: medidas de retraso y medidas principales. Las medidas de retraso describen la cosa que estás tratando de mejorar. Las medidas principales miden los nuevos comportamientos que impulsarán el éxito en las medidas de retraso.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">📈 Ejemplo de Medidas</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Medida de Retraso:</strong> Artículos académicos publicados por año</li>
          <li><strong>Medida Principal:</strong> Horas dedicadas al trabajo profundo por semana</li>
        </ul>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Para un escritor, las palabras producidas por hora de trabajo profundo es una medida principal razonable."
      </blockquote>
      
      <h3>📋 Disciplina #3: Mantén un Marcador Convincente</h3>
      <p>"Las personas juegan de manera diferente cuando mantienen el marcador." Cuando intentas impulsar tu equipo hacia una meta particular, es importante que puedan ver inmediatamente, en un vistazo, si están teniendo éxito o fallando.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">📊 Creando tu Marcador</h4>
        <p>Para el trabajo profundo individual, esto podría ser tan simple como:</p>
        <ul style="margin-bottom: 0;">
          <li>Un círculo por cada hora de trabajo profundo completada</li>
          <li>Una marca de verificación por cada página escrita</li>
          <li>Un registro visual de tu progreso diario</li>
        </ul>
      </div>
      
      <h3>🔄 Disciplina #4: Crea una Cadencia de Responsabilidad</h3>
      <p>Las disciplinas 1, 2 y 3 están dirigidas a ayudarte a enfocarte en lo importante. La disciplina 4 es sobre asegurar que realmente hagas algo al respecto.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">📅 Revisión Semanal</h4>
        <p>Programa una revisión semanal donde:</p>
        <ol style="margin-bottom: 0;">
          <li>Revises el marcador de la semana pasada</li>
          <li>Analices qué funcionó y qué no</li>
          <li>Planifiques el trabajo profundo para la próxima semana</li>
        </ol>
      </div>
      
      <h3>🎯 Aplicando las Disciplinas</h3>
      <p>Estas cuatro disciplinas proporcionan una estructura probada para implementar el trabajo profundo en tu vida profesional. La clave es la consistencia y el seguimiento riguroso de tus medidas principales.</p>
      
      <p>Recuerda: "La ejecución es más difícil que la estrategia." Estas disciplinas te ayudan a cerrar la brecha entre saber qué hacer y realmente hacerlo.</p>
    `,
      page_number: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-2-6",
      book_id: "2",
      chapter_number: 6,
      title: "Sé Perezoso",
      content: `
      <h2>Capítulo 6: Sé Perezoso</h2>
      <p>Este consejo suena extraño viniendo de un libro sobre trabajo enfocado, pero como explicaré, ser "perezoso" en el sentido correcto es crucial para mantener la intensidad necesaria para el trabajo profundo.</p>
      
      <h3>🌅 La Importancia del Tiempo de Inactividad</h3>
      <p>Al final de la jornada laboral, cierra tu consideración del trabajo hasta la mañana siguiente. No revises email después de la cena, no repases mentalmente conversaciones de la oficina, no planifiques cómo manejarás un desafío próximo.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "El tiempo de inactividad regular no es solo agradable, sino que es crucial para alcanzar los niveles de rendimiento máximo que el trabajo profundo requiere."
      </blockquote>
      
      <h3>🧠 Tres Razones para el Tiempo de Inactividad</h3>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">💡 Razón #1: El Tiempo de Inactividad Ayuda con las Percepciones</h4>
        <p>Algunos decisiones se toman mejor por tu mente inconsciente. Para estas decisiones, tu mente consciente debe estar ocupada con otra cosa.</p>
        <p><strong>La Teoría del Pensamiento Inconsciente (UTT)</strong> sugiere que para decisiones que involucran grandes cantidades de información y múltiples restricciones, tu mente inconsciente es mejor para procesar y llegar a una decisión.</p>
      </div>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🔋 Razón #2: El Tiempo de Inactividad Ayuda a Recargar la Atención</h4>
        <p>La <strong>Teoría de Restauración de la Atención (ART)</strong> afirma que puedes restaurar tu capacidad de dirigir la atención si le das un descanso.</p>
        <p>Caminar en la naturaleza, por ejemplo, proporciona lo que los investigadores llaman "fascinación suave" que permite que tus mecanismos de atención dirigida se restauren.</p>
      </div>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚡ Razón #3: El Trabajo que el Tiempo de Inactividad Reemplaza Usualmente No es Importante</h4>
        <p>Tu capacidad para el trabajo profundo en un día dado es limitada. Una vez que has alcanzado este límite, tu capacidad para pensar claramente sobre problemas complejos se reduce significativamente.</p>
        <p style="margin-bottom: 0;">El trabajo adicional que haces por la noche, por lo tanto, no es usualmente de alta calidad.</p>
      </div>
      
      <h3>🔒 El Ritual de Cierre</h3>
      <p>Para tener éxito con esta estrategia, necesitas un ritual estricto que uses al final de la jornada laboral para maximizar la probabilidad de que realmente puedas cerrar el trabajo.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">📋 Ejemplo de Ritual de Cierre</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>Revisa tu email</strong> una última vez para asegurar que no hay nada urgente</li>
          <li><strong>Transfiere nuevas tareas</strong> de tu cabeza a tu lista de tareas</li>
          <li><strong>Revisa rápidamente</strong> cada tarea en tu lista y calendario para la próxima semana</li>
          <li><strong>Haz un plan aproximado</strong> para el día siguiente</li>
          <li><strong>Di la frase:</strong> "El horario está completo"</li>
        </ol>
      </div>
      
      <h3>🎯 La Mentalidad Correcta</h3>
      <p>Cuando ocasionalmente fallas en mantener este límite, y tu mente comienza a preocuparse por algún problema relacionado con el trabajo, recuérdate a ti mismo: está bien no resolver inmediatamente cada pequeño problema de trabajo que surge.</p>
      
      <p>Confía en que el ritual de cierre capturó todo lo que es importante, y que hay un plan para lidiar con estos elementos, para que sea seguro liberar estos pensamientos por ahora.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Trabajar profundamente es agotador. Si agotaste tu reserva finita de fuerza de voluntad en trabajo profundo, tendrás menos disponible para el tipo de meta-cognición requerida para resistir distracciones."
      </blockquote>
    `,
      page_number: 6,
      created_at: new Date().toISOString(),
    },
  ],
  "3": [
    {
      id: "content-3-1",
      book_id: "3",
      chapter_number: 1,
      title: "La Brecha de Liderazgo",
      content: `
      <h2>Capítulo 1: La Brecha de Liderazgo</h2>
      <p>Hace dieciocho meses, me senté en una mesa redonda con otros ejecutivos senior, y el tema de conversación era por qué había tan pocas mujeres en posiciones de liderazgo senior. Los hombres en esa mesa expresaron genuina preocupación y desconcierto sobre el problema.</p>
      
      <h3>📊 Los Números No Mienten</h3>
      <p>A pesar de que las mujeres han ganado tremendos logros en educación y participación en la fuerza laboral, el progreso hacia el liderazgo se ha estancado.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">🚨 La Realidad Actual</h4>
        <ul style="margin-bottom: 0;">
          <li>Las mujeres representan solo el <strong>21%</strong> de los ejecutivos senior</li>
          <li>Solo el <strong>4%</strong> de los CEOs de Fortune 500 son mujeres</li>
          <li>Las mujeres ocupan solo el <strong>17%</strong> de los asientos en juntas directivas</li>
          <li>En política, las mujeres representan solo el <strong>20%</strong> del Congreso</li>
        </ul>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Una verdadera igualdad de oportunidades requiere más que leyes justas. Requiere que las mujeres no se contengan a sí mismas."
      </blockquote>
      
      <h3>🎯 El Problema Interno</h3>
      <p>Las barreras externas a las mujeres en el lugar de trabajo son muy reales, pero también existen barreras internas que son igualmente reales. Nosotras nos contenemos de maneras que los hombres no lo hacen.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🔍 Barreras Internas Comunes</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Falta de confianza:</strong> Subestimamos nuestras propias habilidades</li>
          <li><strong>No levantar la mano:</strong> No buscamos oportunidades de liderazgo</li>
          <li><strong>Retirarse antes de partir:</strong> Limitamos nuestras ambiciones prematuramente</li>
        </ul>
      </div>
      
      <h3>💪 El Llamado a la Acción</h3>
      <p>Mi mensaje no es que las mujeres sean culpables de los desafíos que enfrentan. Mi mensaje es que todos nosotros, hombres y mujeres, tenemos que entender y reconocer cómo las expectativas sociales y los estereotipos inconscientes crean barreras.</p>
      
      <p>Necesitamos hablar abiertamente sobre género. Necesitamos llamar a más mujeres a inclinarse hacia adelante, y necesitamos llamar a más hombres y mujeres a apoyarlas cuando lo hagan.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🌟 ¿Qué Significa "Inclinarse Hacia Adelante"?</h4>
        <p>Inclinarse hacia adelante significa:</p>
        <ul style="margin-bottom: 0;">
          <li>Ser ambiciosa en cualquier búsqueda</li>
          <li>Perseguir objetivos con determinación</li>
          <li>Usar tu voz para efectuar el cambio</li>
          <li>Tomar riesgos y aceptar desafíos</li>
          <li>Perseverar cuando las cosas se ponen difíciles</li>
        </ul>
      </div>
      
      <h3>🤝 Un Esfuerzo Conjunto</h3>
      <p>Lograr la igualdad será un esfuerzo conjunto que requerirá tanto hombres como mujeres uniendo fuerzas para cambiar las conversaciones, cambiar las percepciones, y cambiar las estructuras que limitan el potencial.</p>
      
      <p>Cuando más mujeres se inclinen hacia adelante, podremos cambiar no solo nuestras propias perspectivas, sino también cambiar el mundo.</p>
    `,
      page_number: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-2",
      book_id: "3",
      chapter_number: 2,
      title: "Siéntate en la Mesa",
      content: `
      <h2>Capítulo 2: Siéntate en la Mesa</h2>
      <p>Hace varios años, fui invitada a dar una charla en una conferencia. Cuando llegué al evento, los organizadores me llevaron a un pequeño salón donde me esperaban unas treinta mujeres ejecutivas para una sesión de preguntas y respuestas antes de mi presentación principal.</p>
      
      <h3>🪑 La Mesa y las Sillas</h3>
      <p>Había una mesa ovalada con unas diez sillas alrededor, y detrás había unas veinte sillas adicionales contra las paredes. Invité a todos a sentarse donde quisieran. <strong>Todas las mujeres se dirigieron a las sillas contra las paredes.</strong></p>
      
      <p>Nadie se sentó en la mesa, a pesar de que había diez sillas vacías. Insistí: "Por favor, siéntense en la mesa." Finalmente, unas pocas mujeres se acercaron tímidamente y tomaron asiento, pero la mayoría permaneció contra las paredes.</p>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "No puedo decir con certeza que los hombres habrían llenado inmediatamente todas las sillas de la mesa, pero dudo que hubieran dejado tantas vacías."
      </blockquote>
      
      <h3>🎯 El Síndrome del Impostor</h3>
      <p>Muchas mujeres, incluso aquellas en posiciones senior, sufren del síndrome del impostor. Dudan de sus habilidades y temen que otros descubran que no son tan inteligentes o capaces como parecen.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Señales del Síndrome del Impostor</h4>
        <ul style="margin-bottom: 0;">
          <li>Atribuir el éxito a la suerte en lugar del talento</li>
          <li>Temer que otros descubran que "no sabes lo que haces"</li>
          <li>Minimizar tus logros y contribuciones</li>
          <li>Evitar oportunidades por miedo al fracaso</li>
          <li>Trabajar excesivamente para "demostrar" tu valor</li>
        </ul>
      </div>
      
      <h3>📊 La Diferencia de Confianza</h3>
      <p>Los estudios muestran consistentemente que las mujeres subestiman su rendimiento y habilidades, mientras que los hombres sobreestiman los suyos.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">📈 Datos Reveladores</h4>
        <ul style="margin-bottom: 0;">
          <li>Las mujeres se postulan para trabajos solo cuando cumplen el <strong>100%</strong> de los requisitos</li>
          <li>Los hombres se postulan cuando cumplen solo el <strong>60%</strong> de los requisitos</li>
          <li>Las mujeres necesitan ser alentadas a postularse para posiciones</li>
          <li>Los hombres son más propensos a negociar salarios y promociones</li>
        </ul>
      </div>
      
      <h3>💪 Construyendo Confianza Auténtica</h3>
      <p>La confianza auténtica no se trata de arrogancia o de fingir que sabes todo. Se trata de:</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🌟 Elementos de la Confianza Auténtica</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Reconocer tus fortalezas:</strong> Sé honesta sobre lo que haces bien</li>
          <li><strong>Aceptar el crecimiento:</strong> Está bien no saber todo</li>
          <li><strong>Tomar crédito:</strong> Reconoce tus contribuciones y logros</li>
          <li><strong>Hablar con autoridad:</strong> Usa un lenguaje directo y seguro</li>
          <li><strong>Ocupar espacio:</strong> Física y verbalmente, hazte presente</li>
        </ul>
      </div>
      
      <h3>🗣️ Encuentra Tu Voz</h3>
      <p>En las reuniones, las mujeres a menudo hablan menos que los hombres. Cuando hablan, es más probable que sean interrumpidas. Es crucial que las mujeres encuentren y usen su voz.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">🎤 Estrategias para Usar Tu Voz</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Prepárate:</strong> Llega a las reuniones con puntos clave preparados</li>
          <li><strong>Habla temprano:</strong> Contribuye en los primeros minutos</li>
          <li><strong>Repite puntos importantes:</strong> Asegúrate de que te escuchen</li>
          <li><strong>Apoya a otras mujeres:</strong> Amplifica las ideas de tus colegas</li>
          <li><strong>No te disculpes innecesariamente:</strong> Evita "Lo siento, pero..."</li>
        </ul>
      </div>
      
      <h3>🪑 Toma Tu Lugar en la Mesa</h3>
      <p>Sentarse en la mesa es una metáfora para creer que perteneces en la sala donde se toman las decisiones. Significa:</p>
      
      <ul>
        <li>Participar activamente en conversaciones importantes</li>
        <li>Ofrecer tus ideas y perspectivas</li>
        <li>Tomar crédito por tu trabajo</li>
        <li>Buscar oportunidades de liderazgo</li>
        <li>Creer que tu voz importa</li>
      </ul>
      
      <p>Cuando las mujeres no se sientan en la mesa, literalmente y figurativamente, perdemos perspectivas valiosas y limitamos nuestro propio potencial de liderazgo.</p>
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
      <p>Heidi Roizen es una empresaria exitosa de Silicon Valley que ha sido ejecutiva de software, capitalista de riesgo y estratega corporativa. En 2003, profesores de Harvard y Stanford crearon un experimento usando su historia de éxito.</p>
      
      <h3>🔬 El Experimento de Heidi/Howard</h3>
      <p>Los profesores dieron a la mitad de sus estudiantes un caso de estudio sobre "Heidi Roizen" y a la otra mitad el mismo caso exacto, pero cambiaron el nombre a "Howard Roizen".</p>
      
      <p>Los estudiantes calificaron a Heidi y Howard como igualmente competentes, lo cual tenía sentido ya que habían logrado exactamente las mismas cosas. Pero los estudiantes gustaron más de Howard que de Heidi.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">📊 Los Resultados Reveladores</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Howard:</strong> Visto como un líder natural, alguien con quien querrían trabajar</li>
          <li><strong>Heidi:</strong> Vista como egoísta, no el tipo de persona con quien querrían trabajar</li>
          <li><strong>Mismos logros, diferentes percepciones</strong></li>
        </ul>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "El éxito y la simpatía están positivamente correlacionados para los hombres y negativamente correlacionados para las mujeres."
      </blockquote>
      
      <h3>⚖️ El Doble Estándar</h3>
      <p>Cuando un hombre es exitoso, tanto hombres como mujeres lo ven favorablemente. Cuando una mujer es exitosa, tanto hombres como mujeres la ven menos favorablemente.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">🎭 Expectativas Contradictorias</h4>
        <p>Las mujeres enfrentan expectativas contradictorias:</p>
        <ul style="margin-bottom: 0;">
          <li><strong>Sé asertiva</strong> pero no agresiva</li>
          <li><strong>Sé ambiciosa</strong> pero no egoísta</li>
          <li><strong>Sé competente</strong> pero no intimidante</li>
          <li><strong>Sé líder</strong> pero sigue siendo femenina</li>
          <li><strong>Habla</strong> pero no domines la conversación</li>
        </ul>
      </div>
      
      <h3>💼 El Costo de la Ambición</h3>
      <p>Las mujeres ambiciosas son vistas como menos cálidas y más egoístas que los hombres ambiciosos. Esta percepción tiene consecuencias reales:</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">💸 Consecuencias Profesionales</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Menores salarios:</strong> Las mujeres que negocian son vistas negativamente</li>
          <li><strong>Menos promociones:</strong> La ambición femenina es penalizada</li>
          <li><strong>Aislamiento social:</strong> Menos invitaciones a redes informales</li>
          <li><strong>Críticas más duras:</strong> Los errores son juzgados más severamente</li>
        </ul>
      </div>
      
      <h3>🎯 Estrategias de Navegación</h3>
      <p>Aunque no deberíamos tener que navegar estos dobles estándares, la realidad es que existen. Aquí hay estrategias que pueden ayudar:</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🌟 Estrategias Prácticas</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Usa "nosotros" en lugar de "yo":</strong> Enfatiza el trabajo en equipo</li>
          <li><strong>Explica tu motivación:</strong> Conecta la ambición con propósitos más amplios</li>
          <li><strong>Sonríe más (desafortunadamente):</strong> Contrarresta percepciones de frialdad</li>
          <li><strong>Busca aliados masculinos:</strong> Que aboguen por ti en conversaciones privadas</li>
          <li><strong>Apoya a otras mujeres:</strong> Crea una red de apoyo mutuo</li>
        </ul>
      </div>
      
      <h3>🤝 Negociación para Mujeres</h3>
      <p>La negociación es particularmente desafiante para las mujeres debido a las expectativas sociales. Las investigaciones muestran que:</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">💰 Consejos para Negociar</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Haz tu investigación:</strong> Conoce los rangos salariales del mercado</li>
          <li><strong>Practica tu presentación:</strong> Ensaya con amigos o mentores</li>
          <li><strong>Enfócate en el valor:</strong> Destaca tus contribuciones específicas</li>
          <li><strong>Considera el timing:</strong> Negocia después de logros significativos</li>
          <li><strong>Sé colaborativa:</strong> Presenta como una situación ganar-ganar</li>
        </ul>
      </div>
      
      <h3>🔄 Cambiando las Percepciones</h3>
      <p>Aunque las mujeres pueden usar estrategias para navegar estos desafíos, la verdadera solución requiere cambiar las percepciones sociales fundamentales sobre el liderazgo femenino.</p>
      
      <p>Necesitamos:</p>
      <ul>
        <li>Reconocer nuestros propios sesgos inconscientes</li>
        <li>Celebrar el éxito femenino sin calificaciones</li>
        <li>Crear más modelos de liderazgo femenino</li>
        <li>Educar sobre estos dobles estándares</li>
        <li>Apoyar activamente a las mujeres ambiciosas</li>
      </ul>
      
      <p>Solo cuando cambiemos estas percepciones profundamente arraigadas, las mujeres podrán ser tanto exitosas como queridas, tal como los hombres han sido siempre.</p>
    `,
      page_number: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-4",
      book_id: "3",
      chapter_number: 4,
      title: "Aún Es una Jungla Ahí Afuera",
      content: `
      <h2>Capítulo 4: Aún Es una Jungla Ahí Afuera</h2>
      <p>A pesar de décadas de progreso, el lugar de trabajo sigue siendo un terreno desafiante para las mujeres. Los obstáculos son tanto evidentes como sutiles, tanto institucionales como interpersonales.</p>
      
      <h3>🏢 La Realidad Corporativa</h3>
      <p>Las mujeres enfrentan desafíos únicos en el lugar de trabajo que van más allá de la discriminación obvia. Estos desafíos están profundamente arraigados en las estructuras y culturas organizacionales.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">🚨 Desafíos Persistentes</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Brecha salarial:</strong> Las mujeres ganan 77 centavos por cada dólar que ganan los hombres</li>
          <li><strong>Techo de cristal:</strong> Barreras invisibles para ascender a posiciones ejecutivas</li>
          <li><strong>Sesgo en las evaluaciones:</strong> Criterios diferentes para hombres y mujeres</li>
          <li><strong>Exclusión de redes:</strong> Menos acceso a conexiones informales importantes</li>
          <li><strong>Microagresiones:</strong> Comentarios y comportamientos sutilmente discriminatorios</li>
        </ul>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Las redes informales siguen siendo cruciales para el avance profesional, y las mujeres a menudo quedan excluidas de estos círculos."
      </blockquote>
      
      <h3>🎭 Sesgos Inconscientes</h3>
      <p>Los sesgos inconscientes afectan cómo se percibe y evalúa a las mujeres en el lugar de trabajo, incluso por parte de personas bien intencionadas.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">🧠 Ejemplos de Sesgos Inconscientes</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Sesgo de atribución:</strong> El éxito masculino se atribuye a habilidad, el femenino a suerte</li>
          <li><strong>Sesgo de confirmación:</strong> Buscar evidencia que confirme estereotipos</li>
          <li><strong>Efecto halo:</strong> Una característica positiva influye en la percepción general</li>
          <li><strong>Sesgo de afinidad:</strong> Favorecer a personas similares a nosotros</li>
          <li><strong>Estereotipos de rol:</strong> Expectativas basadas en género sobre comportamiento</li>
        </ul>
      </div>
      
      <h3>👶 La Penalización por Maternidad</h3>
      <p>Las madres enfrentan desafíos adicionales en el lugar de trabajo, incluyendo percepciones sobre su compromiso y competencia.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">👶 La Realidad de las Madres Trabajadoras</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Menor probabilidad de ser contratadas</strong></li>
          <li><strong>Salarios más bajos</strong> comparado con mujeres sin hijos</li>
          <li><strong>Menos oportunidades de promoción</strong></li>
          <li><strong>Percepciones de menor compromiso</strong></li>
          <li><strong>Presión para "demostrar" dedicación</strong></li>
        </ul>
      </div>
      
      <h3>💪 Estrategias de Supervivencia</h3>
      <p>Aunque no deberíamos tener que desarrollar estrategias especiales, la realidad requiere que las mujeres sean más estratégicas en su navegación profesional.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🛡️ Estrategias Defensivas</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Documenta todo:</strong> Mantén registros de logros y contribuciones</li>
          <li><strong>Busca mentores y patrocinadores:</strong> Tanto hombres como mujeres</li>
          <li><strong>Construye alianzas:</strong> Crea una red de apoyo sólida</li>
          <li><strong>Habla por ti misma:</strong> No asumas que otros reconocerán tu trabajo</li>
          <li><strong>Prepárate para la resistencia:</strong> Anticipa y planifica para desafíos</li>
        </ul>
      </div>
      
      <h3>🔄 Creando Cambio</h3>
      <p>Las mujeres no solo deben navegar el sistema actual, sino también trabajar para cambiarlo para las futuras generaciones.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">🌟 Estrategias de Cambio</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Sé visible:</strong> Participa en iniciativas de diversidad</li>
          <li><strong>Mentora a otras mujeres:</strong> Ayuda a la próxima generación</li>
          <li><strong>Habla sobre los problemas:</strong> Crea conciencia sobre los desafíos</li>
          <li><strong>Apoya políticas inclusivas:</strong> Aboga por cambios estructurales</li>
          <li><strong>Celebra el éxito femenino:</strong> Reconoce y amplifica los logros</li>
        </ul>
      </div>
      
      <h3>🤝 El Papel de los Hombres</h3>
      <p>Los hombres juegan un papel crucial en crear lugares de trabajo más equitativos. Como la mayoría de los líderes senior, su apoyo es esencial.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">👨‍💼 Cómo los Hombres Pueden Ayudar</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Reconocer sus privilegios:</strong> Entender las ventajas que tienen</li>
          <li><strong>Amplificar voces femeninas:</strong> Repetir y dar crédito a ideas de mujeres</li>
          <li><strong>Interrumpir sesgos:</strong> Señalar comentarios o comportamientos problemáticos</li>
          <li><strong>Patrocinar mujeres:</strong> Usar su influencia para promover talentos femeninos</li>
          <li><strong>Compartir oportunidades:</strong> Incluir mujeres en redes y eventos importantes</li>
        </ul>
      </div>
      
      <h3>🎯 Mirando Hacia Adelante</h3>
      <p>Aunque el progreso ha sido lento, cada generación de mujeres ha abierto más puertas para la siguiente. La clave es no desanimarse por los desafíos, sino usar esa energía para crear el cambio que queremos ver.</p>
      
      <p>La jungla corporativa sigue siendo desafiante, pero con estrategia, apoyo y determinación, las mujeres pueden no solo sobrevivir sino prosperar y transformar el paisaje para las que vienen detrás.</p>
    `,
      page_number: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-5",
      book_id: "3",
      chapter_number: 5,
      title: "¿Qué Harías Si No Tuvieras Miedo?",
      content: `
      <h2>Capítulo 5: ¿Qué Harías Si No Tuvieras Miedo?</h2>
      <p>Esta pregunta, que me hizo mi hermano hace muchos años, se ha convertido en mi mantra personal. El miedo es la raíz de tantas de las barreras que las mujeres enfrentan, tanto externas como internas.</p>
      
      <h3>😰 Los Miedos que Nos Limitan</h3>
      <p>Las mujeres enfrentan miedos únicos en sus carreras profesionales, muchos de los cuales están profundamente arraigados en expectativas sociales y experiencias pasadas.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">😨 Miedos Comunes de las Mujeres</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Miedo al fracaso:</strong> "¿Qué pasa si no soy lo suficientemente buena?"</li>
          <li><strong>Miedo al éxito:</strong> "¿Qué pasa si tengo éxito pero no le gusto a nadie?"</li>
          <li><strong>Miedo al juicio:</strong> "¿Qué pensarán otros de mis decisiones?"</li>
          <li><strong>Miedo a no ser perfecta:</strong> "Necesito saber todo antes de intentarlo"</li>
          <li><strong>Miedo al conflicto:</strong> "No quiero crear problemas o tensión"</li>
        </ul>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "El miedo es la raíz de tantas de las barreras que enfrentamos. Miedo al juicio, miedo al fracaso, miedo a no ser perfectas."
      </blockquote>
      
      <h3>🎭 El Perfeccionismo Como Barrera</h3>
      <p>Las mujeres a menudo sienten que necesitan ser perfectas antes de tomar riesgos o buscar oportunidades. Este perfeccionismo puede ser paralizante.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Las Trampas del Perfeccionismo</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Procrastinación:</strong> Esperar el momento "perfecto" que nunca llega</li>
          <li><strong>Sobrepreparación:</strong> Estudiar excesivamente en lugar de actuar</li>
          <li><strong>Autocrítica excesiva:</strong> Enfocarse en errores menores</li>
          <li><strong>Evitar riesgos:</strong> No intentar cosas donde podrías fallar</li>
          <li><strong>Burnout:</strong> Trabajar excesivamente para alcanzar estándares imposibles</li>
        </ul>
      </div>
      
      <h3>💪 Redefiniendo el Fracaso</h3>
      <p>Una de las claves para superar el miedo es cambiar nuestra relación con el fracaso. En lugar de verlo como algo que hay que evitar a toda costa, podemos verlo como una oportunidad de aprendizaje.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🌱 Lecciones del Fracaso</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Resiliencia:</strong> Cada fracaso construye tu capacidad de recuperación</li>
          <li><strong>Aprendizaje:</strong> Los errores proporcionan información valiosa</li>
          <li><strong>Humildad:</strong> El fracaso nos mantiene conectados con nuestra humanidad</li>
          <li><strong>Innovación:</strong> Los riesgos son necesarios para la creatividad</li>
          <li><strong>Autenticidad:</strong> Ser vulnerable nos hace más relacionables</li>
        </ul>
      </div>
      
      <h3>🚀 Tomando Riesgos Calculados</h3>
      <p>No se trata de ser imprudente, sino de tomar riesgos inteligentes y calculados. Las mujeres a menudo subestiman su capacidad para manejar los desafíos.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">📊 Marco para Tomar Riesgos</h4>
        <ol style="margin-bottom: 0;">
          <li><strong>Evalúa el peor escenario:</strong> ¿Qué es lo peor que podría pasar?</li>
          <li><strong>Considera el mejor escenario:</strong> ¿Cuál es el potencial positivo?</li>
          <li><strong>Identifica recursos:</strong> ¿Qué apoyo tienes disponible?</li>
          <li><strong>Crea un plan B:</strong> ¿Cómo te recuperarías si las cosas salen mal?</li>
          <li><strong>Establece un plazo:</strong> ¿Cuándo evaluarás el progreso?</li>
        </ol>
      </div>
      
      <h3>🗣️ Encontrando Tu Voz Auténtica</h3>
      <p>Muchas mujeres temen usar su voz porque han sido condicionadas a ser "agradables" y evitar el conflicto. Pero encontrar y usar tu voz auténtica es crucial para el liderazgo.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">🎤 Desarrollando Tu Voz</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Conoce tus valores:</strong> ¿Por qué cosas vale la pena luchar?</li>
          <li><strong>Practica en espacios seguros:</strong> Comienza con amigos y familia</li>
          <li><strong>Prepárate para la resistencia:</strong> No todos estarán de acuerdo contigo</li>
          <li><strong>Busca aliados:</strong> Encuentra personas que apoyen tu perspectiva</li>
          <li><strong>Sé consistente:</strong> Usa tu voz regularmente, no solo en crisis</li>
        </ul>
      </div>
      
      <h3>🌟 Ejercicios para Superar el Miedo</h3>
      <p>Superar el miedo requiere práctica deliberada. Aquí hay algunos ejercicios que pueden ayudar:</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">💪 Ejercicios Prácticos</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Escribe tus miedos:</strong> Ponlos en papel para examinarlos objetivamente</li>
          <li><strong>Visualiza el éxito:</strong> Imagina vívidamente lograr tus objetivos</li>
          <li><strong>Toma una acción pequeña:</strong> Da un paso pequeño hacia tu meta cada día</li>
          <li><strong>Celebra los intentos:</strong> Reconoce el coraje de intentar, no solo el éxito</li>
          <li><strong>Busca modelos a seguir:</strong> Estudia mujeres que han superado miedos similares</li>
        </ul>
      </div>
      
      <h3>🎯 La Pregunta Transformadora</h3>
      <p>Cuando enfrentes una decisión difícil o una oportunidad que te asusta, pregúntate: "¿Qué haría si no tuviera miedo?"</p>
      
      <p>Esta pregunta simple pero poderosa puede:</p>
      <ul>
        <li>Clarificar tus verdaderos deseos</li>
        <li>Revelar las barreras autoimpuestas</li>
        <li>Inspirarte a tomar acción</li>
        <li>Ayudarte a ver posibilidades que antes no considerabas</li>
        <li>Conectarte con tu coraje interior</li>
      </ul>
      
      <p>Recuerda: el coraje no es la ausencia de miedo, sino la acción a pesar del miedo. Cada vez que actúas a pesar de tus miedos, te vuelves un poco más valiente y un poco más libre.</p>
    `,
      page_number: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: "content-3-6",
      book_id: "3",
      chapter_number: 6,
      title: "Busca y Acepta Trabajos Desafiantes",
      content: `
      <h2>Capítulo 6: Busca y Acepta Trabajos Desafiantes</h2>
      <p>Una de las decisiones más importantes que puedes tomar en tu carrera es buscar activamente trabajos y asignaciones que te desafíen y te hagan crecer, incluso cuando no te sientes completamente preparada.</p>
      
      <h3>🎯 La Zona de Crecimiento</h3>
      <p>El crecimiento profesional real ocurre cuando sales de tu zona de confort y te enfrentas a desafíos que inicialmente parecen estar más allá de tus capacidades actuales.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🚀 Las Tres Zonas</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Zona de Confort:</strong> Tareas que puedes hacer fácilmente</li>
          <li><strong>Zona de Crecimiento:</strong> Desafíos que requieren nuevas habilidades</li>
          <li><strong>Zona de Pánico:</strong> Desafíos que están completamente fuera de alcance</li>
        </ul>
        <p style="margin-bottom: 0;"><strong>El objetivo es pasar más tiempo en la zona de crecimiento.</strong></p>
      </div>
      
      <blockquote style="border-left: 4px solid #8b5cf6; padding-left: 16px; margin: 24px 0; font-style: italic; color: #4b5563; background-color: #faf5ff; padding: 20px; border-radius: 8px;">
        "Si te ofrecen un asiento en un cohete, no preguntes qué asiento. Solo súbete."
      </blockquote>
      
      <h3>💼 Tipos de Trabajos Desafiantes</h3>
      <p>Los trabajos desafiantes vienen en muchas formas. La clave es reconocer las oportunidades cuando se presentan y tener el coraje de tomarlas.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">🌟 Oportunidades de Crecimiento</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Proyectos de alto perfil:</strong> Iniciativas visibles con impacto significativo</li>
          <li><strong>Roles internacionales:</strong> Asignaciones en diferentes países o culturas</li>
          <li><strong>Posiciones de turnaround:</strong> Trabajos que requieren arreglar problemas</li>
          <li><strong>Nuevas industrias:</strong> Oportunidades en sectores desconocidos</li>
          <li><strong>Roles de liderazgo:</strong> Posiciones con responsabilidad de equipo</li>
        </ul>
      </div>
      
      <h3>🚫 Superando la Autolimitación</h3>
      <p>Las mujeres a menudo se autolimitan al no postularse para trabajos para los cuales no cumplen todos los requisitos. Esta tendencia puede frenar significativamente el progreso profesional.</p>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #d97706; margin-top: 0;">⚠️ Patrones de Autolimitación</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>"No tengo suficiente experiencia"</strong></li>
          <li><strong>"No cumplo todos los requisitos"</strong></li>
          <li><strong>"Necesito más preparación"</strong></li>
          <li><strong>"¿Qué pasa si fallo?"</strong></li>
          <li><strong>"No soy la candidata obvia"</strong></li>
        </ul>
      </div>
      
      <h3>🎓 Aprender en el Trabajo</h3>
      <p>Muchas de las habilidades más valiosas se aprenden haciendo el trabajo, no preparándose para él. La experiencia práctica es a menudo más valiosa que la preparación teórica.</p>
      
      <div style="background-color: #fdf2f8; border: 1px solid #ec4899; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #be185d; margin-top: 0;">📚 Estrategias de Aprendizaje Rápido</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Busca mentores:</strong> Encuentra personas con experiencia relevante</li>
          <li><strong>Haz preguntas:</strong> No tengas miedo de admitir lo que no sabes</li>
          <li><strong>Observa y aprende:</strong> Estudia cómo otros manejan situaciones similares</li>
          <li><strong>Toma notas:</strong> Documenta lecciones aprendidas y mejores prácticas</li>
          <li><strong>Busca retroalimentación:</strong> Pide evaluaciones honestas regularmente</li>
        </ul>
      </div>
      
      <h3>🤝 Construyendo Redes de Apoyo</h3>
      <p>Los trabajos desafiantes son más manejables cuando tienes una red sólida de apoyo. Invierte tiempo en construir relaciones antes de necesitarlas.</p>
      
      <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h4 style="color: #0369a1; margin-top: 0;">🌐 Tipos de Apoyo Necesarios</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Mentores:</strong> Consejeros con experiencia y sabiduría</li>
          <li><strong>Patrocinadores:</strong> Personas influyentes que abogan por ti</li>
          <li><strong>Pares:</strong> Colegas en situaciones similares</li>
          <li><strong>Expertos técnicos:</strong> Especialistas en áreas específicas</li>
          <li><strong>Apoyo personal:</strong> Familia y amigos que te animan</li>
        </ul>
      </div>
      
      <h3>📈 Midiendo el Éxito</h3>
      <p>En trabajos desafiantes, es importante redefinir cómo mides el éxito. No siempre se trata de perfección, sino de progreso y aprendizaje.</p>
      
      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #15803d; margin-top: 0;">📊 Métricas de Éxito Alternativas</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>Habilidades desarrolladas:</strong> ¿Qué nuevas capacidades has ganado?</li>
          <li><strong>Relaciones construidas:</strong> ¿Qué conexiones valiosas has hecho?</li>
          <li><strong>Problemas resueltos:</strong> ¿Qué desafíos has superado?</li>
          <li><strong>Impacto creado:</strong> ¿Cómo has contribuido al éxito organizacional?</li>
          <li><strong>Confianza ganada:</strong> ¿Cómo ha crecido tu autoconfianza?</li>
        </ul>
      </div>
      
      <h3>⚖️ Equilibrando Riesgo y Recompensa</h3>
      <p>No todos los trabajos desafiantes son apropiados para todos los momentos. Es importante evaluar cuidadosamente el timing y las circunstancias.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h4 style="color: #dc2626; margin-top: 0;">🤔 Preguntas para Considerar</h4>
        <ul style="margin-bottom: 0;">
          <li><strong>¿Cuál es mi situación personal actual?</strong></li>
          <li><strong>¿Tengo el apoyo necesario en casa?</strong></li>
          <li><strong>¿Cuáles son las consecuencias del fracaso?</strong></li>
          <li><strong>¿Qué aprenderé incluso si no tengo éxito completo?</strong></li>
          <li><strong>¿Cómo encaja esto en mis objetivos a largo plazo?</strong></li>
        </ul>
      </div>
      
      <h3>🎯 Creando Tu Propia Suerte</h3>
      <p>Las oportunidades desafiantes no siempre llegan por sí solas. A menudo necesitas crearlas o buscarlas activamente.</p>
      
      <p><strong>Estrategias para crear oportunidades:</strong></p>
      <ul>
        <li>Voluntariarte para proyectos difíciles</li>
        <li>Proponer soluciones a problemas organizacionales</li>
        <li>Buscar asignaciones en áreas de crecimiento</li>
        <li>Expresar interés en roles de liderazgo</li>
        <li>Construir una reputación como solucionadora de problemas</li>
      </ul>
      
      <p>Recuerda: cada trabajo desafiante que aceptas no solo te hace más fuerte y más capaz, sino que también te posiciona para oportunidades aún mayores en el futuro. El crecimiento profesional es acumulativo, y cada riesgo calculado que tomas construye sobre el anterior.</p>
    `,
      page_number: 6,
      created_at: new Date().toISOString(),
    },
  ],
}

// Mock reading progress
const mockReadingProgress: ReadingProgress[] = [
  {
    id: "progress-1",
    user_id: "demo-user",
    book_id: "1",
    progress_percentage: 45,
    current_page: 2,
    last_read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
]

// Mock user stats
const mockUserStats: { [key: string]: UserStats } = {
  "demo-user": {
    user_id: "demo-user",
    points: 150,
    reading_streak: 3,
    longest_streak: 5,
    books_read: 1,
    total_reading_time: 360,
    achievements: [],
  },
}

// API Functions
export async function getBooks(): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBooks
}

export async function getBook(id: string): Promise<Book | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockBooks.find((book) => book.id === id) || null
}

export async function getBookContent(bookId: string): Promise<BookContent[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockBookContent[bookId] || []
}

export async function getReadingProgress(userId: string, bookId: string): Promise<ReadingProgress | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockReadingProgress.find((progress) => progress.user_id === userId && progress.book_id === bookId) || null
}

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  currentPage: number,
  progressPercentage: number,
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

export async function completeBook(userId: string, bookId: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // Update progress to 100%
    const book = mockBooks.find((b) => b.id === bookId)
    if (!book) return false

    await updateReadingProgress(userId, bookId, book.total_pages, 100)

    // Update user stats
    const userStats = mockUserStats[userId] || getDefaultUserStats(userId)
    userStats.points += 100
    userStats.books_read += 1
    mockUserStats[userId] = userStats

    return true
  } catch (error) {
    console.error("Error completing book:", error)
    return false
  }
}

export async function getReadingStats(userId: string): Promise<ReadingStats> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const userProgress = mockReadingProgress.filter((progress) => progress.user_id === userId)
  const completedBooks = userProgress.filter((progress) => progress.progress_percentage >= 100).length
  const averageProgress =
    userProgress.length > 0
      ? userProgress.reduce((sum, progress) => sum + progress.progress_percentage, 0) / userProgress.length
      : 0

  return {
    books_read: completedBooks,
    total_reading_time: completedBooks * 240,
    average_progress: Math.round(averageProgress),
    reading_streak: 7,
  }
}

export async function getUserStats(userId: string): Promise<UserStats> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockUserStats[userId] || getDefaultUserStats(userId)
}

export async function getCategories(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const categories = [...new Set(mockBooks.map((book) => book.category))]
  return categories
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockBooks.filter((book) => book.category === category)
}

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

function getDefaultUserStats(userId: string): UserStats {
  return {
    user_id: userId,
    points: 0,
    reading_streak: 0,
    longest_streak: 0,
    books_read: 0,
    total_reading_time: 0,
    achievements: [],
  }
}
