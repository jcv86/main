# A2 90-Day Implementation Roadmap

**Document**: Current state of 90-day journey + next steps  
**Updated**: May 14, 2026

---

## ✅ COMPLETE: Full 90-Day Structure

All 90 days are fully configured with:

1. **A2_DAYS Configuration** (`/lib/a2-days-config.ts`)
   - 90 day entries (days 1-90)
   - Each with: title, subtitle, description, phase, tasks, goals, action items, notion template, estimated hours
   - 4 phases: Clarity (1-10), Material (11-30), Real Action (31-60), Refinement (61-90)

2. **Page Routes** (`/app/despega/a2/dia-{1-90}/page.tsx`)
   - 90 individual page files
   - Each with correct DIA_NUM variable
   - All pulling dynamically from A2_DAYS config
   - All with proper navigation (prev/next)

3. **Dynamic Rendering**
   - Header: Day number, phase badge, estimated time
   - Tasks section: Numbered list from config
   - Learning goals: Bulleted from config
   - Action items: Bulleted from config
   - Notion template link: If URL configured
   - Complete button: A2CompleteDayButton component
   - Navigation: Previous/Next day buttons

---

## ⚙️ IN PROGRESS: Day 1 Special Implementation

### Day 1 Current State
- **Location**: `/app/despega/a2/dia-1/page.tsx`
- **Status**: ~80% complete
- **Current Feature**: Opens modal on page load
- **Modal Component**: `<A2Day1Modal>` imported but not yet fully integrated

### Day 1 Needed (7-Step Modal)

**Step 1: Vision Questions** ✅ Component exists
- 3 text inputs for professional vision
- Uses enhanced input with coach assist
- File: `/components/a2-day1-step1-vision.tsx`

**Step 2: Coach Enhancement** ✅ Component exists
- Shows original + enhanced version
- Accept/Edit/Regenerate flow
- File: `/components/a2-day1-step2-coach.tsx`

**Step 3: Define Milestones** ✅ Component exists
- 3 milestone inputs (day 10, 20, 30)
- Coach enhancement included
- File: `/components/a2-day1-step3-milestones.tsx`

**Step 4: Action Plan** ✅ Component exists
- 4 action categories (apps, networking, learning, growth)
- Coach assist buttons
- File: `/components/a2-day1-step4-action-plan.tsx`

**Step 5: Save Externally** ✅ Component exists
- Notion + Download options
- File: `/components/a2-day1-step5-external-save.tsx`

**Step 6: Upload** ✅ Component exists
- File upload (drag & drop)
- File: `/components/a2-day1-step6-upload.tsx`

**Step 7: Analysis** ✅ Component exists
- AI analysis + scoring (0-100)
- Pass/fail determination
- File: `/components/a2-day1-step7-analysis.tsx`

### Missing: APIs for Day 1

| API | Purpose | Status |
|-----|---------|--------|
| `/api/a2/day1/coach-enhance` | LLM enhancement of answers | ❌ Not implemented |
| `/api/a2/day1/upload` | File upload to Blob | ❌ Not implemented |
| `/api/a2/day1/analyze` | Document parsing + DTC scoring | ❌ Not implemented |
| `/api/a2/day1/save-submission` | Save submission to database | ❌ Not implemented |

### Missing: Database Table for Day 1

**Table**: `a2_day1_submissions`
```sql
CREATE TABLE a2_day1_submissions (
  id uuid PRIMARY KEY,
  user_id uuid,
  vision_answers jsonb,
  coach_enhanced_vision text,
  milestones jsonb,
  coach_enhanced_milestones jsonb,
  action_plan jsonb,
  coach_enhanced_action_plan jsonb,
  uploaded_file_path text,
  uploaded_file_name text,
  dtc_analysis jsonb,  -- { score, passed, feedback, strengths, improvements }
  completion_step int,
  completed_at timestamp,
  created_at timestamp,
  updated_at timestamp
)
```

