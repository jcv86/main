# PLAN DETALLADO DE IMPLEMENTACIÓN - A2: DÍAS 1-10
## LA INVESTIGACIÓN DE FUNDAMENTOS (Arc 1)

**Versión**: 1.0 - Completo y listo para build
**Estado**: Ready for Phase 1 Implementation
**Objetivo General**: Transformar profesionales dispersos en candidatos claros y validados mediante investigación profunda, recolección de evidencia, análisis de mercado e identificación de identidad profesional.

---

## VISIÓN GENERAL: 5 FASES

| Fase | Días | Tiempo Total | Arco | Objetivo |
|------|------|--------------|------|----------|
| **1** | 1-2 | 120-165 min | Entrada + Recolección | Contrato de ruta + Bóveda de evidencia |
| **2** | 3-4 | 105-165 min | Investigación | Mercado + Autoevaluación |
| **3** | 5-6 | 110-160 min | Testeo + Forja | Introducción + Identidad profesional |
| **4** | 7 | 60-90 min | Validación | A3 Checkpoint: Espejo de Carrera |
| **5** | 8-10 | 140-220 min | Narrativa | Memoria → Tareas → Valor |

**Total**: 535-800 minutos (~9-13 horas de experiencia del usuario) | **Build**: 31-43 horas desarrollo

---

## ESTILO VISUAL: PREMIUM DARK A2

### Paleta de Colores
- **Primary Brand**: `rgb(90, 90, 150)` — A2 Purple (bold headings, CTAs, accents)
- **Background Primary**: `#1a1a2e` o `#0f0f1e` (dark premium)
- **Card Background**: `rgba(90, 90, 150, 0.1)` — purple tint subtle
- **Text Primary**: `#ffffff` o `#f5f5f5`
- **Text Secondary**: `rgba(255, 255, 255, 0.7)`
- **Accent Success**: `rgb(80, 160, 170)` — teal (XP, checkmarks)
- **Accent Warning**: `rgb(239, 68, 68)` — red (errors, alerts)
- **Borders**: `rgba(90, 90, 150, 0.2)` — subtle, **NO white borders**

### Tipografía
- **H1-H2**: Bold, 28-36px, purple brand color
- **H3-H4**: Semi-bold, 18-24px, white
- **Body**: Regular, 14-16px, readable line-height 1.6
- **Button text**: Bold, 14px

### Componentes
- **Cards**: Rounded 12-16px, subtle shadow, purple tint background
- **Buttons**: Purple background, rounded corners, no white borders, hover state darker
- **Inputs**: Dark background, purple border on focus
- **Progress**: Animated bars with purple gradient
- **Dividers**: Subtle, purple tinted

### Layout
- **Max-width**: 1000px content
- **Padding**: 24-32px standard
- **Gap**: 16-24px between sections
- **Responsive**: 768px breakpoint

---

## FASE 1: DÍAS 1-2 — ENTRADA + RECOLECCIÓN
**Duración Total**: 120-165 minutos | **Arco**: Contrato + Evidencia

### DÍA 1 — EL CONTRATO DE RUTA
**Duración**: 75-90 min | **Tipo**: roadmap_gate | **A3 Access**: Locked

#### Propósito Educativo
"No estás rellenando un formulario. Estás creando un contrato con tu futuro profesional. 
Este documento vivirá fuera de DTC, será editable, validado y guardado. Es tu promesa de dirección clara."

#### Propósito de Negocio
- Validar que el usuario tiene dirección clara
- Crear primer artefacto externo (ruta profesional)
- Establecer 3 checkpoints de 30 días
- Validar coherencia interna antes de avanzar a evidencia

#### Experiencia Detallada

**Pantalla 1: Intro Premium**
```
Título: "EL CONTRATO DE TU RUTA"
Subtítulo: "Antes de entrenar, tienes que saber hacia dónde vas."

Párrafo: "Durante los próximos 90 días, no vamos a prepararte en el vacío. 
Vamos a construir candidatura real basada en investigación real, 
mercado real y evidencia real.

Hoy creamos el mapa. No tiene que ser perfecto. 
Tiene que ser claro, posible y tuyo."

CTA: "Comenzar Escaneo de Visión"
```

**Paso 1: DTC Vision Scan (3 preguntas abiertas con Coach Assist)**

**Pregunta 1: 30-Day Change**
```
Título: "¿QUÉ QUIERES CAMBIAR EN LOS PRÓXIMOS 30 DÍAS?"
Mini-lección: "No estamos preguntando por tu vida entera. Solo los próximos 30 días. 
¿Qué necesita transformar? ¿Qué sigue igual? ¿Qué no puede seguir así?"

Input: Textarea (mín 50 caracteres, máx 500)
- Placeholder: "ej. Necesito ir de 'ayudante administrativo' a 'coordinador profesional'..."
- Botón: "Asistencia Tu Coach" (OpenAI con contexto A1 si existe)
- Coach feedback si <50 chars: "Agrega más detalle"
- Coach feedback si vago: "Sé más específico"

Validación Pass: Mín 50 chars, específico, accionable
```

