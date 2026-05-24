# DTC - Despega Tu Carrera - Paquete Técnico 2026

**Generado:** 2026-05-20  
**Versión:** 5.0.0  
**Estado:** MVP 85%+ en desarrollo  

---

## 1. Stack Tecnológico

### Frontend
- **Framework:** Next.js 15+ (App Router)
- **UI Components:** Radix UI, Shadcn/UI
- **Styling:** Tailwind CSS 3+
- **State Management:** Zustand, SWR
- **AI/Chat:** Vercel AI SDK (Anthropic, OpenAI)
- **Vision:** MediaPipe Tasks Vision (análisis de video)

### Backend & Infra
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Google, Email)
- **Storage:** Vercel Blob
- **Deployment:** Vercel
- **ORM:** Raw SQL queries (transactional)

### Integraciones Externas
- **IA:** Claude 3.5 Sonnet (análisis y coaching)
- **IA:** GPT-4o (análisis multimedia)
- **Video:** MediaPipe (detección de gestos, emociones)
- **Auth Social:** Google OAuth

### DevOps & Tooling
- **Package Manager:** pnpm
- **Version Control:** Git (2986 commits)
- **CI/CD:** Vercel auto-deploy
- **Testing:** TypeScript strict mode
- **Linting:** ESLint, Next.js lint

---

## 2. Cómo Correr Localmente

### Requisitos
- Node.js 18+
- pnpm 8+
- Variables de entorno (ver .env.example)

### Instalación
```bash
# Clonar repo
git clone <repo-url>
cd dtc-final

# Instalar dependencias
pnpm install

# Configurar .env (copiar .env.example)
cp .env.example .env.local
# Llenar: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, etc.

# Dev server
pnpm dev

# Build producción
pnpm build
pnpm start
```

**URL Local:** http://localhost:3000

---

## 3. Rutas Principales

### Públicas
- `/` - Home/Inicio
- `/auth/login` - Autenticación
- `/auth/callback` - OAuth callback

### Dashboard (Autenticado)
- `/despega` - Hub central
- `/despega/a1` - Módulo A1 (Cerebro Ejecutivo)
- `/despega/a2/dia-1...dia-30` - Módulo A2 (90 Días)
- `/despega/a3` - Módulo A3 (Renovación)
- `/despega/a4` - Módulo A4 (Plan B)
- `/dashboard` - Dashboard de usuario

### Admin/La Realidad
- `/la-realidad/documentos` - DTC Documents (CV, evidencia)
- `/la-realidad/coaching` - Feedback de IA
- `/la-realidad/reporte` - Reportes y análisis

---

## 4. Módulos Funcionales Principales

### A1: Cerebro Ejecutivo (Visión & Propósito)
- Escaneo de visión personal (3 preguntas contextuales)
- Generación de hipótesis de ruta profesional
- Validación de 3 puertas (Identidad, Evidencia, Material)
- Roadmap auto-generado
- Auto-save a DTC Documents

### A2: 90 Días de Acción (Transformación)
- 30 días de experiencias estructuradas
- Cada día:
  - Escaneo contextual (pregunta del día)
  - Análisis con IA
  - Retroalimentación del coach (Claude)
  - Auto-save a DTC Documents
- Integración con análisis de video (MediaPipe)
- Exportación a Notion, TXT, Clipboard

### A3: Renovación (Portfolio & Personal Branding)
- 10 módulos de especialización:
  1. Articulating Your Brand
  2. Professional Package Design
  3. Digital Presence
  4. Strategic Positioning
  5. Media Kit Creation
  6. Communication Skills
  7. Network Strategy
  8. Speaking Mastery
  9. Thought Leadership
  10. Personal Website
- Documentación y entregables por módulo
- Auto-save de evidencia a DTC Documents

### A4: Plan B (En desarrollo)
- Gestión de rutas alternativas
- Backup profesional
- (Funcionalidad en progreso)

### Subsistemas
- **DTC Documents:** Almacenamiento centralizado de documentos y evidencia
- **Coaching IA:** Claude 3.5 proporciona feedback contextual
- **Vision Analysis:** MediaPipe para análisis de gestos/lenguaje corporal
- **Dashboard:** Visibilidad de progreso, analytics, reportes

---

## 5. Qué Está Mockeado vs Producción

### Funcional (Producción)
✅ Autenticación (Google OAuth + Email)
✅ A1 completo (cerebro ejecutivo)
✅ A2 Día 1 a 30 (todos los 30 días)
✅ A3 módulos 1-10
✅ DTC Documents (almacenamiento y recuperación)
✅ IA Coaching (Claude 3.5)
✅ Exportaciones (Notion, TXT, Clipboard)
✅ Media handling (imágenes, PDFs)
✅ Dashboard de usuario

