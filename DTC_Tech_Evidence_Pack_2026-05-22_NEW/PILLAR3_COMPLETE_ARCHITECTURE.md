# Pillar 3 - Complete Architecture & Implementation Plan
## One Strong Logic & Structure for All 10 Modules

---

## Executive Summary

**Goal:** Replace all mock modules with a unified, content-agnostic module system that supports:
- ✅ Lectures (video + text content)
- ✅ Tests (multiple choice, free response, scoring)
- ✅ Interviews (recorded video, real-time feedback)
- ✅ Practical Tasks (exercises, code, analysis tasks)
- ✅ Simulations (multi-stage, mixed interactions)

**Approach:** Build ONE reusable module framework + content configuration system
**Result:** Consistent UX, real functionality, database-backed content, proper XP tracking

---

## Part 1: Unified Module Architecture

### Core Module Structure

Every module follows this pattern:

```
Module = {
  id: string                    // 'metodo-star', 'simulacion-real'
  name: string                  // Display name
  description: string           // What this module teaches
  level: 1-4                     // Difficulty level
  xp: number                     // XP reward (70, 120, or 40)
  estimatedDuration: number      // Minutes to complete
  
  // Content sections - can have multiple types
  sections: Array<Section>       // See Section definition below
  
  // Evaluation rules
  passingScore: number           // % needed to pass
  allowRetakes: boolean
  
  // Unlocking rules
  prerequisites: string[]        // Module IDs required before this
  nextModule: string             // Module to unlock after completion
}

Section = {
  id: string                     // 'intro', 'test-1', 'interview'
  type: 'lecture' | 'test' | 'interview' | 'task' | 'simulation'
  title: string
  description: string
  content: ContentType           // Type depends on section.type
  scoring: ScoringRule
  required: boolean              // Must complete to pass module
}
```

### Content Types

#### 1. **Lecture** (Video + Optional Text)
```typescript
type LectureContent = {
  videoUrl: string               // Vercel Blob or external URL
  duration: number               // seconds
  subtitles?: string
  transcript?: string
  slides?: string[]              // Image URLs
  learningObjectives: string[]
  keyPoints: string[]
  resources?: Array<{ title: string; url: string }>
}
```

#### 2. **Test** (Questions with Evaluation)
```typescript
type TestContent = {
  questions: Question[]
  timeLimit?: number             // seconds (null = no limit)
  randomizeOrder: boolean
  passingScore: number           // %
  showCorrectAnswersImmediately: boolean
}

type Question = {
  id: string
  type: 'multiple-choice' | 'free-response' | 'code' | 'matching'
  question: string
  options?: string[]             // For multiple-choice
  correctAnswer: string | string[] | { code: string; tests: string[] }
  explanation: string
  points: number
  hints?: string[]
}
```

#### 3. **Interview** (Video Recording + AI Evaluation)
```typescript
type InterviewContent = {
  scenario: string               // What the interviewer will ask
  prompt: string                 // Question/instructions for user
  interviewerName?: string
  videoPrompt?: string           // Optional video of interviewer asking Q
  recordingTime: number          // seconds max
  evaluationRubric: {
    criteria: Array<{
      name: string
      weight: number             // 0-100
      description: string
    }>
  }
}
```

#### 4. **Task** (Practical Assignment)
```typescript
type TaskContent = {
  instructions: string           // What to do
  files?: Array<{                // Optional starter files
    name: string
    content: string
  }>
  submissionType: 'text' | 'file' | 'link' | 'url'
  evaluationCriteria: string[]
  rubric?: RubricScoring
  resources?: string[]           // Links to docs/examples
}
```

#### 5. **Simulation** (Multi-Stage Scenario)
```typescript
type SimulationContent = {
  title: string
  scenario: string               // Context/story
  stages: Stage[]                // Sequential steps
  totalDuration: number          // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

type Stage = {
  id: string
  type: 'lecture' | 'test' | 'interview' | 'task'
  content: LectureContent | TestContent | InterviewContent | TaskContent
  passingScore?: number
  feedback?: string
}
```

### Scoring & Evaluation

```typescript
type ScoringRule = {
  method: 'auto' | 'llm' | 'manual' | 'mixed'
  
  // Auto-scoring (tests)
  autoScoringLogic?: (userAnswer: string) => number
  
  // LLM-scoring (interviews, free-response)
  llmRubric?: {
    criteria: Array<{ name: string; weight: number }>
    instructions: string
  }
  
  // Manual (admin review)
  requiresManualReview: boolean
  
  // Points mapping
  maxPoints: number
  passingPoints: number
}
```

---

## Part 2: The 10 Modules - Detailed Architecture

### Module 1: **Auditoría Inicial** (Entry Point)
- **Type:** Interview-based diagnostic
- **Content:** 
  - Lecture: Introduction video (3-5 min)
  - Interview: Initial interview recording (15-20 min)
- **Scoring:** LLM evaluates across 5 competencies
- **XP:** 70
- **Structure:**
  ```
  Sections:
    1. Lecture: "Bienvenida a Pillar 3"
    2. Interview: "Cuéntame sobre ti"
    3. Test: 5-question quick assessment
  ```

