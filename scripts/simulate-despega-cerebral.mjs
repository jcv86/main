// Simulación del flujo completo de Despega Cerebral
// Este script simula lo que pasa cuando un usuario completa el test

const DISC_QUESTIONS = [
  { id: 1, pregunta: "Cuando enfrento un desafío importante, tiendo a ser más:", opciones: ["Decidido y directo", "Optimista e inspirador", "Paciente y considerado", "Analítico y preciso"], dimensions: ["D", "I", "S", "C"] },
  { id: 2, pregunta: "En situaciones inesperadas, mi reacción natural es:", opciones: ["Tomar control rápidamente", "Ver lo positivo y motivar", "Mantener la calma y estabilidad", "Analizar antes de actuar"], dimensions: ["D", "I", "S", "C"] },
  { id: 3, pregunta: "Mi mayor fortaleza en el trabajo es:", opciones: ["Ejecutar y lograr resultados", "Conectar personas e ideas", "Mantener armonía y apoyo", "Garantizar calidad y precisión"], dimensions: ["D", "I", "S", "C"] },
  { id: 4, pregunta: "En un grupo, naturalmente:", opciones: ["Tomo la iniciativa y lidero", "Energizo y animo la participación", "Escucho y apoyo a otros", "Aseguro que todo esté bien hecho"], dimensions: ["D", "I", "S", "C"] },
  { id: 5, pregunta: "Cuando tomo decisiones importantes, considero más:", opciones: ["Velocidad y resultados", "Opiniones y entusiasmo del equipo", "Impacto en las personas", "Datos y análisis detallado"], dimensions: ["D", "I", "S", "C"] },
  { id: 6, pregunta: "Mi estilo de comunicación es más:", opciones: ["Directo y asertivo", "Abierto y conversacional", "Calmado y reflexivo", "Preciso y estructurado"], dimensions: ["D", "I", "S", "C"] },
  { id: 7, pregunta: "Ante conflictos, generalmente:", opciones: ["Confronto directamente", "Busco soluciones ganadoras para todos", "Intento mantener la paz", "Examino todos los hechos"], dimensions: ["D", "I", "S", "C"] },
  { id: 8, pregunta: "Mi ritmo de trabajo es:", opciones: ["Rápido e impulsivo", "Energético y flexible", "Constante y metódico", "Cuidadoso y deliberado"], dimensions: ["D", "I", "S", "C"] },
];

// Crear respuestas simuladas de un perfil FUERTE D-I (Emprendedor/Líder carismático)
function generateTestResponses() {
  const responses = {};
  
  DISC_QUESTIONS.forEach((q, idx) => {
    // Patrón: fuerte preferencia por opciones D e I
    const moreChoices = [0, 1]; // D o I
    const lessChoices = [2, 3]; // S o C
    
    responses[q.id] = {
      more: q.opciones[moreChoices[Math.random() < 0.6 ? 0 : 1]],
      less: q.opciones[lessChoices[Math.random() < 0.7 ? 2 : 3]]
    };
  });
  
  return responses;
}

// Calcular puntuaciones DISC
function calculateProfile(responses) {
  const scores = { D: 0, I: 0, S: 0, C: 0 };
  
  DISC_QUESTIONS.forEach(q => {
    const resp = responses[q.id];
    const moreOption = q.opciones.find(o => o === resp.more);
    const lessOption = q.opciones.find(o => o === resp.less);
    
    if (moreOption) {
      const dim = q.dimensions[q.opciones.indexOf(moreOption)];
      scores[dim]++;
    }
    if (lessOption) {
      const dim = q.dimensions[q.opciones.indexOf(lessOption)];
      scores[dim]--;
    }
  });
  
  // Normalizar a escala 0-100
  const maxScore = Math.max(...Object.values(scores));
  const minScore = Math.min(...Object.values(scores));
  const range = maxScore - minScore || 1;
  
  Object.keys(scores).forEach(key => {
    scores[key] = Math.round(((scores[key] - minScore) / range) * 100);
  });
  
  return scores;
}

