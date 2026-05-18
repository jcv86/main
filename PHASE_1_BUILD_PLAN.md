# PHASE 1 - IMMEDIATE IMPLEMENTATION PLAN (Days 1-2)
## A2 Adventure: LA INVESTIGACIÓN DE FUNDAMENTOS

### STRATEGIC APPROACH (To minimize rework and maximize velocity)

**Keep**: Existing Day 1 backend, state management, upload logic, scoring logic
**Update**: Content, UX messaging, styling, validation rules, external roadmap generation
**Build New**: Day 2 Evidence Vault experience (completely new)
**Refactor**: Component names + structure to match new "Contract Route" narrative

---

## TASK 1: Refactor Day 1 → "El Contrato de Ruta"
**Estimated**: 4-6 hours

### Components to Update:
1. `a2-day1-experience.tsx` → Keep state mgmt, add scoring logic
2. `a2-day1-step1-vision.tsx` → Update to "3 Question Vision Scan"
3. NEW `a2-day1-step2-hypothesis.tsx` → Coach creates route hypothesis
4. NEW `a2-day1-step3-gates.tsx` → Define 3 route gates (Identity/Evidence/Material)
5. NEW `a2-day1-step4-roadmap.tsx` → Generate external roadmap document
6. `a2-day1-step5-external-save.tsx` → Keep (download/export)
7. `a2-day1-step6-upload.tsx` → Refactor to accept roadmap uploads
8. NEW `a2-day1-step7-scoring.tsx` → Implement 4-dimension scoring (75+ pass)

### Data Structure Changes:
```typescript
// OLD: visionData { role, environment, desiredOutcome }
// NEW: routeData {
//   change30Days: string,
//   targetRole: string,
//   mainBlocker: string,
//   hypothesis: string,
//   gates: { identity: string, evidence: string, material: string },
//   roadmap: string (generated),
//   scores: { clarity, logic, realism, actionability },
//   totalScore: number,
//   passStatus: 'pending' | 'pass' | 'fail'
// }
```

### Styling:
- Respect Day 2 visual (premium dark, A2 purple accents)
- Remove ALL white borders
- Use `rgba(90, 90, 150, 0.2)` for subtle dividers
- Cards with `rgba(90, 90, 150, 0.1)` background

---

## TASK 2: Build Day 2 → "La Bóveda de Evidencia"
**Estimated**: 5-7 hours

### New Components:
1. `a2-day2-intro.tsx` → Premium intro screen
2. `a2-day2-vault-setup.tsx` → 5 vault creation options (Notion/Drive/Local/DTC/Cloud)
3. `a2-day2-evidence-hunt.tsx` → 5-place evidence search with checklist (7+ fragments min)
4. `a2-day2-upload.tsx` → Accept evidence in multiple formats
5. `a2-day2-classification.tsx` → Auto-classify each fragment with AI
6. `a2-day2-gold-pieces.tsx` → Show 3 best pieces with potential CV/STAR/Skills
7. `a2-day2-completion.tsx` → Summary + pass/fail

### Data Structure:
```typescript
interface EvidenceVault {
  vaultType: 'notion' | 'drive' | 'local' | 'dtc' | 'cloud',
  vaultLink: string,
  fragments: EvidenceFragment[],
  goldPieces: EvidenceFragment[], // top 3
}

interface EvidenceFragment {
  id: string,
  rawText: string,
  type: 'achievement' | 'responsibility' | 'recognition' | 'number' | 'other',
  categories: string[],
  potentialCV: string,
  potentialSTAR: { situation, task, action, result },
  potentialSkills: string[],
}
```

### Styling:
- Match Day 2 exactly (premium, no white)
- Dark cards with purple tint
- Smooth animations for classification
- Success states in teal `rgb(80, 160, 170)`

---

## TASK 3: Supporting Infrastructure
**Estimated**: 2-3 hours

### New API Endpoints:
1. `POST /api/a2/day1-score` → Validate + score roadmap (4 dimensions)
2. `POST /api/a2/day2-classify` → Classify evidence fragments (use OpenAI or rules-based)
3. `POST /api/a2/day1-roadmap-generate` → Generate external roadmap template
4. `GET /api/a2/day1-completion` → Get Day 1 status

### Database Changes:
New tables (to Supabase):
- `a2_user_roadmaps` (routes, scores, gates, hypothesis)
- `a2_evidence_vaults` (vault configs, links, metadata)
- `a2_evidence_fragments` (raw evidence with classifications)
- `a2_day_submissions` (progress tracking)

### Coach Integration:
- Extend `/api/a2/coach-assist` to support roadmap hypothesis generation
- Use context from A1 (if exists) to personalize feedback

---

## TASK 4: Styling Polish
**Estimated**: 1-2 hours

- Verify NO white borders anywhere
- Consistent A2 purple (`rgb(90, 90, 150)`) usage
- Teal success states (`rgb(80, 160, 170)`)
- Dark backgrounds (`#1a1a2e` or `#0f0f1e`)
- Premium shadows and rounded corners (12-16px)
- Mobile responsive (768px breakpoint)

---

## TASK 5: Integration Testing
**Estimated**: 1-2 hours

- E2E: Login → Day 1 complete → Day 2 complete
- Verify Day 1 pass (75+) unlocks Day 2
- Verify Day 2 complete unlocks Day 3
- A3 stays locked through Days 1-2
- XP awarded correctly (50 per day)
- All styling matches premium brand

---

## TOTAL PHASE 1 ESTIMATE
- **Build Time**: 13-20 hours
- **Testing**: 2-3 hours
- **Total**: 15-23 hours

---

## IMMEDIATE NEXT STEPS (User Approval Needed):

1. **Approve Data Structure Changes** → Ready to refactor Day 1 state
2. **Confirm Vault Options** → 5 options shown above (or different?)
3. **Confirm Scoring Algorithm** → 4 dimensions × 25pts each (or different weights?)
4. **Database Schema** → Create tables in Supabase?

### THEN WE BUILD:
- Day 1 refactored + working with new "Contract Route" flow
- Day 2 fully built with Evidence Vault experience
- All APIs and database ready
- Styling polished to premium standard
- E2E testing complete

---

**READY TO PROCEED?** Confirm above or request modifications.
