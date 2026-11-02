# DTC: integración de cierre profesional

Fecha: 2026-11-02. Base principal revisada: `3de1cbfc5b3147ad0f6ee109742ccb06728e5cda`.
Estado de este documento: candidato de integración; la ejecución remota de aceptación y el despliegue se registrarán después de sus resultados reales.

## Decisiones implementadas

- Se integran las propuestas existentes de captura de respuestas (#244) y búsqueda guardada (#245), conservando su contenido e historia. El registro `2-capture` se reconoce en el recorrido; guardar respuestas nunca se interpreta como mejora o capacidad demostrada.
- A1 conserva respuestas MÁS/MENOS, empates, contexto y aclaraciones en el paso hacia A2. La introducción explica el alcance de las preferencias declaradas y admite objetivos personales. Las recomendaciones antiguas de carrera por DISC quedan retiradas.
- Los seis registros de inicio/seguimiento permiten guardar, recargar y continuar con el registro confirmado sin otro POST. Un historial tardío no sustituye respuestas que ya se están escribiendo.
- A2 adapta sus prácticas al foco explícito personal/profesional/ambos. Los ajustes de práctica conservan el trabajo anterior, la barrera y una próxima acción. Un ajuste no completa días ni suma XP. Los informes usan el horizonte elegido y conteos de registros, sin presentar un índice de cierre como capacidad.
- A3 conserva hechos escritos por la persona en el CV, distingue hechos pendientes y confirmación propia, permite recuperar lo guardado y exportar texto. La guía de entrevistas selecciona un criterio y una cita literal de la respuesta; una cita inventada se rechaza. El segundo intento conserva el primero.
- El objetivo laboral separa cargo, área funcional, industria, etapa exploratoria, ubicación y modalidad. Se puede guardar al comienzo del recorrido y recuperar en A4. La entrada temprana exige sesión y acceso piloto; guardar preferencias no concede acceso al Radar.
- El objetivo se actualiza con revisión `id + updated_at`; una edición concurrente devuelve 409 y conserva el borrador. Los campos avanzados omitidos se mantienen. Los filtros explícitos se combinan sin ampliación silenciosa.
- La industria empresarial sólo se presenta con evidencia de empleador y fecha. El registro revisado inicial es pequeño; el resto queda por confirmar. Se muestra cobertura y se respeta la decisión de incluir o excluir rubros desconocidos.

## Evidencia de ingeniería

`npm run test:professional-closure` reúne ejecución de lógica y rutas con I/O sintético: traspaso A1–A2, registro de respuestas, práctica, contexto de reportes, búsqueda guardada y fronteras de A4. Sus resultados no equivalen a sesiones, RLS ni navegador reales.

`npm run quality:gate` añade TypeScript, contratos críticos y compilación de producción. Los workflows existentes de cada dominio siguen activos. La compilación deja de ejecutar el generador histórico de mayo que afirmaba «100% completo» y creaba un DOCX ajeno a la evidencia de esta versión; compilar no debe producir una certificación automática de lanzamiento.

El workflow `a1-browser-qa.yml` incorpora una etapa adicional descrita en `scripts/a1-browser-qa/closure-README.md`: Supabase local desechable, usuarios sintéticos nuevos, Auth/JWT/cookies/PostgREST reales, migraciones de captura y objetivo, AppShell real, seis formularios, continuidad tras recargar, conflictos concurrentes y pantallas de 390/1440 px. Mantiene declaradas las sustituciones de documento raíz/fuentes y las tablas auxiliares de fixture. No utiliza producción ni acredita servicios externos, validez psicométrica o resultados con participantes.

## Cambio de esquema y publicación

La única migración nueva de producto es `20261102115220_dtc_labor_objective_completion.sql`, generada con Supabase CLI. Agrega áreas, etapa, política de industria desconocida y preferencia geográfica; permite exploración sin cargo. Conserva RLS, índice de principal activa y trigger de revisión.

El preflight de lectura sobre el proyecto DTC confirmó cuatro búsquedas existentes y ninguna lista histórica de cargos o ubicaciones incompatible con los límites preparados. No se inspeccionaron ni copiaron sus valores privados. El backfill de ubicación usa únicamente presencia de regiones, no asigna Metropolitana ni reescribe cargos; actualiza `updated_at`, por lo que una pestaña antigua deberá recuperar la revisión nueva.

Secuencia de salida: validar migración en la base local de CI, revisar el candidato y sus checks, aplicar el cambio aditivo al proyecto DTC verificado, integrar la versión aprobada y verificar su despliegue. Este documento por sí solo no acredita que esos pasos hayan ocurrido.

## Trabajo con participantes

El protocolo `DTC_PILOT_30_DAYS_20261102.md` prepara la siguiente validación. Los registros sintéticos comprueban contratos de software; se necesitan participantes para observar comprensión, abandono, utilidad, autonomía y calidad de las evidencias. No se anuncia una mejora causal, una probabilidad de contratación ni un instrumento psicométrico validado.