**Pregunta 2: Role/Environment Target**
```
Título: "¿QUÉ TIPO DE ROL, EMPRESA O ENTORNO QUIERES ACERCAR A TU VIDA?"
Mini-lección: "El mercado tiene miles de vacantes. Pero no todas son para ti. 
Sé específico: ¿qué rol? ¿qué sector? ¿remoto o híbrido? ¿empresa grande o startup?"

Input: Textarea (mín 50 caracteres)
- Placeholder: "ej. Product Manager en EdTech, remoto/híbrido, team de 5-15 personas..."
- Botón: Coach Assist
- Validación: Incluir título, sector, modalidad

Validación Pass: Título específico + sector + modalidad
```

**Pregunta 3: Main Blocker**
```
Título: "¿QUÉ PROBLEMA PROFESIONAL QUIERES DEJAR DE REPETIR?"
Mini-lección: "No es un defecto. Es un patrón que reconoces. 
Tal vez siempre quedas en el mismo rol. Tal vez no consigues confianza de entrevistadores. 
Tal vez tu CV no cuenta tu historia real."

Input: Textarea (mín 50 caracteres)
- Placeholder: "ej. Mi CV no explica el valor real que creé. 
  Siempre quedo como 'asistente' aunque hago trabajo de coordinador..."
- Botón: Coach Assist

Validación Pass: Patrón específico identificado
```

**Paso 2: Coach Creates Initial Route Hypothesis**
```
Formato automático (OpenAI + Coach):

"HIPÓTESIS DE RUTA INICIAL

Durante los próximos 30 días, tu ruta debe enfocarse en:

1. INVESTIGACIÓN (Días 1-10): [Descripción basada en sus respuestas]
2. CONSTRUCCIÓN (Días 11-20): [Next arc preview]
3. VALIDACIÓN (Días 21-30): [Final arc preview]

Tu dirección: [Rol objetivo]
Tu bloqueador: [Patrón a resolver]
Por qué: [Razón coherente]"

Opciones usuario:
- [ ] Aceptar
- [ ] Editar elementos
- [ ] Pedir versión más directa
- [ ] Pedir versión más simple
```

**Paso 3: Define 3 Route Gates**
```
PUERTA 1 — IDENTIDAD (Día 10)
Input: "¿Qué debe estar más claro sobre ti?"
Mini-lección: "No es tu perfil completo. Es UNA cosa específica."
Ejemplo: "Debo saber si realmente soy perfil de operaciones"
Validación: Mín 40 chars, específico

PUERTA 2 — EVIDENCIA (Día 20)
Input: "¿Qué prueba de valor debe existir?"
Ejemplo: "3 historias de impacto y CV con narrativa clara"
Validación: Mín 40 chars, medible

PUERTA 3 — MATERIAL (Día 30)
Input: "¿Qué activo profesional debe existir?"
Ejemplo: "CV completamente nuevo contando mi historia"
Validación: Mín 40 chars, tangible
```

**Paso 4: Generate External Roadmap Block**
```
Template automático pre-llenado con datos del usuario:

"MI RUTA PROFESIONAL DE 30 DÍAS

1. SITUACIÓN PROFESIONAL ACTUAL: [Pre-llenado]
2. OBJETIVO PRINCIPAL: [Pre-llenado]
3. PUERTA 1 — IDENTIDAD: [Pre-llenado]
4. PUERTA 2 — EVIDENCIA: [Pre-llenado]
5. PUERTA 3 — MATERIAL: [Pre-llenado]
6. RIESGOS PRINCIPALES: [Auto-detectado]
7. COMPROMISO DIARIO: [Calculado]
8. PRIMERAS ACCIONES EXTERNAS: [Auto-generado]"

El usuario lo personaliza/embellece afuera.
```

**Paso 5: Download/Export Options**
```
Opciones (con instrucciones):
[ ] Abrir plantilla en Notion (copia + abre Notion)
[ ] Descargar DOCX (genera .docx formateado)
[ ] Descargar Markdown (genera .md)
[ ] Copiar manualmente a Google Docs (copia texto)

Instrucción: "Edita afuera. Personaliza. Guarda. Vuelve cuando esté lista."
```

