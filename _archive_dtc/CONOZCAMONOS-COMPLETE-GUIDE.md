# Guía Completa: Conozcámonos 1 & 2

## Propósito General
El sistema **Conozcámonos** consta de dos etapas que actúan como onboarding inteligente:
- **Conozcámonos 1 (C1)**: Capturan tu contexto actual ANTES de hacer el Test Cerebral (A1)
- **Conozcámonos 2 (C2)**: Diseñan tu ruta de 90 días basada en tus objetivos

Esto asegura que todo lo que viene después esté personalizado para TI.

---

## CONOZCÁMONOS 1: "Antes de Empezar, Cuéntame Tu Historia"

### Descripción General
**Duración**: ~5-7 minutos  
**Total de Preguntas**: 7  
**Tipo de Preguntas**: 5 selección múltiple + 2 preguntas abiertas  
**Lo que sucede después**: Acceso a A1 Despega Cerebral  

### Propósito
Entender tu contexto actual para:
- Personalizar el reporte del Test Cerebral
- Identificar desafíos específicos
- Adaptar las recomendaciones a tu situación

### Experiencia del Usuario
1. Usuario ve intro con contexto claro: "Entiende tu contexto para que lo que viene después tenga sentido para ti"
2. Responde 7 preguntas, una a la vez
3. Para preguntas de texto: puede escribir, usar micrófono (Voice Input), o recibir sugerencias del Coach IA
4. Validación en tiempo real: respuestas demasiado cortas reciben feedback
5. Al terminar: guardado automático y redirección a A1 Cerebral Intro

---

### Preguntas Detalladas de Conozcámonos 1

#### **Pregunta 1: ¿Cuál es tu situación laboral actual?**
- **Tipo**: Selección múltiple (una opción)
- **Opciones**:
  - Empleado de tiempo completo
  - Empleado de tiempo parcial
  - Independiente/Freelancer
  - Desempleado
  - Estudiante
  - Otro
- **¿Qué hace el usuario?**: Selecciona su estado laboral actual
- **¿Qué hace el sistema?**: Usa esto para personalizar ejemplos y contexto de carrera

#### **Pregunta 2: ¿Cuántos años de experiencia profesional tienes?**
- **Tipo**: Selección múltiple (una opción)
- **Opciones**:
  - Menos de 1 año
  - 1-3 años
  - 3-5 años
  - 5-10 años
  - 10+ años
- **¿Qué hace el usuario?**: Selecciona su nivel de experiencia
- **¿Qué hace el sistema?**: Calibra las expectativas de desarrollo y recomendaciones

#### **Pregunta 3: ¿Qué es lo más desafiante en tu trabajo o carrera actualmente?**
- **Tipo**: Texto abierto
- **Límite**: 500 caracteres
- **Placeholder**: "Describe brevemente los principales desafíos..."
- **Métodos de entrada**:
  - Escribir directamente
  - Usar Voice Input (micrófono)
  - Solicitar sugerencias del Coach IA
- **Validación**: Sistema valida que no esté vacío y tenga contenido suficiente
- **¿Qué hace el usuario?**: Describe sus principales desafíos actuales
- **¿Qué hace el sistema?**: Identifica temas clave para personalización del reporte

#### **Pregunta 4: ¿Cuál es tu objetivo principal para los próximos 90 días?**
- **Tipo**: Texto abierto
- **Límite**: 500 caracteres
- **Placeholder**: "¿Qué quieres lograr? (ej: avanzar en el trabajo, cambiar de carrera, mejorar habilidades...)"
- **Métodos de entrada**:
  - Escribir directamente
  - Voice Input
  - Coach IA suggestions
- **Validación**: Sistema valida que sea una respuesta clara y orientada a objetivos
- **¿Qué hace el usuario?**: Define qué quiere lograr en 90 días
- **¿Qué hace el sistema?**: Crea la base para el plan de acción en Conozcámonos 2

#### **Pregunta 5: ¿Con quién vives actualmente?**
- **Tipo**: Selección múltiple (una opción)
- **Opciones**:
  - Solo/a
  - Con pareja
  - Con familia
  - Con amigos/compañeros
  - Otro
- **¿Qué hace el usuario?**: Selecciona su situación de convivencia
- **¿Qué hace el sistema?**: Entiende posibles barreras de tiempo/contexto

#### **Pregunta 6: ¿Cuánto tiempo disponible tienes por semana para tu transformación personal?**
- **Tipo**: Selección múltiple (una opción)
- **Opciones**:
  - Menos de 3 horas
  - 3-5 horas
  - 5-10 horas
  - 10-15 horas
  - Más de 15 horas
- **¿Qué hace el usuario?**: Define cuánto tiempo puede dedicar
- **¿Qué hace el sistema?**: Calibra intensidad y ritmo del programa

#### **Pregunta 7: ¿Qué forma de aprender funciona mejor para ti?**
- **Tipo**: Selección múltiple (una opción)
- **Opciones**:
  - Contenido escrito
  - Videos
  - Conversaciones/mentoría
  - Práctica directa/ejercicios
  - Combinación de varios
