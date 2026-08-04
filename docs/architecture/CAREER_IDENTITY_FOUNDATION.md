# Career Identity Foundation

## Propósito

Construir un núcleo longitudinal compartido por A0–A4 sin reemplazar ni alterar las tablas actuales durante la transición.

## Entidades

1. `career_identities`: perfil canónico y versionado por usuario.
2. `career_goals`: objetivos explícitos con estado y prioridad.
3. `career_skills`: nodos de habilidades con score, confianza y tendencia.
4. `career_skill_edges`: relaciones dirigidas y ponderadas entre habilidades.
5. `career_evidence`: evidencia explicable que respalda afirmaciones y puntuaciones.
6. `career_memories`: hechos, preferencias, patrones y decisiones versionables.
7. `career_profile_snapshots`: historial inmutable de la identidad consolidada.

## Invariantes

- Cada usuario tiene como máximo una identidad canónica activa.
- Toda fila pertenece a `auth.users` mediante `user_id`.
- RLS limita lectura y escritura al propietario autenticado.
- Un score o inferencia importante debe poder referenciar evidencia.
- La confianza se expresa en el rango `0..100`.
- El peso de una relación entre habilidades se expresa en `-1..1`.
- La memoria no se sobrescribe silenciosamente: puede expirar o ser reemplazada mediante `superseded_by`.
- Las tablas existentes de A1–A4 continúan siendo la fuente operacional hasta completar la adopción dual-write y su validación.
- Los agentes no escriben directamente en las tablas; utilizan el contrato `CareerWritePort`.
- Los módulos consumen contexto mediante `CareerReadPort`, evitando dependencias directas entre A1, A2, A3 y A4.

## Adopción progresiva

### Etapa 1 — Fundación

- Crear esquema aditivo.
- Publicar tipos y contratos.
- No modificar flujos actuales.

### Etapa 2 — Servicios

- Implementar adaptador Supabase server-side.
- Agregar auditoría de operaciones de agentes.
- Incorporar pruebas de aislamiento RLS y validación de rangos.

### Etapa 3 — Dual write A1

- Mantener escritura actual.
- Derivar identidad, habilidades y evidencia desde resultados A1.
- Comparar consistencia antes de habilitar lectura desde Career Identity.

### Etapa 4 — A2–A4

- A2 agrega evidencia conductual, progreso y memoria.
- A3 agrega evidencia de simulaciones y evolución observable.
- A4 personaliza contexto y relevancia sin convertir noticias en hechos del perfil.

### Etapa 5 — Consolidación

- Activar lectura progresiva con feature flags.
- Crear snapshots antes de cambios de versión.
- Retirar duplicación únicamente después de verificar integridad y reversibilidad.

## Límites de privacidad

- Guardar únicamente información necesaria para personalizar el desarrollo profesional.
- Diferenciar hechos declarados, observaciones e inferencias.
- Exponer origen, confianza y fecha de cada inferencia relevante.
- Permitir borrar o corregir recuerdos derivados del usuario.
- No usar atributos sensibles para inferir empleabilidad ni producir decisiones automatizadas adversas.
