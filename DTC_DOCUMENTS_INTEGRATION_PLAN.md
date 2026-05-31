# DTC Documents (A4) Integration Plan

**Status:** Planning Phase  
**Priority:** Critical for Travis Dev Mode Stability  
**Timeline:** 3-4 implementation phases  

---

## Executive Summary

The current A2 experience creates temporary data artifacts scattered across 8+ Supabase tables (candidate_boards, work_memories, value_inventory, cv_bullets, achievement_stories, etc.). This causes cascading failures in dev mode when prerequisite data is missing.

**Solution:** Implement DTC Documents (A4) as the unified document storage layer. This converts A2 from a "form-filling experience" to a "document-building experience" where every day produces a real, persistent, organized artifact.

**Immediate Benefit for Travis Mode:** Instead of seeding 8 fragmented tables, seed one `dtc_documents` table with properly linked documents. Days auto-load their required documents without cascading query failures.

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Document Data Model

Create foundational Supabase table and TypeScript types:

**File:** `lib/documents/types.ts`
```typescript
export type DTCDocumentType = 
  | 'route_contract'           // C1 output
  | 'identity_statement'       // A1 output
  | 'evidence_item'            // C2 items
  | 'cv_draft'
  | 'executive_summary'
  | 'star_answer'
  | 'job_analysis'
  | 'company_research'
  | 'interview_answer'
  | 'coach_feedback'
  | 'application_tracker'
  | 'portfolio_asset'
  | 'reflection'
  | 'uploaded_file'
  | 'final_deliverable'
  | 'daily_mission'             // New: A2 daily artifacts

export type DocumentStatus = 'draft' | 'in_review' | 'needs_revision' | 'approved' | 'final'

export type DocumentSource = 'user_created' | 'ai_generated' | 'travis_seed' | 'uploaded'

export interface DTCDocument {
  id: string
  user_id: string
  title: string
  type: DTCDocumentType
  source_module: 'c1' | 'a1' | 'c2' | 'a2' | 'a3' | 'a4'
  related_day?: number               // A2 day 1-90
  related_a3_module?: number         // A3 module 1-10
  status: DocumentStatus
  content: string
  ai_summary?: string
  coach_feedback?: string
  tags: string[]
  version: number
  parent_document_id?: string        // Version history
  source: DocumentSource
  created_at: string
  updated_at: string
}
```

**Supabase Table:** `dtc_documents`
```sql
CREATE TABLE dtc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  type text NOT NULL,
  source_module text NOT NULL,
  related_day int,
  related_a3_module int,
  status text DEFAULT 'draft',
  content text,
  ai_summary text,
  coach_feedback text,
  tags text[],
  version int DEFAULT 1,
  parent_document_id uuid REFERENCES dtc_documents,
  source text NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  
  -- Indexes
  UNIQUE(user_id, type, source_module, related_day)
);

CREATE INDEX idx_dtc_user_id ON dtc_documents(user_id);
CREATE INDEX idx_dtc_related_day ON dtc_documents(related_day);
CREATE INDEX idx_dtc_type ON dtc_documents(type);
CREATE INDEX idx_dtc_status ON dtc_documents(status);
```

### 1.2 Document Engine

**File:** `lib/documents/document-engine.ts`

Core functions for CRUD, querying, and status management.

### 1.3 Travis Seeding for A4

**File:** `lib/documents/travis-seed-documents.ts`

Pre-configured document templates including:
- Contrato de Ruta Profesional (Day 1)
- Bóveda de Evidencia Inicial (Day 2-8)
- CV Drafts (Days 21-30)
- Job Analysis (Days 35-40)
- Interview Answers (Days 43-60)
- Final Portfolio Assets (Days 80-90)

### 1.4 Update Route Engine

Modify `lib/route-engine.ts`:
- Add A4 document checks to `canCompleteA2Day()`
- Add `ensureA2DayDocuments()` for Travis auto-seeding
- Link A3 module access to document requirements

---

## Phase 2: A2 Integration (Week 2-3)

### 2.1 Map A2 Days to Required Documents

Create `lib/documents/a2-document-requirements.ts` mapping each of 90 days to:
- Required document type
- Template name
- Description

### 2.2 Update A2 Day Components (Days 1-30)

Replace Supabase queries with document queries:
- `getMarketSignals()` → `getDocumentsByDay(userId, dayNumber)`
- `getCandidateBoard()` → `getDocumentsByType(userId, 'daily_mission')`
- Parse document content instead of table rows

