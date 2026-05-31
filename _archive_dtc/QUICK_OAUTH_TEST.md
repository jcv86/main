## TESTING - Google + LinkedIn OAuth

### 🎯 PRUEBA RÁPIDA (2 minutos)

**URL Principal:**
```
https://www.despegaturcarrera.com/auth/signin
```

O en localhost:
```
http://localhost:3000/auth/signin
```

**Deberías ver:**
- Título "Inicia Sesión"
- 2 botones: "Continuar con Google" y "Continuar con LinkedIn"

---

### 🔵 TEST 1: Google OAuth

1. Click en **"Continuar con Google"**
2. Inicia sesión con tu cuenta Google
3. Autoriza permisos (email, nombre, foto)
4. **Resultado esperado:** Redirigido a `/despega/conozcamonos-1`

**Si funciona:** ✅ Google OAuth está operacional

---

### 💼 TEST 2: LinkedIn OAuth

1. Click en **"Continuar con LinkedIn"**
2. Inicia sesión con tu cuenta LinkedIn
3. Autoriza permisos (perfil profesional)
4. **Resultado esperado:** 
   - Redirigido a `/despega/conozcamonos-1`
   - Tu perfil está pre-completado con datos de LinkedIn

**Si funciona:** ✅ LinkedIn OAuth está operacional

---

### 🔍 TEST 3: Debug Session

Después de loguearte, ve a:
```
/auth/debug
```

**Deberías ver:**
- Tu nombre y email
- Foto de perfil
- Provider usado (google o linkedin)
- Session activa
- Fecha de login

---

### 🎯 TEST 4: A1-A4 Personalizado

Una vez logueado:

1. Ve a `/despega/conozcamonos-1`
2. Completa el formulario
3. Presiona siguiente
4. Ve a `/despega/a1-cerebral`
5. Completa el test DISC (5 minutos)
6. Ve a `/despega/a1/resultado`

**Resultado esperado:** 
- Insights personalizados basados en tu perfil
- Coaching IA generado
- Datos de LinkedIn enriquecen la experiencia

---

### ✅ CHECKLIST DE ÉXITO

- [ ] Sign in page carga sin errores
- [ ] Google login funciona
- [ ] LinkedIn login funciona
- [ ] Session se mantiene (recarga la página y sigue logueado)
- [ ] `/auth/debug` muestra datos correctos
- [ ] Datos de Google se sincronizan
- [ ] Datos de LinkedIn se sincronizan
- [ ] A1-A4 personalizado con contexto profesional

---

### ⚠️ ERRORES COMUNES Y SOLUCIONES

**Error: "Redirect URI mismatch"**
- Causa: Los redirect URIs en Google/LinkedIn no coinciden
- Solución: Verifica que agregaste exactamente:
  ```
  https://www.despegaturcarrera.com/api/auth/linkedin/callback
  ```

**Error: "Invalid Client ID"**
- Causa: Env variables no están configuradas en Vercel
- Solución: Verifica en Vercel Settings → Variables que existen:
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - LINKEDIN_CLIENT_ID
  - LINKEDIN_CLIENT_SECRET
  - NEXTAUTH_SECRET
  - NEXTAUTH_URL

**Stuck en loading infinito**
- Causa: Problemas de callback
- Solución: Abre DevTools (F12) → Console → reporta errores

**Coach context error (schema cache)**
- Esto es normal en deploy inicial
- Solución: Espera 5 minutos a que Supabase actualice cache
- O ejecuta: `SELECT pg_catalog.pg_reload_conf();` en Supabase SQL

---

### 📍 RUTAS DESPUÉS DEL LOGIN

Una vez autenticado, puedes navegar a:

```
/despega/ciclo-completo       → Dashboard A1-A4
/despega/a1-cerebral          → Test DISC
/despega/a2/camino            → Ruta 30/60/90
/despega/a3/simulations       → Entrenamientos
/despega/a4/noticias          → Market Intel
/comenzar                      → Inicio
```

---

### 🎬 GRABAR VIDEO DE TESTING

Si todo funciona, puedes:
1. Limpiar navegador (logout)
2. Grabar pantalla
3. Ejecutar flow completo: Login → A1 → A2 → A3 → A4
4. Tiempo total: ~10 minutos

¡Esto es perfecto para demo/marketing!
