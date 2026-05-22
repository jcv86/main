# Plan: Integración Google y LinkedIn a Despega Tu Carrera

## Objetivo
Conectar Google y LinkedIn para que los usuarios autentiquuen y enriquezcan su perfil automáticamente, optimizando el flujo de onboarding y capturando contexto profesional valioso.

---

## 1. PROPÓSITO DE CADA INTEGRACIÓN

### Google OAuth 2.0
- **Propósito**: SSO (Single Sign On) - entrada más fácil a la plataforma
- **Datos a traer**:
  - Email, nombre completo
  - Foto de perfil (avatar_url en tabla `users`)
  - Zona horaria (para `user_preferences.timezone`)
  
### LinkedIn OAuth 2.0
- **Propósito**: Enriquecer perfil profesional + contexto para A1-A4
- **Datos a traer**:
  - Experiencia laboral → `user_experience` table
  - Educación → `user_education` table
  - Habilidades → `user_skills` table
  - URL de perfil → `users.linkedin_url`
  - Foto de perfil profesional
  - Cargo actual → `user_profiles.position`
  - Industria → campos relevantes A1-A4

---

## 2. ARQUITECTURA TÉCNICA

### Stack Recomendado (Ya tienes todo en tu proyecto)
- **Auth**: NextAuth.js v5 (integra OAuth fácilmente)
- **Database**: Supabase (ya está configurado)
- **Backend**: API Routes de Next.js
- **Frontend**: React Components + TailwindCSS

### Flujo de Autenticación
```
Usuario → Google/LinkedIn OAuth → NextAuth.js → Supabase Session → App Unlocked
```

---

## 3. IMPLEMENTACIÓN PASO A PASO

### PASO 1: Configurar Credenciales OAuth (Tu Responsabilidad)
**Google Console:**
1. Ir a `console.cloud.google.com`
2. Crear proyecto "Despega Tu Carrera"
3. Habilitar APIs: Google+ API, Google Drive API
4. Crear OAuth 2.0 credentials (Tipo: Web Application)
5. URLs autorizadas:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://tudominio.com/api/auth/callback/google`
6. Copiar: `CLIENT_ID` y `CLIENT_SECRET`

**LinkedIn Developer:**
1. Ir a `linkedin.com/developers`
2. Crear app nuevo
3. Solicitar acceso a: Sign In with LinkedIn, Profile API
4. Copiar: `CLIENT_ID` y `CLIENT_SECRET`
5. URLs autorizadas: mismas que arriba

### PASO 2: Agregar Environment Variables
```
# En Vercel settings → Vars

GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
NEXTAUTH_SECRET=xxxxx (generar con: openssl rand -base64 32)

LINKEDIN_CLIENT_ID=xxxxx
LINKEDIN_CLIENT_SECRET=xxxxx
```

### PASO 3: Implementar NextAuth.js
**Archivo**: `/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import LinkedInProvider from "next-auth/providers/linkedin-oauth"
import { supabase } from "@/lib/supabase"

export const { handlers, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Guardar tokens de OAuth para futuras llamadas a la API
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub
      session.accessToken = token.accessToken as string
      session.provider = token.provider as string
      return session
    },
    async signIn({ user, account, profile }) {
      // Enriquecer usuario en Supabase
      if (account?.provider === "google") {
        await enrichUserFromGoogle(user, profile)
      } else if (account?.provider === "linkedin") {
        await enrichUserFromLinkedIn(user, account)
      }
      return true
    },
  },
})

export const { GET, POST } = handlers
```

### PASO 4: Funciones de Enriquecimiento de Datos

**GOOGLE - `lib/integrations/google-enrichment.ts`:**
```typescript
export async function enrichUserFromGoogle(user, googleProfile) {
  const { data: userData } = await supabase
    .from("users")
    .upsert(
      {
        email: user.email,
        full_name: user.name,
        avatar_url: user.image,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    )
    .select()
    .single()

  // Configurar preferencias (timezone de Google Calendar si está disponible)
  await supabase.from("user_preferences").upsert({
    user_id: userData.id,
    language: googleProfile?.locale || "es",
  })

  return userData
}
```

