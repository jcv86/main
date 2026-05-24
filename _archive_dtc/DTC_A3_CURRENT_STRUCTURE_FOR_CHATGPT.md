# A3 Learning Path - Current Structure & Implementation Analysis

**Document Purpose**: Complete structure analysis of `/despega/a3` for ChatGPT implementation continuation  
**Date Generated**: 2026-05-13  
**Status**: A3 = 10-module learning path COMPLETE. A2 = 90-day roadmap path COMPLETE. Day 1 modal = IN PROGRESS

---

## 1. FILES & COMPONENTS STRUCTURE

### A3 Main Page
- **File**: `/app/despega/a3/page.tsx` (807 lines)
- **Purpose**: Main dashboard/router for A3 Basic Level Training Path
- **Key State**: Module progress, XP tracking, user completions, A2 integration

### A3 Components (14 total)
Located in `/components/a3-*.tsx`:

1. `a3-behavioral-feedback.tsx` - Behavioral feedback display
2. `a3-challenge-invitation.tsx` - Challenge invitation UI
3. `a3-chat-coach.tsx` - Coach chat interface
4. `a3-difficulty-progression.tsx` - Difficulty level progression
5. `a3-employability-diagnosis.tsx` - Employability assessment
6. `a3-gamification-widget.tsx` - XP/rewards gamification
7. `a3-general-progress.tsx` - General progress tracking
8. `a3-interview-simulation.tsx` - Interview simulator
9. `a3-pre-interview-analysis.tsx` - Pre-interview analysis
10. `a3-progress-dashboard-test.tsx` - Test dashboard variant
11. `a3-progress-dashboard.tsx` - Main progress dashboard
12. `a3-progress-tracker.tsx` - Progress tracker
13. `a3-scenario-simulator.tsx` - Scenario simulator
14. `a3-training-levels.tsx` - Training level selector

### A3 Hooks
- `/hooks/use-a3-training.ts` - Training state management hook

### A3 Utilities
- `/lib/a3-coach-prompts.ts` - AI coach prompts library

### A3 API Routes
- `/api/a3/user-progress/route.ts` - Fetch user module progress + A2 current day
- `/api/a3/progress/route.ts` - Progress calculation endpoint
- `/api/a3/save-module-progress/route.ts` - Save module completion

### A3 Sub-routes (41 directories)
All in `/app/despega/a3/`:
- `career-mirror/` - Module 1
- `value-mining-lab/` - Module 2
- `cv-builder-studio/` - Module 3
- `job-decoder/` - Module 4
- `answer-architecture/` - Module 5
- `coach-practice-room/` - Module 6
- `communication-gym/` - Module 7
- `first-recruiter-simulation/` - Module 8
- `risk-difficult-questions-lab/` - Module 9
- `basic-interview-mission/` - Module 10
- Additional routes: analytics, diagnosis, feedback, gamification, progress, rewards, simulations, etc.

---

## 2. CURRENT PAGE SECTIONS, BUTTONS, MODALS & UI ELEMENTS

### Header Section
```
- "Ruta de Entrenamiento Nivel Básico" (title)
- Description of Basic Level path (10 modules)
- Status badges:
  • "Nivel: Básico"
  • "Modo de Entrenamiento: Educativo + Guiado + Simulado"
  • "Ruta Total: 1,340 XP"
  • "Ruta Seleccionada: 30/60/90 Días"
```

### Navigation
- Back button to `/despega`
- Route selector dropdown (30/60/90 days)

### Progress Display Section
- **Component**: `<A2ProgressDisplay />` - Shows A2 90-day route progress
- **Integration**: Displays current day in A2 (fetched from DB)
- **Styling**: Purple accent (rgb(170, 70, 170))

### Main Progress Card
```
- Progress bar with percentage (0-100%)
- XP display: "X / 1,340 XP"
- 4 summary cards:
  1. XP Earned (numeric)
  2. Modules Completed (X / 10)
  3. Current Focus (module title)
  4. Next Unlock (next module title)
- Custom gradient bar: rgb(170, 70, 170) primary color
```

