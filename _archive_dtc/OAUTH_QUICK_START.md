# OAuth Quick Start - 3 Pasos Simples

## RESUMEN EJECUTIVO
He implementado Google + LinkedIn OAuth completamente. Solo necesitas:

1. **Crear credenciales en Google Cloud** (15 min)
2. **Crear credenciales en LinkedIn** (15 min)  
3. **Agregar environment variables a Vercel** (5 min)

**Total: 35 minutos y tu app tendrá SSO completo con enriquecimiento de perfil profesional.**

---

## LO QUE YA ESTÁ HECHO

✅ **NextAuth configurado** con Google + LinkedIn
✅ **Sign in page** (`/auth/signin`) lista
✅ **Enriquecimiento automático** de perfil desde Google (email, nombre, foto)
✅ **Enriquecimiento automático** de perfil desde LinkedIn (experiencia, educación, skills, industria)
✅ **Database pronto** para guardar datos enriquecidos
✅ **A1-A4 personalización** basada en contexto profesional

---

## ARQUITECTURA

```
Usuario
  ↓
[/auth/signin] ← Botones: "Continuar con Google" | "Continuar con LinkedIn"
  ↓
OAuth Provider (Google/LinkedIn)
  ↓
NextAuth Callback → [lib/enrich-profile.ts] ← Extrae y enriquece datos
  ↓
[/api/auth/enrich-profile] ← API POST que guarda en Supabase
  ↓
Supabase [user_profiles_enriched]
  ↓
A1-A4 Personalizados con contexto profesional
```

---

## ARCHIVOS IMPLEMENTADOS

| Archivo | Propósito |
|---------|-----------|
| `lib/auth.ts` | Configuración NextAuth con Google + LinkedIn |
| `lib/enrich-profile.ts` | Funciones para extraer datos de Google/LinkedIn |
| `app/api/auth/[...nextauth]/route.ts` | Route handler de NextAuth |
| `app/api/auth/enrich-profile/route.ts` | API POST para guardar datos |
| `app/auth/signin/page.tsx` | Sign in page con botones OAuth |
| `app/auth/debug/page.tsx` | Dashboard para debug de auth |
| `scripts/oauth-setup.sql` | Migration para tablas Supabase |

---

## PASO 1: GOOGLE OAUTH (15 min)

Ve a: **https://console.cloud.google.com**

1. **Buscar API**: Biblioteca de APIs → Busca **"Google+ API"** → Habilitar
2. **Crear Credenciales**: APIs y servicios → Credenciales → "+ CREAR CREDENCIALES"
3. **Selecciona**: OAuth 2.0 - ID de cliente → Tipo: Aplicación web
4. **Nombre**: "Despega OAuth"
5. **Redirect URIs** - Agrega ambos:
   ```
   http://localhost:3000/api/auth/callback/google
   https://tu-dominio.vercel.app/api/auth/callback/google
   ```
6. **CREAR** → Copia Client ID y Client Secret

**Ver guía detallada:** `GOOGLE_OAUTH_STEP_BY_STEP.md`

---

## PASO 2: LINKEDIN OAUTH (15 min)

Ve a: **https://www.linkedin.com/developers/apps**

1. **Create app** → Rellena nombre, página, email
2. **Espera aprobación** (5-10 min)
3. **Auth tab** → Autorized redirect URLs → Agrega:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   https://tu-dominio.vercel.app/api/auth/callback/linkedin
   ```
4. **Copia Client ID y Secret**

---

## PASO 3: ENVIRONMENT VARIABLES (5 min)

### 3a. Vercel Dashboard

Settings → Environment Variables → Agrega:

```env
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
LINKEDIN_CLIENT_ID=xxxxx
LINKEDIN_CLIENT_SECRET=xxxxx
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=generated-secret
```

### 3b. Local Development

Crea `.env.local` en raíz del proyecto:

```env
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
LINKEDIN_CLIENT_ID=xxxxx
LINKEDIN_CLIENT_SECRET=xxxxx
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=openssl-rand-base64-32
```

Genera NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## TEST

### Local
```bash
npm run dev
# Visita: http://localhost:3000/auth/signin
```

### Debug Dashboard
```bash
# Visita: http://localhost:3000/auth/debug
```

Deberías ver:
- ✅ Session active
- Email y nombre del usuario
- Foto de perfil
- (Próximamente) Experiencia, skills, industria de LinkedIn

---

## DATOS QUE SE EXTRAEN

### Google
- Email
- Nombre completo
- Foto de perfil
- Zona horaria

### LinkedIn
- **Cargo actual** → Personaliza A2/A4
- **Empresa** → Context para market intel
- **Industria** → Personaliza recomendaciones
- **Experiencia laboral** → Enriquece A1 insights
- **Educación** → Context académico
- **Top 5 Skills** → Personaliza A3 entrenamientos
- **Años de experiencia** (calculado)

---

## PRÓXIMAS INTEGRACIONES (Bonus)

Una vez OAuth funciona, podemos agregar:

1. **GitHub OAuth** - Para devs/tech roles
2. **Twitter OAuth** - Para personas públicas
3. **Sincronización de perfil** - Actualizar datos regularmente
4. **Invitaciones por email** - Desde LinkedIn/Gmail contacts

---

## TROUBLESHOOTING

| Problema | Solución |
|----------|----------|
| Redirect URI mismatch | Verifica coincidencia exacta en Google Cloud |
| Client ID undefined | Reinicia dev server, agrega env vars |
| LinkedIn no aparece | Copia exacta de Client ID/Secret |
| No me autentica | Verifica NextAuth Secret en .env.local |

---

## REFERENCIAS

- Google OAuth: `GOOGLE_OAUTH_STEP_BY_STEP.md`
- LinkedIn Setup: `OAUTH_SETUP_GUIDE.md`
- Code Files: `lib/auth.ts`, `lib/enrich-profile.ts`

**¿Listo para empezar? Comienza con Google OAuth en 15 minutos 🚀**
