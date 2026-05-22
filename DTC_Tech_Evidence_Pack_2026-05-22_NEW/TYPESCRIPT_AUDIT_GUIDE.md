# TypeScript Compilation Audit & Fix Checklist

## Quick Diagnostic Commands

```bash
# 1. Check for compilation errors
pnpm build 2>&1 | grep -A 5 "Type error"

# 2. List all test files
find app/test -name "*.tsx" | head -20

# 3. Check for common patterns causing issues
grep -r "\.type ===" app/test/
grep -r "\.options\." app/test/
grep -r "question\." app/test/ | grep -v "question\?"

# 4. Find all component usages
grep -r "<EnhancedCoachFlow" app/test/
grep -r "<TestCompletionScreen" app/test/
grep -r "<TestIntroScreen" app/test/
```

## Common TypeScript Issues in Test Files

### Issue Category 1: Missing Required Props
**Symptoms:** `Property 'X' is missing in type 'Y' but required in type 'Z'`

**Fix Pattern:**
```typescript
// ❌ WRONG
<EnhancedCoachFlow testType="DISC" testResults={results} />

// ✅ CORRECT
<EnhancedCoachFlow 
  testType="DISC" 
  testResults={results} 
  userEmail={user?.email || ""} 
/>
```

**Files to Check:**
- `/app/test/*/results/page.tsx` - Look for EnhancedCoachFlow
- `/app/test/*/page.tsx` - Look for TestCompletionScreen

---

### Issue Category 2: Type Property Access Without Type Guard
**Symptoms:** `Property 'type' does not exist on type '{...}'`

**Fix Pattern:**
```typescript
// ❌ WRONG
if (question.type === "multiple_choice") { ... }

// ✅ CORRECT
if ('type' in question && (question as any).type === "multiple_choice") { ... }
```

**Files to Check:**
- `/app/test/disc/disc-client.tsx`
- `/app/test/*/results/page.tsx`

---

### Issue Category 3: Optional Chaining in Calculations
**Symptoms:** `'percent' is possibly 'undefined'`

**Fix Pattern:**
```typescript
// ❌ WRONG
label={({ percent }) => `${percent * 100}%`}

// ✅ CORRECT
label={({ percent }) => `${(percent ?? 0) * 100}%`}
```

**Files to Check:**
- `/app/test/*/results/page.tsx` - Look for chart labels

---

### Issue Category 4: Function Signature Mismatches
**Symptoms:** `Expected 3-4 arguments, but got 1`

**Fix Pattern:**
```typescript
// ❌ WRONG
const result = await UnifiedTestSystem.saveTestResult({
  userEmail: user.email,
  testType: "Test",
  testResults: results,
  durationMinutes: 30
})

// ✅ CORRECT
const result = await UnifiedTestSystem.saveTestResult(
  user.email,
  "Test",
  results,
  30
)
```

**Files to Check:**
- Search: `grep -r "saveTestResult" app/test/`

---

## Systematic Fix Process

### Step 1: Run Audit
```bash
python3 scripts/typescript-audit.py
```

### Step 2: Fix by Severity
1. **HIGH** - Blocking compilation
   - Missing required props
   - Wrong function signatures
   - Type mismatches

2. **MEDIUM** - Type safety issues
   - Optional property access
   - Type guards needed
   - Unsafe casts

3. **LOW** - Best practices
   - Use optional chaining
   - Reduce use of 'any'

### Step 3: Verify Each Fix
```bash
# After each fix, run:
pnpm build 2>&1 | head -20
```

### Step 4: Commit and Push
```bash
git add -A
git commit -m "fix: TypeScript issues in [test-name]"
git push origin HEAD
```

---

## Component Props Reference

### EnhancedCoachFlowProps
```typescript
interface EnhancedCoachFlowProps {
  testType: string          // REQUIRED
  testResults: any          // REQUIRED
  userEmail: string         // REQUIRED
}
```

### TestCompletionScreenProps
```typescript
interface TestCompletionScreenProps {
  testType: "disc" | "ei" | "mbti" | "big-five" | "riasec" | "soft-skills"
  testName?: string
  quickSummary?: string
  keyInsight?: string
  onClose?: () => void
}
```

### TestIntroScreenProps
```typescript
interface TestIntroScreenProps {
  title?: string
  description?: string
  whatItMeasures?: string[]
  dimensions?: Array<{ name: string; description: string }>
  estimatedTime?: number
  onStart: () => void
  onBack?: () => void
}
```

---

## Quick Fix Commands

```bash
# Find all EnhancedCoachFlow usages without userEmail
grep -r "EnhancedCoachFlow" app/test/ | grep -v "userEmail"

# Find all question.type without type guard
grep -r "question\.type ===" app/test/

# Find all saveTestResult with object parameter
grep -r "saveTestResult({" app/test/

# Find all percent accesses in charts
grep -r "percent \*" app/test/
```

---

## File Checklist

- [ ] `/app/test/big-five/big-five-client.tsx`
- [ ] `/app/test/big-five/page.tsx`
- [ ] `/app/test/big-five/results/page.tsx`
- [ ] `/app/test/disc/disc-client.tsx`
- [ ] `/app/test/disc/page.tsx`
- [ ] `/app/test/disc/results/page.tsx`
- [ ] `/app/test/mbti/mbti-client.tsx`
- [ ] `/app/test/riasec/riasec-client.tsx`
- [ ] `/app/test/emotional-intelligence/page.tsx`
- [ ] `/app/test/soft-skills/page.tsx`

---

## When Everything Compiles

```bash
# Final check
pnpm build

# If successful:
git add -A
git commit -m "fix: resolve all TypeScript compilation errors across all tests"
git push origin HEAD

# Force redeploy
# 1. Go to https://vercel.com/dashboard
# 2. Select project → Deployments → Latest → ... → Redeploy
```