- **¿Qué hace el usuario?**: Selecciona su estilo de aprendizaje preferido
- **¿Qué hace el sistema?**: Personaliza el contenido y formato de las lecciones

---

### Flujo de Conozcámonos 1

```
START
  ↓
Intro Screen (Contexto claro)
  ↓
Pregunta 1-7 (Una a la vez)
  - Mostrar pregunta actual + indicador de progreso
  - Para texto: Voice Input + Coach IA disponibles
  - Validación en tiempo real
  ↓
Guardar respuestas en BD
  ↓
Marcar C1 como completado
  ↓
Redirigir a A1 Cerebral Intro
```

---

## CONOZCÁMONOS 2: "Diseña Tu Ruta de 90 Días"

### Descripción General
**Duración**: ~10-12 minutos  
**Total de Preguntas**: 8  
**Estructura**: 2 pasos (Paso 1: 4 preguntas, Paso 2: 4 preguntas)  
**Tipo de Preguntas**: Selección múltiple, texto abierto, checkboxes  
**Lo que sucede después**: Generación automática de Ruta A2 + Acceso a A2 Dashboard  

### Propósito
Diseñar un plan personalizado de 90 días basado en:
- Objetivo profesional específico
- Sector e industria
- Habilidades a desarrollar
- Disponibilidad horaria
- Estilo de aprendizaje
- Barreras específicas
- Estructura preferida

---

### Preguntas Detalladas de Conozcámonos 2

#### **PASO 1: Objetivo Específico y Contexto**

##### **Pregunta 1: ¿Cuál es tu objetivo profesional principal en los próximos 90 días?**
- **Tipo**: Texto abierto
- **Límite**: 300 caracteres
- **Placeholder**: "Ej: Conseguir un ascenso, cambiar de trabajo, desarrollar una habilidad..."
- **Métodos de entrada**: Escribir, Voice Input, Coach IA
- **¿Qué hace el usuario?**: Define su objetivo SMART
- **¿Qué hace el sistema?**: Centro del plan de 90 días

##### **Pregunta 2: ¿Qué sector o industria te interesa?**
- **Tipo**: Selección múltiple (una opción)
- **Opciones**:
  - Tecnología
  - Finanzas
  - Marketing y Publicidad
  - Recursos Humanos
  - Ventas
  - Educación
  - Consultoría
  - Emprendimiento
  - Otro
- **¿Qué hace el usuario?**: Selecciona su industria objetivo
- **¿Qué hace el sistema?**: Personaliza ejemplos, case studies, red de contactos

##### **Pregunta 3: ¿Qué rol específico buscas?**
- **Tipo**: Texto abierto
- **Límite**: 200 caracteres
- **Placeholder**: "Ej: Product Manager, Analista de Datos, Gerente de Proyectos..."
- **¿Qué hace el usuario?**: Especifica el rol exacto
- **¿Qué hace el sistema?**: Mapea habilidades requeridas

##### **Pregunta 4: ¿Cuáles son las principales habilidades que necesitas desarrollar?**
- **Tipo**: Checkboxes (múltiples selecciones)
- **Opciones** (seleccionar 2-5):
  - Liderazgo
  - Comunicación
  - Análisis de datos
  - Negociación
  - Gestión de proyectos
  - Pensamiento estratégico
  - Inteligencia emocional
  - Programación
  - Otro
- **¿Qué hace el usuario?**: Selecciona hasta 5 habilidades clave
- **¿Qué hace el sistema?**: Crea módulos de entrenamiento personalizados

---

#### **PASO 2: Estrategia de Acción y Personalización**

##### **Pregunta 5: ¿Cuántas horas por semana puedes dedicar a tu desarrollo?**
- **Tipo**: Selección múltiple (una opción)
- **Opciones**:
  - Menos de 5 horas
  - 5-10 horas
  - 10-15 horas
  - 15-20 horas
  - 20+ horas
- **¿Qué hace el usuario?**: Comprometerse con tiempo real
- **¿Qué hace el sistema?**: Calibra densidad del contenido

##### **Pregunta 6: ¿Prefieres aprender a través de:**
- **Tipo**: Checkboxes (múltiples selecciones)
- **Opciones** (seleccionar 2-4):
  - Cursos online
  - Libros
  - Mentoría
  - Experiencia práctica
  - Comunidades y networking
  - Certificaciones
  - Talleres presenciales
- **¿Qué hace el usuario?**: Selecciona métodos preferidos
- **¿Qué hace el sistema?**: Mezcla contenido en proporción indicada

##### **Pregunta 7: ¿Cuáles son tus principales barreras para el cambio?**
- **Tipo**: Checkboxes (múltiples selecciones)
- **Opciones** (identificar barreras reales):
  - Falta de tiempo
  - Falta de recursos económicos
  - Falta de confianza en mis habilidades
  - Miedo al fracaso
  - Falta de claridad sobre qué aprender
  - Responsabilidades familiares
  - No sé por dónde empezar