### Advanced Level Promotion Card (shown when A3 = 100%)
```
- Congratulations message
- "Next Step: Advanced Level" section with 4 info boxes:
  1. ⬆️ Mayor Dificultad
  2. 🎓 Aprendizaje Profundo
  3. 🏆 Más XP
  4. 📊 Sofia V2 (improved interviewer)
- CTA Button: "Comenzar Nivel Avanzado →"
```

### Module Cards Section (10 modules displayed)
Each module card shows:

**Module Header**
- Icon + module number
- Status badge (Completado, En Progreso, Disponible, Bloqueado)
- Module title
- Short description (2 lines)
- Tags (Sin Entrevista, Coach Optional, Laboratorio, etc.)

**Module Details (when expanded)**
- Format: description of module type
- Input Mode: how user interacts
- Interview Requirement: yes/no
- XP Value: displayed
- Main Output: what user gets
- CTA Button: action to begin module
- Required Activities: checklist of steps
- Progress bar: if in progress

**Visual States**
- Locked: opacity 60%, grayed out, lock icon
- Available: purple border highlight on hover, play icon
- In Progress: teal badge, checkmark badge
- Completed: checkmark icon, 100% progress bar

### Colors Used
```
PILLAR3_PRIMARY = 'rgb(170, 70, 170)' // Magenta/purple
PILLAR3_ACCENT = 'rgb(80, 160, 170)'  // Teal
Background gradient: rgba(170, 70, 170, 0.08) fading to transparent
Badge backgrounds: rgba(..., 0.1-0.3)
Border colors: rgba(..., 0.2-0.5)
```

---

## 3. CURRENT 90-DAY ROUTE LOGIC (A2 Integration)

### A2 Current Day Fetching
**API Call**: `GET /api/a3/user-progress`
```typescript
// Fetches A2 current day from a2_user_route_progress table
const { data: a2Data } = await supabase
  .from('a2_user_route_progress')
  .select('dia_actual')  // Current day number (1-90)
  .eq('user_id', userId)
  .single()

const a2CurrentDay = a2Data?.dia_actual || 1
```

### A2 Progress Display Component
- **Component**: `<A2ProgressDisplay />` (in a3-progress-display.tsx)
- **Location**: Right above main A3 progress card
- **Data**: Shows A2 progress bar with current day indicator
- **Purpose**: Remind user of 90-day journey context while doing A3 modules

### A2 Integration Points
1. **Progress page shows both**:
   - A2: 90-day roadmap progress (left/separate section)
   - A3: 10-module learning path (right/separate section)
2. **Unlock logic**: Currently NO dependency (A3 modules available regardless of A2)
3. **Desired change**: A3 modules should lock until A2 Day 1 completed

---

## 4. CURRENT A2 ROADMAP LOGIC

### A2 Database Schema (a2_user_route_progress table)
```
- user_id (FK)
- dia_actual (int: 1-90) - Current day
- tareas_completadas (JSON) - Completed day IDs
- meta_actual (string) - Current phase
- created_at, updated_at
```

### A2 Day Progression
1. User starts at Day 1
2. Each day has tasks (30 tasks across 90 days)
3. Tasks can be: locked, available, in-progress, completed
4. First unlocked task is "active"
5. User progresses through all 90 days

### A2 Completion Requirement for A3
**Missing**: Logic to prevent A3 access until A2 Day 1 passes

---

## 5. CURRENT A3 10-MODULE LOGIC

### Module Structure
```typescript
interface Module {
  id: string                    // Unique identifier
  number: number                // 1-10
  title: string                 // Spanish title
  shortDescription: string      // 2-3 sentence description
  format: string                // Type of module
  inputMode: string             // How user interacts
  interviewRequirement: string  // "Sin entrevista requerida" or required
  xp: number                    // XP reward on completion
  mainOutput: string            // What user produces
  cta: string                   // Call-to-action button text
  tags: string[]                // Module tags/categories
  requiredActivities: string[]  // Checklist of steps to complete
  icon: React.ReactNode         // Lucide icon
  route: string                 // Route to module
}
```

