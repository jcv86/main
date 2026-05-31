# ARQUITECTURA TÉCNICA - DTC Despega Tu Carrera

**Documento:** Diseño y Arquitectura del Sistema  
**Fecha:** 22 de Mayo 2026  
**Versión:** 6.0.0 - Producción  
**Status:** ✅ Desplegado en Producción

---

## Descripción General del Sistema

```
┌─ USUARIOS WEB ──────────────────────────────────────┐
│  Navegadores Desktop/Mobile (Acceso Global)        │
└──────────┬──────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────────────────┐
│  NEXT.JS 15 (React 18 + TypeScript + Tailwind)     │
│  Hospedado en Vercel (CDN Global + Auto-escalado)  │
│                                                     │
│  ├─ Páginas (App Router)                           │
│  │  ├─ /panel (hub principal)                      │
│  │  ├─ /modulos/a1 (cerebro ejecutivo)            │
│  │  ├─ /modulos/a2/dia-[1-30]                     │
│  │  ├─ /modulos/a3/[modulo-1-10]                  │
│  │  ├─ /modulos/a4 (plan b - coach ia)            │
│  │  └─ /documentos (centro dtc)                    │
│  │                                                   │
│  ├─ Rutas API                                       │
│  │  ├─ /api/auth/* (autenticación supabase)       │
│  │  ├─ /api/missions/* (llamadas a1)              │
│  │  ├─ /api/diario/* (streaming a2)               │
│  │  ├─ /api/ia/* (claude streaming)               │
│  │  └─ /api/documentos/* (operaciones dtc)        │
│  │                                                   │
│  └─ Middleware                                      │
│     ├─ Protección de autenticación                 │
│     ├─ Redirecciones inteligentes                  │
│     ├─ Actualización de sesiones (jwt)             │
│     └─ Limitación de tasas                         │
│                                                     │
└──────────┬──────────────────────────────────────────┘
           │
    ┌──────┼────────┬──────────────┬──────────┐
    │      │        │              │          │
    ▼      ▼        ▼              ▼          ▼
┌─────────────┐ ┌───────────┐ ┌──────────┐ ┌─────────┐
│ Supabase    │ │Vercel Blob│ │Anthropic │ │ OpenAI  │
│(PostgreSQL) │ │(Almacen)  │ │(Claude)  │ │(GPT-4o) │
│             │ │           │ │          │ │         │
│ ├─ Auth     │ │ ├─Docs    │ │Claude 3.5│ │GPT-4o   │
│ ├─ Database │ │ ├─Uploads │ │Sonnet    │ │Multi-   │
│ └─ RLS      │ │ └─Images  │ │Streaming │ │modal    │
└─────────────┘ └───────────┘ └──────────┘ └─────────┘
```

## Stack Tecnológico Completo

### Frontend
- **Framework:** Next.js 15 con App Router
- **UI:** React 18 con TypeScript
- **Estilos:** Tailwind CSS + shadcn/ui
- **Estado:** Zustand + SWR
- **Validación:** Zod

### Backend
- **Base de datos:** Supabase PostgreSQL
- **Autenticación:** Supabase Auth + OAuth Google
- **Almacenamiento:** Vercel Blob
- **API:** Next.js API Routes
- **Sesiones:** JWT seguras

### Inteligencia Artificial
- **Coach IA:** Claude 3.5 Sonnet (Anthropic)
- **Análisis:** GPT-4o (OpenAI)
- **Video:** MediaPipe (análisis en tiempo real)
- **Streaming:** AI SDK v6

### DevOps & Hosting
- **Hosting:** Vercel (Global CDN)
- **CI/CD:** GitHub Actions
- **Versionamiento:** Git con 3,020+ commits
- **Monitoreo:** Logs en Vercel

## Módulos Principales (A1-A4)

### A1: Cerebro Ejecutivo (90 días)
- Sesiones diarias con inteligencia ejecutiva
- Feedback inteligente con Claude 3.5
- Visualización de progreso en tiempo real
- Guardado automático de sesiones

### A2: Transformación Profesional (30 días)
- 30 lecciones diarias estructuradas
- Streaming en vivo de contenido
- Materiales descargables
- Seguimiento de completitud

### A3: Módulos Especializados (10 módulos)
- Módulos temáticos independientes
- Profundización en temas específicos
- Ejercicios prácticos
- Certificados de completitud

### A4: Plan B - Coach IA
- Chatbot alimentado por Claude 3.5
- Respuestas personalizadas en tiempo real
- Integración con historial del usuario
- Streaming de respuestas

## Seguridad

### Autenticación
- OAuth con Google integrado
- JWT seguro en cookies HTTP-only
- Sessions con Supabase Auth
- Tokens actualizables

### Protección de Datos
- Row Level Security (RLS) en Supabase
- Encriptación en tránsito (HTTPS)
- Validación en backend
- Sanitización de inputs

### Rate Limiting
- Límites de tasa en APIs
- Protección contra bots
- Monitoreo de uso anómalo

## Base de Datos

### Tablas Principales
- **users:** Perfiles de usuario
- **documents:** Documentación DTC
- **sessions:** Historial de sesiones
- **missions:** Misiones completadas
- **daily_content:** Contenido de A2
- **modules:** Módulos de A3
- **chat_history:** Historial de IA

### Migraciones Deployed
1. Setup inicial (auth, docs)
2. Módulos A1-A4
3. Integraciones IA

## APIs Públicas

### Documentos (Sin Autenticación)
- GET `/api/documentos/ver/[archivo]` - Ver documento
- GET `/api/documentos/download?file=[archivo]` - Descargar
- GET `/documentos` - Centro de descargas

### Autenticación (Con Autenticación)
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/user` - Info usuario

### Contenido (Con Autenticación)
- GET `/api/missions/progress` - Progreso A1
- GET `/api/daily/[day]` - Contenido A2
- GET `/api/modules/[id]` - Módulos A3
- POST `/api/chat` - Chat IA A4

## Performance

### Optimizaciones
- Code splitting automático
- Lazy loading de componentes
- Caché de SWR en cliente
- Compresión de assets
- Image optimization

### Métricas
- Time to First Byte (TTFB): < 200ms
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

## Deployment

### Ambiente Producción
- Vercel Global CDN
- Auto-escalado automático
- Zero downtime deployments
- Backups automáticos

### Versión
- **Actual:** 6.0.0
- **Release Date:** 22 de Mayo 2026
- **Status:** 100% Production Ready
- **Go-Live:** 23 de Mayo 2026

## Monitoreo & Alertas

- Logs en tiempo real en Vercel
- Error tracking automático
- Performance monitoring
- Alertas de downtime

---

**Última Actualización:** 22 de Mayo 2026  
**Status:** ✅ 100% Listo para Producción  
**Versión:** 6.0.0
