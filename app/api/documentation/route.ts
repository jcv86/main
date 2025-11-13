import { NextResponse } from "next/server"

const DOCUMENTATION_CONTENT = `# 📚 DOCUMENTACIÓN COMPLETA - DESPEGARTUCCARRERA (DTC)

**Versión:** 2025.1.1.04-SUPREMO  
**Última Actualización:** Enero 2025  
**Plataforma:** Next.js 15 + React 19 + Supabase + OpenAI

---

## 📑 TABLA DE CONTENIDOS

1. [Arquitectura General](#arquitectura-general)
2. [Rutas Públicas](#rutas-públicas)
3. [Rutas de Tests Psicométricos](#rutas-de-tests-psicométricos)
4. [Rutas de Usuario](#rutas-de-usuario)
5. [Rutas de Administración](#rutas-de-administración)
6. [API Endpoints](#api-endpoints)
7. [Componentes Principales](#componentes-principales)
8. [Librerías y Utilidades](#librerías-y-utilidades)
9. [Base de Datos](#base-de-datos)
10. [Sistema de IA - Sofia & Dani](#sistema-de-ia)
11. [Integraciones](#integraciones)
12. [Cron Jobs y Automatización](#cron-jobs)
13. [Variables de Entorno](#variables-de-entorno)
14. [Métricas y KPIs](#métricas-y-kpis)
15. [Roadmap 2025-2027](#roadmap)

---

## 🏗️ ARQUITECTURA GENERAL

### Stack Tecnológico

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **IA:** OpenAI GPT-4 + AI SDK
- **Storage:** Vercel Blob
- **Deployment:** Vercel
- **Cron Jobs:** Vercel Cron

### Estructura del Proyecto

\`\`\`
despegartuccarrera/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── test/              # Tests psicométricos
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   └── ...
├── components/            # Componentes React
├── lib/                   # Utilidades y helpers
├── scripts/               # Scripts SQL y Python
└── public/                # Archivos estáticos
\`\`\`

---

## 🌐 RUTAS PÚBLICAS

### Landing y Marketing

| Ruta | Descripción | Componente Principal |
|------|-------------|---------------------|
| \`/\` | Landing page principal | \`landing-page-optimized.tsx\` |
| \`/faq\` | Preguntas frecuentes | \`interactive-faq.tsx\` |
| \`/documentacion\` | Documentación completa | \`documentation-viewer.tsx\` |

### Autenticación

| Ruta | Descripción | Protección |
|------|-------------|-----------|
| \`/auth\` | Login/Registro | Público |
| \`/auth/callback\` | Callback OAuth | Público |

---

## 🧠 RUTAS DE TESTS PSICOMÉTRICOS

### Tests Disponibles

| Test | Ruta | Resultados | Preguntas | Coach |
|------|------|-----------|-----------|-------|
| **DISC** | \`/test/disc\` | \`/test/disc/results\` | 28 | Sofia |
| **MBTI** | \`/test/mbti\` | \`/test/mbti/results\` | 60 | Sofia |
| **Big Five** | \`/test/big-five\` | \`/test/big-five/results\` | 50 | Sofia |
| **RIASEC** | \`/test/riasec\` | \`/test/riasec/results\` | 48 | Dani |
| **Soft Skills** | \`/test/soft-skills\` | \`/test/soft-skills/results\` | 60 | Dani |
| **Inteligencia Emocional** | \`/test/emotional-intelligence\` | \`/test/emotional-intelligence/results\` | 40 | Sofia |

### Características de Tests

- **Guardado automático** de progreso
- **Análisis con IA** (GPT-4)
- **Coaching personalizado** (Sofia/Dani)
- **Gráficos interactivos** (Recharts)
- **Exportación a PDF**
- **Comparación con pares**

---

## 👤 RUTAS DE USUARIO

### Dashboard y Perfil

| Ruta | Descripción | Requiere Auth |
|------|-------------|---------------|
| \`/dashboard\` | Dashboard principal | ✅ |
| \`/profile\` | Perfil de usuario | ✅ |
| \`/cerebro\` | Análisis básico multi-test | ✅ |
| \`/cerebro-avanzado\` | Análisis avanzado con IA | ✅ |

### Biblioteca

| Ruta | Descripción | Requiere Auth |
|------|-------------|---------------|
| \`/biblioteca\` | Catálogo de 120+ libros | ✅ |
| \`/biblioteca/[slug]\` | Lector de libros | ✅ |

### Coaching y Desarrollo

| Ruta | Descripción | Requiere Auth |
|------|-------------|---------------|
| \`/ai-coach\` | Coach IA básico | ✅ |
| \`/learning-paths\` | Rutas de aprendizaje | ✅ |
| \`/track-application\` | Seguimiento de aplicaciones | ✅ |

---

## ⚙️ RUTAS DE ADMINISTRACIÓN

### Panel Admin

| Ruta | Descripción | Requiere Admin |
|------|-------------|----------------|
| \`/admin/users\` | Gestión de usuarios | ✅ |
| \`/admin/coaching-analytics\` | Análisis de coaching | ✅ |
| \`/admin/prompt-management\` | Gestión de prompts | ✅ |
| \`/admin/critical-logs\` | Logs críticos | ✅ |
| \`/admin/review-workflow\` | Workflow de revisión | ✅ |
| \`/admin/ab-test-results\` | Resultados A/B testing | ✅ |
| \`/admin/prompt-bank\` | Banco de prompts (50+) | ✅ |
| \`/admin/automation\` | Automatización y cron | ✅ |
| \`/admin/kpi-dashboard\` | Dashboard de KPIs | ✅ |
| \`/admin/executive-summary\` | Resumen ejecutivo B2B | ✅ |
| \`/admin/brain\` | Knowledge base | ✅ |
| \`/admin/embeddings\` | Gestión de embeddings | ✅ |

---

## 🔌 API ENDPOINTS

### Autenticación y Usuario

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/user-profile\` | GET, PUT | Perfil de usuario |
| \`/api/user/whatsapp-config\` | GET, PUT | Configuración WhatsApp |

### Tests Psicométricos

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/test-results\` | POST | Guardar resultados |
| \`/api/test-results/[testType]\` | GET | Obtener resultados |
| \`/api/disc-results\` | POST, GET | Resultados DISC |
| \`/api/mbti-results\` | POST, GET | Resultados MBTI |
| \`/api/big-five-results\` | POST, GET | Resultados Big Five |
| \`/api/riasec-results\` | POST, GET | Resultados RIASEC |
| \`/api/soft-skills-results\` | POST, GET | Resultados Soft Skills |

### Coaching con IA

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/ai-coach\` | POST | Chat básico con IA |
| \`/api/ai-coach-advanced\` | POST | Chat avanzado con contexto |
| \`/api/ai-conversations\` | GET, POST | Historial de conversaciones |
| \`/api/coaching-session\` | POST | Crear sesión de coaching |
| \`/api/coaching-metrics\` | POST | Guardar métricas |
| \`/api/prompt-assignment\` | POST | Asignar variante A/B |
| \`/api/prompt-usage\` | POST | Tracking de uso |

### Cerebro (Análisis Multi-Test)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/cerebro-analyze-tests\` | POST | Análisis básico |
| \`/api/cerebro-enhanced\` | POST | Análisis avanzado |

### Biblioteca

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/books\` | GET | Lista de libros |
| \`/api/books/[id]\` | GET | Detalle de libro |
| \`/api/reading-progress\` | GET, POST | Progreso de lectura |
| \`/api/book-favorites\` | GET, POST, DELETE | Favoritos |

### Brain/Knowledge Base

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/brain-query\` | POST | Búsqueda básica |
| \`/api/brain-query-advanced\` | POST | Búsqueda avanzada |
| \`/api/brain-semantic\` | POST | Búsqueda semántica |
| \`/api/embeddings/generate\` | POST | Generar embeddings |

### Admin

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/admin/users\` | GET | Lista de usuarios |
| \`/api/admin/check\` | GET | Verificar permisos admin |
| \`/api/critical-prompts\` | GET | Prompts críticos |
| \`/api/review-tasks\` | GET, POST, PUT | Tareas de revisión |
| \`/api/admin-notifications\` | GET, PUT | Notificaciones admin |
| \`/api/ab-test-analysis\` | GET, POST | Análisis A/B testing |

### Exportación

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/export/metrics-csv\` | GET | Exportar métricas CSV |
| \`/api/export/ab-test-results-csv\` | GET | Exportar A/B CSV |
| \`/api/export/generate-report\` | POST | Generar reporte JSON |
| \`/api/export/books\` | GET | Exportar libros |

### Cron Jobs

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/cron/bimonthly-analysis\` | GET | Análisis bimestral |
| \`/api/cron/daily-metrics-summary\` | GET | Resumen diario |

### Otros

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| \`/api/recommendations\` | GET | Recomendaciones personalizadas |
| \`/api/post-test-insights\` | POST | Insights post-test |
| \`/api/weekly-insights\` | GET | Insights semanales |
| \`/api/daily-tip\` | GET | Consejo diario |
| \`/api/whatsapp/send\` | POST | Enviar WhatsApp |
| \`/api/whatsapp/schedule\` | POST | Programar WhatsApp |
| \`/api/applications\` | GET, POST | Aplicaciones laborales |
| \`/api/applications/[id]\` | GET, PUT, DELETE | Gestión de aplicación |
| \`/api/documentation\` | GET | Documentación completa |

---

## 🧩 COMPONENTES PRINCIPALES

### Layout y Navegación

- \`admin-navbar.tsx\` - Navbar de administración
- \`session-wrapper.tsx\` - Wrapper de sesión
- \`floating-coach-widget.tsx\` - Widget flotante de coaching

### Tests y Resultados

- \`disc-client.tsx\` - Cliente DISC
- \`test-navigation-flow.tsx\` - Navegación entre tests
- \`demo-disc-button.tsx\` - Demo DISC

### Coaching IA

- \`sofia-dani-coach.tsx\` - Coaches Sofia y Dani
- \`coach-selector.tsx\` - Selector de coach
- \`floating-coach-chat.tsx\` - Chat flotante
- \`enhanced-ai-coach.tsx\` - Coach avanzado

### Dashboard

- \`dashboard-content.tsx\` - Contenido del dashboard
- \`activity-calendar.tsx\` - Calendario de actividades
- \`gamification-system.tsx\` - Sistema de gamificación
- \`daily-career-tip.tsx\` - Consejo diario

### Biblioteca

- \`book-card.tsx\` - Tarjeta de libro
- \`book-reader.tsx\` - Lector de libros
- \`ai-reading-companion.tsx\` - Asistente de lectura

### Admin

- \`prompt-bank-dashboard.tsx\` - Dashboard de prompts
- \`ab-test-results-dashboard.tsx\` - Dashboard A/B testing
- \`automation-dashboard.tsx\` - Dashboard de automatización
- \`kpi-dashboard.tsx\` - Dashboard de KPIs
- \`executive-summary.tsx\` - Resumen ejecutivo

### Otros

- \`landing-page-optimized.tsx\` - Landing page
- \`interactive-faq.tsx\` - FAQ interactivo
- \`documentation-viewer.tsx\` - Visor de documentación
- \`application-status-tracker.tsx\` - Tracker de aplicaciones

---

## 📚 LIBRERÍAS Y UTILIDADES

### lib/ai/

- \`prompt-categories.ts\` - 5 categorías de prompts
- \`enhanced-prompts.ts\` - Prompts mejorados
- \`master-prompt-bank.ts\` - Banco de 50+ prompts

### lib/

- \`statistics.ts\` - Funciones estadísticas
- \`supabase-client.ts\` - Cliente Supabase
- \`supabase-server.ts\` - Cliente servidor
- \`openai.ts\` - Cliente OpenAI

### lib/adaptive-learning/

- \`blueprint.ts\` - Blueprint de aprendizaje adaptativo

---

## 🗄️ BASE DE DATOS

### Total: 121 Tablas

#### Tests Psicométricos (15 tablas)

- \`disc_results\`
- \`mbti_results\`
- \`big_five_results\`
- \`riasec_results\`
- \`soft_skills_results\`
- \`emotional_intelligence_results\`
- Y más...

#### Coaching y IA (10 tablas)

- \`coaching_sessions\`
- \`coaching_metrics\`
- \`ai_conversations\`
- \`prompt_versions\`
- \`prompt_variant_assignments\`
- \`prompt_performance\`
- \`prompt_review_tasks\`
- \`admin_notifications\`

#### Biblioteca (12 tablas)

- \`books\`
- \`reading_progress\`
- \`book_favorites\`
- \`book_notes\`
- Y más...

#### Usuarios (8 tablas)

- \`user_profiles\`
- \`user_goals\`
- \`user_achievements\`
- Y más...

---

## 🤖 SISTEMA DE IA - SOFIA & DANI

### Sofia - Coach Emocional

**Tono:** Empático, cercano, motivador
**Especialidad:** Autoconocimiento, emociones, motivación
**Tests:** MBTI, DISC, Big Five, Inteligencia Emocional

### Dani - Mentor Estratégico

**Tono:** Claro, estructurado, directo
**Especialidad:** Estrategia, planes de acción, desarrollo profesional
**Tests:** RIASEC, Soft Skills

### Categorías de Prompts (5)

1. **Autoconocimiento y Propósito**
2. **CV, LinkedIn y Marca Personal**
3. **Entrevistas y Comunicación**
4. **Crecimiento Profesional y Aumento Salarial**
5. **Reinvención y Transición de Carrera**

---

## 🔗 INTEGRACIONES

- **Supabase** - Base de datos y autenticación
- **OpenAI** - GPT-4 para coaching
- **Vercel Blob** - Almacenamiento de archivos
- **WhatsApp** - Notificaciones (configurado)

---

## ⏰ CRON JOBS

### Configurados en vercel.json

1. **Análisis Bimestral** - Cada 2 meses
   - Identifica prompts críticos
   - Analiza tests A/B
   - Genera notificaciones

2. **Resumen Diario** - Diario a las 9 AM
   - Métricas del día anterior
   - Alertas de problemas

---

## 🔐 VARIABLES DE ENTORNO

### Supabase
- \`SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`SUPABASE_ANON_KEY\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- \`SUPABASE_SERVICE_ROLE_KEY\`

### OpenAI
- \`OPENAI_API_KEY\`

### Vercel
- \`BLOB_READ_WRITE_TOKEN\`
- \`CRON_SECRET\` (solo servidor, nunca usar NEXT_PUBLIC_)

### PostgreSQL
- \`POSTGRES_URL\`
- \`POSTGRES_PRISMA_URL\`
- \`POSTGRES_URL_NON_POOLING\`

---

## 📊 MÉTRICAS Y KPIS

### Capítulo 3 - Sofia & Dani
- Engagement ≥ 76%
- Satisfacción ≥ 4.7
- Acción ≥ 68%
- Retención 30d ≥ 72%

### Capítulo 2 - SEO
- CTR ≥ 8.5%
- Top-10 ≥ 45 keywords

### Capítulo 5 - RAG
- Precisión ≥ 85%
- Latencia ≤ 1.5s

---

## 🚀 ROADMAP 2025-2027

### Q1 2025
- ✅ Sistema Sofia & Dani completo
- ✅ Banco de 50+ prompts
- ✅ A/B testing automatizado

### Q2 2025
- Expansión LATAM (50k+ usuarios)
- 8 clientes B2B
- 20k MAU

### Q3-Q4 2025
- Blueprint adaptativo avanzado
- Alianzas universitarias
- Expansión de contenidos

### Q1 2026
- ✅ Platform Launch & Public Release
- ✅ Core Features: 6 Psychometric Tests + 120+ Books + AI Coach
- ✅ GDPR Compliance & Security Systems
- ✅ 15+ Administrative Systems Operational

### Q2 2026
- 📱 Native iOS and Android mobile applications
- 🎤 Voice conversations with AI coach for hands-free guidance
- 🤝 Professional networking features to connect with peers
- 📊 Enhanced analytics dashboards with predictive insights

### Q3-Q4 2026
- 🏢 Enterprise features (team dashboards, bulk assessments, comparative analytics)
- 🛒 Marketplace for premium content and specialized courses
- 🌍 Multi-language support: English and Portuguese for LATAM expansion
- 🎯 Predictive analytics based on Chilean job market trends

### 2027
- 🤖 Advanced AI features (career path simulation, skill gap predictions)
- 💼 Full career services: resume building, job matching with Chilean companies
- 🎓 Structured learning paths with professional certifications
- 📈 Integration with major Chilean HR platforms and recruitment systems

---

## 📝 NOTAS FINALES

**Última actualización:** Enero 2025  
**Versión:** 2025.1.1.04-SUPREMO  
**Estado:** Pre-Launch (Q1 2026)
**Mantenido por:** Equipo DTC

Para más información, contactar: soporte@despegartuccarrera.cl

---

**FIN DE LA DOCUMENTACIÓN**
`

export async function GET() {
  console.log("[v0] Documentation API called")

  try {
    return new NextResponse(DOCUMENTATION_CONTENT, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("[v0] Error serving documentation:", error)
    return NextResponse.json({ error: "Failed to load documentation" }, { status: 500 })
  }
}
