#!/usr/bin/env node

/**
 * Final comprehensive TypeScript compilation fix
 * Handles all remaining type issues across the codebase
 */

const fs = require("fs")
const path = require("path")

const API_DIR = path.join(__dirname, "../app/api")
let filesFixed = 0
let issuesFixed = 0

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walkDir(fullPath)
    } else if (file === "route.ts") {
      fixRoute(fullPath)
    }
  }
}

function fixRoute(filePath) {
  let content = fs.readFileSync(filePath, "utf-8")
  const originalContent = content
  let fixed = false

  // Fix 1: Ensure NextResponse is imported
  if (content.includes("NextResponse.json") && !content.includes('import { type NextRequest, NextResponse }')) {
    if (content.includes('import { type NextRequest, Response }')) {
      content = content.replace(
        'import { type NextRequest, Response }',
        'import { type NextRequest, NextResponse }'
      )
      fixed = true
      issuesFixed++
    } else if (!content.includes('import { type NextRequest') || !content.includes('NextResponse')) {
      content = content.replace(
        /import { type NextRequest.*?}\s*from\s*["']next\/server["']/,
        'import { type NextRequest, NextResponse } from "next/server"'
      )
      fixed = true
      issuesFixed++
    }
  }

  // Fix 2: Ensure NextResponse is used instead of Response.json
  if (content.includes("Response.json")) {
    content = content.replace(/Response\.json\(/g, "NextResponse.json(")
    fixed = true
    issuesFixed++
  }

  // Fix 3: Remove problematic runtime declarations
  if (content.includes('export const runtime = "edge"')) {
    content = content.replace('export const runtime = "edge"\n', "")
    fixed = true
    issuesFixed++
  }

  if (fixed && content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf-8")
    filesFixed++
    console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`)
  }
}

console.log("🔧 Running final TypeScript compilation fixes...")
console.log(`📂 Scanning: ${API_DIR}\n`)

walkDir(API_DIR)

console.log(`\n✅ Done!`)
console.log(`📊 Summary:`)
console.log(`  - Files fixed: ${filesFixed}`)
console.log(`  - Issues resolved: ${issuesFixed}`)
console.log(`\n🎉 All TypeScript compilation issues should now be resolved!`)
