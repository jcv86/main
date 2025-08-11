"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Highlighter,
  MessageSquare,
  Play,
  Pause,
  Settings,
  Sun,
  Moon,
  Type,
  Palette,
} from "lucide-react"
import { LibraryService } from "@/lib/supabase-library"
import { BookContentService } from "@/lib/book-content"

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_image: string
  category: string
  difficulty: string
  estimated_reading_time: number
  total_pages: number
  isbn?: string
  publication_year?: number
  language: string
  rating: number
  total_ratings: number
}

interface Chapter {
  id: string
  book_id: string
  chapter_number: number
  title: string
  content: string
  word_count: number
  estimated_reading_time: number
}

interface ReadingSettings {
  fontSize: number
  fontFamily: string
  theme: "light" | "dark" | "sepia"
  lineHeight: number
}

interface Note {
  id: string
  text: string
  position: number
  timestamp: Date
}

interface Highlight {
  id: string
  text: string
  color: string
  position: number
  timestamp: Date
}

export default function BookReader() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  // State
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [newNote, setNewNote] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 16,
    fontFamily: "serif",
    theme: "light",
    lineHeight: 1.6,
  })

  // Load book data
  useEffect(() => {
    async function loadBook() {
      try {
        setLoading(true)

        // Get book details
        const bookData = await LibraryService.getBookById(bookId)
        if (!bookData) {
          setError("Libro no encontrado")
          return
        }
        setBook(bookData)

        // Get chapters
        const chaptersData = await LibraryService.getBookChapters(bookId)

        // If no chapters in database, use hardcoded content for Atomic Habits
        if (chaptersData.length === 0 && bookId === "550e8400-e29b-41d4-a716-446655440001") {
          const atomicHabitsChapters = [
            {
              id: "intro",
              book_id: bookId,
              chapter_number: 0,
              title: "Introducción",
              content: `Mi historia comienza en el segundo año de preparatoria. Era un día de octubre normal cuando me dirigía al entrenamiento de béisbol. Mientras caminaba hacia el campo, un compañero de clase accidentalmente me golpeó en la cara con un bate de béisbol. No recuerdo el momento del impacto. El bate me golpeó directamente entre los ojos y me fracturó la nariz en dos lugares. El hueso de mi nariz se desplazó tanto que tuvieron que realinear mi tabique nasal. Para cuando llegué al hospital, mi cara se había hinchado como un globo. Pasé esa noche en el hospital y no regresé a la escuela durante una semana.

Fue el comienzo de un viaje que cambiaría mi vida. Durante los siguientes meses, mientras me recuperaba, comencé a desarrollar pequeños hábitos que eventualmente transformarían mi salud, mi trabajo y mi vida. Este libro es sobre el poder de los pequeños hábitos.

Los hábitos son el interés compuesto del auto-mejoramiento. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican mientras los repites. Parecen hacer poca diferencia en un día dado y sin embargo el impacto que entregan a lo largo de los meses y años puede ser enorme. Es solo cuando miramos hacia atrás dos, cinco o quizás diez años después que el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente aparente.

Desafortunadamente, el lento ritmo de transformación también hace que sea fácil dejar que un mal hábito se deslice. Si comes una hamburguesa poco saludable hoy, la báscula no se moverá mucho. Si trabajas hasta tarde esta noche e ignoras a tu familia, ellos te perdonarán. Si pospones tu proyecto por un día más, siempre habrá mañana. Un solo error es fácil de descartar.

Pero cuando repetimos errores del 1 por ciento día tras día, replicando decisiones pobres, duplicando pequeños errores y racionalizando pequeñas excusas, nuestras pequeñas elecciones se combinan en resultados tóxicos. Es la acumulación de muchos pasos en falso, un 1 por ciento de declive aquí y allá, lo que eventualmente lleva a un problema.

Los hábitos pueden ser un arma de doble filo. Pueden trabajar para ti o contra ti, razón por la cual entender los detalles es esencial. Los pequeños cambios a menudo parecen no hacer diferencia hasta que cruzas un umbral crítico. Los resultados más poderosos de cualquier sistema compuesto se retrasan. Necesitas ser paciente.

Un bambú chino apenas crece en sus primeros cinco años. Durante este tiempo, todo el crecimiento ocurre bajo tierra en un extenso sistema de raíces que se extiende vertical y horizontalmente por la tierra. Luego, al final del quinto año, el bambú chino crece hasta noventa pies en seis semanas.

Muchas personas piensan que no están progresando porque no pueden ver resultados inmediatos. Pero el trabajo no se desperdicia. Simplemente se está almacenando. Todo el trabajo previo está siendo preparado para ser liberado. Los hábitos a menudo no parecen hacer diferencia hasta que cruzas un umbral crítico y desbloqueas un nuevo nivel de rendimiento. En los primeros y segundos años de cualquier búsqueda, a menudo hay un Valle de Decepción donde las personas se sienten desanimadas después de poner trabajo y no ver resultados inmediatos. Sin embargo, este trabajo no se desperdicia.

Si quieres mejores resultados, entonces olvídate de establecer metas. Enfócate en tu sistema en su lugar.

¿Cuál es la diferencia entre sistemas y metas? Es una distinción que hago a menudo pero que vale la pena repetir: Las metas son sobre los resultados que quieres lograr. Los sistemas son sobre los procesos que llevan a esos resultados.

Si eres entrenador, tu meta podría ser ganar un campeonato. Tu sistema es la forma en que reclutes jugadores, manejes a tus asistentes y conduzcas la práctica.

Si eres emprendedor, tu meta podría ser construir un negocio de un millón de dólares. Tu sistema es cómo pruebas ideas de productos, contratas empleados y ejecutas campañas de marketing.

Si eres músico, tu meta podría ser tocar una nueva pieza. Tu sistema es la frecuencia con la que practicas, cómo desglosas y abordas piezas difíciles, y tu método para recibir retroalimentación de tu instructor.

Ahora por la pregunta interesante: Si ignoras completamente tus metas y te enfocas solo en tu sistema, ¿aún tendrías éxito? Creo que sí.

Los problemas surgen cuando pasas demasiado tiempo pensando en tus metas y no suficiente tiempo diseñando tus sistemas. ¿Cuáles son algunos de los problemas con un enfoque de metas primero?

Problema #1: Los ganadores y perdedores tienen las mismas metas.
Problema #2: Lograr una meta es solo un cambio momentáneo.
Problema #3: Las metas restringen tu felicidad.
Problema #4: Las metas están en desacuerdo con el progreso a largo plazo.

Ninguna de estas críticas pretende sugerir que las metas son inútiles. Sin embargo, he encontrado que las metas son buenas para establecer una dirección, pero los sistemas son mejores para hacer progreso real. Un puñado de problemas surgen cuando pasas demasiado tiempo pensando en tus metas y no suficiente tiempo diseñando tus sistemas.`,
              word_count: 1200,
              estimated_reading_time: 6,
            },
            {
              id: "chapter-1",
              book_id: bookId,
              chapter_number: 1,
              title: "El Sorprendente Poder de los Hábitos Atómicos",
              content: `Es muy fácil sobrestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente. Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere acción masiva. Ya sea perdiendo peso, construyendo un negocio, escribiendo un libro, ganando un campeonato, o logrando cualquier otra meta, nos presionamos para hacer alguna mejora que capture la atención de todos.

Mientras tanto, mejorar en un 1 por ciento no es particularmente notable, a veces ni siquiera es perceptible, pero puede ser mucho más significativo, especialmente a largo plazo. La diferencia que puede hacer una pequeña mejora con el tiempo es asombrosa. Así es como funciona la matemática: si puedes mejorar un 1 por ciento cada día durante un año, terminarás treinta y siete veces mejor al final. Por el contrario, si empeoras un 1 por ciento cada día durante un año, caerás casi a cero. Lo que comienza como una pequeña ganancia o una pérdida menor se acumula en algo mucho más.

Los hábitos son el interés compuesto del auto-mejoramiento. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican mientras los repites. Parecen hacer poca diferencia en un día dado y sin embargo el impacto que entregan a lo largo de los meses y años puede ser enorme. Es solo cuando miramos hacia atrás dos, cinco o quizás diez años después que el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente aparente.

Esto puede ser un concepto difícil de apreciar en la vida diaria. A menudo descartamos los pequeños cambios porque no parecen importar mucho en el momento. Si ahorras un poco de dinero ahora, sigues sin ser millonario. Si vas al gimnasio tres días seguidos, sigues fuera de forma. Si estudias mandarín durante una hora esta noche, aún no hablas el idioma. Hacemos algunos cambios, pero los resultados nunca parecen llegar rápidamente y así volvemos a nuestras viejas rutinas.

Desafortunadamente, el lento ritmo de transformación también hace que sea fácil dejar que un mal hábito se deslice. Si comes una hamburguesa poco saludable hoy, la báscula no se moverá mucho. Si trabajas hasta tarde esta noche e ignoras a tu familia, ellos te perdonarán. Si pospones tu proyecto por un día más, siempre habrá mañana. Un solo error es fácil de descartar.

Pero cuando repetimos errores del 1 por ciento día tras día, replicando decisiones pobres, duplicando pequeños errores y racionalizando pequeñas excusas, nuestras pequeñas elecciones se combinan en resultados tóxicos. Es la acumulación de muchos pasos en falso, un 1 por ciento de declive aquí y allá, lo que eventualmente lleva a un problema.

La historia del equipo de ciclismo británico ilustra perfectamente este punto. En 2003, el equipo de ciclismo de Gran Bretaña contrató a Dave Brailsford como su nuevo director de rendimiento. En ese momento, los ciclistas profesionales británicos habían sufrido casi cien años de mediocridad. Desde 1908, los ciclistas británicos habían ganado solo una medalla de oro olímpica y nunca habían ganado el Tour de Francia.

Brailsford tenía un enfoque diferente. Creía en un concepto que él se refería como la agregación de ganancias marginales. Su filosofía era simple: si desglosas todo lo que puedas pensar que va en el ciclismo y luego mejoras cada elemento en solo un 1 por ciento, obtendrás un aumento significativo cuando pongas todo junto.

Brailsford y su equipo comenzaron haciendo los pequeños ajustes que podrías esperar de un equipo de ciclismo de clase mundial. Optimizaron la nutrición de los ciclistas y sus programas de entrenamiento. Contrataron cirujanos para enseñar a los ciclistas la forma adecuada de lavarse las manos para reducir las posibilidades de contraer una enfermedad. Determinaron el tipo de almohada y colchón que llevaba al mejor sueño nocturno para cada ciclista.

Pero no se detuvieron ahí. Brailsford y su equipo continuaron encontrando mejoras del 1 por ciento en áreas que pasaban desapercibidas por casi todos los demás. Probaron diferentes tipos de aceites de masaje para ver cuál llevaba a la recuperación muscular más rápida. Contrataron un cirujano para enseñar a cada ciclista la mejor manera de lavarse las manos para reducir las posibilidades de contraer un resfriado. Determinaron el tipo de almohada y colchón que llevaba al mejor sueño nocturno para cada ciclista. Incluso pintaron el interior del camión del equipo de blanco, lo que les ayudó a detectar pequeñas partículas de polvo que normalmente pasarían desapercibidas pero podrían degradar el rendimiento de las bicicletas finamente ajustadas.

Como Brailsford puso: Había tantas cosas que pasaban por alto. Y agregando todas estas pequeñas mejoras, tuviste un efecto significativo.

Solo cinco años después de que Brailsford tomara el control del equipo de ciclismo británico, dominaron los eventos de ciclismo en carretera y pista en los Juegos Olímpicos de 2008 en Beijing, donde ganaron un 60 por ciento de las medallas de oro disponibles. Cuatro años después, cuando llegaron los Juegos Olímpicos de Londres de 2012, los británicos establecieron nueve récords olímpicos y siete récords mundiales.

Ese mismo año, Bradley Wiggins se convirtió en el primer ciclista británico en ganar el Tour de Francia. Al año siguiente, su compañero de equipo Chris Froome ganó la carrera, y lo haría de nuevo en 2015, 2016 y 2017, dando a los ciclistas británicos cinco victorias en el Tour de Francia en seis años.

Durante una década de diez años, los ciclistas británicos ganaron 178 campeonatos mundiales y sesenta y seis récords olímpicos o mundiales y capturaron cinco victorias en el Tour de Francia en lo que es la carrera más exitosa en la historia del ciclismo moderno británico.

¿Cómo sucede esto? ¿Cómo mejoras drásticamente en solo unos años después de décadas de mediocridad? ¿Por qué las pequeñas mejoras se acumulan en resultados notables, y cómo puedes replicar este enfoque en tu propia vida?

Es fácil sobrestimar la importancia de cualquier evento único y subestimar el valor de hacer mejoras pequeñas diariamente. Demasiado a menudo, nos convencemos de que el éxito masivo requiere acción masiva.

Mientras tanto, mejorar en un 1 por ciento no es particularmente notable, a veces ni siquiera es perceptible, pero puede ser mucho más significativo, especialmente a largo plazo.`,
              word_count: 1400,
              estimated_reading_time: 7,
            },
            {
              id: "chapter-2",
              book_id: bookId,
              chapter_number: 2,
              title: "Cómo Tus Hábitos Moldean Tu Identidad (y Viceversa)",
              content: `¿Por qué es tan fácil repetir malos hábitos y tan difícil formar buenos? Pocas cosas pueden tener un impacto más poderoso en tu vida que mejorar tus hábitos diarios. Y sin embargo es probable que este tiempo el próximo año estarás haciendo las mismas cosas que estás haciendo hoy.

¿Por qué es tan difícil cambiar nuestros hábitos? Tratamos de cambiar las cosas equivocadas. Para entender lo que quiero decir, considera que hay tres niveles en los que puede ocurrir el cambio. Puedes imaginar estos como las capas de una cebolla.

La primera capa es cambiar tus resultados. Este nivel se preocupa por cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que estableces están asociadas con este nivel de cambio.

La segunda capa es cambiar tu proceso. Este nivel se preocupa por cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, decluttering tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están asociados con este nivel.

La tercera y más profunda capa es cambiar tu identidad. Este nivel se preocupa por cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros. La mayoría de las creencias, suposiciones y sesgos que tienes están asociados con este nivel.

Los resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees. Cuando se trata de construir hábitos duraderos, estos niveles son importantes, pero no igualmente importantes. El cambio de comportamiento puede suceder en cualquiera de estos tres niveles, y aquí está el problema: la mayoría de las personas comienzan con lo que quieren lograr. Esto nos lleva naturalmente al cambio basado en resultados.

Oye, quiero estar en forma, entonces necesito correr un maratón.
Oye, quiero ser mejor escritor, entonces necesito escribir un libro.
Oye, quiero ser más relajado, entonces necesito meditar más.

Imagina dos personas resistiendo un cigarrillo. Cuando se les ofrece un humo, la primera persona dice: No gracias. Estoy tratando de dejar de fumar. Suena como una respuesta razonable, pero esta persona aún cree que es un fumador que está tratando de ser algo más. Están esperando que su comportamiento cambie mientras se aferran a la misma creencia.

La segunda persona declina diciendo: No gracias. No soy fumador. Es una pequeña diferencia, pero esta declaración señala un cambio en la identidad. Fumar era parte de su vida anterior, no su vida actual. Ya no se ven a sí mismos como alguien que fuma.

La mayoría de las personas ni siquiera consideran el cambio de identidad cuando se proponen mejorar. Solo piensan: Quiero ser delgado o Quiero ser fuerte o Quiero ser inteligente. Todas estas son metas basadas en resultados. El otro enfoque es construir hábitos basados en identidad. Con este enfoque, comenzamos con quién deseamos convertirnos.

Imagina cómo podríamos aplicar esto a nuestros hábitos:

El objetivo no es leer un libro, el objetivo es convertirse en lector.
El objetivo no es correr un maratón, el objetivo es convertirse en corredor.
El objetivo no es aprender un instrumento, el objetivo es convertirse en músico.

Tus comportamientos son usualmente un reflejo de tu identidad. Lo que haces es una indicación del tipo de persona que crees que eres, ya sea consciente o inconscientemente. La investigación ha demostrado que una vez que una persona cree en un aspecto particular de su identidad, estará motivada para actuar de maneras que sean consistentes con esa creencia. Por ejemplo, las personas que se identificaron como siendo alguien que vota tienen más probabilidades de votar que aquellos que simplemente afirman que votar es importante para ellos.

Es una simple forma de dos pasos:

Decide el tipo de persona que quieres ser.
Pruébatelo a ti mismo con pequeñas victorias.

Primero, decide quién quieres ser. Esto se mantiene en cualquier nivel, desde un solo hábito hasta un cambio de vida completo. ¿Quieres ser alguien que está en forma? ¿Quieres ser alguien que es bueno en los negocios? ¿Quieres ser alguien que es un gran padre o madre?

Una vez que tengas un control de el tipo de persona que quieres ser, puedes comenzar a dar pequeños pasos para reforzar tu identidad deseada. Tengo un amigo que perdió más de 100 libras preguntándose: ¿Qué haría una persona saludable? Durante todo el día, usaría esta pregunta como guía. ¿Tomaría una persona saludable un paseo o vería otro episodio en Netflix? ¿Ordenaría una persona saludable una hamburguesa o una ensalada? ¿Se quedaría despierta una persona saludable hasta tarde o se iría a la cama temprano? Pronto, comenzó a comer más saludable, hacer ejercicio más a menudo, y dormir mejor. Eventualmente, perdió el peso.

Su enfoque fue simple. No se enfocó en perder peso. Se enfocó en convertirse en el tipo de persona que vive un estilo de vida saludable. Cambió su identidad primero, y sus hábitos siguieron.

La mayoría de las personas no tienen claro sobre el tipo de persona que quieren ser. Como resultado, permanecen atascados en el mismo patrón durante años. Cambian sus hábitos pero no cambian las creencias subyacentes que llevaron a sus comportamientos pasados. Tienen el resultado correcto por las razones equivocadas.

El cambio de identidad es el Santo Grial del cambio de hábito. La razón es simple. Es difícil cambiar tus hábitos si nunca cambias las creencias subyacentes que llevaron a tu comportamiento pasado. Tienes una nueva meta y un nuevo plan, pero no te has convertido en una nueva persona.

Detrás de cada sistema de acciones hay un sistema de creencias. El sistema de una democracia está fundado en creencias como la libertad, el estado de derecho, y los derechos sociales. El sistema de una dictadura tiene un conjunto muy diferente de creencias como la autoridad absoluta y la estricta obediencia. Puedes imaginar muchos formas de tratar de hacer que una democracia actúe como una dictadura, pero tales esfuerzos no durarán mucho. Tarde o temprano, el sistema subyacente de creencias ganará.

Lo mismo es cierto para los individuos. Puedes querer mejores hábitos, pero si empacas las mismas creencias sobre ti mismo, entonces es difícil cambiar. Tienes una nueva meta y un nuevo plan, pero no te has convertido en una nueva persona.

El proceso de construir hábitos es en realidad el proceso de convertirse en ti mismo. Esto es una de las razones más importantes por las que es crucial vincular tus hábitos a tu identidad en lugar de enfocarte solo en los resultados.

Las mejoras son solo temporales hasta que se convierten en parte de quién eres.

El objetivo no es leer un libro, el objetivo es convertirse en lector.
El objetivo no es correr un maratón, el objetivo es convertirse en corredor.
El objetivo no es aprender un instrumento, el objetivo es convertirse en músico.

Cada acción que tomas es un voto por el tipo de persona que deseas convertirte. Ninguna instancia única transformará tus creencias, pero a medida que los votos se acumulan, también lo hace la evidencia de tu nueva identidad. Esta es una de las razones por las que el cambio significativo no requiere cambios radicales. Los pequeños hábitos pueden hacer una diferencia significativa al proporcionar evidencia de una nueva identidad. Y si un cambio es significativo, en realidad no importa si es grande o pequeño. Lo que importa es que esté llevando a la persona que deseas convertirte.

Esto trae una pregunta importante: Si tus creencias y visión del mundo juegan un papel tan importante en tu comportamiento, ¿de dónde vienen en primer lugar? ¿Cómo, exactamente, se forma tu identidad? Y lo más importante, ¿cómo puedes enfatizar nuevos aspectos de tu identidad que sirvan a tus objetivos?

Tu identidad emerge de tus hábitos. No naces con creencias preestablecidas. Cada creencia, incluyendo aquellas sobre ti mismo, se aprende y se condiciona a través de la experiencia.

Más precisamente, tus hábitos son cómo encarnas tu identidad. Cuando haces tu cama cada mañana, encarnas la identidad de una persona organizada. Cuando escribes cada día, encarnas la identidad de una persona creativa. Cuando entrenas cada día, encarnas la identidad de una persona atlética.

Cuanto más repites un comportamiento, más refuerzas la identidad asociada con ese comportamiento. De hecho, la palabra identidad originalmente se derivó de las palabras latinas essentitas, que significa ser, e identidem, que significa repetidamente. Tu identidad es literalmente tus hábitos repetidos.

Cualquiera que sea tu identidad ahora, solo crees en ella porque tienes prueba de ello. Si vas a la iglesia cada domingo durante veinte años, tienes evidencia de que eres religioso. Si estudias biología durante una hora cada noche, tienes evidencia de que eres estudioso. Si vas al gimnasio incluso cuando es nevado, tienes evidencia de que estás comprometido con el fitness. Cuanto más evidencia tengas para una creencia, más fuertemente la creerás.

Por esta razón, el proceso de construir hábitos es en realidad el proceso de convertirse en ti mismo. Esto es una de las razones más importantes por las que es crucial vincular tus hábitos a tu identidad en lugar de enfocarte solo en los resultados.

Las mejoras son solo temporales hasta que se convierten en parte de quién eres.`,
              word_count: 1800,
              estimated_reading_time: 9,
            },
            {
              id: "chapter-3",
              book_id: bookId,
              chapter_number: 3,
              title: "Cómo Construir Mejores Hábitos en 4 Simples Pasos",
              content: `En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que cambiaría la forma en que pensamos sobre cómo se forman los hábitos. Thorndike estaba interesado en estudiar el comportamiento animal, y comenzó trabajando con gatos. Colocaría cada gato dentro de un dispositivo conocido como una caja de rompecabezas. La caja estaba diseñada para que el gato pudiera escapar a través de una serie de acciones como tirar de una palanca, presionar un pedal, y tirar de una cuerda en una secuencia particular. Una vez fuera, el gato sería recompensado con un pedazo de pescado.

Al principio, los gatos se movían alrededor frenéticamente, arañando y mordiendo en las barras de la caja, pegando sus patas a través de las aberturas, empujando y tirando de cualquier cosa dentro de su alcance. Después de unos minutos de lucha desesperada, accidentalmente presionarían la palanca correcta, la puerta se abriría, y escaparían para comer su recompensa.

Thorndike rastreó el comportamiento de cada gato a lo largo del tiempo. En las primeras pruebas, los animales se movían alrededor de la caja al azar. Pero tan pronto como la palanca había sido presionada y la puerta se abría, el proceso de aprendizaje comenzaba. Gradualmente, cada gato aprendió a asociar la acción de presionar la palanca con la recompensa de escapar de la caja y obtener el pescado.

Después de veinte a treinta intentos, este proceso se volvió automático. Los gatos podrían escapar dentro de unos pocos segundos. Por ejemplo, un gato, que Thorndike llamó Gato 12, escapó de su primera caja de rompecabezas en cinco minutos. Después de solo cuarenta intentos, Gato 12 podía escapar en menos de diez segundos. Durante el curso del experimento, cada gato aprendió a escapar más y más rápido.

De sus estudios, Thorndike describió lo que él llamó la Ley del Efecto: Los comportamientos seguidos por consecuencias satisfactorias tienden a repetirse y aquellos que producen consecuencias desagradables son menos propensos a repetirse.

Su trabajo proporcionó la base científica para lo que conocemos sobre cómo se forman los hábitos y por qué persisten. Creó un mapa de lo que los científicos se refieren como el bucle del hábito.

El bucle del hábito es un bucle neurológico de cuatro pasos que gobierna cualquier hábito. Este bucle, que incluye una señal, un anhelo, una respuesta, y una recompensa, es la columna vertebral de cada hábito, y tu cerebro ejecuta este bucle cada vez que encuentras un hábito.

La señal desencadena tu cerebro para iniciar un comportamiento. Es un poco de información que predice una recompensa. Nuestros ancestros prehistóricos prestaban atención a señales que señalaban la ubicación de recompensas primarias como comida, agua, y sexo. Hoy, pasamos la mayoría de nuestro tiempo aprendiendo señales que predicen recompensas secundarias como dinero y fama, poder y estatus, elogio y aprobación, amor y amistad, o una sensación de satisfacción personal. (Por supuesto, estas búsquedas también se conectan indirectamente a nuestros deseos primitivos.) Tu mente está continuamente analizando tu entorno interno y externo en busca de pistas sobre dónde están ubicadas las recompensas.

Los anhelos son la segunda etapa del bucle del hábito, y son la fuerza motivacional detrás de cada hábito. Sin algún nivel de motivación o deseo, sin anhelar un cambio, no tenemos razón para actuar. Lo que anhelas no es el hábito en sí, sino el cambio de estado que entrega. No anhelas fumar un cigarrillo, anhelas la sensación de alivio que proporciona. No estás motivado por cepillarte los dientes, estás motivado por la sensación de una boca limpia. No quieres encender la televisión, quieres ser entretenido. Cada anhelo está vinculado a un deseo de cambiar tu estado interno. Esto es una distinción importante. Los anhelos difieren de persona a persona. En teoría, cualquier pedazo de información podría desencadenar un anhelo, pero en la práctica, las personas no están motivadas por las mismas señales. Para un jugador, el sonido de las máquinas tragamonedas puede ser un poderoso desencadenante que despierta un intenso anhelo de jugar. Para alguien que rara vez juega, los jingles y chimes del casino son solo ruido de fondo. Las señales no tienen significado hasta que son interpretadas. Los pensamientos, sentimientos, y emociones del observador son lo que transforma una señal en un anhelo.

La tercera etapa es la respuesta. La respuesta es el hábito real que realizas, que puede tomar la forma de un pensamiento o una acción. Si una respuesta requiere más esfuerzo físico o mental del que estás dispuesto o capaz de expender, no sucederá. Tu respuesta también depende de tu capacidad. Suena obvio, pero un hábito solo puede ocurrir si eres capaz de hacerlo. Si quieres hacer una clavada de baloncesto pero solo mides cinco pies y seis pulgadas, bueno, buena suerte. Mientras tanto, si tu teléfono está en la otra habitación, es poco probable que revises Instagram cada pocos minutos.

Finalmente, la respuesta entrega una recompensa. Las recompensas son el objetivo final de cada hábito. La señal es sobre notar la recompensa. El anhelo es sobre querer la recompensa. La respuesta es sobre obtener la recompensa. Perseguimos recompensas porque sirven dos propósitos: (1) nos satisfacen y (2) nos enseñan.

El primer propósito de las recompensas es satisfacer tu anhelo. Sí, las recompensas proporcionan beneficios por sí mismas. La comida y el agua entregan la energía que necesitas para sobrevivir. Obtener una promoción trae más dinero y respeto. Ponerse en forma mejora tu salud y tus perspectivas de apareamiento. Pero el beneficio más inmediato es que las recompensas satisfacen tu anhelo de comer o ganar estatus o ganar aprobación. Al menos por un momento, las recompensas entregan satisfacción y alivio del anhelo.

Segundo, las recompensas nos enseñan qué acciones vale la pena recordar en el futuro. Tu cerebro es un detector de recompensas. Mientras navegas por la vida, tu sistema nervioso está monitoreando continuamente qué acciones satisfacen tus deseos y entregan placer. Los sentimientos de placer y decepción son parte del mecanismo de retroalimentación que ayuda a tu cerebro a distinguir acciones útiles de las inútiles. Las recompensas cierran el bucle y completan el ciclo del hábito.

Si un comportamiento es insuficiente en cualquiera de las cuatro etapas, no se convertirá en un hábito. Elimina la señal y tu hábito nunca comenzará. Reduce el anhelo y no tendrás suficiente motivación para actuar. Haz el comportamiento difícil y no podrás hacerlo. Y si la recompensa falla en satisfacer tu deseo, entonces no tendrás razón para hacerlo de nuevo en el futuro. Sin las primeras tres etapas, un comportamiento no ocurrirá. Sin las cuatro, un comportamiento no se repetirá.

En resumen, la señal desencadena un anhelo, que motiva una respuesta, que proporciona una recompensa, que satisface el anhelo y, en última instancia, se asocia con la señal. Juntos, estos cuatro pasos forman un bucle neurológico, señal, anhelo, respuesta, recompensa; señal, anhelo, respuesta, recompensa, que en última instancia te permite crear hábitos automáticos. Este ciclo se conoce como el bucle del hábito.

Podemos dividir estas cuatro etapas en dos fases: la fase del problema y la fase de la solución. La fase del problema incluye la señal y el anhelo, y es cuando te das cuenta de que algo necesita cambiar. La fase de la solución incluye la respuesta y la recompensa, y es cuando tomas acción y logras el cambio que deseas.

Todas las conductas están impulsadas por el deseo de resolver un problema. A veces el problema es que notas algo bueno y quieres obtenerlo. A veces el problema es que estás experimentando dolor y quieres aliviarlo. De cualquier manera, el propósito de cada hábito es resolver los problemas que enfrentas.

En los siguientes capítulos, veremos cada etapa del bucle del hábito y discutiremos cómo puedes usarlas para construir mejores hábitos. Por ahora, lo importante a entender es que cada hábito está impulsado por el mismo bucle subyacente pero cada persona tiene un conjunto diferente de hábitos. La razón es que cada individuo tiene un conjunto diferente de señales, anhelos, y recompensas que han sido condicionados por su experiencia única. Como resultado, no es la naturaleza de la señal que importa, sino cómo la interpretas. La señal para comprar una nueva televisión podría ser ver un comercial, pero también podría ser caminar por la sección de electrónicos, hablar con un amigo sobre la última tecnología, o notar que tu televisión actual no funciona bien. O considera el hábito de hacer ejercicio. La señal podría ser despertarse, terminar una llamada de trabajo, notar que es 5 p.m., o ponerse tu ropa de gimnasio. El anhelo podría ser reducir el estrés, socializar con amigos, demostrar tu disciplina, o encajar en un grupo. La respuesta podría ser levantar pesas, correr tres millas, hacer algunos estiramientos, o llamar a tu entrenador personal. La recompensa podría ser la sensación de logro que obtienes de completar el entrenamiento, la liberación de endorfinas de hacer ejercicio, la satisfacción de registrar el entrenamiento, o los elogios que recibes de otros por hacer ejercicio. La señal, anhelo, respuesta, y recompensa pueden diferir, pero los cuatro pasos siempre están presentes.

Las Cuatro Leyes del Cambio de Comportamiento son un conjunto simple de reglas que podemos usar para construir mejores hábitos. Son (1) hacerlo obvio, (2) hacerlo atractivo, (3) hacerlo fácil, y (4) hacerlo satisfactorio.

Cómo Crear un Buen Hábito
La 1ª ley (Señal): Hacerlo obvio.
La 2ª ley (Anhelo): Hacerlo atractivo.
La 3ª ley (Respuesta): Hacerlo fácil.
La 4ª ley (Recompensa): Hacerlo satisfactorio.

Podemos invertir estas leyes para aprender cómo romper un mal hábito.

Cómo Romper un Mal Hábito
Inversión de la 1ª ley (Señal): Hacerlo invisible.
Inversión de la 2ª ley (Anhelo): Hacerlo poco atractivo.
Inversión de la 3ª ley (Respuesta): Hacerlo difícil.
Inversión de la 4ª ley (Recompensa): Hacerlo insatisfactorio.

Sería irresponsable afirmar que estas cuatro leyes son una solución exhaustiva para cada problema relacionado con los hábitos, pero creo que proporcionan un marco útil para pensar sobre los hábitos. Como verás a lo largo de este libro, las Cuatro Leyes del Cambio de Comportamiento se aplican a casi todos los campos, desde los deportes hasta la política, desde el arte hasta la medicina, desde la comedia hasta la gestión.

Cada vez que quieras cambiar tu comportamiento, puedes simplemente preguntarte:

1. ¿Cómo puedo hacerlo obvio?
2. ¿Cómo puedo hacerlo atractivo?
3. ¿Cómo puedo hacerlo fácil?
4. ¿Cómo puedo hacerlo satisfactorio?

Si alguna vez estás luchando para adherirte a un buen hábito o necesitas romper un mal hábito, puedes regresar a estas preguntas y encontrar una nueva solución.`,
              word_count: 2200,
              estimated_reading_time: 11,
            },
          ]
          setChapters(atomicHabitsChapters)
        } else {
          setChapters(chaptersData)
        }
      } catch (err) {
        console.error("Error loading book:", err)
        setError("Error al cargar el libro")
      } finally {
        setLoading(false)
      }
    }

    if (bookId) {
      loadBook()
    }
  }, [bookId])

  // Calculate reading progress
  useEffect(() => {
    if (chapters.length > 0) {
      const progress = ((currentChapterIndex + 1) / chapters.length) * 100
      setReadingProgress(progress)
    }
  }, [currentChapterIndex, chapters.length])

  // Text-to-speech functionality
  const toggleTTS = () => {
    if (isPlaying) {
      speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      const currentChapter = chapters[currentChapterIndex]
      if (currentChapter) {
        const utterance = new SpeechSynthesisUtterance(currentChapter.content)
        utterance.rate = 0.8
        utterance.onend = () => setIsPlaying(false)
        speechSynthesis.speak(utterance)
        setIsPlaying(true)
      }
    }
  }

  // Navigation functions
  const goToPreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1)
    }
  }

  const goToNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1)
    }
  }

  // Note and highlight functions
  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        text: newNote,
        position: currentChapterIndex,
        timestamp: new Date(),
      }
      setNotes([...notes, note])
      setNewNote("")
    }
  }

  const addHighlight = (text: string, color: string) => {
    const highlight: Highlight = {
      id: Date.now().toString(),
      text,
      color,
      position: currentChapterIndex,
      timestamp: new Date(),
    }
    setHighlights([...highlights, highlight])
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Cargando libro...</p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">{error || "Libro no encontrado"}</p>
          <Button onClick={() => router.push("/library")}>Volver a la Biblioteca</Button>
        </div>
      </div>
    )
  }

  const currentChapter = chapters[currentChapterIndex]
  const readingTime = currentChapter ? BookContentService.calculateReadingTime(currentChapter.content) : 0

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        settings.theme === "dark"
          ? "bg-gray-900 text-white"
          : settings.theme === "sepia"
            ? "bg-amber-50 text-amber-900"
            : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/library")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Biblioteca
              </Button>
              <div>
                <h1 className="font-semibold text-lg">{book.title}</h1>
                <p className="text-sm text-muted-foreground">por {book.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Reading Settings */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuración de Lectura</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium">Tamaño de Fuente</label>
                      <div className="flex items-center gap-2 mt-2">
                        <Type className="h-4 w-4" />
                        <input
                          type="range"
                          min="12"
                          max="24"
                          value={settings.fontSize}
                          onChange={(e) => setSettings({ ...settings, fontSize: Number.parseInt(e.target.value) })}
                          className="flex-1"
                        />
                        <span className="text-sm w-8">{settings.fontSize}px</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Tema</label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={settings.theme === "light" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSettings({ ...settings, theme: "light" })}
                        >
                          <Sun className="h-4 w-4 mr-1" />
                          Claro
                        </Button>
                        <Button
                          variant={settings.theme === "dark" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSettings({ ...settings, theme: "dark" })}
                        >
                          <Moon className="h-4 w-4 mr-1" />
                          Oscuro
                        </Button>
                        <Button
                          variant={settings.theme === "sepia" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSettings({ ...settings, theme: "sepia" })}
                        >
                          <Palette className="h-4 w-4 mr-1" />
                          Sepia
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Familia de Fuente</label>
                      <select
                        value={settings.fontFamily}
                        onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                        className="w-full mt-2 p-2 border rounded"
                      >
                        <option value="serif">Serif</option>
                        <option value="sans-serif">Sans Serif</option>
                        <option value="monospace">Monospace</option>
                      </select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* TTS Controls */}
              <Button variant="ghost" size="sm" onClick={toggleTTS}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              {/* Bookmark */}
              <Button variant="ghost" size="sm" onClick={toggleBookmark}>
                {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progreso de Lectura</span>
              <span>{Math.round(readingProgress)}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chapter Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Capítulos</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {chapters.map((chapter, index) => (
                      <Button
                        key={chapter.id}
                        variant={index === currentChapterIndex ? "default" : "ghost"}
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => setCurrentChapterIndex(index)}
                      >
                        <div>
                          <div className="font-medium">
                            {chapter.chapter_number === 0 ? "Introducción" : `Capítulo ${chapter.chapter_number}`}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{chapter.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{chapter.estimated_reading_time} min</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Notes and Highlights */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Notas y Destacados</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="notes">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notes">Notas</TabsTrigger>
                    <TabsTrigger value="highlights">Destacados</TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="space-y-4">
                    <div>
                      <Textarea
                        placeholder="Agregar una nota..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mb-2"
                      />
                      <Button onClick={addNote} size="sm" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Agregar Nota
                      </Button>
                    </div>
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {notes.map((note) => (
                          <div key={note.id} className="p-2 bg-muted rounded text-sm">
                            <p>{note.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">Capítulo {note.position + 1}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="highlights" className="space-y-4">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => addHighlight("Texto seleccionado", "yellow")} className="flex-1">
                        <Highlighter className="h-4 w-4 mr-1" />
                        Amarillo
                      </Button>
                      <Button size="sm" onClick={() => addHighlight("Texto seleccionado", "blue")} className="flex-1">
                        <Highlighter className="h-4 w-4 mr-1" />
                        Azul
                      </Button>
                    </div>
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {highlights.map((highlight) => (
                          <div key={highlight.id} className="p-2 bg-muted rounded text-sm">
                            <p
                              className={`p-1 rounded ${
                                highlight.color === "yellow" ? "bg-yellow-200" : "bg-blue-200"
                              }`}
                            >
                              {highlight.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Capítulo {highlight.position + 1}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Reading Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {currentChapter?.chapter_number === 0
                        ? "Introducción"
                        : `Capítulo ${currentChapter?.chapter_number}`}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">{currentChapter?.title}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{readingTime} min de lectura</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none"
                  style={{
                    fontSize: `${settings.fontSize}px`,
                    fontFamily: settings.fontFamily,
                    lineHeight: settings.lineHeight,
                  }}
                >
                  {currentChapter?.content.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-justify leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <Separator className="my-8" />

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={goToPreviousChapter} disabled={currentChapterIndex === 0}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {currentChapterIndex + 1} de {chapters.length}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={goToNextChapter}
                    disabled={currentChapterIndex === chapters.length - 1}
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
