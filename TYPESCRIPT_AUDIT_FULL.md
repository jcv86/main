# TypeScript Type Safety Audit - Complete Site

**Generated:** 2026-03-24  
**Total Issues Found:** 90+  
**Priority Breakdown:** CRITICAL (0) | HIGH (15) | MEDIUM (35) | LOW (40+)

---

## CRITICAL ISSUES (Blocking Deployment)
None currently - all compilation blockers have been fixed.

---

## HIGH PRIORITY (Code Quality - Should Fix)

### 1. Browser API Type Bypasses (8 instances)
These use `(window as any)` or `(navigator as any)` for browser APIs that lack proper types.

**Files:**
- `lib/hooks/use-speech-recognition.ts:30` - SpeechRecognition API
- `components/persistent-ai-coach.tsx:194` - SpeechRecognition API
- `components/ai-coach-chat.tsx:54` - SpeechRecognition API
- `components/enhanced-ai-coach.tsx:81` - SpeechRecognition API
- `components/mobile-test-detector.tsx:85,91` - Navigator connection API
- `components/mobile-gesture-tester.tsx:246,249` - Touch ref casting
- `components/gesture-enhanced-test-interface.tsx:123,126` - Touch ref casting

**Recommendation:** Create utility types for these browser APIs:
```typescript
// types/browser-apis.ts
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
```

---

### 2. Promise/Data Type Issues (7 instances)

**Files:**
- `app/despega/a3/page.tsx:44` - Promise.race result needs proper type
- `app/despega/a1-report/page.tsx:48` - testData.test_data type unknown
- `app/metas/metas-client.tsx:434` - select value type casting
- `app/api/coach-ia/route.ts:33` - stage type unknown
- `app/api/prompt-assignment/route.ts:33-35` - existingAssignment.prompt_variants type

**Recommendation:** Define proper interfaces for all API responses and database models.

---

### 3. Error Handler Type Issues (7 instances)

**Files:**
- `app/test/mbti/results/page.tsx:252` - `catch (error: any)`
- `app/test/emotional-intelligence/results/page.tsx:195` - `catch (error: any)`
- `app/test/emotional-intelligence/page.tsx:367` - `catch (error: any)`
- `app/test-openai-brain/page.tsx:34` - `catch (err: any)`
- `lib/unified-test-system.ts:87,133,243` - `catch (e: any)`
- `lib/test-storage.ts:74` - `catch (error: any)`

**Recommendation:** Create proper Error types:
```typescript
// types/errors.ts
interface AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: Record<string, unknown>;
}
```

---

## MEDIUM PRIORITY (Code Organization - Nice to Fix)

### 4. Map/Filter Callback Types (20+ instances)

**Files:**
- `app/documents/page.tsx:59-60` - `.filter((doc: any))` and `.map((doc: any))`
- `app/despega/rutas/page.tsx:150,162` - `.forEach((p: any))`, async results
- `app/despega/rankings/page.tsx:61` - `.map((h: any) =>...)`
- `app/test/emotional-intelligence/results/page.tsx:122` - callback parameter
- `app/despega/a2/rutas/page.tsx:135` - `.map((route: any) =>...)`
- `lib/supabase/a4-queries.ts:217` - `.map((cat: any) =>...)`
- `lib/suggestion-generator.ts:82` - `.map((q: any, index)...)`

**Recommendation:** Use proper TypeScript generics instead of `any`:
```typescript
// Before
docs.filter((doc: any) => doc.is_active)

// After
docs.filter((doc: Document) => doc.is_active)
```

---

### 5. Function Parameter Types (15+ instances)

**Files:**
- `lib/whatsapp-service.ts:43,79,106` - Method parameters with `any`
- `app/test/page.tsx:32` - Icon property type
- `app/test-verification/page.tsx:43` - Icon property type
- `app/despega/a3/entrenamiento-guiado/page.tsx:83` - Module parameter
- `app/test-performance/page.tsx:15` - Device change handler
- `app/test-gestures/page.tsx:28,49` - Icon and device handler

**Recommendation:** Create interface definitions for commonly used parameter types:
```typescript
interface Icon { name: string; size?: number; color?: string; }
interface Device { id: string; name: string; type: string; }
```

