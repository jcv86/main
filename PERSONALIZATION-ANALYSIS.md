## ANÁLISIS: CÓMO SE SELECCIONAN NOTICIAS EN SISTEMA DESPEGA

### ESTADO ACTUAL (ROTO):
- El endpoint `/api/despega/a4-news-feed` **NO EXISTE**
- Las páginas esperan datos de este endpoint pero no hay implementación
- Las noticias nunca se cargan

### CRITERIOS ACTUALES DE SELECCIÓN: NINGUNO
El sistema está roto porque:
1. **Sin endpoint**: Falta implementar `/api/despega/a4-news-feed`
2. **Sin personalización**: La tabla `a4_personalized_feeds` existe pero no se usa
3. **Sin criterios**: No hay lógica para:
   - Leer el perfil DISC del usuario (A1)
   - Saber qué entrenamiento está cursando (A3)
   - Aplicar palabras clave personalizadas
   - Filtrar por relevancia

### ARQUITECTURA DESEADA:

```
Usuario entra a A4 (Noticias)
  ↓
loadNews() → GET /api/despega/a4-news-feed?user_id=XXX
  ↓
Backend: queryPersonalization()
  ├─ Lee a4_personalized_feeds para user_id
  ├─ Extrae: keywords[], training_tema, preferencias
  ├─ Si no existe: Genera automáticamente desde:
  │  ├─ a1_unified_report → profile_type (DISC)
  │  ├─ a2_user_missions → route actual
  │  └─ a3_training_assignments → tema actual
  └─ Busca en NewsAPI con keywords personalizadas
  ↓
Retorna noticias filtradas + relevancia_score
  ↓
Frontend: Muestra noticias ordenadas por relevancia
```

### TABLA CLAVE: `a4_personalized_feeds`

**Estructura actual (SIN USAR):**
```sql
CREATE TABLE a4_personalized_feeds (
  id UUID,
  user_id UUID,
  training_module_id UUID,    -- Enlace a A3
  keywords JSONB,              -- Palabras clave personalizadas
  news_category TEXT,          -- Categoría override
  active BOOLEAN,
  starts_at TIMESTAMP,         -- Inicio del personalization
  ends_at TIMESTAMP,           -- Fin del personalization
  relevance_boost INTEGER,     -- Multiplicador de relevancia
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Lo que FALTA:**
- Trigger para crear entrada automática cuando usuario entra a A4
- Query en endpoint para LEER estas preferencias
- Aplicar keywords al buscar en NewsAPI

### FUENTES DE CRITERIOS DE PERSONALIZACIÓN:

#### 1. **A1 Profile (DISC Test)**
Tabla: `a1_unified_report`
```
perfil_disco_type: "D" | "I" | "S" | "C"
intereses_vocacionales: ["emprendimiento", "liderazgo", ...]
competencias_principales: ["comunicación", "decisión", ...]
```

Mapping A → Keywords:
- D (Dominancia) → "liderazgo", "decisiones", "autoridad", "eficiencia"
- I (Influencia) → "comunicación", "persuasión", "equipo", "relaciones"
- S (Estabilidad) → "procesos", "calidad", "consistencia", "metodología"
- C (Cumplimiento) → "análisis", "datos", "técnica", "precisión"

#### 2. **A2 Current Mission**
Tabla: `a2_user_missions`
```
camino: "Personal" | "Profesional"
objetivo_especifico: string
```

Mapping:
- Misión = "Liderazgo" → Keywords: ["liderazgo", "management", "dirección"]
- Misión = "Startups" → Keywords: ["emprendimiento", "inversión", "startup"]

#### 3. **A3 Active Training**
Tabla: `a3_training_assignments`
Joins to: `a3_training_modules` (si existe)
```
training_module_id: UUID
```

Info: Título del módulo actual
Mapping: Título → Keywords

#### 4. **User Interests (Explícitas)**
Campo: `intereses_vocacionales` en `a1_unified_report`

### QUERIES HARDCODEADAS ACTUALES:

```javascript
const queries = [
  "liderazgo profesional",
  "emprendimiento",
  "startups",
  "mercado laboral",
  "transformación digital",
  "carrera profesional"
];

// PROBLEMA: Se usan para TODOS los usuarios, sin personalización
```

### SOLUCIÓN: SISTEMA DE PERSONALIZACIÓN

#### Paso 1: Crear endpoint `/api/despega/a4-news-feed`
```typescript
POST /rest/a4-news-feed?user_id=XXX

1. Buscar a4_personalized_feeds donde user_id=XXX y active=true
2. Si no existe:
   - Crear automáticamente desde A1 profile
   - Insertar en a4_personalized_feeds
3. Extraer keywords[]
4. Buscar en NewsAPI con keywords
5. Retornar artículos + relevancia_score
```

#### Paso 2: Usar TAGS + INTERESES

**Sistema de Tags:**
```
Cada noticia tiene: ["liderazgo", "equipo", "decisión"]
Perfil usuario tiene: ["liderazgo", "decisión", "productividad"]

Overlap = Relevancia Score
- Perfecto match (3/3) = 100
- Partial match (2/3) = 60
- Weak match (1/3) = 30
- No match = 0 (filter out)
```

#### Paso 3: Feed Personalizado por Etapa

```
Si usuario en A1:
  → Mostrle noticias sobre self-discovery
  → Keywords: ["autoconocimiento", "personalidad", "competencias"]

Si usuario en A2:
  → Mostrar noticias relevantes a su misión
  → Keywords: Extraídas de objetivo_especifico

Si usuario en A3:
  → Mostrar noticias del tema de entrenamiento
  → Keywords: Extraídas del training_module

Si usuario en A4:
  → Mostrar noticias personalizadas combinadas
  → Keywords: Combinación de todo anterior
```

### PROXIMOS PASOS RECOMENDADOS:

1. ✅ Crear endpoint `/rest/a4-news-feed` que:
   - Lee `a4_personalized_feeds`
   - Si no existe, crea desde A1 profile
   - Busca en NewsAPI con keywords
   
2. ✅ Crear tabla relacionada `a3_training_modules` si no existe:
   - Almacenar nome + keywords de cada módulo
   
3. ✅ Crear trigger automático:
   - Cuando usuario ingresa a A4
   - Crear `a4_personalized_feeds` automáticamente

4. ✅ Mejorar cálculo de relevancia:
   - Tag matching
   - Recency boost
   - User engagement tracking

### TAGS SISTEMA (Propuesto):

```
Liderazgo: ["liderazgo", "management", "dirección", "equipo", "toma_decisiones", "influencia"]
Emprendimiento: ["startup", "emprendimiento", "inversión", "financiamiento", "negocio"]
Tech: ["tecnología", "ai", "automatización", "digital", "innovación"]
Finanzas: ["finanzas", "inversión", "economía", "bolsa", "dinero"]
Carrera: ["empleo", "cv", "entrevista", "salario", "ascenso"]
Comunicación: ["comunicación", "presentación", "oratoria", "persuasión", "lenguaje"]
```

---

**CONCLUSIÓN:** El sistema de personalización está completamente roto. Hay infraestructura BD pero no se usa. Necesita:
1. Endpoint implementado
2. Lógica de lectura de preferencias
3. Scoring automático por relevancia
4. Disparadores automáticos