---

## ⏸️ NOT YET STARTED: A3 Integration

### Current A3 State
- A3 main page exists: `/app/despega/a3/page.tsx`
- Shows 10 modules with XP tracking
- Modules: locked/available/in_progress/completed states

### Missing A3 Integration with A2 Day 1

**Current Issue**: 
- A3 modules available immediately
- Should be locked until A2 Day 1 completion + DTC pass (score ≥75)

**Required Changes**:

1. **Check Day 1 Pass in A3 API**
   ```typescript
   // In /api/a3/user-progress
   const { data: day1 } = await supabase
     .from('a2_day1_submissions')
     .select('dtc_analysis')
     .eq('user_id', userId)
     .eq('completion_step', 7)
     .single()
   
   const day1Passed = day1?.dtc_analysis?.passed === true
   
   if (!day1Passed) {
     // Lock all A3 modules
     return { moduleStates: { ...lockedStates } }
   }
   ```

2. **Update A2 Progress on Day 1 Pass**
   ```typescript
   // Update a2_user_route_progress
   if (day1Score >= 75) {
     await supabase
       .from('a2_user_route_progress')
       .update({ dia_actual: 2 })  // Unlock Day 2
       .eq('user_id', userId)
   }
   ```

---

## 📋 DETAILED WORK BREAKDOWN

### Phase A: Core Day 1 APIs (2-3 hours)
1. **Coach Enhancement API**
   - Input: vision/milestone/action plan text
   - Use: Groq API (or Claude via Gateway)
   - Output: Enhanced version + suggestions
   - File: Create `/api/a2/day1/coach-enhance/route.ts`

2. **File Upload API**
   - Input: File multipart upload
   - Use: Vercel Blob storage
   - Output: File path + name
   - File: Create `/api/a2/day1/upload/route.ts`

3. **Analysis API**
   - Input: File path (or submission ID)
   - Use: LLM to parse + score document
   - Output: { score: 0-100, passed: bool, analysis, strengths, improvements }
   - File: Create `/api/a2/day1/analyze/route.ts`

### Phase B: Day 1 Database (1 hour)
1. Create `a2_day1_submissions` table in Supabase
2. Add RLS policies for user isolation
3. Create index on user_id + completion_step

### Phase C: Day 1 Auto-Completion (1 hour)
1. Wire up "Complete Day" button on day-2
2. Update `a2_user_route_progress.dia_actual = 2`
3. Trigger A3 module unlock

### Phase D: A3 Locking Logic (1-2 hours)
1. Update `/api/a3/user-progress` to check Day 1
2. Lock all A3 modules if Day 1 not passed
3. Show "Complete Day 1 to unlock" message in A3

### Phase E: Testing & Polish (1-2 hours)
1. Test Day 1 flow end-to-end
2. Test API error handling
3. Test A3 lock/unlock
4. Test progress persistence across page reloads

---

## 🎯 IMMEDIATE NEXT STEPS

### Priority 1 (Today/Tomorrow)
- [ ] Create `/api/a2/day1/coach-enhance` endpoint
- [ ] Create `/api/a2/day1/upload` endpoint  
- [ ] Create `a2_day1_submissions` table
- [ ] Wire up modal form submission flow

### Priority 2 (Next few days)
- [ ] Create `/api/a2/day1/analyze` with DTC scoring logic
- [ ] Implement A3 lock/unlock based on Day 1 pass
- [ ] Test Day 1 complete flow (vision → upload → score → pass)
- [ ] Wire up A2 Day 2 auto-unlock on Day 1 pass

### Priority 3 (Polish)
- [ ] Error handling for failed uploads
- [ ] Retry logic for failed API calls
- [ ] User feedback (toast notifications)
- [ ] Analytics tracking (Day 1 submissions, pass rates)

---

## 🔗 RELATED FILES TO UNDERSTAND

**Configuration**:
- `/lib/a2-days-config.ts` - All 90-day definitions

