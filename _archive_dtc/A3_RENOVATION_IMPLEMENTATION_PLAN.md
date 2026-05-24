# A3 Module Renovation - Implementation Plan

## Overview
Transform A3 modules 1-10 from standalone content into coach-led training interviews (1-6) and interviewer-led simulations (7-10) while keeping all module content unchanged.

## Key Requirements
1. **Camera/Microphone Verification** - Check device access before module entry
2. **White Border Removal** - Replace with salmon background `rgba(225, 120, 130, 0.4)`
3. **Session Structure** - Coach-led (1-6) vs Interviewer-led (7-10)
4. **Character Selection** - Modules 7-10: Sofia/Elena/Bruno based on difficulty
5. **Main A3 Page Styling** - All modules must match purple-tinted A3 design

## Implementation Phases

### Phase 1: Core Components (Days 1-2)
1. **CameraPermissionModal.tsx** - Device verification before module access
2. **A3SessionWrapper.tsx** - Unified session container with:
   - Camera feed display area
   - Question/content panel with salmon background (not white border)
   - Response input area
   - Character info section
   - Session metadata display

3. **A3SessionDataSchema.sql** - Database table for tracking:
   - moduleId, sessionType, leadCharacter, difficulty
   - isRouteCheckpoint, isReplay
   - relatedA2Day, timestamp
   - score, feedback, deliverable

### Phase 2: UI Updates (Days 3-4)
1. **ModuleCard Renovation** - Update to show:
   - Session type label
   - Character name and difficulty
   - New CTAs based on route/replay status

2. **A3 Main Page Styling** - Ensure all elements match:
   - Purple tints (rgb(170, 70, 170))
   - Teal accents (rgb(80, 160, 170))
   - Proper spacing and typography
   - Black backgrounds

### Phase 3: Logic Implementation (Days 5-6)
1. **Lock/Unlock System** - Enforce sequential access
2. **Replay Mode** - Enable after Basic completion
3. **Character Routing** - Sofia/Elena/Bruno selection logic
4. **Difficulty Mapping** - Adaptive/Basic/Advanced/Pro

### Phase 4: Route Updates (Days 7-8)
1. Add CameraPermissionModal to A3 layout
2. Wrap module pages with A3SessionWrapper
3. Update module routing with device check
4. Verify A2 checkpoint connections

### Phase 5: Testing & Styling (Days 9-10)
1. End-to-end flow testing
2. All modules styled to match main A3 page
3. Performance optimization
4. Data persistence verification

## File Structure

```
components/
├── a3/
│   ├── camera-permission-modal.tsx (NEW)
│   ├── a3-session-wrapper.tsx (NEW)
│   ├── module-card.tsx (UPDATE)
│   └── progress-bar.tsx (KEEP)

app/
├── despega/a3/
│   ├── layout.tsx (UPDATE - add modal)
│   ├── page.tsx (UPDATE - styling)
│   ├── [moduleId]/layout.tsx (NEW - wrapper)
│   └── [module]/page.tsx (WRAP with session)

lib/
├── a3-session-schema.ts (NEW)
└── a3-character-map.ts (NEW)

supabase/migrations/
└── a3_session_tracking.sql (NEW)
```

## Key Changes to Existing Files

### Module Pages (career-mirror, value-mining-lab, etc.)
- NO content changes
- Only wrapped in A3SessionWrapper
- Camera/Mic check enforced before access
- Session metadata saved to database

### A3 Main Page
- Update styling to match reference image
- Purple backgrounds with proper opacity
- Better spacing and typography
- Character profile section

### Module Card Component
- Add "Session Type" label
- Add "Character" and "Difficulty" display
- Update CTA text based on route/replay

## Design Specifications

### Colors
- Primary Purple: rgb(170, 70, 170)
- Teal Accent: rgb(80, 160, 170)
- Salmon Background: rgba(225, 120, 130, 0.4)
- Backgrounds: Black/very dark gray

### Typography
- Headers: Bold, white
- Body: White/80%, readable on dark
- Labels: White/60%, muted

### Layout
- Flexbox for most layouts
- Card-based structure
- Camera feed on left (or top on mobile)
- Content/question center
- Response input bottom

## Database Schema (New)

```sql
CREATE TABLE a3_session_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  module_id TEXT NOT NULL,
  session_type TEXT NOT NULL, -- 'coach_training' or 'interviewer_simulation'
  lead_character TEXT NOT NULL, -- 'coach', 'sofia', 'elena', 'bruno'
  difficulty TEXT NOT NULL, -- 'adaptive', 'basic', 'advanced', 'pro'
  is_route_checkpoint BOOLEAN DEFAULT false,
  is_replay BOOLEAN DEFAULT false,
  related_a2_day INT,
  score INT,
  feedback TEXT,
  deliverable JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

## Critical Success Factors

1. ✓ All module content remains 100% unchanged
2. ✓ A2→A3 checkpoint connections work seamlessly
3. ✓ Camera/mic verification blocks unauthorized access
4. ✓ Salmon background replaces all white borders in tips
5. ✓ Character selection enables after Basic completion only
6. ✓ Replay mode doesn't modify original progression
7. ✓ All styling matches main A3 page design
8. ✓ Database tracks all session attempts for reporting

## Timeline
- Total Implementation: 10 days
- Phase 1 (Components): 2 days
- Phase 2 (UI): 2 days
- Phase 3 (Logic): 2 days
- Phase 4 (Routes): 2 days
- Phase 5 (Testing): 2 days

