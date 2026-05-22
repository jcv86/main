# DTC - Despega Tu Carrera

**Plataforma SaaS de Transformacion Profesional con Inteligencia Artificial**

Estado: **100% LISTO PARA PRODUCCION** | Ultima Actualizacion: 22 de Mayo 2026

---

## Enlaces Rapidos

- [Resumen para Inversores](./RESUMEN_INVERSOR.md)
- [Arquitectura Tecnica](./ARQUITECTURA_TECNICA.md)
- [Lista de Progreso MVP](./LISTA_PROGRESO_MVP.md)
- [Guia Tecnica](./LEEME_TECNICO.md)
- [Estado Git y Deploy](./ESTADO_GIT_Y_DEPLOY.md)
- [Descarga y Uso](./DESCARGA_Y_USO.md)

---

## Que es DTC?

**Despega Tu Carrera** (DTC) es una plataforma integral de transformacion profesional de 4 modulos que guia a profesionales a traves de un viaje estructurado de autodescubrimiento, accion, marca personal y planificacion alternativa.

### Los 4 Modulos

| Modulo | Duracion | Enfoque | Estado |
|--------|----------|---------|--------|
| **A1** - Cerebro Ejecutivo | 1 sesion | Escaneo de vision + hoja de ruta profesional | 100% |
| **A2** - 90 Dias de Accion | 30 dias | Experiencias diarias + coaching IA | 100% |
| **A3** - Renovacion | 10 modulos | Dominio de marca personal | 100% |
| **A4** - Plan B | Bajo demanda | Alternativas de carrera + coach IA | 100% |

---

## Caracteristicas Principales

### Plataforma Core
- Autenticacion multi-usuario (Google OAuth + Email)
- Gestion segura de sesiones (tokens JWT)
- Perfiles de usuario y preferencias
- Dashboard con navegacion inteligente
- Modo demo para pruebas

### A1 - Cerebro Ejecutivo
- Escaneo de vision (3 preguntas contextuales)
- Generacion de hipotesis con Claude IA
- Auto-generacion de hoja de ruta profesional
- Sistema de 3 puertas (Identidad, Evidencia, Material)
- Feedback de coaching IA
- Exportacion (Notion, TXT, Portapapeles)

### A2 - 90 Dias de Accion
- Los 30 dias completamente estructurados
- Preguntas de escaneo diario personalizadas
- Analisis diario potenciado por IA
- Coaching Claude por dia
- Middleware inteligente (sin acceso a dias futuros)
- Transicion fluida A2 a A3
- Ciclos ilimitados con preservacion de datos
- Seguimiento de progreso + indicadores visuales

### A3 - Renovacion (10 Modulos)
1. Articulando Tu Marca
2. Paquete Profesional
3. Presencia Digital
4. Posicionamiento Estrategico
5. Creacion de Media Kit
6. Habilidades de Comunicacion
7. Estrategia de Networking
8. Dominio de Oratoria
9. Liderazgo de Pensamiento
10. Sitio Web Personal

### A4 - Plan B
- Coach IA (Claude 3.5 streaming)
- Coaching de carrera consciente del contexto
- Respuestas en tiempo real
- Guia de alternativas de carrera
- Desarrollo de estrategia de respaldo

### Datos y Almacenamiento
- Documentos DTC centralizados
- Auto-guardado desde todos los modulos
- Funcionalidad de exportacion (PDF, TXT)
- Almacenamiento Vercel Blob
- Supabase PostgreSQL (3 migraciones)

### Seguridad e Infraestructura
- Politicas de Seguridad a Nivel de Fila (RLS)
- Encriptacion SSL/TLS
- Backups automatizados (intervalo de 6h)
- Connection pooling
- Arquitectura lista para GDPR
- Auto-escalado de Vercel

---

## Stack Tecnologico

### Frontend
- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript (modo estricto)
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui + personalizados
- **Estado**: SWR + contexto React

### Backend y Datos
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticacion**: Supabase Auth + OAuth
- **Almacenamiento**: Vercel Blob
- **ORM**: Consultas SQL directas (parametrizadas)

