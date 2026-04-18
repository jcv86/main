"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Copy, Eye } from "lucide-react"

export default function CSVExportPage() {
  const [copied, setCopied] = useState(false)

  const csvData = `id,title,author,category,content_preview,tags,slug,read_count,created_at,updated_at
1,"Organízate con Eficacia","David Allen","Productividad","Sistema GTD completo para gestión de tareas y productividad personal. Método revolucionario de 5 pasos: Capturar, Aclarar, Organizar, Reflexionar y Comprometerse.","productividad,organización,gestión del tiempo,gtd,eficiencia","organizate-con-eficacia",2847,"2024-01-15T00:00:00Z","2024-01-20T00:00:00Z"
2,"Inteligencia Emocional","Daniel Goleman","Psicología","Desarrollo de habilidades emocionales para el éxito personal y profesional. Los 5 componentes: autoconciencia, autorregulación, motivación, empatía y habilidades sociales.","inteligencia emocional,psicología,liderazgo,relaciones,autoconciencia","inteligencia-emocional",3156,"2024-01-10T00:00:00Z","2024-01-18T00:00:00Z"
3,"Los 7 Hábitos de la Gente Altamente Efectiva","Stephen R. Covey","Desarrollo Personal","Principios fundamentales para la efectividad personal y profesional. Victoria privada, victoria pública y renovación continua.","desarrollo personal,liderazgo,efectividad,hábitos,principios","7-habitos-gente-altamente-efectiva",4521,"2024-01-05T00:00:00Z","2024-01-15T00:00:00Z"
4,"Cómo Ganar Amigos e Influir sobre las Personas","Dale Carnegie","Comunicación","Técnicas fundamentales para mejorar las relaciones interpersonales y la comunicación efectiva. Principios atemporales para el éxito social.","comunicación,relaciones interpersonales,liderazgo,influencia,habilidades sociales","como-ganar-amigos-influir-personas",5234,"2024-01-12T00:00:00Z","2024-01-22T00:00:00Z"
5,"Hábitos Atómicos","James Clear","Desarrollo Personal","Pequeños cambios que generan resultados extraordinarios. Las 4 leyes del cambio de comportamiento para construir buenos hábitos.","hábitos,cambio de comportamiento,automejora,sistemas,identidad","habitos-atomicos",6789,"2024-01-08T00:00:00Z","2024-01-25T00:00:00Z"
6,"Piense y Hágase Rico","Napoleon Hill","Desarrollo Personal","Los principios del éxito financiero y personal basados en el estudio de los hombres más ricos de América. 13 pasos hacia la riqueza.","riqueza,éxito,mentalidad,finanzas personales,motivación","piense-y-hagase-rico",3892,"2024-01-20T00:00:00Z","2024-01-28T00:00:00Z"
7,"El Arte de la Guerra","Sun Tzu","Estrategia","Estrategias militares aplicadas a los negocios y la vida. Principios de estrategia, liderazgo y toma de decisiones.","estrategia,liderazgo,toma de decisiones,negocios,filosofía","el-arte-de-la-guerra",4156,"2024-01-18T00:00:00Z","2024-01-26T00:00:00Z"
8,"Padre Rico, Padre Pobre","Robert Kiyosaki","Finanzas","Educación financiera fundamental. La diferencia entre activos y pasivos, y cómo construir riqueza a través de inversiones.","finanzas personales,inversión,educación financiera,riqueza,mentalidad","padre-rico-padre-pobre",5678,"2024-01-14T00:00:00Z","2024-01-24T00:00:00Z"
9,"El Poder del Ahora","Eckhart Tolle","Espiritualidad","Guía hacia la iluminación espiritual a través de la presencia y la conciencia del momento presente.","mindfulness,espiritualidad,conciencia,presente,meditación","el-poder-del-ahora",2934,"2024-01-22T00:00:00Z","2024-01-30T00:00:00Z"
10,"Mindset: La Actitud del Éxito","Carol Dweck","Psicología","La diferencia entre mentalidad fija y mentalidad de crecimiento. Cómo cambiar tu forma de pensar para alcanzar el éxito.","mentalidad,crecimiento,psicología,éxito,aprendizaje","mindset-actitud-del-exito",4287,"2024-01-16T00:00:00Z","2024-01-27T00:00:00Z"
11,"El Método Lean Startup","Eric Ries","Emprendimiento","Metodología para crear empresas exitosas mediante experimentación continua, aprendizaje validado y desarrollo iterativo.","emprendimiento,startup,innovación,metodología,negocios","el-metodo-lean-startup",3745,"2024-01-25T00:00:00Z","2024-02-02T00:00:00Z"
12,"Good to Great","Jim Collins","Liderazgo","Investigación sobre qué hace que las empresas pasen de ser buenas a ser grandiosas. Principios de liderazgo y gestión empresarial.","liderazgo,gestión,empresas,excelencia,investigación","good-to-great",4892,"2024-01-19T00:00:00Z","2024-01-29T00:00:00Z"
13,"El Ejecutivo Eficaz","Peter Drucker","Management","Principios fundamentales de la gestión efectiva. Cómo ser productivo y tomar decisiones acertadas en el liderazgo.","management,liderazgo,productividad,decisiones,gestión","el-ejecutivo-eficaz",3567,"2024-01-21T00:00:00Z","2024-01-31T00:00:00Z"
14,"Innovación y Emprendimiento","Peter Drucker","Innovación","Principios y prácticas de la innovación sistemática. Cómo crear y gestionar empresas innovadoras.","innovación,emprendimiento,creatividad,negocios,gestión","innovacion-y-emprendimiento",2876,"2024-01-23T00:00:00Z","2024-02-01T00:00:00Z"
15,"El Dilema del Innovador","Clayton Christensen","Innovación","Por qué las grandes empresas fallan ante la innovación disruptiva. Teoría de la innovación disruptiva.","innovación disruptiva,tecnología,negocios,estrategia,cambio","el-dilema-del-innovador",3234,"2024-01-26T00:00:00Z","2024-02-03T00:00:00Z"
16,"Estrategia del Océano Azul","W. Chan Kim, Renée Mauborgne","Estrategia","Cómo crear espacios de mercado sin competencia. Estrategias para innovar y diferenciarse en el mercado.","estrategia,innovación,mercado,competencia,diferenciación","estrategia-oceano-azul",4123,"2024-01-24T00:00:00Z","2024-02-04T00:00:00Z"
17,"El Cisne Negro","Nassim Nicholas Taleb","Filosofía","El impacto de eventos altamente improbables. Cómo lidiar con la incertidumbre y los eventos extremos.","incertidumbre,riesgo,filosofía,probabilidad,eventos extremos","el-cisne-negro",3456,"2024-01-27T00:00:00Z","2024-02-05T00:00:00Z"
18,"Antifrágil","Nassim Nicholas Taleb","Filosofía","Cómo beneficiarse del desorden y la volatilidad. Conceptos para prosperar en entornos inciertos.","antifragilidad,volatilidad,adaptabilidad,resiliencia,filosofía","antifragil",2987,"2024-01-28T00:00:00Z","2024-02-06T00:00:00Z"
19,"El Hombre en Busca de Sentido","Viktor Frankl","Psicología","Reflexiones sobre el sentido de la vida desde la experiencia en campos de concentración. Logoterapia y búsqueda de propósito.","sentido de vida,psicología,logoterapia,propósito,resiliencia","el-hombre-en-busca-de-sentido",5432,"2024-01-29T00:00:00Z","2024-02-07T00:00:00Z"
20,"Flow: La Psicología de la Experiencia Óptima","Mihaly Csikszentmihalyi","Psicología","El estado de flujo y cómo alcanzar la experiencia óptima. Psicología de la felicidad y el rendimiento máximo.","flow,psicología positiva,rendimiento,felicidad,concentración","flow-psicologia-experiencia-optima",3789,"2024-01-30T00:00:00Z","2024-02-08T00:00:00Z"
21,"Grit: El Poder de la Pasión y la Perseverancia","Angela Duckworth","Psicología","La importancia de la perseverancia y la pasión para alcanzar objetivos a largo plazo. Investigación sobre el éxito.","perseverancia,pasión,éxito,psicología,determinación","grit-poder-pasion-perseverancia",4567,"2024-02-01T00:00:00Z","2024-02-09T00:00:00Z"
22,"El Poder de los Hábitos","Charles Duhigg","Psicología","Cómo funcionan los hábitos y cómo cambiarlos. La ciencia detrás de la formación de hábitos personales y organizacionales.","hábitos,neurociencia,cambio,comportamiento,rutinas","el-poder-de-los-habitos",4234,"2024-02-02T00:00:00Z","2024-02-10T00:00:00Z"
23,"Pensar Rápido, Pensar Despacio","Daniel Kahneman","Psicología","Los dos sistemas de pensamiento: rápido e intuitivo vs. lento y deliberativo. Sesgos cognitivos y toma de decisiones.","psicología cognitiva,toma de decisiones,sesgos,pensamiento,economía conductual","pensar-rapido-pensar-despacio",5123,"2024-02-03T00:00:00Z","2024-02-11T00:00:00Z"
24,"El Arte de No Amargarse la Vida","Rafael Santandreu","Psicología","Técnicas de psicología cognitiva para ser más feliz y resiliente. Herramientas prácticas para el bienestar emocional.","bienestar emocional,psicología cognitiva,felicidad,resiliencia,autoayuda","el-arte-de-no-amargarse-la-vida",3876,"2024-02-04T00:00:00Z","2024-02-12T00:00:00Z"
25,"Liderazgo: El Poder de la Inteligencia Emocional","Daniel Goleman","Liderazgo","Aplicación de la inteligencia emocional en el liderazgo. Competencias emocionales para líderes efectivos.","liderazgo,inteligencia emocional,competencias,gestión de equipos,comunicación","liderazgo-poder-inteligencia-emocional",4345,"2024-02-05T00:00:00Z","2024-02-13T00:00:00Z"
26,"El Líder que No Tenía Cargo","Robin Sharma","Liderazgo","Principios de liderazgo personal sin necesidad de un título formal. Cómo influir y liderar desde cualquier posición.","liderazgo personal,influencia,desarrollo personal,responsabilidad,excelencia","el-lider-que-no-tenia-cargo",3654,"2024-02-06T00:00:00Z","2024-02-14T00:00:00Z"
27,"Los 5 Niveles de Liderazgo","John C. Maxwell","Liderazgo","Progresión del liderazgo desde la posición hasta el legado. Desarrollo de habilidades de liderazgo por niveles.","liderazgo,desarrollo,influencia,crecimiento,niveles","los-5-niveles-de-liderazgo",4098,"2024-02-07T00:00:00Z","2024-02-15T00:00:00Z"
28,"Crucial Conversations","Kerry Patterson","Comunicación","Herramientas para manejar conversaciones difíciles de manera efectiva. Técnicas de comunicación en situaciones críticas.","comunicación,conversaciones difíciles,diálogo,conflictos,negociación","crucial-conversations",3987,"2024-02-08T00:00:00Z","2024-02-16T00:00:00Z"
29,"Nonviolent Communication","Marshall Rosenberg","Comunicación","Comunicación no violenta basada en la empatía y la comprensión. Técnicas para resolver conflictos pacíficamente.","comunicación no violenta,empatía,resolución de conflictos,relaciones,paz","nonviolent-communication",3456,"2024-02-09T00:00:00Z","2024-02-17T00:00:00Z"
30,"Getting to Yes","Roger Fisher, William Ury","Negociación","Principios de negociación basada en intereses mutuos. Técnicas para llegar a acuerdos ganar-ganar.","negociación,acuerdos,resolución de conflictos,comunicación,diplomacia","getting-to-yes",4567,"2024-02-10T00:00:00Z","2024-02-18T00:00:00Z"
31,"El Vendedor Más Grande del Mundo","Og Mandino","Ventas","Principios atemporales de ventas y éxito personal a través de pergaminos con sabiduría antigua.","ventas,éxito,motivación,principios,sabiduría","el-vendedor-mas-grande-del-mundo",3234,"2024-02-11T00:00:00Z","2024-02-19T00:00:00Z"
32,"SPIN Selling","Neil Rackham","Ventas","Metodología de ventas basada en preguntas estratégicas: Situación, Problema, Implicación, Necesidad-beneficio.","ventas,metodología,preguntas,técnicas,negociación","spin-selling",3876,"2024-02-12T00:00:00Z","2024-02-20T00:00:00Z"
33,"The Challenger Sale","Matthew Dixon, Brent Adamson","Ventas","Nuevo modelo de ventas que desafía el pensamiento del cliente y aporta insights únicos.","ventas,metodología,insights,desafío,consultiva","the-challenger-sale",3567,"2024-02-13T00:00:00Z","2024-02-21T00:00:00Z"
34,"El Método Toyota","Jeffrey Liker","Management","Principios del sistema de producción Toyota aplicados a cualquier organización. Mejora continua y calidad.","toyota,lean,mejora continua,calidad,eficiencia","el-metodo-toyota",4123,"2024-02-14T00:00:00Z","2024-02-22T00:00:00Z"
35,"Six Sigma","Mikel Harry, Richard Schroeder","Calidad","Metodología de mejora de procesos para reducir defectos y variabilidad. Herramientas estadísticas para la calidad.","six sigma,calidad,procesos,estadística,mejora","six-sigma",2987,"2024-02-15T00:00:00Z","2024-02-23T00:00:00Z"
36,"El Objetivo","Eliyahu Goldratt","Management","Teoría de restricciones aplicada a la gestión empresarial. Cómo identificar y gestionar los cuellos de botella.","teoría de restricciones,gestión,procesos,optimización,eficiencia","el-objetivo",3789,"2024-02-16T00:00:00Z","2024-02-24T00:00:00Z"
37,"Scrum: El Arte de Hacer el Doble de Trabajo en la Mitad de Tiempo","Jeff Sutherland","Metodología","Metodología ágil para gestión de proyectos. Principios y prácticas de Scrum para equipos de alto rendimiento.","scrum,agile,gestión de proyectos,equipos,productividad","scrum-arte-doble-trabajo",4456,"2024-02-17T00:00:00Z","2024-02-25T00:00:00Z"
38,"The Phoenix Project","Gene Kim","Tecnología","Novela sobre DevOps y transformación digital. Principios de flujo de trabajo y colaboración en TI.","devops,tecnología,transformación digital,flujo,colaboración","the-phoenix-project",3234,"2024-02-18T00:00:00Z","2024-02-26T00:00:00Z"
39,"Crossing the Chasm","Geoffrey Moore","Marketing","Estrategias de marketing para productos tecnológicos innovadores. Cómo cruzar el abismo entre early adopters y mainstream.","marketing,tecnología,innovación,adopción,estrategia","crossing-the-chasm",3567,"2024-02-19T00:00:00Z","2024-02-27T00:00:00Z"
40,"El Dilema de la Innovación en los Servicios","Clayton Christensen","Servicios","Aplicación de la teoría de innovación disruptiva al sector servicios. Transformación de industrias de servicios.","servicios,innovación disruptiva,transformación,industria,cambio","dilema-innovacion-servicios",2876,"2024-02-20T00:00:00Z","2024-02-28T00:00:00Z"
41,"Design Thinking","Tim Brown","Innovación","Metodología de innovación centrada en el usuario. Proceso creativo para resolver problemas complejos.","design thinking,innovación,creatividad,usuario,metodología","design-thinking",4098,"2024-02-21T00:00:00Z","2024-03-01T00:00:00Z"
42,"El Modelo de Negocio Canvas","Alexander Osterwalder","Estrategia","Herramienta visual para desarrollar y documentar modelos de negocio. Metodología para la innovación empresarial.","modelo de negocio,canvas,estrategia,innovación,herramientas","modelo-negocio-canvas",4567,"2024-02-22T00:00:00Z","2024-03-02T00:00:00Z"
43,"Value Proposition Design","Alexander Osterwalder","Marketing","Cómo crear productos y servicios que los clientes realmente quieren. Diseño de propuestas de valor efectivas.","propuesta de valor,diseño,clientes,productos,servicios","value-proposition-design",3456,"2024-02-23T00:00:00Z","2024-03-03T00:00:00Z"
44,"El Emprendedor de Éxito","Guy Kawasaki","Emprendimiento","Guía práctica para emprendedores. Desde la idea hasta la ejecución exitosa de un negocio.","emprendimiento,startup,negocios,éxito,guía práctica","el-emprendedor-de-exito",3789,"2024-02-24T00:00:00Z","2024-03-04T00:00:00Z"
45,"Zero to One","Peter Thiel","Emprendimiento","Cómo construir empresas que crean cosas nuevas. Principios para la innovación y el monopolio creativo.","emprendimiento,innovación,monopolio,startup,creación","zero-to-one",4234,"2024-02-25T00:00:00Z","2024-03-05T00:00:00Z"
46,"The Hard Thing About Hard Things","Ben Horowitz","Emprendimiento","Consejos para construir un negocio cuando no hay respuestas fáciles. Experiencias reales de un emprendedor veterano.","emprendimiento,liderazgo,dificultades,experiencias,consejos","the-hard-thing-about-hard-things",3567,"2024-02-26T00:00:00Z","2024-03-06T00:00:00Z"
47,"Blitzscaling","Reid Hoffman","Crecimiento","Estrategias para escalar empresas de manera acelerada. Principios del crecimiento explosivo en startups.","crecimiento,escalamiento,startups,estrategia,velocidad","blitzscaling",3234,"2024-02-27T00:00:00Z","2024-03-07T00:00:00Z"
48,"The Innovator's Dilemma","Clayton Christensen","Innovación","Por qué las grandes empresas fallan. Teoría completa de la innovación disruptiva y sus implicaciones.","innovación disruptiva,empresas,fallos,teoría,implicaciones","the-innovators-dilemma",4123,"2024-02-28T00:00:00Z","2024-03-08T00:00:00Z"
49,"Competitive Strategy","Michael Porter","Estrategia","Técnicas para analizar industrias y competidores. Marco conceptual para la estrategia competitiva.","estrategia competitiva,análisis,industrias,competidores,marco","competitive-strategy",3876,"2024-03-01T00:00:00Z","2024-03-09T00:00:00Z"
50,"The Fifth Discipline","Peter Senge","Aprendizaje Organizacional","La organización que aprende. Disciplinas para construir organizaciones inteligentes y adaptativas.","aprendizaje organizacional,organizaciones,disciplinas,adaptación,inteligencia","the-fifth-discipline",4345,"2024-03-02T00:00:00Z","2024-03-10T00:00:00Z"
51,"Emotional Intelligence 2.0","Travis Bradberry","Inteligencia Emocional","Programa paso a paso para aumentar tu inteligencia emocional. Estrategias prácticas y evaluación personal.","inteligencia emocional,programa,estrategias,evaluación,desarrollo","emotional-intelligence-2-0",3654,"2024-03-03T00:00:00Z","2024-03-11T00:00:00Z"
52,"The 4-Hour Workweek","Tim Ferriss","Productividad","Cómo escapar de la rutina de 9-5 y vivir en cualquier lugar. Automatización y optimización del trabajo.","productividad,automatización,libertad,trabajo,optimización","the-4-hour-workweek",4987,"2024-03-04T00:00:00Z","2024-03-12T00:00:00Z"
53,"Deep Work","Cal Newport","Productividad","La habilidad de enfocarse sin distracción en tareas cognitivamente demandantes. Estrategias para el trabajo profundo.","trabajo profundo,concentración,productividad,enfoque,distracción","deep-work",4567,"2024-03-05T00:00:00Z","2024-03-13T00:00:00Z"
54,"Essentialism","Greg McKeown","Productividad","El arte disciplinado de hacer menos pero mejor. Cómo identificar y enfocarse en lo verdaderamente importante.","esencialismo,prioridades,enfoque,disciplina,simplicidad","essentialism",3789,"2024-03-06T00:00:00Z","2024-03-14T00:00:00Z"
55,"The One Thing","Gary Keller","Productividad","La sorprendente verdad detrás de los resultados extraordinarios. Enfoque en una sola cosa para máximo impacto.","enfoque,una cosa,resultados,productividad,simplicidad","the-one-thing",4234,"2024-03-07T00:00:00Z","2024-03-15T00:00:00Z"
56,"Multipliers","Liz Wiseman","Liderazgo","Cómo los mejores líderes hacen que todos sean más inteligentes. Diferencias entre multiplicadores y disminuidores.","liderazgo,multiplicadores,inteligencia,equipos,potencial","multipliers",3456,"2024-03-08T00:00:00Z","2024-03-16T00:00:00Z"
57,"Radical Candor","Kim Scott","Liderazgo","Cómo ser un jefe genial sin perder tu humanidad. Feedback directo y cuidado personal en el liderazgo.","liderazgo,feedback,cuidado,honestidad,humanidad","radical-candor",3987,"2024-03-09T00:00:00Z","2024-03-17T00:00:00Z"
58,"The Culture Code","Daniel Coyle","Cultura Organizacional","Los secretos de los grupos altamente exitosos. Cómo construir una cultura de alto rendimiento.","cultura,grupos,éxito,rendimiento,secretos","the-culture-code",3567,"2024-03-10T00:00:00Z","2024-03-18T00:00:00Z"
59,"Principles","Ray Dalio","Principios","Principios de vida y trabajo del fundador de Bridgewater. Filosofía para la toma de decisiones y el éxito.","principios,vida,trabajo,decisiones,filosofía","principles",4789,"2024-03-11T00:00:00Z","2024-03-19T00:00:00Z"
60,"The Lean Six Sigma Pocket Toolbook","Michael George","Calidad","Herramientas prácticas para la mejora de procesos. Combinación de Lean y Six Sigma en formato compacto.","lean six sigma,herramientas,procesos,mejora,calidad","lean-six-sigma-pocket-toolbook",2876,"2024-03-12T00:00:00Z","2024-03-20T00:00:00Z"
61,"Kanban","David Anderson","Metodología","Sistema visual para gestionar el trabajo y mejorar continuamente. Principios y prácticas del método Kanban.","kanban,visual,gestión,trabajo,mejora continua","kanban",3234,"2024-03-13T00:00:00Z","2024-03-21T00:00:00Z"
62,"The DevOps Handbook","Gene Kim","Tecnología","Cómo crear agilidad, confiabilidad y seguridad de clase mundial en organizaciones tecnológicas.","devops,agilidad,confiabilidad,seguridad,tecnología","the-devops-handbook",3789,"2024-03-14T00:00:00Z","2024-03-22T00:00:00Z"
63,"Accelerate","Nicole Forsgren","Tecnología","La ciencia de Lean Software y DevOps. Métricas y prácticas para construir y escalar organizaciones tecnológicas.","lean software,devops,métricas,prácticas,organizaciones","accelerate",3456,"2024-03-15T00:00:00Z","2024-03-23T00:00:00Z"
64,"The Manager's Path","Camille Fournier","Management","Guía para líderes tecnológicos navegando el crecimiento y el cambio. Desarrollo de carrera en management técnico.","management,liderazgo técnico,carrera,crecimiento,cambio","the-managers-path",4098,"2024-03-16T00:00:00Z","2024-03-24T00:00:00Z"
65,"Team Topologies","Matthew Skelton","Organizaciones","Organizando equipos de negocio y tecnología para una entrega rápida de software. Patrones organizacionales.","equipos,topologías,organización,entrega,software","team-topologies",3567,"2024-03-17T00:00:00Z","2024-03-25T00:00:00Z"
66,"The Infinite Game","Simon Sinek","Liderazgo","Cómo los grandes líderes juegan para continuar jugando. Mentalidad de juego infinito vs. juego finito.","juego infinito,liderazgo,mentalidad,continuidad,propósito","the-infinite-game",4234,"2024-03-18T00:00:00Z","2024-03-26T00:00:00Z"
67,"Start with Why","Simon Sinek","Liderazgo","Cómo los grandes líderes inspiran acción. El círculo dorado: por qué, cómo y qué.","propósito,inspiración,liderazgo,círculo dorado,acción","start-with-why",4567,"2024-03-19T00:00:00Z","2024-03-27T00:00:00Z"
68,"Leaders Eat Last","Simon Sinek","Liderazgo","Por qué algunos equipos se unen y otros no. Creación de círculos de seguridad en las organizaciones.","liderazgo,equipos,seguridad,unión,organizaciones","leaders-eat-last",3789,"2024-03-20T00:00:00Z","2024-03-28T00:00:00Z"
69,"The Speed of Trust","Stephen M.R. Covey","Confianza","Cómo la confianza cambia todo en los negocios y la vida. Economía de la confianza y su impacto.","confianza,negocios,vida,economía,impacto","the-speed-of-trust",3456,"2024-03-21T00:00:00Z","2024-03-29T00:00:00Z"
70,"Crucial Accountability","Kerry Patterson","Responsabilidad","Herramientas para mejorar las relaciones y los resultados. Cómo confrontar comportamientos problemáticos.","responsabilidad,relaciones,resultados,confrontación,comportamientos","crucial-accountability",3234,"2024-03-22T00:00:00Z","2024-03-30T00:00:00Z"`

  const downloadCSV = () => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "biblioteca-completa-70-libros.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(csvData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const bookCount = csvData.split("\n").length - 1

  return (
    <div className="min-h-screen bg-muted/5 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📚 CSV Export - Biblioteca Completa</h1>
          <p className="text-xl text-muted/60">{bookCount} libros de desarrollo profesional listos para descargar</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-blue/5 border-blue/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue">
                <Download className="h-5 w-5" />
                Descargar CSV
              </CardTitle>
              <CardDescription>Archivo completo con todos los datos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadCSV} className="w-full bg-blue hover:bg-blue" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Descargar CSV ({bookCount} libros)
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-green/5 border-green/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Copy className="h-5 w-5" />
                Copiar Datos
              </CardTitle>
              <CardDescription>Copia todo el contenido CSV</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                size="lg"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "¡Copiado!" : "Copiar CSV"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-purple/5 border-purple/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple">
                <Eye className="h-5 w-5" />
                Estadísticas
              </CardTitle>
              <CardDescription>Información del dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total libros:</span>
                  <span className="font-bold">{bookCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categorías:</span>
                  <span className="font-bold">15+</span>
                </div>
                <div className="flex justify-between">
                  <span>Idioma:</span>
                  <span className="font-bold">Español</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">📋 Vista Completa del CSV</CardTitle>
            <CardDescription>
              Aquí puedes ver todo el contenido del archivo CSV. Usa los botones de arriba para descargar o copiar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/90 text-green-400 p-6 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">{csvData}</pre>
            </div>
            <div className="mt-4 p-4 bg-blue/5 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Estructura del CSV:</h4>
              <ul className="text-sm text-blue space-y-1">
                <li>
                  <strong>id:</strong> Identificador único del libro
                </li>
                <li>
                  <strong>title:</strong> Título del libro en español
                </li>
                <li>
                  <strong>author:</strong> Autor(es) del libro
                </li>
                <li>
                  <strong>category:</strong> Categoría temática
                </li>
                <li>
                  <strong>content_preview:</strong> Resumen del contenido
                </li>
                <li>
                  <strong>tags:</strong> Etiquetas separadas por comas
                </li>
                <li>
                  <strong>slug:</strong> URL amigable
                </li>
                <li>
                  <strong>read_count:</strong> Número de lecturas
                </li>
                <li>
                  <strong>created_at/updated_at:</strong> Fechas en formato ISO
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
