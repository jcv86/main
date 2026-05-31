# Dashboard Data Connections & Real Progress Tracking

## What the A3 Dashboard Shows

The `/despega/a3` page displays a MIXED DASHBOARD that pulls data from TWO different routes:

---

## DATA CONNECTIONS DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                     A3 DASHBOARD PAGE                           │
│                   /despega/a3                                   │
└─────────────────────────────────────────────────────────────────┘
        │
        ├─────────────────┬──────────────────┐
        │                 │                  │
        v                 v                  v
   
   SECTION 1          SECTION 2          SECTION 3
   
   "Tu Ruta           "Tu Progreso       "Tu Progreso del
    de Hoy"            de Ruta           Nivel Básico"
    (A2)               (A2)              (A3)
    
   ┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐
   │ A2 TODAY'S TASK │ │ A2 ROUTE PROGRESS│ │ A3 TRAINING PROG │
   ├─────────────────┤ ├──────────────────┤ ├──────────────────┤
   │ Component:      │ │ Component:       │ │ Local State:     │
   │ A2TodaysRoute   │ │ A2RouteProgress  │ │ - earnedXp       │
   │                 │ │                  │ │ - modules        │
   │ Props:          │ │ Props:           │ │ - activities     │
   │ dayNumber       │ │ dayNumber        │ │                  │
   │                 │ │                  │ │ Data Source:     │
   │ Data Source:    │ │ Data Source:     │ │ a3_user_progress │
   │ getA2Daily      │ │ Supabase         │ │ table            │
   │ Task(dayNum)    │ │ a2_user_route_   │ │                  │
   │                 │ │ progress table   │ │ API Call:        │
   │ Shows:          │ │                  │ │ /api/a3/user-    │
   │ - Task title    │ │ Shows:           │ │ progress         │
   │ - Duration      │ │ - Phase (F/G/C)  │ │                  │
   │ - XP reward     │ │ - Applications   │ │ Shows:           │
   │ - Priority      │ │ - Connections    │ │ - Total % done   │
   │ - Status        │ │ - Interviews     │ │ - XP earned      │
   │ - Description   │ │ - Offers         │ │ - Modules done   │
   │                 │ │ - Total %        │ │ - Activities     │
   │                 │ │ - Days left      │ │ - Progress bars  │
   └─────────────────┘ └──────────────────┘ └──────────────────┘
   
        A2_DAILY_TASKS          SUPABASE                SUPABASE
        (Hardcoded Lib)         a2_user_route_          a3_user_
                                progress                progress
```

---

## DATA FLOW FOR EACH SECTION

### **SECTION 1: Tu Ruta de Hoy (Today's A2 Task)**

```
User visits /despega/a3
        │
        v
A3 page renders
        │
        v
<A2TodaysRoute dayNumber={currentDay} />
        │
        v
Component calls: getA2DailyTask(1)
        │
        v
Returns hardcoded task for day 1:
{
  day: 1,
  title: "Define tu visión y roadmap (90 días)",
  description: "Crea documento estructurado...",
  duration: 45,
  xpReward: 50,
  priority: "high",
  type: "planning",
  ...
}
        │
        v
Displays in card with duration, XP, status
```

**Source:** `lib/a2-daily-tasks.ts` (hardcoded library of 90 tasks)

---

### **SECTION 2: Tu Progreso de Ruta (A2 vs A3)**

```
User visits /despega/a3
        │
        v
A3 page mounted
        │
        v
useEffect fires:
  1. Fetch /api/a3/user-progress
  2. API queries Supabase a2_user_route_progress
  3. Gets: { dia_actual: 1, porcentaje_completado: 0% }
  4. Returns a2CurrentDay in response
  5. setCurrentDay(1)
        │
        v
<A2RouteProgress dayNumber={1} />
        │
        v
Component:
  1. Calls getA2RouteProgressMetrics(1)
  2. Calculates phase: Foundation (Days 1-30)
  3. Expected metrics: 2 apps, 1 connection, 0 interviews, 0 offers
  4. Returns phase info + metrics
        │
        v