### Module 2: **Método STAR** (Framework Teaching)
- **Type:** Lecture + Practice + Test
- **Content:**
  - Lecture: STAR framework video + slides (5 min)
  - Task: Analyze 3 provided stories using STAR
  - Test: 5 STAR analysis questions
  - Interview: Record your own STAR response
- **Scoring:** 
  - Task: LLM evaluates structure (50 points)
  - Test: Auto-scoring MCQ (30 points)
  - Interview: LLM evaluates quality (20 points)
- **XP:** 120
- **Requirements:** Pass test (70%) + complete interview

### Module 3: **CV Inteligente** (ALREADY REAL - Keep Existing)
- **Type:** Content Analysis Tool
- **Status:** Fully implemented ✅
- **XP:** 120

### Module 4: **Análisis de Vacante** (Job Analysis)
- **Type:** Task + Analysis + Test
- **Content:**
  - Lecture: "How to analyze job postings" (3 min)
  - Task: Analyze provided job posting (extract key skills)
  - Test: Match skills to job requirements (10 questions)
  - Interview: Discuss your top 3 gaps in skills for the role
- **Scoring:**
  - Task: LLM grades completeness (40 points)
  - Test: Auto-score matching (40 points)
  - Interview: LLM evaluates self-awareness (20 points)
- **XP:** 120
- **Requirements:** Task completion + 70% test score

### Module 5: **Análisis Multimodal** (ALREADY REAL - Keep Existing)
- **Type:** Video Recording + AI Analysis
- **Status:** Fully implemented ✅
- **XP:** 120

### Module 6: **Entrenamiento Guiado** (Guided Lessons)
- **Type:** Multi-lesson lecture + task progression
- **Content:**
  - Lecture 1: Interview fundamentals (5 min video)
  - Lecture 2: Body language & non-verbals (5 min video)
  - Lecture 3: Listening & clarifying (5 min video)
  - Task for each lecture (small practical exercise)
  - Interview: Demonstrate learnings
- **Scoring:** Cumulative
  - Each lecture task: LLM grades (20 points each)
  - Final interview: LLM evaluates application (40 points)
- **XP:** 120
- **Requirements:** Complete all 3 lessons + final interview

### Module 7: **Entrenamiento Estructurado** (Practice Questions)
- **Type:** Test + Interview practice
- **Content:**
  - Lecture: "Common interview questions & how to answer" (5 min)
  - Test 1: 10 MC questions about common mistakes (10 questions)
  - Interview Set 1: 3 recorded answers to hard questions (15 min total)
  - Interview Set 2: 3 different hard questions (15 min total)
- **Scoring:**
  - Test: Auto-score (30 points)
  - Interview Set 1: LLM grades using STAR framework (35 points)
  - Interview Set 2: LLM grades (35 points)
- **XP:** 120
- **Requirements:** 70% test + complete both interview sets

### Module 8: **Entrenamiento Desafiante** (ALREADY REAL - Keep Existing)
- **Type:** Real-time Video Interview Training
- **Status:** Fully implemented ✅
- **XP:** 120

### Module 9: **Entrenamiento Conversacional** (Dialogue Practice)
- **Type:** Simulated conversation + reflection
- **Content:**
  - Lecture: "Natural conversation in interviews" (5 min)
  - Simulation Stage 1: Mock recruiter conversation (10 questions, 20 min)
  - Reflection Task: Write how you could improve (5 min)
  - Simulation Stage 2: Second interview with different recruiter (15 questions, 25 min)
- **Scoring:**
  - Stage 1: LLM grades fluency, naturalness (40 points)
  - Reflection: LLM evaluates self-awareness (20 points)
  - Stage 2: LLM grades improvement (40 points)
- **XP:** 120
- **Requirements:** Complete both simulations + reflection

### Module 10: **Simulación Real** (Capstone)
- **Type:** Full interview simulation (60 min comprehensive)
- **Content:**
  - Lecture: "What to expect in a real interview" (3 min)
  - Simulation Stages:
    1. **Phone Screen** (10 min - casual questions)
    2. **Technical/Role Questions** (15 min - STAR-based)
    3. **Behavioral Round** (20 min - mixed questions)
    4. **Q&A Round** (10 min - your questions for interviewer)
    5. **Reflection** (5 min - submit written analysis)
  - Report: Comprehensive feedback on all areas
- **Scoring:**
  - All stages: LLM evaluates (80 points)
  - Reflection: LLM grades insights (20 points)
- **XP:** 40 (final capstone, lower XP)
- **Requirements:** Complete all 5 stages

---

## Part 3: Technical Implementation

### Database Schema