### Module Descriptions (10 modules, 1,340 XP total)

| # | Module ID | Title (ES) | XP | Format | Requirements |
|---|-----------|-----------|----|---------|----|
| 1 | career-mirror | Espejo de Carrera | 80 | Self-discovery interactive cards | No interview |
| 2 | value-mining-lab | Laboratorio de Minería de Valor | 100 | Achievement discovery lab | No interview, coach optional |
| 3 | cv-builder-studio | Estudio Constructor de CV | 120 | Document creation + writing | No interview |
| 4 | job-decoder | Decodificador de Ofertas | 100 | Job posting analysis tool | No interview |
| 5 | answer-architecture | Arquitectura de Respuestas | 120 | Answer framework learning | No interview |
| 6 | coach-practice-room | Sala de Práctica del Coach | 130 | Interactive Q&A with AI coach | No interview |
| 7 | communication-gym | Gimnasio de Comunicación | 140 | Professional communication skills | No interview, voice recording |
| 8 | first-recruiter-simulation | Primera Simulación con Reclutador | 160 | HR recruiter simulation | No interview |
| 9 | risk-difficult-questions-lab | Laboratorio de Preguntas Difíciles | 170 | Risk question preparation | No interview, under pressure |
| 10 | basic-interview-mission | Misión de Entrevista Básica | 220 | Full interview certification | **Required** - Complete 10+ Q&A |

### Module Unlock Rules (Current Implementation)
```typescript
// In user-progress API
if (index === 0) {
  moduleStates[id] = 'available'  // Module 1 always available
} else {
  const prevId = MODULE_ORDER[index - 1]
  moduleStates[id] = completedModuleIds.includes(prevId) ? 'available' : 'locked'
}
```

**Logic**: 
- Module 1: Always available
- Modules 2-10: Available ONLY if previous module completed
- Sequential unlock, no skipping

### Module Completion Rules (Current Implementation)
```typescript
// Modules are marked complete when:
1. Required activities finished
2. User clicks "Complete Module"
3. Status saved to a3_user_progress.completed_module_ids

// XP awarded on completion:
- Module 1: 80 XP
- Module 2: 100 XP
- ... (see table above)
- Module 10: 220 XP
// TOTAL: 1,340 XP
```

### Progress Tracking
```typescript
const earnedXp = Object.values(moduleProgreso)
  .reduce((sum, p) => sum + p.earnedXp, 0)

const completedModules = Object.values(moduleProgreso)
  .filter(p => p.status === 'completed').length

const progressPercentage = Math.round((earnedXp / TOTAL_XP) * 100)
```

---

## 6. CURRENT DAY 1 IMPLEMENTATION (A2/DIA-1)

### Current State
- **Location**: `/app/despega/a2/dia-1/page.tsx`
- **Status**: ~80% complete with A2 styling applied
- **Current Sections**:
  1. Static header with day badge, title, description
  2. Tasks section (checklist)
  3. Learning goals section
  4. Action items section
  5. CTA buttons: "Comenzar el Flujo Completo"

### Day 1 Modal Flow (7-step modal)
- **Component**: `<A2Day1Modal>` in `/components/a2-day1-modal.tsx`
- **File Size**: ~400+ lines
- **States**: Step 1-7 progression

### 7-Step Flow Details

**Step 1: Define Your Vision** (`a2-day1-step1-vision.tsx`)
- 3 text inputs:
  1. "¿Qué rol o título profesional estás buscando?" 
  2. "Describe tu ambiente de trabajo ideal"
  3. "¿Qué deseas lograr en los próximos 30 días?"
- Each input: enhanced with icons, placeholder text, optional coach assist button
- Uses `<A2EnhancedInput>` component with purple styling
- "Siguiente" button proceeds to Step 2

