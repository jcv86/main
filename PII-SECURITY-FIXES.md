## FIX #6: Remover PII de localStorage

**PROBLEMA:**
Guardas en localStorage:
```javascript
{
  user_id: 'travis_123',
  email: 'travis@hospital.cl',  ← PII
  nombre: 'Travis',              ← PII
  camino: 'persona_coaching',
  a1_iniciado: true
}
```

Riesgo en XSS: attacker puede leer email/nombre directo desde localStorage.

**SOLUCIÓN:**

```javascript
// localStorage - SOLO UX flags
const uiState = {
  a1_iniciado: true,
  camino_tipo: 'persona',
  last_visited: 'a1_cerebral'
}

localStorage.setItem('despega_ui_state', JSON.stringify(uiState))

// user_id, email, nombre → obtén desde Supabase session
const { data: { user } } = await supabase.auth.getUser()
// user.id, user.email vienen encriptados en sessionStorage (manejado por Supabase)
```

**Ventaja:** Zero PII en localStorage.

---

## FIX #7: Sanitizar Diagnósticos en Context Vault

**PROBLEMA:**
Guardas exacto: "Madre con Alzheimer" = salud de tercero, es PII de la madre.

**SOLUCIÓN:**

Ya implementada en RPC:
```sql
REGEXP_REPLACE(
  p_context_text,
  '(Alzheimer|demencia|psiquiátrico|diabético|hipertensión)',
  'condición médica',
  'gi'
)
```

Resultado sanitizado:
```
ANTES: "Madre con Alzheimer, trabajo 12-hour shifts"
DESPUÉS: "Madre con condición médica, trabajo 12-hour shifts"
```

**Ventaja:** Reduces PII de tercero sin perder contexto.
**Nota:** Travis aún tiene el original en su memoria; el vault solo guarda versión sanitizada.
