-- Fix Soft Skills JSON formatting and ensure all questions are properly formatted
-- This script recreates the soft skills questions with proper JSON syntax

-- First, clear any existing soft skills questions
DELETE FROM test_questions WHERE test_type = 'soft-skills';

-- Insert properly formatted soft skills questions
INSERT INTO test_questions (test_type, question_text, question_type, options, correct_answer, points) VALUES
('soft-skills', '¿Cómo manejas las situaciones de alta presión en el trabajo?', 'multiple_choice', 
'[
  {"value": "a", "text": "Me mantengo calmado y organizo las tareas por prioridad"},
  {"value": "b", "text": "Busco ayuda de colegas o supervisores inmediatamente"},
  {"value": "c", "text": "Me siento abrumado pero trato de hacer lo mejor posible"},
  {"value": "d", "text": "Prefiero evitar estas situaciones cuando es posible"}
]', 'a', 4),

('soft-skills', 'Cuando trabajas en equipo, ¿cuál es tu rol natural?', 'multiple_choice',
'[
  {"value": "a", "text": "Líder que coordina y motiva al grupo"},
  {"value": "b", "text": "Colaborador que aporta ideas creativas"},
  {"value": "c", "text": "Organizador que mantiene el enfoque en objetivos"},
  {"value": "d", "text": "Mediador que resuelve conflictos"}
]', 'a', 4),

('soft-skills', '¿Cómo prefieres comunicar ideas complejas?', 'multiple_choice',
'[
  {"value": "a", "text": "Presentaciones visuales con gráficos y diagramas"},
  {"value": "b", "text": "Explicaciones verbales detalladas paso a paso"},
  {"value": "c", "text": "Documentos escritos bien estructurados"},
  {"value": "d", "text": "Ejemplos prácticos y demostraciones"}
]', 'a', 4),

('soft-skills', 'Ante un problema complejo, tu primer instinto es:', 'multiple_choice',
'[
  {"value": "a", "text": "Analizar todas las variables antes de actuar"},
  {"value": "b", "text": "Buscar soluciones que ya funcionaron antes"},
  {"value": "c", "text": "Consultar con expertos en el tema"},
  {"value": "d", "text": "Probar diferentes enfoques rápidamente"}
]', 'a', 4),

('soft-skills', '¿Cómo manejas las críticas constructivas?', 'multiple_choice',
'[
  {"value": "a", "text": "Las veo como oportunidades de crecimiento"},
  {"value": "b", "text": "Las analizo cuidadosamente antes de implementar cambios"},
  {"value": "c", "text": "Me afectan emocionalmente pero las considero"},
  {"value": "d", "text": "Prefiero que me las den por escrito para procesarlas"}
]', 'a', 4),

('soft-skills', 'En una reunión, tiendes a:', 'multiple_choice',
'[
  {"value": "a", "text": "Participar activamente y liderar discusiones"},
  {"value": "b", "text": "Escuchar atentamente y contribuir cuando es relevante"},
  {"value": "c", "text": "Tomar notas detalladas y hacer preguntas clarificadoras"},
  {"value": "d", "text": "Observar la dinámica del grupo antes de participar"}
]', 'a', 4),

('soft-skills', '¿Cómo te adaptas a cambios inesperados en proyectos?', 'multiple_choice',
'[
  {"value": "a", "text": "Me adapto rápidamente y busco nuevas oportunidades"},
  {"value": "b", "text": "Evalúo el impacto y ajusto mi planificación"},
  {"value": "c", "text": "Necesito tiempo para procesar antes de adaptarme"},
  {"value": "d", "text": "Busco mantener la estabilidad en lo posible"}
]', 'a', 4),

('soft-skills', 'Tu enfoque para resolver conflictos interpersonales es:', 'multiple_choice',
'[
  {"value": "a", "text": "Abordar el problema directamente con las partes involucradas"},
  {"value": "b", "text": "Buscar un mediador neutral para facilitar la conversación"},
  {"value": "c", "text": "Analizar las causas profundas antes de intervenir"},
  {"value": "d", "text": "Dar tiempo para que las emociones se calmen primero"}
]', 'a', 4),

('soft-skills', '¿Cómo gestionas tu tiempo cuando tienes múltiples deadlines?', 'multiple_choice',
'[
  {"value": "a", "text": "Creo un cronograma detallado y me apego a él"},
  {"value": "b", "text": "Priorizo por impacto y urgencia"},
  {"value": "c", "text": "Trabajo en bloques de tiempo concentrado"},
  {"value": "d", "text": "Delego o renegocio plazos cuando es necesario"}
]', 'b', 4),

