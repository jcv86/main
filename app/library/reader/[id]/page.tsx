"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkPlus,
  StickyNote,
  Plus,
  Edit,
  Trash2,
  Menu,
  Clock,
  Target,
  Moon,
  Sun,
  Type,
  Minus,
  Calendar,
  MapPin,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Chapter {
  id: string
  title: string
  content: string
  page_start: number
  page_end: number
  reading_time: number
}

interface Bookmarks {
  id: string
  chapter_id: string
  chapter_title: string
  position: number
  selected_text: string
  note?: string
  created_at: string
  page_number: number
}

interface Note {
  id: string
  chapter_id: string
  chapter_title: string
  title: string
  content: string
  selected_text?: string
  position?: number
  created_at: string
  updated_at: string
  page_number: number
}

interface ReadingProgress {
  current_chapter: number
  current_position: number
  progress_percentage: number
  time_spent: number
  last_read: string
  bookmarks_count: number
  notes_count: number
}

interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_url: string
  total_pages: number
  total_chapters: number
  estimated_reading_time: number
}

export default function BookReaderPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const bookId = params.id as string

  // Book and content state
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null)

  // Bookmarks and notes state
  const [bookmarks, setBookmarks] = useState<Bookmarks[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedText, setSelectedText] = useState("")
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNoteTitle, setNewNoteTitle] = useState("")
  const [newNoteContent, setNewNoteContent] = useState("")
  const [bookmarkNote, setBookmarkNote] = useState("")

  // Reading settings
  const [fontSize, setFontSize] = useState(16)
  const [darkMode, setDarkMode] = useState(false)
  const [lineHeight, setLineHeight] = useState(1.6)

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadBookData()
    startReadingTimer()

    return () => {
      if (readingTimerRef.current) {
        clearInterval(readingTimerRef.current)
      }
    }
  }, [bookId])

  useEffect(() => {
    updateReadingProgress()
  }, [currentChapter])

  const loadBookData = async () => {
    try {
      // Mock book data
      const mockBook: Book = {
        id: bookId,
        title: "Hábitos Atómicos",
        author: "James Clear",
        description: "Un método fácil y comprobado para crear buenos hábitos y eliminar los malos.",
        cover_url: "/books/atomic-habits.jpg",
        total_pages: 320,
        total_chapters: 20,
        estimated_reading_time: 270, // 4.5 hours in minutes
      }

      const mockChapters: Chapter[] = [
        {
          id: "1",
          title: "Los fundamentos: Por qué los pequeños cambios generan una gran diferencia",
          content: `Los hábitos son el interés compuesto del autodesarrollo. De la misma manera que el dinero se multiplica a través del interés compuesto, los efectos de tus hábitos se multiplican conforme los repites. Parecen generar poca diferencia en un día determinado y, sin embargo, el impacto que producen a lo largo de los meses y años puede ser enorme.

Es solo cuando miramos hacia atrás —dos, cinco o quizás diez años después— que el valor de los buenos hábitos y el costo de los malos se vuelve asombrosamente evidente.

Lamentablemente, los hábitos lentos del cambio también hace que sea fácil dejar que los malos hábitos se deslicen. Si comes una hamburguesa poco saludable hoy, la báscula no se moverá mucho. Si trabajas hasta tarde esta noche e ignoras a tu familia, ellos te perdonarán. Si pospones tu proyecto por un día más, siempre habrá mañana para ponerte al día.

Un solo error no arruinará tu vida, de la misma manera que una sola decisión inteligente no te catapultará al éxito. Pero conforme las decisiones se acumulan, también lo hacen los resultados de tus decisiones.

Los hábitos son una espada de doble filo. Los malos hábitos pueden reducirte tanto como los buenos hábitos pueden elevarte, razón por la cual entender los detalles es crucial.

Pequeños cambios a menudo parecen no generar diferencia hasta que cruzas un umbral crítico. Los resultados más poderosos de cualquier proceso de cambio compuesto se retrasan. Necesitas ser paciente.

Un cubo de hielo permanece como cubo de hielo a -6°C, -5°C, -4°C, -3°C, -2°C, -1°C. No es hasta que llega a 0°C que comienza a derretirse. Un grado de diferencia, aparentemente pequeño e insignificante, ha desencadenado una transformación enorme.

Los avances a menudo son el resultado de muchas acciones previas, que construyen el potencial requerido para desencadenar un cambio mayor. Esto es similar a como los átomos se acumulan en una reacción nuclear, lentamente al principio, luego todo a la vez en una explosión masiva.

Bambú que crece en China puede crecer hasta 90 pies en seis semanas, pero durante los primeros cinco años, apenas se ve crecimiento sobre el suelo. Durante esos cinco años, una extensa red de raíces se extiende bajo tierra. El trabajo no fue inútil, simplemente no era visible.

Los hábitos funcionan de la misma manera. Puedes trabajar durante años para cambiar y no ver nada. Pero si te mantienes en ello, puedes lograr resultados extraordinarios.

El valle de la desilusión

Imagina que estás corriendo en una cinta de correr. Durante los primeros minutos, no sientes mucho. Tu respiración es normal, tu ritmo cardíaco está bien. Pero si continúas, eventualmente comenzarás a sudar. Tu respiración se volverá más pesada. Tu ritmo cardíaco aumentará.

Los hábitos son similares. Al principio, no hay mucho que mostrar por tus esfuerzos. Durante días, semanas, incluso meses, puedes sentir que estás corriendo en el lugar. Es un período que yo llamo el Valle de la Desilusión.

Esperas progreso lineal. Esperas que cada día de trabajo duro se traduzca inmediatamente en un resultado medible. Pero los hábitos no funcionan de esa manera. En los primeros días y semanas, hay una brecha entre el trabajo que pones y los resultados que obtienes.

No es hasta meses o años después que te das cuenta del verdadero valor del trabajo previo que has hecho. Esto puede resultar increíblemente frustrante porque sientes que has estado trabajando duro durante semanas con poco que mostrar por ello.

Sin embargo, el trabajo no fue desperdiciado. Simplemente se estaba almacenando. No es hasta mucho después que el valor completo de los esfuerzos previos se revela.

Todas las grandes cosas provienen de pequeños comienzos. La semilla de cada hábito es una sola decisión diminuta. Pero conforme esa decisión se repite, un hábito brota y se fortalece.

Las raíces se entrelazan y se espesan hasta que la idea de vivir de manera diferente se vuelve impensable. Este es uno de los significados centrales de los hábitos atómicos: un cambio regular pequeño o una rutina que es parte de un sistema más grande.

Así como los átomos son los bloques de construcción de las moléculas, los hábitos atómicos son los bloques de construcción de resultados extraordinarios.`,
          page_start: 1,
          page_end: 16,
          reading_time: 12,
        },
        {
          id: "2",
          title: "Cómo tus hábitos moldean tu identidad (y viceversa)",
          content: `¿Por qué es tan fácil repetir los malos hábitos y tan difícil formar buenos? Pocas cosas pueden tener un impacto más poderoso en tu vida que mejorar tus hábitos diarios. Y sin embargo es probable que este tiempo el próximo año estarás haciendo las mismas cosas que estás haciendo hoy.

¿Por qué es tan difícil el cambio?

Cambiamos a tres niveles: cambio de resultados, cambio de procesos y cambio de identidad.

El primer nivel es cambiar tus resultados. Este nivel se preocupa por cambiar tus resultados: perder peso, publicar un libro, ganar un campeonato. La mayoría de las metas que te fijas están en este nivel.

El segundo nivel es cambiar tu proceso. Este nivel se preocupa por cambiar tus hábitos y sistemas: implementar una nueva rutina en el gimnasio, decluttering tu escritorio para un mejor flujo de trabajo, desarrollar una práctica de meditación. La mayoría de los hábitos que construyes están en este nivel.

El tercer y más profundo nivel es cambiar tu identidad. Este nivel se preocupa por cambiar tus creencias: tu visión del mundo, tu autoimagen, tus juicios sobre ti mismo y otros. La mayoría de las creencias, suposiciones y sesgos que tienes están en este nivel.

Los resultados son sobre lo que obtienes. Los procesos son sobre lo que haces. La identidad es sobre lo que crees.

Cuando se trata de construir hábitos que duran —cuando se trata de construir un sistema de 1 por ciento de mejoras— el problema no es que un nivel sea "mejor" o "peor" que otro. Todos los niveles de cambio son útiles a su manera. El problema es la dirección del cambio.

Muchas personas comienzan el proceso de cambiar sus hábitos enfocándose en lo que quieren lograr. Esto los lleva a hábitos basados en resultados. La alternativa es construir hábitos basados en identidad. Con este enfoque, comenzamos enfocándonos en quién deseamos convertirnos.

Imagina dos personas resistiendo un cigarrillo. Cuando se les ofrece un humo, la primera persona dice: "No, gracias. Estoy tratando de dejar de fumar". Suena como una respuesta razonable, pero esta persona todavía cree que es un fumador que está tratando de ser algo más. Espera que su comportamiento cambie mientras se aferra a la misma creencia.

La segunda persona declina diciendo: "No, gracias. No soy fumador". Es una pequeña diferencia, pero esta declaración proviene de una identidad diferente. Ya no se ven a sí mismos como fumadores.

La mayoría de las personas ni siquiera consideran el cambio de identidad cuando se proponen mejorar. Solo piensan: "Quiero ser delgado" o "Quiero ser fuerte" o "Quiero ser inteligente". Todas estas son metas basadas en resultados.

Deberías estar mucho más preocupado por tu identidad actual que por tus resultados actuales. Si tienes las mismas creencias que antes, entonces es natural que vuelvas a tus viejos hábitos.

El objetivo no es leer un libro, el objetivo es convertirse en lector.
El objetivo no es correr un maratón, el objetivo es convertirse en corredor.
El objetivo no es aprender un instrumento, el objetivo es convertirse en músico.

Tus comportamientos son usualmente un reflejo de tu identidad. Lo que haces es una indicación del tipo de persona que crees que eres —ya sea consciente o inconscientemente.

La investigación ha demostrado que una vez que una persona cree en un aspecto particular de su identidad, estará motivada a actuar de manera alineada con esa creencia. Por ejemplo, las personas que se identificaron como "siendo un votante" tenían más probabilidades de votar que aquellas que simplemente afirmaron "votar".

De manera similar, la persona que incorpora el ejercicio en su identidad no tiene que convencerse a sí misma de entrenar. Hacer lo correcto es fácil. Después de todo, cuando tu comportamiento y tu identidad están completamente alineados, ya no estás persiguiendo el cambio de comportamiento. Simplemente estás actuando como el tipo de persona que ya eres.

Como todas las formas de cambio, el cambio de identidad puede ser una espada de doble filo. Cuando trabajas a tu favor, el cambio de identidad puede ser una fuerza poderosa para el autodesarrollo. Cuando trabaja en tu contra, puede ser una maldición.

El efecto de una sola experiencia tiende a desvanecerse, pero el efecto de los hábitos se refuerza. Pueden ser una maldición o una bendición. Los malos hábitos se repiten una y otra vez no porque no quieras cambiar, sino porque tienes la identidad equivocada.

Para cambiar tu comportamiento para bien, debes comenzar por cambiar tu identidad. Tienes que decidir el tipo de persona que quieres ser. Esto se mantiene en cualquier nivel de cambio. Quieres perder peso, pero si tienes la misma mentalidad y los mismos hábitos que antes, entonces vas a luchar para hacer progreso.

Tienes que cambiar las creencias subyacentes que llevaron a tus acciones pasadas. Tienes que construir mejores hábitos porque eres el tipo de persona que quiere esas cosas.

Una vez que hayas decidido el tipo de persona que quieres ser, puedes comenzar a dar pequeños pasos para reforzar tu identidad deseada.

Tengo un amigo que perdió más de 100 libras preguntándose: "¿Qué haría una persona saludable?" Durante todo el día, usaría esta pregunta como guía. ¿Una persona saludable caminaría o tomaría un taxi? ¿Una persona saludable ordenaría una hamburguesa o una ensalada? ¿Una persona saludable miraría Netflix durante tres horas o saldría a caminar?

Él se imaginó el tipo de persona que quería ser y luego demostró que era ese tipo de persona con pequeñas victorias. Y eventualmente, comenzó a creer realmente que era una persona saludable.

El proceso de cambio de identidad es un proceso de dos pasos:

1. Decide el tipo de persona que quieres ser.
2. Demuéstratelo a ti mismo con pequeñas victorias.

Primero, decide quién quieres ser. Esto se mantiene en cualquier nivel —como individuo, como equipo, como comunidad, como nación. ¿Qué quieres representar? ¿Qué principios y valores quieres encarnar?

Estas son preguntas grandes, y muchas personas no están seguras de dónde comenzar, pero saben qué tipo de resultados quieren: estar en forma, construir un negocio exitoso, escribir un libro, ganar un campeonato, pasar más tiempo con su familia, y así sucesivamente.

Está bien. Comienza ahí y trabaja hacia atrás desde los resultados que quieres hasta el tipo de persona que podría obtener esos resultados. Pregúntate: "¿Quién es el tipo de persona que podría obtener el resultado que quiero?"

¿Quién es el tipo de persona que podría perder 40 libras? Probablemente alguien que es consistente con el ejercicio. ¿Quién es el tipo de persona que podría aprender un nuevo idioma? Probablemente alguien que es diligente y estudioso. ¿Quién es el tipo de persona que podría dirigir un negocio exitoso? Probablemente alguien que es organizado y trabajador.

Una vez que tengas un manejo de qué tipo de persona quieres ser, puedes comenzar a dar pequeños pasos para reforzar tu identidad deseada.

El proceso es simple:

1. Cada vez que escribes una página, eres un escritor.
2. Cada vez que practicas el violín, eres un músico.
3. Cada vez que empiezas un entrenamiento, eres un atleta.
4. Cada vez que animas a tus empleados, eres un líder.

Cada acción que tomas es un voto por el tipo de persona que quieres convertirte. Ninguna instancia individual transformará tus creencias, pero conforme los votos se acumulan, también lo hace la evidencia de tu nueva identidad.

Esta es una de las razones por las que el cambio significativo no requiere cambios radicales. Los pequeños hábitos pueden hacer una diferencia significativa al proporcionar evidencia de una nueva identidad. Y si un cambio es significativo, en realidad no importa si es grande o pequeño. Lo que importa es que esté dirigiendo tu vida en la dirección que quieres que vaya.

Cada hábito no solo obtiene resultados, también te enseña algo mucho más importante: confiar en ti mismo. Empiezas a creer que puedes lograr estas pequeñas mejoras.

Cuando el voto se acumula y la evidencia comienza a cambiar la historia que te cuentas sobre ti mismo, empiezas a crecer en una nueva identidad.

Por supuesto, también funciona en sentido contrario. Cada vez que eliges realizar un mal hábito, es un voto por esa identidad. La buena noticia es que no necesitas ser perfecto. En cualquier elección, puedes simplemente elegir el mejor voto disponible.

Los nuevos hábitos pueden parecer que van en contra de tu identidad actual. Puedes pensar: "No soy una persona matutina" o "No soy bueno con la tecnología" o "Soy terrible dirigiendo". Cuando has repetido una historia para ti mismo durante años, es fácil deslizarse en estos patrones mentales y aceptarlos como un hecho.

Con el tiempo, sin embargo, conforme la evidencia se acumula, tus creencias de autoconcepto comienzan a cambiar. El efecto acumulativo de estos pequeños cambios en comportamiento es un cambio poderoso en identidad.

Decidir el tipo de persona que quieres ser es probablemente la decisión más importante que puedes tomar. Construye la persona que quieres ser con cada hábito.

El verdadero cambio de comportamiento es cambio de identidad. Podrías empezar un hábito debido a la motivación, pero la única razón por la que te apegarás a uno es que se convierte en parte de tu identidad.

Cualquiera puede convencerse de visitar el gimnasio o comer saludable una o dos veces, pero si no cambias la creencia detrás del comportamiento, entonces es difícil mantener el cambio a largo plazo. Las mejoras son solo temporales hasta que se conviertan en parte de quién eres.

El objetivo no es leer un libro, el objetivo es convertirse en lector.
El objetivo no es correr un maratón, el objetivo es convertirse en corredor.
El objetivo no es aprender un instrumento, el objetivo es convertirse en músico.

Tu identidad emerge de tus hábitos. Cada acción es un voto por el tipo de persona que quieres convertirte.

Convertirse en la mejor versión de ti mismo requiere que edites continuamente tus creencias, y que actualices y expandas tu identidad.

Este proceso de cambio de identidad es como escribir un nuevo libro. Al principio, tienes una página en blanco y una idea vaga de la historia que quieres contar. Cada capítulo que escribes añade detalles y desarrolla el argumento.

Los hábitos son el camino por el cual encarnas una identidad particular. Cuanto más repites un comportamiento, más refuerzas la identidad asociada con ese comportamiento.

De hecho, la palabra identidad originalmente se derivó de las palabras latinas essentitas, que significa ser, e identidem, que significa repetidamente. Tu identidad es literalmente tus "seres repetidos".

Cualquiera que sea tu identidad ahora, solo crees en ella porque tienes prueba de ello. Si vas a la iglesia cada domingo durante 20 años, tienes evidencia de que eres religioso. Si estudias biología durante una hora cada noche, tienes evidencia de que eres estudioso. Si vas al gimnasio incluso cuando llueve, tienes evidencia de que estás comprometido con el fitness.

Cuanto más evidencia tengas para una creencia, más fuertemente la creerás. Por esta razón, los hábitos son el camino hacia el cambio de identidad. La forma más práctica de cambiar quién eres es cambiar lo que haces.

Cada vez que repites un hábito, realizas los rituales de tu identidad deseada.
Cada vez que haces tu cama, encarnas la identidad de alguien que es organizado.
Cada vez que escribes, encarnas la identidad de alguien que es creativo.
Cada vez que entrenas, encarnas la identidad de alguien que está en forma.

Cualquiera que sea la identidad que quieras reforzar hoy, puedes creerla un poco más haciendo el hábito asociado.

Este es un proceso gradual. Como el agua que lentamente cambia la forma de una roca, tus hábitos moldean tu identidad. Pero una vez que esa nueva identidad se cristaliza, tus hábitos se vuelven fáciles de mantener.

La clave para construir hábitos duraderos es enfocarse en crear una nueva identidad primero. Tu comportamiento actual es simplemente un reflejo de tu identidad actual. Lo que haces ahora es un espejo de quién crees que eres (ya sea consciente o subconscientemente).

Para cambiar tu comportamiento para bien, debes empezar por cambiar tu identidad. Tienes que decidir el tipo de persona que quieres ser. Esto se mantiene en cualquier nivel de cambio.

Quieres perder peso, pero si tienes la misma mentalidad y los mismos hábitos que antes, entonces vas a luchar para hacer progreso. En su lugar, debes demostrar que eres el tipo de persona que quiere estar saludable.

Quieres escribir un libro, pero si tu identidad es "No soy un escritor", entonces cada día que no escribes será evidencia de que no eres un escritor. En su lugar, debes demostrar que eres el tipo de persona que escribe todos los días.

Una vez que hayas decidido el tipo de persona que quieres ser, puedes comenzar a dar pequeños pasos para reforzar tu identidad deseada. Tengo un amigo que perdió más de 100 libras preguntándose: "¿Qué haría una persona saludable?" Durante todo el día, usaría esta pregunta como guía.

El proceso de cambio de identidad es un proceso de dos pasos:

1. Decide el tipo de persona que quieres ser.
2. Demuéstratelo a ti mismo con pequeñas victorias.

Tu identidad no está tallada en piedra. Tienes una opción en cada momento. Puedes elegir la identidad que quieres reforzar hoy con los hábitos que eliges hoy. Y esto nos lleva a la pregunta más profunda de todas: si tus creencias y visión del mundo juegan un papel tan importante en tu comportamiento, ¿de dónde vienen en primer lugar? ¿Cómo, exactamente, se forman tus creencias?

Y lo más importante, ¿cómo puedes cambiarlas?`,
          page_start: 17,
          page_end: 32,
          reading_time: 15,
        },
        {
          id: "3",
          title: "Cómo construir mejores hábitos en 4 simples pasos",
          content: `En 1898, un psicólogo llamado Edward Thorndike realizó un experimento que cambiaría la forma en que pensamos sobre la formación de hábitos.

Thorndike estaba interesado en estudiar el comportamiento animal, así que construyó un dispositivo conocido como una caja de rompecabezas. Era una caja de madera con una puerta que podía abrirse desde adentro presionando un pestillo.

Thorndike colocaría un gato dentro de la caja. Al principio, el gato deambularía, olería, y arañaría aleatoriamente. Después de unos minutos de exploración, el gato presionaría accidentalmente el pestillo, la puerta se abriría, y el gato escaparía.

Thorndike repetiría este experimento una y otra vez con el mismo gato. Registró el comportamiento en cada ensayo. La primera vez, el gato tardó mucho tiempo en escapar. En ensayos posteriores, el gato escaparía cada vez más rápido. Después de veinte o treinta intentos, el gato podría escapar en unos pocos segundos.

Durante el curso de cada experimento, el comportamiento inútil ocurría con menos frecuencia y las acciones útiles se volvían más comunes. El gato estaba aprendiendo a asociar presionar el pestillo con la recompensa de escapar.

Thorndike describió este proceso de aprendizaje como la Ley del Efecto: "Las respuestas que producen un efecto satisfactorio en una situación particular se vuelven más probables de ocurrir nuevamente en esa situación, y las respuestas que producen un efecto incómodo se vuelven menos probables de ocurrir nuevamente en esa situación."

En otras palabras, los comportamientos seguidos de consecuencias satisfactorias tienden a repetirse y aquellos que producen consecuencias desagradables son menos probables de repetirse. Thorndike había descubierto la idea central detrás de la formación de hábitos: los comportamientos que son recompensados se repiten y los comportamientos que son castigados se evitan.

Décadas después, los hallazgos de Thorndike fueron expandidos por B.F. Skinner, quien estudió cómo los animales y humanos predicen recompensas. Durante sus experimentos, Skinner se referiría a un estímulo que aumenta el comportamiento como reforzador. Estos reforzadores podrían ser positivos (agregar algo bueno) o negativos (quitar algo malo), pero Skinner encontró que todos los reforzadores aumentan la probabilidad de repetir un comportamiento.

Los hallazgos de Skinner sugieren que podemos usar recompensas para nuestro beneficio. Al hacer que las recompensas de nuestros buenos hábitos sean más satisfactorias, podemos entrenar a nuestro cerebro para que disfrute realizando ellos.

Pero aquí está el problema: la mayoría de las recompensas que obtenemos hoy son retrasadas. Es el resultado de vivir en una sociedad moderna. Hace cien años, la mayoría de las recompensas en la vida diaria eran instantáneas. Cazabas y comías. Trabajabas y te pagaban. Ganabas y celebrabas.

Hoy, trabajamos durante años para obtener un título. Hacemos ejercicio durante meses antes de ver nuestro cuerpo cambiar. Ahorramos durante décadas para la jubilación.

Con nuestros malos hábitos, la situación es inversa: las recompensas son inmediatas, pero las consecuencias son retrasadas. Fumar puede matarte en diez años, pero alivia el estrés ahora. El exceso de comida puede enfermarte mañana, pero te hace sentir bien esta noche. El sexo puede producir un bebé no deseado en nueve meses, pero proporciona placer ahora.

Como regla general, cuanto más inmediata es la recompensa, más probable es que se repita el comportamiento.

Esta es exactamente la razón por la que es tan difícil construir hábitos que paguen a largo plazo. Estás luchando contra la tendencia de tu cerebro a priorizar las recompensas inmediatas sobre las retrasadas.

Afortunadamente, es posible entrenar a tu cerebro para retrasar la gratificación, pero necesitas trabajar con el grano de la naturaleza humana, no contra él. La mejor manera de hacer esto es agregar un poco de placer inmediato a los hábitos que pagan a largo plazo y un poco de dolor inmediato a los que no.

Supongamos que quieres convertirte en alguien que lee más libros, pero cada vez que te sientas a leer, te aburres después de unos minutos. El hábito necesita una recompensa que sea inmediata.

Una solución es crear una cuenta de ahorros y depositar $5 cada vez que leas durante una hora. Es una pequeña recompensa inmediata que refuerza tu hábito de lectura y, después de unos meses, también tendrás dinero ahorrado para comprar algo agradable.

O digamos que quieres comer más saludable, pero las comidas saludables no saben tan bien como la comida chatarra. Aquí, puedes agregar un poco de placer inmediato cocinando de una manera que disfrutes. Puedes hacer que las verduras sepan mejor agregando especias o cocinándolas en aceite de oliva. Puedes hacer que las comidas saludables sean más convenientes preparándolas con anticipación.

La clave es hacer que tus buenos hábitos sean tan atractivos como sea posible y tus malos hábitos tan poco atractivos como sea posible.

Pero incluso con estas estrategias, cambiar hábitos puede ser desafiante por otra razón: después de décadas de patrones mentales, tu cerebro ha sido entrenado para predecir que ciertos comportamientos serán recompensados y otros serán castigados.

Cuando tu cerebro predice que un comportamiento será recompensado, liberas una ráfaga de dopamina. La dopamina es liberada no solo cuando experimentas placer, sino también cuando lo anticipas.

Los investigadores han encontrado que el 100 por ciento de la dopamina se libera antes de experimentar placer, no después. Es la anticipación de una recompensa, no el cumplimiento de ella, lo que nos hace actuar.

Esta es una de las razones por las que los malos hábitos son tan difíciles de romper. Tu cerebro ha aprendido a predecir que ciertos comportamientos serán recompensados, incluso si esas recompensas ya no son beneficiosas para ti.

Cada vez que sientes el impulso de revisar tu teléfono, tu cerebro está prediciendo que encontrarás algo interesante. Cada vez que sientes el impulso de comer comida chatarra, tu cerebro está prediciendo que sabrá bien. Cada vez que sientes el impulso de procrastinar, tu cerebro está prediciendo que evitar el trabajo se sentirá bien.

Estos impulsos pueden persistir durante años, incluso después de que hayas decidido conscientemente que quieres cambiar. Es por eso que simplemente resistir la tentación es una estrategia ineficaz. En su lugar, necesitas hacer que tus buenos hábitos sean más atractivos que tus malos hábitos.

Aquí es donde entra el concepto de agrupación de tentaciones. La agrupación de tentaciones funciona vinculando una acción que quieres hacer con una acción que necesitas hacer.

Por ejemplo, después de que [NECESITO] revise mi correo electrónico, [QUIERO] leer las noticias deportivas.
Después de que [NECESITO] saque la basura, [QUIERO] ver Netflix.
Después de que [NECESITO] termine mi entrenamiento, [QUIERO] revisar las redes sociales.

La agrupación de tentaciones es una aplicación del Principio de Premack. Nombrado después del psicólogo David Premack, el principio establece que "los comportamientos más probables reforzarán los comportamientos menos probables."

En otras palabras, incluso si no quieres procesar el correo electrónico, harás la tarea si significa que puedes hacer algo que realmente quieres hacer después.

Puedes incluso combinar la agrupación de tentaciones con el apilamiento de hábitos. La fórmula es:

Después de [HÁBITO ACTUAL], haré [HÁBITO QUE NECESITO].
Después de [HÁBITO QUE NECESITO], haré [HÁBITO QUE QUIERO].

Por ejemplo:
Después de que me sirva mi café matutino, haré una cosa en mi lista de tareas pendientes (necesito).
Después de que haga una cosa en mi lista de tareas pendientes, revisaré Facebook (quiero).

O:
Después de que me siente a cenar, diré una cosa por la que estoy agradecido (necesito).
Después de que diga una cosa por la que estoy agradecido, encenderé Netflix (quiero).

La esperanza es que eventualmente busques hacer el hábito del medio tanto como el último hábito. Idealmente, harás ejercicio porque disfrutas el sentimiento de estar en forma, no porque disfrutas la ducha después. Pero en las primeras etapas del cambio de hábitos, es importante aprovechar cualquier impulso disponible para que el comportamiento se mantenga.

Los hábitos son un bucle de retroalimentación de cuatro pasos: señal, anhelo, respuesta, recompensa. Estos cuatro pasos se combinan para formar un bucle neurológico que, en última instancia, te permite crear hábitos automáticos. Este ciclo se conoce como el bucle del hábito.

Primero, está la señal. La señal desencadena tu cerebro para iniciar un comportamiento. Es un poco de información que predice una recompensa.

Segundo, está el anhelo. Los anhelos son la fuerza motivacional detrás de cada hábito. Sin algún nivel de motivación o deseo, sin anhelo de cambio, no tenemos razón para actuar. Lo que anhelas no es el hábito en sí, sino el cambio de estado que entrega.

Tercero, está la respuesta. La respuesta es el hábito real que realizas, que puede tomar la forma de un pensamiento o una acción.

Finalmente, está la recompensa. Las recompensas son el objetivo final de cada hábito. La señal es sobre notar la recompensa. El anhelo es sobre querer la recompensa. La respuesta es sobre obtener la recompensa.

Perseguimos recompensas porque sirven dos propósitos: (1) nos satisfacen y (2) nos enseñan.

Las recompensas proporcionan beneficios por sí mismas. La comida y el agua entregan la energía que necesitas para sobrevivir. Obtener una promoción trae más dinero y respeto. Hacer ejercicio mejora tu salud y tu apariencia física.

Pero lo más importante es que las recompensas enseñan a tu cerebro qué acciones vale la pena recordar en el futuro. Tu cerebro es un detector de recompensas. Conforme navegas por la vida, tu sistema nervioso está monitoreando continuamente qué acciones satisfacen tus deseos y entregan placer.

Las recompensas cierran el bucle y completan el ciclo del hábito. Si un comportamiento es insuficiente en cualquiera de los cuatro pasos, no se convertirá en un hábito. Elimina la señal y tu hábito nunca comenzará. Reduce el anhelo y no tendrás suficiente motivación para actuar. Haz que el comportamiento sea difícil y no podrás hacerlo. Y si la recompensa no satisface tu deseo, entonces no tendrás razón para hacerlo de nuevo en el futuro.

Sin los primeros tres pasos, un comportamiento no ocurrirá. Sin los cuatro, un comportamiento no se repetirá.

En resumen, la señal desencadena un anhelo, que motiva una respuesta, que proporciona una recompensa, que satisface el anhelo y, en última instancia, se asocia con la señal. Juntos, estos cuatro pasos forman un bucle neurológico que permite que cualquier comportamiento se convierta en un hábito automático.

Este ciclo es conocido como el bucle del hábito.

Podemos dividir estos cuatro pasos en dos fases: la fase del problema y la fase de la solución. La fase del problema incluye la señal y el anhelo, y es cuando te das cuenta de que algo necesita cambiar. La fase de la solución incluye la respuesta y la recompensa, y es cuando tomas acción y logras el cambio que deseas.

Todas las conductas están impulsadas por el deseo de resolver un problema. A veces el problema es que notas algo bueno y quieres obtenerlo. A veces el problema es que estás experimentando dolor y quieres aliviarlo. De cualquier manera, el propósito de cada hábito es resolver los problemas que enfrentas.

En la tabla a continuación, puedes ver algunos ejemplos de lo que cada paso del bucle del hábito podría verse en la vida real.

Problema fase 1: Señal
Tu teléfono hace un zumbido con una nueva notificación de mensaje de texto.

Problema fase 2: Anhelo
Quieres aprender el contenido del mensaje.

Solución fase 1: Respuesta
Tomas tu teléfono y lees el texto.

Solución fase 2: Recompensa
Satisfaces tu anhelo de leer el mensaje. Tomar tu teléfono se asocia con tu teléfono haciendo zumbido.

Imagina caminar hacia una habitación oscura. Alcanzas el interruptor de la luz y lo enciendes. Has realizado este simple hábito tantas veces que ocurre sin pensar. Procedes a través de los cuatro pasos en una fracción de segundo. La urgencia de actuar golpea instantáneamente.

Problema fase 1: Señal
Entras en una habitación oscura.

Problema fase 2: Anhelo
Quieres poder ver.

Solución fase 1: Respuesta
Enciendes el interruptor de la luz.

Solución fase 2: Recompensa
Satisfaces tu anhelo de ver. Encender el interruptor de la luz se asocia con estar en una habitación oscura.

Al entender estos cuatro pasos, podemos crear un marco simple para construir mejores hábitos. Podemos transformar estos cuatro pasos en un conjunto práctico de reglas que podemos usar para diseñar buenos hábitos y eliminar los malos.

Quiero llamar a este marco las Cuatro Leyes del Cambio de Comportamiento, y proporciona un conjunto simple de reglas para crear buenos hábitos y romper los malos.

Cómo crear un buen hábito
La 1ª ley (Señal): Hazlo obvio.
La 2ª ley (Anhelo): Hazlo atractivo.
La 3ª ley (Respuesta): Hazlo fácil.
La 4ª ley (Recompensa): Hazlo satisfactorio.

Cómo romper un mal hábito
Inversión de la 1ª ley (Señal): Hazlo invisible.
Inversión de la 2ª ley (Anhelo): Hazlo poco atractivo.
Inversión de la 3ª ley (Respuesta): Hazlo difícil.
Inversión de la 4ª ley (Recompensa): Hazlo insatisfactorio.

Sería irresponsable afirmar que estas cuatro leyes son una solución exhaustiva para cada problema relacionado con el cambio de hábitos, pero creo que proporcionan un marco útil para pensar sobre los hábitos. Como verás a lo largo de este libro, las Cuatro Leyes del Cambio de Comportamiento se aplican a casi todos los campos, desde los deportes hasta la política, desde el arte hasta la medicina, desde la comedia hasta la gestión.

Estas leyes pueden usarse sin importar el desafío que estés enfrentando o el comportamiento que esperes cambiar. Siempre que quieras cambiar tu comportamiento, puedes simplemente preguntarte:

1. ¿Cómo puedo hacerlo obvio?
2. ¿Cómo puedo hacerlo atractivo?
3. ¿Cómo puedo hacerlo fácil?
4. ¿Cómo puedo hacerlo satisfactorio?

Si quieres romper un mal hábito, simplemente invierte cada ley:

1. ¿Cómo puedo hacerlo invisible?
2. ¿Cómo puedo hacerlo poco atractivo?
3. ¿Cómo puedo hacerlo difícil?
4. ¿Cómo puedo hacerlo insatisfactorio?

Más adelante en este libro, aprenderemos cómo aplicar cada ley a tus hábitos particulares, pero antes de eso, necesitas saber dónde empezar.`,
          page_start: 33,
          page_end: 48,
          reading_time: 18,
        },
      ]

      const mockProgress: ReadingProgress = {
        current_chapter: 0,
        current_position: 0,
        progress_percentage: 65,
        time_spent: 180,
        last_read: "2024-01-15T10:30:00Z",
        bookmarks_count: 8,
        notes_count: 12,
      }

      const mockBookmarks: Bookmarks[] = [
        {
          id: "1",
          chapter_id: "1",
          chapter_title: "Los fundamentos",
          position: 150,
          selected_text: "Los hábitos son el interés compuesto del autodesarrollo",
          note: "Concepto clave - los hábitos se acumulan con el tiempo",
          created_at: "2024-01-10T14:20:00Z",
          page_number: 3,
        },
        {
          id: "2",
          chapter_id: "1",
          chapter_title: "Los fundamentos",
          position: 890,
          selected_text:
            "Un cubo de hielo permanece como cubo de hielo a -6°C, -5°C, -4°C, -3°C, -2°C, -1°C. No es hasta que llega a 0°C que comienza a derretirse.",
          note: "Excelente metáfora sobre los puntos de inflexión",
          created_at: "2024-01-11T09:15:00Z",
          page_number: 8,
        },
        {
          id: "3",
          chapter_id: "2",
          chapter_title: "Cómo tus hábitos moldean tu identidad",
          position: 420,
          selected_text: "El objetivo no es leer un libro, el objetivo es convertirse en lector",
          created_at: "2024-01-12T16:45:00Z",
          page_number: 22,
        },
        {
          id: "4",
          chapter_id: "2",
          chapter_title: "Cómo tus hábitos moldean tu identidad",
          position: 1200,
          selected_text: "Cada acción que tomas es un voto por el tipo de persona que quieres convertirte",
          note: "Esto cambió mi perspectiva completamente",
          created_at: "2024-01-13T11:30:00Z",
          page_number: 28,
        },
      ]

      const mockNotes: Note[] = [
        {
          id: "1",
          chapter_id: "1",
          chapter_title: "Los fundamentos",
          title: "Reflexión sobre el interés compuesto",
          content:
            "Me parece fascinante cómo Clear conecta el concepto financiero del interés compuesto con el desarrollo personal. Esto me hace pensar en cómo pequeñas acciones diarias en mi carrera profesional pueden acumularse para generar grandes resultados a largo plazo.",
          selected_text: "Los hábitos son el interés compuesto del autodesarrollo",
          position: 150,
          created_at: "2024-01-10T14:25:00Z",
          updated_at: "2024-01-10T14:25:00Z",
          page_number: 3,
        },
        {
          id: "2",
          chapter_id: "1",
          chapter_title: "Los fundamentos",
          title: "El Valle de la Desilusión",
          content:
            "Este concepto explica perfectamente por qué he abandonado tantos hábitos en el pasado. No veía resultados inmediatos y me desanimaba. Ahora entiendo que es normal y parte del proceso.",
          created_at: "2024-01-11T10:00:00Z",
          updated_at: "2024-01-11T10:00:00Z",
          page_number: 12,
        },
        {
          id: "3",
          chapter_id: "2",
          chapter_title: "Cómo tus hábitos moldean tu identidad",
          title: "Cambio de identidad vs cambio de comportamiento",
          content:
            "La idea de que debemos cambiar nuestra identidad antes que nuestro comportamiento es revolucionaria. En lugar de decir 'quiero hacer ejercicio', debería decir 'soy una persona activa'. Esto cambia completamente la mentalidad.",
          selected_text: "Para cambiar tu comportamiento para bien, debes comenzar por cambiar tu identidad",
          position: 800,
          created_at: "2024-01-12T17:00:00Z",
          updated_at: "2024-01-12T17:00:00Z",
          page_number: 25,
        },
        {
          id: "4",
          chapter_id: "2",
          chapter_title: "Cómo tus hábitos moldean tu identidad",
          title: "Aplicación práctica: Mi carrera",
          content:
            "Voy a aplicar esto a mi desarrollo profesional. En lugar de 'quiero aprender programación', voy a adoptar la identidad de 'soy un programador'. Cada línea de código que escriba será evidencia de esta nueva identidad.",
          created_at: "2024-01-13T12:00:00Z",
          updated_at: "2024-01-14T09:30:00Z",
          page_number: 30,
        },
      ]

      setBook(mockBook)
      setChapters(mockChapters)
      setReadingProgress(mockProgress)
      setBookmarks(mockBookmarks)
      setNotes(mockNotes)
    } catch (error) {
      console.error("Error loading book data:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el libro. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const startReadingTimer = () => {
    readingTimerRef.current = setInterval(() => {
      setReadingProgress((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          time_spent: prev.time_spent + 1,
        }
      })
    }, 60000) // Update every minute
  }

  const updateReadingProgress = () => {
    if (!readingProgress) return

    const newProgress = {
      ...readingProgress,
      current_chapter: currentChapter,
      current_position: 0,
      progress_percentage: Math.round(((currentChapter + 1) / chapters.length) * 100),
      last_read: new Date().toISOString(),
    }

    setReadingProgress(newProgress)

    // Save progress to backend (mock)
    toast({
      title: "Progreso guardado",
      description: `Capítulo ${currentChapter + 1} - ${newProgress.progress_percentage}% completado`,
    })
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim()
      setSelectedText(selectedText)

      // Calculate position (simplified)
      const range = selection.getRangeAt(0)
      const position = range.startOffset

      setSelectionRange({ start: range.startOffset, end: range.endOffset })
    }
  }

  const createBookmark = async () => {
    if (!selectedText) {
      toast({
        title: "Error",
        description: "Selecciona texto para crear un marcador",
        variant: "destructive",
      })
      return
    }

    const newBookmark: Bookmarks = {
      id: Date.now().toString(),
      chapter_id: chapters[currentChapter].id,
      chapter_title: chapters[currentChapter].title,
      position: selectionRange?.start || 0,
      selected_text: selectedText,
      note: bookmarkNote,
      created_at: new Date().toISOString(),
      page_number: chapters[currentChapter].page_start + Math.floor(currentChapter * 2),
    }

    setBookmarks((prev) => [...prev, newBookmark])
    setReadingProgress((prev) => (prev ? { ...prev, bookmarks_count: prev.bookmarks_count + 1 } : prev))

    setShowBookmarkDialog(false)
    setSelectedText("")
    setBookmarkNote("")
    setSelectionRange(null)

    toast({
      title: "Marcador creado",
      description: "El marcador se ha guardado exitosamente",
    })
  }

  const createNote = async () => {
    if (!newNoteTitle.trim()) {
      toast({
        title: "Error",
        description: "El título de la nota es requerido",
        variant: "destructive",
      })
      return
    }

    const newNote: Note = {
      id: Date.now().toString(),
      chapter_id: chapters[currentChapter].id,
      chapter_title: chapters[currentChapter].title,
      title: newNoteTitle,
      content: newNoteContent,
      selected_text: selectedText || undefined,
      position: selectionRange?.start || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      page_number: chapters[currentChapter].page_start + Math.floor(currentChapter * 2),
    }

    setNotes((prev) => [...prev, newNote])
    setReadingProgress((prev) => (prev ? { ...prev, notes_count: prev.notes_count + 1 } : prev))

    setShowNoteDialog(false)
    setNewNoteTitle("")
    setNewNoteContent("")
    setSelectedText("")
    setSelectionRange(null)

    toast({
      title: "Nota creada",
      description: "La nota se ha guardado exitosamente",
    })
  }

  const updateNote = async () => {
    if (!editingNote || !newNoteTitle.trim()) return

    const updatedNote: Note = {
      ...editingNote,
      title: newNoteTitle,
      content: newNoteContent,
      updated_at: new Date().toISOString(),
    }

    setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? updatedNote : note)))

    setEditingNote(null)
    setNewNoteTitle("")
    setNewNoteContent("")
    setShowNoteDialog(false)

    toast({
      title: "Nota actualizada",
      description: "Los cambios se han guardado exitosamente",
    })
  }

  const deleteBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId))
    setReadingProgress((prev) => (prev ? { ...prev, bookmarks_count: prev.bookmarks_count - 1 } : prev))

    toast({
      title: "Marcador eliminado",
      description: "El marcador se ha eliminado exitosamente",
    })
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    setReadingProgress((prev) => (prev ? { ...prev, notes_count: prev.notes_count - 1 } : prev))

    toast({
      title: "Nota eliminada",
      description: "La nota se ha eliminado exitosamente",
    })
  }

  const jumpToBookmark = (bookmark: Bookmarks) => {
    const chapterIndex = chapters.findIndex((chapter) => chapter.id === bookmark.chapter_id)
    if (chapterIndex !== -1) {
      setCurrentChapter(chapterIndex)
      setSidebarOpen(false)

      toast({
        title: "Navegando al marcador",
        description: `${bookmark.chapter_title}`,
      })
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!book || chapters.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando libro...</p>
        </div>
      </div>
    )
  }

  const currentChapterData = chapters[currentChapter]
  const chapterBookmarks = bookmarks.filter((bookmark) => bookmark.chapter_id === currentChapterData.id)
  const chapterNotes = notes.filter((note) => note.chapter_id === currentChapterData.id)

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-white"}`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Biblioteca
            </Button>
            <div className="hidden md:block">
              <h1 className="font-semibold text-lg">{book.title}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reading Progress */}
            {readingProgress && (
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(readingProgress.time_spent)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>{readingProgress.progress_percentage}%</span>
                </div>
              </div>
            )}

            {/* Reading Settings */}
            <Button variant="ghost" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setFontSize(Math.max(12, fontSize - 2))}>
              <Minus className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
              <Type className="h-4 w-4" />
            </Button>

            {/* Mobile Sidebar Toggle */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Navegación</SheetTitle>
                  <SheetDescription>Capítulos, marcadores y notas</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <Tabs defaultValue="chapters" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="chapters">Capítulos</TabsTrigger>
                      <TabsTrigger value="bookmarks">Marcadores ({bookmarks.length})</TabsTrigger>
                      <TabsTrigger value="notes">Notas ({notes.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="chapters" className="mt-4">
                      <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="space-y-2">
                          {chapters.map((chapter, index) => (
                            <Button
                              key={chapter.id}
                              variant={index === currentChapter ? "default" : "ghost"}
                              className="w-full justify-start text-left h-auto p-3"
                              onClick={() => {
                                setCurrentChapter(index)
                                setSidebarOpen(false)
                              }}
                            >
                              <div>
                                <div className="font-medium text-sm mb-1">Capítulo {index + 1}</div>
                                <div className="text-xs opacity-75 line-clamp-2">{chapter.title}</div>
                                <div className="text-xs opacity-50 mt-1">
                                  {chapter.reading_time} min • Páginas {chapter.page_start}-{chapter.page_end}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="bookmarks" className="mt-4">
                      <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="space-y-3">
                          {bookmarks.map((bookmark) => (
                            <Card
                              key={bookmark.id}
                              className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <div onClick={() => jumpToBookmark(bookmark)}>
                                <div className="flex items-start justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {bookmark.chapter_title}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteBookmark(bookmark.id)
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <blockquote className="text-sm italic border-l-2 border-blue-500 pl-2 mb-2">
                                  "{bookmark.selected_text}"
                                </blockquote>
                                {bookmark.note && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{bookmark.note}</p>
                                )}
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <MapPin className="h-3 w-3" />
                                  <span>Página {bookmark.page_number}</span>
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(bookmark.created_at)}</span>
                                </div>
                              </div>
                            </Card>
                          ))}
                          {bookmarks.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No hay marcadores aún</p>
                              <p className="text-xs">Selecciona texto para crear uno</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="notes" className="mt-4">
                      <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="space-y-3">
                          {notes.map((note) => (
                            <Card key={note.id} className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {note.chapter_title}
                                </Badge>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      setEditingNote(note)
                                      setNewNoteTitle(note.title)
                                      setNewNoteContent(note.content)
                                      setShowNoteDialog(true)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => deleteNote(note.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <h4 className="font-medium text-sm mb-2">{note.title}</h4>
                              {note.selected_text && (
                                <blockquote className="text-sm italic border-l-2 border-green-500 pl-2 mb-2">
                                  "{note.selected_text}"
                                </blockquote>
                              )}
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
                                {note.content}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>Página {note.page_number}</span>
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(note.updated_at)}</span>
                              </div>
                            </Card>
                          ))}
                          {notes.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No hay notas aún</p>
                              <p className="text-xs">Crea tu primera nota</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Progress Bar */}
        {readingProgress && (
          <div className="px-4 pb-2">
            <Progress value={readingProgress.progress_percentage} className="h-1" />
          </div>
        )}
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-80 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-120px)] sticky top-[120px]">
          <Tabs defaultValue="chapters" className="w-full">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="chapters">Capítulos</TabsTrigger>
              <TabsTrigger value="bookmarks">Marcadores ({bookmarks.length})</TabsTrigger>
              <TabsTrigger value="notes">Notas ({notes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="chapters" className="mt-0 px-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <Button
                      key={chapter.id}
                      variant={index === currentChapter ? "default" : "ghost"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setCurrentChapter(index)}
                    >
                      <div>
                        <div className="font-medium text-sm mb-1">Capítulo {index + 1}</div>
                        <div className="text-xs opacity-75 line-clamp-2">{chapter.title}</div>
                        <div className="text-xs opacity-50 mt-1">
                          {chapter.reading_time} min • Páginas {chapter.page_start}-{chapter.page_end}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="bookmarks" className="mt-0 px-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-3">
                  {bookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div onClick={() => jumpToBookmark(bookmark)}>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {bookmark.chapter_title}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteBookmark(bookmark.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <blockquote className="text-sm italic border-l-2 border-blue-500 pl-2 mb-2">
                          "{bookmark.selected_text}"
                        </blockquote>
                        {bookmark.note && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{bookmark.note}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>Página {bookmark.page_number}</span>
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(bookmark.created_at)}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {bookmarks.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay marcadores aún</p>
                      <p className="text-xs">Selecciona texto para crear uno</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="notes" className="mt-0 px-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-3">
                  {notes.map((note) => (
                    <Card key={note.id} className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {note.chapter_title}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              setEditingNote(note)
                              setNewNoteTitle(note.title)
                              setNewNoteContent(note.content)
                              setShowNoteDialog(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => deleteNote(note.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm mb-2">{note.title}</h4>
                      {note.selected_text && (
                        <blockquote className="text-sm italic border-l-2 border-green-500 pl-2 mb-2">
                          "{note.selected_text}"
                        </blockquote>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">{note.content}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>Página {note.page_number}</span>
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(note.updated_at)}</span>
                      </div>
                    </Card>
                  ))}
                  {notes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay notas aún</p>
                      <p className="text-xs">Crea tu primera nota</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Chapter Navigation */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
              disabled={currentChapter === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="text-center">
              <h2 className="font-semibold text-lg">Capítulo {currentChapter + 1}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentChapterData.title}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
              disabled={currentChapter === chapters.length - 1}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Reading Content */}
          <div className="max-w-4xl mx-auto p-8">
            <div
              ref={contentRef}
              className="prose prose-lg dark:prose-invert max-w-none"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
              }}
              onMouseUp={handleTextSelection}
            >
              <h1 className="text-2xl font-bold mb-6">{currentChapterData.title}</h1>
              <div className="whitespace-pre-wrap leading-relaxed">{currentChapterData.content}</div>
            </div>

            {/* Chapter Actions */}
            <div className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              {selectedText && (
                <>
                  <Button variant="outline" size="sm" onClick={() => setShowBookmarkDialog(true)}>
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Crear Marcador
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowNoteDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nota
                  </Button>
                </>
              )}
              {!selectedText && (
                <Button variant="outline" size="sm" onClick={() => setShowNoteDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nota
                </Button>
              )}
            </div>

            {/* Chapter Summary */}
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tiempo de lectura estimado: {currentChapterData.reading_time} minutos</span>
                <span>
                  Páginas {currentChapterData.page_start}-{currentChapterData.page_end}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span>Marcadores en este capítulo: {chapterBookmarks.length}</span>
                <span>Notas en este capítulo: {chapterNotes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookmark Dialog */}
      <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Marcador</DialogTitle>
            <DialogDescription>Guarda este fragmento para referencia futura</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Texto seleccionado:</label>
              <blockquote className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-blue-500 italic">
                "{selectedText}"
              </blockquote>
            </div>
            <div>
              <label className="text-sm font-medium">Nota (opcional):</label>
              <Textarea
                placeholder="Agrega una nota personal sobre este marcador..."
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBookmarkDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={createBookmark}>Crear Marcador</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingNote ? "Editar Nota" : "Crear Nueva Nota"}</DialogTitle>
            <DialogDescription>
              {editingNote ? "Modifica tu nota existente" : "Crea una nota personal sobre este capítulo"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedText && (
              <div>
                <label className="text-sm font-medium">Texto seleccionado:</label>
                <blockquote className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-green-500 italic">
                  "{selectedText}"
                </blockquote>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Título de la nota:</label>
              <Input
                placeholder="Título de tu nota..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contenido:</label>
              <Textarea
                placeholder="Escribe tus reflexiones, ideas o comentarios..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNoteDialog(false)
                  setEditingNote(null)
                  setNewNoteTitle("")
                  setNewNoteContent("")
                  setSelectedText("")
                }}
              >
                Cancelar
              </Button>
              <Button onClick={editingNote ? updateNote : createNote}>
                {editingNote ? "Actualizar Nota" : "Crear Nota"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
