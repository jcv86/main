# A1 — comprensión individual: candidato de implementación

Fecha: 2026-09-07. Base: `c60fb57cd71e93b1b268b009bab9f21127b705c9` (PR #133, aún en borrador). Rama prevista: `agent/dtc-a1-individual-understanding-20260907`. Este bloque depende del PR #133 y no lo promueve ni lo reemplaza.

## Objetivo y límites

Pasar de una descripción por combinación a una lectura individual trazable. No copiar textos ni algoritmos propietarios de LiderDISC. Las agrupaciones, aclaraciones y narrativa son originales de DTC. Este trabajo NO demuestra validez psicométrica, precisión psicológica ni superioridad frente a otro instrumento. No se modifican precios, acceso Free/pago ni las 28 preguntas originales; la revisión profesional de los ítems y del onboarding sigue pendiente.

## Implementado

- C1: recuperar textos y listas sin perder situación laboral, experiencia o disponibilidad; conservar el objetivo inicial y el posterior. Rangos de experiencia incompatibles quedan señalados, no corregidos por suposición.
- 28 respuestas: reconstrucción estricta con el cuestionario compatible, comparación con el puntaje guardado, conteos MÁS/MENOS separados y seis agrupaciones editoriales que cubren cada pregunta una sola vez.
- Lectura: evidencia por pregunta, matices entre situaciones, referencias generales del patrón separadas de las declaraciones individuales y acceso «Por qué aparece esto».
- Empates: evidencia explícita v2 desde el cálculo y en el informe. Un empate legítimo no obliga a repetir el cuestionario ni bloquea el avance. Datos inválidos o incompatibles sí bloquean la interpretación.
- Cuatro aclaraciones opcionales, sin texto libre obligatorio, seleccionadas de un banco revisable. El orden prioriza variación contextual; no se presenta como test adaptativo calibrado.
- Acuerdo, matiz, desacuerdo o incertidumbre se conservan como perspectiva del usuario, no como demostración de validez ni como instrucción para alterar puntajes.
- Versiones y trazabilidad: cuestionario, cálculo, interpretación, revisión de fuentes y revisión de edición. Fuentes cambiadas invalidan la aplicación de aclaraciones antiguas; no se recalculan ni reescriben evaluaciones históricas.
- Integración común para informe A1 e integral. Estado de lectura revisable separado de la existencia de una pareja única de letras.

## Compatibilidad de almacenamiento — importante

La inspección de metadatos, en transacción solo lectura, confirmó que `a1_cerebral_assessment.dominant_pattern` es NOT NULL. No se cambió el esquema. La RPC conserva sus dos campos de compatibilidad existentes; cuando hay empate, NO representan una diferencia demostrada. `responses._meta.patternEvidence` guarda los candidatos y la ambigüedad desde el origen, y `compatibilityLabelsOnly` lo explicita. Los informes v2 interpretan los puntajes/respuestas, no los aliases de desempate. El audit suplementario no se ejecuta ante un empate. Antes de producción se requiere revisar consumidores históricos de Career Identity que todavía puedan usar esos campos sin el metadato. No se afirma una migración completa de todos los consumidores.

## Persistencia de aclaraciones

Se reutiliza el JSONB de la última respuesta C2 del mismo usuario, en la clave reservada `_a1_understanding_v1`. No requiere una migración. Solo se actualiza esa clave y `updated_at`, conservando las respuestas C2 y `completed_at`. Las revisiones son tokens de consistencia, no credenciales.

`PUT /api/a1/clarifications` exige sesión verificada, acceso piloto, origen coincidente, JSON acotado a 8 KiB, campos permitidos, preguntas/opciones emitidas por el servidor y revisiones vigentes. La escritura filtra `user_id` e `id` del registro y compara `responses` y `updated_at`. Si otra escritura llegó primero, devuelve 409; no sobrescribe a ciegas. No se acepta identidad del cliente. Los errores no exponen respuestas ni mensajes del proveedor.

Un cambio de A1/C1 concurrente posterior a la lectura puede dejar el bloque recién guardado obsoleto: la siguiente carga compara la revisión y no lo aplica. No se afirma una transacción atómica entre las tres relaciones. La interfaz permite retirar las aclaraciones actuales; el cuestionario y resultado original quedan intactos.

## Pruebas y evidencia

El build ejecuta `check-a1-individual-understanding-contract.ts` junto con los contratos previos y TypeScript. Incluye el caso crucial: iguales puntajes e igual pareja global, distintas respuestas por situación, distinta lectura explicable; además incluye empates, pérdida de contexto C1, versiones desconocidas, discrepancias respuesta/puntaje, aclaraciones obsoletas, inyección de identidad, errores, origen, límites y carreras con almacenamiento sintético.

Las pruebas del handler usan Request/Response reales en memoria con dependencias simuladas. NO son pruebas de HTTP desplegado ni RLS. Los resultados exactos, commit y despliegue se registran en el PR tras ejecutar el build; no se anticipa un resultado aprobado.

## Puerta de publicación: NO_GO

No se modifica main ni se promueve producción. No se escriben evaluaciones o datos personales reales durante este trabajo. Sigue abierto el bloqueo de aislamiento heredado documentado en privado en el bloque anterior; no se publican detalles de explotación en este repositorio público.

Antes de publicación: remediación y prueba de aislamiento, revisión de consumidores de aliases, pruebas autenticadas de guardar/recargar/retirar aclaraciones y dos pestañas, móvil 390×844 y escritorio, accesibilidad y revisión de impresión/PDF. El piloto con usuarios y la evaluación profesional de ítems/interpretación son trabajo posterior, no supuestamente cumplido por el CI.

La revisión del orden de opciones, redacción/deseabilidad de los 28 ítems, selección única de experiencia en C1, reducción de repeticiones C1/C2 y corrección completa de copy heredado requieren una versión de captura separada. No se cambian silenciosamente los ítems que identifican respuestas históricas.
