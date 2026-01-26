# A3: SISTEMA DE ENTREVISTAS GUIADAS

## Descripción General

Sistema completo de entrevistas guiadas para el pilar **A3 Aterrizaje**, diseñado para:
1. **Educar** al usuario sobre qué es una entrevista y a qué se enfrenta
2. **Asistir** en su primera entrevista con feedback en tiempo real
3. **Transicionar** a entrevistas sin asistencia una vez esté preparado

## Arquitectura Implementada

### 1. Base de Datos (`a3-entrevistas-guiadas-schema.sql`)

**Tablas creadas:**

- `a3_entrevistas_guiadas` - Registro de entrevistas completadas
  - user_id, interview_type, preguntas_completadas, score, feedback, etc.
  
- `a3_entrevista_preguntas` - Banco de preguntas por tipo
  - pregunta, tipo_perfil (A/B/C/D), categoria, respuesta_ideal, etc.
  
- `a3_entrevista_feedback` - Feedback automático por respuesta
  - respuesta_usuario, evaluacion, puntos_fuertes, mejora, etc.
  
- `a3_entrevista_progreso` - Progreso del usuario en ciclos 30-60-90
  - user_id, ciclo, entrevistas_completadas, score_promedio, etc.

### 2. Lógica de Negocio (`lib/a3-entrevistas-logic.ts`)

**Funciones principales:**

- `getEntrevistaEducativa()` - Contenido educativo: QUÉ es, A QUÉ te enfrentas, CÓMO prepararse
- `obtenerPreguntasGuiadas()` - Preguntas personalizadas según perfil DISC
- `generarFeedbackRespuesta()` - Análisis automático de respuestas
- `calcularScoreEntrevista()` - Puntuación basada en CIP y contenido
- `obtenerRecomendaciones()` - Sugerencias de mejora

### 3. Componentes Frontend

#### `entrevista-guiada.tsx`
- Interfaz de entrevista con:
  - Panel educativo (lado izquierdo)
  - Pregunta actual (centro)
  - Feedback en vivo (derecha)
  - Progreso visual
  - Botones de pausa/reanudar

#### Página `/despega/aterrizaje/entrevistas/`
- Selector: Entrevista Guiada vs Sin Asistencia
- Dashboard de progreso
- Historial de entrevistas
- Acceso a banco de preguntas

## Flujo de Usuario

### Paso 1: Bienvenida Educativa
```
Usuario entra → Ve sección QUÉ ES UNA ENTREVISTA
  ├─ Definición clara
  ├─ Tipos de entrevistas
  ├─ A QUÉ TE ENFRENTAS (situaciones reales)
  └─ CÓMO PREPARARTE (tips prácticos)
```

### Paso 2: Primera Entrevista Guiada
```
INICIO → Pregunta 1 de 5
  ├─ Panel educativo: "En este tipo de pregunta, el entrevistador busca..."
  ├─ Usuario responde
  ├─ Feedback instantáneo: "Bien hecho. Mejora en..."
  ├─ Score parcial: 7/10
  └─ Siguiente pregunta...

FINAL → Resumen + Score total + Recomendaciones
```

### Paso 3: Transición a Sin Asistencia
```
Dashboard → "¿Listo para entrevistas sin asistencia?"
  ├─ Opción 1: Más entrevistas guiadas (mismos tipos)
  └─ Opción 2: Comenzar entrevistas sin asistencia (nuevos tipos)
```

## Personalización por Perfil DISC

Las preguntas varían según el tipo de perfil del usuario:

**Perfil A (Dominancia/Visionario):**
- ¿Cómo lidias con la presión y plazos ajustados?
- Cuéntame de un proyecto donde fuiste líder
- ¿Qué haces cuando desacuerdas con tu jefe?

**Perfil B (Influencia/Influenciador):**
- Cuéntame de un trabajo en equipo exitoso
- ¿Cómo te comunicas bajo presión?
- Dame un ejemplo de persuasión exitosa

**Perfil C (Cumplimiento/Analista):**
- ¿Cómo aseguras calidad en tu trabajo?
- Cuéntame de un error y cómo lo resolviste
- ¿Cómo organizas tareas complejas?

**Perfil D (Estabilidad/Estabilizador):**
- ¿Cómo apoyas a tu equipo?
- Cuéntame de cambios que manejaste bien
- ¿Cómo manejas conflictos?

## Integración con CIP

El score de la entrevista se ajusta por capacidad efectiva:

```
Score Base = 85 (respuesta excelente)

Si CIP < 30% (zona crítica):
  Score Ajustado = 85 * 0.7 = 59.5
  Feedback: "Tu respuesta es sólida pero considera tu capacidad actual"

Si CIP 30-68% (zona óptima):
  Score Ajustado = 85 * 1.0 = 85
  Feedback: "Excelente respuesta, mantén este ritmo"

Si CIP > 68% (zona sostenible):
  Score Ajustado = 85 * 1.15 = 97.75
  Feedback: "Respuesta excepcional, mantén este nivel de energía"
```

## Versiones: FREE vs PREMIUM

**FREE:**
- ✓ 1 entrevista guiada (5 preguntas)
- ✓ Contenido educativo
- ✓ Feedback básico
- ✗ Entrevistas sin asistencia
- ✗ Banco completo de preguntas
- ✗ Comparativas con otros usuarios

**PREMIUM:**
- ✓ Entrevistas guiadas ilimitadas
- ✓ Entrevistas sin asistencia (10+ tipos)
- ✓ Feedback avanzado + IA
- ✓ Comparativa anónima con otros usuarios
- ✓ Recomendaciones personalizadas 30-60-90
- ✓ Descarga de transcripciones

## Próximos Pasos

1. **Crear tabla de transiciones** - Cuándo habilitar sin-asistencia
2. **Implementar IA para feedback** - Análisis de texto con OpenAI/Groq
3. **Dashboard de progreso** - Visualización del avance en ciclos
4. **Banco de videos** - Ejemplos de respuestas buenas/malas
5. **Integración con empleadores** - Compartir scores (si usuario lo permite)

## Archivos Creados

- `/scripts/a3-entrevistas-guiadas-schema.sql` - Schema completo
- `/lib/a3-entrevistas-logic.ts` - Lógica de negocio
- `/components/entrevista-guiada.tsx` - Componente principal
- `/app/despega/aterrizaje/entrevistas/page.tsx` - Página de entrevistas
