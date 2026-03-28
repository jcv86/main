#!/usr/bin/env node
/**
 * Systematic TypeScript type fixing script
 * This script applies consistent type fixes across API routes
 */

const fs = require("fs")
const path = require("path")
const glob = require("glob").sync

const apiDir = path.join(__dirname, "../app/api")
const routeFiles = glob(`${apiDir}/**/route.ts`)

console.log(`Found ${routeFiles.length} route files to analyze`)

const issues = {
  untypedMapCallbacks: [],
  untypedReduceCallbacks: [],
  usingGenerateText: [],
  usingResponseJson: [],
  untypedSubabaseQueries: [],
}

routeFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8")
  const filename = file.replace(apiDir, "")

  // Check for untyped map callbacks
  if (/\.map\(\s*\(\s*([a-zA-Z_]\w*)\s*(?:,\s*([a-zA-Z_]\w*)?)?\s*\)\s*=>/.test(content)) {
    if (!/\.map\(\s*\(\s*([a-zA-Z_]\w*)\s*:\s*\{/.test(content)) {
      issues.untypedMapCallbacks.push(filename)
    }
  }

  // Check for untyped reduce callbacks
  if (/\.reduce\(\s*\(\s*([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s*\)\s*=>/.test(content)) {
    if (!/\.reduce\(\s*\(\s*([a-zA-Z_]\w*)\s*:\s*/.test(content)) {
      issues.untypedReduceCallbacks.push(filename)
    }
  }

  // Check for AI SDK usage
  if (content.includes("generateText") && !content.includes("@/lib/openai-wrapper")) {
    issues.usingGenerateText.push(filename)
  }

  // Check for Response.json
  if (content.includes("Response.json(") && !content.includes("NextResponse")) {
    issues.usingResponseJson.push(filename)
  }

  // Check for untyped Supabase queries
  if (/\.select\([^)]*\)/.test(content) && !content.includes("querySupabase")) {
    if (/await\s+\w+\.from\(/.test(content)) {
      issues.untypedSubabaseQueries.push(filename)
    }
  }
})

console.log("\n=== TypeScript Type Issues Found ===\n")
console.log(`Untyped map callbacks: ${issues.untypedMapCallbacks.length}`)
console.log(`Untyped reduce callbacks: ${issues.untypedReduceCallbacks.length}`)
console.log(`Using generateText (AI SDK): ${issues.usingGenerateText.length}`)
console.log(`Using Response.json: ${issues.usingResponseJson.length}`)
console.log(`Untyped Supabase queries: ${issues.untypedSubabaseQueries.length}`)

if (issues.untypedMapCallbacks.length > 0) {
  console.log("\n--- Files with untyped map() ---")
  issues.untypedMapCallbacks.slice(0, 10).forEach((f) => console.log(`  ${f}`))
  if (issues.untypedMapCallbacks.length > 10) {
    console.log(`  ... and ${issues.untypedMapCallbacks.length - 10} more`)
  }
}

if (issues.usingGenerateText.length > 0) {
  console.log("\n--- Files using generateText (need migration) ---")
  issues.usingGenerateText.slice(0, 10).forEach((f) => console.log(`  ${f}`))
  if (issues.usingGenerateText.length > 10) {
    console.log(`  ... and ${issues.usingGenerateText.length - 10} more`)
  }
}

console.log("\n=== Summary ===")
const totalIssues =
  Object.values(issues).reduce((sum, arr) => sum + arr.length, 0)
console.log(`Total issues found: ${totalIssues}`)
console.log(`Priority 1 (Critical): ${issues.usingGenerateText.length + issues.usingResponseJson.length}`)
console.log(`Priority 2 (High): ${issues.untypedSubabaseQueries.length}`)
console.log(`Priority 3 (Medium): ${issues.untypedMapCallbacks.length + issues.untypedReduceCallbacks.length}`)