**Paso 6: Upload Back to DTC**
```
Formatos aceptados:
- PDF
- DOCX
- Markdown
- TXT
- Notion export
- Screenshot/texto pegado

Validación automática:
- ¿Contiene situación actual?
- ¿Contiene objetivo?
- ¿Contiene 3 puertas?
- ¿Está claro?

Si falta: "Tu documento todavía no tiene estructura completa."
```

**Paso 7: DTC Analysis & Scoring**
```
4 dimensiones, cada una 0-25 puntos:

1. CLARIDAD DE VISIÓN (25 pts)
   ¿Objetivo claramente articulado?
   ¿Específico vs vago? ¿Realista?

2. LÓGICA DE HITOS (25 pts)
   ¿3 puertas progresivas y coherentes?
   ¿Cada puerta construye sobre anterior?

3. REALISMO (25 pts)
   ¿Alcanzable en 30 días?
   ¿No inflado, no minúsculo?

4. ACCIONABILIDAD (25 pts)
   ¿Puedo convertir en acciones?
   ¿Verbos específicos?

TOTAL: 0-100 puntos
PASS RULE: 75+ puntos
```

**Pass Result (75+)**
```
Pantalla: "DÍA 1 APROBADO"
Breakdown: Puntuaciones por dimensión
Coach feedback: Síntesis de fortalezas

Acciones automáticas:
✓ Mark Day 1 completed
✓ Unlock Day 2
✓ Save roadmap a profile
✓ Award 50 XP
✓ Keep A3 locked

CTA: "Ir a Día 2 — La Bóveda de Evidencia"
```

**Fail Result (<75)**
```
Pantalla: "Tu ruta todavía es demasiado abstracta"
Hallazgos específicos con correcciones sugeridas:
- "Visión vaga: dijiste X pero no especificaste Y"
  → Acción: "Agrega..."
- [Múltiples hallazgos claros]

CTA Primario: "Corregir con Coach"
CTA Secundario: "Re-cargar documento editado"

Preservar: Documento guardado, no borrado
```

---

### DÍA 2 — LA BÓVEDA DE EVIDENCIA
**Duración**: 45-75 min | **Tipo**: field_action + evidence | **A3 Access**: Locked

#### Propósito Educativo
"No vamos a escribir logros bonitos todavía. Vamos a buscar pruebas reales. 
Tu historia no vive en tu cabeza. Vive en evidencia: documentos, mensajes, feedback, números. 
Hoy cazamos esa evidencia."

#### Propósito de Negocio
- Recolectar material real de usuario (no invented stories)
- Crear Evidence Vault como recurso persistente externo
- Clasificar evidencia automáticamente
- Identificar "Gold Pieces" (mejores pruebas)
- Alimentar Días 3-10 con material real

#### Experiencia Detallada

**Pantalla 1: Intro Premium**
```
Título: "LA BÓVEDA DE EVIDENCIA"
Subtítulo: "Donde vive tu verdadera historia profesional"

Párrafo: "Un CV perfecto sin evidencia es ficción.
Un LinkedIn bonito sin pruebas es marketing.

Hoy no escribimos. Cazamos.
Buscamos mensajes, archivos, documentos, feedback, números.
Todo lo que prueba que hiciste trabajo real."

CTA: "Crear Mi Bóveda"
```

**Paso 1: Create Evidence Vault (5 opciones)**
```
OPCIÓN 1: NOTION
"Crea página en Notion
Nombre: 'DTC Evidence Vault — [Tu Nombre]'
[Link template]"

OPCIÓN 2: GOOGLE DRIVE
"Nueva carpeta en Drive
Nombre: 'DTC Evidence Vault — [Tu Nombre]'
Pega link cuando esté lista"

OPCIÓN 3: CARPETA LOCAL
"Crea carpeta en tu compu
Nombre: 'DTC Evidence Vault — [Tu Nombre]'
Subirás screenshots después"

OPCIÓN 4: DTC DOCUMENTS
"Usa área de documentos aquí
(Más limitado pero funciona)"

OPCIÓN 5: CLOUD (OneDrive, iCloud, etc)
"Crea en tu servicio preferido"

Guardar opción + link/confirmación
```

**Paso 2: Vault Structure Suggested**
```
Secciones recomendadas (usuario personaliza):
1. Roles Anteriores
2. Proyectos
3. Problemas Resueltos
4. Feedback / Reconocimiento
5. Números / Resultados
6. Herramientas / Certificados
7. Portfolio / Entregables
8. Historias Laborales Significativas
```

