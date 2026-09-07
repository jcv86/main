# A1 — escritor de fuente y contexto AgentOS

Base funcional: `144099532bb5dcc802bb6690a25d16e498387dc5`. Continuación en el mismo PR #134. La migración de aislamiento A1/C1/C2 ya aplicada se conserva; su registro efectivo es `20260907210043_a1_owner_boundary`. Este bloque no modifica ese historial ni promueve la app.

## Alcance

El candidato `20260907211500_a1_source_writer_v2.sql` reemplaza la RPC existente con la misma firma/retorno y SECURITY INVOKER. El banco v1 queda congelado dentro de la función y se contrasta con el banco TypeScript. Las elecciones MÁS/MENOS se validan y puntúan dentro de PostgreSQL; preguntas, agregados, etiquetas o metadatos enviados por un cliente no gobiernan el resultado.

Cada nueva evaluación conserva sus respuestas y el cuestionario canónico; guarda signos, candidatos empatados, versiones y los campos heredados de compatibilidad exigidos por el esquema. El espacio `communication_profile.a1` se declara como autoinforme de preferencias, no como competencia ni probabilidad. Se preservan los datos de comunicación A3 y las listas de fortalezas/objetivos preexistentes. No se crean ni actualizan filas DISC de career_skills, career_evidence o career_memories: sus campos obligatorios de habilidad/confianza no corresponden a esta medición. No se borran proyecciones históricas ni se reclasifican frases antiguas sin procedencia.

La evaluación, la actualización de identidad y el evento mínimo de auditoría son una única operación transaccional. La espera de escritores A1 del mismo propietario se serializa con un advisory lock de transacción; la fecha se asigna después de esperar. El contrato incluye un fallo deliberado en auditoría y dos conexiones concurrentes. La correlación permite rastrear una solicitud; no se anuncia como garantía de idempotencia. Dos solicitudes aceptadas siguen representando dos evaluaciones, como antes.

## AgentOS

El guardado A1 deja de invocar una captura de supuestas fortalezas. El constructor de contexto verifica al propietario y carga A1/C1/C2 con cliente autenticado y las mismas formas de fila/revisiones que el informe. Adjunta puntajes netos, ambigüedad, respuestas situacionales y aclaraciones vigentes; no adjunta listas genéricas como capacidades ni cifras de confianza. Si falla una fuente no usa una inferencia histórica como sustituto.

`/dtc:a1-identity-audit` pasa a ser una lectura de fuente, sin escribir memory_items ni confiar en params.strengths. El registro de ese comando contiene metadatos de operación, no duplicados de respuestas. Los puntos de lectura, formato y analytics excluyen memorias con procedencia A1 identificable; los puntos de escritura/captura A1 se rechazan y los contadores del adaptador no afirman memorias que no se escribieron. Una mención textual de DISC no basta por sí sola para clasificar la procedencia.

La configuración pura se separa del barrel de AgentOS y la evaluación de desbloqueos se importa solo cuando se solicita; una lectura A1 no necesita inicializar proveedores de IA. La ruta de inferencia no llama a modelos en estos tests. No se crean claves ni se cambian modelos, suscripciones, dependencias, precios o nivel Free/pago.

La inspección del catálogo conectado encontró las tres guardias restrictivas activas y el escritor antiguo aún instalado. No encontró una relación public.memory_items. La nueva fuente A1 no depende de que exista esa tabla. El subsistema genérico de memoria y sus otras tablas no se declara operacional ni saneado globalmente por este bloque.

## Evidencia y estados de release

Se añadió un workflow con procedencia del código y pruebas del escritor en PostgreSQL desechable. El banco v1 se compara entero; se ensayan clientes que mandan agregados/patrones/banco falsificados, respuestas inválidas, versiones desconocidas, anonimato, aislamiento, preservación de historia, fallo parcial y concurrencia. Los módulos reales de AgentOS se ensayan con un puerto sintético de sesión/consulta. Los resultados exactos del commit final se registran en el PR después de observarlos.

No hubo checkout de red desde el contenedor local: se descargó un artefacto de fuentes públicas acotadas del mismo PR y se verificó su SHA-256. El test local transpila el TypeScript real con el compilador disponible; no equivale a instalar y compilar toda la app. El pipeline remoto realiza la compilación y los contratos con dependencias del proyecto.

**Migración del escritor: candidata, NO aplicada al Supabase conectado.** Su aplicación requiere respaldo de la definición de función/permisos, precondiciones, autorización y postflight. No se deben deshacer las protecciones RLS ya aplicadas. No se hizo merge ni promoción de Vercel ni escritura de evaluaciones reales.

Pendientes de publicación: aplicar el escritor con autorización; probar Auth/PostgREST y guardar/recargar aclaraciones con sesión real; revisar escritorio, 390×844 y PDF. La trazabilidad y el CI no acreditan validez psicológica ni que todo consumidor histórico de A1 haya sido retirado. La revisión de ítems y el piloto con personas permanecen separados de esta corrección de infraestructura.
