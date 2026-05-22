# LinkedIn OAuth Setup Guide

## 1. Crear LinkedIn App

1. Ve a: https://www.linkedin.com/developers/apps
2. Click "Create an app"
3. Rellena:
   - **App name**: "Despega Tu Carrera"
   - **LinkedIn Page**: Selecciona o crea una página
   - **App logo**: Sube tu logo (opcional)
   - Legal agreement: Acepta
4. Click "Create app"

## 2. Configurar OAuth Credentials

1. En tu app, ve a **Auth** tab
2. Busca **Authorized redirect URLs**
3. Click "Add redirect URL"
4. Agrega estas dos URLs:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   https://tudominio.vercel.app/api/auth/callback/linkedin
   ```
5. Click "Update"

## 3. Copiar Credenciales

1. Ve a **Auth** tab
2. Busca **Client ID** y **Client secret**
3. Copia ambos valores
4. Guárdalos en un lugar seguro

Ejemplo:
- Client ID: `78abc123def456`
- Client Secret: `MySecureSecret123`

## 4. Solicitar Acceso a Sign In with LinkedIn

1. Ve a **Products** tab
2. Click "Request access" en **Sign In with LinkedIn**
3. En "Application Name": "Despega Tu Carrera"
4. En "Intended use of the platform": "Sign in for career transformation"
5. Espera aprobación (puede tomar 24-48 horas)

**Nota**: Mientras esperas aprobación, puedes usar modo test con credenciales de desarrollo.

## 5. Agregar a Vercel

En tu proyecto Vercel, ve a **Settings → Environment Variables** y agrega:

```
LINKEDIN_CLIENT_ID=78abc123def456
LINKEDIN_CLIENT_SECRET=MySecureSecret123
```

## 6. Probar

1. Ve a http://localhost:3000/auth/signin
2. Click "Continuar con LinkedIn"
3. Autoriza la app
4. Deberías ser redirigido con tu perfil LinkedIn importado

## Permisos que LinkedIn te dará

- Email
- Nombre
- Foto de perfil
- Posición actual
- Experiencia laboral
- Educación
- Skills

## Si hay errores

- **"Invalid redirect URI"**: Verifica que escribiste exactamente igual el URI en LinkedIn
- **"Client ID not found"**: Copia de nuevo desde LinkedIn, puede tener espacios
- **"Access not approved"**: Espera a que LinkedIn apruebe tu app

## URLs importantes

- LinkedIn Developer Console: https://www.linkedin.com/developers/apps
- Documentación OAuth: https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication

¿Ya tienes las credenciales? Avísame cuando las tengas y actualizamos Vercel. 🚀
