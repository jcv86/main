# 🗺️ GUÍA DE NAVEGACIÓN DEL CÓDIGO

## ¿Cómo navegar el proyecto?

### I. POR FUNCIONALIDAD

#### 🎯 Quiero entender cómo funciona el Test DISC Despega Cerebral

1. **Interfaz del Usuario**
   - Archivo: `/vercel/share/v0-project/app/despega/onboarding/page.tsx`
   - Qué hace: Muestra onboarding y las 28 preguntas

2. **Lógica de Scoring**
   - Archivo: Same file (inline) o buscar `calculateResults()`
   - Qué hace: Convierte respuestas (-1 a +1) en scores DISC

3. **Guardado de Resultados**
   - Endpoint: `/api/save-test-results`
   - Archivo: `/vercel/share/v0-project/app/api/save-test-results/route.ts`
   - Qué hace: Guarda en `unified_test_results` con service role

4. **Generación de Insights**
   - Endpoint: `/api/post-test-insights-simple`
   - Archivo: `/vercel/share/v0-project/app/api/post-test-insights-simple/route.ts`
   - Qué hace: Llama a OpenAI para análisis personalizado

5. **Recomendaciones de Libros**
   - Endpoint: `/api/despega-book-recommendations`
   - Archivo: `/vercel/share/v0-project/app/api/despega-book-recommendations/route.ts`
   - Qué hace: Busca libros que coincidan con perfil DISC

6. **Resultados Finales**
   - Archivo: Same page (inline) o buscar `<ResultsSection />`
   - Qué hace: Muestra portada + scores + insights + libros

---

#### 📚 Quiero agregar más libros a la biblioteca

1. **Ver todos los libros**
   - Tabla BD: `biblioteca`
   - Campos importantes: `title`, `author`, `tags`, `category`, `difficulty`
   - Query: `SELECT * FROM biblioteca ORDER BY created_at DESC`

2. **Agregar uno nuevo**
   - Opción A: UI (si existe)
   - Opción B: Direct SQL via Supabase Console
   ```sql
   INSERT INTO biblioteca (title, author, description, tags, category, difficulty, rating)
   VALUES ('New Book', 'Author', 'Description', '{tag1,tag2}', 'Development', 'Intermediate', 4.5);
   ```

3. **Agregar a recomendaciones DISC**
   - Editar tags del libro incluyendo la dimensión DISC: `{D}`, `{I}`, `{S}`, `{C}`
   - La API `/api/despega-book-recommendations` ya busca por tags

4. **Agregar embeddings para búsqueda semántica**
   - Script: `scripts/generate-embeddings.ts` (crear si no existe)
   - Usa OpenAI API para generar embeddings del description

---

#### 💬 Quiero ver cómo funciona el Coaching IA

1. **Interfaz del Coach**
   - Archivo: `/vercel/share/v0-project/app/ai-coach/page.tsx`
   - Componente: `components/enhanced-ai-coach.tsx`

2. **Lógica de Conversación**
   - Endpoint: `/api/ai-coach/` o `/api/enhanced-coach/`
   - Archivos: `/vercel/share/v0-project/app/api/ai-coach/route.ts`
   - Qué hace: Usa OpenAI con contexto del usuario

3. **Memory del Coach**
   - Tabla: `user_coaching_memory` o `mirix_memories`
   - Qué guarda: Conversaciones, acciones, insights

4. **Prompts del Coach**
   - Archivo: `/vercel/share/v0-project/lib/a1-coach-prompts.ts` (y a2, a3, a4)
   - Qué son: Plantillas de prompts personalizadas por módulo

---

### II. POR LAYER/ARQUITECTURA

#### 🎨 Frontend - Componentes (React)

**Estructura típica:**
```
component-name/
├── index.tsx          # Export default
├── hooks/             # Custom hooks
├── types.ts           # TypeScript types
└── [child-components] # Subcomponentes
```

**Dónde encontrar:**
- General UI: `components/ui/` (shadcn)
- Coaching: `components/*-coach*.tsx`
- Tests: `components/*-test*.tsx`
- Biblioteca: `components/*-book*.tsx`