**LINKEDIN - `lib/integrations/linkedin-enrichment.ts`:**
```typescript
export async function enrichUserFromLinkedIn(user, account) {
  // Llamar a LinkedIn API con el access_token
  const linkedInProfile = await fetchLinkedInProfile(account.access_token)

  const { data: userData } = await supabase
    .from("users")
    .update({
      full_name: linkedInProfile.localizedFirstName + " " + linkedInProfile.localizedLastName,
      avatar_url: linkedInProfile.profilePicture?.displayImage,
      linkedin_url: `https://linkedin.com/in/${linkedInProfile.vanityName}`,
    })
    .eq("email", user.email)
    .select()
    .single()

  // Guardar experiencia laboral
  await saveLinkedInExperience(userData.id, linkedInProfile.positions)
  
  // Guardar educación
  await saveLinkedInEducation(userData.id, linkedInProfile.educations)
  
  // Guardar skills
  await saveLinkedInSkills(userData.id, linkedInProfile.skills)

  return userData
}

async function fetchLinkedInProfile(accessToken) {
  const response = await fetch("https://api.linkedin.com/v2/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return response.json()
}
```

### PASO 5: Login Page Mejorada
**`/app/auth/login/page.tsx`:**
```typescript
import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold">Conectar a Despega</h1>
      
      <button
        onClick={() => signIn("google", { redirectTo: "/comenzar" })}
        className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        🔵 Continuar con Google
      </button>
      
      <button
        onClick={() => signIn("linkedin", { redirectTo: "/comenzar" })}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        💼 Continuar con LinkedIn
      </button>
    </div>
  )
}
```

---

## 4. VENTAJAS PARA LOS PILARES A1-A4

### A1 (Quién Eres) - Mejora Significativa
- Contexto profesional automático (cargo, industria, empresa)
- Experiencia laboral pre-cargada → respuestas más ricas en tests
- Educación conocida → personalización de recomendaciones

### A2 (Ruta de 30/60/90)
- Sugerencias de industria basadas en LinkedIn
- Rutas recomendadas según experiencia actual
- Recursos ajustados a nivel profesional

### A3 (Entrenamiento)
- Entrenamientos en competencias faltantes identificadas de LinkedIn
- Recomendaciones de videos basados en su rol actual

### A4 (Realidad - Market Intel)
- Noticias del mercado filtradas por industria profesional
- Insights de salarios y demanda por sector

---

## 5. TABLAS QUE YA EXISTEN LISTAS PARA USAR

```
✅ users (extender con linkedin_url)
✅ user_experience (experiencia laboral de LinkedIn)
✅ user_education (educación de LinkedIn)  
✅ user_skills (skills de LinkedIn)
✅ user_profiles (posición actual, departamento)
✅ user_preferences (timezone, idioma)
```

**NO necesitas crear tablas nuevas** - todo está lista.

---

## 6. CONSIDERACIONES DE SEGURIDAD

- ✅ Never store sensitive tokens en local storage → usar session cookies (NextAuth)
- ✅ Llamadas a APIs de Google/LinkedIn siempre del backend → protegidas por API
- ✅ RLS (Row Level Security) en Supabase ya configurado
- ✅ CORS configurado correctamente para APIs externas

---

## 7. IMPLEMENTACIÓN RÁPIDA (2-3 horas max)

### Para la MVP más rápida:
1. Solo implementar **Google OAuth** primero (más fácil)
2. Luego agregar **LinkedIn** (30min adicionales)

**Timeline estimado:**
- Setup credenciales: 30 min
- NextAuth implementation: 60 min  
- Enriquecimiento de datos: 45 min
- Testing: 30 min

---

## 8. LINKS Y RECURSOS

- NextAuth Docs: https://next-auth.js.org
- Google OAuth Setup: https://developers.google.com/identity/protocols/oauth2
- LinkedIn API: https://docs.microsoft.com/linkedin
- Supabase Auth: https://supabase.com/docs/guides/auth

---

## RESUMEN: ¿QUÉ NECESITAS HACER?

1. **Crear credenciales** en Google Cloud Console y LinkedIn Developer
2. **Agregar env vars** en Vercel
3. **Instalar NextAuth**: `npm install next-auth@5`
4. **Crear 3 archivos**:
   - `/app/api/auth/[...nextauth]/route.ts` (NextAuth setup)
   - `/lib/integrations/google-enrichment.ts` (Google data)
   - `/lib/integrations/linkedin-enrichment.ts` (LinkedIn data)
5. **Agregar botones** en login page
6. **Testear** flujo completo

**Resultado**: Usuarios pueden acceder con 1 click (Google), y su perfil profesional se auto-completa automáticamente (LinkedIn).
