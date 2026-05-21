# ARQUITECTURA TÉCNICA - DTC Despega Tu Carrera

**Documento:** Arquitectura de Sistema  
**Versión:** 5.0.0  
**Fecha:** 2026-05-20  
**Clasificación:** Técnico  

---

## 1. DIAGRAMA DE ARQUITECTURA GENERAL

```
┌────────────────────────────────────────────────────────────────┐
│                   USUARIO / CLIENTE                            │
│                  (Browser - Desktop/Mobile)                    │
└─────────────────────────────┬──────────────────────────────────┘
                              │ HTTPS
                              ▼
        ┌─────────────────────────────────────────┐
        │   VERCEL EDGE NETWORK (CDN/Cache)       │
        │                                         │
        │   - SSR/SSG rendering                   │
        │   - Geographic distribution              │
        │   - DDoS protection                      │
        └────────────────┬────────────────────────┘
                         │
                         ▼
        ┌─────────────────────────────────────────┐
        │      NEXT.JS 15 APPLICATION             │
        │  ┌───────────────────────────────────┐  │
        │  │  Pages & Components (React)       │  │
        │  │                                   │  │
        │  │  /home                            │  │
        │  │  /despega/a1, a2, a3, a4          │  │
        │  │  /la-realidad/documentos          │  │
        │  │  /dashboard                       │  │
        │  └─────────────┬─────────────────────┘  │
        │                │                         │
        │  ┌─────────────▼─────────────────────┐  │
        │  │  API Routes (Backend)             │  │
        │  │                                   │  │
        │  │  /api/auth/*                      │  │
        │  │  /api/dtc/*                       │  │
        │  │  /api/ai/coach                    │  │
        │  │  /api/user/*                      │  │
        │  │  /api/analytics/*                 │  │
        │  └──────────────┬──────────────────┘  │
        │                 │                       │
        │  ┌──────────────┴──────────────────┐  │
        │  │  Middleware & Auth              │  │
        │  │  - NextAuth.js                  │  │
        │  │  - Protected routes             │  │
        │  │  - Session validation           │  │
        │  └──────────────┬──────────────────┘  │
        └─────────────────┼──────────────────────┘
                          │
        ┌─────────────────┼─────────────────────┐
        │                 │                     │
        ▼                 ▼                     ▼
    ┌───────────┐    ┌──────────┐        ┌──────────────┐
    │ SUPABASE  │    │ VERCEL   │        │ AI SERVICES  │
    │ (Database)│    │ BLOB     │        │              │
    │           │    │(Storage) │        │ ┌──────────┐ │
    │ ┌───────┐ │    │          │        │ │ Anthropic│ │
    │ │  PG   │ │    │ - Files  │        │ │(Claude)  │ │
    │ │ DB    │ │    │ - PDFs   │        │ └──────────┘ │
    │ │       │ │    │ - Images │        │              │
    │ │ Auth  │ │    │ - Videos │        │ ┌──────────┐ │
    │ │ API   │ │    │          │        │ │  OpenAI  │ │
    │ │ RLS   │ │    └──────────┘        │ │(GPT-4o)  │ │
    │ └───────┘ │                        │ └──────────┘ │
    │           │                        │              │
    │ Tables:   │                        │ APIs:        │
    │ - users   │                        │ - Chat API   │
    │ - documents                        │ - Vision API │
    │ - sessions│                        │              │
    │           │                        │ MediaPipe:   │
    └───────────┘                        │ - Gestures   │
                                         │ - Emotions   │
                                         └──────────────┘
```

---

## 2. FLUJO DE DATOS - USUARIO NUEVO

