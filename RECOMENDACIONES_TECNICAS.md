# 🔧 RECOMENDACIONES TÉCNICAS DETALLADAS

## I. FIXES INMEDIATOS APLICADOS

### 1. API Save Test Results (COMPLETADO ✅)
**Archivo:** `app/api/save-test-results/route.ts`
**Problema:** RLS policy bloqueaba INSERT a `unified_test_results`
**Solución:** Usar service role key en servidor

```typescript
// ✅ CORRECTO - Usando service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← Service role
);
```

---

### 2. Recomendaciones de Libros (COMPLETADO ✅)
**Archivo:** `app/api/despega-book-recommendations/route.ts`
**Problema:** Error handling insuficiente
**Solución:** Try-catch + fallback a recomendaciones default

```typescript
try {
  // Buscar libros por perfil DISC
  const books = await supabase
    .from('biblioteca')
    .select('*')
    .filter('tags', 'cs', `{${disc_dimension}}`);
    
  // Fallback si hay error
  if (!books.data?.length) {
    return Response.json(defaultBooks());
  }
  return Response.json(books.data);
} catch (error) {
  return Response.json(defaultBooks());
}
```

---

### 3. Dashboard Data Loading (COMPLETADO ✅)
**Archivo:** `components/dashboard-content.tsx`
**Problema:** Depende de `useSession()` que puede ser null
**Solución:** Usar `supabase.auth.getUser()` en servidor

```typescript
// ✅ CORRECTO - Server-side
const { data: { user } } = await supabase.auth.getUser();
const results = await supabase
  .from('unified_test_results')
  .select('*')
  .eq('user_id', user.id);
```

---

## II. DEUDA TÉCNICA POR PRIORIDAD

### ALTA PRIORIDAD (Esta semana)

#### 1. Unificar Modelo de Libros
**Problema:** 3 tablas diferentes para libros
- `biblioteca` (1000+ registros) - Tabla principal
- `books` (legacy, replicada)
- `library_books` (500+ registros)

**Acción:**
```sql
-- 1. Copiar datos únicos de books a biblioteca
INSERT INTO biblioteca (title, author, description, category, tags, created_at)
SELECT DISTINCT b.title, b.author, b.description, b.category, b.tags, b.created_at
FROM books b
WHERE NOT EXISTS (
  SELECT 1 FROM biblioteca bi WHERE bi.title = b.title AND bi.author = b.author
)
ON CONFLICT DO NOTHING;

-- 2. Redirigir library_books users a biblioteca
-- 3. Deprecar tablas antiguas (mantener 30 días para rollback)
```

**Impacto:** -20% queries base de datos, unificación de lógica

---

#### 2. Estandarizar Autenticación
**Problema:** Mezcla entre `useSession()` (Next-Auth) y `supabase.auth.getUser()`

**Acción:** 
1. En todos los Client Components: usar SWR + fetch `/api/user-profile`
2. En todos los Server Components: usar `supabase.auth.getUser()`
3. Eliminar dependencia de Next-Auth en favor de Supabase Auth

**Archivos a cambiar:** 50+ componentes

---

#### 3. Validar RLS Policies Completas
**Problema:** Muchas tablas sin RLS (CRÍTICO de seguridad)

**Tablas sin RLS (50+):**
- `ab_test_events` - Sin RLS
- `ai_coaching_sessions` - Sin RLS
- `cerebro_insights` - Sin RLS
- `coaching_metrics` - Tiene RLS pero permite public insert/update (TEST MODE)

**Acción:** Auditar y agregar RLS a todas las tablas sensibles

```sql
-- Ejemplo de RLS correcta
ALTER TABLE coaching_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own metrics" ON coaching_metrics
  FOR SELECT USING (auth.uid() = user_email OR auth.role() = 'service_role');

CREATE POLICY "Users can insert own metrics" ON coaching_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_email);
```

---

### MEDIA PRIORIDAD (Próximas 2 semanas)

#### 4. Normalizar Scoring de Tests
**Problema:** Cada test usa escala diferente

| Test | Escala | Normalización |
|------|--------|--------------|
| DISC Antiguo | -14 a +14 | Manual |
| DISC Despega | -28 a +28 | A 0-100% |
| Big Five | 0-100 | Ya normalizado |
| RIASEC | Variable | No clara |

**Solución:** Crear `lib/test-scoring-engine.ts`

```typescript
export function normalizeScore(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

// Uso
const normalized = normalizeScore(disc_raw, -28, 28);
```

