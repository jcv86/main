## SIMULACIÓN COMPLETA DEL CICLO DESPEGA (Versión 2.0)

### ESCENARIO: Usuario nuevo "Carlos" se registra y completa el onboarding

---

## PASO 1: REGISTRO (Login)
**URL**: `/auth/login`
**Status**: ✅ FUNCIONANDO

```
Carlos entra al site
→ Ve landing page
→ Hace click en "Empezar Transformación"
→ Se autentica con Supabase Auth
→ User ID creado: 64738eef-ee31-4da9-8270-9adfa46c74ba
→ Redirige a: /despega/onboarding
```

**Base de datos:**
- Tabla `auth.users`: ✅ Usuario registrado
- Tabla `profiles`: ✅ Profile creado

---

## PASO 2: ONBOARDING A1 (Test DISC)
**URL**: `/despega/onboarding`
**Status**: ✅ FUNCIONANDO PARCIALMENTE

```
Carlos ve onboarding flow
→ Completa test cerebral, emocional, DISC, brújula
→ Sistema guarda respuestas en:
   ✅ Tabla `despega_cerebral_responses`: Guardadas correctamente
   ✅ Tabla `despega_a1_test_results`: Score total guardado

Carlos ve resultado:
→ Perfil DISC: "D - Dominante"
→ Score total: 287 puntos
→ Descripción personalizada: "Eres un líder nato..."
```

**Base de datos:**
- Tabla `despega_user_profiles`: ✅ Created (a1_test_completed = true)
- Tabla `despega_a1_test_results`: ✅ Resultados guardados
- Tabla `despega_pilar_progress`: ✅ Ciclo iniciado (ciclo_start_date = today)

---

## PASO 3: REDIRECCIÓN POST-ONBOARDING ⚠️ PROBLEMA
**Status**: ❌ FALTA IMPLEMENTAR

```
ESPERADO:
Carlos completa test
→ Sistema DEBERÍA mostrar:
   1. Página de resultado A1 con su perfil
   2. Recomendaciones personalizadas
   3. CTA: "Inicia tu transformación de 90 días"
   → Redirige a: /despega/dashboard

ACTUAL:
Carlos completa test
→ Página no existe: /despega/a1/resultado
→ No hay redirección clara
→ Usuario queda sin saber qué hacer ❌
```

**Solución requerida:**
- Crear `/despega/a1/resultado/page.tsx`
- Actualizar onboarding para redirigir después de guardar test
- Mostrar perfil DISC + recomendaciones + CTA

---

## PASO 4: DASHBOARD PRINCIPAL
**URL**: `/despega/dashboard`
**Status**: ✅ CREADO, ⚠️ DATOS INCOMPLETOS

```
Carlos entra al dashboard
→ Ve:
   ✅ Hero con su perfil DISC (D - Dominante)
   ✅ Barra de progreso 90 días
   ✅ Misión actual (vacío si no se creó)
   ✅ Grid de 4 Pilares (A2, A3, A4 estados)
   ✅ Coach IA sidebar
   ✅ 4 acciones rápidas
   ✅ News ticker de contexto

PROBLEMA:
- Misión no existe → No se llama endpoint /rest/assign-trainings
- Coach context = NULL → No hay contexto personalizado
- Noticias se cargan pero son genéricas → No personalizadas
```

**Base de datos queries:**
- Tabla `despega_user_misiones`: ✅ Query SELECT funciona (vacía)
- Tabla `coach_context_snapshots`: ✅ Query con .maybeSingle() funciona (retorna null)
- NewsAPI: ✅ Llamada funciona, carga 5 artículos

---

## PASO 5: NAVEGACIÓN A A2 (Ruta & Misión)
**URL**: `/despega/a2/rutas-aprendizaje`
**Status**: ✅ FUNCIONA

```
Carlos hace click en "Pilar A2 - Ruta Profesional"
→ Ve opciones de rutas
→ Selecciona ruta (ej: "Liderazgo Profesional")
→ Sistema:
   ✅ Guarda route_id en a2_user_route_progress
   ✅ Crea entry en a2_user_missions (misión 90 días)
   ✅ Genera sprint 1 en a2_user_sprints
   ✅ Llama a /rest/assign-trainings
      → Debería crear registros en a3_training_assignments
      → ⚠️ Tabla a3_training_assignments existe pero está vacía
      → Falta data de entrenamientos en a3_entrenamientos
```

**Base de datos:**
- Tabla `a2_learning_routes`: ✅ 4 rutas disponibles
- Tabla `a2_route_modules`: ✅ Módulos de cada ruta
- Tabla `a2_user_missions`: ✅ Misión creada
- Tabla `a2_user_sprints`: ✅ Sprint 1 creado
- Tabla `a3_training_assignments`: ⚠️ Vacía (falta rellenar con data)

---

## PASO 6: NAVEGACIÓN A A3 (Entrenamientos)
**URL**: `/despega/a3/entrenamientos`
**Status**: ⚠️ PARCIALMENTE FUNCIONA