**Ejemplo de búsqueda:**
```bash
# Encontrar componente que muestre DISC scores
grep -r "disc" components/ --include="*.tsx"
# Resultado: components/score-display.tsx
```

---

#### ⚙️ Backend - API Routes

**Estructura típica:**
```
app/api/[feature]/route.ts

Contenido esperado:
export async function POST(req: Request) {
  const body = await req.json();
  
  // Validation
  if (!body.user_id) return Response.json({error: '...'}, {status: 400});
  
  // Business logic
  const result = await doSomething(body);
  
  // Response
  return Response.json(result, {status: 200});
}
```

**Por feature:**
- Tests: `app/api/save-test-results/`, `app/api/test-results/`
- Coaching: `app/api/ai-coach/`, `app/api/enhanced-coach/`
- Libros: `app/api/books/`, `app/api/despega-book-recommendations/`
- Admin: `app/api/admin/`

---

#### 🗄️ Base de Datos - Supabase

**Tipos de Queries:**
```typescript
// READ
const { data } = await supabase
  .from('tabla')
  .select('*')
  .eq('user_id', userId);

// CREATE
const { data, error } = await supabase
  .from('tabla')
  .insert([{ field: value }]);

// UPDATE
await supabase
  .from('tabla')
  .update({ field: newValue })
  .eq('id', id);

// DELETE
await supabase
  .from('tabla')
  .delete()
  .eq('id', id);
```

**Con Service Role (lado servidor):**
```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← Key especial
);
```

---

### III. POR ARCHIVO/RUTA

#### Main Dashboard
**Archivo:** `app/dashboard/page.tsx`
**Componente:** `components/dashboard-content.tsx`
**Lógica:**
1. Lee perfil del usuario
2. Obtiene último test result
3. Muestra resumen + DISC scores
4. Botones a próximos pasos (A2, A3, A4)

**Debugging:**
```typescript
console.log("[v0] User ID:", userId);
console.log("[v0] Test Results:", results);
```

---

#### Test DISC Completo
**Archivo:** `app/despega/onboarding/page.tsx`
**Flujo:**
1. Estado: `introStep` → `testStep` → `resultsStep`
2. User Selection: + (Prefiero más) / - (Prefiero menos)
3. Cálculo: Suma de scores por dimensión
4. Save: POST `/api/save-test-results`
5. Show: Componente de resultados inline

**Testing:**
```typescript
// Valores de test
DISC_QUESTIONS[0] // Ver primera pregunta
calculateResults(responses) // Ver cálculo
```

---

#### Recomendaciones de Libros
**Archivo:** `app/api/despega-book-recommendations/route.ts`
**Input:**
```typescript
{
  user_id: string,
  disc_scores: { D: 0-100, I: 0-100, S: 0-100, C: 0-100 }
}
```

**Output:**
```typescript
[
  {
    id: uuid,
    title: string,
    author: string,
    description: text,
    tags: string[],
    rating: number,
    match_reason: "Perfecto para perfil D"
  }
]
```

**Lógica:**
1. Encontrar dimensión dominante (score más alto)
2. Buscar libros con ese tag en `biblioteca`
3. Ordenar por rating
4. Retornar top 6

---

### IV. BÚSQUEDAS RÁPIDAS

#### "Quiero cambiar cómo se calculan los scores DISC"

1. **Buscar función de cálculo:**
   ```bash
   grep -r "calculateResults\|normalizeScore" app/ lib/
   ```

2. **Archivo típico:** `app/despega/onboarding/page.tsx` o `lib/a1-scoring-normalization.ts`

3. **Patrón a buscar:**
   ```typescript
   const d_score = (d_count / total) * 100;
   ```

4. **Cambiar:** Modificar la fórmula matemática

---

#### "Quiero agregar un nuevo campo a los resultados del test"

1. **Migración BD:** 
   ```sql
   ALTER TABLE unified_test_results ADD COLUMN nuevo_campo VARCHAR;
   ```

2. **Actualizar types:** `types/supabase.ts`

3. **Cambiar UI:** `app/despega/onboarding/page.tsx` (save logic)