---

#### 5. Agregar Embeddings a Biblioteca
**Problema:** Sin búsqueda semántica en libros

**Acción:**
1. Migración: Agregar columna `embedding` a `biblioteca`
2. Llenar embeddings existentes con OpenAI API
3. Crear índice HNSW en Supabase

```sql
ALTER TABLE biblioteca ADD COLUMN embedding vector(1536);
CREATE INDEX ON biblioteca USING hnsw (embedding vector_cosine_ops);
```

**Script:**
```typescript
// scripts/generate-embeddings.ts
for (const book of books) {
  const embedding = await openai.createEmbedding({
    model: "text-embedding-3-small",
    input: book.description
  });
  
  await supabase
    .from('biblioteca')
    .update({ embedding: embedding.data[0].embedding })
    .eq('id', book.id);
}
```

---

#### 6. Mejorar Caché de Consultas
**Problema:** `brain_response_cache` tiene problemas de expiración

**Actualización:**
```sql
-- Agregar política de limpieza automática
ALTER TABLE brain_response_cache 
ADD COLUMN expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours';

CREATE INDEX ON brain_response_cache (expires_at) WHERE expires_at < NOW();

-- Cron job para limpiar expirados
-- (Ejecutar cada hora)
DELETE FROM brain_response_cache WHERE expires_at < NOW();
```

---

### BAJA PRIORIDAD (Próximo mes)

#### 7. Crear Dashboard de Métricas
**Componente:** `app/admin/metrics-dashboard/page.tsx`

```typescript
// Mostrar KPIs
- Total tests completados
- Promedio de scores por tipo de test
- Libros recomendados vs completados
- Rutas de desarrollo iniciadas vs completadas
- Tasa de conversión: test → libro → ruta
```

---

#### 8. Implementar Gamificación
**Tablas necesarias:**
- `user_achievements` (ya existe) ✅
- `user_badges` (crear)
- `leaderboards` (crear)

**Lógica:**
```typescript
// En cada test completado
const achievements = checkAchievements(user, test_result);
const badge = awardBadge(user, achievements);
const rank = updateLeaderboard(user, score);
```

---

## III. ESTRUCTURA DE CARPETAS RECOMENDADA

```
/vercel/share/v0-project
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── tests/
│   │   ├── books/
│   │   ├── coaching/
│   │   └── admin/
│   ├── tests/
│   │   ├── disc/
│   │   ├── big-five/
│   │   └── shared/
│   ├── dashboard/
│   ├── biblioteca/
│   └── despega/
│       ├── a1-cerebral/
│       ├── a2-rutas/
│       ├── a3-entrevistas/
│       └── a4-aterrizaje/
├── components/
│   ├── tests/
│   │   ├── disc-test/
│   │   └── shared/
│   ├── coaching/
│   ├── biblioteca/
│   ├── ui/
│   └── layout/
├── lib/
│   ├── test-scoring/
│   ├── ai/
│   ├── db/
│   └── utils/
├── types/
│   ├── tests.ts
│   ├── user.ts
│   └── supabase.ts
└── scripts/
    ├── migrations/
    ├── seed/
    └── maintenance/
```

---

## IV. CHECKLIST DE VERIFICACIÓN

### Antes de Deploy a Producción
- [ ] Todos los endpoints retornan 200/201 correctamente
- [ ] RLS policies aplicadas a todas las tablas sensibles
- [ ] Zero console.errors en producción
- [ ] Caching implementado para queries frecuentes
- [ ] Rate limiting en APIs públicas
- [ ] Validación de input en todos los endpoints

### Antes de Mostrar a Usuarios
- [ ] Tests A/B del Despega Cerebral completados
- [ ] Recomendaciones de libros validadas manualmente
- [ ] Dashboard UX optimizada
- [ ] Mobile responsiveness verificado
- [ ] Performance: Lighthouse score > 90

### Métricas a Monitorear
- [ ] API response time < 200ms
- [ ] Error rate < 1%
- [ ] Test completion rate > 80%
- [ ] Book recommendation CTR > 30%

---

## V. PRÓXIMAS REUNIONES

**Semana 1:** Implementar fixes inmediatos + validar RLS
**Semana 2:** Unificar modelo de libros + estandarizar auth
**Semana 3:** Agregar embeddings + optimizar caché
**Semana 4:** Crear dashboards + gamificación MVP

---

**Última actualización:** 2026-02-09
**Próxima auditoría:** 2026-02-23 (2 semanas)