```
1. LANDING & SIGNUP
   ├─ User visita https://despega-tu-carrera.com
   ├─ Hace click en "Comenzar"
   ├─ Redirige a /auth/login
   └─ Selecciona: "Google OAuth" o "Email"

2. GOOGLE OAUTH
   ├─ NextAuth.js → Google OAuth endpoint
   ├─ Usuario autoriza en Google
   ├─ Google → callback: /auth/callback?code=xxx
   ├─ NextAuth intercepts y crea sesión
   ├─ Supabase Auth crea usuario si no existe
   └─ Redirige a /despega (dashboard)

3. FIRST LOGIN EXPERIENCE
   ├─ Dashboard carga useAuthRedirect hook
   ├─ Hook verifica Supabase session (PRIORITARIO)
   ├─ Si hay Google session → Usa email real usuario
   ├─ Si NO → Intenta demo user (fallback)
   ├─ Si NADA → Redirige a /auth/login
   └─ Carga perfil del usuario

4. MÓDULO A1 (Cerebro Ejecutivo)
   ├─ Usuario elige "Comenzar A1"
   ├─ Responde 3 preguntas de visión
   ├─ Frontend → /api/ai/coach POST
   │  └─ Data: { questions, user_context }
   ├─ Backend:
   │  ├─ Valida sesión
   │  ├─ Llama Claude 3.5 API
   │  ├─ Claude genera hipótesis de ruta
   │  └─ Retorna análisis + recomendaciones
   ├─ Frontend renderiza resultados
   ├─ Usuario completa módulo
   └─ OnComplete → saveDayDocument() → Supabase

5. AUTO-SAVE A DTC DOCUMENTS
   ├─ saveDayDocument(userId, 1, 'route_contract', content)
   ├─ Backend: upsertDocument() en Supabase
   │  ├─ Query: SELECT id FROM dtc_documents WHERE user_id = $1 AND type = $2
   │  ├─ Si existe → UPDATE
   │  ├─ Si NO → INSERT
   │  └─ RLS Policy: (auth.uid() = user_id) THEN permitir
   ├─ Documento guardado en dtc_documents table
   └─ User puede ver en /la-realidad/documentos

6. MÓDULO A2 (90 Días)
   ├─ Usuario selecciona Día X
   ├─ Carga A2DayXExperience component
   ├─ Sigue flujo similar:
   │  ├─ Responde pregunta del día
   │  ├─ IA genera análisis
   │  ├─ MediaPipe (opcional): Análisis de video
   │  ├─ Claude proporciona coaching
   │  └─ Usuario exporta o guarda
   └─ Auto-save a DTC Documents (día_X_analysis)

7. PERSISTENCIA
   └─ Supabase RLS asegura:
      ├─ Cada usuario solo ve sus documentos
      ├─ Cada usuario solo puede editar sus datos
      ├─ Admin puede ver todas (si necesario)
      └─ Backups automáticos diarios
```

---

## 3. CAPAS DE APLICACIÓN

### Capa 1: PRESENTACIÓN (Frontend)
**Tecnología:** React 18 + Next.js 15  
**Responsabilidades:**
- Renderizado de UI
- Gestión de estado local (Zustand)
- Manejo de formularios
- Validación cliente-side
- SWR para data fetching

**Componentes Clave:**
```
App/
├── Home (/)
├── Auth (login, signup, callback)
├── Dashboard (/despega)
│   ├── A1 (/despega/a1)
│   ├── A2 (/despega/a2/dia-1...30)
│   ├── A3 (/despega/a3)
│   └── A4 (/despega/a4)
└── La Realidad (/la-realidad)
    └── Documents UI
```

### Capa 2: API & BACKEND (Next.js Routes)
**Tecnología:** Next.js API Routes  
**Responsabilidades:**
- Validación servidor-side
- Llamadas a APIs externas (Anthropic, OpenAI)
- Database operations
- Manejo de sesiones
- Autenticación

**Rutas:**
```
/api/
├── auth/
│   ├── callback
│   ├── signin
│   └── signout
├── ai/
│   ├── coach (POST)
│   └── analyze (POST)
├── dtc/
│   ├── documents (GET, POST)
│   ├── documents/[id] (PUT, DELETE)
│   └── upload (POST)
├── user/
│   ├── profile (GET, PUT)
│   └── preferences (GET, PUT)
└── analytics/
    ├── progress (GET)
    └── engagement (GET)
```

### Capa 3: DATOS (Supabase PostgreSQL)
**Tecnología:** Supabase PostgreSQL  
**Responsabilidades:**
- Almacenamiento persistente
- Transacciones
- Integridad referencial
- RLS policies

**Tablas Principales:**
```sql
-- Auth
auth.users (auto Supabase)

-- Application
public.user_profiles
├── id (PK)
├── auth_id (FK)
├── name
├── email
├── profile_data (JSONB)

public.dtc_documents
├── id (PK)
├── user_id (FK)
├── type (route_contract, evidence, cv_bullet, etc.)
├── title
├── content (TEXT)
├── related_day (INT)
├── source_module
├── status (draft, published)
├── tags (ARRAY)
├── created_at
├── updated_at

public.ai_sessions
├── id (PK)
├── user_id (FK)
├── module (a1, a2, a3, a4)
├── day_number (para A2)
├── messages (JSONB array)
├── context (JSONB)
├── created_at
```

### Capa 4: INTEGRACIONES EXTERNAS

#### Supabase Auth
```
Flow:
  User → Google OAuth
  → Google → Callback
  → Supabase Auth intercepts
  → Session created
  → JWT token issued
  → Frontend stores token
  → Protected routes validate token
```

#### Anthropic Claude 3.5
```
Flow:
  Frontend → /api/ai/coach (POST)
  → Backend validates session
  → Backend → Anthropic API (sk-ant-...)
  → Claude procesa user input
  → Claude retorna análisis
  → Backend streams response
  → Frontend renderiza
  → Guardar en DTC Documents (optional)

Max tokens: 2000 (configurable)
Temperature: 0.7 (creative but focused)
```

#### OpenAI GPT-4o
```
Flow:
  Similar a Claude pero para análisis multimodal
  → Puede procesar imágenes, videos (PDFs)
  → Used for visual content analysis
```

#### MediaPipe Vision
```
Libraries:
  @mediapipe/tasks-vision

Capabilities:
  - Pose detection
  - Hand landmarks
  - Face detection
  - Gesture recognition
  - Emotion detection (custom training)

Flow:
  Video upload → Client-side processing
  → MediaPipe analyze → Features extracted
  → Send to backend for context
  → Claude generates coaching
```

