import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function source(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

const upload = source('components/a2-day2-upload.tsx')
const classification = source('components/a2-day2-classification.tsx')
const goldPieces = source('components/a2-day2-gold-pieces.tsx')
const completion = source('components/a2-day2-completion.tsx')
const experience = source('components/a2-day2-experience.tsx')
const validator = source('lib/a2/specialized-day-validation.ts')

assert.match(upload, /text,\s*category: ["']{2}/)
assert.ok(upload.includes('fragments.length >= 7'))
assert.ok(!upload.includes('FileReader'))
assert.ok(!upload.includes('readAsText'))
assert.ok(!upload.includes('PDF, DOCX'))
assert.ok(!upload.includes('TRAVIS_DAY2_UPLOAD_FRAGMENTS'))

assert.ok(classification.includes('fragment.category'))
assert.ok(classification.includes('fragment.text'))
assert.ok(classification.includes('classifiedCount >= 3'))
assert.ok(!classification.includes('Math.random'))
assert.ok(!classification.includes('setTimeout'))
assert.ok(!classification.includes('automáticamente'))

assert.ok(goldPieces.includes('{frag.text}'))
assert.ok(goldPieces.includes('{frag.category}'))
assert.ok(!goldPieces.includes('frag.rawText'))
assert.ok(!goldPieces.includes('potentialCV'))

assert.ok(completion.includes('Día 2 listo para validar'))
assert.ok(completion.includes('role="alert"'))
assert.ok(!completion.includes('DÍA 2 APROBADO'))
assert.ok(!completion.includes('+50 XP'))
assert.match(experience, /["']Registrar Fragmentos["']/)
assert.ok(experience.includes('throw err'))

assert.ok(validator.includes("arrayValue(vault.fragments)"))
assert.ok(validator.includes("objectValue(item).category"))

console.log(
  JSON.stringify({
    evidenceLevel: 'source_only',
    textOnlyEvidenceCapture: true,
    userOwnedClassification: true,
    validatorShapeAligned: true,
    prematureApprovalRemoved: true,
    completionErrorsReachUi: true,
  }),
)
