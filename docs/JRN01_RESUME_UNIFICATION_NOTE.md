# JRN-01 — Canonical resume unification

Este PR elimina la segunda jerarquía de reanudación que vivía en `legacy-continuity.ts`.

Las URLs legacy C1–C4 ahora consultan `getJourneyForCurrentUser()` y delegan la decisión de reanudación a `loadJourneyFlow(journey).next.href`, la misma `FlowAction` que consume el journey moderno.

Caso de regresión que motivó el cambio: un usuario con A2 activo y Día 7 desbloqueado tiene A3 disponible para el checkpoint `career-mirror`. El resolver legacy anterior priorizaba `access.a3` y lo enviaba a `/despega/a3`; el Journey Flow canónico exige primero `/despega/a3/career-mirror`.

El browser gate usa únicamente usuarios sintéticos y Supabase local desechable. No escribe en DTCFINAL ni modifica Vercel/producción.
