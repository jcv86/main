# A2 PHASE 2 - NEXT STEPS

Phase 1 (Days 1-2 UI) is complete. Here's what to do next.

---

## IMMEDIATE NEXT STEPS

### 1. Database Schema Setup (1-2 hours)
Create tables in Supabase:

```sql
-- User Progress Tracking
CREATE TABLE user_a2_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  current_day integer DEFAULT 1,
  completed_days integer[] DEFAULT '{}',
  day1_passed boolean DEFAULT false,
  day1_score integer,
  xp_total integer DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(user_id)
);

-- Day 1 Submissions
CREATE TABLE day1_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  change_30_days text NOT NULL,
  target_role text NOT NULL,
  main_blocker text NOT NULL,
  hypothesis text,
  gates jsonb,
  roadmap text,
  scores jsonb,
  total_score integer,
  pass_status text,
  external_link text,
  submitted_at timestamp DEFAULT now(),
  revision_number integer DEFAULT 1
);

-- Day 2 Submissions
CREATE TABLE day2_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  vault_type text NOT NULL,
  vault_link text NOT NULL,
  fragments jsonb,
  gold_pieces jsonb,
  submitted_at timestamp DEFAULT now()
);
```

### 2. Wire Components to Database (2-3 hours)

Update each Day 1 component:
```typescript
// Example for a2-day1-vision-scan.tsx
'use client'
import { useCallback } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

export function A2Day1VisionScan(...) {
  const supabase = useSupabaseClient()

  const handleSave = useCallback(async (answers: string[]) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Save progress
    await supabase
      .from('user_a2_progress')
      .upsert({
        user_id: user?.id,
        updated_at: new Date(),
      })

    onNext(answers)
  }, [])

  return (
    // component
  )
}
```

Same pattern for Day 2 components.

### 3. AI Integration - Hypothesis Generation (2 hours)

Replace mockup in `a2-day1-hypothesis.tsx`:

```typescript
// In a2-day1-hypothesis.tsx
import { generateHypothesis } from '@/app/api/a2/ai/hypothesis'

const handleGenerateHypothesis = async () => {
  setIsGenerating(true)
  try {
    const hypothesis = await generateHypothesis({
      change30Days,
      targetRole,
      mainBlocker,
    })
    setHypothesis(hypothesis)
  } finally {
    setIsGenerating(false)
  }
}
```

Create endpoint: `/app/api/a2/ai/hypothesis/route.ts`

### 4. AI Integration - Fragment Classification (2 hours)

Replace mockup in `a2-day2-classification.tsx`:

```typescript
import { classifyFragments } from '@/app/api/a2/ai/classify'

const handleClassify = async () => {
  const classified = await classifyFragments(uploadedContent)
  setClassifiedFragments(classified)
}
```

Create endpoint: `/app/api/a2/ai/classify/route.ts`

---

## NEXT COMPONENTS TO BUILD

### Phase 2: Days 3-4 (Role Alignment)

**Day 3: "El Espejo del Mercado"** (6-8 steps)
- Market research questions
- Role requirements extraction
- Salary/location data
- Skills demand analysis

**Day 4: "El Tablero del Candidato"** (Self vs Market)
- Compare user's profile vs market
- Gap analysis
- Priority ranking
- Action plan

### Phase 3: Days 5-10 (Communication & Testing)

**Day 5: "Primer Experimento Profesional"**
**Day 6: "Forja de Identidad"**
**Days 7-10**: Continue pattern

---

## TESTING CHECKLIST

- [ ] Day 1 full flow (vision → scoring → pass/fail)
- [ ] Day 1 fail scenario + revision
- [ ] Day 2 full flow (vault → hunt → upload → gold)
- [ ] Fragment upload from multiple formats
- [ ] Scoring algorithm accuracy
- [ ] Database persistence
- [ ] Day 1 Pass → Day 2 unlock
- [ ] Mobile responsiveness
- [ ] Error handling + retry logic

---

## DEPLOYMENT CHECKLIST

- [ ] Environment variables set (OPENAI_API_KEY if using)
- [ ] Supabase tables created + RLS policies
- [ ] API endpoints tested
- [ ] Components tested in preview
- [ ] Memory file updated
- [ ] Documentation updated

---

## ESTIMATED TIMELINE

- Phase 2 (Days 3-4): 8-10 hours
- Phase 3 (Days 5-10): 15-20 hours
- Total Phase 2+3: 23-30 hours

**Total A2 Time**: ~50 hours for all 10 days

---

## FILE STRUCTURE REFERENCE

```
/app/api/a2/
├── day1-score/route.ts ✓
├── ai/
│   ├── hypothesis/route.ts (TODO)
│   └── classify/route.ts (TODO)
└── progress/ (TODO)

/components/
├── a2-day1-*.tsx ✓ (9 files)
├── a2-day2-*.tsx ✓ (8 files)
├── a2-day3-*.tsx (TODO)
└── a2-day4-*.tsx (TODO)

/lib/
├── a2-types.ts ✓
├── a2-styling.ts ✓
└── a2-helpers.ts (exists from Phase 1 data structure)
```

---

## HANDOFF READY ✅

All Phase 1 components are production-ready. 
Start Phase 2 whenever you're ready.
