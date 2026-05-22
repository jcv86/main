# Google OAuth Setup - Paso a Paso Detallado

## PASO 1: Habilitar Google+ API en Google Cloud Console

### 1.1 Buscar la API correcta
- En Google Cloud Console, en la sección "Biblioteca de APIs", **busca "Google+ API"** en el buscador
- NO estés en "Google Workspace" - sal de esa categoría
- Deberías ver **"Google+ API"** por Google → Click en ella

### 1.2 Habilitar la API
- Haz click en **"Google+ API"**
- Verás un botón azul **"HABILITAR"** → Click
- Espera 2-3 segundos a que se habilite

---

## PASO 2: Crear Credenciales OAuth

### 2.1 Ir a "Credenciales"
- En el panel izquierdo, ve a **"APIs y servicios" → "Credenciales"**

### 2.2 Crear credencial OAuth
- Haz click en **"+ CREAR CREDENCIALES"**
- Selecciona **"OAuth 2.0 - ID de cliente"**
- Te pide crear pantalla de consentimiento primero → Click "Configurar pantalla de consentimiento"

### 2.3 Pantalla de Consentimiento
- Selecciona **"Externo"** (para cualquier usuario)
- Haz click **"CREAR"**
- Rellena:
  - **Nombre de app**: "Despega Tu Carrera"
  - **Email de usuario asistencia**: Tu email
  - **Email de contacto desarrollador**: Tu email
- Haz click **"GUARDAR Y CONTINUAR"**
- Skip "Permisos" (áreas opcionales)
- Haz click **"CREAR"**

### 2.4 Volver a crear credenciales
- Ahora ve a **"Credenciales"** nuevamente
- Click en **"+ CREAR CREDENCIALES"**
- Selecciona **"OAuth 2.0 - ID de cliente"**
- Tipo de aplicación: **"Aplicación web"**
- Nombre: "Despega OAuth"

### 2.5 Agregar URIs autorizados
En "URIs autorizados de redireccionamiento" agrega AMBOS:
```
http://localhost:3000/api/auth/callback/google
https://tu-dominio.vercel.app/api/auth/callback/google
```
(Cambia "tu-dominio" por tu URL real de Vercel)

- Haz click **"CREAR"**
- Verás un popup con **Client ID y Client Secret** → **Copia ambos**

---

## PASO 3: Configurar Variables de Entorno

### 3.1 En Vercel Dashboard
- Ve a tu proyecto en Vercel
- Settings → Environment Variables
- Agrega:
  ```
  GOOGLE_CLIENT_ID=xxxxx
  GOOGLE_CLIENT_SECRET=xxxxx
  ```

### 3.2 En .env.local (local development)
- En la raíz del proyecto, crea/edita `.env.local`:
  ```
  GOOGLE_CLIENT_ID=xxxxx
  GOOGLE_CLIENT_SECRET=xxxxx
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=generaUnaStringLargaAqui
  ```

Genera NEXTAUTH_SECRET con:
```bash
openssl rand -base64 32
```

---

## PASO 4: Variables Adicionales Necesarias

Agrega también:
```
NEXTAUTH_URL=http://localhost:3000  # o tu URL de producción
NEXTAUTH_SECRET=tu-secret-generado-arriba

# LinkedIn (después configurarás)
LINKEDIN_CLIENT_ID=xxxxx
LINKEDIN_CLIENT_SECRET=xxxxx

# OpenAI (ya deberías tener)
OPENAI_API_KEY=xxxxx
```

---

## PASO 5: Test Local

### 5.1 Reinicia dev server
```bash
npm run dev
# o
pnpm dev
```

### 5.2 Visita sign in page
```
http://localhost:3000/auth/signin
```

Deberías ver:
- Botón "Continuar con Google"
- Botón "Continuar con LinkedIn"

### 5.3 Haz click en "Continuar con Google"
- Te redirige a Google login
- Accede con tu cuenta de Google
- Deberías regresar a tu app autenticado

### 5.4 Verifica el debug dashboard
```
http://localhost:3000/auth/debug
```

Deberías ver:
- ✅ Session active
- Tu email y nombre
- Foto de perfil

---

## PASO 6: Solucionar Problemas Comunes

### "Redirect URI mismatch"
- Verificaste que el URI en Google Cloud Console coincida exactamente con lo que intentas
- Incluye `http://` o `https://`
- Incluye `/api/auth/callback/google` exactamente

### "Client ID undefined"
- Reinicia el dev server después de agregar env vars
- En Vercel, espera 1-2 min a que las vars se propguen

### No aparecen botones de OAuth
- Verifica que `lib/auth.ts` exista
- Verifica que `app/api/auth/[...nextauth]/route.ts` exista
- Verifica que en `app/auth/signin/page.tsx` está `"use client"` en la parte de arriba

---

## PASO 7: LinkedIn OAuth (Similar)

Una vez Google funcione, configura LinkedIn igual:

1. Ve a https://www.linkedin.com/developers/apps
2. Click "Create app"
3. Rellena nombre, página, email
4. Espera aprobación de LinkedIn (5-10 min)
5. Ve a "Auth" tab → Autorized redirect URLs
6. Agrega:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   https://tu-dominio.vercel.app/api/auth/callback/linkedin
   ```
7. Copia Client ID y Secret
8. Agrega a env vars

---

## PRÓXIMOS PASOS

Una vez ambos OAuth funcionen:
1. ✅ Usuario hace login con Google/LinkedIn
2. ✅ Perfil se enriquece automáticamente
3. ✅ Datos se guardan en Supabase
4. ✅ A1-A4 se personaliza con contexto profesional

¿Necesitas ayuda en algún paso específico?
