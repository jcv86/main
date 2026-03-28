# GOOGLE OAUTH - GUÍA VISUAL PASO A PASO

## PASO 1: Estás en la sección correcta ✓
Ya estás en: https://console.cloud.google.com/apis

## PASO 2: BUSCA "Google+ API"

**LO QUE VES EN TU PANTALLA:**
```
En la barra de búsqueda (donde dice "Buscar APIs y servicios")
```

**QUÉ DEBES HACER:**
```
1. Click en el cuadro de búsqueda
2. Escribe: "Google+ API"
3. Presiona Enter
```

**RESULTADO:**
Deberías ver "Google+ API" (puede mostrar como "deprecated" pero funciona perfectamente con OAuth)

## PASO 3: Habilita Google+ API

1. Click en "Google+ API"
2. Click en botón azul "ENABLE" (Habilitar)
3. Espera 30 segundos a que se cargue

## PASO 4: Crea las credenciales OAuth

Una vez habilitada:
1. Click en "CREATE CREDENTIALS" (Crear credenciales)
2. Selecciona:
   - Application type: "Web application"
   - Name: "Despega OAuth"
3. En "Authorized redirect URIs", agrega:
   ```
   http://localhost:3000/api/auth/callback/google
   https://tudominio.vercel.app/api/auth/callback/google
   ```
4. Click "CREATE"

## PASO 5: Copia tus credenciales

Verás una ventana modal con:
- **Client ID**: Cópialo
- **Client Secret**: Cópialo

## PASO 6: Agrega a .env.local

Crea o edita `.env.local`:
```
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
```

## PASO 7: Agrega a Vercel (producción)

Settings → Environment Variables:
```
GOOGLE_CLIENT_ID = [valor]
GOOGLE_CLIENT_SECRET = [valor]
```

---

## ALTERNATIVA si no encuentras "Google+ API"

Si en la búsqueda no aparece, intenta:

1. Buscar: "OAuth 2.0"
2. O búsca: "Identity"
3. O ve a: https://console.cloud.google.com/apis/library/plus/enable

---

## VERIFICACIÓN RÁPIDA

Una vez habilited Google+ API, deberías ver:
✓ Estado: "API enabled" en verde
✓ Botón "Create Credentials"
✓ Acceso a la documentación

---

**¿Atascado?** Cuéntame exactamente qué ves después de escribir "Google+ API" en la búsqueda
