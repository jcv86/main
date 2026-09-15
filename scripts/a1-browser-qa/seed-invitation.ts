import assert from 'node:assert/strict'
import { createHash, randomBytes } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { Client } from 'pg'

async function main() {
  assert.equal(process.env.A1_BROWSER_LAB, 'yes', 'Only the disposable browser lab may run')

  const root = resolve(process.env.A1_LAB_ROOT!)
  const status = JSON.parse(readFileSync(join(root, 'status.json'), 'utf8'))
  const fixturesPath = join(root, 'fixtures.private.json')
  const fixtures = JSON.parse(readFileSync(fixturesPath, 'utf8'))
  const dbUrl = new URL(status.DB_URL)
  assert.ok(['127.0.0.1', 'localhost'].includes(dbUrl.hostname), 'Remote database forbidden')

  const db = new Client({ connectionString: status.DB_URL })
  await db.connect()
  try {
    const migration = readFileSync(
      join(process.cwd(), 'supabase/migrations/20260825010000_pilot_access_foundation.sql'),
      'utf8',
    )
    await db.query(migration)

    for (const user of fixtures.users) {
      await db.query(
        `insert into public.pilot_memberships (user_id, access_kind)
         values ($1, 'grandfathered')
         on conflict (user_id) do nothing`,
        [user.id],
      )
    }

    const invitationToken = randomBytes(32).toString('base64url')
    const tokenHash = createHash('sha256').update(invitationToken).digest('hex')
    console.log(`::add-mask::${invitationToken}`)

    await db.query(
      `insert into public.pilot_invitations (token_hash, status, expires_at)
       values ($1, 'issued', now() + interval '1 hour')`,
      [tokenHash],
    )

    writeFileSync(
      fixturesPath,
      JSON.stringify({ ...fixtures, invitationToken }),
      { mode: 0o600 },
    )

    console.log('Synthetic invitation seeded with production claim SQL in disposable local Supabase.')
  } finally {
    await db.end()
  }
}

main().catch((error) => {
  console.error('Invitation lab setup failed:', error instanceof Error ? error.message : 'unknown')
  process.exitCode = 1
})
