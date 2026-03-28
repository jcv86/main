## GOOGLE + LINKEDIN OAUTH - TESTING GUIDE

### RUTAS DE TESTING

#### 1. Sign In Page (Principal)
```
GET /auth/signin
```
Verás dos botones:
- "Continuar con Google"
- "Continuar con LinkedIn"

#### 2. Debug Dashboard
```
GET /auth/debug
```
Muestra:
- Session activa
- Datos del usuario
- Provider usado
- Profil information

#### 3. Test OpenAI Brain (A1-A4)
```
GET /test-openai-brain
```
Valida que todos los pilares generan insights correctamente.

---

### FLUJO COMPLETO DE TESTING

**Opción 1: Con Google OAuth**
1. Ve a `/auth/signin`
2. Click en "Continuar con Google"
3. Autoriza la app
4. Serás redirigido al dashboard
5. Ve a `/auth/debug` para ver session

**Opción 2: Con LinkedIn OAuth**
1. Ve a `/auth/signin`
2. Click en "Continuar con LinkedIn"
3. Autoriza la app
4. Serás redirigido con perfil enriquecido
5. Ve a `/auth/debug` para ver datos profesionales

---

### VALIDAR QUE TODO FUNCIONA

**Checklist de Testing:**

1. ✓ Sign in page carga correctamente
2. ✓ Google OAuth funciona (login exitoso)
3. ✓ LinkedIn OAuth funciona (login exitoso)
4. ✓ Perfil se auto-completa desde proveedores
5. ✓ Session se crea correctamente
6. ✓ A1-A4 generan insights personalizados
7. ✓ Datos profesionales se almacenan

---

### DEBUG COMMANDS

**En terminal (localhost):**
```bash
# Ver logs de NextAuth
tail -f .next/logs

# Limpiar cache
rm -rf .next
npm run dev
```

**En Vercel (production):**
Ve a tu proyecto → Deployments → Latest → Logs → Function logs

---

### PROBLEMAS COMUNES

**Error: "Cannot find module 'next-auth'"**
- Solución: `npm install next-auth`

**Error: "NEXTAUTH_SECRET not set"**
- Solución: Verifica que agregaste NEXTAUTH_SECRET en Vercel

**LinkedIn login falla**
- Verifica redirect URIs en app LinkedIn
- Verifica LINKEDIN_CLIENT_ID y LINKEDIN_CLIENT_SECRET en Vercel

**Google login falla**
- Verifica que Google+ API está habilitada
- Verifica GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en Vercel

---

### RUTAS DE RESULTADO

Una vez logueado, puedes ir a:

```
/despega/conozcamonos-1     → Comenzar onboarding
/despega/a1-cerebral         → Test A1 DISC
/despega/a2/camino          → Ver ruta 30/60/90
/despega/a3/simulations     → Entrenamientos
/despega/a4/noticias        → Market intel
/despega/ciclo-completo     → Ver progreso A1-A4
```
