# A1 Canonical Implementation - Complete Audit

## Document: Prompt A1 – Despega Cerebral (Chat Coach DTC) v1.0

### Status: ✅ COMPLETE - 100% CANONICAL COMPLIANCE

---

## Audit Checklist

### Section 0: Rol de este documento
**Requirement:** Define prompt for A1 pillar, making internal patterns visible with clarity and respect
- ✅ **Implemented:** System prompt explicitly states role as pattern explainer (line 8-12)
- ✅ **Validation:** Red flag detection prevents action-pushing and behavior change suggestions
- ✅ **Coverage:** Full section embedded in canonical system prompt

### Section 1: Identidad del Coach en A1
**Requirement:** Eres el Chat Coach DTC en modo A1 – Despega Cerebral (pattern explainer, not action suggester)
- ✅ **Implemented:** Lines 14-20 of system prompt define exact identity
- ✅ **Validation:** Red flag list (20 items) prevents role violation
- ✅ **Coverage:** "EXPLICAR patrones cognitivos, emocionales y contextuales" - explicit constraint

### Section 2: Objetivo central de A1
**Requirement:** Three outcome states - understanding, pattern recognition, normalization
- ✅ **Implemented:** Lines 22-29 define exact objectives
- ✅ **Constraint:** "A1 NO busca optimizar ni corregir" - explicitly forbidden
- ✅ **Validation:** Red flags include "optimizar", "corregir" to prevent violation

### Section 3: Marco de funcionamiento obligatorio
**Requirement:** EXPLICA → CONTEXTUALIZA → VALIDA (never accelerates toward goals)
- ✅ **Implemented:** Lines 31-37 define mandatory framework
- ✅ **Response Structure:** 4-step response (recognition, explanation, validation, question)
- ✅ **Validation:** No action recommendations allowed

### Section 4: Tipos de patrones que se pueden trabajar en A1
**Requirement:** Can explain reaction patterns, contradictions, biases, context effects, identity confusion
- ✅ **Implemented:** Lines 39-46 list exact pattern types
- ✅ **Constraint:** "sin etiquetar ni patologizar" - explicit guardrail
- ✅ **Validation:** Red flags include "patología", "diagnóstico", "etiquetar"

### Section 5: Uso de preguntas en A1
**Requirement:** Questions for understanding only (never action-pushing)
- ✅ **Implemented:** Lines 48-56 define question usage
- ✅ **Example Provided:** "¿esto te pasa más en ciertos contextos que en otros?" (understanding, not evaluation)
- ✅ **Validation:** Prevents prescriptive questions

### Section 6: Uso de ejemplos
**Requirement:** Everyday, simple, recognizable examples for recognition (not instruction)
- ✅ **Implemented:** Lines 58-63 define example usage rules
- ✅ **Constraint:** "RECONOCIMIENTO, no instrucción"
- ✅ **Validation:** Built-in to response structure

### Section 7: Manejo de emoción y confusión
**Requirement:** Lower intensity, normalize reaction, explain why (never minimize)
- ✅ **Implemented:** Lines 65-71 define emotion handling
- ✅ **Constraint:** "NUNCA se minimiza la experiencia"
- ✅ **Response Type:** "normalization" response type enforces this

### Section 8: Límites explícitos en A1
**Requirement:** NO action plans, NO behavior suggestions, NO performance evaluation, NO recommendations
- ✅ **Implemented:** Lines 73-80 define explicit limits
- ✅ **Red Flags:** 20-item list covers all violations
- ✅ **Fallback:** "Si el usuario pide 'qué hacer', DEVUELVE A COMPRENSIÓN"

### Section 9: Influencias internas (no visibles)
**Requirement:** Hidden Brain-style reasoning (never mentioned explicitly)
- ✅ **Implemented:** System prompt includes "Hidden Brain" reference (line 82)
- ✅ **Constraint:** Never visible to user
- ✅ **Implementation:** Influences approach silently

### Section 10: Cierre de interacción en A1
**Requirement:** Resume pattern, validate clarity, leave open for continuity (never push transition)
- ✅ **Implemented:** Lines 90-95 define closure structure
- ✅ **Response Structure:** Includes "pregunta de profundización O apertura para continuidad"
- ✅ **Constraint:** "NUNCA empuja transición inmediata"

---

## Implementation Files

### 1. `/lib/a1-coach-prompts.ts` (167 lines)
- ✅ Full canonical system prompt (10 sections embedded)
- ✅ 20 red flag keywords for validation
- ✅ Response structure definition
- ✅ `validateA1Response()` helper function

### 2. `/app/api/despega/a1-coach/route.ts` (63 lines)
- ✅ Uses canonical prompts from config
- ✅ Response schema includes pattern identification
- ✅ Post-generation validation (both A1-specific and Brandie Sensei)
- ✅ Returns coherence check results

### 3. `/components/a1-coach-interactive.tsx` (existing)
- ✅ Component renders responses correctly
- ✅ Initializes coach with welcome message
- ✅ Accepts user input and sends to API

---

## Validation Rules

### Red Flags (20 items - any triggers violation):
1. ✅ "deberías"
2. ✅ "tienes que"
3. ✅ "lo correcto es"
4. ✅ "está mal que"
5. ✅ "no debes"
6. ✅ "plan de acción"
7. ✅ "cambiar tu comportamiento"
8. ✅ "la solución es"
9. ✅ "evaluación de desempeño"
10. ✅ "recomendación"
11. ✅ "prescribo"
12. ✅ "optimizar"
13. ✅ "corregir"
14. ✅ "defecto"
15. ✅ "patología"
16. ✅ "etiquetar"
17. ✅ "diagnóstico"
18. ✅ "puedes hacer esto"
19. ✅ "yo que tú"
20. ✅ "mi consejo es"

### Additional Constraints (enforced):
- ✅ Max 200 words per response
- ✅ No technical jargon
- ✅ Respectful tone
- ✅ Pattern explanation required
- ✅ Normalization before explanation
- ✅ Questions only for understanding

---

## Response Type Schema

```typescript
enum ResponseType {
  pattern_explanation = "Explain cognitive/emotional/contextual pattern",
  normalization = "Normalize experience or reaction",
  contextualization = "Add context to experience",
  question = "Question for understanding (never action-pushing)",
}
```

---

## Coverage Summary

| Section | Canonical Requirement | Implementation | Status |
|---------|----------------------|-----------------|--------|
| 0 | Document role | System prompt section 0 | ✅ |
| 1 | Identity | System prompt section 1 | ✅ |
| 2 | Objectives | System prompt section 2 | ✅ |
| 3 | Framework | System prompt section 3 | ✅ |
| 4 | Pattern types | System prompt section 4 | ✅ |
| 5 | Questions | System prompt section 5 | ✅ |
| 6 | Examples | System prompt section 6 | ✅ |
| 7 | Emotion | System prompt section 7 | ✅ |
| 8 | Limits | System prompt section 8 + red flags | ✅ |
| 9 | Internal influences | System prompt section 9 | ✅ |
| 10 | Closure | System prompt section 10 | ✅ |

---

## Production Readiness

- ✅ All 10 canonical sections implemented
- ✅ Red flag validation active
- ✅ Response schema enforces types
- ✅ Coherence checks enabled
- ✅ Error handling in place
- ✅ Brandie Sensei Nivel 2 compliance verified

**Status: PRODUCTION READY** 🎯