**Step 2: Coach Enhancement** (`a2-day1-step2-coach.tsx`)
- Displays original answers
- Shows AI coach-enhanced version
- Buttons: Accept / Edit / Regenerate
- Calls `/api/a2/day1/coach-enhance` (not yet implemented)
- Progress bar shows "Paso 2 de 6"
- Wait, Step 2 says "Paso 2 de 6" - current count is 7 steps, but only 6 displayed?

**Step 3: Define Milestones** (`a2-day1-step3-milestones.tsx`)
- 3 milestone sections:
  1. "¿Qué deberías lograr para el Día 10?"
  2. "¿Qué deberías lograr para el Día 20?"
  3. "¿Qué deberías lograr para el Día 30?"
- Each input: 2-3 rows, icon-prefixed, enhanced with coach assist
- Coach enhancement flow similar to Step 2
- "Atrás" and "Siguiente" buttons

**Step 4: Create Action Plan** (`a2-day1-step4-action-plan.tsx`)
- 4 action category inputs:
  1. "APLICACIONES A EMPLEOS" (red icon)
  2. "NETWORKING Y CONEXIONES" (purple icon)
  3. "APRENDIZAJE Y DESARROLLO" (blue icon)
  4. "CRECIMIENTO PERSONAL" (heart icon)
- Each section: text area + "Usar micrófono" + "Asistencia Tu Coach" buttons
- Teal-colored action buttons (being updated to purple)
- Multiple selection indicator: "Puedes seleccionar múltiples opciones"

**Step 5: Save Externally** (`a2-day1-step5-external-save.tsx`)
- 2 options:
  1. "Save to Notion" - input field for Notion template link
  2. "Download Your Plan" - button (currently "Coming Soon")
- Section descriptions: "Respalda tu trabajo en Notion o descárgalo para tus registros"

**Step 6: Upload** (`a2-day1-step6-upload.tsx`)
- File upload area (drag & drop)
- Accepts: PDF, Word, TXT, Markdown
- Shows file name after upload
- "Analyze my roadmap" button (proceeds to Step 7)

**Step 7: Analysis & Scoring** (`a2-day1-step7-analysis.tsx`)
- "AI Analysis in Progress" loading state
- Results display:
  - Overall score card (0-100, pass/fail indicator)
  - 4 detailed score breakdowns:
    * Vision Clarity (0-25)
    * Milestone Quality (0-25)
    * Action Completeness (0-25)
    * Realism & Coherence (0-25)
  - Progress bars for each category
  - Feedback section
  - Strengths list (green accent)
  - Areas for Improvement (blue accent)
  - Buttons: "Revise" (if fail) or "Continue to Day 2" (if pass)

### Day 1 Modal Structure
```typescript
interface A2Day1ModalProps {
  isOpen: boolean
  onClose: () => void
}

// States for each step:
const [currentStep, setCurrentStep] = useState(1)
const [visionAnswers, setVisionAnswers] = useState({...})
const [milestones, setMilestones] = useState({...})
const [actionPlan, setActionPlan] = useState({...})
// etc.
```

### Progress Indicator
- Progress bar showing: [====>-------] (% filled)
- 6 dots representing steps 1-6 (Note: should be 7 dots?)
- Green fill for completed, gray for pending

### A2EnhancedInput Component Updates
- **File**: `/components/a2-enhanced-input.tsx`
- **Recent Changes**: 
  - Icon color changed to purple: `rgba(90, 90, 150, 0.8)`
  - Buttons styled with purple: border + background 10%
  - Coach suggestion box uses purple accent
  - Voice recording button: red when active, purple when inactive
- **Features**:
  - Text/textarea input with focus border animation
  - Microphone button for voice input
  - "Asistencia Tu Coach" button for AI enhancement
  - Coach suggestion display box
  - Character count or validation feedback

### Modal Styling (A2 Theme)
```
Background: rgba(15, 17, 23, 0.98)
Border: 1px solid rgba(90, 90, 150, 0.4)
Corner radius: 28px (rounded-[28px])
Progress bar: gradient from rgb(90, 90, 150) to lighter shade
Buttons: 
  - Primary: rgba(90, 90, 150, 0.8) background
  - Secondary: rgba(90, 90, 150, 0.1) background + border
```

