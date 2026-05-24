# Hidden Brain & Adam Grant Integration Plan for DTC

## Executive Summary
This plan ensures DTC's conceptual framework (Hidden Brain for explanation, Adam Grant for application) is properly embedded across all 4 pillars with consistency and intentionality.

## Current State Assessment

### ✅ What's Already Well-Integrated:
- A1 uses Hidden Brain principles (pattern explanation without prescription)
- A4 uses Hidden Brain principles (context > trait approach)
- A2 uses Adam Grant concepts (rethinking, nuance)
- A3 uses Adam Grant concepts (training, alternatives)

### ⚠️ What Needs Enhancement:
- No explicit reference architecture defining which referent powers each pillar
- Coach prompts don't explicitly mention the referents
- No unified framework document for developers/coaches
- Missing connection between referents and red flag detection

---

## 7-Phase Integration Plan

### Phase 1: Create Referents Architecture Framework
**File**: `/lib/dtc-referents-framework.ts`

Create a unified configuration that maps:
- Hidden Brain → A1 & A4 (explanatory pillars)
- Adam Grant → A2 & A3 (applicative pillars)
- Core principles for each referent
- Integration points with coaching prompts

**Deliverable**: Reusable referents config that all coaches inherit from

---

### Phase 2: Enhance A1 Coach Prompts
**File**: `/lib/a1-coach-prompts.ts`

Add explicit Hidden Brain integration:
- Section: "HIDDEN BRAIN INFLUENCE: Context > Trait"
- Examples of invisible patterns vs. labels
- Framework: "Explain the system, not the person"
- Redirect: "This isn't about who you are; it's about how the context shapes responses"

**Key addition**: Anti-labeling principles + pattern explanation focus

---

### Phase 3: Enhance A4 Coach Prompts
**File**: `/lib/a4-coach-prompts.ts`

Add explicit Hidden Brain integration:
- Section: "HIDDEN BRAIN INFLUENCE: Invisible Rules"
- Frame market/context as systems, not as judgments
- Show how context creates behavior patterns
- Example: "This isn't weakness; it's how the system works"

**Key addition**: System transparency + desnormalización del juicio

---

### Phase 4: Enhance A2 Coach Prompts
**File**: `/lib/a2-coach-prompts.ts`

Add explicit Adam Grant integration:
- Section: "ADAM GRANT INFLUENCE: Rethinking & Nuance"
- Emphasis on changing opinions as sign of intelligence
- Multiple ways of thinking about same pattern
- Frame: "There's no one right way to be; there are many ways to respond"

**Key addition**: Flexibility + rethinking as strength

---

### Phase 5: Enhance A3 Coach Prompts
**File**: `/lib/a3-coach-prompts.ts`

Add explicit Adam Grant integration:
- Section: "ADAM GRANT INFLUENCE: Learning Through Practice"
- Frame simulations as low-risk training grounds
- Emphasize development as process, not talent reveal
- Normalize "trying and learning" vs. "getting it right"

**Key addition**: Growth mindset + safe experimentation

---

### Phase 6: Create Referents Documentation
**File**: `/docs/REFERENTS-GUIDE-FOR-DEVELOPERS.md`

Documentation for teams that include:
- What Hidden Brain means in DTC context
- What Adam Grant means in DTC context
- How to recognize adherence to each
- Red flags for when referents are violated

**Audience**: Developers, AI trainers, content creators

---

### Phase 7: Integrate into Brandie Sensei Coherence Test
**File**: `/lib/brandie-coherence-test.ts`

Add referent alignment checks:
- Verify A1/A4 responses align with Hidden Brain principles
- Verify A2/A3 responses align with Adam Grant principles
- Flag responses that contradict referent philosophy
- Create "referent compliance" metric

**Deliverable**: Enhanced coherence detection that validates referent integrity

---

## Implementation Details by Phase

### Phase 1 Priority: Create Reference Architecture
```typescript
// /lib/dtc-referents-framework.ts
export const DTC_REFERENTS = {
  hiddenBrain: {
    pillars: ["a1", "a4"],
    principles: [
      "Explanation before prescription",
      "Context > trait",
      "Invisible patterns make visible",
      "Narratives as cognitive tool",
      "Desnormalización del juicio"
    ]
  },
  adamGrant: {
    pillars: ["a2", "a3"],
    principles: [
      "Constant rethinking",
      "Development as process",
      "Real-world application",
      "Adult practical language",
      "Learning through practice"
    ]
  }
}
```

---

## Implementation Timeline

| Phase | Priority | Effort | Impact |
|-------|----------|--------|--------|
| 1. Referents Framework | 🔴 HIGH | 2h | Foundation for all others |
| 2. A1 Enhancement | 🟡 MEDIUM | 1h | Clarifies explanation focus |
| 3. A4 Enhancement | 🟡 MEDIUM | 1h | Strengthens context translation |
| 4. A2 Enhancement | 🟡 MEDIUM | 1h | Emphasizes flexibility |
| 5. A3 Enhancement | 🟡 MEDIUM | 1h | Normalizes experimentation |
| 6. Developer Docs | 🟢 LOW | 1.5h | Knowledge transfer |
| 7. Coherence Integration | 🔴 HIGH | 2h | Quality assurance |

**Total effort**: ~9-10 hours | **Impact**: 100% referent integrity

---

## Success Criteria

✅ All coach prompts explicitly reference their referent  
✅ Coherence test validates referent alignment  
✅ Developer documentation accessible and clear  
✅ No coach response violates its referent principles  
✅ Training materials reflect referent philosophy  

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Over-explicit referents make responses feel robotic | Use referents as invisible guide, not explicit mention |
| Inconsistent application across coaches | Centralized framework ensures consistency |
| New team members don't understand philosophy | Developer docs + training materials |
| Referents not validated in quality checks | Brandie Sensei test enforces compliance |

---

## Next Steps

1. **Approve plan structure**
2. **Start Phase 1**: Create `/lib/dtc-referents-framework.ts`
3. **Proceed sequentially** through phases 2-7
4. **Test coherence** at each phase checkpoint
5. **Document learnings** for future maintainers