Displays:
  - Phase: Foundation Phase (Days 1-30)
  - Applications: 2/2 (100%)
  - Connections: 1/1 (100%)
  - Interviews: 0/0 (NaN%)
  - Offers: 0 (Coming soon)
  - Total days: 1/90
  - Days left: 89
```

**Source:** `Supabase a2_user_route_progress` table
**Updates:** Real-time as user progresses through route

---

### **SECTION 3: Tu Progreso del Nivel Básico (A3 Training)**

```
User visits /despega/a3
        │
        v
useEffect fires:
  1. Fetch /api/a3/user-progress
  2. API queries Supabase a3_user_progress
  3. Gets: { module_states: {}, total_xp: 0, ... }
  4. Returns moduleStates
  5. setModuleProgreso(moduleStates)
        │
        v
Page renders:
  1. Calculate: earnedXp = 0
  2. Calculate: completedModules = 0
  3. Calculate: progressPercentage = 0%
        │
        v
Display:
  - Progress bar: 0%
  - XP earned: 0 / 1,340
  - Modules: 0 / 10
  - Activities: 0 / total
```

**Source:** `Supabase a3_user_progress` table
**Updates:** As user completes A3 modules

---

## How currentDay Gets Set (FIXED)

**OLD (before fix):**
```
const [currentDay, setCurrentDay] = useState(1) // Hardcoded to 1
// Never updated - always shows "Day 1"
```

**NEW (after fix):**
```
const [currentDay, setCurrentDay] = useState(1) // Default to 1

useEffect(() => {
  // Fetch from API
  const response = await fetch('/api/a3/user-progress')
  const { progress } = response.json()
  
  // Set real A2 day from database
  if (progress?.a2CurrentDay) {
    setCurrentDay(progress.a2CurrentDay)  // Now shows actual day!
  }
}, [])
```

**API includes:**
```typescript
// In /api/a3/user-progress/route.ts
const { data: a2Data } = await supabase
  .from('a2_user_route_progress')
  .select('dia_actual')
  .eq('user_id', userId)
  .single()

const a2CurrentDay = a2Data?.dia_actual || 1

return NextResponse.json({
  success: true,
  progress: {
    ...
    a2CurrentDay,  // NOW INCLUDED in response
  },
})
```

---

## Real Progress Tracking Now Enabled

### **A2 Route:**
- `dia_actual`: User's current day (1-90)
- `porcentaje_completado`: Total % complete (0-100)
- Job metrics: applications, connections, interviews, offers
- Phase tracking: Foundation → Growth → Closing

### **A3 Route:**
- `module_states`: Each module's status (locked/available/in_progress/completed)
- `total_xp`: Total XP earned from completed modules
- `completed_module_ids`: List of finished modules
- `completed_activities`: Activities completed per module

### **Connection Between Them:**
A3 dashboard shows BOTH:
1. Your A2 progress (job search - left side)
2. Your A3 progress (training - right side)

Users can see both routes running in parallel or independently.

---

## Summary of Metrics

| Section | Metric | Updates From | Real? |
|---------|--------|--------------|-------|
| Today's Task | Task title, duration, XP | Hardcoded daily-tasks lib | ❌ Static |
| Phase Progress | Applications, connections, interviews, offers | Supabase a2_user_route_progress | ✅ Real |
| Phase Progress | Current day, days remaining | Supabase a2_user_route_progress | ✅ Real |
| Training Progress | XP earned, modules completed | Supabase a3_user_progress | ✅ Real |
| Training Progress | Module unlock status | Supabase a3_user_progress | ✅ Real |

---

## Files Updated

1. `/app/despega/a3/page.tsx`
   - Added fetch for `a2CurrentDay` from API
   - Sets `currentDay` state dynamically

2. `/app/api/a3/user-progress/route.ts`
   - Fetches `a2_user_route_progress.dia_actual`
   - Returns `a2CurrentDay` in response

3. `/components/a2-route-progress.tsx`
   - Updated to fetch real `a2_user_route_progress` data
   - Shows actual user progress (% complete, day number, metrics)

4. `/app/despega/a2/dia-1` through `/dia-90/page.tsx` (all 90)
   - Updated to fetch real user progress from Supabase
   - Display actual `dia_actual` and `porcentaje_completado`