**Paso 3: Real-World Evidence Hunt (Busca en 5 lugares)**
```
LUGAR 1: OLD CV / LINKEDIN
"¿CV viejo? ¿LinkedIn antiguo?
Cópialo a tu Bóveda.
Saca: roles, títulos exactos, empresas, fechas, herramientas"

LUGAR 2: EMAILS / WHATSAPP / SLACK / TEAMS
"Busca: 'gracias', 'perfecto', 'bien hecho', 'problema resuelto'
Copia emails con reconocimiento
Copia mensajes con feedback positivo
Copia números mencionados"

LUGAR 3: OLD FILES / REPORTS / SCREENSHOTS
"¿Guardaste documentos? Reportes? Screenshots?
Planillas de cálculo? Presentaciones?
Busca en: Documentos, Desktop, Drive, Dropbox, OneDrive"

LUGAR 4: MEMORIES OF WORKDAYS
"Piensa en momentos concretos:
- Resolviste problema difícil
- Ayudaste a alguien importante
- Aprendiste algo urgente
- Manejaste crisis
- Mejoraste métrica
- Nuevo rol/responsabilidad

Escribe: 'Recuerdo cuando [contexto específico]...'"

LUGAR 5: FEEDBACK FROM OTHERS
"¿Recomendaciones LinkedIn?
¿Cartas de recomendación?
¿Evaluaciones de desempeño?
¿Testimonios?
¿Feedback en 1-on-1s?"

TRACKER: [Checklist] ✓ Fragmento 1-7
Meta: Mínimo 7 fragmentos
```

**Paso 4: Upload/Paste Evidence to DTC**
```
OPCIÓN 1: NOTION EXPORT
"Export como PDF o Markdown
Sube → [drag & drop]"

OPCIÓN 2: SCREENSHOT
"Toma screenshots de tu estructura
Sube → [múltiples archivos]"

OPCIÓN 3: DOCX/TXT LIST
"Crea doc con 7 fragmentos descritos:
FRAGMENTO [X]: [tipo]
Descripción: [qué es]
Por qué importa: [razón]
Sube → [drag & drop]"

OPCIÓN 4: PASTED TEXT
"Copia todo el contenido
Pega en textarea → [large textarea]"

Validación: Mínimo 7 fragmentos detectables + contexto
```

**Paso 5: DTC Classifies Evidence**
```
Automaticamente clasifica cada fragmento:

[Barra de carga]

Para cada fragmento:
Tipo detectado: [logro / responsabilidad / reconocimiento / etc]
Categorías: ✓ [Cat1], ✓ [Cat2], ✓ [Cat3]
Potencial CV: [Síntesis de bullet point posible]
Potencial Entrevista: [Cómo podría usarse en STAR answer]
Potencial Habilidad: [Qué habilidad demuestra]
```

**Paso 6: Coach Selects 3 Gold Pieces**
```
Pantalla: "LAS 3 PIEZAS DE ORO"

Para cada una:

PIEZA DE ORO 1
──────────────
[Fragmento completo mostrado]

Por qué es poderosa:
"Este fragmento muestra [habilidad/impacto].
Es fuerte porque [razón específica]."

Potencial CV:
"Puede convertirse en: '[Bullet point sample]'"

Potencial Entrevista - STAR:
"S- [Situación]
T- [Tarea]
A- [Acción]
R- [Resultado]"

Potencial Habilidad:
"✓ Habilidad 1
✓ Habilidad 2
✓ Habilidad 3"

[PIEZA 2]
[PIEZA 3]
```

**Pass Result**
```
Pantalla: "DÍA 2 APROBADO"

Resumen:
✓ Bóveda creada
✓ 7+ fragmentos recolectados
✓ Cargado a DTC
✓ Clasificado
✓ 3 Piezas de Oro seleccionadas

Acciones:
✓ Mark Day 2 completed
✓ Unlock Day 3
✓ Save Vault link to profile
✓ Award 50 XP
✓ Keep A3 locked

Coach summary: "[Síntesis de fortalezas de sus 3 piezas]"

CTA: "Ir a Día 3 — El Espejo del Mercado"
```

---

## FASE 2: DÍAS 3-4 — INVESTIGACIÓN DE MERCADO
**Duración Total**: 105-165 minutos | **Arco**: Análisis de mercado + Autoevaluación

### DÍA 3 — EL ESPEJO DEL MERCADO
**Duración**: 45-75 min | **Tipo**: market_intel + mirror | **A3 Access**: Locked

#### Propósito Educativo
"Tu idea de quién eres es importante. Pero no es suficiente. El mercado tiene señales. 
Cuando ves que 5 vacantes diferentes piden 'Excel avanzado', eso NO es coincidencia. 
Eso es una SEÑAL. Hoy aprendes a escuchar al mercado."

**[Estructura similar a Día 1-2, con foco en:]**
- Búsqueda de 3 vacantes reales
- Captura de requisitos específicos
- Auto-extracción de señales de mercado (skills, tools, soft skills)
- Coach feedback: "Lo que el mercado quiere vs Lo que tú tienes"
- Identificación de brechas de entrenamiento

