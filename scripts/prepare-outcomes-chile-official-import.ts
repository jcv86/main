import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  parseOfficialChileBenchmarkManifest,
  prepareOfficialChileBenchmarkImport,
  renderOfficialChileBenchmarkSql,
  verifyOfficialChileSourceBytes,
} from '../lib/outcomes-chile/official-benchmark-import'

// No database connection or credentials are read. SQL is emitted for review only.
const args = process.argv.slice(2)
const allowed = ['--manifest=', '--format=', '--manifest-sha256=', '--sources-dir=']
if (args.includes('--help')) {
  console.log(`Prepare the official ESI national references without connecting to a database.

node --import tsx scripts/prepare-outcomes-chile-official-import.ts
  --manifest=data/outcomes-chile/official/ine-esi-2025-national.v1.json
  --format=plan|sql
  --sources-dir=/absolute/path/to/cached/official/pdfs
  --manifest-sha256=<hash obtained from the reviewed plan>

Default: print the validated plan. SQL output requires the exact manifest hash
and all original source PDFs with matching byte lengths and SHA-256 checksums.
The generator does not download, ingest, migrate or execute SQL.`)
} else {
  for (const arg of args) {
    if (!allowed.some(prefix => arg.startsWith(prefix))) throw new Error(`Unknown option: ${arg.split('=')[0]}`)
  }
  for (const prefix of allowed) {
    if (args.filter(arg => arg.startsWith(prefix)).length > 1) throw new Error(`Duplicate option: ${prefix}`)
  }
  const value = (key: string) => args.find(arg => arg.startsWith(`${key}=`))?.slice(key.length + 1)
  const path = resolve(value('--manifest') ?? 'data/outcomes-chile/official/ine-esi-2025-national.v1.json')
  const format = value('--format') ?? 'plan'
  if (format !== 'plan' && format !== 'sql') throw new Error('Choose --format=plan or --format=sql')
  const input: unknown = JSON.parse(readFileSync(path, 'utf8'))
  const manifest = parseOfficialChileBenchmarkManifest(input)
  const plan = prepareOfficialChileBenchmarkImport(manifest)
  const sourcesDir = value('--sources-dir')
  if (sourcesDir) {
    for (const document of manifest.documents) {
      verifyOfficialChileSourceBytes(document, readFileSync(resolve(sourcesDir, document.filename)))
    }
  }
  if (format === 'sql') {
    if (!sourcesDir) throw new Error('SQL preparation requires --sources-dir with all versioned official PDFs')
    const hash = value('--manifest-sha256')
    if (!hash) throw new Error('SQL preparation requires --manifest-sha256 from the reviewed plan')
    process.stdout.write(renderOfficialChileBenchmarkSql(manifest, hash))
  } else {
    console.log(JSON.stringify({ ...plan, originalSourceBytesVerified: Boolean(sourcesDir),
      sourceDocuments: manifest.documents.map(({ id, filename, sha256, byteLength }) => ({ id, filename, sha256, byteLength })),
      remoteWrites: 0,
    }, null, 2))
  }
}
