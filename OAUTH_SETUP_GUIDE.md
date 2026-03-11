# OAuth Setup Guide - Google & LinkedIn Integration

## 🎯 Objetivo
Permitir a usuarios autenticarse con Google y LinkedIn, auto-completando su perfil profesional para personalizar A1-A4.

## 📋 Tabla de Contenidos
1. [Setup Google OAuth](#setup-google-oauth)
2. [Setup LinkedIn OAuth](#setup-linkedin-oauth)
3. [Variables de Entorno](#variables-de-entorno)
4. [Testing](#testing)

---

## 🔵 Setup Google OAuth

### Paso 1: Crear Proyecto en Google Cloud Console

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear nuevo proyecto: `Despega Tu Carrera`
3. Habilitar Google+ API:
   - En busca, escribir "Google+ API"
   - Click en "Enable"

### Paso 2: Crear OAuth 2.0 Credentials

1. Ir a **Credentials** en el sidebar
2. Click **Create Credentials** → **OAuth Client ID**
3. Seleccionar **Web Application**
4. Nombres autorizados:
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://tu-dominio.com` (producción)
   
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://tu-dominio.com/api/auth/callback/google`

5. Copy **Client ID** y **Client Secret**

### Paso 3: Guardar en Vercel

En tu proyecto de Vercel (Settings → Environment Variables):
```
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
```

---

## 💼 Setup LinkedIn OAuth

### Paso 1: Crear Aplicación en LinkedIn Developer

1. Ir a [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click **Create app**
3. Llenar info:
   - **App name**: `Despega Tu Carrera`
   - **LinkedIn Page**: (crear page si no tienes)
   - **App logo**: (subir logo)
   - **Legal agreement**: aceptar

### Paso 2: Configurar OAuth 2.0

1. En tu app, ir a **Auth** tab
2. **Authorized redirect URLs**:
   - Agregar: `http://localhost:3000/api/auth/callback/linkedin`
   - Agregar: `https://tu-dominio.com/api/auth/callback/linkedin`

3. Copiar **Client ID** y **Client Secret**

### Paso 3: Solicitar Acceso a Sign In with LinkedIn

1. En **Products** tab, click **Request access** para "Sign in with LinkedIn"
2. Esperar aprobación de LinkedIn (24-48 horas típicamente)

**IMPORTANTE**: Sin este acceso, no puedes usar OAuth con LinkedIn

### Paso 4: Configurar Permisos de Datos

En **Products** → Seleccionar cada uno:
- ✅ **Sign In with LinkedIn**
  - Permisos: `r_liteprofile`, `r_emailaddress`
- ✅ **Share on LinkedIn** (opcional para futuro)

### Paso 5: Guardar en Vercel

```
LINKEDIN_CLIENT_ID=xxxxxxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxxxxxxxxxx
```

---

## 🔑 Variables de Entorno

En tu proyecto Vercel (Settings → Environment Variables), agregar:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# NextAuth Secret (generar con: openssl rand -hex 32)
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000  # Para dev
# NEXTAUTH_URL=https://tu-dominio.com  # Para prod
```

### Generar NEXTAUTH_SECRET

```bash
openssl rand -hex 32
# Output: abc123def456...
```

---

## 🧪 Testing Local

### 1. Instalar Dependencias (ya deberían estar)
```bash
npm install next-auth @auth/core
```

### 2. Crear `.env.local` en raíz del proyecto

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-id
LINKEDIN_CLIENT_SECRET=your-linkedin-secret
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000

# Supabase (ya deberías tener)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### 3. Correr aplicación
```bash
npm run dev
```

### 4. Test Sign In
```
Ir a: http://localhost:3000/auth/signin
Click "Continuar con Google" o "Continuar con LinkedIn"
```

### 5. Verificar Enriquecimiento de Perfil

Después de sign in:
```
GET http://localhost:3000/api/despega/profile
```

Debería retornar el perfil enriquecido con:
- Google: email, nombre, foto
- LinkedIn: experiencia, educación, skills, industria

---

## 📊 Flujo Completo

```
1. Usuario: Click en "Continuar con Google/LinkedIn"
   ↓
2. NextAuth: Redirige a Google/LinkedIn
   ↓
3. Usuario: Autoriza permiso
   ↓
4. Google/LinkedIn: Retorna token y profile data
   ↓
5. NextAuth: Crea sesión JWT
   ↓
6. App: Llama a /api/auth/enrich-profile
   ↓
7. Enrich: Guarda en Supabase (user_profiles_enriched)
   ↓
8. Enrich: Actualiza A1-A4 context
   ↓
9. User: Redirigido a /despega/onboarding
   ↓
10. App: Usa perfil enriquecido para personalizar A1-A4
```

---

## ⚙️ Tablas Necesarias en Supabase

El sistema espera estas tablas (pueden ya existir):

### `user_profiles_enriched`
```sql
CREATE TABLE user_profiles_enriched (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  
  -- Google
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  
  -- LinkedIn
  current_title TEXT,
  current_company TEXT,
  industry TEXT,
  location TEXT,
  country TEXT,
  skills TEXT[],
  experience_history JSONB,
  education JSONB,
  
  profile_source TEXT, -- 'google', 'linkedin', 'both'
  google_synced_at TIMESTAMP,
  linkedin_synced_at TIMESTAMP,
  
  linkedin_raw_data JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_profile_source CHECK (profile_source IN ('google', 'linkedin', 'both'))
);
```

### Actualizar `coach_context_snapshots`
```sql
ALTER TABLE coach_context_snapshots 
ADD COLUMN IF NOT EXISTS linkedin_context JSONB;
```

---

## 🐛 Debugging

### Error: "NEXTAUTH_SECRET not set"
→ Generar y agregar en .env.local o Vercel

### Error: "Redirect URI mismatch"
→ Verificar que el redirect URI esté exacto en Google/LinkedIn console
→ Por defecto debe ser: `/api/auth/callback/[provider]`

### Error: "LinkedIn Sign in not working"
→ Sign in with LinkedIn NO está aprobado aún por LinkedIn
→ Ir a https://www.linkedin.com/developers/apps y solicitar acceso

### Error: "Profile data not saving"
→ Verificar que Supabase esté conectado
→ Verificar que las tablas existan
→ Revisar logs: `/app/api/auth/enrich-profile`

---

## ✅ Verificación

Después de completar setup, verificar:

- [ ] Google OAuth: Click en "Continuar con Google" → Redirige a Google
- [ ] LinkedIn OAuth: Click en "Continuar con LinkedIn" → Redirige a LinkedIn
- [ ] Post-auth: Usuario redirigido a `/despega/onboarding`
- [ ] Perfil: `GET /api/despega/profile` retorna datos
- [ ] Database: Datos guardados en `user_profiles_enriched`
- [ ] A1-A4: Personalizados basados en perfil LinkedIn (si disponible)

---

## 🚀 Production Deployment

### 1. Vercel Environment Variables
En Vercel project settings, agregar:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- LINKEDIN_CLIENT_ID
- LINKEDIN_CLIENT_SECRET
- NEXTAUTH_SECRET (diferente para prod)
- NEXTAUTH_URL=https://tu-dominio.com

### 2. Google OAuth
- Agregar `https://tu-dominio.com` a Authorized JavaScript origins
- Agregar `https://tu-dominio.com/api/auth/callback/google` a Redirect URIs

### 3. LinkedIn OAuth
- Agregar `https://tu-dominio.com/api/auth/callback/linkedin` a Authorized redirect URLs

### 4. Deploy
```bash
git add .
git commit -m "Add Google & LinkedIn OAuth"
git push  # Triggers Vercel deployment
```

---

## 📚 Referencias

- [NextAuth.js Docs](https://next-auth.js.org)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [LinkedIn OAuth Setup](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [NextAuth Google Provider](https://next-auth.js.org/providers/google)
- [NextAuth LinkedIn Provider](https://next-auth.js.org/providers/linkedin)
