## LINKEDIN OAUTH - AGREGAR ESTAS VARIABLES EN VERCEL

**En tu proyecto Vercel (Settings → Environment Variables), agrega:**

```
LINKEDIN_CLIENT_ID = 782s4q94ixha4f

LINKEDIN_CLIENT_SECRET = WPL_AP1.W1hAvo8SkXrpIA1T.wIyq7g==
```

**Pasos en Vercel:**

1. Click en tu proyecto
2. Settings (arriba a la derecha)
3. Environment Variables (en el sidebar)
4. Click "+ Add New"
5. Nombre: `LINKEDIN_CLIENT_ID`
6. Valor: `782s4q94ixha4f`
7. Click "Save"
8. Repite para `LINKEDIN_CLIENT_SECRET` con el valor de arriba

**Luego:**
- Click "Deploy" para hacer redeploy con las nuevas variables
- Espera a que termine (5-10 minutos)
- Prueba en http://localhost:3000/auth/signin (o tu dominio)

**Resultado final:**
- Botón "Sign in with Google" ✓
- Botón "Sign in with LinkedIn" ✓
- Ambos funcionando con enriquecimiento de perfil ✓
