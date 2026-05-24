# Development Guide - Preventing TypeScript Errors

## Current Status
✅ **All TypeScript compilation errors have been fixed**
✅ **Project is now deployment-ready**

## How to Continue Development Without Errors

### 1. **Before Starting Any Work**

Run this command to validate the project builds:
```bash
npm run build
# or
pnpm run build
```

If it fails, you'll see exactly what needs fixing before proceeding.

### 2. **When Adding New API Routes**

Always follow this pattern:

```typescript
// CORRECT - Template to follow
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30 // Set appropriate timeout

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Your route logic here
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Route error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### 3. **Import Checklist**

Before using a function, verify it exists:

✅ **DO THIS:**
```typescript
// Step 1: Check if function exists in lib file
// Step 2: Import it at the top
import { myFunction } from "@/lib/my-utils"
// Step 3: Use it in your route
const result = myFunction(data)
```

❌ **DON'T DO THIS:**
```typescript
// Don't call functions that don't exist
const result = nonExistentFunction(data) // ERROR!

// Don't use undefined variables
const x = nonDefinedVariable // ERROR!
```

### 4. **Library Function Rules**

**Only use these function patterns:**

| Function | Location | Status |
|----------|----------|--------|
| `createClient()` | `@/lib/supabase/server` | ✅ Use it |
| `selectPersonality()` | `@/lib/sofia-dani-prompts` | ✅ Use it |
| `detectIntention()` | `@/lib/intention-detector` | ✅ Use it |
| `generateStructuredResponse()` | `@/lib/sofia-dani-prompts` | ✅ Use it |
| `trackEngagement()` | ❌ DOESN'T EXIST | Don't use it |
| `generateFollowUpSuggestions()` | ❌ DOESN'T EXIST | Don't use it |
| `createAdminClient()` | ❌ DEPRECATED | Use `createClient()` instead |
| `createServerClient()` | ❌ DEPRECATED | Use `createClient()` instead |

### 5. **Database Error Handling**

**WRONG - This will cause errors:**
```typescript
const result = await supabase.from("table").insert(data).catch(err => {})
```

**RIGHT - Use try-catch:**
```typescript
try {
  const { data, error } = await supabase.from("table").insert(data)
  if (error) throw error
} catch (err) {
  console.error("[v0] Database error:", err)
}
```

### 6. **When You Get a "Cannot find name" Error**

**Step-by-step fix:**

1. **Identify the function name** from the error message
2. **Search for it in the lib folder:**
   ```bash
   grep -r "export.*functionName" lib/
   ```
3. **If found**, add it to your imports:
   ```typescript
   import { functionName } from "@/lib/correct-file"
   ```
4. **If NOT found**, remove the function call or implement it inline

### 7. **Quick Debugging Commands**

Check for all TypeScript errors:
```bash
npm run build 2>&1 | grep "Type error"
```

Find files with specific functions:
```bash
grep -r "export.*functionName" app/ lib/
```

### 8. **Key Principles**

1. **Only use exported functions** - If a function isn't exported, you can't use it
2. **Always use try-catch** for async database operations
3. **Await all async functions** - `await supabase.from()...`
4. **Remove non-existent function calls** rather than trying to patch them
5. **Check imports first** before using any external function

### 9. **Testing New Routes**

After creating a new route:

```bash
# Build to check for TypeScript errors
npm run build

# If it builds successfully, you can test
curl http://localhost:3000/api/your-new-route
```

### 10. **Common Errors and Fixes**

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find name 'X'` | Function not imported | Add to imports from correct lib file |
| `Property 'catch' does not exist` | Wrong error handling | Use try-catch instead |
| `Cannot find module '@/lib/X'` | Wrong file path | Check lib folder for correct file |
| `Type error: ... is not assignable` | Wrong type used | Check function signature |

## Summary

The codebase is now clean. To keep it that way:
1. Always run `npm run build` before pushing changes
2. Only use functions that are explicitly exported
3. Use try-catch for all async operations
4. Follow the template patterns in existing routes
5. When unsure about a function, search lib/ folder first

**You can now continue development confidently!** 🚀