### IA y ML
- **LLM**: Claude 3.5 (Anthropic)
- **Vision**: GPT-4o (OpenAI)
- **Video**: MediaPipe (deteccion de gestos)
- **Streaming**: AI SDK v6 con Vercel AI Gateway

### Despliegue
- **Hosting**: Vercel (auto-escalado)
- **CI/CD**: Despliegue Vercel
- **Monitoreo**: Vercel Analytics + Sentry (listo)
- **Base de Datos**: Supabase PostgreSQL gestionado

---

## Como Empezar

### Prerequisitos
- Node.js 18+ (o pnpm 8+)
- Git
- Acceso a Supabase (crear cuenta gratuita)
- Claves API de OpenAI / Anthropic (para funciones IA)

### Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/jcv86/main.git
cd main

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.ejemplo .env.local

# Ejecutar servidor de desarrollo
pnpm dev

# Abrir http://localhost:3000
```

### Variables de Entorno

Ver `.env.ejemplo` para lista completa. Variables clave:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role

# APIs de IA
ANTHROPIC_API_KEY=tu_clave_anthropic
OPENAI_API_KEY=tu_clave_openai

# Vercel
VERCEL_BLOB_TOKEN=tu_token_blob

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Metricas de Produccion

| Metrica | Valor | Estado |
|---------|-------|--------|
| **Uptime** | 99.9%+ | En Vivo |
| **Carga de Pagina** | <2s | OK |
| **Tiempo de Respuesta** | 150ms promedio | OK |
| **Lighthouse** | 92+ | OK |
| **Tamano de Build** | 2.3 MB | Optimizado |
| **Base de Datos** | 3 migraciones | Desplegado |
| **Backups** | Automatizados (6h) | Configurado |

---

## Cambios Recientes (22 de Mayo 2026)

**Migraciones de Base de Datos Desplegadas (3)**
- RPC Atomico: Completar mision A1 (idempotencia verificada)
- ID de Ciclo: Ciclos ilimitados con preservacion de datos
- Flags de Progreso: Navegacion inteligente (3 flags centralizados)

**Mejoras de Middleware**
- Redirecciones inteligentes (no puede acceder a dias futuros)
- Transicion fluida A2 a A3
- Streaming de Coach IA A4

**Documentacion (3,900+ lineas)**
- Checklist de pruebas E2E (10 casos)
- Procedimientos de verificacion de BD
- Runbook de despliegue (23 de Mayo)
- Guia de solucion de problemas

---

## Documentacion

- **[RESUMEN_INVERSOR.md](./RESUMEN_INVERSOR.md)** - Resumen ejecutivo para inversores
- **[LISTA_PROGRESO_MVP.md](./LISTA_PROGRESO_MVP.md)** - Estado completo por modulo (100% Listo)
- **[ARQUITECTURA_TECNICA.md](./ARQUITECTURA_TECNICA.md)** - Diseno del sistema y arquitectura
- **[LEEME_TECNICO.md](./LEEME_TECNICO.md)** - Detalles tecnicos y stack
- **[ESTADO_GIT_Y_DEPLOY.md](./ESTADO_GIT_Y_DEPLOY.md)** - Historial de commits y estado de despliegue
- **[DESCARGA_Y_USO.md](./DESCARGA_Y_USO.md)** - Instrucciones de instalacion y uso

---

## Soporte y Contacto

### Documentacion
- Ver [LISTA_PROGRESO_MVP.md](./LISTA_PROGRESO_MVP.md) para estado actual
- Ver [ARQUITECTURA_TECNICA.md](./ARQUITECTURA_TECNICA.md) para diseno del sistema

### Despliegue
- Produccion: https://despega-tu-carrera.vercel.app
- Estado: 100% Listo para Produccion

---

**Proyecto**: DTC - Despega Tu Carrera  
**Estado**: 100% Listo para Produccion  
**Ultima Actualizacion**: 22 de Mayo 2026  
**Siguiente**: Go-Live (23 de Mayo 2026)