---

## 4. FLUJO DE SEGURIDAD

### Autenticación
```
1. User signs in (Google or Email)
2. Supabase Auth creates JWT
3. Frontend stores in httpOnly cookie
4. NextAuth.js validates on each request
5. Protected routes check session
6. If no session → redirect to /auth/login
```

### Row-Level Security (RLS)
```sql
-- Ejemplo: dtc_documents RLS
ALTER TABLE dtc_documents ENABLE RLS;

CREATE POLICY "Users can see own documents"
  ON dtc_documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON dtc_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON dtc_documents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Solo admin o propietario puede eliminar
CREATE POLICY "Users can delete own documents"
  ON dtc_documents
  FOR DELETE
  USING (auth.uid() = user_id);
```

### API Key Management
```
- ANTHROPIC_API_KEY: Server-only env var (never exposed to client)
- OPENAI_API_KEY: Server-only env var
- NEXT_PUBLIC_SUPABASE_*: Public (safe for client)
- Supabase RLS: Protege datos sensibles incluso con public key
```

---

## 5. ESCALABILIDAD & PERFORMANCE

### Frontend Optimization
- **Next.js Image Optimization:** `next/image` component
- **Code Splitting:** Automatic route-based splitting
- **SSR/SSG:** Hybrid rendering strategy
- **SWR:** Client-side caching + revalidation

### Backend Optimization
- **Database Connection Pooling:** Supabase pgbouncer
- **Query Optimization:** Indexed columns, efficient WHERE clauses
- **API Response Caching:** SWR on client, ETag headers
- **Rate Limiting:** Per-user API limits (future enhancement)

### Infrastructure
- **Vercel Edge Functions:** For rapid response
- **CDN:** Vercel global edge network
- **Blob Storage:** Optimized file serving
- **Database:** Supabase managed PostgreSQL with backups

---

## 6. MONITOREO & OBSERVABILIDAD

### Logging
```javascript
// Frontend
console.log("[v0] Event:", event)
// Error tracking via browser console

// Backend
console.error("[v0] API Error:", error)
// Supabase query logs
// Vercel Functions logs
```

### Metrics
- **Vercel Analytics:** Core Web Vitals
- **Supabase:** Query performance, connection count
- **Error Tracking:** Via console logs (upgrade to Sentry)

### Alerting (Future)
- Uptime monitoring
- Error rate thresholds
- Performance degradation alerts

---

## 7. DEPLOYMENT PIPELINE

```
Local Dev
    ↓
Git Commit
    ↓
Push to GitHub (branch: v0/jcv86-4cea421a)
    ↓
Vercel Webhook
    ↓
Auto Build & Test
    ↓
Staging Deploy (preview-*)
    ↓
Manual Review / Testing
    ↓
Merge to Main / Push
    ↓
Production Deploy (despega-tu-carrera.vercel.app)
    ↓
Health Checks
    ↓
Live 🎉
```

---

## 8. PRÓXIMA ARQUITECTURA (Post-MVP)

### Mejoras Planeadas
1. **Microservicios:** Separar API routes por dominio
2. **Message Queue:** Bull/Redis para background jobs
3. **Caching Layer:** Redis para sesiones y datos hot
4. **Search:** Elasticsearch para búsqueda de documentos
5. **Mobile:** React Native app con mismo backend
6. **Analytics:** PostHog o Mixpanel para eventos

### Multi-Tenant (Si aplica)
- Separar por tenant_id en RLS
- Isolate data per organization
- Custom branding per tenant

---

## 9. DISASTER RECOVERY

### Backups
- **Supabase:** Automatic daily backups (7 days retention)
- **Vercel Blob:** Automated replication
- **Git:** Full history in GitHub

### Recovery Process
```
1. Detect issue
2. Alert team
3. Rollback to previous version (Vercel)
4. OR restore from Supabase backup
5. Verify data integrity
6. Redeploy
```

---

## 10. STACK SUMMARY

```
┌─ FRONTEND ─────────────────────────────┐
│ React 18 | Next.js 15 | Tailwind CSS   │
│ Radix UI | Shadcn | Zustand | SWR      │
│ AI SDK 6 | TypeScript                  │
└────────────────────────────────────────┘
         ↓
┌─ BACKEND ──────────────────────────────┐
│ Next.js API Routes | TypeScript         │
│ NextAuth.js | Supabase Auth             │
└────────────────────────────────────────┘
         ↓
┌─ DATA & SERVICES ──────────────────────┐
│ Supabase (PostgreSQL + Auth)            │
│ Vercel Blob (File Storage)              │
│ Anthropic Claude 3.5 (IA Coaching)      │
│ OpenAI GPT-4o (Multi-modal Analysis)    │
│ MediaPipe (Vision Processing)           │
│ Google OAuth (Social Auth)              │
└────────────────────────────────────────┘
```

---

**Documento Fin**

