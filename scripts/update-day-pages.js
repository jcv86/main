#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const APP_DIR = path.join(__dirname, '../app/despega/a2')

// Template for new day pages using the component
const generateDayPageContent = (dayNum) => {
  return `'use client'

import { A2DayPageTemplate } from '@/components/a2-day-page-template'

const DIA_NUM = ${dayNum}

export default function DiaPage() {
  return <A2DayPageTemplate dayNumber={DIA_NUM} />
}
`
}

// Update days 2-90
let updated = 0
let failed = 0

for (let day = 2; day <= 90; day++) {
  try {
    const dayDir = path.join(APP_DIR, 'dia-' + day)
    const pageFile = path.join(dayDir, 'page.tsx')

    // Ensure directory exists
    if (!fs.existsSync(dayDir)) {
      fs.mkdirSync(dayDir, { recursive: true })
    }

    // Write the new page content
    const content = generateDayPageContent(day)
    fs.writeFileSync(pageFile, content, 'utf-8')
    updated++
    console.log('✓ Updated dia-' + day)
  } catch (error) {
    failed++
    console.error('✗ Failed to update dia-' + day + ':', error.message)
  }
}

console.log('')
console.log('Summary:')
console.log('  Updated: ' + updated + ' pages')
console.log('  Failed: ' + failed + ' pages')
console.log('  Total: ' + (updated + failed))