**Entregable**: Market Signal Report (clasificado por frecuencia)

---

### DÍA 4 — EL TABLERO DEL CANDIDATO
**Duración**: 60-90 min | **Tipo**: builder + mirror + evidence | **A3 Access**: Locked

#### Propósito Educativo
"Hoy cruzas todo. Quién eres (Día 1-2) + Qué quiere el mercado (Día 3) + Qué prueba tienes (Día 2) + Qué falta. 
Es como armar un detective board: conectas los hilos y ves el patrón."

**[Estructura:]**
- **Columna 1**: QUIÉN SOY (from Day 1-2)
- **Columna 2**: QUÉ QUIERE EL MERCADO (from Day 3)
- **Columna 3**: QUÉ PRUEBA TENGO (from Day 2 Gold Pieces)
- **Columna 4**: QUÉ FALTA (gaps analysis)

**Coach Output**: Candidate Hypothesis v1
"Todavía no te presentas fuerte porque [brecha]. Sin embargo, puedes posicionarte como [tipo], 
con fortalezas en [X, Y, Z]. Tu brecha real es [específica], no [falso problema]."

**Entregable**: Candidate Board (guardar en Notion/PDF)

---

## FASE 3: DÍAS 5-6 — FORJA DE IDENTIDAD
**Duración Total**: 110-160 minutos | **Arco**: Testeo + Validación

### DÍA 5 — EL PRIMER EXPERIMENTO PROFESIONAL
**Duración**: 45-75 min | **Tipo**: field_action + coach_forge + debrief | **A3 Access**: Locked

#### Propósito Educativo
"Tu historia suena bien en tu cabeza. ¿Suena bien en voz de otra persona? 
Hoy la testeas. La lanzas al mundo. Recibes feedback real."

