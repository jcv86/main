# A1 → Identidad profesional: límite de interpretación y aislamiento

Base inmutable: `e3e4ae82fb9cd7d016c92200cb18d4ac7be599f6`, PR #134. Continuación en la misma rama; no se crea otro PR acumulativo y no se publica producción.

## Contrato implementado

La lectura de `SupabaseCareerService` ya no trata las antiguas proyecciones DISC como habilidades, evidencia de competencia o confianza psicológica. A1 se reconstruye con las mismas reglas del reporte desde `a1_cerebral_assessment`, mediante el cliente autenticado, filtro de propietario y orden determinista. Si falta o falla la fuente, no se usa el perfil antiguo como sustituto. Los puntajes netos conservan sus signos; una intensidad visual no pasa a ser un percentil.

Se retiran de la respuesta del servicio las filas de habilidades/evidencias identificadas como A1/DISC, sus relaciones y memorias con esa procedencia. Se conservan las fuentes históricas persistidas y los datos no DISC de A2/A3/A4. Las listas antiguas de fortalezas formadas por objetos `{key,score}` no se muestran como capacidades. Las memorias sin procedencia suficiente no pueden certificarse con este filtro; no se declara saneada toda la memoria del producto ni el subsistema independiente AgentOS.

Los parches generales de agentes no pueden escribir el espacio reservado A1 del perfil de comunicación. El escritor histórico de base de datos sigue existiendo: esta entrega corrige la lectura y prepara el control de acceso, no afirma una migración completa del escritor ni reescribe datos anteriores.

## Nueva superficie de producto

Se añade `/despega/career-identity`, cuyo enlace ya existía en el menú y dashboard. La página verifica Supabase Auth y acceso piloto antes de consultar los datos personales. No crea una identidad al abrirse. Distingue preferencias A1, objetivo/rol declarados y registros de habilidades. Incluye estados de carga, ausencia y error sin datos de demostración, y metadata noindex.

## Migración preparada, NO aplicada al proyecto conectado

`supabase/migrations/20260907204000_a1_owner_boundary.sql` habilita RLS y añade políticas restrictivas de propietario sobre A1/C1/C2; retira la excepción antigua de lectura A1. No amplía los permisos permisivos existentes ni modifica registros. Las guardias restrictivas siguen limitando accesos aunque otra política permisiva resulte demasiado amplia. Los roles privilegiados de servidor conservan su función; el filtro por usuario en consultas de servidor continúa siendo obligatorio.

Aplicación pendiente de una ventana autorizada, inventario/backup de políticas, revisión del diff de catálogo, ejecución transaccional y verificación posterior. No restaurar acceso amplio como rollback de emergencia. No se incluyen UUID ni contenidos de usuarios reales en el repositorio público.

## Pruebas

- Nuevo contrato del límite de lectura: puntajes con signo, empates, ausencias, errores, preservación A3, relaciones/memorias derivadas, no mutación, parches de agentes y clase de servicio real con puerto de consultas sintético.
- Nuevo job con PostgreSQL 17 desechable: aplica el SQL candidato y lo repite para probar idempotencia; verifica anon, autenticado sin identidad, dos propietarios distintos, escrituras ajenas, reasignación de propietario, y BYPASSRLS de servidor. Introduce una política permisiva deliberadamente amplia en fixtures y exige que la guardia restrictiva la limite.
- Dos conexiones PostgreSQL reales compiten por la misma revisión C2: exactamente una actualiza y la otra afecta cero filas. Se preservan respuestas originales y datos del segundo usuario.
- El script de integración se niega a conectarse fuera de loopback, exige una base llamada `dtc_a1_boundary_test`, opt-in explícito y tablas ausentes. Ninguna prueba apunta a Supabase de producción.

Los resultados se registran después de ejecutarse en el PR. El stub `auth.uid()` del PostgreSQL desechable permite probar RLS SQL real; no equivale a probar Supabase Auth/JWT, PostgREST o el navegador autenticado.

## Pendientes diferenciados

Validación técnica del candidato no equivale a aprobación de producción. Permanecen: aplicar/reacreditar el aislamiento en el proyecto conectado con autorización; retirar semánticas antiguas en el escritor/RPC y revisar AgentOS; QA autenticado completo de formularios y móvil/PDF; evaluación de uso y profesional del instrumento. No se declara validación psicométrica a partir de tests técnicos.