('soft-skills', 'Cuando lideras un proyecto, tu estilo es:', 'multiple_choice',
'[
  {"value": "a", "text": "Directivo: doy instrucciones claras y superviso de cerca"},
  {"value": "b", "text": "Colaborativo: involucro al equipo en decisiones importantes"},
  {"value": "c", "text": "Delegativo: asigno responsabilidades y confío en el equipo"},
  {"value": "d", "text": "Coaching: guío y desarrollo las habilidades del equipo"}
]', 'b', 4),

('soft-skills', '¿Cómo manejas la incertidumbre en tu trabajo?', 'multiple_choice',
'[
  {"value": "a", "text": "La veo como una oportunidad para innovar"},
  {"value": "b", "text": "Busco información adicional para reducir la incertidumbre"},
  {"value": "c", "text": "Desarrollo múltiples escenarios y planes de contingencia"},
  {"value": "d", "text": "Me enfoco en lo que puedo controlar"}
]', 'a', 4),

('soft-skills', 'Tu método preferido para aprender nuevas habilidades es:', 'multiple_choice',
'[
  {"value": "a", "text": "Práctica directa con proyectos reales"},
  {"value": "b", "text": "Cursos estructurados y certificaciones"},
  {"value": "c", "text": "Mentoría y observación de expertos"},
  {"value": "d", "text": "Investigación independiente y experimentación"}
]', 'a', 4),

('soft-skills', '¿Cómo motivas a otros en tu equipo?', 'multiple_choice',
'[
  {"value": "a", "text": "Reconociendo públicamente sus logros"},
  {"value": "b", "text": "Proporcionando oportunidades de crecimiento"},
  {"value": "c", "text": "Siendo un ejemplo a seguir"},
  {"value": "d", "text": "Conectando su trabajo con el propósito mayor"}
]', 'a', 4),

('soft-skills', 'Ante una decisión difícil, tiendes a:', 'multiple_choice',
'[
  {"value": "a", "text": "Confiar en tu intuición y experiencia"},
  {"value": "b", "text": "Recopilar datos y analizar opciones sistemáticamente"},
  {"value": "c", "text": "Consultar con stakeholders relevantes"},
  {"value": "d", "text": "Considerar las implicaciones éticas y a largo plazo"}
]', 'b', 4),

('soft-skills', '¿Cómo construyes relaciones profesionales sólidas?', 'multiple_choice',
'[
  {"value": "a", "text": "Siendo consistentemente confiable y cumpliendo compromisos"},
  {"value": "b", "text": "Mostrando interés genuino en las personas"},
  {"value": "c", "text": "Compartiendo conocimientos y ayudando a otros"},
  {"value": "d", "text": "Manteniendo comunicación regular y transparente"}
]', 'a', 4),

('soft-skills', 'Tu enfoque para dar feedback a colegas es:', 'multiple_choice',
'[
  {"value": "a", "text": "Directo pero constructivo, enfocado en comportamientos específicos"},
  {"value": "b", "text": "Equilibrado, destacando fortalezas antes de áreas de mejora"},
  {"value": "c", "text": "Colaborativo, invitando a la autorreflexión"},
  {"value": "d", "text": "Orientado a soluciones, ofreciendo apoyo para mejorar"}
]', 'a', 4),

('soft-skills', '¿Cómo manejas las interrupciones durante trabajo concentrado?', 'multiple_choice',
'[
  {"value": "a", "text": "Establezco horarios específicos para estar disponible"},
  {"value": "b", "text": "Evalúo la urgencia antes de responder"},
  {"value": "c", "text": "Uso técnicas para minimizar distracciones"},
  {"value": "d", "text": "Comunico claramente mis períodos de concentración"}
]', 'b', 4),

('soft-skills', 'Cuando cometes un error, tu reacción típica es:', 'multiple_choice',
'[
  {"value": "a", "text": "Asumir responsabilidad inmediatamente y buscar soluciones"},
  {"value": "b", "text": "Analizar qué salió mal para evitar repetirlo"},
  {"value": "c", "text": "Comunicar transparentemente a los afectados"},
  {"value": "d", "text": "Implementar sistemas para prevenir errores similares"}
]', 'a', 4),

('soft-skills', '¿Cómo equilibras la calidad con los plazos ajustados?', 'multiple_choice',
'[
  {"value": "a", "text": "Identifico los elementos críticos de calidad no negociables"},
  {"value": "b", "text": "Comunico los trade-offs claramente a stakeholders"},
  {"value": "c", "text": "Busco eficiencias en el proceso sin comprometer estándares"},
  {"value": "d", "text": "Negocio plazos realistas basados en estándares de calidad"}
]', 'a', 4),