---

## 7. APIS, DATABASE TABLES & PROGRESS-SAVING LOGIC

### API Endpoints (Current)

#### `/api/a3/user-progress` (GET)
```typescript
// Fetches A3 module progress + A2 current day
// Returns:
{
  success: true,
  progress: {
    totalXp: number,
    maxXp: 1340,
    progressPct: 0-100,
    completedModules: number,
    totalModules: 10,
    moduleStates: {
      'career-mirror': 'available|in_progress|completed|locked',
      'value-mining-lab': '...',
      // ... 10 modules
    },
    completedModuleIds: string[],
    a2CurrentDay: 1-90  // ← Fetched from a2_user_route_progress
  }
}
```

#### `/api/a3/save-module-progress` (POST)
```typescript
// Saves module completion
// Payload:
{
  moduleId: string,
  status: 'completed' | 'in_progress',
  earnedXp: number
}
```

#### `/api/a3/progress` (GET)
```typescript
// Calculates total progress
// Returns:
{
  totalXP: number,
  totalXPTarget: 1000,
  completedTrainings: number,
  totalTrainings: 7,
  percentage: 0-100,
  completedModules: string[]
}
```

### A2 Day 1 API Endpoints (PLANNED, not yet fully implemented)

#### `/api/a2/day1/coach-enhance` (POST)
- **Input**: { visionAnswers, context? }
- **Output**: { enhancedVersion, suggestions }
- **Status**: Component calls it, but endpoint may not fully exist
- **Uses**: Groq/Claude AI for enhancement

#### `/api/a2/day1/upload` (POST)
- **Input**: File (multipart/form-data)
- **Output**: { filePath, fileName, success }
- **Status**: Not yet implemented
- **Will use**: Vercel Blob storage

#### `/api/a2/day1/analyze` (POST)
- **Input**: { submissionId, filePath }
- **Output**: { score, passed, analysis, strengths, improvements }
- **Status**: Not yet implemented
- **Uses**: LLM to parse document and score

### Database Tables (Supabase)

#### `a3_user_progress` (A3 progression tracking)
```sql
CREATE TABLE a3_user_progress (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth_users(id),
  total_xp integer DEFAULT 0,
  completed_module_ids text[] DEFAULT '{}',
  module_states jsonb DEFAULT '{...}',
  current_module_id text,
  last_module_completed_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
)
```

#### `a2_user_route_progress` (A2 progression tracking)
```sql
CREATE TABLE a2_user_route_progress (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth_users(id),
  dia_actual integer DEFAULT 1,  -- Current day (1-90)
  tareas_completadas jsonb DEFAULT '{}',
  meta_actual text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
)
```

#### `a2_day1_submissions` (PLANNED - for Day 1 modal data)
```sql
CREATE TABLE a2_day1_submissions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth_users(id),
  
  -- Step 1: Vision
  vision_answers jsonb,
  
  -- Step 2: Coach enhancement
  coach_enhanced_vision text,
  coach_version integer DEFAULT 1,
  
  -- Step 3: Milestones
  milestones jsonb,
  coach_enhanced_milestones jsonb,
  
  -- Step 4: Action Plan
  action_plan jsonb,
  coach_enhanced_action_plan jsonb,
  
  -- Step 6: Upload
  uploaded_file_path text,
  uploaded_file_name text,
  uploaded_at timestamp,
  
  -- Step 7: Analysis
  dtc_analysis jsonb,  -- Contains score, passed, feedback, etc.
  
  -- Tracking
  completion_step integer DEFAULT 0,
  completed_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
)
```

### Progress Saving Pattern (Current A3)
```typescript
// 1. User completes module
// 2. Call save-module-progress API
// 3. Backend:
//    - Updates a3_user_progress.completed_module_ids
//    - Calculates new XP total
//    - Updates module_states for unlock logic
// 4. Frontend: Refetch progress, re-render module cards
```