**[Estructura:]**
- Build Version A: "Human version" (casual, natural)
- Build Version B: "Recruiter version" (professional, structured)
- Coach improve both (clarity, confidence, specificity, naturalness)
- Choose ONE real-world test:
  - Send to trusted person (ask: "¿Se entiende?)
  - Read aloud to yourself
  - Record 30-sec audio/video
  - Use as LinkedIn About draft
  - Send to DTC Coach for simulated recruiter feedback
- Capture reaction/feedback
- Create Version C: Final improved version

**Entregable**: Introducción Profesional v1 (3 versiones)

---

### DÍA 6 — LA FORJA DE IDENTIDAD
**Duración**: 60-80 min | **Tipo**: coach_forge + builder | **A3 Access**: Locked (prepares for Day 7)

#### Propósito Educativo
"No inventas un perfil. Lo descubres. A partir de toda tu evidencia, 
todas tus señales y tu historia testada, el patrón verdadero emerge. 
Hoy defines ese patrón en 3 versiones: para ti, para CV, para entrevista."

**[Estructura:]**
- Show recap: Days 1-5 summary
- Choose candidate archetype (from list of 9):
  - El Organizador, El Solucionador, El Operador Confiable, 
  - El Conector, El Constructor, El Analista, 
  - El Apoyo, El Buscador, El Cambiante
- Coach creates 3 identity versions:
  - Simple (for personal clarity)
  - Recruiter (for CV/job search)
  - Interview (for spoken answers)
- Identity stress test: Suena verdadera? Conecta con mercado? Sostenible con evidencia?
- Save externally + Upload/confirm

**Entregable**: Identidad Profesional v1 (validated, specific, believable)

---

## FASE 4: DÍA 7 — CHECKPOINT A3
**Duración**: 60-90 min | **Tipo**: a3_checkpoint | **A3 Access**: OPEN A3 Module 1 ONLY

### DÍA 7 — CHECKPOINT A3: ESPEJO DE CARRERA
**Propósito Educativo**
"Puntos de control. Este es el primero. Todo lo que aprendiste en Días 1-6 
se valida en A3. ¿Realmente entiendes quién eres? ¿Conecta con el mercado? 
¿Puedes sostenerlo en una entrevista?"

**[Estructura:]**
- Pre-checkpoint screen: Show materials used (Days 1-6 summary)
- Unlock A3 Module 1: "Espejo de Carrera" (existing production route)
- User completes A3 Module 1 workflow
- If completed:
  - Mark A3 Module 1 done
  - Award 80 XP (more than other days)
  - Mark Day 7 completed
  - Unlock Day 8
  - Keep A3 Module 2 locked until future checkpoint
- If incomplete:
  - Day 7 stays in progress
  - Day 8 locked
  - User returns to A3

**Entregable**: Career Mirror Card (from A3)

---

## FASE 5: DÍAS 8-10 — CONSTRUCCIÓN DE NARRATIVA
**Duración Total**: 140-220 minutos | **Arco**: Memoria → Tareas → Valor

### DÍA 8 — EXCAVACIÓN DE MEMORIA PROFESIONAL
**Duración**: 45-70 min | **Tipo**: evidence + field_action | **A3 Access**: No A3

#### Propósito Educativo
"Tu bóveda tiene fragmentos. Hoy buscamos historias completas. 
No logros bonitos todavía. Situaciones reales donde pasaron cosas."

**[Estructura:]**
- Import/Open Evidence Vault (from Day 2)
- Search in 5 places: CV, emails, files, memories, feedback
- Capture 10 work memories (raw, not polished):
  - Memory: [What happened]
  - Where: [Context]
  - Why I remember: [Significance]
- Coach tags each memory (possible CV bullet, interview story, skill proof, achievement, weak)
- Select best 5 memories
- Save "Mapa de Memorias Laborales" to Vault

**Validation**: 10 memories created, 5 selected, tagged, saved

**Entregable**: Mapa de Memorias Laborales

---

### DÍA 9 — DEL CAOS A LAS TAREAS
**Duración**: 45-70 min | **Tipo**: evidence + builder | **A3 Access**: No A3

#### Propósito Educativo
"Una memoria es 'recuerdo que fue confuso'. Una tarea es 'hice X con objetivo Y'. 
Hoy traduces tu memoria desordenada a tareas claras."

**[Estructura:]**
- Import 5 selected memories from Day 8
- For each memory, convert to task:
  - What exactly did I do?
  - Who was involved?
  - What tool/process/responsibility connected?
  - Was it repeated/urgent/difficult/important?
- Choose task type from 12 options (coordinación, comunicación, análisis, servicio, etc)
- Write clean task statement using formula:
  "Ayudé / gestioné / organicé / apoyé / coordiné / analicé / resolví ________ 
   con el objetivo de ________."
- Coach cleans language (user approves each)
- Save "Mapa de Claridad de Tareas"

**Validation**: 5 memories → 5 clean tasks with types

**Entregable**: Mapa de Claridad de Tareas

---

### DÍA 10 — POR QUÉ IMPORTABA
**Duración**: 50-80 min | **Tipo**: evidence + debrief | **A3 Access**: No A3 (prepares for Days 11-20)

#### Propósito Educativo
"El mercado no paga por actividad. Paga por impacto. Una tarea es lo que hiciste. 
El impacto es por qué importó. Hoy aprendes la diferencia. Y la practicas con cada tarea."

**[Estructura:]**
- Import 5 task statements from Day 9
- For each task, conduct Impact Autopsy:
  - Who benefited?
  - What problem did it solve?
  - What happened when done well?
  - What risk if done badly?
  - What skill does this prove?
- Select impact categories (multiple per task):
  - saved time, reduced confusion, helped client, improved quality,
  - prevented errors, supported team, organized process, improved communication,
  - maintained continuity, created trust, helped decision-making
- DTC converts task + impact into Value Seed:
  Formula: "Esta tarea creó valor porque ________."
  Example: Task "Organicé reportes" → Value Seed "...porque el equipo pudo 
  entender estado más rápido, reducir confusión, tomar mejores decisiones"
- Mini-gate: Day 10 identity + evidence review (checklist of all deliverables)
- Save "Reporte de Autopsia de Impacto"

**Mini-lesson**: "Una tarea es lo que hiciste. El impacto es por qué importó. 
El valor es el puente entre tu trabajo y la necesidad del empleador."

**Validation**: 5 tasks have impacts, categories, value seeds

**Entregable**: Reporte de Autopsia de Impacto

---

## SINCRONIZACIÓN Y STATE LOGIC (Días 1-10)

### Flujo de Desbloqueos
```
Day 1 Pass (75+) → Unlock Day 2
Day 2 Complete → Unlock Day 3
Day 3 Complete → Unlock Day 4
Day 4 Complete → Unlock Day 5
Day 5 Complete → Unlock Day 6
Day 6 Complete → Unlock Day 7
Day 7 Complete (A3 Module 1) → Unlock Day 8
Day 8 Complete → Unlock Day 9
Day 9 Complete → Unlock Day 10
Day 10 Complete → Unlock Day 11 (future)
```

### A3 Access Control
```
Days 1-6: A3 LOCKED (all modules)
Day 7: A3 Module 1 ONLY (Espejo de Carrera)
Days 8-10: A3 LOCKED (all modules)
A3 Module 2: LOCKED until future checkpoint day

If user tries to skip: "Esta ruta se construye paso a paso. 
Completa la misión anterior para desbloquear este día."

If tries early A3 access: "Este checkpoint todavía no está disponible. 
Tu ruta lo desbloqueará cuando completes la preparación necesaria."
```

### Saved State per Day
```
- Day status (pending/complete/failed)
- All user inputs
- Coach outputs
- DTC validation scores/results
- Deliverables (links, documents, files)
- Timestamp
- Next unlock
- XP awarded (50 per day, 80 for Day 7)
```

---

## CONEXIONES A FUTURAS FASES (Arc Preview)

### Days 11-20: CONSTRUCCIÓN DE CANDIDATURA (Arc 2 - Expected)
- Days 11-12: Modern CV (based on Day 10 Value Seeds)
- Days 13-15: STAR Interview Stories (convert value seeds to narratives)
- Days 16-17: LinkedIn optimization
- Day 18: Cover letter craft
- Days 19-20: Mock interviews + feedback
- **Day 20 A3 Checkpoint 2**: Career Narrative validation

### Days 21-30: VALIDACIÓN Y LANZAMIENTO (Arc 3 - Expected)
- Days 21-22: Networking + outreach strategy
- Days 23-24: Job search optimization
- Days 25-27: Application refinement
- Days 28-29: Final interview prep
- **Day 30**: Launch + first applications

### Days 31-90: INTENSIFICACIÓN Y OPTIMIZACIÓN (Arcs 4-6 - Future)
[Structure TBD based on user progress and feedback from Arcs 1-3]

---

## DATABASE SCHEMA REQUIREMENTS

```sql
-- New tables for A2 Days 1-10
a2_user_roadmaps
  - user_id, day, roadmap_text, status, score, passed
  
a2_evidence_vaults
  - user_id, vault_type (notion/drive/local/dtc), url, status
  
a2_evidence_fragments
  - user_id, fragment_id, type, description, classification, is_gold_piece
  
a2_market_signals
  - user_id, day, job_title, company, url, requirements, fears, strengths
  
a2_market_signals_extracted
  - user_id, signal_type (skill/tool/soft_skill), text, frequency, importance
  
a2_candidate_boards
  - user_id, column_1 (quien_soy), column_2 (que_quiere), 
    column_3 (que_prueba), column_4 (que_falta), hypothesis
  
a2_professional_identities
  - user_id, archetype, version_simple, version_recruiter, 
    version_interview, validated
  
a2_test_introductions
  - user_id, version_a, version_b, test_type, feedback, version_c
  
a2_work_memories
  - user_id, memory_id, text, where, why_remember, coach_tags, selected
  
a2_task_clarity_maps
  - user_id, task_id, memory_source, task_statement, task_type, coach_cleaned
  
a2_impact_autopsies
  - user_id, task_id, impacted_who, problem_solved, impact_categories, value_seed

-- Relationships
a2_day_submissions
  - user_id, day (1-10), status, deliverables (json), xp_earned, 
    completed_at, next_unlock

a2_coach_interactions
  - user_id, interaction_id, day, type (suggestion/feedback/improvement), 
    input, output, timestamp
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: Days 1-2 BUILD
**Estimated Effort**: 8-12 hours
- [ ] Day 1 complete experience (vision scan → hypothesis → gates → roadmap)
- [ ] Day 1 validation + scoring (clarity, logic, realism, actionability)
- [ ] External roadmap export/import (Notion, DOCX, Markdown, text)
- [ ] Day 2 evidence vault (5 options, structure template)
- [ ] Day 2 evidence capture + classification
- [ ] Day 2 Gold Pieces selection
- [ ] Coach assist integration (OpenAI + A1 context if exists)
- [ ] Database migrations
- [ ] Unlock logic (Day 1 pass → unlock Day 2)
- [ ] XP system (50 XP per day)
- [ ] E2E testing full Days 1-2 flow

**Deliverable**: Users can complete Days 1-2 fully, get validated, receive coach feedback

---

### Phase 2: Days 3-4 BUILD
**Estimated Effort**: 6-8 hours
- [ ] Day 3 market search (capture 3 vacancies, requirements, fears, strengths)
- [ ] Day 3 signal extraction (auto-parse skills, tools, soft skills, seniority)
- [ ] Day 3 Market Signal Report (frequency analysis, warnings)
- [ ] Day 4 Candidate Board (4-column interface)
- [ ] Day 4 Coach Hypothesis generation
- [ ] Board export (Notion, screenshot, DOCX, text)
- [ ] Unlock logic (Day 2 complete → unlock Day 3, etc)

**Deliverable**: Users can complete Days 3-4, compare themselves to market, understand gaps

---

### Phase 3: Days 5-6 BUILD
**Estimated Effort**: 5-7 hours
- [ ] Day 5 Introduction builder (Version A, Version B)
- [ ] Day 5 Coach improvement workflow
- [ ] Day 5 Test selection + feedback capture
- [ ] Day 5 Version C finalization
- [ ] Day 6 Identity archetype selector (9 archetypes)
- [ ] Day 6 Identity generator (3 versions: simple, recruiter, interview)
- [ ] Day 6 Stress test validation
- [ ] Day 6 Export/save identity

**Deliverable**: Users have tested introduction and validated professional identity

---

### Phase 4: Day 7 BUILD
**Estimated Effort**: 4-6 hours
- [ ] Day 7 pre-checkpoint screen (materials summary)
- [ ] A3 Module 1 unlock logic (only on Day 7, auto-lock after)
- [ ] A3 Module 1 completion tracking
- [ ] Day 7 completion trigger (when A3 Module 1 done)
- [ ] Day 8 unlock logic (after Day 7 complete)
- [ ] A3 Module 2 pre-lock (ensure stays locked)

**Deliverable**: Users can access A3 Module 1 checkpoint, get Career Mirror Card validated

---

### Phase 5: Days 8-10 BUILD
**Estimated Effort**: 8-10 hours
- [ ] Day 8 memory capture (10 memories in standard format)
- [ ] Day 8 Coach tagging (6 tag types)
- [ ] Day 8 Memory selection (top 5)
- [ ] Day 9 Task conversion interface (from 5 memories to 5 tasks)
- [ ] Day 9 Task type selector (12 types)
- [ ] Day 9 Coach language cleaning
- [ ] Day 10 Impact autopsy (5 questions per task)
- [ ] Day 10 Impact categories selector
- [ ] Day 10 Value Seed generation
- [ ] Day 10 Mini-gate checklist (all deliverables review)
- [ ] Day 10 completion + Day 11 unlock (placeholder)

**Deliverable**: Users have structured raw experience into tasks and identified impact value

---

## TESTING STRATEGY

**Unit Tests**:
- Coach assist responses (clarity, relevance)
- Scoring algorithms (all 4 dimensions)
- Market signal extraction (accuracy)
- Unlock logic (correct day opens)

**Integration Tests**:
- Full Day 1 flow (input → scoring → pass/fail → unlock)
- Full Day 2-10 flows
- A3 Module 1 trigger on Day 7
- XP accumulation
- External document import/export

**E2E Tests**:
- Complete Days 1-2 flow as first-time user
- Complete Days 3-4 flow
- Complete Days 5-6 flow
- Day 7 A3 checkpoint unlock + completion
- Complete Days 8-10 flow
- Verify all deliverables saved

**User Testing**:
- Time estimates (45-90 min per day, realistic?)
- Coach suggestions (helpful, relevant, actionable?)
- Clarity of instructions
- Export/import reliability
- Mobile responsiveness

---

## NEXT IMMEDIATE STEPS

1. ✅ **Plan Created** (this document)
2. 🔄 **Finalize Visual Design System**
   - [ ] Finalize Figma components (cards, buttons, inputs, status states)
   - [ ] Create Day 1-10 wireframes
   - [ ] Get design approval

3. 🔄 **Phase 1 Implementation** (Days 1-2)
   - [ ] Build Day 1 experience (Vision Scan → Hypothesis → Gates → Roadmap)
   - [ ] Build Day 1 scoring algorithm + validation
   - [ ] Build export/import for roadmaps
   - [ ] Build Day 2 Evidence Vault system
   - [ ] Build Evidence classification + Gold Pieces
   - [ ] Integrate OpenAI Coach Assist
   - [ ] Database setup + migrations
   - [ ] Testing + refinement
   - [ ] Deploy to staging

4. 🔄 **Phase 2-5 Sequential Implementation**
   - After Phase 1 passes testing
   - Each phase in order: 3-4, 5-6, 7, 8-10

5. 📋 **Days 11-30 Planning**
   - After Phase 1-5 user feedback collected
   - Design Arc 2 (Construction) and Arc 3 (Validation)
   - Ensure seamless flow from Days 10 → 11

---

## SUCCESS METRICS (Post-Implementation)

- **Completion Rate**: 80%+ of users complete all 10 days
- **Time Accuracy**: Days 1-10 average within 10% of estimated time
- **Coach Satisfaction**: 4.5+/5 rating on coach suggestions usefulness
- **Artifact Quality**: 90%+ of deliverables pass validation on first attempt
- **A3 Readiness**: 95%+ of users who reach Day 7 pass A3 Module 1 checkpoint
- **User Confidence**: 4+/5 self-reported confidence in professional identity after Day 10

---

**Document Version**: 1.0
**Last Updated**: [Date Generated]
**Status**: ✅ Complete, Ready for Phase 1 Build
**Total Plan Size**: 5 phases, 10 days, 535-800 user minutes, 31-43 dev hours
