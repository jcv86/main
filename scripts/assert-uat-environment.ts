import { inspectUatEnvironment } from '../lib/uat/environment'

// The regular build hook protects automatic Vercel Previews too, even if a
// project-level command calls `npm run build` instead of `build:uat`.
// Local non-UAT source compilation keeps the existing fixture workflow.
const ifHosted = process.argv.includes('--if-hosted')
const hosted = Boolean(process.env.VERCEL || process.env.VERCEL_ENV)
const required = !ifHosted || hosted || process.env.DTC_ENVIRONMENT === 'uat'
const result = inspectUatEnvironment(process.env, required)
if (!result.valid) {
  console.error('UAT build refused before application compilation:')
  for (const issue of result.issues) console.error(`- ${issue}`)
  process.exitCode = 1
} else if (result.enabled) {
  console.log('UAT environment validated: separate application and backend configuration.')
} else {
  console.log('Local source compilation: no hosted UAT environment asserted.')
}
