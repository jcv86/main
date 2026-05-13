# A2 vs A3 Architecture Overview

## Overview

Your "Despega Tu Carrera" platform has **TWO SEPARATE ROUTES** that work together:

### **A2: The 90-Day Job Search Route** (Ruta A2)
- **Purpose**: Active job search execution over 90 days
- **Data**: Real-world job search metrics (applications, connections, interviews, offers)
- **Pages**: 
  - `/despega/a2/dashboard` - Main A2 dashboard
  - `/despega/a2/dia-1` through `/despega/a2/dia-90` - Individual day pages
- **Database Table**: `a2_user_route_progress`
  - `dia_actual`: Current day user is on (1-90)
  - `porcentaje_completado`: Overall completion % (0-100)
  - `estado`: Current status
  - `capacidad_promedio`: Average capacity metric

**A2 Shows:**
- Foundation Phase (Days 1-30): "Build your foundation"
- Growth Phase (Days 31-60): "Scale your efforts"
- Closing Phase (Days 61-90): "Convert opportunities"

**Metrics Tracked:**
- Applications Submitted (target: 2/day)
- Connections Initiated (target: 1/day)
- Interviews Completed (target varies by phase)
- Offers Received (target varies by phase)

---

### **A3: The 10-Module Training Route** (Ruta A3)
- **Purpose**: Structured learning to build skills BEFORE or ALONGSIDE job search
- **Data**: Module completion progress, XP earned
- **Page**: `/despega/a3` - Main A3 dashboard with 10 modules
- **Database Table**: `a3_user_progress`
  - Each module tracked separately
  - Status: locked, available, in_progress, completed
  - XP earned: 0-100 per module
  - Progress %: 0-100 per module

**A3 Shows:**
1. Espejo de Carrera (Career Mirror) - 80 XP
2. Laboratorio de Minería de Valor (Value Mining Lab) - 100 XP
3. Estudio Constructor de CV (CV Builder Studio) - 120 XP
4. Decodificador de Ofertas (Offer Decoder) - 100 XP
5. Banco de Respuestas (Answer Bank) - 150 XP
6. Simulación con Coach (Coach Simulation) - 150 XP
7. Entrenamiento de Comunicación (Communication Training) - 150 XP
8. Simulación con Reclutadores (Recruiter Simulation) - 150 XP
9. Entrenamiento de Preguntas Difíciles (Tough Questions Training) - 150 XP
10. Entrevista Realista Final (Final Realistic Interview) - 200 XP

**Total A3 XP**: 1,340 XP

---

## How They're Connected

### **A3 Dashboard Layout:**

```
1. "Tu Ruta de Hoy (A2: Día X/90)"
   └─ Shows TODAY'S A2 TASK (from a2-todays-route component)
   └─ Displays: Task title, duration, XP reward, status
   └─ Pulls from: a2_daily_tasks config (hardcoded task library)

2. "Tu Progreso de Ruta (A2 vs A3)"
   └─ Shows A2 PHASE PROGRESS (Foundation/Growth/Closing)
   └─ Displays: Current day, phase description, 4 job search metrics
   └─ Displays: Total route progress %, days completed, days remaining
   └─ Pulls from: a2_user_route_progress (Supabase)
   └─ Component: A2RouteProgress

3. "Tu Progreso del Nivel Básico"
   └─ Shows A3 MODULE PROGRESS (local state)
   └─ Displays: XP earned, modules completed, progress bar
   └─ Pulls from: a3_user_progress (Supabase)
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│         User Logs In                        │
└─────────────────────┬───────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        v                           v
    A2 DASHBOARD              A3 DASHBOARD
 (90-Day Job Search)      (Training Modules)
        │                           │
        ├─ Fetches:                 ├─ Fetches:
        │  a2_user_route_progress   │  a3_user_progress
        │  - dia_actual             │  - module statuses
        │  - porcentaje_completado  │  - earnedXp
        │  - job metrics            │  - completedActivities
        │                           │
        ├─ Shows:                   └─ Shows:
        │  • Current day (1-90)        • Module progress
        │  • Job search metrics        • XP tracking
        │  • Phase (Foundation/        • Module unlock status
        │    Growth/Closing)           • Total training %
        │  • Today's task (A2)         │
        │  • Total progress %          └─ ALSO Imports A2 Data:
        │                                 • A2TodaysRoute component
        └─ SEPARATE FROM A3              • A2RouteProgress component
           (Data doesn't sync)           (Shows A2 progress WITHIN A3)
```