// Simular el flujo completo
async function simulateCerebralFlow() {
  console.log('🧠 SIMULACIÓN: Despega Cerebral - Flujo Completo\n');
  console.log('=' .repeat(60));
  
  // 1. Usuario completa test
  console.log('\n1️⃣ USUARIO COMPLETA TEST CEREBRAL (28 preguntas)');
  console.log('─'.repeat(60));
  
  const responses = generateTestResponses();
  const profile = calculateProfile(responses);
  
  console.log(`✅ Test completado`);
  console.log(`\nRESPUESTA SIMULADA (primeras 3 preguntas):`);
  DISC_QUESTIONS.slice(0, 3).forEach(q => {
    const resp = responses[q.id];
    console.log(`  Q${q.id}: MÁS="${resp.more}" | MENOS="${resp.less}"`);
  });
  
  // 2. Calcular perfil
  console.log('\n\n2️⃣ PERFIL DISC CALCULADO');
  console.log('─'.repeat(60));
  
  const sorted = Object.entries(profile)
    .sort(([,a], [,b]) => b - a)
    .map(([dim, score]) => ({ dim, score }));
  
  console.log(`\nPuntajes Normalizados:`);
  sorted.forEach(({ dim, score }) => {
    const bar = '█'.repeat(Math.round(score / 5));
    console.log(`  ${dim}: ${bar} ${score}%`);
  });
  
  const primary = sorted[0].dim;
  const secondary = sorted[1].dim;
  console.log(`\n📊 PERFIL PRIMARIO: ${primary}`);
  console.log(`📊 PERFIL SECUNDARIO: ${secondary}`);
  console.log(`🎯 TIPO: ${getProfileType(primary, secondary)}`);
  
  // 3. Contexto de Conozcámonos 1 (simulado)
  console.log('\n\n3️⃣ CONTEXTO DE CONOZCÁMONOS 1');
  console.log('─'.repeat(60));
  
  const c1Context = {
    currentSituation: "Soy desarrollador fullstack con 5 años de experiencia, actualmente buscando transicionar a rol de Tech Lead",
    challenges: "Me cuesta delegar, tiendo a querer hacer todo yo mismo",
    goals: "Dominar habilidades de liderazgo y comunicación efectiva en 90 días"
  };
  
  console.log(`\nSituación Actual: "${c1Context.currentSituation}"`);
  console.log(`Desafíos: "${c1Context.challenges}"`);
  console.log(`Objetivos (90 días): "${c1Context.goals}"`);
  
  // 4. Llamar a endpoint de enhanced insights (simulado)
  console.log('\n\n4️⃣ GENERANDO INSIGHTS CON IA (OpenAI)');
  console.log('─'.repeat(60));
  console.log(`\n📡 Llamando: POST /api/despega/a1-enhanced-insights`);
  console.log(`   Body: { profile: ${JSON.stringify(profile)}, c1Context: {...} }`);
  
  const mockInsights = {
    fortalezasPrincipales: `Tu perfil ${primary}${secondary} (${getProfileType(primary, secondary)}) destaca por tu capacidad de tomar decisiones rápidas, tu capacidad de inspirar equipos y tu energía natural para ejecutar proyectos. Como desarrollador Tech Lead potencial, tienes las herramientas para liderar con impacto.`,
    areasDesarrollo: `Para crecer hacia Tech Lead, necesitas trabajar en escucha activa (dimensión S) y en análisis más detallado antes de ejecutar (dimensión C). Tu tendencia a querer hacerlo todo debe transformarse en delegación estratégica.`,
    estiloEntrevista: `En entrevistas, tu dinamismo y entusiasmo son tus mayores aliados. Asegúrate de dejar espacio para que el entrevistador hable, muestrea empatía por los desafíos del equipo, y presenta casos concretos de liderazgo.`,
    dinamicaEquipo: `Eres un motivador natural. Tu desafío es convertir esa energía en confianza delegada. Los mejores líderes ${primary} conocen cuándo frenar su impulso y permitir que otros brillen. Trabaja en esto.`,
    carreraAlign: `Caminos ideales: Engineering Manager, Technical Lead, Product Manager. Tu combinación ${primary}/${secondary} es perfecta para roles que requieren tanto ejecución como inspiración de equipos.`,
    comunicacionEfectiva: `Comunica tu visión con claridad, pero practica escuchar por 30 segundos sin interrumpir. Tu directividad es fortaleza, pero en liderazgo, a veces el silencio es más poderoso.`,
    gestionConflicto: `Tu tendencia a confrontar directamente es buena, pero agrega empatía. Antes de confrontar, pregunta "¿Qué te está haciendo sentir así?" Esto transforma conflictos en conexiones.`,
    proxiPaso: `Tu siguiente paso: Conozcámonos 2 (Fase de Exploración). Definirás tu plan concreto de 90 días para dominr liderazgo. Luego vendrán 2 semanas de entrenamiento intensivo y simulaciones de entrevista real.`
  };
  
  console.log(`\n✅ Insights generados exitosamente`);
  
  // 5. Mostrar resultado final
  console.log('\n\n5️⃣ PANTALLA FINAL: A1 REPORT CON INSIGHTS');
  console.log('═'.repeat(60));
  
  console.log(`\n🎯 TÍTULO: ✨ Tu Análisis Personalizado - ESE ERES TÚ`);
  console.log(`\nGrid de 8 Insights (animados con fade-in escalonado):\n`);
  
  const insightTitles = [
    '⭐ Tus Fortalezas Principales',
    '🎯 Áreas de Desarrollo',
    '🧠 Tu Estilo en Entrevistas',
    '👥 Dinámica de Equipo',
    '💼 Carreras Alineadas',
    '💬 Comunicación Efectiva',
    '🛡️ Gestión de Conflictos',
    '➡️ Tu Próximo Paso'
  ];
  
  insightTitles.forEach((title, idx) => {
    console.log(`\n  [${idx * 100}ms delay] ${title}`);
    const key = Object.keys(mockInsights)[idx];
    const preview = mockInsights[key].substring(0, 80) + '...';
    console.log(`  └─ ${preview}`);
  });
  
  console.log('\n\n' + '═'.repeat(60));
  console.log('🎉 RESULTADO ESPERADO:');
  console.log('   Usuario ve 8 tarjetas personalizadas que dicen EXACTAMENTE quién es');
  console.log('   ├─ WOW EFFECT: "¡Eso soy YO!"');
  console.log('   ├─ MOTIVACIÓN: Entiende su potencial y areas de crecimiento');
  console.log('   └─ CTA: "Continuar a Conozcámonos 2" con >70% clickthrough');
  console.log('═'.repeat(60));
  
  // Salida JSON para programación
  console.log('\n\n📊 SALIDA JSON (para integración):');
  console.log(JSON.stringify({
    profile,
    profileType: getProfileType(primary, secondary),
    primary,
    secondary,
    c1Context,
    insights: mockInsights,
    flow: [
      '1. Test completado: 28 preguntas respondidas',
      '2. Perfil calculado: D=85, I=75, S=30, C=25',
      '3. Contexto integrado: C1 data añadida',
      '4. IA genera insights: 8 insights personalizados',
      '5. BD cachea: Guardado en a1_profile_insights',
      '6. UI muestra: Grid con animaciones'
    ]
  }, null, 2));
}

function getProfileType(primary, secondary) {
  const combo = primary + secondary;
  const types = {
    'DI': 'Emprendedor/Líder Carismático',
    'DI': 'Ejecutor Inspirador',
    'DS': 'Líder Firme',
    'DC': 'Ejecutor Analítico',
    'ID': 'Motivador Decisivo',
    'IS': 'Animador Servicial',
    'IC': 'Inspirador Pensador',
    'SD': 'Delegador Estable',
    'SI': 'Facilitador Amable',
    'SC': 'Apoyo Confiable',
    'CD': 'Crítico Ejecutor',
    'CI': 'Pensador Comunicativo',
    'CS': 'Especialista Servicial',
  };
  return types[combo] || `Tipo ${primary}/${secondary}`;
}

simulateCerebralFlow().catch(console.error);
