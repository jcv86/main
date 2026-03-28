#!/usr/bin/env node
/**
 * Rapid TypeScript fixer - fixes the 5 most common compilation issues
 * Run this to bulk-fix most routes
 */

const fs = require("fs")
const path = require("path")
const glob = require("glob").sync

const apiDir = path.join(__dirname, "../app/api")
const routeFiles = glob(`${apiDir}/**/route.ts`).filter(
  (f) => !f.includes("_examples")
)

console.log(`Processing ${routeFiles.length} route files...\n`)

let stats = {
  responseJsonFixed: 0,
  runtimeEdgeRemoved: 0,
  untypedCallbacksFixed: 0,
  importsFixed: 0,
  totalFilesModified: 0,
}

const commonSupabaseTypes = {
  book: `{
    id: string | number
    title: string
    author: string
    category: string
    difficulty_level: string
    estimated_read_time: number | null
  }`,
  conversation: `{
    id: string | number
    type: string
    content: string
    created_at: string
    category?: string | null
    suggested_actions?: unknown[] | null
    metadata?: Record<string, unknown> | null
  }`,
  insight: `{
    id: string | number
    type: string
    title: string
    description: string
    priority: string
    progress?: number | null
    actionable: boolean
    category: string
    created_at: string
    updated_at: string
  }`,
  user: `{
    id: string
    email: string
    full_name?: string
    created_at?: string
    updated_at?: string
  }`,
}

routeFiles.forEach((file) => {
  try {
    let content = fs.readFileSync(file, "utf-8")
    const originalContent = content
    let modified = false

    // Fix 1: Response.json() -> NextResponse.json()
    if (content.includes("Response.json(")) {
      if (!content.includes("import { NextResponse }")) {
        content = content.replace(
          /import\s*{\s*type\s+NextRequest\s*}/,
          "import { type NextRequest, NextResponse }"
        )
        stats.importsFixed++
      }
      content = content.replace(/\bResponse\.json\(/g, "NextResponse.json(")
      stats.responseJsonFixed++
      modified = true
    }

    // Fix 2: Remove export const runtime = 'edge'
    if (content.includes('runtime = "edge"') || content.includes("runtime = 'edge'")) {
      content = content.replace(
        /export\s+const\s+runtime\s*=\s*['"]edge['"]\s*\n/g,
        ""
      )
      stats.runtimeEdgeRemoved++
      modified = true
    }

    // Fix 3: Add type to Supabase .map() callbacks
    // Pattern: data.map((item) => ({ ...
    const mapPatterns = [
      {
        pattern: /(\w+)\.map\(\((book)\)\s*=>\s*\(\{/g,
        typeKey: "book",
      },
      {
        pattern: /(\w+)\.map\(\((conv)\)\s*=>\s*\(\{/g,
        typeKey: "conversation",
      },
      {
        pattern: /(\w+)\.map\(\((insight)\)\s*=>\s*\(\{/g,
        typeKey: "insight",
      },
      {
        pattern: /(\w+)\.map\(\((user)\)\s*=>\s*\(\{/g,
        typeKey: "user",
      },
    ]

    mapPatterns.forEach(({ pattern, typeKey }) => {
      if (pattern.test(content)) {
        const typeString = commonSupabaseTypes[typeKey]
        content = content.replace(
          pattern,
          `$1.map(($2: ${typeString}) => ({`
        )
        stats.untypedCallbacksFixed++
        modified = true
      }
    })

    // Fix 4: Generic untyped map -> add Record<string, unknown>
    content = content.replace(
      /\.map\(\((\w+)\)\s*=>\s*\(\{(?!\s*\.\.\.)/g,
      `.map(($1: Record<string, unknown>) => ({`
    )

    // Fix 5: Add type to reduce callbacks with (sum, item)
    content = content.replace(
      /\.reduce\(\((sum),\s*(\w+)\)\s*=>/g,
      ".reduce((sum: number, $2: Record<string, unknown>) =>"
    )
    if (content.includes(".reduce((sum: number")) {
      stats.untypedCallbacksFixed++
      modified = true
    }

    if (modified) {
      if (content !== originalContent) {
        fs.writeFileSync(file, content)
        stats.totalFilesModified++
        const shortPath = file.replace(apiDir, "")
        console.log(`✓ ${shortPath}`)
      }
    }
  } catch (err) {
    console.error(`✗ Error: ${file}: ${err.message}`)
  }
})

console.log(`\n=== Fix Summary ===`)
console.log(`Response.json() fixed: ${stats.responseJsonFixed}`)
console.log(`runtime='edge' removed: ${stats.runtimeEdgeRemoved}`)
console.log(`Untyped callbacks fixed: ${stats.untypedCallbacksFixed}`)
console.log(`Imports fixed: ${stats.importsFixed}`)
console.log(`Total files modified: ${stats.totalFilesModified}/${routeFiles.length}`)
