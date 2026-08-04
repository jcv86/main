import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TARGETS = [
  'app/design-system.css',
  'app/design-system',
  'components/ui/button.tsx',
  'components/ui/card.tsx',
  'components/ui/input.tsx',
  'components/ui/textarea.tsx',
  'components/ui/select.tsx',
  'components/ui/badge.tsx',
  'components/ui/checkbox.tsx',
  'components/ui/radio-group.tsx',
  'components/ui/progress.tsx',
  'components/ui/alert.tsx',
  'components/ui/skeleton.tsx',
]

const violations = []
const bannedPatterns = [
  { label: 'retired saturated color', regex: /#(?:0000ff|8000ff|3b82f6|8b5cf6|00bec8)\b/gi },
  { label: 'retired rgb color', regex: /rgb\(\s*(?:170\s*,\s*70\s*,\s*170|0\s*,\s*190\s*,\s*200)\s*\)/gi },
  { label: 'non-Montserrat product font', regex: /\b(?:Lora|Poppins|Inter)\b/g },
  { label: 'arbitrary Tailwind shadow', regex: /\bshadow-(?:sm|md|lg|xl|2xl)\b/g },
]

function collectFiles(relativePath) {
  const absolutePath = path.join(ROOT, relativePath)
  if (!fs.existsSync(absolutePath)) return []
  const stat = fs.statSync(absolutePath)
  if (stat.isFile()) return [absolutePath]
  return fs.readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(absolutePath, entry.name)
    if (entry.isDirectory()) return collectFiles(path.relative(ROOT, child))
    return /\.(?:tsx?|css)$/.test(entry.name) ? [child] : []
  })
}

const files = [...new Set(TARGETS.flatMap(collectFiles))]

for (const absolutePath of files) {
  const relativePath = path.relative(ROOT, absolutePath).replaceAll('\\', '/')
  const source = fs.readFileSync(absolutePath, 'utf8')

  for (const { label, regex } of bannedPatterns) {
    regex.lastIndex = 0
    if (regex.test(source)) violations.push(`${relativePath}: ${label}`)
  }

  if (/style=\{\{[^}]*\b(?:color|backgroundColor|borderColor)\s*:\s*['"`]#/.test(source)) {
    violations.push(`${relativePath}: literal inline color`)
  }

  if (relativePath.startsWith('components/ui/') && /focus:(?:ring|border)/.test(source) && !/focus-visible:(?:ring|border)/.test(source)) {
    violations.push(`${relativePath}: focus styling must use focus-visible`)
  }
}

const layout = fs.readFileSync(path.join(ROOT, 'app/layout.tsx'), 'utf8')
if (!layout.includes('Montserrat')) violations.push('app/layout.tsx: Montserrat must remain the canonical font')
if (/\bLora\b/.test(layout)) violations.push('app/layout.tsx: Lora is not allowed in product runtime')

if (violations.length > 0) {
  console.error('Design system compliance failed:\n')
  for (const violation of violations) console.error(`- ${violation}`)
  process.exit(1)
}

console.log(`Design system compliance passed (${files.length} files checked)`)