### Demo/Mock (Desarrollo)
⚙️ Demo user "travis@nuanu.com" para testing sin Supabase
⚙️ Pre-filled data para demostración rápida
⚙️ Algunos endpoints de analytics retornan datos staticó

### Pendiente/En Desarrollo
❌ A4 completo
❌ Integración Notion bidireccional (solo export)
❌ Analytics avanzado
❌ Certificaciones/Gamificación
❌ Comunidad/Red social
❌ Mobile app nativa

---

## 6. Dependencias Críticas Externas

| Servicio | Propósito | Estado |
|----------|-----------|--------|
| Supabase | DB + Auth | Producción |
| Vercel | Deploy + CDN | Producción |
| Vercel Blob | File Storage | Producción |
| Anthropic API | IA Coaching | Producción |
| OpenAI API | Análisis multimedia | Producción |
| Google OAuth | Social Auth | Producción |
| MediaPipe | Vision Analysis | Desarrollo |

---

## 7. Estructura de Carpetas

```
dtc-final/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home
│   ├── auth/              # Auth flows
│   ├── despega/           # Main dashboard
│   │   ├── a1/           # Módulo A1
│   │   ├── a2/dia-1...30/# Módulo A2
│   │   ├── a3/           # Módulo A3
│   │   └── a4/           # Módulo A4
│   └── la-realidad/       # Admin/Reality
├── components/            # React components
│   ├── a1-*.tsx          # A1 components
│   ├── a2-day*.tsx       # A2 daily components
│   ├── a3-*.tsx          # A3 components
│   ├── auth-*.tsx        # Auth components
│   └── ...
├── lib/                   # Utilities & helpers
│   ├── supabase/         # DB functions
│   ├── auth-helper.ts    # Auth utilities
│   └── ai/               # IA/Claude helpers
├── hooks/                 # React hooks
├── public/               # Static assets
├── styles/               # Global styles
└── v0_memories/          # v0 context memory

```

---

## 8. Variables de Entorno Necesarias

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# IA APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Auth
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=https://yourdomain.com

# Vercel Blob (optional)
BLOB_READ_WRITE_TOKEN=<token>
```

---

## 9. Arquitectura de Alto Nivel

```
┌─────────────────────────────────────┐
│      Vercel (Next.js 15)            │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Frontend (React)                ││
│  │ - Home, Auth, Dashboard         ││
│  │ - A1, A2, A3, A4 modules        ││
│  │ - DTC Documents UI              ││
│  └─────────────────────────────────┘│
│                │                     │
│                ▼                     │
│  ┌─────────────────────────────────┐│
│  │ API Routes (Next.js)            ││
│  │ - /api/auth/*                   ││
│  │ - /api/dtc/*                    ││
│  │ - /api/ai/coach                 ││
│  │ - /api/analytics/*              ││
│  └─────────────────────────────────┘│
└──────────┬──────────────────────────┘
           │
           ├──► Supabase (DB + Auth)
           │    └─ PostgreSQL
           │    └─ RLS Policies
           │
           ├──► Vercel Blob (Storage)
           │    └─ PDFs, images, docs
           │
           ├──► Anthropic API
           │    └─ Claude 3.5 (coaching)
           │
           ├──► OpenAI API
           │    └─ GPT-4o (analysis)
           │
           └──► Google OAuth
                └─ Authentication
```

---

## 10. Próximos Hitos

### Corto Plazo (Jun 2026)
- [ ] Completar A4 (Plan B)
- [ ] Analytics avanzado
- [ ] Mobile-responsive improvements

### Mediano Plazo (Jul-Aug 2026)
- [ ] Integración Notion bidireccional
- [ ] Certificaciones y badges
- [ ] Gamificación (puntos, leaderboards)

### Largo Plazo (Sep+ 2026)
- [ ] Community features
- [ ] Social network
- [ ] Mobile app
- [ ] Offline mode
- [ ] Multi-language support

---

## 11. Deploy & Producción

**URL Producción:** https://despega-tu-carrera.vercel.app  
**URL Preview:** https://preview-dtc-[branch].vercel.app  
**Última Release:** 2026-05-20  
**Status:** ✅ Estable

### Monitoreo
- Vercel Analytics (Core Web Vitals)
- Error tracking via console
- Database query logging (Supabase)

---

## 12. Contacto & Soporte

**Autor:** DTCFinal Team  
**Email:** info@despegatucarrera.com  
**GitHub:** [private repo]  
**Docs:** Ver carpeta `./docs/`

