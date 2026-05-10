# Avatar Integration with A2-Routes Curriculum
## Strategic Plan: 90-Day Career Program + Virtual Interviewer System

---

## 1. Executive Vision

Integrate the DTC Avatar Interview System (6 virtual interviewers) into the 90-day A2-Routes curriculum so users practice realistic interview scenarios at strategic moments, building confidence progressively from Mes 1 through Mes 3.

### Integration Timeline
- **Mes 1 (Days 1-30)**: Safe practice with Sofía (warm, beginner-friendly)
- **Mes 2 (Days 31-60)**: Realistic practice with Andrés, Valentina, Mateo (standard to demanding)
- **Mes 3 (Days 61-90)**: Advanced practice with Rafael (senior, high difficulty)

---

## 2. Avatar Activation Points in A2-Routes

### Mes 1: Safe Practice

**Day 15** - "Entrevistas de Práctica y Preparación"
- Avatar: **Sofía Navarro** (Warm orientator)
- Level: 1 (Safe beginning)
- Goal: Build confidence, practice basic STAR structure
- Video moments: greeting, thinking, farewell

**Day 20** - "Revisión del Punto Medio"
- Recommendation: Repeat with Sofía OR upgrade to Andrés
- Level: 1-2 transition

### Mes 2: Realistic Practice

**Day 35** - "Proyecto Complejo: Multi-Skill Integration"
- Avatar: **Andrés Rojas** (Standard corporate recruiter)
- Level: 2 (Realistic standard)

**Day 42** - "Participación en Comunidad Profesional"
- Option: **Valentina Muñoz** (Direct manager)
- Level: 2-3 (Competencies)

**Day 48** - "Buscar Oportunidades: Informar a Contactos"
- Option: **Mateo Silva** (Startup/commercial, fast-paced)
- Level: 2-3 (Speed + clarity)

**Day 55** - "Hito 55 días: Mid-course Review"
- Allow user choice based on perceived needs
- Selector showing all avatars attempted so far

### Mes 3: Advanced Practice

**Day 60** - "Mes 2 Completado: Full Checkpoint"
- Transition to **Camila Fuentes** (Institutional) or **Rafael Araya** (Senior)
- Level: 3-4 (Demanding)

**Day 75** - "Long-term Vision: Career Strategy"
- Avatar: **Rafael Araya** (Senior, demanding)
- Level: 4 (Pressure, precision, evidence)

**Day 90** - "Mes 3 COMPLETADO: Evaluación Integral"
- Simulate panel interview (v1.5) or final Rafael session at max difficulty
- Level: 4-5 (High difficulty)

---

## 3. Data Structure: Avatars Schema

Each avatar needs:
```
{
  id: 'sofia-navarro',
  name: 'Sofía Navarro',
  role: 'Orientadora laboral / primera práctica',
  difficulty: 'low-medium',
  tone: 'Cálida, pausada, contenedora',
  visual: 'Mujer adulta joven, look profesional, fondo claro',
  videos: {
    greeting: '/videos/avatars/sofia-greeting.mp4',
    thinking: '/videos/avatars/sofia-thinking.mp4',
    farewell: '/videos/avatars/sofia-farewell.mp4'
  },
  recommendedForDays: [15, 16, 17, 18, 19, 20],
  interviewStyle: 'HR_general',
  openingLine: 'Hola, soy Sofía. Vamos a practicar una entrevista segura...'
}
```

---

## 4. Required UI Components

### AvatarSelectorModal
- Shows 6 avatar cards with name, role, tone, difficulty
- Displays video thumbnail (greeting)
- "Practice with [Name]" button
- "Recommended for you" badge on suggested avatar

### AvatarPracticeScreen
- Avatar video player (greeting → listening → thinking → asking → farewell)
- Subtitle display
- User response area (voice or text)
- Progress bar / timer
- Pause button
- Session summary at end

### FeedbackScreen
- Strengths observed
- Opportunities for improvement
- Example reformulation
- Recommendation for next practice
- Option to repeat or change avatar

---

## 5. Supabase Tables Needed

### `avatars` table
```sql
id (text, pk), name, role, difficulty, tone, 
greeting_video_url, thinking_video_url, farewell_video_url,
opening_line, closing_line, created_at
```

### `avatar_practice_sessions` table
```sql
id (uuid, pk), user_id (fk), avatar_id (fk),
task_day (int), difficulty_level (int),
user_responses (json), feedback (text),
strengths (json), opportunities (json),
duration_seconds (int), completed_at, created_at
```

### Update `a2_user_task_completions`
Add optional field: `avatar_practice_session_id` to link completions with avatar practice

---

## 6. Integration Points

### In task-details.ts
Add to relevant days:
```typescript
avatarPractice: {
  enabled: true,
  recommendedAvatarId: 'sofia-navarro',
  difficultyLevel: 1,
  description: 'Practice your first safe interview with Sofía'
}
```

### In route-generator.ts
Include avatar practice info in route items so it appears as recommendation in UI

### In a2-routes/page.tsx
- Show "Practice Interview" CTA on days with avatarPractice enabled
- Modal on click → AvatarSelectorModal
- Link to full practice screen

---

## 7. User Experience Flow

1. User reaches Day 15
2. Sees "Practica Entrevista" CTA on task card
3. Clicks → AvatarSelectorModal appears
4. Sofía recommended, can explore others
5. Selects avatar → AvatarPracticeScreen opens
6. Sofía's greeting video plays + subtitle
7. Sofía asks first question
8. User responds (voice/text) → System processes via LLM
9. Sofía shows "thinking" video
10. Sofía may ask follow-up or move to next question
11. After 3-5 questions, Sofía's farewell video
12. FeedbackScreen shows personalized insights
13. Task marked "Completed with Avatar Practice"
14. Progress updates in database

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- Create avatars table + avatar_practice_sessions table
- Add avatarPractice field to task-details.ts (Day 15 MVP)
- Create AvatarSelectorModal component
- Create AvatarPracticeModal mockup component

### Phase 2: Simulation Engine (Week 3-4)
- Build AvatarPracticeScreen with video player
- Connect to LLM for response processing
- Implement basic feedback generation
- Save sessions to Supabase

### Phase 3: Full Integration (Week 5-6)
- Add avatarPractice to all 6 key days
- Implement intelligent avatar recommendations per stage
- Create practice reports / progress tracking
- Connect to Matrix DTC signals

### Phase 4: Real-time Avatar (v1.5+)
- Integrate video avatar provider (e.g., D-ID, Synthesia)
- Lip sync + expression animation
- Real-time response generation

---

## 9. Alignment with DTC Strategy

✅ **Strengthens Matrix**: Observable signals from each simulation
✅ **Progressive training**: Safe (Sofía) → Realistic (Andrés) → Demanding (Rafael)
✅ **Privacy by design**: Videos/transcripts help user only, no external sharing by default
✅ **Recommends, not judges**: Feedback focused on improvement, not pass/fail
✅ **Diversity without stereotypes**: 6 avatars, varied roles/genders/ages, difficulty in behavior not appearance
✅ **Accessibility**: Subtitles, text mode, question repeat, pause options

---

## 10. Success Metrics

- % of users completing ≥1 avatar practice session
- Improvement in responses between Session 1 and Session 5
- Average time per simulation
- % of users upgrading difficulty levels
- Correlation between avatar practice frequency and interview success (future)

