# 📚 DOCUMENTACIÓN COMPLETA - DESPEGARTUCCARRERA (DTC)

**Versión:** 2025.1.1.04-SUPREMO  
**Última actualización:** Enero 2025  
**Stack:** Next.js 15, React 19, Supabase, OpenAI GPT-4, Vercel

---

## 📋 TABLA DE CONTENIDOS

1. [Arquitectura General](#arquitectura-general)
2. [Rutas Públicas](#rutas-públicas)
3. [Rutas de Tests Psicométricos](#rutas-de-tests-psicométricos)
4. [Rutas de Usuario](#rutas-de-usuario)
5. [Rutas de Administración](#rutas-de-administración)
6. [API Endpoints](#api-endpoints)
7. [Componentes Principales](#componentes-principales)
8. [Librerías y Utilidades](#librerías-y-utilidades)
9. [Base de Datos](#base-de-datos)
10. [Sistema de IA](#sistema-de-ia)
11. [Integraciones](#integraciones)
12. [Cron Jobs](#cron-jobs)
13. [Variables de Entorno](#variables-de-entorno)

---

## 🏗️ ARQUITECTURA GENERAL

### Stack Tecnológico

\`\`\`
Frontend:
- Next.js 15.2.4 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3.4.17
- shadcn/ui (Radix UI)

Backend:
- Next.js API Routes
- Supabase (PostgreSQL)
- OpenAI GPT-4
- Vercel AI SDK 3.4.32

Infraestructura:
- Vercel (Hosting)
- Supabase (Database + Auth)
- Vercel Blob (File Storage)
- Vercel Cron (Scheduled Jobs)
\`\`\`

### Estructura de Carpetas

\`\`\`
/app                    # Next.js App Router
  /api                  # API Routes (63 endpoints)
  /test                 # Tests psicométricos (6 tests)
  /admin                # Panel de administración (15 páginas)
  /biblioteca           # Sistema de libros
  /cerebro              # Análisis multi-test
  /dashboard            # Dashboard de usuario
  /auth                 # Autenticación
  
/components             # Componentes React (57 componentes)
/lib                    # Utilidades y lógica de negocio (30 archivos)
/scripts                # Scripts SQL de base de datos
/public                 # Archivos estáticos
\`\`\`

---

## 🌐 RUTAS PÚBLICAS

### Landing y Marketing

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `app/page.tsx` | Landing page optimizada con SEO |
| `/faq` | `app/faq/page.tsx` | Preguntas frecuentes interactivas |
| `/careers` | `app/careers/page.tsx` | Información de carreras |
| `/demo` | `app/demo/page.tsx` | Demo del sistema DISC |

**Componentes principales:**
- `components/landing-page-optimized.tsx` - Landing con JSON-LD, Open Graph
- `components/interactive-faq.tsx` - FAQ con búsqueda y categorías
- `components/llmo-optimized-footer.tsx` - Footer optimizado para SEO

**Características SEO:**
- Sitemap dinámico: `app/sitemap.ts`
- Robots.txt: `app/robots.ts`
- Manifest PWA: `app/manifest.ts`
- JSON-LD structured data
- Open Graph tags
- Twitter cards

---

## 🧠 RUTAS DE TESTS PSICOMÉTRICOS

### Tests Disponibles

#### 1. Test DISC (Despega Cerebral)
**Ruta:** `/test/disc`  
**Resultados:** `/test/disc/results`  
**Archivos:**
- `app/test/disc/page.tsx` - Test principal
- `app/test/disc/disc-client.tsx` - Lógica del cliente
- `app/test/disc/results/page.tsx` - Página de resultados

**Características:**
- 28 preguntas de comportamiento laboral
- 4 dimensiones: Dominancia, Influencia, Estabilidad, Cumplimiento
- Gráfico radial de resultados
- Integración con Sofia (coach emocional)
- Modo demo disponible

**API relacionada:**
- `POST /api/test-results` - Guardar resultados
- `GET /api/test-results` - Obtener resultados históricos

---

#### 2. Test MBTI (Mapa de Personalidad)
**Ruta:** `/test/mbti`  
**Resultados:** `/test/mbti/results`  
**Archivos:**
- `app/test/mbti/page.tsx` - Test principal
- `app/test/mbti/results/page.tsx` - Resultados detallados

**Características:**
- 60 preguntas de personalidad
- 16 tipos de personalidad (INTJ, ENFP, ISTJ, etc.)
- Análisis por dimensión: E/I, S/N, T/F, J/P
- Fortalezas y áreas de desarrollo
- Carreras recomendadas
- Integración con Sofia

**Tabla DB:** `mbti_results`

---

#### 3. Test Big Five (5 Dimensiones)
**Ruta:** `/test/big-five`  
**Resultados:** `/test/big-five/results`  
**Archivos:**
- `app/test/big-five/page.tsx` - Test principal
- `app/test/big-five/results/page.tsx` - Resultados

**Características:**
- 50 preguntas
- 5 dimensiones: Apertura, Responsabilidad, Extraversión, Amabilidad, Neuroticismo
- Percentiles comparativos
- Gráficos de barras
- Interpretación científica
- Integración con Sofia

**Tabla DB:** `big_five_results`

---

#### 4. Test RIASEC (Brújula Vocacional)
**Ruta:** `/test/riasec`  
**Resultados:** `/test/riasec/results`  
**Archivos:**
- `app/test/riasec/page.tsx` - Test principal
- `app/test/riasec/results/page.tsx` - Resultados

**Características:**
- 48 preguntas de intereses vocacionales
- 6 tipos: Realista, Investigador, Artístico, Social, Emprendedor, Convencional
- Carreras recomendadas por tipo
- Gráfico hexagonal
- Integración con Dani (mentor estratégico)

**Tabla DB:** `riasec_results`

---

#### 5. Test Soft Skills (Competencias Despega)
**Ruta:** `/test/soft-skills`  
**Resultados:** `/test/soft-skills/results`  
**Archivos:**
- `app/test/soft-skills/page.tsx` - Test principal
- `app/test/soft-skills/results/page.tsx` - Resultados

**Características:**
- 60 preguntas
- 12 competencias evaluadas
- Gráficos de radar
- Plan de desarrollo personalizado
- Integración con Dani

**Tabla DB:** `soft_skills_results`

---

#### 6. Test Inteligencia Emocional
**Ruta:** `/test/emotional-intelligence`  
**Resultados:** `/test/emotional-intelligence/results`  
**Archivos:**
- `app/test/emotional-intelligence/page.tsx` - Test principal
- `app/test/emotional-intelligence/results/page.tsx` - Resultados

**Características:**
- 40 preguntas
- 5 dimensiones de IE
- Análisis detallado
- Recomendaciones de mejora

**Tabla DB:** `emotional_intelligence_results`

---

### Navegación de Tests

**Ruta:** `/test`  
**Archivo:** `app/test/page.tsx`  
**Componente:** `components/test-navigation-flow.tsx`

Página central para navegar entre todos los tests disponibles.

---

## 👤 RUTAS DE USUARIO

### Dashboard Principal
**Ruta:** `/dashboard`  
**Archivo:** `app/dashboard/page.tsx`  
**Componente:** `components/dashboard-content.tsx`

**Secciones:**
1. **Resumen** - Tests completados, progreso general
2. **Tests** - Acceso rápido a tests psicométricos
3. **Análisis IA** - Insights del sistema Cerebro
4. **Calendario** - Actividades y recordatorios
5. **Biblioteca** - Libros en progreso
6. **Metas** - Objetivos de carrera
7. **Logros** - Sistema de gamificación

**Componentes relacionados:**
- `components/activity-calendar.tsx` - Calendario interactivo
- `components/gamification-system.tsx` - Logros y badges
- `components/goal-tracker.tsx` - Seguimiento de metas
- `components/daily-career-tip.tsx` - Consejo diario

---

### Sistema Cerebro (Análisis Multi-Test)

#### Cerebro Básico
**Ruta:** `/cerebro`  
**Archivo:** `app/cerebro/page.tsx`

**Características:**
- Análisis combinado de múltiples tests
- Insights cruzados entre personalidad y competencias
- Recomendaciones integradas
- Visualización de patrones

**API:** `POST /api/cerebro-analyze-tests`

---

#### Cerebro Avanzado
**Ruta:** `/cerebro-avanzado`  
**Archivo:** `app/cerebro-avanzado/page.tsx`  
**Componente:** `components/advanced-brain-interface.tsx`

**Características:**
- Análisis profundo con IA
- Comparación con pares
- Predicciones de carrera
- Rutas de aprendizaje personalizadas

**API:** `POST /api/cerebro-enhanced`

**Librerías:**
- `lib/cerebro-intelligence.ts` - Motor de análisis
- `lib/enhanced-platform-brain-v2.ts` - Brain engine v2
- `lib/enhanced-test-analyzer.ts` - Analizador de tests

---

### Biblioteca Profesional

#### Catálogo de Libros
**Ruta:** `/biblioteca`  
**Archivo:** `app/biblioteca/page.tsx`

**Características:**
- 120+ libros de desarrollo profesional
- Categorías: Liderazgo, Productividad, Finanzas, Comunicación, etc.
- Búsqueda y filtrado
- Sistema de favoritos
- Progreso de lectura

**Tabla DB:** `books`

---

#### Lector de Libros
**Ruta:** `/biblioteca/[slug]`  
**Archivo:** `app/biblioteca/[slug]/page.tsx`  
**Componente:** `components/enhanced-book-reader.tsx`

**Características:**
- Lector integrado
- Marcadores y notas
- Progreso guardado
- Compartir citas
- AI Reading Companion (asistente de lectura con IA)

**Componentes relacionados:**
- `components/ai-reading-companion.tsx` - Asistente IA
- `components/reading-analytics-dashboard.tsx` - Analytics de lectura
- `components/social-reading-features.tsx` - Funciones sociales
- `components/quick-book-access.tsx` - Acceso rápido

**API:** `GET /api/books/[slug]`

---

### AI Coach

#### Coach Básico
**Ruta:** `/ai-coach`  
**Archivo:** `app/ai-coach/page.tsx`  
**Componente:** `components/ai-coach-chat.tsx`

**Características:**
- Chat con GPT-4
- Análisis de perfil psicométrico
- Recomendaciones personalizadas
- Historial de conversaciones

**API:** `POST /api/ai-coach`

---

#### Coach Avanzado
**Componente:** `components/enhanced-ai-coach.tsx`

**Características:**
- Contexto de todos los tests
- Acceso a biblioteca completa
- Recomendaciones de libros
- Planes de acción personalizados

**API:** `POST /api/ai-coach-advanced`

---

#### Widget Flotante de Coaching
**Componente:** `components/floating-coach-widget.tsx`

**Características:**
- Disponible en toda la aplicación
- Selector de coach (Sofia o Dani)
- Selector de categoría
- Chat completo con historial
- Preguntas sugeridas contextuales
- Minimizar/maximizar

**Componentes relacionados:**
- `components/coach-selector.tsx` - Selector de coach
- `components/floating-coach-chat.tsx` - Chat flotante
- `components/sofia-dani-coach.tsx` - Lógica de coaches

**Coaches disponibles:**
- **Sofia** - Coach emocional (empático, cercano, motivador)
- **Dani** - Mentor estratégico (claro, estructurado, directo)

**Categorías de prompts:**
1. Autoconocimiento y Propósito
2. CV, LinkedIn y Marca Personal
3. Entrevistas y Comunicación
4. Crecimiento Profesional y Aumento Salarial
5. Reinvención y Transición de Carrera

---

### Seguimiento de Aplicaciones
**Ruta:** `/track-application`  
**Archivo:** `app/track-application/page.tsx`  
**Componente:** `components/application-status-tracker.tsx`

**Características:**
- Registro de aplicaciones laborales
- Estados: Aplicado, En Proceso, Entrevista, Oferta, Rechazado
- Notas y seguimiento
- Recordatorios
- Estadísticas

**APIs:**
- `POST /api/applications` - Crear aplicación
- `GET /api/applications` - Listar aplicaciones
- `PUT /api/applications/[applicationId]` - Actualizar aplicación
- `POST /api/applications/track` - Tracking de aplicación

**Tabla DB:** `job_applications`

---

### Rutas de Aprendizaje
**Ruta:** `/learning-paths`  
**Archivo:** `app/learning-paths/page.tsx`  
**Componente:** `components/learning-path-card.tsx`

**Características:**
- Rutas predefinidas
- Progreso tracking
- Contenido secuencial
- Certificados

**Librería:** `lib/learning-path-engine.ts`

---

### Autenticación
**Ruta:** `/auth`  
**Archivo:** `app/auth/page.tsx`

**Características:**
- Login con email y contraseña
- Registro de nuevos usuarios
- Recuperación de contraseña
- Integración con Supabase Auth

**Componente:** `components/session-wrapper.tsx` - Wrapper de sesión

---

## 🔐 RUTAS DE ADMINISTRACIÓN

Todas las rutas admin requieren autenticación y permisos de administrador.

### Panel Principal
**Ruta:** `/admin`  
**Componente:** `components/admin-navbar.tsx`

---

### 1. Gestión de Usuarios
**Ruta:** `/admin/users`  
**Archivo:** `app/admin/users/page.tsx`

**Características:**
- Lista de todos los usuarios
- Filtrado y búsqueda
- Ver detalles de usuario
- Estadísticas de uso

**API:** `GET /api/admin/users`

---

### 2. Análisis de Coaching
**Ruta:** `/admin/coaching-analytics`  
**Archivo:** `app/admin/coaching-analytics/page.tsx`  
**Componente:** `components/coaching-analytics-dashboard.tsx`

**Métricas:**
- Satisfacción promedio (1-5 estrellas)
- Engagement (mensajes por sesión)
- Tasa de acción completada
- Distribución por coach (Sofia/Dani)
- Distribución por categoría

**API:** `GET /api/coaching-analytics`

**Tabla DB:** `coaching_metrics`

---

### 3. Gestión de Prompts
**Ruta:** `/admin/prompt-management`  
**Archivo:** `app/admin/prompt-management/page.tsx`  
**Componente:** `components/prompt-management-dashboard.tsx`

**Características:**
- Ver todas las versiones de prompts
- Crear nuevas variantes para A/B testing
- Activar/desactivar variantes
- Ver performance de cada variante
- Métricas: satisfacción, engagement, acción completada

**APIs:**
- `GET /api/prompt-management` - Listar prompts
- `POST /api/prompt-management` - Crear variante
- `POST /api/prompt-management/publish` - Publicar ganador

**Tablas DB:**
- `prompt_versions`
- `prompt_variant_assignments`
- `prompt_performance`

---

### 4. Logs Críticos
**Ruta:** `/admin/critical-logs`  
**Archivo:** `app/admin/critical-logs/page.tsx`  
**Componente:** `components/critical-logs-dashboard.tsx`

**Criterios de logs críticos:**
- Satisfacción < 4.3 estrellas
- Acción completada < 60%
- Engagement < 70%

**API:** `GET /api/critical-prompts`

---

### 5. Workflow de Revisión
**Ruta:** `/admin/review-workflow`  
**Archivo:** `app/admin/review-workflow/page.tsx`  
**Componente:** `components/review-workflow-dashboard.tsx`

**Estados de tareas:**
- `pending` - Pendiente de revisión
- `in_review` - En revisión
- `variant_created` - Variante creada
- `testing` - En testing A/B
- `resolved` - Resuelto
- `dismissed` - Descartado

**APIs:**
- `GET /api/review-tasks` - Listar tareas
- `POST /api/review-tasks` - Crear tarea
- `PUT /api/review-tasks` - Actualizar tarea

**Tablas DB:**
- `prompt_review_tasks`
- `admin_notifications`

---

### 6. Resultados A/B Testing
**Ruta:** `/admin/ab-test-results`  
**Archivo:** `app/admin/ab-test-results/page.tsx`  
**Componente:** `components/ab-test-results-dashboard.tsx`

**Características:**
- Ver tests A/B activos
- Análisis estadístico completo
- Significancia estadística (p-values, z-scores)
- Intervalos de confianza al 95%
- Effect size (Cohen's d)
- Publicación automática de ganadores

**API:** `GET /api/ab-test-analysis`

**Librería:** `lib/statistics.ts` - Funciones estadísticas

**Score ponderado:**
- 50% satisfacción
- 30% acción completada
- 20% engagement

---

### 7. Banco de Prompts
**Ruta:** `/admin/prompt-bank`  
**Archivo:** `app/admin/prompt-bank/page.tsx`  
**Componente:** `components/prompt-bank-dashboard.tsx`

**Características:**
- 50+ prompts maestros
- Filtrado por categoría, nivel, coach
- Búsqueda por keywords
- Métricas esperadas por prompt
- Respuestas modelo de Sofia y Dani

**Librería:** `lib/ai/master-prompt-bank.ts`

**Estructura de prompts:**
\`\`\`typescript
{
  prompt_id: string
  categoria: string
  nivel: "basico" | "intermedio" | "avanzado"
  tono: "sofia" | "dani" | "hibrido"
  entrada_usuario: string
  respuesta_ia: string
  seguimiento: string
  keywords: string[]
  kpis: {
    engagement_rate: number
    satisfaccion_promedio: number
    acciones_completadas: number
  }
}
\`\`\`

---

### 8. Automatización
**Ruta:** `/admin/automation`  
**Archivo:** `app/admin/automation/page.tsx`  
**Componente:** `components/automation-dashboard.tsx`

**Características:**
- Estado de cron jobs
- Historial de ejecuciones
- Logs de automatización
- Configuración de alertas

---

### 9. KPI Dashboard
**Ruta:** `/admin/kpi-dashboard`  
**Archivo:** `app/admin/kpi-dashboard/page.tsx`  
**Componente:** `components/kpi-dashboard.tsx`

**KPIs por capítulo:**

**Capítulo 2 - SEO & Búsquedas:**
- CTR ≥ 8.5%
- Top-10 ≥ 45 keywords
- Conversión orgánica ≥ 5.5%
- Tiempo en página ≥ 2:30
- Rebote ≤ 40%

**Capítulo 3 - Sofia & Dani:**
- Engagement ≥ 76%
- Satisfacción ≥ 4.7
- Acción ≥ 68%
- Retención 30d ≥ 72%
- Enchantment ≥ 8%

**Capítulo 4 - FAQ + JSON-LD:**
- Resultados ≥ 95% de páginas
- CTR desde FAQ ≥ 12%

**Capítulo 5 - RAG & Data Conversacional:**
- Precisión percibida QA ≥ 85%
- Respuesta con cita de fuente ≥ 95%
- Latencia chat ≤ 1.5s
- Incidentes de acceso no autorizado = 0

**Capítulo 6 - Plan Bimestral:**
- Prompts ajustados por ciclo ≥ 10
- Uplift métrica A/B ≥ 10%
- Cumplimiento de checklist QA = 100%

**API:** `GET /api/kpi-metrics`

---

### 10. Resumen Ejecutivo
**Ruta:** `/admin/executive-summary`  
**Archivo:** `app/admin/executive-summary/page.tsx`  
**Componente:** `components/executive-summary.tsx`

**Características:**
- Resumen de 3 minutos para tomadores de decisión
- Qué es DTC
- Para quién
- Por qué
- Resultados 2025
- Arquitectura técnica
- Roadmap 2025-2026

**Resultados objetivo 2025:**
- Satisfacción ≥ 4.7
- Acción ≥ 68%
- Retención 30d ≥ 72%
- 20k MAU (Monthly Active Users)
- 8 clientes B2B

---

### 11. Knowledge Base
**Ruta:** `/admin/knowledge-base`  
**Archivo:** `app/admin/knowledge-base/page.tsx`

**Características:**
- Gestión de documentos
- Carga de PDFs
- Generación de embeddings
- Búsqueda semántica

**APIs:**
- `GET /api/admin/brain/documents` - Listar documentos
- `POST /api/admin/brain/upload` - Subir documento
- `DELETE /api/admin/brain/documents/[id]` - Eliminar documento

---

### 12. Embeddings
**Ruta:** `/admin/embeddings`  
**Archivo:** `app/admin/embeddings/page.tsx`

**Características:**
- Gestión de embeddings
- Regeneración de vectores
- Estadísticas de uso

**API:** `POST /api/embeddings/generate`

---

### 13. Brain (Cerebro Admin)
**Ruta:** `/admin/brain`  
**Archivo:** `app/admin/brain/page.tsx`  
**Componente:** `components/brain-chat-interface.tsx`

**Características:**
- Chat con documentos
- RAG (Retrieval Augmented Generation)
- Búsqueda semántica avanzada

**APIs:**
- `POST /api/brain-query` - Query básica
- `POST /api/brain-query-advanced` - Query avanzada
- `POST /api/brain-semantic` - Búsqueda semántica

---

### 14. Métricas Generales
**Ruta:** `/admin/metrics`  
**Archivo:** `app/admin/metrics/page.tsx`

**Características:**
- Métricas de uso de la plataforma
- Tests completados
- Usuarios activos
- Engagement general

**API:** `GET /api/metrics`

---

### 15. Configuración API
**Ruta:** `/admin/api-config`  
**Archivo:** `app/admin/api-config/page.tsx`

**Características:**
- Configuración de APIs externas
- Verificación de OpenAI
- Estado de integraciones

**API:** `GET /api/admin/check`

---

## 🔌 API ENDPOINTS

### Autenticación y Usuarios

\`\`\`
GET  /api/user-profile          # Obtener perfil de usuario
POST /api/user-profile          # Actualizar perfil
GET  /api/user/phone            # Obtener teléfono
POST /api/user/phone            # Actualizar teléfono
GET  /api/user/whatsapp-config  # Config WhatsApp
POST /api/user/whatsapp-config  # Actualizar config WhatsApp
\`\`\`

---

### Tests Psicométricos

\`\`\`
POST /api/test-results          # Guardar resultados de test
GET  /api/test-results          # Obtener resultados históricos
GET  /api/test-questions        # Obtener preguntas de test
POST /api/analyze-response      # Analizar respuesta individual
\`\`\`

**Tablas DB relacionadas:**
- `disc_results`
- `mbti_results`
- `big_five_results`
- `riasec_results`
- `soft_skills_results`
- `emotional_intelligence_results`

---

### Sistema Cerebro (Análisis Multi-Test)

\`\`\`
POST /api/cerebro-analyze-tests # Análisis básico multi-test
POST /api/cerebro-enhanced      # Análisis avanzado con IA
\`\`\`

**Librerías:**
- `lib/cerebro-intelligence.ts`
- `lib/enhanced-platform-brain-v2.ts`
- `lib/enhanced-test-analyzer.ts`

---

### AI Coaching

\`\`\`
POST /api/ai-coach              # Chat básico con IA
POST /api/ai-coach-advanced     # Chat avanzado con contexto
GET  /api/ai-conversations      # Historial de conversaciones
POST /api/ai-insights           # Generar insights personalizados
POST /api/coaching-metrics      # Guardar métricas de coaching
GET  /api/coaching-analytics    # Obtener analytics de coaching
\`\`\`

**Tabla DB:** `coaching_metrics`

**Librerías:**
- `lib/ai-coach.ts`
- `lib/ai/enhanced-prompts.ts`
- `lib/ai/prompt-categories.ts`
- `lib/sofia-dani-prompts.ts`

---

### Sistema de Prompts y A/B Testing

\`\`\`
GET  /api/prompt-assignment     # Asignar variante de prompt
POST /api/prompt-usage          # Registrar uso de prompt
GET  /api/prompt-management     # Listar prompts y variantes
POST /api/prompt-management     # Crear nueva variante
POST /api/prompt-management/publish # Publicar ganador
GET  /api/ab-test-analysis      # Análisis de tests A/B
GET  /api/critical-prompts      # Obtener prompts críticos
GET  /api/review-tasks          # Listar tareas de revisión
POST /api/review-tasks          # Crear tarea de revisión
GET  /api/admin-notifications   # Notificaciones admin
\`\`\`

**Tablas DB:**
- `prompt_versions`
- `prompt_variant_assignments`
- `prompt_performance`
- `prompt_review_tasks`
- `admin_notifications`

---

### Biblioteca

\`\`\`
GET  /api/books                 # Listar todos los libros
GET  /api/books/[slug]          # Obtener libro específico
POST /api/export/books          # Exportar biblioteca a CSV
\`\`\`

**Tabla DB:** `books`

**Librería:** `lib/books.ts` - 120+ libros

---

### Knowledge Base y RAG

\`\`\`
POST /api/brain-query           # Query básica al brain
POST /api/brain-query-advanced  # Query avanzada con RAG
POST /api/brain-semantic        # Búsqueda semántica
POST /api/embeddings/generate   # Generar embeddings
GET  /api/admin/brain/documents # Listar documentos
POST /api/admin/brain/upload    # Subir documento
DELETE /api/admin/brain/documents/[id] # Eliminar documento
POST /api/documents/upload      # Subir documento (usuario)
GET  /api/documents             # Listar documentos (usuario)
POST /api/documents/chat        # Chat con documentos
\`\`\`

**Librerías:**
- `lib/embeddings.ts`
- `lib/enhanced-semantic-search.ts`
- `lib/pdf-processor.ts`

**Tablas DB:**
- `documents`
- `document_embeddings`

---

### Aplicaciones Laborales

\`\`\`
POST /api/applications          # Crear aplicación
GET  /api/applications          # Listar aplicaciones
PUT  /api/applications/[applicationId] # Actualizar aplicación
POST /api/applications/track    # Tracking de aplicación
\`\`\`

**Tabla DB:** `job_applications`

---

### Calendario y Actividades

\`\`\`
GET  /api/activities            # Obtener actividades
POST /api/activities            # Crear actividad
PUT  /api/activities            # Actualizar actividad
DELETE /api/activities          # Eliminar actividad
\`\`\`

**Tabla DB:** `activities`

---

### Metas y Objetivos

\`\`\`
GET  /api/career-goals          # Obtener metas de carrera
POST /api/career-goals          # Crear meta
PUT  /api/career-goals          # Actualizar meta
DELETE /api/career-goals        # Eliminar meta
\`\`\`

**Tabla DB:** `career_goals`

---

### Gamificación

\`\`\`
GET  /api/user-achievements     # Obtener logros de usuario
POST /api/user-achievements     # Desbloquear logro
\`\`\`

**Tabla DB:** `user_achievements`

---

### Recomendaciones e Insights

\`\`\`
GET  /api/recommendations       # Recomendaciones personalizadas
POST /api/post-test-insights    # Insights post-test
GET  /api/weekly-insights       # Insights semanales
GET  /api/daily-tip             # Consejo diario
GET  /api/peer-comparison       # Comparación con pares
\`\`\`

**Librerías:**
- `lib/learning-path-engine.ts`

---

### WhatsApp

\`\`\`
POST /api/whatsapp/send         # Enviar mensaje WhatsApp
POST /api/whatsapp/schedule     # Programar mensaje
\`\`\`

**Librería:** `lib/whatsapp-service.ts`

---

### Búsqueda

\`\`\`
POST /api/search-advanced       # Búsqueda avanzada
POST /api/search/semantic       # Búsqueda semántica
\`\`\`

**Librería:** `lib/enhanced-semantic-search.ts`

---

### Web Resources

\`\`\`
GET  /api/web-resources         # Listar recursos web
POST /api/web-resources         # Crear recurso
GET  /api/web-resources/[id]    # Obtener recurso
PUT  /api/web-resources/[id]    # Actualizar recurso
DELETE /api/web-resources/[id]  # Eliminar recurso
\`\`\`

**Librería:** `lib/web-resources.ts`

---

### Exportación

\`\`\`
GET  /api/export/metrics-csv    # Exportar métricas a CSV
GET  /api/export/ab-test-results-csv # Exportar A/B tests a CSV
POST /api/export/generate-report # Generar reporte JSON
GET  /api/export/books          # Exportar libros a CSV
\`\`\`

---

### KPIs y Métricas

\`\`\`
GET  /api/kpi-metrics           # Obtener KPIs por capítulo
GET  /api/metrics               # Métricas generales
GET  /api/coaching-analytics    # Analytics de coaching
\`\`\`

---

### Adaptive Learning

\`\`\`
POST /api/adaptive-action       # Obtener acción adaptativa
\`\`\`

**Librería:** `lib/adaptive-learning/blueprint.ts`

---

### Admin

\`\`\`
GET  /api/admin/users           # Listar usuarios (admin)
GET  /api/admin/check           # Verificar permisos admin
\`\`\`

---

### Testing y Desarrollo

\`\`\`
POST /api/test-openai           # Test de OpenAI
\`\`\`

---

## 🧩 COMPONENTES PRINCIPALES

### Navegación y Layout

\`\`\`
components/admin-navbar.tsx              # Navbar de administración
components/llmo-optimized-footer.tsx     # Footer optimizado
components/session-wrapper.tsx           # Wrapper de sesión
components/theme-provider.tsx            # Provider de tema
\`\`\`

---

### Landing y Marketing

\`\`\`
components/landing-page-optimized.tsx    # Landing page con SEO
components/landing-page.tsx              # Landing page básica
components/interactive-faq.tsx           # FAQ interactivo
components/seo-optimized-content.tsx     # Contenido SEO
\`\`\`

---

### Dashboard

\`\`\`
components/dashboard-content.tsx         # Contenido principal del dashboard
components/activity-calendar.tsx         # Calendario de actividades
components/gamification-system.tsx       # Sistema de gamificación
components/goal-tracker.tsx              # Seguimiento de metas
components/daily-career-tip.tsx          # Consejo diario
components/achievement-badge.tsx         # Badge de logro
\`\`\`

---

### Tests y Resultados

\`\`\`
components/test-navigation-flow.tsx      # Navegación entre tests
components/test-flow-monitor.tsx         # Monitor de flujo de tests
components/mobile-test-detector.tsx      # Detector de tests móviles
components/gesture-enhanced-test-interface.tsx # Interface con gestos
components/gesture-performance-monitor.tsx # Monitor de performance
components/mobile-gesture-tester.tsx     # Tester de gestos móviles
components/demo-disc-button.tsx          # Botón demo DISC
\`\`\`

---

### AI Coaching

\`\`\`
components/floating-coach-widget.tsx     # Widget flotante de coaching
components/coach-selector.tsx            # Selector de coach
components/floating-coach-chat.tsx       # Chat flotante
components/sofia-dani-coach.tsx          # Lógica de Sofia y Dani
components/ai-coach-chat.tsx             # Chat básico con IA
components/enhanced-ai-coach.tsx         # Coach avanzado
components/persistent-ai-coach.tsx       # Coach persistente
components/ai-coach-test-scenarios.tsx   # Escenarios de test
components/ai-insights-panel.tsx         # Panel de insights
\`\`\`

---

### Cerebro (Análisis Multi-Test)

\`\`\`
components/advanced-brain-interface.tsx  # Interface avanzada del cerebro
components/brain-chat-interface.tsx      # Chat con el cerebro
components/enhanced-brain-chat.tsx       # Chat mejorado
components/super-smart-brain-chat.tsx    # Chat super inteligente
components/multi-test-insights.tsx       # Insights multi-test
components/skill-gap-analysis.tsx        # Análisis de brechas
components/peer-comparison.tsx           # Comparación con pares
\`\`\`

---

### Biblioteca

\`\`\`
components/enhanced-book-reader.tsx      # Lector de libros mejorado
components/ai-reading-companion.tsx      # Asistente de lectura IA
components/reading-analytics-dashboard.tsx # Analytics de lectura
components/social-reading-features.tsx   # Funciones sociales
components/quick-book-access.tsx         # Acceso rápido a libros
\`\`\`

---

### Aplicaciones Laborales

\`\`\`
components/application-status-tracker.tsx # Seguimiento de aplicaciones
\`\`\`

---

### Learning Paths

\`\`\`
components/learning-path-card.tsx        # Card de ruta de aprendizaje
\`\`\`

---

### Admin - Prompts y A/B Testing

\`\`\`
components/prompt-bank-dashboard.tsx     # Dashboard de banco de prompts
components/prompt-management-dashboard.tsx # Gestión de prompts
components/ab-test-results-dashboard.tsx # Resultados A/B testing
components/critical-logs-dashboard.tsx   # Logs críticos
components/review-workflow-dashboard.tsx # Workflow de revisión
components/automation-dashboard.tsx      # Dashboard de automatización
\`\`\`

---

### Admin - Analytics y KPIs

\`\`\`
components/coaching-analytics-dashboard.tsx # Analytics de coaching
components/coaching-metrics-dashboard.tsx # Métricas de coaching
components/kpi-dashboard.tsx             # Dashboard de KPIs
components/executive-summary.tsx         # Resumen ejecutivo
\`\`\`

---

### Feedback y Diálogos

\`\`\`
components/coaching-feedback-dialog.tsx  # Diálogo de feedback
\`\`\`

---

### Testing y Desarrollo

\`\`\`
components/color-scheme-test.tsx         # Test de esquema de colores
components/enhanced-search-algorithm.tsx # Algoritmo de búsqueda mejorado
\`\`\`

---

## 📚 LIBRERÍAS Y UTILIDADES

### AI y Prompts

\`\`\`
lib/ai-coach.ts                          # Lógica del AI coach
lib/ai/enhanced-prompts.ts               # Prompts mejorados
lib/ai/prompt-categories.ts              # Categorías de prompts
lib/ai/prompts.ts                        # Prompts básicos
lib/ai/master-prompt-bank.ts             # Banco maestro de 50+ prompts
lib/sofia-dani-prompts.ts                # Prompts de Sofia y Dani
\`\`\`

---

### Cerebro e Inteligencia

\`\`\`
lib/cerebro-intelligence.ts              # Motor de inteligencia del cerebro
lib/enhanced-platform-brain-v2.ts        # Brain engine v2
lib/enhanced-platform-brain.ts           # Brain engine v1
lib/platform-brain.ts                    # Brain básico
lib/advanced-brain-engine.ts             # Motor avanzado
lib/enhanced-test-analyzer.ts            # Analizador de tests
\`\`\`

---

### Búsqueda y Embeddings

\`\`\`
lib/embeddings.ts                        # Generación de embeddings
lib/enhanced-semantic-search.ts          # Búsqueda semántica mejorada
lib/intention-detector.ts                # Detector de intenciones
\`\`\`

---

### Adaptive Learning

\`\`\`
lib/adaptive-learning/blueprint.ts       # Blueprint de aprendizaje adaptativo
\`\`\`

---

### Contenido

\`\`\`
lib/books.ts                             # Biblioteca de 120+ libros
lib/faq-data.ts                          # Datos de FAQ
lib/web-resources.ts                     # Recursos web
\`\`\`

---

### Learning Paths

\`\`\`
lib/learning-path-engine.ts              # Motor de rutas de aprendizaje
\`\`\`

---

### Tests

\`\`\`
lib/test-branding.ts                     # Branding de tests
lib/test-metadata.ts                     # Metadata de tests
lib/test-names.ts                        # Nombres de tests
\`\`\`

---

### Utilidades

\`\`\`
lib/utils.ts                             # Utilidades generales
lib/statistics.ts                        # Funciones estadísticas
lib/performance-optimizer.ts             # Optimizador de performance
lib/pdf-processor.ts                     # Procesador de PDFs
\`\`\`

---

### Supabase

\`\`\`
lib/supabase.ts                          # Cliente Supabase (cliente)
lib/supabase-server.ts                   # Cliente Supabase (servidor)
lib/supabase/server.ts                   # Cliente Supabase (servidor v2)
\`\`\`

---

### Integraciones

\`\`\`
lib/whatsapp-service.ts                  # Servicio de WhatsApp
\`\`\`

---

## 🗄️ BASE DE DATOS

### Resumen

**Total de tablas:** 121  
**Motor:** PostgreSQL (Supabase)  
**ORM:** Ninguno (SQL directo)

### Categorías de Tablas

#### 1. Tests Psicométricos (15 tablas)

\`\`\`sql
-- Tests principales
disc_results
mbti_results
big_five_results
riasec_results
soft_skills_results
emotional_intelligence_results

-- Respuestas y análisis
test_responses
test_questions
test_categories
test_metadata

-- Comparaciones
peer_comparisons
test_correlations

-- Histórico
test_history
test_versions
test_analytics
\`\`\`

---

#### 2. Usuarios y Perfiles (8 tablas)

\`\`\`sql
-- Usuarios
users (Supabase Auth)
user_profiles
user_preferences
user_settings

-- Actividad
user_activity_log
user_sessions
user_achievements
user_badges
\`\`\`

---

#### 3. Biblioteca (12 tablas)

\`\`\`sql
-- Libros
books
book_categories
book_authors
book_tags

-- Lectura
reading_progress
reading_sessions
reading_notes
reading_bookmarks
reading_highlights

-- Social
reading_groups
reading_discussions
book_reviews
\`\`\`

---

#### 4. IA y Cerebro (10 tablas)

\`\`\`sql
-- Conversaciones
ai_conversations
ai_messages
conversation_context

-- Análisis
cerebro_analyses
multi_test_insights
skill_gap_analyses

-- Embeddings
documents
document_embeddings
document_chunks
vector_search_cache
\`\`\`

---

#### 5. Coaching (6 tablas)

\`\`\`sql
-- Métricas
coaching_metrics
coaching_sessions
coaching_feedback

-- Prompts
prompt_versions
prompt_variant_assignments
prompt_performance
\`\`\`

---

#### 6. A/B Testing y Revisión (4 tablas)

\`\`\`sql
prompt_review_tasks
admin_notifications
ab_test_results
experiment_assignments
\`\`\`

---

#### 7. Calendario y Actividades (5 tablas)

\`\`\`sql
activities
activity_reminders
activity_completions
calendar_events
recurring_activities
\`\`\`

---

#### 8. Aplicaciones y CV (8 tablas)

\`\`\`sql
-- Aplicaciones
job_applications
application_status_history
application_notes
application_documents

-- CV
cv_versions
cv_sections
cv_skills
cv_experiences
\`\`\`

---

#### 9. Metas y Objetivos (6 tablas)

\`\`\`sql
career_goals
goal_milestones
goal_progress
goal_reflections
goal_categories
goal_templates
\`\`\`

---

#### 10. Gamificación (7 tablas)

\`\`\`sql
achievements
user_achievements
badges
user_badges
points_history
leaderboards
challenges
\`\`\`

---

#### 11. Recomendaciones (5 tablas)

\`\`\`sql
recommendations
recommendation_history
recommendation_feedback
personalization_rules
user_preferences_ml
\`\`\`

---

#### 12. Notificaciones (4 tablas)

\`\`\`sql
notifications
notification_preferences
whatsapp_messages
whatsapp_schedule
\`\`\`

---

#### 13. Web Resources (3 tablas)

\`\`\`sql
web_resources
resource_categories
resource_tags
\`\`\`

---

#### 14. Analytics y Métricas (8 tablas)

\`\`\`sql
platform_metrics
user_engagement_metrics
test_completion_metrics
coaching_analytics
kpi_tracking
daily_summaries
weekly_reports
monthly_reports
\`\`\`

---

#### 15. Admin (5 tablas)

\`\`\`sql
admin_users
admin_roles
admin_permissions
admin_audit_log
admin_settings
\`\`\`

---

#### 16. Tablas de Soporte (35 tablas adicionales)

Incluyen tablas para:
- Caché y optimización
- Logs y auditoría
- Configuración
- Migraciones
- Backups
- Integraciones externas
- etc.

---

### Tablas Principales Detalladas

#### coaching_metrics

\`\`\`sql
CREATE TABLE coaching_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  coach_type TEXT, -- 'sofia' | 'dani' | 'hibrido'
  conversation_category TEXT,
  satisfaction_rating INTEGER, -- 1-5
  engagement_score DECIMAL, -- 0-100
  action_completed BOOLEAN,
  message_count INTEGER,
  session_duration INTEGER, -- segundos
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

---

#### prompt_versions

\`\`\`sql
CREATE TABLE prompt_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id TEXT,
  version INTEGER,
  variant_name TEXT,
  prompt_text TEXT,
  coach_type TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

---

#### prompt_performance

\`\`\`sql
CREATE TABLE prompt_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_version_id UUID REFERENCES prompt_versions(id),
  user_id UUID REFERENCES auth.users(id),
  satisfaction_rating INTEGER,
  engagement_score DECIMAL,
  action_completed BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

---

#### prompt_review_tasks

\`\`\`sql
CREATE TABLE prompt_review_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id TEXT,
  status TEXT, -- 'pending' | 'in_review' | 'variant_created' | 'testing' | 'resolved' | 'dismissed'
  priority TEXT, -- 'low' | 'medium' | 'high' | 'critical'
  issue_description TEXT,
  assigned_to UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

---

## 🤖 SISTEMA DE IA

### Coaches Disponibles

#### Sofia - Coach Emocional

**Personalidad:**
- Empático, cercano, motivador
- Lenguaje cotidiano chileno
- Valida emociones
- Guía hacia la acción

**Uso:**
- Tests de autoconocimiento (MBTI, DISC, Big Five)
- Apoyo emocional
- Motivación
- Reflexión personal

**Ejemplo de prompt:**
\`\`\`
"Me siento perdido con mi carrera, ¿cómo descubro qué me gusta realmente?"

Sofia: "Es normal sentirse así al comenzar la vida profesional. 
Te propongo tres pasos: 1) reflexiona sobre las tareas que más 
disfrutas. 2) identifica momentos donde te sientes más motivado. 
y 3) realiza el test de autoconocimiento de DespegarTuCarrera."
\`\`\`

---

#### Dani - Mentor Estratégico

**Personalidad:**
- Claro, estructurado, directo
- Enfoque profesional
- Pasos concretos
- Análisis práctico

**Uso:**
- Tests de competencias (Soft Skills, RIASEC)
- Planificación de carrera
- Estrategias laborales
- Decisiones profesionales

**Ejemplo de prompt:**
\`\`\`
"No sé si estoy en la carrera correcta."

Dani: "Démosle un enfoque analítico. 1) mide satisfacción actual. 
2) proyecta tu industria. 3) identifica habilidades transferibles. 
Te puedo guiar con un plan de reconversión profesional."
\`\`\`

---

### Categorías de Prompts

#### 1. Autoconocimiento y Propósito
- Descubrir qué me gusta
- Carrera correcta
- Fortalezas y debilidades
- Valores profesionales

#### 2. CV, LinkedIn y Marca Personal
- Mejorar CV
- Optimizar LinkedIn
- Marca personal
- Portfolio profesional

#### 3. Entrevistas y Comunicación
- Preparación de entrevistas
- Responder preguntas difíciles
- Lenguaje corporal
- Negociación

#### 4. Crecimiento Profesional y Aumento Salarial
- Pedir aumento
- Negociar salario
- Promoción interna
- Desarrollo de carrera

#### 5. Reinvención y Transición de Carrera
- Cambio de carrera
- Reconversión profesional
- Emprendimiento
- Freelancing

---

### Banco Maestro de Prompts

**Ubicación:** `lib/ai/master-prompt-bank.ts`

**Total:** 50+ prompts estructurados

**Estructura:**
\`\`\`typescript
{
  prompt_id: "cv_mejoras_001",
  categoria: "CV y Empleabilidad",
  nivel: "basico",
  tono: "dani",
  entrada_usuario: "Quiero mejorar mi CV pero no sé por dónde partir",
  respuesta_ia: "Perfecto. Haz esto: 1) Define el cargo objetivo...",
  seguimiento: "Ofrecer revisión IA o plantilla de CV",
  keywords: ["cv", "curriculum", "mejora", "optimización"],
  kpis: {
    engagement_rate: 0.75,
    satisfaccion_promedio: 4.6,
    acciones_completadas: 68
  }
}
\`\`\`

---

### Sistema de A/B Testing

**Flujo:**
1. Usuario hace una pregunta
2. Sistema asigna variante de prompt (A o B)
3. Usuario recibe respuesta según variante
4. Usuario califica la respuesta (1-5 estrellas)
5. Sistema registra métricas
6. Análisis estadístico determina ganador
7. Publicación automática del ganador

**Métricas evaluadas:**
- Satisfacción (50% del score)
- Acción completada (30% del score)
- Engagement (20% del score)

**Significancia estadística:**
- p-value < 0.05
- Intervalo de confianza 95%
- Effect size (Cohen's d)

---

### Adaptive Learning Blueprint

**Componentes:**
1. **Perfil dinámico** - Atributos calculados del usuario
2. **Motor de reglas** - Políticas de decisión
3. **Bandits/A/B** - Exploración de variantes
4. **Conectores** - CMS, RAG, simuladores

**Flujo:**
\`\`\`
Evento (login, acción, test) 
  → Perfil dinámico (fortalezas, interés, etapa)
  → Política de decisión (reglas/heurísticas)
  → Acción (mensaje, micro-paso)
  → Métricas y aprendizaje
\`\`\`

**KPIs:**
- +8-15% acción completada
- +5-10pp retención 30d
- +10-20% tiempo en página
- -5-10pp eliminación de rebote

---

## 🔗 INTEGRACIONES

### Supabase

**Uso:**
- Base de datos PostgreSQL
- Autenticación de usuarios
- Row Level Security (RLS)
- Realtime subscriptions

**Configuración:**
\`\`\`typescript
// Cliente (browser)
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Servidor
import { createServerClient } from '@supabase/ssr'

const supabase = createServerClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
\`\`\`

---

### OpenAI

**Uso:**
- GPT-4 para coaching
- Embeddings para búsqueda semántica
- Análisis de tests
- Generación de insights

**Modelos:**
- `gpt-4-turbo-preview` - Coaching y análisis
- `text-embedding-3-small` - Embeddings

**Configuración:**
\`\`\`typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
\`\`\`

---

### Vercel AI SDK

**Uso:**
- Streaming de respuestas
- Manejo de conversaciones
- Integración con OpenAI

**Ejemplo:**
\`\`\`typescript
import { generateText } from 'ai'

const { text } = await generateText({
  model: 'openai/gpt-4-turbo-preview',
  prompt: 'Analiza este perfil...'
})
\`\`\`

---

### Vercel Blob

**Uso:**
- Almacenamiento de archivos
- PDFs de libros
- Documentos de usuarios
- Imágenes

**Configuración:**
\`\`\`typescript
import { put, del } from '@vercel/blob'

const blob = await put('filename.pdf', file, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN
})
\`\`\`

---

### WhatsApp (Futuro)

**Uso:**
- Recordatorios de actividades
- Notificaciones
- Consejos diarios

**API:** `lib/whatsapp-service.ts`

---

## ⏰ CRON JOBS

### Configuración

**Archivo:** `vercel.json`

\`\`\`json
{
  "crons": [
    {
      "path": "/api/cron/bimonthly-analysis",
      "schedule": "0 0 1 */2 *"
    },
    {
      "path": "/api/cron/daily-metrics-summary",
      "schedule": "0 9 * * *"
    }
  ]
}
\`\`\`

---

### 1. Análisis Bimestral

**Ruta:** `/api/cron/bimonthly-analysis`  
**Frecuencia:** Cada 2 meses (día 1 a las 00:00)  
**Archivo:** `app/api/cron/bimonthly-analysis/route.ts`

**Funciones:**
1. Identificar prompts críticos (satisfacción < 4.3, acción < 60%)
2. Crear tareas de revisión automáticas
3. Analizar tests A/B listos para publicación
4. Publicar ganadores automáticamente
5. Generar notificaciones para admins

**Autenticación:** Requiere `CRON_SECRET`

---

### 2. Resumen Diario de Métricas

**Ruta:** `/api/cron/daily-metrics-summary`  
**Frecuencia:** Diario a las 09:00  
**Archivo:** `app/api/cron/daily-metrics-summary/route.ts`

**Funciones:**
1. Calcular métricas del día anterior
2. Detectar anomalías
3. Generar alertas si hay problemas
4. Actualizar dashboard de automatización

**Autenticación:** Requiere `CRON_SECRET`

---

## 🔐 VARIABLES DE ENTORNO

### Supabase

\`\`\`bash
SUPABASE_URL=                           # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL=               # URL pública
SUPABASE_ANON_KEY=                      # Anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # Anon key pública
SUPABASE_SERVICE_ROLE_KEY=              # Service role key (admin)
SUPABASE_JWT_SECRET=                    # JWT secret
\`\`\`

---

### PostgreSQL (Supabase)

\`\`\`bash
POSTGRES_URL=                           # Connection string
POSTGRES_PRISMA_URL=                    # Prisma connection string
POSTGRES_URL_NON_POOLING=               # Non-pooling connection
POSTGRES_USER=                          # Usuario
POSTGRES_PASSWORD=                      # Contraseña
POSTGRES_DATABASE=                      # Nombre de la base de datos
POSTGRES_HOST=                          # Host
\`\`\`

---

### OpenAI

\`\`\`bash
OPENAI_API_KEY=                         # API key de OpenAI
NEXT_PUBLIC_OPENAI_API_KEY=             # API key pública (si es necesario)
\`\`\`

---

### Vercel Blob

\`\`\`bash
BLOB_READ_WRITE_TOKEN=                  # Token de Vercel Blob
\`\`\`

---

### Cron Jobs

\`\`\`bash
CRON_SECRET=                            # Secret para autenticar cron jobs
NEXT_PUBLIC_CRON_SECRET=                # Secret público (si es necesario)
\`\`\`

---

## 📊 MÉTRICAS Y KPIs

### KPIs por Capítulo (Documento Maestro)

#### Capítulo 2: SEO & Búsquedas
- CTR ≥ 8.5%
- Top-10 ≥ 45 keywords
- Conversión orgánica ≥ 5.5%
- Tiempo en página ≥ 2:30
- Rebote ≤ 40%

#### Capítulo 3: Sofia & Dani
- **Engagement ≥ 76%**
- **Satisfacción ≥ 4.7**
- **Acción ≥ 68%**
- **Retención 30d ≥ 72%**
- **Enchantment ≥ 8%**

#### Capítulo 4: FAQ + JSON-LD
- Elegibilidad para results ≥ 95% de páginas
- 0 errores/advertencias en datos estructurados
- CTR desde FAQ ≥ 12%

#### Capítulo 5: RAG & Data Conversacional
- Precisión percibida QA ≥ 85%
- Respuestas con cita de fuente ≥ 95%
- P95 latencia chat ≤ 1.5s
- Incidentes de acceso no autorizado = 0

#### Capítulo 6: Plan Bimestral
- Prompts ajustados por ciclo ≥ 10
- Uplift medido A/B ≥ 10% en métrica objetivo
- Cumplimiento de checklist QA = 100%

#### Capítulo 7: Sinergia IA-SEO-Contenido
- Artículos con FAQ+JSON-LD ≥ 90%
- Interlinking medio ≥ 3 enlaces internos/artículo
- % de guías publicadas según plan ≥ 95%

#### Capítulo 8: Roadmap
- OKRs cumplidos por trimestre ≥ 80%
- Entregables críticos en fecha ≥ 90%

---

### Resultados Objetivo 2025

**Métricas de producto:**
- Satisfacción ≥ 4.7
- Acción ≥ 68%
- Retención 30d ≥ 72%
- 20k MAU (Monthly Active Users)
- 8 clientes B2B

**Arquitectura:**
- Seguridad & Ley 19.628: consentimiento granular, retención definida, DSAR ≤ 10 días hábiles
- Cifrado y auditorías trimestrales

---

## 🚀 ROADMAP 2025-2026

### Q1 2025 (Completado)
- ✅ Plataforma base con 6 tests psicométricos
- ✅ Sistema Cerebro multi-test
- ✅ Biblioteca con 120+ libros
- ✅ AI Coaching con Sofia y Dani
- ✅ Banco maestro de 50+ prompts
- ✅ Sistema de A/B testing
- ✅ Dashboard admin completo

### Q2 2025
- Expansión de contenidos (100+ prompts)
- Blueprint adaptativo completo
- Integración WhatsApp
- Sistema de certificaciones

### Q3 2025
- Expansión LATAM (Perú, Colombia)
- Alianzas universitarias
- Módulo B2B empresas

### Q4 2025
- 50k+ usuarios activos
- 20+ clientes B2B
- Marketplace de servicios

### 2026
- Expansión regional completa
- Plataforma móvil nativa
- Integración con LinkedIn
- Sistema de mentorías 1-1

---

## 🔒 SEGURIDAD Y PRIVACIDAD

### Cumplimiento Legal

**Ley 19.628 de Chile (Protección de Datos Personales):**
- Consentimiento granular
- Retención definida
- DSAR (Data Subject Access Request) ≤ 10 días hábiles
- Cifrado de datos sensibles
- Auditorías trimestrales

### Row Level Security (RLS)

Todas las tablas de usuario tienen RLS habilitado:
\`\`\`sql
-- Ejemplo: coaching_metrics
ALTER TABLE coaching_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own metrics"
  ON coaching_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metrics"
  ON coaching_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);
\`\`\`

### Autenticación

- Supabase Auth con JWT
- Sesiones seguras
- Refresh tokens automáticos
- Protección CSRF

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

\`\`\`css
/* Mobile first */
sm: 640px   /* Tablet */
md: 768px   /* Tablet landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
\`\`\`

### Componentes Móviles

- `components/mobile-test-detector.tsx` - Detecta dispositivos móviles
- `components/gesture-enhanced-test-interface.tsx` - Interface con gestos
- `components/mobile-gesture-tester.tsx` - Tester de gestos

---

## 🎨 DISEÑO Y BRANDING

### Colores Principales

\`\`\`css
/* Definidos en app/globals.css */
--primary: /* Color principal */
--secondary: /* Color secundario */
--accent: /* Color de acento */
--background: /* Fondo */
--foreground: /* Texto principal */
\`\`\`

### Tipografía

\`\`\`css
font-sans: /* Fuente principal */
font-mono: /* Fuente monoespaciada */
\`\`\`

### Componentes UI

Basados en shadcn/ui (Radix UI):
- Button
- Card
- Dialog
- Dropdown Menu
- Input
- Label
- Progress
- Radio Group
- Scroll Area
- Select
- Separator
- Slider
- Tabs
- Toast
- Tooltip

---

## 🧪 TESTING Y DESARROLLO

### Páginas de Test

\`\`\`
/test-ai-coach              # Test del AI coach
/test-colors                # Test de colores
/test-comprehensive-gestures # Test de gestos completo
/test-flow                  # Test de flujo
/test-gestures              # Test de gestos
/test-metrics               # Test de métricas
/test-performance           # Test de performance
/test-semantic-search       # Test de búsqueda semántica
/test-verification          # Verificación de tests
\`\`\`

---

## 📖 DOCUMENTACIÓN ADICIONAL

### Archivos de Documentación

\`\`\`
DATABASE-SETUP-COMPLETE.md  # Estado de la base de datos
LIBROS_EXISTENTES.md        # Lista de libros confirmados
DOCUMENTACION-COMPLETA-DTC.md # Este documento
\`\`\`

---

## 🆘 SOPORTE Y CONTACTO

### Para Usuarios

**Email:** soporte@despegartuccarrera.cl  
**Chat:** Disponible en la plataforma (lunes a viernes 9am-6pm)  
**Tiempo de respuesta:** < 24 horas hábiles

### Para Desarrolladores

**Repositorio:** [GitHub URL]  
**Documentación técnica:** Este documento  
**Issues:** GitHub Issues

---

## 📝 CHANGELOG

### v2025.1.1.04-SUPREMO (Actual)
- Sistema completo de Sofia y Dani
- Banco maestro de 50+ prompts
- Sistema de A/B testing
- Workflow de revisión
- Publicación automática de ganadores
- Adaptive Learning Blueprint
- KPI Dashboard completo
- Resumen ejecutivo
- Automatización con cron jobs

### v2025.1.1.03
- Versión base consolidada
- 6 tests psicométricos
- Sistema Cerebro
- Biblioteca con 120+ libros
- AI Coaching básico

---

## 🎯 PRÓXIMOS PASOS

1. **Expansión de Prompts:** Llegar a 100+ prompts en el banco maestro
2. **Integración WhatsApp:** Activar notificaciones y recordatorios
3. **Certificaciones:** Sistema de certificados por completar rutas
4. **B2B:** Módulo completo para empresas y universidades
5. **Móvil:** App nativa iOS y Android
6. **LATAM:** Expansión a Perú, Colombia y México

---

## 📞 CONTACTO DEL PROYECTO

**Nombre:** DespegarTuCarrera (DTC)  
**Versión:** 2025.1.1.04-SUPREMO  
**Stack:** Next.js 15, React 19, Supabase, OpenAI  
**Última actualización:** Enero 2025

---

**FIN DE LA DOCUMENTACIÓN**

*Este documento es un recurso vivo y se actualiza constantemente con nuevas funcionalidades y mejoras.*