---

## 8. RELEVANT CODE SNIPPETS & DATA ARRAYS

### Module Order (Hard-coded unlock sequence)
```typescript
const MODULE_ORDER = [
  'career-mirror',                    // 1
  'value-mining-lab',                 // 2
  'cv-builder-studio',                // 3
  'job-decoder',                      // 4
  'answer-architecture',              // 5
  'coach-practice-room',              // 6
  'communication-gym',                // 7
  'first-recruiter-simulation',       // 8
  'risk-difficult-questions-lab',     // 9
  'basic-interview-mission',          // 10
]
```

### Module XP Map
```typescript
const MODULE_XP: Record<string, number> = {
  'career-mirror': 80,
  'value-mining-lab': 100,
  'cv-builder-studio': 120,
  'job-decoder': 100,
  'answer-architecture': 120,
  'coach-practice-room': 130,
  'communication-gym': 140,
  'first-recruiter-simulation': 160,
  'risk-difficult-questions-lab': 170,
  'basic-interview-mission': 220,
}

const TOTAL_XP = 1340
```

### Module Status Type
```typescript
type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed'

interface ModuleProgreso {
  status: ModuleStatus
  progress: number        // 0-100
  earnedXp: number
  completedActivities: number
}
```

### Day 1 Vision Answers Structure (PLANNED)
```typescript
interface VisionAnswers {
  role: string          // "¿Qué rol..."
  environment: string   // "Describe tu ambiente..."
  desiredOutcome: string // "¿Qué deseas lograr..."
}
```

### Day 1 Milestones Structure (PLANNED)
```typescript
interface Milestones {
  day10: string
  day20: string
  day30: string
}
```

### Day 1 Action Plan Structure (PLANNED)
```typescript
interface ActionPlan {
  applications: string[]        // Job applications actions
  networking: string[]          // Networking & connections
  learning: string[]            // Learning & development
  personalGrowth: string[]      // Personal growth
}
```

### Day 1 DTC Analysis Structure (PLANNED)
```typescript
interface DTCAnalysis {
  score: number                 // 0-100
  passed: boolean              // score >= 75
  visionClarity: number        // 0-25
  milestoneQuality: number     // 0-25
  actionPlanCompleteness: number // 0-25
  realismCoherence: number     // 0-25
  strengths: string[]
  improvements: string[]
  feedback: string
  analyzedAt: timestamp
}
```

### Module Card Badge Styles
```typescript
const getStatusBadge = (status: ModuleStatus) => {
  switch (status) {
    case 'completed':
      return { backgroundColor: 'rgba(170, 70, 170, 0.1)', color: 'rgb(200, 130, 200)' }
    case 'in_progress':
      return { backgroundColor: 'rgba(80, 160, 170, 0.2)', color: 'rgb(80, 160, 170)' }
    case 'available':
      return { backgroundColor: 'rgba(170, 70, 170, 0.2)', color: 'rgb(170, 70, 170)' }
    case 'locked':
      return 'bg-white/10 text-white/50 border-white/20 border'
  }
}
```

---

## 9. WHAT IS MISSING FOR DESIRED LOGIC FLOW

### Architecture Understanding
```
A2 = Roadmap/Dashboard/Real Actions (90 days structured plan)
A3 = Learning/Testing/Examination (10-module skill-building path)
Current: Both shown together on same page
Desired: Integrated but distinct flows
```

### Missing Pieces for A3 → A2 Integration

#### 1. ❌ A3 Day 1 Lock Until A2 Day 1 Passes
**Current**: A3 modules available immediately, no A2 dependency
**Desired**: 
- A3 modules locked until user completes A2 Day 1 AND passes DTC (score ≥75)
- Check in `/api/a3/user-progress`:
  ```typescript
  // Add check:
  if (!passed_a2_day1) {
    moduleStates['career-mirror'] = 'locked'
    moduleStates['value-mining-lab'] = 'locked'
    // ... all modules locked
  }
  ```

