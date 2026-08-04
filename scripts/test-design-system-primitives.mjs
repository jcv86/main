import fs from 'node:fs'

const files = [
  'components/ui/textarea.tsx',
  'components/ui/badge.tsx',
  'components/ui/select.tsx',
  'components/ui/progress.tsx',
  'components/ui/checkbox.tsx',
  'components/ui/radio-group.tsx',
  'components/ui/alert.tsx',
  'components/ui/skeleton.tsx',
]

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  if (/rgb\(170,\s*70,\s*170\)|rgb\(0,\s*190,\s*200\)|#8000FF|#0000FF/.test(source)) {
    throw new Error(`${file} still contains retired saturated brand colors`)
  }
}

const textarea = fs.readFileSync('components/ui/textarea.tsx', 'utf8')
const select = fs.readFileSync('components/ui/select.tsx', 'utf8')
const checkbox = fs.readFileSync('components/ui/checkbox.tsx', 'utf8')
const radio = fs.readFileSync('components/ui/radio-group.tsx', 'utf8')
const alert = fs.readFileSync('components/ui/alert.tsx', 'utf8')

for (const [name, source] of Object.entries({ textarea, select, checkbox, radio })) {
  if (!source.includes('focus-visible:ring')) throw new Error(`${name} must preserve accessible focus`)
}

if (!alert.includes('success') || !alert.includes('warning') || !alert.includes('info')) {
  throw new Error('Alert must expose semantic variants')
}

console.log('Design system primitives contract passed')