('soft-skills', 'Tu estrategia para mantenerte actualizado en tu campo es:', 'multiple_choice',
'[
  {"value": "a", "text": "Participar activamente en comunidades profesionales"},
  {"value": "b", "text": "Dedicar tiempo regular a lectura y investigación"},
  {"value": "c", "text": "Asistir a conferencias y eventos de la industria"},
  {"value": "d", "text": "Experimentar con nuevas herramientas y metodologías"}
]', 'a', 4),

('soft-skills', '¿Cómo abordas la colaboración con personas de diferentes culturas?', 'multiple_choice',
'[
  {"value": "a", "text": "Investigo sobre sus contextos culturales previamente"},
  {"value": "b", "text": "Adapto mi estilo de comunicación según la situación"},
  {"value": "c", "text": "Busco puntos en común y construyo desde ahí"},
  {"value": "d", "text": "Pregunto directamente sobre preferencias de trabajo"}
]', 'b', 4),

('soft-skills', 'Cuando necesitas influir sin autoridad formal, tu estrategia es:', 'multiple_choice',
'[
  {"value": "a", "text": "Construir relaciones sólidas basadas en confianza"},
  {"value": "b", "text": "Presentar argumentos lógicos con datos de respaldo"},
  {"value": "c", "text": "Encontrar beneficios mutuos y crear alianzas"},
  {"value": "d", "text": "Demostrar expertise y credibilidad en el tema"}
]', 'a', 4),

('soft-skills', '¿Cómo manejas la sobrecarga de información en tu trabajo?', 'multiple_choice',
'[
  {"value": "a", "text": "Filtro información por relevancia y prioridad"},
  {"value": "b", "text": "Uso herramientas y sistemas para organizar datos"},
  {"value": "c", "text": "Establezco rutinas regulares de revisión y síntesis"},
  {"value": "d", "text": "Delego el procesamiento de información cuando es posible"}
]', 'a', 4),

('soft-skills', 'Tu enfoque para el networking profesional es:', 'multiple_choice',
'[
  {"value": "a", "text": "Construir relaciones auténticas a largo plazo"},
  {"value": "b", "text": "Participar activamente en eventos de la industria"},
  {"value": "c", "text": "Ofrecer valor antes de pedir favores"},
  {"value": "d", "text": "Mantener contacto regular con conexiones clave"}
]', 'a', 4),

('soft-skills', '¿Cómo gestionas el estrés durante períodos intensos de trabajo?', 'multiple_choice',
'[
  {"value": "a", "text": "Mantengo rutinas de ejercicio y descanso"},
  {"value": "b", "text": "Practico técnicas de mindfulness y relajación"},
  {"value": "c", "text": "Busco apoyo en colegas y supervisores"},
  {"value": "d", "text": "Reorganizo prioridades y delego cuando es posible"}
]', 'a', 4),

('soft-skills', 'Cuando presentas ideas a audiencias escépticas, tu estrategia es:', 'multiple_choice',
'[
  {"value": "a", "text": "Preparar evidencia sólida y casos de estudio"},
  {"value": "b", "text": "Comenzar con puntos de acuerdo común"},
  {"value": "c", "text": "Abordar directamente las objeciones principales"},
  {"value": "d", "text": "Usar storytelling para hacer ideas más relacionables"}
]', 'a', 4),

('soft-skills', '¿Cómo fomentas la innovación en tu equipo o área?', 'multiple_choice',
'[
  {"value": "a", "text": "Creo espacios seguros para experimentar y fallar"},
  {"value": "b", "text": "Reconozco y celebro ideas creativas"},
  {"value": "c", "text": "Proporciono tiempo y recursos para exploración"},
  {"value": "d", "text": "Conecto al equipo con tendencias externas e inspiración"}
]', 'a', 4);

-- Verify the insertion
SELECT COUNT(*) as total_questions FROM test_questions WHERE test_type = 'soft-skills';

-- Update any existing soft skills test results to ensure compatibility
UPDATE test_results 
SET results = jsonb_build_object(
  'score', COALESCE((results->>'score')::int, 75),
  'answers', COALESCE(results->'answers', '[]'::jsonb),
  'strengths', COALESCE(results->'strengths', '["Comunicación", "Liderazgo", "Adaptabilidad"]'::jsonb),
  'areas_for_improvement', COALESCE(results->'areas_for_improvement', '["Gestión del tiempo", "Delegación"]'::jsonb),
  'recommendations', COALESCE(results->'recommendations', '["Desarrollar habilidades de presentación", "Practicar técnicas de feedback"]'::jsonb)
)
WHERE test_type = 'soft-skills';

COMMIT;