### 2.3 Update Day Completion Logic

Day cannot complete unless:
1. Required A4 document exists
2. Document has content (minimum 100 chars)
3. Document status is 'approved' or 'final'

### 2.4 Update Travis Seeding

Replace table-specific seeding with unified document seeding:
- One `seedTravisDocuments(userId)` call
- Automatically creates all 90 day documents + A3 documents
- Each document properly linked with `related_day` and `source: 'travis_seed'`

---

## Phase 3: A3 & Coach Integration (Week 3-4)

### 3.1 A3 Module Document Requirements

Map A3 modules 1-10 to:
- Required input documents (type and day)
- Documents produced (interview transcripts, feedback)

### 3.2 A3 Before Module Starts

Module checks for required documents:
- If missing in Production: Show "Complete Days X-Y first"
- If missing in Travis: Auto-seed required documents

### 3.3 A3 After Module Completes

Save results as documents:
- Interview transcript → type: `interview_answer`
- Feedback summary → type: `coach_feedback`
- Score & improvements → tags and metadata

---

## Phase 4: UI & Portfolio (Week 4)

### 4.1 A4 Main Page

`app/despega/a4/documents/page.tsx`:
- Document collections: Route, Evidence, CV, STAR Bank, Jobs, Interviews, Coach, Portfolio
- Table with: Title, Type, Day, Status, Updated, Source
- Filters: All/Draft/Needs Revision/Approved/Final/Created by A2/Seeded

### 4.2 Document Editor

`components/a4-document-editor.tsx`:
- Rich text editor or textarea (MVP)
- Coach feedback panel on right
- Status dropdown (Draft → Approved → Final)
- Related day/module display
- Version history

### 4.3 Portfolio Builder

Let users select documents for "Final Portfolio" export.

---

## Integration with Current Travis System

### What Changes

**Current (Broken):**
- Day 3 tries to load from `a2_market_signals` table
- If Day 2 didn't create data, Day 3 query fails
- 8+ tables to seed for 90 days

**New (Fixed):**
- Day 3 queries `dtc_documents` with `related_day: 3`
- If document missing in Travis mode, auto-seed before loading
- 1 table to seed with clear structure

### When to Migrate

**Immediate (to fix current errors):**
1. Create `dtc_documents` table
2. Create document engine
3. Create Travis seed function
4. Update Days 2-21 to query documents instead of specific tables
5. Route engine checks documents for day completion

**Later (cleanup):**
- Remove old `a2_market_signals`, `a2_candidate_boards`, etc. tables
- Migrate production user data to documents
- Archive old tables

---

## Why This Fixes the Current Problem

**Current Error:** "Failed to load your Day 9 task statements"
- Cause: Day 9 tries to load from `a2_candidate_boards` where Day 4 data should be
- Seeding tried to populate that table, but query still failed

**With DTC Documents:**
- Day 9 queries `dtc_documents` for `related_day: 4` and `type: 'daily_mission'`
- If not found in Travis mode: instantly seed it
- If found: load and display
- No cascading failures because documents are self-contained

**Result:** Travis can open any day 1-90 without errors, documents pre-loaded automatically.

---

## Success Metrics

✅ All 30 day experiences load without errors in Travis mode  
✅ Each day clearly shows which document(s) it creates  
✅ A4 documents page shows all seeded documents  
✅ Day completion requires approved documents  
✅ A3 modules load required documents without errors  
✅ Portfolio can be built from created documents  

---

## Implementation Checklist

**Phase 1 - Foundation**
- [ ] Create `dtc_documents` Supabase table
- [ ] Create `lib/documents/types.ts`
- [ ] Create `lib/documents/document-engine.ts`
- [ ] Create `lib/documents/travis-seed-documents.ts`
- [ ] Update `route-engine.ts` with document checks

**Phase 2 - A2 Integration**
- [ ] Create `lib/documents/a2-document-requirements.ts`
- [ ] Update Days 1-10 components to query documents
- [ ] Update Days 11-21 components to query documents
- [ ] Update Days 22-30 components to query documents
- [ ] Verify all day experiences work without errors

**Phase 3 - A3 Integration**
- [ ] Create `lib/documents/a3-document-requirements.ts`
- [ ] Update A3 modules to load required documents
- [ ] Update A3 modules to save documents after completion

**Phase 4 - UI**
- [ ] Build `a4/documents` main page
- [ ] Build `a4/documents/[documentId]` editor
- [ ] Build portfolio builder

