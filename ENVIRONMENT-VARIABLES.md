# Variables de Entorno - DTC Platform

## 🔐 Seguridad de Variables de Entorno

### ⚠️ REGLA CRÍTICA
**NUNCA uses `NEXT_PUBLIC_` para secretos sensibles**

- Variables con `NEXT_PUBLIC_` se exponen al navegador del cliente
- Solo usa `NEXT_PUBLIC_` para valores públicos no sensibles
- Secretos deben usarse SOLO en el servidor (API routes, Server Actions, Server Components)

---

## 📋 Variables Configuradas

### Cron Jobs (SERVIDOR SOLAMENTE)
\`\`\`bash
# ✅ CORRECTO - Solo en servidor
CRON_SECRET=your-secret-here
\`\`\`

**Uso correcto:**
\`\`\`typescript
// ✅ En API Route (servidor)
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  // ... resto del código
}

// ❌ En componente cliente - NUNCA hagas esto
'use client'
export function Component() {
  // Los secretos NO deben usarse en el cliente
  // Usa Server Actions en su lugar
}
\`\`\`

### Base de Datos Supabase
\`\`\`bash
# Servidor
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Solo servidor

# Cliente (si es necesario)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
\`\`\`

### OpenAI
\`\`\`bash
# Servidor solamente
OPENAI_API_KEY=sk-xxx...

# Cliente (si es necesario para llamadas directas)
NEXT_PUBLIC_OPENAI_API_KEY=sk-xxx...  # Solo si realmente necesitas llamadas desde el cliente
\`\`\`

### Vercel Blob
\`\`\`bash
# Servidor solamente
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx...
\`\`\`

---

## 🔧 Cómo Arreglar Errores de Deployment

Si ves errores sobre variables sensibles expuestas al cliente:

### Paso 1: Eliminar variables públicas sensibles
En Vercel Dashboard:
1. Ve a tu proyecto → Settings → Environment Variables
2. Elimina cualquier variable con `NEXT_PUBLIC_` que contenga secretos
3. Asegúrate de que los secretos solo existen sin el prefijo `NEXT_PUBLIC_`

### Paso 2: Actualizar el código
Si tienes código que usa secretos en el cliente, muévelo al servidor:

\`\`\`typescript
// ❌ ANTES (componente cliente con secreto)
'use client'
export function TriggerCron() {
  const handleTrigger = async () => {
    await fetch('/api/cron/my-job', {
      headers: {
        'Authorization': `Bearer ${process.env.SECRET_KEY}` // ❌ Expuesto
      }
    })
  }
  return <button onClick={handleTrigger}>Trigger</button>
}

// ✅ DESPUÉS (usar Server Action)
// app/actions/trigger-cron.ts
'use server'
export async function triggerCron() {
  const response = await fetch('https://your-domain.com/api/cron/my-job', {
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET}` // ✅ Seguro en servidor
    }
  })
  return response.ok
}

// components/trigger-cron-button.tsx
'use client'
import { triggerCron } from '@/app/actions/trigger-cron'

export function TriggerCron() {
  const handleTrigger = async () => {
    await triggerCron()
  }
  return <button onClick={handleTrigger}>Trigger</button>
}
\`\`\`

---

## ✅ Checklist de Seguridad

- [ ] Ninguna variable con `NEXT_PUBLIC_` contiene secretos sensibles
- [ ] `CRON_SECRET` existe sin el prefijo público
- [ ] API keys solo se usan en servidor (API routes, Server Actions)
- [ ] Tokens de autenticación nunca se exponen al cliente
- [ ] Service role keys de Supabase solo en servidor

---

## 📚 Referencias

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