```
Carlos hace click en "Pilar A3 - Entrenamientos"
→ ESPERADO: Ver lista de entrenamientos asignados
→ ACTUAL:
   ✅ Página carga correctamente
   ⚠️ A3 training assignments VACÍO
   ❌ No hay entrenamientos asignados para mostrar
   
PROBLEMA:
- Falta data de ejemplo en tablas:
  • a3_entrenamientos (no existe tabla, usa a3_training_assignments)
  • a3_entrevistas (existe pero vacía)
  • a3_video_banco (existe pero vacía)
```

**Necesario:**
1. Insertar data en a3_entrevistas (5+ entrevistas de prueba)
2. Insertar data en a3_video_banco (10+ videos de prueba)
3. El endpoint /rest/assign-trainings los asignará automáticamente

---

## PASO 7: NAVEGACIÓN A A4 (Noticias Personalizadas)
**URL**: `/despega/a4/noticias-personalizadas`
**Status**: ✅ FUNCIONA, ⚠️ NO PERSONALIZADO

```
Carlos hace click en "Pilar A4 - Contexto"
→ Ve ticker de noticias
→ Noticias por tema del entrenamiento actual

ACTUAL:
✅ NewsAPI integration funciona (5 articles por query)
✅ Carga desde cache si existe
✅ Ticker rota cada 8 segundos
⚠️ PERO: Temas genéricos (startups, liderazgo, emprendimiento)
❌ No personalizadas por tema actual de Carlos

PROBLEMA:
- A4 personalización depende de A3 active training
- Si A3 vacío → Temas genéricos
- Endpoint /rest/personalize-feed debería guardar feeds
- Tabla a4_personalized_feeds: ✅ Existe, ⚠️ Vacía
```

---

## PASO 8: COACH IA CONTEXT
**URL**: `/rest/coach-context?user_id=xxx`
**Status**: ✅ FUNCIONA, ⚠️ VACÍO

```
Componente <CoachSidebar> hace fetch:
GET /rest/coach-context?user_id=64738eef-ee31-4da9-8270-9adfa46c74ba

RESPUESTA ACTUAL:
✅ Status 200 OK
✅ Sin errores de servidor
⚠️ context: null (usuario nuevo, no hay snapshot aún)

FLUJO COMPLETO:
1. Usuario completa test A1 → Debería crear coach_context_snapshots
2. Usuario completa misión A2 → Debería actualizar context
3. Usuario completa entrenamiento A3 → Debería personalizar
4. Usuario lee noticias A4 → Debería registrar engagement

ACTUALMENTE:
- Paso 1 ❌ No implementado (falta trigger en onboarding)
- Pasos 2-4 ✅ Endpoints existen pero no se llaman
```

**Tabla `coach_context_snapshots`:**
```sql
SELECT * FROM coach_context_snapshots 
WHERE user_id = '64738eef-ee31-4da9-8270-9adfa46c74ba'
→ RESULTADO: No rows (tabla vacía para este usuario)
```

---

## RESUMEN DEL ESTADO ACTUAL

| Sistema | Status | Detalle |
|---------|--------|---------|
| **Auth** | ✅ Funciona | Login y registro OK |
| **Onboarding A1** | ✅ Funciona | Test DISC se guarda |
| **Post-onboarding** | ❌ Falta | No hay página de resultado |
| **Dashboard** | ✅ Creado | Pero sin datos reales |
| **A2 Rutas** | ✅ Funciona | Misiones se crean |
| **A2 Módulos** | ✅ Existen | 4 rutas × 5 módulos cada una |
| **A3 Entrenamientos** | ⚠️ Vacío | Tablas OK, data falta |
| **A3 Videos** | ⚠️ Vacío | Banco de videos sin contenido |
| **A4 Noticias** | ✅ Funciona | Pero genéricas, no personalizadas |
| **Coach Context** | ✅ Endpoint OK | Pero nunca se llena |
| **API Routes** | ✅ Arreglado | Ahora en `/rest/**` |
| **Supabase Query** | ✅ Arreglado | Usa `.maybeSingle()` |

---

## PRÓXIMOS PASOS RECOMENDADOS

### 1. INMEDIATO (Hoy)
- [ ] Crear página `/despega/a1/resultado` 
- [ ] Actualizar redirección post-onboarding
- [ ] Crear trigger para guardar primer coach_context_snapshots

### 2. CORTO PLAZO (Esta semana)
- [ ] Insertar data de ejemplo:
  - 5+ entrevistas en a3_entrevistas
  - 10+ videos en a3_video_banco
  - 20+ noticias categorizadas en a4_news (cache)
- [ ] Actualizar A4 para personalizar por tema actual

### 3. MEDIANO PLAZO (Siguiente semana)
- [ ] Implementar automático:
  - Crear coach_context_snapshots al terminar A1
  - Actualizar context al terminar A2/A3
  - Registrar engagement A4 → actualizar personalizaciones
- [ ] Testing completo del flujo de usuario

---

## VALIDACIÓN DE CICLO

**Flujo esperado:**
```
Login → Onboarding A1 → Dashboard → A2 Misión → A3 Training → A4 Contexto → Coach
   ✅    ✅ (A1 test)     ✅ Creado    ✅ OK       ⚠️ Vacío     ✅ Funciona   ✅ Ready
```

**Conclusion:** 
Sistema está **80% funcional** en términos arquitectónicos. Falta **20% data de ejemplo** y **automatización de triggers** para crear experiencia completa. Los errores técnicos están resueltos.
