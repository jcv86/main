# Pillar 3 Module Standardization & Completion Plan

## Current State Analysis

### ✅ REAL MODULES (Fully Functional)
1. **Module 1 - Auditoría Inicial** (13 lines)
   - Status: Redirect to `/despega/interview-0`
   - Type: Full interview experience
   - XP: 70

2. **Module 3 - CV Inteligente** (739 lines)
   - Status: Full implementation with CV parsing, ATS analysis
   - Type: Content analysis with real processing
   - XP: 120

3. **Module 5 - Análisis Multimodal** (167 lines)
   - Status: Video recording with AI analysis
   - Type: Video recording → Analysis pipeline
   - XP: 120

4. **Module 8 - Entrenamiento Desafiante** (606 lines)
   - Status: Full video interview with mic/audio
   - Type: Real-time video interview training
   - XP: 120

### ⚠️ MOCK MODULES (Scaffolds/Placeholders)
2. **Module 2 - Método STAR** (289 lines) - Form builder, no AI
4. **Module 4 - Análisis Vacante** (391 lines) - Mock job analysis
6. **Module 6 - Entrenamiento Guiado** (164 lines) - Placeholder lessons
7. **Module 7 - Entrenamiento Estructurado** (369 lines) - Q&A with mock data
9. **Module 9 - Entrenamiento Conversacional** (402 lines) - Mock scenarios
10. **Module 10 - Simulación Real** (494 lines) - Mock stages

---

## Recommended Approach: HYBRID

### Phase 1: AI Integration (Priority)
Add LLM processing to existing mock modules without changing UI:
- Module 2: Claude evaluates STAR responses
- Module 4: Parse job descriptions with LLM
- Module 6: Load real content
- Module 7: Generate questions + evaluate answers
- Module 9: AI conversation engine
- Module 10: AI interviewer logic

### Phase 2: Video Enhancement (Optional)
Sync mock modules with real module patterns (Modules 3, 5, 8):
- Optional video for Modules 2, 4, 7, 9, 10
- Reuse VideoRecorder component

---

## Quick Implementation Path

1. **Create evaluation API:** `/api/a3/evaluate-response` (LLM-based)
2. **Update modules 2, 4, 6, 7, 9, 10** to call evaluation API
3. **Test XP awards** for all 10 modules
4. **Phase 2:** Add optional video mode if needed

---

## Benefits of This Approach
- ✅ Users get real AI feedback (not mock data)
- ✅ Consistent 2-button completion flow across all modules
- ✅ No major UI rewrites needed
- ✅ Can add video later as enhancement
- ✅ Fixes the "mess" while maintaining current navigation