4. **Cambiar results display:** Same file (results component)

---

#### "Los libros no se están recomendando correctamente"

1. **Revisar tabla:**
   ```sql
   SELECT * FROM biblioteca WHERE tags @> '{"D"}' LIMIT 5;
   ```

2. **Revisar API:**
   ```bash
   curl -X POST http://localhost:3000/api/despega-book-recommendations \
     -H "Content-Type: application/json" \
     -d '{"user_id":"...", "disc_scores":{"D":80,"I":60,"S":50,"C":70}}'
   ```

3. **Verificar tags:** Asegurarse que libros tienen tags DISC

4. **Ver logs:** Buscar console.log en `/app/api/despega-book-recommendations/route.ts`

---

### V. WORKFLOW TÍPICO DE DESARROLLO

#### Tarea: Agregar "Fortalezas Sugeridas" al Dashboard

1. **Entender la data:**
   ```bash
   # Ver tabla de insights
   SELECT * FROM ai_insights LIMIT 5;
   ```

2. **Encontrar componente:**
   - Dashboard: `components/dashboard-content.tsx`
   - O crear nuevo: `components/strengths-suggestions.tsx`

3. **Agregar lógica de fetch:**
   ```typescript
   const { data: insights } = await supabase
     .from('ai_insights')
     .select('*')
     .eq('user_id', userId)
     .eq('insight_type', 'strength');
   ```

4. **Mostrar en UI:**
   ```typescript
   <div className="space-y-2">
     {insights.map(i => <StrengthCard key={i.id} insight={i} />)}
   </div>
   ```

5. **Testear:**
   - Preview en dev mode
   - Revisar datos en Supabase Console
   - Verificar no haya errores en Network tab

6. **Commit:** 
   ```bash
   git add .
   git commit -m "feat: add strengths suggestions to dashboard"
   ```

---

## Comandos Útiles

### Local Development
```bash
# Iniciar servidor
npm run dev

# Build
npm run build

# Lint
npm run lint

# Abrir Supabase Studio
# (Visit: https://app.supabase.com → tu proyecto → SQL Editor)
```

### Database Queries
```bash
# Ver estructura de tabla
SELECT * FROM information_schema.columns WHERE table_name = 'tabla';

# Ver RLS policies
SELECT schemaname, tablename, policyname, qual FROM pg_policies WHERE tablename = 'tabla';

# Ver inserts recientes
SELECT * FROM tabla ORDER BY created_at DESC LIMIT 10;
```

### Debugging Frontend
```typescript
// En consola del browser
console.log("[v0] Mi debug:", variable);

// Ver storage
localStorage.getItem('supabase.auth.token');

// Ver requests
// → F12 → Network tab → Buscar tu endpoint
```

---

## Errores Comunes

### Error: "RLS policy violation"
**Solución:** Usar service role en servidor
```typescript
// ❌ INCORRECTO
const supabase = createClientComponentClient();

// ✅ CORRECTO
const supabase = createServerClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### Error: "No hay resultados de libros"
**Solución:** Verificar tags en BD
```sql
SELECT title, tags FROM biblioteca LIMIT 5;
-- Deberían tener tags como: {D,Development} o {I,Communication}
```

### Error: "User not authenticated"
**Solución:** Usar `supabase.auth.getUser()` en servidor
```typescript
// ❌ INCORRECTO
const user = session?.user; // puede ser null

// ✅ CORRECTO
const { data: { user } } = await supabase.auth.getUser();
if (!user) return Response.json({error: 'Unauthorized'}, {status: 401});
```

---

## Próxima Lectura Recomendada

1. **Para entender tests:** `/vercel/share/v0-project/AUDITORIA_COMPLETA_SITIO.md` - Sección "A1 - Cerebral"
2. **Para hacer cambios:** `/vercel/share/v0-project/RECOMENDACIONES_TECNICAS.md` - Sección "Fixes Inmediatos"
3. **Para visual general:** `/vercel/share/v0-project/RESUMEN_EJECUTIVO.md` - Sección "Flujo de Usuario"

---

**Última actualización:** 2026-02-09
**Mantener al día:** Sí, este documento es vivo