---

### 6. Utility Function Generic Types (4 instances)

**Files:**
- `lib/utils.ts:55` - debounce function with `any[])>`
- `lib/utils.ts:64` - throttle function with `any[])`

**Status:** These are intentionally generic and acceptable.

---

## LOW PRIORITY (Acceptable - Library/External Integration)

### 7. Supabase/Database Types (10+ instances)

**Files:**
- `lib/supabase.ts:26,60` - Server client null casting
- `app/despega/page.tsx:16` - a3_progress: any
- `app/test/big-five/results/page.tsx:66` - results: any
- `lib/supabase/a4-queries.ts:256` - resourceData?: any
- `lib/unified-test-system.ts:15,30,32` - results: any in multiple places

**Status:** These are acceptable due to dynamic database structure. Generate types from Supabase schema when possible.

---

### 8. Component Event Handlers (5+ instances)

**Files:**
- `components/application-status-tracker.tsx:237` - `new Event("submit") as any`
- `components/ai-reading-companion.tsx:202` - `type: type as any`

**Status:** Acceptable for event handling where type strictness is not critical.

---

### 9. Context/Configuration Types (8+ instances)

**Files:**
- `lib/sofia-dani-prompts.ts:767,946` - userContext?: any
- `lib/resource-context-matcher.ts:15,16,33,101` - userProfile: any, performanceData?: any
- `lib/readiness-score.ts:16,18,19` - a1_profile: any, a2_routes: any, a3_progress: any
- `lib/performance-optimizer.ts:21,50` - userContext?: any, responseData: any
- `lib/personalization/disc-engine.ts:66,67` - newsItems: any[]
- `lib/platform-brain.ts:2` - let supabase: any = null

**Status:** These are acceptable for context objects where type flexibility is needed. Document expected structure.

---

## SUMMARY BY SEVERITY

| Priority | Count | Impact | Effort |
|----------|-------|--------|--------|
| CRITICAL | 0 | 🔴 Blocking | High |
| HIGH | 15 | 🟠 Code Quality | Medium |
| MEDIUM | 20 | 🟡 Organization | Low-Medium |
| LOW | 40+ | 🟢 Nice-to-have | Low |

---

## RECOMMENDED FIX ORDER

### Phase 1: High Priority (1-2 days)
1. Create `types/browser-apis.ts` for SpeechRecognition and Navigator APIs
2. Create `types/errors.ts` with proper Error interfaces
3. Fix Promise/data type issues (7 instances)
4. Fix error handlers (7 instances)

### Phase 2: Medium Priority (2-3 days)
5. Create `types/common.ts` with standard interfaces (Icon, Device, Document, etc.)
6. Update map/filter callbacks with proper types (20+ instances)
7. Update function parameters (15+ instances)

### Phase 3: Low Priority (Optional)
8. Document context/configuration shapes for `any` types
9. Generate Supabase types from schema
10. Consider strictNullChecks enablement

---

## Type Creation Templates

### Browser APIs
```typescript
// types/browser-apis.ts
export type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

export type SpeechRecognitionErrorEvent = Event & {
  error: string;
};
```

### Common Entities
```typescript
// types/common.ts
export interface Icon {
  name: string;
  size?: number;
  color?: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
}

export interface Document {
  id: string;
  title: string;
  is_active: boolean;
  content?: string;
}
```

### Error Handling
```typescript
// types/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public context?: Record<string, unknown>,
  ) {
    super(message);
  }
}
```

---

## Verification Steps

1. **Run TypeScript compiler in strict mode:**
   ```bash
   npx tsc --strict --noImplicitAny
   ```

2. **Update tsconfig.json to enforce:
   ```json
   {
     "compilerOptions": {
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true
     }
   }
   ```

3. **Create GitHub Actions CI to prevent new `any` types:**
   ```yaml
   - name: Check TypeScript strictness
     run: npm run type-check -- --strict
   ```

---

## Notes

- ✅ All compilation blockers fixed
- ✅ No @ts-ignore or @ts-expect-error needed
- ✅ Browser API casts are acceptable for now
- ⚠️ Consider gradual strictNullChecks enablement
- ⚠️ Document external library integrations