#### 2. ❌ A2 Day 1 Cannot Open Until A2 Previous Days Complete
**Current**: Day 1 modal opens anytime
**Desired**: 
- Check if user is on Day 1 in A2 journey
- Lock modal if earlier days incomplete
- Show "Complete Day X first" message

#### 3. ❌ A3 Module Unlock Only After A2 Day 1 Completion
**Current**: Sequential A3-only unlock (Module 1 → 2 → 3)
**Desired**: 
- Keep sequential A3 unlock
- BUT also check A2 Day 1 passed
- Modification:
  ```typescript
  if (index === 0 && !a2Day1Passed) {
    moduleStates[id] = 'locked'  // Lock Module 1 until A2 Day 1 passed
  } else if (index > 0 && !completedModuleIds.includes(prevId)) {
    moduleStates[id] = 'locked'  // Lock until previous module done
  }
  ```

#### 4. ❌ Day 1 Modal Step Count Discrepancy
**Current**: Progress bar shows "Paso X de 6" (6 steps)
**Actual**: 7 steps implemented
**Fix**: Change `stepTitles.length` or progress display to show "Paso X de 7"

#### 5. ⚠️ Day 1 API Endpoints Incomplete
**Missing Implementations**:
- `/api/a2/day1/coach-enhance` - Groq/Claude AI enhancement call
- `/api/a2/day1/upload` - File upload to Vercel Blob
- `/api/a2/day1/analyze` - Document parsing + DTC scoring engine
- `/api/a2/day1/save-submission` - Persist submission to `a2_day1_submissions` table

#### 6. ⚠️ Day 1 Database Table Missing
**Missing**: `a2_day1_submissions` table not yet created in Supabase
**Needed for**: Storing vision, milestones, action plan, uploaded files, analysis results

#### 7. ⚠️ LLM Document Parsing Logic Missing
**For Step 7**: Need logic to:
- Parse uploaded PDF/DOCX/TXT file
- Extract vision, milestones, action items
- Score against 4 criteria (clarity, quality, completeness, realism)
- Generate feedback and improvement suggestions
- Return structured analysis

#### 8. ⚠️ Notion Integration Missing
**For Step 5**: No implementation for:
- Generating Notion-compatible markdown
- Linking to Notion template
- Auto-syncing submission to Notion

#### 9. ⚠️ PDF Download Missing
**For Step 5**: Button says "Coming Soon"
- Needs: Roadmap document generation as PDF
- Library: Could use `pdfkit` or similar

#### 10. ⚠️ A2 Day Progression Logic Missing
**After Day 1 passes**: 
- Auto-unlock Day 2
- Update `a2_user_route_progress.dia_actual` to 2
- Show Day 2 in A2 routes page

#### 11. ⚠️ Multi-revision Support Missing
**If Day 1 fails (score < 75)**:
- User should be able to revise and re-upload
- Should track submission history
- Should show previous scores/feedback
- Currently: Not implemented

#### 12. ⚠️ Coach Assist Buttons Not Fully Connected
**In Day 1 inputs**: "Asistencia Tu Coach" buttons present but:
- API endpoint calls may fail
- No error handling for coach failures
- No timeout/loading state properly managed

#### 13. ⚠️ Error Handling & User Feedback
**Missing**:
- Upload size limits
- Network error recovery
- Validation error messages for empty/vague answers
- Loading state during AI analysis (mock timeout)
- Toast notifications for step completion

#### 14. ⚠️ Data Persistence Across Refreshes
**Current**: State variables only (lost on refresh)
**Needed**: 
- Auto-save to DB after each step
- Resume from last completed step on page reload
- Clear indication of "Progress saved"

---

## 10. IMPLEMENTATION PRIORITY ROADMAP

### Phase 1: Critical (Blocks functionality)
1. Create `a2_day1_submissions` database table
2. Implement `/api/a2/day1/save-submission` endpoint
3. Implement `/api/a2/day1/analyze` with DTC scoring logic
4. Fix modal step count display (6 → 7)