---

## Component Hierarchy

### **A3 Page Components:**

```
/app/despega/a3/page.tsx
├─ Layout: Container, header, badges
├─ Section 1: "Tu Ruta de Hoy"
│  └─ <A2TodaysRoute dayNumber={currentDay} />
│     └─ Renders: Today's A2 task details
│     └─ Source: getA2DailyTask(dayNumber) - hardcoded library
│
├─ Section 2: "Tu Progreso de Ruta (A2 vs A3)"
│  └─ <A2RouteProgress dayNumber={currentDay} />
│     └─ Renders: A2 phase + metrics
│     └─ Source: Supabase a2_user_route_progress
│
├─ Section 3: "Tu Progreso del Nivel Básico"
│  └─ Progress bar for A3
│  └─ 4x metric cards (XP, modules, activities, etc.)
│  └─ Source: Supabase a3_user_progress
│
└─ Section 4: "Módulos" (10-module grid)
   └─ Shows all A3 modules with status badges
   └─ Source: Supabase a3_user_progress + BASIC_LEVEL_MODULES config
```

---

## Key Files

### **A2 (Job Search Route)**
- `/app/despega/a2/dashboard/page.tsx` - A2 main dashboard
- `/app/despega/a2/dia-1` through `/dia-90/` - Individual day pages
- `/components/a2-todays-route.tsx` - Today's task component
- `/components/a2-route-progress.tsx` - Phase & metrics display
- `/lib/a2-daily-tasks.ts` - Hardcoded daily task library (90 tasks)
- `/lib/a2-route-progress.ts` - Phase definitions & metrics calculation
- `/lib/a2-days-config.ts` - Day configurations (duration, description)

### **A3 (Training Route)**
- `/app/despega/a3/page.tsx` - A3 main dashboard
- `/lib/a3-modules-config.ts` - 10 module definitions
- Database: `a3_user_progress` table

---

## Current Data Issues

1. **A2 Dashboard Shows Real Data** ✅
   - Connected to Supabase `a2_user_route_progress`
   - Shows actual user's current day & completion %

2. **A2 Day Pages Now Show Real Data** ✅
   - Recently updated to fetch from Supabase
   - Displays user's actual day number and progress

3. **A3 Dashboard Shows Mixed Data** ⚠️
   - **From A2**: "Tu Ruta de Hoy" section shows real A2 data
   - **From A2**: "Tu Progreso de Ruta" shows real A2 data
   - **From A3**: "Tu Progreso del Nivel Básico" shows real A3 module progress

4. **Metrics in A2RouteProgress Component** ✅
   - Shows Applications (2/2), Connections (1/1), Interviews (0/0), Offers (0)
   - These are calculated based on phase expectations + user actual data
   - Source: `getA2RouteProgressMetrics(dayNumber)` function

---

## What Each Section Tracks

### **"Tu Ruta de Hoy (A2: Día X/90)"**
Shows ONE task from the current day:
- Task type (Planning, Networking, Outreach, etc.)
- Priority level (High, Medium, Low)
- Duration (in minutes)
- XP reward
- Status (Todo, In Progress, Done)
- Description of what to do that day

### **"Tu Progreso de Ruta (A2 vs A3)"**
Shows the current PHASE and JOB SEARCH METRICS:
- Current Phase: Foundation (Days 1-30) → Growth (31-60) → Closing (61-90)
- Application Progress: Shows actual applications vs. expected
- Connection Progress: Shows actual connections vs. expected
- Interview Progress: Shows actual interviews (usually NaN at start)
- Offers Progress: Shows actual offers (usually 0 at start, "Coming soon")

### **"Tu Progreso del Nivel Básico"**
Shows A3 TRAINING PROGRESS:
- Total % completed (based on modules finished)
- XP earned / Total XP available (e.g., 0 / 1,340)
- Modules completed: X / 10
- Activities completed: X / total activities across all modules
- Hours spent: Tracked if modules have time records

---

## Summary

**The A3 page is a DASHBOARD that integrates both routes:**
- **Left side (A2 data)**: Shows your active job search progress from the A2 route
- **Right side (A3 data)**: Shows your training progress from the A3 route
- **They run independently** - A2 progress doesn't require A3, and vice versa
- **But they're shown together** - Users can see their job search and training side-by-side on the A3 dashboard
