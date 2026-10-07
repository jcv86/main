# Outcomes Chile — revisión de evidencia por operador

Fecha: 2026-10-07. Estado: **procedimiento definido; operación de revisión aún no implementada**. Este documento no acredita ninguna revisión de un resultado personal ni autoriza cambios de estado.

## Alcance y efecto en la activación

El piloto de captura y lectura de datos declarados puede verificarse sin una operación de revisión por terceros. El [RPC de captura](../../supabase/migrations/20261007143341_dtc_outcomes_chile_idempotent_capture.sql) fuerza `self_reported`; el [servicio de resumen](../../lib/outcomes-chile/service.ts) obtiene el nivel de verificación de cada registro y no consulta `dtc_outcome_verifications`. La interfaz identifica estos registros como **Declarado por ti** y conserva la advertencia de que su evolución no demuestra un efecto causal de DTC.

Elevar evidencia a **Con respaldo** o **Verificado**, rechazarla, o revocar una validación anterior requiere la operación separada descrita aquí. Su ausencia bloquea esas afirmaciones y operaciones; no impide registrar declaraciones. Las referencias oficiales de mercado tienen su propio [procedimiento de importación](DTC_OUTCOMES_CHILE_OFFICIAL_IMPORT.md) y no verifican hechos personales.

## Estados y criterios

`reviewed` no es un estado del esquema. `manual_review` es un método de auditoría; haber mirado un archivo no convierte su contenido en verdadero. `needs_review` es un estado de presentación de seguimientos con fechas inconsistentes.

| Decisión | Criterio mínimo propuesto | Representación existente y límite |
|---|---|---|
| Declarado | Información aportada por la persona, sin respaldo independiente suficiente | Registro `self_reported`; no elevar por repetición del mismo relato. |
| Pendiente | Falta información, autenticidad o correspondencia con el hecho y su fecha | Auditoría `pending`; mantener el registro declarado. Falta de respaldo no significa falsedad. |
| Con respaldo | Una fuente identificable y pertinente coincide con parte sustancial del hecho; quedan límites documentados | Registro y auditoría `corroborated`, únicamente mediante la futura operación atómica. |
| Verificado | Evidencia auténtica, atribuible al mismo propietario, suficiente para todos los campos materiales y el período concreto; contradicciones resueltas | Registro y auditoría `verified`. Verificar un hecho no acredita causalidad ni otros hechos. |
| Rechazado | Una contradicción sustantiva, una fuente inválida o un error demostrado impide sostener la afirmación | `rejected` existe solo en auditoría. El modelo actual no retira el registro del cálculo: esta operación requiere diseño adicional antes de activarse. |

Fuentes aceptables dependen del hecho que se pretende acreditar:

| Hecho | Evidencia que se puede revisar | Límite que debe conservarse |
|---|---|---|
| Postulación, entrevista u oferta | Confirmación del proceso, mensaje de su emisor o registro del sistema con fecha y vínculo verificable con la persona | Una invitación acredita la invitación; no demuestra que se realizó la entrevista. Una oferta no acredita incorporación. |
| Inicio de empleo, cambio o promoción | Documento formal y respaldo de la fecha efectiva, por ejemplo constancia laboral o registro de remuneración correspondiente | Un contrato o una fecha futura por sí solos no prueban inicio efectivo. |
| Ingreso mensual neto | Liquidación o comprobante del período que permita identificar el monto neto, su composición y a la persona | No sustituir por salario bruto, oferta, depósito de composición desconocida ni promedio oficial. Mantener explícitos pagos extraordinarios y períodos parciales. |
| Seguimiento laboral | Respuesta ya completada y fuente pertinente a la situación y fecha que se revisan | No verificar un seguimiento pendiente ni anticipar un horizonte. Una respuesta tardía no demuestra por sí sola el estado en el día 30/90/180. |

Solo se revisan fuentes disponibles y autorizadas. Referencias a otros registros deben demostrar su independencia y vínculo; dos declaraciones copiadas no son dos corroboraciones. No se inicia contacto con terceros desde este procedimiento.

## Preparación e identidad del operador

