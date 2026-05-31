## FASE 1: ARQUITECTURA BASE A4 - COMPLETADA

### Componentes Creados:

**1. Tablas Supabase**
- `a4_strategic_scores` - Puntaje diario usuario (0-100)
- `a4_signal_history` - Registro de señales detectadas 
- `a4_decay_config` - Config de decadencia natural
- `a4_suggested_actions` - Acciones sugeridas personalizadas

**2. Archivos Creados**
- `/hooks/use-a4-strategic-score.ts` - Hook de cálculo con promedio móvil 7 días
- `/app/rest/banco-central-data/route.ts` - API: IMACEC, IPC, TPM, Dólar
- `/app/rest/ine-employment/route.ts` - API: Desempleo por sector/región
- `/components/a4-radar-estrategico.tsx` - Componente Radar (306 líneas)
- `/app/rest/a4-suggested-actions/route.ts` - Endpoint acciones sugeridas

**3. Integraciones en Página A4**
- Agregado import de RadarEstrategico
- Nuevo tab "Radar" como default en A4
- Cambio de 4 tabs a 5 tabs (Radar + Dashboard + Noticias + Módulos + Biblioteca)

### Estado de Integridad:
- ✅ A1, A2, A3: Sin cambios
- ✅ Coach existente: Sin cambios
- ✅ BD existente: Solo agregadas nuevas tablas
- ✅ Cero breaking changes

### Próximo: FASE 2
Integración Coach Estratégico - El coach entiende contexto A4

---

## FASE 2: INTEGRACIÓN COACH ESTRATÉGICO - EN PROGRESO

### Qué se Necesita:

1. **Coach Strategic Context** - Estructura que extienda sesión
2. **Brain Context Enrichment** - Inyectar datos A4 en prompts
3. **Strategic Question Handler** - Coach responde sobre macro/mercado
4. **A4 Context Provider** - Componente que proporciona contexto a coach

### Archivos a Crear:
- `/lib/coach-strategic-context.ts` - Context e interfaces
- `/components/coach-strategic-provider.tsx` - Provider wrapper
- `/hooks/use-coach-strategic-context.ts` - Hook para acceso
- Actualizar `/app/api/brain-query` para aceptar contexto A4

### Cambios Mínimos:
- SessionWrapper: Agregar a4_context opcional
- Coach selector/chat: Recibir contexto A4
- Brain API: Incluir contexto en systemPrompt