### Phase 2: Core (Enables main flow)
1. Implement `/api/a2/day1/upload` (Vercel Blob)
2. Implement `/api/a2/day1/coach-enhance` (Groq/Claude)
3. Add A3 lock logic until A2 Day 1 passes
4. Auto-save form state to DB at each step

### Phase 3: Enhancement (Polish)
1. PDF generation for Step 5
2. Notion integration for Step 5
3. Multi-revision support with history
4. Better error handling & user feedback

### Phase 4: Integration (Ecosystem)
1. Auto-unlock Day 2 after Day 1 passes
2. Update A2 progress display when Day 1 complete
3. A3 modules auto-unlock sequence trigger
4. Analytics tracking for Day 1 submissions

---

## 11. COMPLETE FILE & ROUTE REFERENCE

### A3 Main Files
```
/app/despega/a3/
├── page.tsx                          # Main A3 dashboard (807 lines)
├── layout.tsx                        # A3 layout wrapper
├── data/                             # Data exports
└── [41 module subdirectories]        # Each module has own route

/components/
├── a3-*.tsx                          # 14 A3 components
├── a2-day1-modal.tsx                 # Day 1 orchestrator
├── a2-day1-step1-vision.tsx          # Vision questions
├── a2-day1-step2-coach.tsx           # Coach enhancement
├── a2-day1-step3-milestones.tsx      # Milestones
├── a2-day1-step4-action-plan.tsx     # Action plan
├── a2-day1-step5-external-save.tsx   # Notion/Download
├── a2-day1-step6-upload.tsx          # File upload
├── a2-day1-step7-analysis.tsx        # Scoring results
├── a2-enhanced-input.tsx             # Input with coach
└── a2-progress-display.tsx           # A2 progress widget

/app/api/
├── a3/
│   ├── user-progress/route.ts        # Fetch A3 + A2 day
│   ├── progress/route.ts             # Calculate A3 progress
│   └── save-module-progress/route.ts # Save completion
└── a2/
    └── day1/
        ├── coach-enhance/route.ts    # PLANNED
        ├── upload/route.ts           # PLANNED
        ├── analyze/route.ts          # PLANNED
        └── save-submission/route.ts  # PLANNED

/lib/
├── a3-coach-prompts.ts              # AI prompts for A3
└── a2-dtc-scoring.ts                # PLANNED: DTC scoring logic

/hooks/
└── use-a3-training.ts               # A3 state management
```

---

## 12. KEY DESIGN PRINCIPLES OBSERVED

1. **Pillar 3 Theming**: Purple (170, 70, 170) + Teal (80, 160, 170) colors
2. **Sequential Learning**: Modules must complete in order (1→2→→10)
3. **XP Gamification**: Points accumulate, visual progress bar
4. **Modal-Based UI**: Day 1 is a modal flow within page context
5. **Coach Integration**: AI enhancement available at multiple steps
6. **Multi-step Persistence**: Save after each step for resumability
7. **A2/A3 Integration**: Both shown, but A3 dependent on A2 Day 1 pass

---

## 13. QUESTIONS FOR IMPLEMENTATION

1. **DTC Scoring**: What exactly are the 4 criteria scoring logic? (Currently mock)
2. **LLM Model**: Use Groq, Claude, or OpenAI for enhancement + analysis?
3. **Document Parsing**: OCR/PDF parsing library choice? (pdfjs, pdfparse, etc.)
4. **Notion API**: Which Notion integration method? (Official API, markdown export, etc.)
5. **File Size Limits**: Max upload file size for PDFs/Word docs?
6. **Coach Prompts**: Template prompts for enhancement suggestions? (Draft in `a3-coach-prompts.ts` ready)
7. **Timing**: Auto-save debounce duration? LLM analysis timeout?
8. **A2/A3 Sync**: Other events that should unlock/lock A3 modules?

---

**END OF DOCUMENT**