**Page Templates**:
- `/app/despega/a2/dia-1/page.tsx` - Day 1 special case
- `/app/despega/a2/dia-2/page.tsx` - Standard day template

**Components**:
- `/components/a2-day1-modal.tsx` - Modal orchestrator
- `/components/a2-day1-step*.tsx` - 7 step components (1-7)
- `/components/a2-enhanced-input.tsx` - Input with coach assist

**Existing APIs (reference)**:
- `/api/a3/user-progress/route.ts` - Pattern for fetching progress
- `/api/a3/save-module-progress/route.ts` - Pattern for saving progress

**Database**:
- Check RLS policies on existing a2/a3 tables for pattern
- Tables: `a2_user_route_progress`, `a3_user_progress`, `auth_users`

---

## 📊 COMPLETION METRICS

### Current
- ✅ Configuration: 100% (90/90 days configured)
- ✅ Page Routes: 100% (90/90 pages created)
- ⚠️ Day 1 Logic: 50% (components exist, APIs missing)
- ❌ A3 Integration: 0% (not yet locked to Day 1)
- ❌ Progress Persistence: 0% (form state not saved between sessions)

### After Phase A+B (APIs + Database)
- ✅ Configuration: 100%
- ✅ Page Routes: 100%
- ✅ Day 1 Logic: 80% (APIs working, some polish needed)
- ⚠️ A3 Integration: 50% (locking logic written, needs testing)
- ⚠️ Progress Persistence: 50% (database ready, auto-save needed)

### After Phase C+D+E (Complete Implementation)
- ✅ Configuration: 100%
- ✅ Page Routes: 100%
- ✅ Day 1 Logic: 95% (fully functional, edge cases handled)
- ✅ A3 Integration: 100% (locked/unlocked based on Day 1)
- ✅ Progress Persistence: 95% (auto-save, resume functionality)

---

## 💡 KEY DESIGN DECISIONS

1. **All days use same template** - Makes it maintainable but requires config-driven content
2. **Day 1 is modal, not separate page** - Keeps user on same page, all progress tracked
3. **A3 locked until Day 1 passes** - Ensures users build foundation before skills training
4. **Auto-unlock Day 2 on Day 1 pass** - Progressive disclosure of days
5. **Notion templates per day** - External documentation flexibility
6. **Estimated hours per day** - User expectations + time tracking

---

## 🚀 VISION: Final State

Once complete, users will:

1. **Days 1-10**: Build clarity on professional direction
2. **Days 11-30**: Create all professional materials
3. **Days 31-60**: Execute active search, participate in interviews, negotiate offers
4. **Days 61-90**: Successfully onboard (or continue intensive search)
5. **Throughout**: Unlock A3 learning modules for skill building

**Day 1 Specifically**:
- Answer 3 vision questions
- Get AI coach enhancements
- Define 3 milestones (10/20/30 days)
- Create action plan in 4 categories
- Upload roadmap document
- Get analyzed by DTC AI (score 0-100)
- Unlock Day 2 if score ≥75
- Unlock A3 modules once passed

---

## 📞 Questions for Implementation

1. **Coach Prompt**: What should enhance function emphasize? (clarity? specificity? measurability?)
2. **DTC Scoring**: What exact rubric for 4 criteria? (vision clarity 0-25, milestone quality 0-25, etc.)
3. **LLM Choice**: Groq for speed? Claude for quality? OpenAI for reliability?
4. **File Sizes**: Max upload file size? (typically 10-50MB for PDFs)
5. **Retries**: How many upload attempts? (typically 3-5)
6. **Timeout**: LLM analysis timeout? (typically 30-60 seconds)

---

## 📝 Document Status

**Complete**: ✅ 90-day configuration and page structure  
**In Progress**: ⚠️ Day 1 modal and APIs  
**Not Started**: ❌ A3 integration and full testing  

**Ready for**: API implementation phase