```sql
-- Module metadata
CREATE TABLE a3_modules (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  level INT,
  xp INT,
  estimated_duration_min INT,
  passing_score INT DEFAULT 70,
  prerequisites TEXT[], -- JSON array of module IDs
  next_module VARCHAR,
  content JSONB NOT NULL,  -- Full content structure
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- User progress
CREATE TABLE a3_module_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  module_id VARCHAR REFERENCES a3_modules,
  status VARCHAR, -- 'not_started' | 'in_progress' | 'completed' | 'failed'
  current_section_id VARCHAR,
  section_scores JSONB, -- { 'section-1': 85, 'section-2': 92 }
  final_score INT,
  attempts INT DEFAULT 0,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Individual responses for manual review/scoring
CREATE TABLE a3_responses (
  id UUID PRIMARY KEY,
  user_id UUID,
  module_id VARCHAR,
  section_id VARCHAR,
  response_type VARCHAR, -- 'text' | 'audio' | 'video' | 'file'
  response_data JSONB, -- { videoUrl, transcription, fileUrl, etc }
  llm_score INT,
  llm_feedback TEXT,
  manual_score INT,
  manual_feedback TEXT,
  requires_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

-- Completed modules for XP tracking
CREATE TABLE a3_completed_modules (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  module_id VARCHAR REFERENCES a3_modules,
  xp_earned INT,
  score INT,
  completed_at TIMESTAMP,
  UNIQUE(user_id, module_id)
);
```

### Core APIs

```typescript
// 1. GET /api/a3/modules/:moduleId
// Fetch full module content & structure

// 2. POST /api/a3/module-progress
// Start or resume a module

// 3. POST /api/a3/submit-response
// Submit answer/response to section
// - Auto-scores tests
// - Calls LLM for interviews/tasks
// - Stores response for review

// 4. POST /api/a3/evaluate-response
// LLM evaluation endpoint
// Input: { rubric, response, responseType }
// Output: { score, feedback, breakdown }

// 5. GET /api/a3/module-progress/:moduleId
// Get user's progress in module

// 6. POST /api/a3/complete-module
// Mark module complete, award XP
```

### LLM Evaluation Integration

Use Claude API with consistent rubric format:

```typescript
type EvaluationRequest = {
  rubric: {
    criteria: Array<{
      name: string
      weight: number
      description: string
      maxPoints: number
    }>
    totalPoints: number
    instructions: string
  }
  response: {
    type: 'text' | 'transcription' | 'interview' // From video transcription
    content: string
  }
  context?: {
    moduleId: string
    sectionId: string
    questionAsked?: string
  }
}

// Claude evaluates and returns:
type EvaluationResponse = {
  totalScore: number        // 0-maxPoints
  criteriaScores: Record<string, number>
  feedback: string
  strengths: string[]
  improvements: string[]
}
```

---

## Part 4: Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1)
- [ ] Create database schema
- [ ] Build `/api/a3/evaluate-response` (LLM integration)
- [ ] Create reusable `ModuleFrame` component
- [ ] Implement `LectureSection`, `TestSection`, `TaskSection` components
- [ ] Create module configuration loader

### Phase 2: Content Modules (Weeks 2-3)
- [ ] Replace Module 2 (STAR) - Type: Lecture + Task + Test + Interview
- [ ] Rebuild Module 4 (Vacante) - Type: Lecture + Task + Test + Interview
- [ ] Rebuild Module 6 (Guiado) - Type: Multi-lecture with tasks
- [ ] Rebuild Module 7 (Estructurado) - Type: Test + Interview practice
- [ ] Rebuild Module 9 (Conversacional) - Type: Simulation

### Phase 3: Capstone & Polish (Week 4)
- [ ] Rebuild Module 10 (Real) - Type: Full simulation with 5 stages
- [ ] Add comprehensive scoring dashboard
- [ ] Implement progress tracking across all modules
- [ ] Create reports & performance analytics
- [ ] Testing & QA

---

## Part 5: Key Design Decisions

### Why This Architecture?

| Challenge | Solution |
|-----------|----------|
| "Mockups" everywhere | All content database-backed + LLM evaluated |
| Inconsistent UX | One `ModuleFrame` component + section types |
| No real feedback | Claude API evaluates all responses with rubric |
| XP tracking broken | Each module action updates `a3_completed_modules` |
| Scalability issues | Content in JSONB = easy to add more modules |
| Video fragmentation | Unified response system handles text/audio/video |

### Consistency Rules

1. **Every module** uses the same completion flow (2 buttons: Dashboard / Continuar)
2. **Every test** is auto-scored with the same logic
3. **Every interview** uses Claude with module-specific rubric
4. **Every task** evaluated by Claude with provided criteria
5. **All scores** contribute to module score (weighted)
6. **All modules** award XP on completion

---

## Part 6: Success Metrics

✅ No mock data - everything is real functionality  
✅ One architectural pattern across all 10 modules  
✅ Consistent 2-button navigation  
✅ Proper XP tracking  
✅ LLM-based evaluation for all modules  
✅ Database-backed content (not hardcoded)  
✅ Support for future module additions  
✅ Mobile-responsive design maintained  

---

## Timeline Estimate

- **Phase 1:** 1 week (infrastructure)
- **Phase 2:** 2 weeks (module rebuilds)
- **Phase 3:** 1 week (capstone + testing)
- **Total:** 4 weeks to complete all 10 modules with professional architecture