La dirección debe designar a los revisores autorizados. La futura operación debe resolver la identidad del actor desde una sesión autenticada y comprobar una autorización mantenida por el servidor. El `user_id` del resultado identifica a su propietario, no al revisor; `service_role` identifica una capacidad técnica, no a una persona. No usar `user_metadata` editable por el cliente para conceder permisos.

Antes de abrir una transacción, preparar un expediente privado con: identificador de revisión, propietario, tipo e ID del registro, valores y estado observados, fuentes y períodos, huellas de los documentos, campos respaldados, contradicciones, decisión propuesta y fundamento. Minimizar datos de terceros y no copiar documentos laborales o remuneraciones al repositorio. Los documentos deben conservar controles de acceso y una política de retención; no usar enlaces públicos como evidencia privada.

## Operación atómica requerida

El siguiente flujo es una especificación para implementar, no una secuencia de SQL disponible:

1. Autenticar al operador, autorizar la revisión y validar un identificador único de operación. Mapear el tipo de objeto a una lista fija de tablas; no aceptar nombres SQL libres.
2. Abrir una transacción. Bloquear el objeto por ID **y propietario**, junto con el empleo relacionado cuando corresponda, en un orden estable. Comprobar existencia, relaciones, fecha, estado anterior y versión o huella de los datos revisados. Si cambiaron desde la preparación, cancelar y volver a revisar.
3. Resolver la decisión según una versión explícita del criterio de revisión. No elevar seguimientos pendientes, alterar fechas para hacerlos elegibles ni ampliar el alcance de la evidencia.
4. Escribir una entrada nueva de auditoría y la transición del registro dentro de la misma transacción, comprobando que afectó exactamente al objeto previsto. Registrar actor autenticado, propietario, objeto, estado anterior y nuevo, fundamento, referencias, versión del criterio y hora del servidor. Un reintento debe recuperar la misma decisión; una discrepancia debe provocar rollback completo.
5. Confirmar la transacción y volver a leer el resumen. El [motor de impacto](../../lib/outcomes-chile/impact.ts) usa el nivel mínimo del par de salarios o del empleo y su seguimiento: revisar un registro no eleva automáticamente el resultado completo.
6. Una corrección posterior debe ser otra revisión que señale la decisión anterior y su motivo. Conservar la historia, sin sobrescribirla ni borrar el registro de solicitudes de captura. Resolver primero cómo se excluye o sustituye evidencia rechazada; no fingirlo mediante una actualización aislada del estado.

## Brechas específicas que bloquean esta operación

El [esquema instalado](../../supabase/migrations/20261007143246_dtc_outcomes_chile_foundation.sql) permite almacenar decisiones, pero no garantiza todavía una revisión trazable:

- **Propietario y objeto:** `dtc_outcome_verifications.user_id` referencia a Auth, pero `subject_type` + `subject_id` no tiene relación comprobada con la tabla y propietario del objeto. Una escritura privilegiada equivocada podría asociar evidencia ajena o un objeto inexistente. La RLS del registro de auditoría no corrige ese vínculo.
- **Identidad e historia:** no existen campos obligatorios de actor, motivo, estado anterior, versión de criterio o revisión reemplazada. `evidence_refs` solo exige un array JSON; no sustituye un contrato de auditoría. La tabla es legible por su propietario y el servidor conserva UPDATE/DELETE, por lo que no es un registro inmutable.
- **Consistencia:** no existe un RPC de revisión que cambie estado y auditoría juntos, ni una garantía que exija una auditoría al elevar `verification_status`. `verified_at` puede quedar vacío y no resuelve estas carencias.
- **Rechazo y corrección:** el resumen no consulta decisiones de auditoría y los registros no admiten `rejected`, retirada ni sustitución. Añadir una auditoría rechazada no elimina el hecho del cálculo. La [selección de salarios](../../lib/outcomes-chile/impact.ts) deja conflictos de una misma fecha sin resolver porque no existe una relación de sustitución.

Estas brechas corresponden al requisito posterior de revisión por operador. Antes de habilitarlo se necesitan un contrato de auditoría con identidad y propietario comprobados, una transición transaccional e idempotente y reglas explícitas para rechazo y corrección. Hasta entonces se conserva el alcance de datos declarados, sin promover estados de personas reales ni presentar la revisión como implementada.
