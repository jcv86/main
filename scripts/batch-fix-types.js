#!/usr/bin/env node
/**
 * Automated batch TypeScript fixer
 * Fixes common compilation issues across all API routes
 */

const fs = require("fs")
const path = require("path")
const glob = require("glob").sync

const apiDir = path.join(__dirname, "../app/api")
const routeFiles = glob(`${apiDir}/**/route.ts`)

let fixed = 0
let errors = 0

routeFiles.forEach((file) => {
  try {
    let content = fs.readFileSync(file, "utf-8")
    let hasChanges = false

    // Fix 1: Replace Response.json with NextResponse.json
    if (content.includes("Response.json(") && !content.includes("NextResponse")) {
      if (!content.includes('import { NextResponse }')) {
        content = content.replace(
          'import { type NextRequest, NextResponse }',
          'import { type NextRequest, NextResponse }'
        )
        if (!content.includes("NextResponse")) {
          content = content.replace(
            "import { type NextRequest }",
            "import { type NextRequest, NextResponse }"
          )
        }
      }
      content = content.replace(/Response\.json\(/g, "NextResponse.json(")
      hasChanges = true
    }

    // Fix 2: Remove runtime = 'edge' statements (causes issues)
    if (content.includes('runtime = "edge"')) {
      content = content.replace(/export const runtime = ['"]edge['"]\s*\n/g, "")
      hasChanges = true
    }

    // Fix 3: Add proper type annotations to map callbacks in common patterns
    content = content.replace(
      /\.map\(\(([\w]+)\)\s*=>\s*\(\{\s*\n\s*id:/g,
      ".map(($$1: { id: string | number } & Record<string, unknown>) => ({\\nid:"
    )
    if (content.includes("(")) {
      hasChanges = true
    }

    if (hasChanges) {
      fs.writeFileSync(file, content)
      fixed++
      console.log(`✓ Fixed: ${file.replace(apiDir, "")}`)
    }
  } catch (err) {
    errors++
    console.error(`✗ Error processing ${file}: ${err.message}`)
  }
})

console.log(`\n=== Summary ===`)
console.log(`Fixed files: ${fixed}`)
console.log(`Errors: ${errors}`)
console.log(`Total processed: ${routeFiles.length}`)
