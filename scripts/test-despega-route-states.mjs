import fs from 'node:fs'

const loading = fs.readFileSync('app/despega/loading.tsx', 'utf8')
const error = fs.readFileSync('app/despega/error.tsx', 'utf8')
const notFound = fs.readFileSync('app/despega/not-found.tsx', 'utf8')

const requirements = [
  ['loading uses LoadingState', loading.includes('<LoadingState')],
  ['loading uses PageContainer', loading.includes('<PageContainer>')],
  ['error is client component', error.startsWith("'use client'")],
  ['error exposes reset', error.includes('reset: () => void')],
  ['error wires retry', error.includes('onRetry={reset}')],
  ['not-found uses EmptyState', notFound.includes('<EmptyState')],
  ['not-found links to dashboard', notFound.includes('href="/despega/dashboard"')],
  ['not-found links to despega home', notFound.includes('href="/despega"')],
  ['no nested main in loading', !loading.includes('<main')],
  ['no nested main in error', !error.includes('<main')],
  ['no nested main in not-found', !notFound.includes('<main')],
]

const failed = requirements.filter(([, passed]) => !passed)

if (failed.length > 0) {
  console.error('Despega route states contract failed:')
  for (const [name] of failed) console.error(`- ${name}`)
  process.exit(1)
}

console.log(JSON.stringify({ routeStates: ['loading', 'error', 'not-found'], canonicalFoundation: true }))