- **¿Qué hace el usuario?**: Identifica obstáculos actuales
- **¿Qué hace el sistema?**: Diseña estrategias de mitigación en el plan

##### **Pregunta 8: ¿Cómo prefieres que se estructure tu plan de 90 días?**
- **Tipo**: Selección múltiple (una opción)
- **Opciones**:
  - Estructura flexible - Yo decido el ritmo
  - Plan estructurado - Pasos claros cada semana
  - Híbrido - Estructura flexible con hitos clave
  - Intensivo - Máxima dedicación los primeros 30 días
- **¿Qué hace el usuario?**: Elige el framework que mejor funciona para él
- **¿Qué hace el sistema?**: Genera calendario y cronograma del plan

---

### Flujo de Conozcámonos 2

```
START
  ↓
Intro Screen con Paso 1/Paso 2 indicado
  ↓
PASO 1: Preguntas 1-4
  - Mostrar progreso: "X de Y preguntas"
  - Para texto: Voice Input + Coach IA
  - Validación
  ↓
[Button: "Siguiente" → Paso 2]
  ↓
PASO 2: Preguntas 5-8
  - Progreso actualizado
  - Validación de respuestas
  ↓
[Button: "Generar Mi Ruta"]
  ↓
Guardar respuestas en BD
  ↓
Marcar C2 como completado
  ↓
Generar automáticamente:
  - Ruta A2 (exploración)
  - Plan de 90 días
  - Recomendaciones de contenido
  ↓
Redirigir a A2 Dashboard
```

---

## Matriz de Uso del Sistema

| Pregunta | Tipo | Método Entrada | Usa Coach IA | Validación | Propósito |
|----------|------|-----------------|--------------|------------|-----------|
| C1-1 | Select | Click | No | Obligatoria | Contexto laboral |
| C1-2 | Select | Click | No | Obligatoria | Experiencia |
| C1-3 | Text | Write/Voice | Sí | Content length | Desafíos |
| C1-4 | Text | Write/Voice | Sí | Content quality | Objetivo |
| C1-5 | Select | Click | No | Obligatoria | Contexto social |
| C1-6 | Select | Click | No | Obligatoria | Disponibilidad |
| C1-7 | Select | Click | No | Obligatoria | Estilo |
| C2-1 | Text | Write/Voice | Sí | Content quality | Objetivo específico |
| C2-2 | Select | Click | No | Obligatoria | Industria |
| C2-3 | Text | Write/Voice | Sí | Length | Rol específico |
| C2-4 | Checkbox | Click | No | Min 2 | Habilidades |
| C2-5 | Select | Click | No | Obligatoria | Disponibilidad |
| C2-6 | Checkbox | Click | No | Min 2 | Métodos |
| C2-7 | Checkbox | Click | No | Min 1 | Barreras |
| C2-8 | Select | Click | No | Obligatoria | Estructura |

---

## Qué Ve el Usuario - Experiencia

### Durante Conozcámonos 1
1. **Header claro**: "Antes de Empezar, Cuéntame Tu Historia"
2. **Contexto**: "Entiendo tu contexto para que lo que viene después tenga sentido para ti"
3. **Una pregunta a la vez** (interfaz limpia)
4. **Para preguntas de texto**:
   - Textarea para escribir
   - Botón Voice Input (micrófono)
   - Botón "Tu Coach IA" con sugerencias
5. **Indicador**: "Pregunta X de 7"
6. **Validación en tiempo real**: Si respuesta es muy corta, muestra: "Necesito entender mejor tu contexto. Amplía un poco más tu respuesta."
7. **Navegación**: Botones "Atrás" y "Siguiente"

### Durante Conozcámonos 2
1. **Header**: "Diseña Tu Ruta de 90 Días"
2. **Indicador del paso**: "Paso 1: Define tu objetivo específico y estrategia" / "Paso 2: Personaliza tu plan de acción"
3. **Barra de progreso**: Visual + texto "Progreso: X de Y preguntas"
4. **Una sección a la vez** (no todas las preguntas juntas)
5. **Para Paso 1**: 4 preguntas
6. **Para Paso 2**: 4 preguntas
7. **Validación**: "Por favor responde todas las preguntas de este paso"
8. **Navegación**: "Atrás" | "Siguiente" o "Generar Mi Ruta" en el paso final

---

## Datos Guardados

### Conozcámonos 1
- Tabla: `canon_conozcamonos_1_responses`
- Campos: user_id, responses (JSON), completed_at
- Flag en `despega_user_profiles`: `onboarding_conozcamonos_1_completed`

### Conozcámonos 2
- Tabla: `canon_conozcamonos_2_responses`
- Campos: user_id, responses (JSON), completed_at
- Flags en `despega_user_profiles`: 
  - `onboarding_conozcamonos_2_completed`
  - `a2_route_generated` (trigger para generar ruta)

---

## Después de Completar

- **C1 → Redirección**: A1 Cerebral Intro
- **C2 → Redirección**: A2 Dashboard + Ruta de 90 Días generada automáticamente
